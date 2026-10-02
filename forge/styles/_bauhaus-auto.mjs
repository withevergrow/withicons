// BAUHAUS auto — the automatic composer for icons without a hand-composed redraw
// (and for every Live icon). The skeleton is rebuilt as flat geometric colour
// fields on a signed-distance grid (_bauhaus-field.mjs):
//   MASS    the object: fills plus its outline as round-capped bars (every corner
//           comes out rounded: radius-2 skeleton corners grow to ~3.25u)
//   PARTS   A-plate fills: the second primary, printed over the object
//   INLAY   enclosed openings (screens, windows, doors) inlaid in yellow
//   INK     interior detail and moving parts: round-capped black bars and dots
//   BADGE   S-plate badges: a disc in the contrasting primary with a cream glyph
// Colours come from a small fixed triad per icon (main / part / inlay), chosen
// deterministically, so a page of icons reads as one series of posters.
import { parsePath, area, pointInRing, distToPolyline, rng, V } from '../kernel/geom.mjs'
import * as F from './_bauhaus-field.mjs'
import { paint, compose } from './_bauhaus-compose.mjs'
import { autoTune, LIVE, LIVE_ONE, liveCtx } from './_bauhaus-tune.mjs'
import * as Prim from './_bauhaus-prim.mjs'
import * as Kit from './_bauhaus-kit.mjs'

const P = Object.freeze({ ...Prim, ...Kit })

export const K = {
  W: 2.5,          // object bars
  WI: 2,           // black detail bars
  WG: 2.5,         // bars of a pure line glyph (an arrow, a chevron)
  CUT: 1.5,        // open cutouts knock out a line this wide
  GAP_S: 1.2,      // moat around badges and modifiers
  DEEP: 1.35,      // a K centreline this deep inside the fill is interior detail
  INK_HOLE: 7,     // closed cutouts smaller than this (u^2) are printed in ink
  WT: 1.6,         // live-icon text set into a frame
  WT_S: 1.4,       // the same at the font's small size
  WT_LINE: 2.05,   // live icons without a frame: text and bars
  LO: 0.6,
  TOL: 0.03,
}
// colour triads: main field, parts, inlays (openings)
export const TRIADS = {
  c1: { main: 'c1', part: 'c3', inlay: 'c2', glyph: 'tint' },
  c3: { main: 'c3', part: 'c1', inlay: 'c2', glyph: 'tint' },
  c2: { main: 'c2', part: 'c1', inlay: 'c3', glyph: 'ink' },
}

const polyArea = r => Math.abs(area(r))
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
const at = (G, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  return (i < 0 || j < 0 || i >= F.N || j >= F.N) ? 9 : G[j * F.N + i]
}
const arclen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += V.dist(pts[i], pts[i - 1]); return L }
const densify = (pts, step = 0.15, closed = false) => {
  const P = closed ? [...pts, pts[0]] : pts, out = []
  for (let i = 0; i + 1 < P.length; i++) {
    const a = P[i], b = P[i + 1], n = Math.max(1, Math.ceil(V.dist(a, b) / step))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  if (!closed) out.push(P.at(-1))
  return out
}
function runs(pts, keep, minLen = 0.25) {
  const out = []; let cur = []
  for (const p of pts) { if (keep(p)) cur.push(p); else { if (cur.length > 1) out.push(cur); cur = [] } }
  if (cur.length > 1) out.push(cur)
  return out.filter(r => arclen(r) >= minLen)
}
// zero-length subpaths ("M12 16 L12 16") draw a dot; the parser drops them
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m || !/[LlHhVvCcSsQqTtAaZz]/.test(chunk)) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K' })
    }
  }
  return out
}
const subsOf = (d, fallback) => { try { return parsePath(d) } catch { return fallback || [] } }

function read(icon, T) {
  const lines = []
  const drop = new Set(T.drop || [])
  ;(icon.paths || []).forEach((p, pi) => {
    if (drop.has(pi)) return
    const role = T.bands ? T.bands[pi % T.bands.length] : null
    for (const s of subsOf(p.d, p.subs)) if (s.pts && s.pts.length) lines.push({ pts: s.pts, closed: !!s.closed, plate: p.plate || 'K', role, text: typeof p.id === 'string' && p.id.startsWith('text:') })
  })
  if (T.bands) return { lines, fills: [], cutouts: [] }
  lines.push(...dots(icon))
  const fills = (icon.fills || []).map(f => subsOf(f.d, f.subs).map(s => s.pts).filter(r => r.length > 2)).filter(r => r.length)
  const cutouts = (icon.cutouts || []).flatMap(c => {
    let subs = subsOf(c.d, c.subs)
    // live icons: a stroke-font letter that ends where it starts (D, O, 0) is a
    // line cutout, not an area; only an explicit Z closes a cutout
    if (icon.params && typeof c.d === 'string') {
      const z = c.d.split(/(?=[Mm])/).filter(ch => /[LlHhVvCcSsQqTtAa]/.test(ch)).map(ch => /[Zz]/.test(ch))
      if (z.length === subs.length) subs = subs.map((s, i) => s.closed && !z[i] ? { ...s, closed: false, pts: [...s.pts, s.pts[0]] } : s)
    }
    return subs
  }).filter(s => s.pts && s.pts.length)
  return { lines, fills, cutouts }
}

// the icon's colour triad: tuned, or drawn from its name (red and blue lead, yellow now and then)
export function triadOf(name, T = {}) {
  if (T.main && TRIADS[T.main]) return TRIADS[T.main]
  const r = rng(String(name).split('-')[0] + ':bauhaus-hue')()
  return TRIADS[r < 0.42 ? 'c1' : r < 0.84 ? 'c3' : 'c2']
}

// -------------------------------------------------------------------------------
export function build(icon) {
  const T = autoTune(icon.name)
  const live = !!icon.params
  const { lines, fills, cutouts } = read(icon, T)
  const base = lines.filter(l => l.plate !== 'S')
  const sig = lines.filter(l => l.plate === 'S')
  const tri = triadOf(icon.name, T)

  // --- S plate: badges (outermost closed rings), everything else a glyph
  const closedS = sig.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const badgeOf = g => badges.find(b => b !== g && fracInside(g.pts, b.pts) > 0.5)
  const glyphs = sig.filter(l => !badges.includes(l))
  const freeS = glyphs.filter(g => !badgeOf(g))
  const onBadge = rings => {
    const pts = rings.flat()
    return badges.some(b => pts.filter(p => distToPolyline(p, b.pts, true) < 0.6).length / pts.length > 0.6)
  }
  const baseFills = fills.filter(r => !onBadge(r))
  const hasFill = baseFills.length > 0
  const W = T.w || (live && !hasFill ? K.WT_LINE : hasFill ? K.W : K.WG)
  const WI = T.wi || (hasFill ? K.WI : W)

  // --- which fills belong to an A part (their outline follows an A centreline)
  const REACH = 3
  const aL = base.filter(l => l.plate === 'A' && l.pts.length > 1)
  const kL = base.filter(l => l.plate === 'K' && l.pts.length > 1)
  const nearAny = (p, ls) => ls.some(l => distToPolyline(p, l.pts, l.closed) < 0.5)
  const fillPlate = baseFills.map(rings => {
    if (!aL.length) return 'K'
    const pts = rings.flat().filter((_, i) => i % 3 === 0)
    const a = pts.filter(p => nearAny(p, aL)).length / pts.length
    const k = pts.filter(p => nearAny(p, kL)).length / pts.length
    return a > 0.6 && a > k ? 'A' : 'K'
  })
  const kFills = baseFills.filter((_, i) => fillPlate[i] === 'K')
  const aFills = baseFills.filter((_, i) => fillPlate[i] === 'A')
  const allFill = F.field(REACH)
  for (const rings of baseFills) F.region(rings, REACH, allFill)
  const aEdge = aFills.length ? F.field(REACH) : null
  for (const rings of aFills) F.region(rings, REACH, aEdge)

  // --- classify centrelines: outlines -> colour bars, interior detail / parts -> black bars
  const massLines = [], partLines = [], inkLines = []
  for (const l of base) {
    if (l.role) { (l.role === 'ink' ? inkLines : l.role === 'part' ? partLines : massLines).push(l); continue }
    if (!hasFill) {
      // a pure line glyph: its main strokes in the main colour, secondary strokes black
      if (live && l.text) inkLines.push(l)
      else (l.plate === 'A' ? inkLines : massLines).push(l)
      continue
    }
    if (l.pts.length === 1) { inkLines.push(l); continue }
    const d = densify(l.pts, 0.15, l.closed)
    if (l.plate !== 'K') {
      if (aEdge && d.filter(p => Math.abs(at(aEdge, p)) < 0.5).length / d.length > 0.6) partLines.push(l)
      else inkLines.push(l)
      continue
    }
    const deep = p => at(allFill, p) < -K.DEEP
    const nDeep = d.filter(deep).length
    if (nDeep === 0) { massLines.push(l); continue }
    if (nDeep === d.length && l.closed) { inkLines.push(l); continue }
    for (const r of runs(d, deep)) inkLines.push({ pts: r, closed: false, plate: 'K', inner: true })
    for (const r of runs(d, p => !deep(p))) massLines.push({ pts: r, closed: false, plate: 'K' })
  }

  // --- MASS (K) and PARTS (A fills)
  const mass = F.field(K.LO)
  for (const rings of kFills) F.region(rings, K.LO, mass)
  if (massLines.length) F.strokes(massLines, W, K.LO, mass)
  let part = null
  if (aFills.length || partLines.length) {
    part = F.field(K.LO)
    for (const rings of aFills) F.region(rings, K.LO, part)
    if (partLines.length) F.strokes(partLines, W, K.LO, part)
  }
  const massPre = F.copy(mass)
  if (part) F.union(massPre, part)
  const pockets = hasFill ? pocketsOf(massPre, baseFills) : null

  // --- hollow rings (lenses): the inside of a round outline becomes an opening
  const hollow = []
  if (T.hollow) for (const l of kL) if (l.closed && polyArea(l.pts) > 8) hollow.push(l.pts)

  // --- cutouts: small holes inked, separations knocked out, big openings inlaid
  const cutArea = [], cutLine = [], holes = []
  const inkNear = inkLines.length ? F.strokes(inkLines, 0.01, 1.0) : null
  for (const s of cutouts) {
    if (s.closed && s.pts.length > 2) { (polyArea(s.pts) < K.INK_HOLE ? holes : cutArea).push(s.pts); continue }
    const onInk = inkNear ? s.pts.filter(p => at(inkNear, p) < 0.3).length / s.pts.length : 0
    if (onInk > 0.5) continue
    const edge = p => at(allFill, p) > -1.6
    if (edge(s.pts[0]) && edge(s.pts.at(-1))) cutLine.push({ pts: s.pts, closed: false })
  }
  let inlay = pockets
  if (cutArea.length || hollow.length) {
    const ca = F.region(cutArea, K.LO)
    if (hollow.length) {
      const h = F.region(hollow, W / 2 + 1)
      F.offset(h, W / 2)
      F.union(ca, h)
    }
    F.subtract(mass, ca)
    if (part) F.subtract(part, ca)
    const ci = F.intersect(F.copy(ca), massPre)
    inlay = inlay ? F.union(inlay, ci) : ci
  }
  if (holes.length) { const h = F.region(holes, K.LO); F.subtract(mass, h); if (part) F.subtract(part, h) }
  if (cutLine.length) { const c = F.strokes(cutLine, K.CUT, K.LO); F.subtract(mass, c); if (part) F.subtract(part, c); if (inlay) F.subtract(inlay, c) }

  // --- INK (live text prints lighter so its counters stay open)
  // stroke-font text is tagged by the Live font (path ids 'text:<char>:<cap>:<n>')
  const textLines = live ? inkLines.filter(l => l.text) : []
  const textSet = new Set(textLines)
  const ink = F.field(K.LO)
  const plainInk = inkLines.filter(l => !textSet.has(l))
  if (plainInk.length) F.strokes(plainInk, WI, K.LO, ink)
  const tall = l => { let a = Infinity, b = -Infinity; for (const p of l.pts) { a = Math.min(a, p[1]); b = Math.max(b, p[1]) } return b - a }
  const capH = textLines.length ? Math.max(...textLines.map(tall)) : 0
  const text = textLines.length ? F.strokes(textLines, !hasFill ? K.WT_LINE : capH < 5.25 ? K.WT_S : K.WT, K.LO) : null
  if (text) F.union(ink, text)
  if (holes.length) { const h = F.region(holes, K.LO); F.intersect(h, massPre); F.union(ink, h) }

  // --- S overlays: clear a moat, lay discs and modifiers on top
  let badge = null, paper = null
  const moat = (badges.length || freeS.length) ? F.field(K.LO) : null
  if (moat) {
    for (const b of badges) { F.region([b.pts], K.LO, moat); F.strokes([b], W + 2 * K.GAP_S, K.LO, moat) }
    if (freeS.length) F.strokes(freeS, WI + 2 * K.GAP_S, K.LO, moat)
    F.subtract(mass, moat); F.subtract(ink, moat)
    if (text) F.subtract(text, moat)
    if (part) F.subtract(part, moat)
    if (inlay) F.subtract(inlay, moat)
  }
  if (badges.length) {
    badge = F.field(K.LO)
    for (const b of badges) { F.region([b.pts], K.LO, badge); F.strokes([b], W, K.LO, badge) }
    const inner = glyphs.filter(g => badgeOf(g))
    if (inner.length) {
      paper = F.strokes(inner, WI * 0.9, K.LO)
      F.intersect(paper, F.offset(F.copy(badge), 0.35))
    }
  }
  const sInk = freeS.length ? F.strokes(freeS, WI, K.LO) : null

  // BAND: a frame holding text in rows (calendars, clocks) prints its top row on
  // a band of the second primary, split off along the gap between the rows
  let band = null
  if (T.band && textLines.length) {
    const rows = []
    for (const l of textLines) {
      let a = Infinity, b = -Infinity
      for (const p of l.pts) { a = Math.min(a, p[1]); b = Math.max(b, p[1]) }
      const r = rows.find(q => a < q[1] - 0.5 && b > q[0] + 0.5)
      if (r) { r[0] = Math.min(r[0], a); r[1] = Math.max(r[1], b) } else rows.push([a, b])
    }
    rows.sort((p, q) => p[0] - q[0])
    const yb = rows.length > 1 ? (rows[0][1] + rows[1][0]) / 2 : rows[0][1] + 1.5
    band = F.clipBand(F.copy(mass), -1, yb)
    if (F.extent(band, 0.05).area < 4) band = null
  }
  // FACE: a dial (clock, watch, gauge) gets a cream face inset in its rim
  let face = null
  if (T.face && !text) {
    // the rim is ~2.5u: the fill (outline centreline) inset by what the bar adds outside it
    face = F.field(3.5)
    for (const rings of kFills) F.region(rings, 3.5, face)
    F.offset(face, (T.face === true ? 2.5 : T.face) - W / 2)
    F.intersect(face, mass)
    if (inlay) F.subtract(face, inlay)
    if (F.extent(face, 0.05).area < 12) face = null
  }

  // live text over a dark field (blue, red) prints in cream
  let textPaper = null
  if (text && tri.glyph === 'tint') {
    const dark = F.copy(mass)
    if (part) F.union(dark, part)
    if (face) F.subtract(dark, face)
    const on = F.intersect(F.copy(text), dark)
    if (F.extent(on, 0.05).area > 0.1) { F.subtract(ink, on); textPaper = on }
  }
  if (T.clear) { const c = F.region(parsePath(T.clear).map(q => q.pts), K.LO); for (const G of [mass, ink, part, inlay]) if (G) F.subtract(G, c) }

  const roles = { mass: tri.main, part: T.part || tri.part, inlay: T.inlay || tri.inlay, badge: tri.main === 'c1' ? 'c3' : 'c1', s: tri.main === 'c1' ? 'c3' : 'c1' }
  // black geometry printed on a colour field stays black in dark mode (shadow);
  // on the page it follows currentColor (ink)
  let inkOn = null
  {
    const fields = F.copy(mass)
    for (const G of [part, inlay, badge, face]) if (G) F.union(fields, G)
    inkOn = F.intersect(F.copy(ink), fields)
    if (F.extent(inkOn, 0.05).area > 0.05) F.subtract(ink, inkOn)
    else inkOn = null
  }
  return { mass, part, inlay, ink, inkOn, band, face, badge, paper, textPaper, sInk, roles, tri, hasFill }
}

// enclosed openings of the mass (not touching the border, 3-40 u^2) that lie
// outside every fill's outer ring, as an exact field
function pocketsOf(Mf, fills) {
  const neg = F.copy(Mf)
  for (let k = 0; k < neg.length; k++) neg[k] = -neg[k]
  const outers = fills.map(rings => rings.reduce((a, r) => polyArea(r) > polyArea(a) ? r : a, rings[0]))
  let G = null
  for (const c of F.components(neg, true)) {
    if (c.y0 <= 0 || c.x0 <= 0 || c.y1 >= 24 - F.H / 2 || c.x1 >= 24 - F.H / 2) continue
    if (c.area < 3 || c.area > 40) continue
    const step = Math.max(1, Math.floor(c.cells.length / 9))
    let inside = 0, tot = 0
    for (let k = 0; k < c.cells.length; k += step) {
      const q = c.cells[k], p = [(q % F.N) * F.H, Math.floor(q / F.N) * F.H]
      tot++; if (outers.some(r => pointInRing(p, r))) inside++
    }
    if (inside > tot / 2) continue
    if (!G) { G = F.copy(Mf); for (let k = 0; k < G.length; k++) G[k] = Math.abs(G[k]) + 1e-3 }
    for (const q of c.cells) G[q] = -Math.abs(Mf[q])
  }
  return G
}

// -------------------------------------------------------------------------------
// output: compact relative path data
const num = (v, dp) => {
  let s = (v / 10 ** dp).toFixed(dp)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
const join = arr => arr.reduce((acc, s) => acc + (acc && !s.startsWith('-') && !/[a-z]$/i.test(acc) ? ' ' : '') + s, '')
export function loopsD(loops, dp = 2) {
  const k = 10 ** dp
  let d = ''
  for (const ring of loops) {
    const P = ring.map(p => [Math.round(p[0] * k), Math.round(p[1] * k)])
    const Q = P.filter((p, i) => i === 0 || p[0] !== P[i - 1][0] || p[1] !== P[i - 1][1])
    if (Q.length > 1 && Q[0][0] === Q.at(-1)[0] && Q[0][1] === Q.at(-1)[1]) Q.pop()
    if (Q.length < 3) continue
    let s = 'M' + join([num(Q[0][0], dp), num(Q[0][1], dp)])
    let last = 'M'
    for (let i = 1; i < Q.length; i++) {
      const dx = Q[i][0] - Q[i - 1][0], dy = Q[i][1] - Q[i - 1][1]
      let cmd, nums
      if (dy === 0) { cmd = 'h'; nums = [num(dx, dp)] }
      else if (dx === 0) { cmd = 'v'; nums = [num(dy, dp)] }
      else { cmd = 'l'; nums = [num(dx, dp), num(dy, dp)] }
      if (cmd === last) s += (nums[0].startsWith('-') ? '' : ' ') + join(nums)
      else s += cmd + join(nums)
      last = cmd
    }
    d += s + 'z'
  }
  return d
}

// Motion parts (forge/MOTION.md, Parts choreography): the object's fields (mass, band, face,
// inlay) are wm-k, A-plate fills wm-a, S badges and their glyphs wm-s, tagged only when the
// icon has an A or S field. Black detail and live text mix plates in one field: untagged.
export function auto(icon) {
  if (icon && icon.params && LIVE[icon.name]) {
    try {
      const layers = LIVE[icon.name](P, icon, liveCtx(icon))
      if (layers && layers.length) {
        const nodes = compose(layers, icon)
        if (LIVE_ONE.has(icon.name)) for (const n of nodes) delete n[1].class
        if (nodes.length) return nodes
      }
    } catch { /* fall back to the field composer */ }
  }
  const B = build(icon)
  const nodes = []
  const multi = !!(B.part || B.badge || B.sInk)
  const add = (Fd, role, min = 0.2, cls = null) => {
    if (!Fd) return
    const d = loopsD(F.trace(Fd, K.TOL, min), 2)
    if (!d) return
    const a = { d, fill: paint(role), 'fill-rule': 'evenodd' }
    if (cls && multi) a.class = cls
    nodes.push(['path', a])
  }
  add(B.mass, B.roles.mass, 0.2, 'wm-k')
  add(B.band, B.roles.part, 0.2, 'wm-k')
  add(B.face, 'tint', 0.2, 'wm-k')
  add(B.part, B.roles.part, 0.2, 'wm-a')
  add(B.inlay, B.roles.inlay, 0.25, 'wm-k')
  add(B.badge, B.roles.badge, 0.2, 'wm-s')
  add(B.ink, 'ink', 0.1)
  add(B.inkOn, 'shadow', 0.1)
  add(B.sInk, B.roles.s, 0.1, 'wm-s')
  add(B.paper, 'tint', 0.1, 'wm-s')
  add(B.textPaper, 'tint', 0.1)
  return nodes
}

// prime the field engine once at load, so the first real render is not paying
// for the JIT (deterministic: nothing is cached, nothing leaks into output)
try {
  auto({
    name: 'bauhaus-warmup', params: { n: 1 },
    paths: [{ d: 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z', plate: 'K' }, { d: 'M8 8 L12 12 L16 9', plate: 'A' }, { d: 'M9 15 H15', plate: 'A', id: 'text:-:4:2' }, { d: 'M21.5 6 A3.5 3.5 0 1 1 14.5 6 A3.5 3.5 0 1 1 21.5 6 Z', plate: 'S' }],
    fills: [{ d: 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z' }],
    cutouts: [{ d: 'M9 15 H15' }],
  })
} catch { /* never fatal */ }
