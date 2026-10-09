// ENGRAVE — creative. Intaglio: crisp contour + shade-side swell + swelling burin hatch.
import { snowmanFor } from './_line-snowman.mjs'
import { pointInRing, simplify, resample } from '../kernel/geom.mjs'
import { merge, subtract, ringsT, capsulesT, segsOf, ringD } from './_engrave-core.mjs'
import { shadeCrescents } from './_engrave-shade.mjs'

const H = Math.SQRT1_2
export const DEFAULTS = {
  SW: 1.3,            // contour stroke (lit side)
  SWELL: 0.5,         // silhouette swell: sweep along (δ,δ)
  GAP: 0.42,          // white between contour and hatch
  PITCH: 1.25,        // body hatch pitch
  W_MAX: 0.86,        // widest swell of a hatch line
  U0: 0.06,           // tone below this -> line breaks (highlight)
  GAMMA: 1.15,
  FORM: 0,            // 0 = flat diagonal ramp; >0 = tone also hugs the silhouette (rounded, sculpted)
  FORM_R: 3.2,        // reach of the silhouette modelling, in units
  BODY_ANGLE: 45,     // degrees, direction of body hatch (45 = "\")
  CROSS: 0.55,        // tone above which a cross hatch appears (0 = off)
  CROSS_ANGLE: -20,
  CROSS_W: 0.5,
  SHADOW: 'band',     // 'band' | 'none' | 'auto' (band only for glyphs without mass)
  SHADOW_ANGLE: 45,   // cast-shadow hatch runs with the light: crosses every lit-facing edge
  OFF: 1.5,           // depth of the hatched cast shade
  S_GAP: 0.05,        // attached to the swell: reads as one engraved shadow
  S_PITCH: 0.85,
  S_W: 0.3,
  S_MIN: 0.3,         // shortest cast-shade cut (live icons: P.LIVE_S_MIN, a lone short cut reads as a crumb)
  LIVE_S_MIN: 0.9,
  LIVE_S_GAP: -0.1,   // live icons: the cast shade runs into the stroke (a hairline gap breaks it off as loose crumbs)
  LIVE_SPECK_L: 1.6,  // live icons: shortest body cut (rim tone breaks into crumbs otherwise)
  SPECK_L: 0.8,       // a cut must be longer than SPECK_L + SPECK_K * its peak width,
  SPECK_K: 2.5,        //   else it reads as a blot (tight bands, grids, rings)
  MIN_RUN: 1.0,       // shortest clear interval that may carry a body cut
  CROSS_RUN: 3.2,     // shortest clear interval that may carry a cross cut
  MIN_THICK: 1.1,
  CROSS_MIN: 2.4,     // shortest cross cut: shorter ones cross a main cut as a stray "x"
  TEXT_SW: 1.75,      // live text stroke
  TEXT_GAP: 0.55,     // live text: paper kept around every glyph (hatch and cast shade stop short of it)
  LIVE_R: 2.3,        // live icons: hatch only within this reach of a shade-side edge (the centre stays paper)
  LIVE_GAIN: 1.6,
  DOT_SHADE: 2.2,     // marks no larger than this cast no hatched shade     // across the hatch, the clear band must be at least this wide
}
const LIGHT = [H, H]  // tone grows toward lower-right

const bboxMax = pts => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y } return Math.max(x1 - x0, y1 - y0) }
// parameter range of the line O + tD inside the square [lo, hi]^2 (keeps the shade inside the viewBox)
const boxT = (O, D, lo, hi) => {
  let a = -Infinity, b = Infinity
  for (let k = 0; k < 2; k++) {
    if (Math.abs(D[k]) < 1e-12) { if (O[k] < lo || O[k] > hi) return [1, 0]; continue }
    let u = (lo - O[k]) / D[k], v = (hi - O[k]) / D[k]; if (u > v) { const z = u; u = v; v = z }
    if (u > a) a = u; if (v < b) b = v
  }
  return [a, b]
}
const perp = D => [-D[1], D[0]]
const dirOf = deg => [Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180)]

function prepareRegions(icon) {
  const fillRings = icon.fillSet || []
  const lines = icon.lines || []
  const lineSegs = segsOf(lines)
  const edgeSegs = segsOf(fillRings.map(r => ({ pts: r, closed: true })))
  const cutClosed = [], cutOpen = []
  for (const c of icon.cutouts || []) for (const s of c.subs) (s.closed ? cutClosed : cutOpen).push(s)
  const comps = fillRings.map((r, i) => {
    let depth = 0
    for (let j = 0; j < fillRings.length; j++) if (j !== i && pointInRing(r[0], fillRings[j])) depth++
    let lo = Infinity, hi = -Infinity, a = 0
    for (const p of r) { const v = p[0] * LIGHT[0] + p[1] * LIGHT[1]; if (v < lo) lo = v; if (v > hi) hi = v }
    for (let k = 0; k < r.length; k++) { const p = r[k], q = r[(k + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] }
    return { r, depth, lo, hi, area: Math.abs(a / 2) }
  }).filter(c => c.depth % 2 === 0).sort((a, b) => a.area - b.area)
  return {
    fillRings, lines, lineSegs, edgeSegs, comps,
    cutRings: cutClosed.map(s => s.pts), cutEdgeSegs: segsOf(cutClosed), cutOpenSegs: segsOf(cutOpen),
  }
}

const compAt = (R, p) => { for (const c of R.comps) if (pointInRing(p, c.r)) return c; return R.comps[R.comps.length - 1] }

// hatch lines of direction D across the extents of pts, lattice anchored to the grid
function lattice(D, pitch, pts, phase) {
  const N = perp(D)
  let lo = Infinity, hi = -Infinity
  for (const p of pts) { const v = p[0] * N[0] + p[1] * N[1]; if (v < lo) lo = v; if (v > hi) hi = v }
  const out = []
  for (let k = Math.ceil((lo - phase) / pitch); k * pitch + phase <= hi; k++) {
    const c = k * pitch + phase
    out.push([N[0] * c, N[1] * c])
  }
  return out
}

// one burin cut from t0 to t1: pointed entry/exit, swelling with wf(point)
function cut(O, D, t0, t1, wf, P, minW = 0.06) {
  const N = perp(D), len = t1 - t0
  const at = t => [O[0] + D[0] * t, O[1] + D[1] * t]
  const tp = Math.min(0.55, len * 0.3)
  const n = Math.max(1, Math.ceil((len - 2 * tp) / 0.7))
  const S = [[t0, 0]]
  for (let i = 0; i <= n; i++) { const t = t0 + tp + (len - 2 * tp) * i / n; S.push([t, wf(at(t))]) }
  S.push([t1, 0])
  const runs = []; let cur = []
  for (let i = 0; i < S.length; i++) {
    const s = S[i]
    if (s[1] > minW || i === 0 || i === S.length - 1) cur.push(s)
    else { if (cur.length) { cur.push([s[0], 0]); runs.push(cur) } cur = [[s[0], 0]] }
  }
  if (cur.length) runs.push(cur)
  const out = []
  for (const run of runs) {
    if (!run.some(s => s[1] > minW)) continue
    const L = [], Rr = []
    for (const [t, w] of run) {
      const p = at(t)
      L.push([p[0] + N[0] * w / 2, p[1] + N[1] * w / 2])
      Rr.push([p[0] - N[0] * w / 2, p[1] - N[1] * w / 2])
    }
    const tl = run[run.length - 1][0] - run[0][0], wm = Math.max(...run.map(s => s[1]))
    if (tl < 1.2 && wm < 0.22) continue   // specks read as dirt, not tone
    if (tl < P.SPECK_L + P.SPECK_K * wm) continue
    out.push(simplify([...L, ...Rr.reverse().slice(1, -1)], 0.02, true))
  }
  return out
}

function clipBody(R, P, O, D) {
  const I = ringsT(O, D, R.fillRings)
  if (!I.length) return []
  const X = []
  capsulesT(O, D, R.lineSegs, P.SW / 2 + P.GAP, X)
  capsulesT(O, D, R.edgeSegs, 0.3, X)
  ringsT(O, D, R.cutRings, X)
  capsulesT(O, D, R.cutEdgeSegs, P.GAP, X)
  capsulesT(O, D, R.cutOpenSegs, 0.75 + P.GAP, X)
  for (const c of R.crescents) ringsT(O, D, [c], X)
  capsulesT(O, D, R.crescentSegs, P.GAP, X)
  if (R.textSegs) capsulesT(O, D, R.textSegs, P.TEXT_SW / 2 + P.TEXT_GAP, X)
  return subtract(merge(I), merge(X))
}

// a band too thin to hold tone (ring slivers, gaps between grid cells) must stay white:
// a hatch line grazing it lengthwise would read as a stray scratch
function thick(R, P, O, D, tm) {
  const M = [O[0] + D[0] * tm, O[1] + D[1] * tm], N = perp(D)
  for (const [a, b] of clipBody(R, P, M, N)) if (a <= 0 && b >= 0) return b - a >= P.MIN_THICK
  return false
}

function formEdges(R) {
  // fill edges with the shade factor of their outward normal (away from the mass)
  const out = []
  for (const g of R.edgeSegs) {
    const ex = g[2] - g[0], ey = g[3] - g[1], l = Math.hypot(ex, ey)
    if (l < 1e-6) continue
    let n = [ey / l, -ex / l]
    const m = [(g[0] + g[2]) / 2 + n[0] * 0.03, (g[1] + g[3]) / 2 + n[1] * 0.03]
    if (pointInSetFast(m, R.fillRings)) n = [-n[0], -n[1]]
    out.push([g[0], g[1], g[2], g[3], n[0] * LIGHT[0] + n[1] * LIGHT[1]])
  }
  return out
}
const pointInSetFast = (p, set) => set.reduce((acc, r) => pointInRing(p, r) ? !acc : acc, false)

function bodyHatch(R, P) {
  if (!R.comps.length) return []
  if (P.FORM > 0 || P.LIVE) R.formEdges = formEdges(R)
  if (P.LIVE) {   // live: only an edge the contour draws carries rim tone (a bare fill edge is a clearance, not a form)
    const segs = segsOf(R.lines.filter(l => !l.text))
    const near = (x, y) => segs.some(g => { const ex = g[2] - g[0], ey = g[3] - g[1], L2 = ex * ex + ey * ey, px = x - g[0], py = y - g[1]; const t = L2 > 1e-12 ? Math.max(0, Math.min(1, (px * ex + py * ey) / L2)) : 0; return Math.hypot(px - ex * t, py - ey * t) < 0.4 })
    R.formEdges = R.formEdges.filter(e => near((e[0] + e[2]) / 2, (e[1] + e[3]) / 2))
  }
  const polys = []
  const allPts = R.fillRings.flat()
  const widthAt = u => { const v = Math.max(0, Math.min(1, (u - P.U0) / (1 - P.U0))); return P.W_MAX * Math.pow(v, P.GAMMA) }
  const ramp = (c, p) => ((p[0] * LIGHT[0] + p[1] * LIGHT[1]) - c.lo) / Math.max(1e-6, c.hi - c.lo)
  // form: near an edge that faces away from the light the plate darkens, near a lit edge it clears
  const form = p => {
    let best = Infinity, sh = 0
    const E = R.formEdges, r2 = P.FORM_R * P.FORM_R
    for (let i = 0; i < E.length; i++) {
      const g = E[i], ex = g[2] - g[0], ey = g[3] - g[1], px = p[0] - g[0], py = p[1] - g[1]
      const L2 = ex * ex + ey * ey
      let t = L2 > 1e-12 ? (px * ex + py * ey) / L2 : 0; t = t < 0 ? 0 : t > 1 ? 1 : t
      const dx = px - ex * t, dy = py - ey * t, d2 = dx * dx + dy * dy
      if (d2 < best) { best = d2; sh = g[4] }
    }
    if (best >= r2) return 0
    const f = 1 - Math.sqrt(best) / P.FORM_R
    return sh * f * f
  }
  const rim = p => {   // live: tone from the nearest shade-facing edge only, fading to 0 at LIVE_R
    let best = Infinity, sh = 0
    const E = R.formEdges, r2 = P.LIVE_R * P.LIVE_R
    for (let i = 0; i < E.length; i++) {
      const g = E[i], ex = g[2] - g[0], ey = g[3] - g[1], px = p[0] - g[0], py = p[1] - g[1]
      const L2 = ex * ex + ey * ey
      let t = L2 > 1e-12 ? (px * ex + py * ey) / L2 : 0; t = t < 0 ? 0 : t > 1 ? 1 : t
      const dx = px - ex * t, dy = py - ey * t, d2 = dx * dx + dy * dy
      if (d2 < best) { best = d2; sh = g[4] }
    }
    if (best >= r2 || sh <= 0) return 0
    const f = 1 - Math.sqrt(best) / P.LIVE_R
    return Math.min(1, P.LIVE_GAIN * sh * f)
  }
  const tone = P.LIVE ? (c, p) => rim(p)
    : P.FORM > 0
    ? (c, p) => Math.max(0, Math.min(1, (1 - P.FORM) * ramp(c, p) + P.FORM * (0.5 + form(p))))
    : ramp
  const D = dirOf(P.BODY_ANGLE)
  for (const O of lattice(D, P.PITCH, allPts, 0.31)) {
    for (const [t0, t1] of clipBody(R, P, O, D)) {
      if (t1 - t0 < P.MIN_RUN) continue
      if (!thick(R, P, O, D, (t0 + t1) / 2)) continue
      const c =compAt(R, [O[0] + D[0] * (t0 + t1) / 2, O[1] + D[1] * (t0 + t1) / 2])
      polys.push(...cut(O, D, t0, t1, p => widthAt(tone(c, p)), P))
    }
  }
  if (P.CROSS > 0) {
    const D2 = dirOf(P.CROSS_ANGLE)
    const PX = { ...P, SPECK_L: P.CROSS_MIN }
    const wf2 = u => u <= P.CROSS ? 0 : P.CROSS_W * Math.pow((u - P.CROSS) / (1 - P.CROSS), 0.8)
    for (const O of lattice(D2, P.PITCH, allPts, 0.93)) {
      for (const [t0, t1] of clipBody(R, P, O, D2)) {
        if (t1 - t0 < P.CROSS_RUN) continue
        if (!thick(R, P, O, D2, (t0 + t1) / 2)) continue
        const c = compAt(R, [O[0] + D2[0] * (t0 + t1) / 2, O[1] + D2[1] * (t0 + t1) / 2])
        polys.push(...cut(O, D2, t0, t1, p => wf2(tone(c, p)), PX))
      }
    }
  }
  return polys
}

// A stroke running WITH the light casts only a thin tail past its end cap; hatched, that tail
// reads as a needle (slashes, "\" diagonals). Is (x,y) on the axis of such a stroke, near it?
function alongRod(segs, x, y, D, side, reach) {
  for (const g of segs) {
    const ex = g[2] - g[0], ey = g[3] - g[1], L = Math.hypot(ex, ey)
    if (L < 1.5) continue
    const ux = ex / L, uy = ey / L
    if (Math.abs(ux * D[1] - uy * D[0]) > 0.3) continue
    const px = x - g[0], py = y - g[1], a = px * ux + py * uy
    if (Math.abs(px * uy - py * ux) > side) continue
    if (a > -reach && a < L + reach) return true
  }
  return false
}

function shadowHatch(R, P) {
  if (P.SHADOW === 'none' || (P.SHADOW === 'auto' && R.fillRings.length)) return []
  const polys = []
  const OFF = [P.OFF, P.OFF], HW = P.SW / 2
  const pts = [...R.fillRings.flat(), ...R.lineSegs.flatMap(s => [[s[0], s[1]], [s[2], s[3]]])].map(p => [p[0] + OFF[0], p[1] + OFF[1]])
  if (!pts.length) return polys
  // dots and specks cast no shade: their hatched tails read as comets / pins
  const srcRings = R.fillRings.filter(r => bboxMax(r) > P.DOT_SHADE)
  const srcSegs = segsOf(R.lines.filter(l => !l.text && bboxMax(l.pts) > P.DOT_SHADE))
  const D = dirOf(P.SHADOW_ANGLE)
  for (const O of lattice(D, P.S_PITCH, pts, 0.17)) {
    const Os = [O[0] - OFF[0], O[1] - OFF[1]]
    const I = []
    ringsT(Os, D, srcRings, I)
    capsulesT(Os, D, srcSegs, HW, I)
    if (!I.length) continue
    const X = []
    ringsT(O, D, R.fillRings, X)
    capsulesT(O, D, R.edgeSegs, P.S_GAP, X)
    capsulesT(O, D, R.lineSegs, HW + P.S_GAP, X)
    for (const c of R.crescents) ringsT(O, D, [c], X)
    capsulesT(O, D, R.crescentSegs, P.S_GAP, X)
    // live icons: a shade cut must hang off the mark that casts it; a cut floating on its own reads as a crumb
    let ends = null
    if (P.S_ATTACHED) {   // only inked marks hold a cut: strokes and swells (a bare fill edge is paper)
      const A = []
      capsulesT(O, D, R.lineSegs, HW + P.S_GAP, A)
      for (const c of R.crescents) ringsT(O, D, [c], A)
      capsulesT(O, D, R.crescentSegs, P.S_GAP, A)
      ends = merge(A).map(x => x[1])
    }
    if (R.textSegs) capsulesT(O, D, R.textSegs, P.TEXT_SW / 2 + P.TEXT_GAP, X)
    const [b0, b1] = boxT(O, D, 0.35, 23.65)
    for (let [t0, t1] of subtract(merge(I), merge(X))) {
      t0 = Math.max(t0, b0); t1 = Math.min(t1, b1)
      if (t1 - t0 < P.S_MIN) continue
      if (ends && !ends.some(e => Math.abs(e - t0) < 0.05)) continue
      if (alongRod(R.lineSegs, O[0] + D[0] * (t0 + t1) / 2, O[1] + D[1] * (t0 + t1) / 2, D, HW + 0.3, HW + P.OFF * 1.6)) continue
      polys.push([[O[0] + D[0] * t0, O[1] + D[1] * t0], [O[0] + D[0] * t1, O[1] + D[1] * t1]])
    }
  }
  return polys
}

// Skeleton plate of every fill ring: a ring traced by an A or S path (within 0.35u for most of its points)
// belongs to that plate, everything else to the body (K).
function fillPlatesOf(R) {
  const by = {}
  for (const l of R.lines) if (l.plate === 'A' || l.plate === 'S') (by[l.plate] ||= []).push(l)
  const segs = Object.fromEntries(Object.entries(by).map(([p, ls]) => [p, segsOf(ls)]))
  return R.fillRings.map(r => {
    for (const [p, sg] of Object.entries(segs)) {
      let on = 0
      for (const q of r) for (const g of sg) {
        const ex = g[2] - g[0], ey = g[3] - g[1], px = q[0] - g[0], py = q[1] - g[1], L2 = ex * ex + ey * ey
        const t = L2 > 1e-12 ? Math.max(0, Math.min(1, (px * ex + py * ey) / L2)) : 0
        if (Math.hypot(px - ex * t, py - ey * t) < 0.35) { on++; break }
      }
      if (on / r.length > 0.5) return p
    }
    return 'K'
  })
}
// do two plates' centrelines run together (within 0.3u) for more than 0.9u?
function platesOverlap(lines) {
  const dist = (q, sg) => {
    let best = Infinity
    for (const g of sg) {
      const ex = g[2] - g[0], ey = g[3] - g[1], px = q[0] - g[0], py = q[1] - g[1], L2 = ex * ex + ey * ey
      const t = L2 > 1e-12 ? Math.max(0, Math.min(1, (px * ex + py * ey) / L2)) : 0
      const d = Math.hypot(px - ex * t, py - ey * t); if (d < best) best = d
    }
    return best
  }
  for (const pl of new Set(lines.map(l => l.plate || 'K'))) {
    const sg = segsOf(lines.filter(l => (l.plate || 'K') !== pl))
    if (!sg.length) continue
    for (const l of lines.filter(q => (q.plate || 'K') === pl)) {
      const P = resample(l.pts, 0.15, l.closed).map(o => o.p)
      let run = 0
      for (let k = 1; k < P.length; k++) {
        if (dist(P[k], sg) < 0.3) { run += Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]); if (run > 0.9) return true } else run = 0
      }
    }
  }
  return false
}
const ringArea = r => { let a = 0; for (let k = 0; k < r.length; k++) { const p = r[k], q = r[(k + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return Math.abs(a / 2) }

// Live text: glyph lines (ids "text:<ch>:<cap>:<n>") -> l.text = true
const TEXT_ID = /^text:/
function markText(R, icon) {
  const ids = new Set(icon.paths.filter(p => TEXT_ID.test(p.id)).map(p => p.id))
  for (const l of R.lines) if (ids.has(l.pathId)) l.text = true
  if (ids.size) R.textSegs = segsOf(R.lines.filter(l => l.text))
  return ids.size > 0
}

export function makeEngrave(over = {}) {
  const P = { ...DEFAULTS, ...over }
  return {
    name: 'engrave',
    title: 'Engrave',
    kind: 'creative',
    description: 'Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow.',
    strokeWidth: false,
    root: { fill: 'none', stroke: 'currentColor', 'stroke-width': P.SW, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    render(icon) {
      icon = snowmanFor('engrave', icon)
      const R = prepareRegions(icon)
      // Motion parts (forge/MOTION.md "Parts choreography"): with more than one skeleton plate, the ink of each
      // plate (contour, dots, swell, body hatch) is its own node tagged wm-k / wm-a / wm-s; the cast shade is wm-shadow.
      // plates whose lines run along each other (a lid on a rim) would double-paint the shared edge: kept fused
      const plated = new Set(icon.paths.map(p => p.plate || 'K')).size > 1 && !platesOverlap(R.lines)
      if (plated) R.fillPlates = fillPlatesOf(R)
      // Live text (forge/DYNAMIC.md): banknote lettering is cut clean. Glyphs get no swell and cast no shade, and
      // the hatch and the cast shade keep out of a clear cartouche around each run of text, so every counter
      // (0 8 9 A %) stays open at 16px. Static icons carry no glyph paths: unchanged.
      const hasText = markText(R, icon)
      R.crescents = shadeCrescents(hasText ? { ...R, lines: R.lines.filter(l => !l.text) } : R, P.SW / 2, P.SWELL, LIGHT, { bareEdges: !icon.params })
      R.crescentSegs = segsOf(R.crescents.map(r => ({ pts: r, closed: true })))
      const out = []
      // tiny closed contours (dots) would show a pinhole inside the stroke: fill them
      const dotLines = R.lines.filter(l => l.closed && bboxMax(l.pts) < P.SW + 1.2)
      const dots = dotLines.map(l => simplify(l.pts, 0.03, true))
      // Live icons (a skeleton built from params): the value sits in the middle of the frame, so the burin models
      // only the shade-side rim of each mass and leaves the centre as clean paper. The hatch never depends on the
      // value, so a digit changes only its own strokes.
      const hatch = bodyHatch(R, icon.params ? { ...P, LIVE: true, SPECK_L: P.LIVE_SPECK_L } : P)
      const polys = [...dots, ...R.crescents, ...hatch]
      const tag = pl => plated ? { class: 'wm-' + (pl === 'A' || pl === 'S' ? pl : 'K').toLowerCase() } : {}
      if (!plated) {
        const d = polys.map(p => ringD(p)).join('')
        if (d) out.push(['path', { d, fill: 'currentColor', stroke: 'none' }])
      } else {
        // a hatch cut belongs to the plate of the smallest fill ring around its entry point
        const rings = R.fillRings.map((r, i) => ({ r, pl: R.fillPlates[i], a: ringArea(r) })).sort((a, b) => a.a - b.a)
        const hatchPlate = c => (rings.find(o => pointInRing(c[0], o.r)) || { pl: 'K' }).pl
        const plates = [...dotLines.map(l => l.plate), ...R.crescents.map(c => c.plate), ...hatch.map(hatchPlate)]
        for (const pl of ['K', 'A', 'S']) {
          const d = polys.filter((_, i) => (plates[i] === 'A' || plates[i] === 'S' ? plates[i] : 'K') === pl).map(p => ringD(p)).join('')
          if (d) out.push(['path', { d, fill: 'currentColor', stroke: 'none', ...tag(pl) }])
        }
      }
      // cast shade: short constant-width cuts, cheapest as one stroked path
      const sd = shadowHatch(R, icon.params ? { ...P, S_MIN: P.LIVE_S_MIN, S_ATTACHED: true, S_GAP: P.LIVE_S_GAP } : P).map(s => ringD(s, false)).join('')
      if (sd) out.push(['path', { d: sd, 'stroke-width': P.S_W, class: 'wm-shadow' }])
      // live text: the swell-free glyphs are cut at the weight the stroke font is spaced for (the contour reads at
      // SW + swell), so letters match the frame and keep the font's counters
      for (const p of icon.paths) out.push(['path', { d: p.d, ...(TEXT_ID.test(p.id) ? { 'stroke-width': P.TEXT_SW } : {}), ...tag(p.plate) }])
      return out
    },
  }
}

export default makeEngrave()
