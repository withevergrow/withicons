// with icons — raster QUALITY GATE for Live icons (forge/DYNAMIC.md "Quality gate"). Pure analysis helpers shared
// by forge/tools/livegate-worker.mjs and forge/tools/check-dynamic.mjs --gate.
//
// Every render is rasterised with resvg (CSS vars resolved to their fallbacks, currentColor = the theme ink) at
// 96px (4 px per grid unit) for geometry and at 24px for legibility, then compared with the LINE style render of the
// same skeleton (the reference drawing: thin, faithful to the centrelines).
//
//   gateSet(gen)                   the stress set: default, examples, boundaries of every param, enum x widest values
//   raster(style, nodes, px, theme)-> { w, a (alpha 0..1), l (luminance on the theme background 0..1) }
//   analyse(...)                   the metrics (see METRICS below); thresholds live in livegate-thresholds.json
//
// METRICS (u = grid unit, 1/24 of the icon; areas in u²)
//   ink        silhouette area (alpha > .5)                              empty when < 2
//   clip       length of ink on the canvas border (u)                    the drawing is cut by the 24 box
//   specks     silhouette components < 0.5 u²                            crumbs left by boolean ops / pixel snapping
//   stray      specks (any size < 0.5u²) that are > 1.5u from the reference drawing
//   splits     reference components (a continuous stroke/part in LINE) that the style draws as >= 2 separate pieces
//   missing    reference components the style does not draw (no ink within 1u of > 50% of it)
//   textC24    text contrast at 24px: p90 |lum(with text) - lum(text removed)| (light and dark)
//   textE      text ink energy vs line (u², ratio)                       text drawn too faint / too heavy
//   counters   enclosed counters of the text (0 8 A B D O P Q R 4 6 9 % @ ...) vs line: closed counters = blobs
//   valueC24   contrast at 24px of a VALUE change (base vs one param changed), light + dark
//   valueE     energy of that change vs line                            the style hides or smears the dynamic value
//   dynCov     coverage of the dynamic parts (hands, fills, pips, stars, bars) vs line, and their piece count
//   gapText    (generator, line) ink gap between text and the rest of the drawing (u)
//   level      (generator, line) a level param fills monotonically and proportionally
import { Resvg } from '@resvg/resvg-js'
import { nodesToMarkup, attrs, resolveVars } from '../lib/load.mjs'
import { resolveParams, drawnText, buildSkeleton } from './lib-dynamic.mjs'
import { parsePath } from '../kernel/geom.mjs'

export const S = 96, U = 4
export const THEMES = {
  light: { fg: '#15140f', bg: [251, 250, 247] },
  dark: { fg: '#f3f0e8', bg: [19, 18, 16] },
}

// ── the stress set ───────────────────────────────────────────────────────────────────────────────────────
const COUNTS = [0, 1, 9, 10, 99, 100, 999, 1000, 9999]
const NEG = [-1, -9, -10, -99]
const LEVELS = [0, 0.05, 0.5, 0.95, 1]
const TIMES = ['00:00', '03:15', '09:41', '12:00', '23:59']
const texts = n => ['', 'I', 'A', 'W', 'W'.repeat(n), 'M'.repeat(n), '8'.repeat(n), '0'.repeat(n), 'OK'.slice(0, n), 'NEW'.slice(0, n), '-50%'.slice(0, n), '#&?$'.slice(0, n)]
export function valuesFor(s) {
  switch (s.type) {
    case 'int': case 'number': {
      const vs = [s.min, s.max, ...COUNTS, ...NEG].filter(v => v >= s.min && v <= s.max)
      if (s.type === 'number') vs.push(+((s.min + s.max) / 2).toFixed(2), s.min + (s.step || 1))
      else vs.push(Math.round((s.min + s.max) / 2))
      return [...new Set(vs)]
    }
    case 'level': return LEVELS
    case 'time': return TIMES
    case 'enum': return [...(s.options || [])]
    case 'bool': return [true, false]
    case 'text': return texts(s.maxLength || 4)
    default: return []
  }
}
// the widest value of a value param (longest when written)
function widest(s) {
  if (s.type === 'int' || s.type === 'number') return String(s.min).length > String(s.max).length ? s.min : s.max
  if (s.type === 'text') return 'W'.repeat(s.maxLength || 4)
  if (s.type === 'level') return 1
  if (s.type === 'time') return '23:59'
  return undefined
}
export const isValueType = t => ['int', 'number', 'level', 'time', 'text'].includes(t)

// [{ label, p, vary?: param, base?: index of the set it varies from }]
export function gateSet(gen) {
  const base = resolveParams(gen, {})
  const out = [{ label: 'default', p: base }]
  ;(gen.examples || []).forEach((e, i) => out.push({ label: `ex${i}`, p: resolveParams(gen, e) }))
  for (const [k, s] of Object.entries(gen.params || {})) {
    for (const v of valuesFor(s)) out.push({ label: `${k}=${JSON.stringify(v)}`, p: resolveParams(gen, { ...base, [k]: v }), vary: k, base: 0 })
  }
  // every enum option with every value param at its widest (and at its lowest), e.g. weather "storm" at -99°C
  const vals = Object.entries(gen.params || {}).filter(([, s]) => isValueType(s.type))
  const enums = Object.entries(gen.params || {}).filter(([, s]) => s.type === 'enum')
  if (vals.length) {
    const hi = Object.fromEntries(vals.map(([k, s]) => [k, widest(s)]))
    const lo = Object.fromEntries(vals.map(([k, s]) => [k, s.type === 'level' ? 0 : s.type === 'text' ? 'I' : s.type === 'time' ? '00:00' : s.min]))
    out.push({ label: 'widest', p: resolveParams(gen, { ...base, ...hi }) }, { label: 'lowest', p: resolveParams(gen, { ...base, ...lo }) })
    for (const [k, s] of enums) for (const o of s.options) out.push({ label: `${k}=${o} widest`, p: resolveParams(gen, { ...base, ...hi, [k]: o }) })
  }
  const seen = new Map(), res = []
  // two param sets that build the same drawing (count 1000 and 9999 both draw 99+) are measured once
  const geo = p => { try { const sk = buildSkeleton(gen, p); return JSON.stringify([sk.paths.map(x => [x.d, x.plate, isText(x)]), sk.fills, sk.cutouts]) } catch { return JSON.stringify(p) } }
  for (const s of out) {
    const j = geo(s.p)
    if (seen.has(j)) continue
    seen.set(j, res.length)
    res.push(s)
  }
  // a varied set's base is the default (index 0), which is always first
  return res
}

// ── rasterising ──────────────────────────────────────────────────────────────────────────────────────────
export function svgOf(style, nodes, px, theme = 'light') {
  const root = { ...(style.root || {}) }; delete root.width; delete root.height
  const fg = THEMES[theme].fg
  return resolveVars(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24"${attrs(root)} color="${fg}">${nodesToMarkup(nodes)}</svg>`).replaceAll('currentColor', fg)
}
export function raster(style, nodes, px = S, theme = 'light') {
  const r = new Resvg(svgOf(style, nodes, px, theme), { font: { loadSystemFonts: false } }).render()
  const p = r.pixels, n = px * px, a = new Float32Array(n), l = new Float32Array(n)
  const [br, bg, bb] = THEMES[theme].bg
  for (let i = 0; i < n; i++) {
    const al = p[i * 4 + 3] / 255
    const R = p[i * 4] + br * (1 - al), G = p[i * 4 + 1] + bg * (1 - al), B = p[i * 4 + 2] + bb * (1 - al)
    a[i] = al; l[i] = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255
  }
  return { w: px, a, l }
}

// ── masks ────────────────────────────────────────────────────────────────────────────────────────────────
export const mask = (arr, t) => { const m = new Uint8Array(arr.length); for (let i = 0; i < arr.length; i++) m[i] = arr[i] > t ? 1 : 0; return m }
export const count = m => { let c = 0; for (let i = 0; i < m.length; i++) c += m[i]; return c }
export function dilate(m, w, r) {
  if (r <= 0) return m
  const h = m.length / w, t = new Uint8Array(m.length), o = new Uint8Array(m.length)
  for (let y = 0; y < h; y++) {
    let last = -1e9
    for (let x = 0; x < w; x++) { if (m[y * w + x]) last = x; if (x - last <= r) t[y * w + x] = 1 }
    last = 1e9
    for (let x = w - 1; x >= 0; x--) { if (m[y * w + x]) last = x; if (last - x <= r) t[y * w + x] = 1 }
  }
  for (let x = 0; x < w; x++) {
    let last = -1e9
    for (let y = 0; y < h; y++) { if (t[y * w + x]) last = y; if (y - last <= r) o[y * w + x] = 1 }
    last = 1e9
    for (let y = h - 1; y >= 0; y--) { if (t[y * w + x]) last = y; if (last - y <= r) o[y * w + x] = 1 }
  }
  return o
}
// connected components (8-connected for ink, 4 for background). -> { lab: Int32Array (0 = none), comps: [{ area, x0, y0, x1, y1, border }] }
export function components(m, w, conn = 8) {
  const n = m.length, h = n / w, lab = new Int32Array(n), comps = [], stack = new Int32Array(n)
  const nb = conn === 8 ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]] : [[0, -1], [-1, 0], [1, 0], [0, 1]]
  for (let i = 0; i < n; i++) {
    if (!m[i] || lab[i]) continue
    const id = comps.length + 1, c = { area: 0, x0: w, y0: h, x1: 0, y1: 0, border: false }
    let sp = 0; stack[sp++] = i; lab[i] = id
    while (sp) {
      const j = stack[--sp], x = j % w, y = (j - x) / w
      c.area++; if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x; if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) c.border = true
      for (const [dx, dy] of nb) {
        const X = x + dx, Y = y + dy
        if (X < 0 || Y < 0 || X >= w || Y >= h) continue
        const k = Y * w + X
        if (m[k] && !lab[k]) { lab[k] = id; stack[sp++] = k }
      }
    }
    comps.push(c)
  }
  return { lab, comps }
}
export function fillHoles(m, w) {
  const inv = new Uint8Array(m.length); for (let i = 0; i < m.length; i++) inv[i] = m[i] ? 0 : 1
  const { lab, comps } = components(inv, w, 4), o = Uint8Array.from(m)
  for (let i = 0; i < m.length; i++) if (lab[i] && !comps[lab[i] - 1].border) o[i] = 1
  return o
}
// enclosed background regions (counters / holes) of a mask with area >= minArea px
export function holes(m, w, minArea = 3) {
  const inv = new Uint8Array(m.length); for (let i = 0; i < m.length; i++) inv[i] = m[i] ? 0 : 1
  return components(inv, w, 4).comps.filter(c => !c.border && c.area >= minArea).length
}
export const absDiff = (a, b) => { const d = new Float32Array(a.length); for (let i = 0; i < a.length; i++) d[i] = Math.abs(a[i] - b[i]); return d }
export const sum = arr => { let s = 0; for (let i = 0; i < arr.length; i++) s += arr[i]; return s }
// contrast of a change: the p90 of |delta| over the pixels that changed (> .03); 0 when < 3 px changed
export function changeContrast(d) {
  const v = []; for (let i = 0; i < d.length; i++) if (d[i] > 0.03) v.push(d[i])
  if (v.length < 3) return 0
  v.sort((x, y) => x - y)
  return v[Math.floor(v.length * 0.9)]
}
const bboxU = c => [c.x0, c.y0, c.x1 + 1, c.y1 + 1].map(v => +(v / U).toFixed(1))

// ── skeleton surgery ─────────────────────────────────────────────────────────────────────────────────────
export const isText = p => typeof p.id === 'string' && p.id.startsWith('text:')
// a cutout is a glyph knock-out when EVERY one of its subpaths lies on the text centrelines (within GLYPH_TOL u). Matched
// on geometry, not on path strings: asCutouts() splits rings and stadiums (0 O D 8 ...) at other points than the
// glyph drawing, so a string match would leave those letters knocked out of a "without text" render.
const GLYPH_TOL = 0.3
const densify = (d, step = 0.2) => {
  const out = []
  for (const sub of parsePath(String(d), 0.1)) {
    const pts = sub.pts
    if (pts.length === 1) out.push(pts[0])
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step))
      for (let j = 0; j <= n; j++) out.push([ax + (bx - ax) * j / n, ay + (by - ay) * j / n])
    }
  }
  return out
}
function glyphCutoutTest(sk) {
  const text = sk.paths.filter(isText)
  if (!text.length) return () => false
  const grid = new Map(), key = (x, y) => Math.floor(x) + ',' + Math.floor(y)
  for (const p of text) for (const q of densify(p.d, 0.1)) { const k = key(q[0], q[1]); (grid.get(k) || grid.set(k, []).get(k)).push(q) }
  const near = ([x, y]) => {
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++)
      for (const [qx, qy] of grid.get(key(x + i, y + j)) || []) if (Math.hypot(qx - x, qy - y) <= GLYPH_TOL) return true
    return false
  }
  return c => { const pts = densify(c); return pts.length > 0 && pts.every(near) }
}
export function withoutText(sk) {
  const isGlyph = glyphCutoutTest(sk)
  return { ...sk, paths: sk.paths.filter(p => !isText(p)), cutouts: sk.cutouts.filter(c => !isGlyph(c)) }
}
export const textOnly = sk => ({ ...sk, paths: sk.paths.filter(isText), fills: [], cutouts: [] })
export const nonTextOnly = sk => ({ ...withoutText(sk), fills: [], cutouts: [] })
// the elements of `sk` that are not in `other` (non-text): the parts a value change moves / adds
export function dynamicParts(sk, other) {
  const od = new Set(other.paths.filter(p => !isText(p)).map(p => p.d)), of = new Set(other.fills), oc = new Set(other.cutouts)
  const isGlyph = glyphCutoutTest(sk)
  const paths = sk.paths.filter(p => !isText(p) && !od.has(p.d))
  const fills = sk.fills.filter(f => !of.has(f))
  const cutouts = sk.cutouts.filter(c => !oc.has(c) && !isGlyph(c))
  return { paths, fills, cutouts, n: paths.length + fills.length + cutouts.length }
}
export function removeParts(sk, parts) {
  const P = new Set(parts.paths), F = new Set(parts.fills), C = new Set(parts.cutouts)
  return { ...sk, paths: sk.paths.filter(p => !P.has(p)), fills: sk.fills.filter(f => !F.has(f)), cutouts: sk.cutouts.filter(c => !C.has(c)) }
}
export const onlyParts = (sk, parts) => ({ ...sk, paths: parts.paths, fills: [], cutouts: [] })

// ── per-render geometry metrics (style render vs line reference) ──────────────────────────────────────────
// ref = { ink, inkNear (ink dilated 1.5u), comps: [{ area, px: Int32Array of pixel indices, box }] } from refGeometry()
export function refGeometry(lineR, textMask) {
  const ink = mask(lineR.a, 0.5), { lab, comps } = components(ink, lineR.w)
  const px = comps.map(() => [])
  for (let i = 0; i < lab.length; i++) if (lab[i]) px[lab[i] - 1].push(i)
  const isTextComp = k => { if (!textMask) return false; let t = 0; for (const i of px[k]) t += textMask[i]; return t >= 0.6 * px[k].length }
  return { ink, inkNear: dilate(ink, lineR.w, 6), comps: comps.map((c, k) => ({ ...c, px: px[k], box: bboxU(c), text: isTextComp(k) })) }
}
export function geometry(r, ref) {
  const w = r.w, ink = mask(r.a, 0.5), { lab, comps } = components(ink, w)
  const out = { ink: +(count(ink) / (U * U)).toFixed(2) }
  // clip: ink on the outermost pixel ring
  let edge = 0
  for (let i = 0; i < w; i++) for (const j of [i, (w - 1) * w + i, i * w, i * w + w - 1]) if (r.a[j] > 0.35) edge++
  out.clip = +(edge / U).toFixed(2)
  // specks + stray
  const specks = comps.map((c, k) => ({ c, k })).filter(({ c }) => c.area < 8)
  out.specks = specks.length
  out.stray = 0; out.strayAt = []
  for (const { c, k } of specks) {
    let near = false
    for (let y = c.y0; y <= c.y1 && !near; y++) for (let x = c.x0; x <= c.x1; x++) if (lab[y * w + x] === k + 1 && ref.inkNear[y * w + x]) { near = true; break }
    if (!near) { out.stray++; if (out.strayAt.length < 4) out.strayAt.push(bboxU(c)) }
  }
  // splits + missing, per reference component
  const near1 = dilate(ink, w, U)
  out.splits = 0; out.splitAt = []; out.missing = 0; out.missingAt = []
  for (const L of ref.comps) {
    if (L.area < 24) continue
    if (L.text) continue // glyphs: textSplits() / text metrics (a style may re-set text in its own font)
    const hits = new Map(); let covered = 0
    for (const i of L.px) { const k = lab[i]; if (k) hits.set(k, (hits.get(k) || 0) + 1); if (near1[i]) covered++ }
    const sig = [...hits.values()].filter(v => v >= Math.max(6, 0.04 * L.area)).length
    if (sig > 1) { out.splits++; if (out.splitAt.length < 4) out.splitAt.push(L.box) }
    if (L.area >= 48 && covered < 0.5 * L.area) { out.missing++; if (out.missingAt.length < 4) out.missingAt.push(L.box) }
  }
  return out
}

// a glyph (a reference TEXT component) drawn in >= 2 pieces: measured on the text change mask, so a knocked-out
// glyph (a groove in a mass) counts as drawn, and the islands inside its counters do not count as pieces
export function textSplits(d96, ref) {
  const { lab, comps } = components(fillHoles(dilate(mask(d96, Math.max(0.12, 0.4 * changeContrast(d96))), S, 2), S), S) // closed by 0.5u (hatching / grain inside a groove is not a break) and filled: an outlined (bubble) glyph is one piece, not outer + inner contour
  const out = { n: 0, at: [] }
  for (const L of ref.comps) {
    if (!L.text || L.area < 24) continue
    const hits = new Map()
    for (const i of L.px) { const k = lab[i]; if (k) hits.set(k, (hits.get(k) || 0) + 1) }
    if ([...hits.values()].filter(v => v >= Math.max(6, 0.06 * L.area)).length < 2) continue
    // a piece belongs to this glyph when most of it lies within 1u of it (a style that re-sets text in its own font
    // shifts glyphs: a neighbour's edge overlapping this glyph's box is not a break)
    const lm = new Uint8Array(S * S); for (const i of L.px) lm[i] = 1
    const near = dilate(lm, S, U), inside = new Map()
    for (let i = 0; i < lab.length; i++) if (lab[i] && hits.has(lab[i]) && near[i]) inside.set(lab[i], (inside.get(lab[i]) || 0) + 1)
    const own = [...hits.entries()].filter(([k, v]) => v >= Math.max(6, 0.06 * L.area) && (inside.get(k) || 0) >= 0.6 * comps[k - 1].area)
    if (own.length > 1) { out.n++; if (out.at.length < 4) out.at.push(L.box) }
  }
  return out
}
// share of the reference glyph ink (line, text only) that has a text change within 1u in the style: text drawn
// where it belongs (a style may re-set it in its own font, so 1u of slack); ~0 = the text is not drawn at all
export function textCoverage(d96, tMask) {
  if (!tMask) return 1
  const near = dilate(mask(d96, Math.max(0.12, 0.4 * changeContrast(d96))), S, U)
  let n = 0, c = 0
  for (let i = 0; i < tMask.length; i++) if (tMask[i]) { n++; if (near[i]) c++ }
  return n ? +(c / n).toFixed(3) : 1
}
// text area: pixels a change touches (> .12), u²
export const changeArea = d96 => count(mask(d96, 0.12)) / (U * U)

// text / value change metrics between two renders of the same style (with vs without, or base vs varied)
export function change(r96a, r96b, l24a, l24b, d24a, d24b) {
  const d96 = absDiff(r96a.l, r96b.l)
  return {
    energy: sum(d96) / (U * U),
    c24: changeContrast(absDiff(l24a.l, l24b.l)),
    c24d: changeContrast(absDiff(d24a.l, d24b.l)),
    d96,
  }
}
// counters of a text change mask (the glyph strokes = pixels that changed by > .35)
export const counters = d96 => holes(mask(d96, 0.35), S, 10) // >= 0.6u²: letter counters, not the pin-hole of a degree sign
// pieces (>= 1u²) and coverage of a dynamic-part change mask vs the reference's
export function dynMatch(dStyle, dLine) {
  const ms = mask(dStyle, 0.25), ml = mask(dLine, 0.25)
  const nl = count(ml)
  if (nl < 16) return null
  const near = dilate(ms, S, U)
  let cov = 0; for (let i = 0; i < ml.length; i++) if (ml[i] && near[i]) cov++
  const pieces = m => components(m, S).comps.filter(c => c.area >= 16).length
  return { cov: +(cov / nl).toFixed(3), pieces: pieces(ms), refPieces: pieces(ml) }
}
export { drawnText }
