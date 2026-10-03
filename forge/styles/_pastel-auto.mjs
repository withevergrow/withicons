// PASTEL auto — the automatic composer: renders ANY skeleton (all 500 icons, every Live icon,
// any future icon) as soft pastel colour fields. The skeleton is rebuilt on a signed-distance
// grid (_pastel-field.mjs) into a few fields, and every field is then lit by the house
// lighting model (_pastel-paint.mjs: hue rim, gentle deeper bottom plane, soft top plane):
//   MASS    the object: fills plus its outline as round-capped bars, in the main hue
//   PARTS   A-plate fills and A strokes off the object: the part hue (wm-a)
//   INLAY   enclosed openings (screens, windows, doors): a recessed 'well' in the inlay hue
//   INK     interior detail (on a field): mid-tone ink matched to that field's hue
//   BADGE   S-plate badges: a disc in the badge hue with an ink glyph, behind a moat (wm-s)
// Hues come from _pastel-tune.mjs (meaning first, a stable hash otherwise).
import { parsePath, area, pointInRing, distToPolyline, V, simplify } from '../kernel/geom.mjs'
import * as F from './_pastel-field.mjs'
import { paintEntries, L } from './_pastel-paint.mjs'
import { autoTune, setOf } from './_pastel-tune.mjs'

export const K = {
  W: 2.5,          // object bars
  WI: 1.6,         // ink detail bars
  WG: 2.75,        // bars of a pure line glyph (an arrow, a chevron)
  CUT: 1.5,        // open cutouts knock out a line this wide
  GAP_S: 1.2,      // moat around badges and modifiers
  DEEP: 1.35,      // a centreline this deep inside the fill is interior detail
  INK_HOLE: 7,     // closed cutouts smaller than this (u^2) are printed in ink
  WT: 1.5,         // live-icon text set into a frame
  WT_S: 1.3,       // the same at the font's small size
  WT_LINE: 2.1,    // live icons without a frame: text and bars
  LO: 0.6,
  TOL: 0.03,
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
    for (const s of subsOf(p.d, p.subs)) {
      if (!s.pts || !s.pts.length) continue
      let pts = s.pts
      // binder rings: the short A posts on top of a calendar grow into soft rings that read at 24px
      if (T.rings && (p.plate || 'K') === 'A' && pts.length === 2 && pts[0][0] === pts[1][0] && Math.max(pts[0][1], pts[1][1]) <= 4.75)
        pts = [[pts[0][0], T.rings[0]], [pts[0][0], T.rings[1]]]
      lines.push({ pts, closed: !!s.closed, plate: p.plate || 'K', role, text: typeof p.id === 'string' && p.id.startsWith('text:') })
    }
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


// -------------------------------------------------------------------------------
export function build(icon) {
  const T = autoTune(icon.name)
  const live = !!icon.params
  const { lines, fills, cutouts } = read(icon, T)
  const base = lines.filter(l => l.plate !== 'S')
  const sig = lines.filter(l => l.plate === 'S')

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

  // --- classify centrelines: outlines -> colour bars; detail inside a field -> ink;
  //     A strokes off the object -> pastel bars in the part hue (never ink on the page)
  const massLines = [], partLines = [], inkLines = []
  for (const l of base) {
    if (!hasFill) {
      // a pure line glyph: main strokes in the main hue, secondary strokes in the part hue
      if (live && l.text) inkLines.push(l)
      else (l.plate === 'A' ? partLines : massLines).push(l)
      continue
    }
    if (l.pts.length === 1) { inkLines.push(l); continue }
    const d = densify(l.pts, 0.15, l.closed)
    const deep = p => at(allFill, p) < -K.DEEP
    if (l.plate !== 'K') {
      if (aEdge && d.filter(p => Math.abs(at(aEdge, p)) < 0.5).length / d.length > 0.6) { partLines.push(l); continue }
      const nIn = d.filter(p => at(allFill, p) < -0.6).length
      if (nIn / d.length > 0.5 || (live && l.text)) inkLines.push(l)
      else partLines.push(l)
      continue
    }
    const nDeep = d.filter(deep).length
    if (nDeep === 0) { massLines.push(l); continue }
    if (nDeep === d.length && l.closed) { inkLines.push(l); continue }
    for (const r of runs(d, deep)) inkLines.push({ pts: r, closed: false, plate: 'K', inner: true })
    for (const r of runs(d, p => !deep(p))) massLines.push({ pts: r, closed: false, plate: 'K' })
  }

  // --- MASS (K) and PARTS (A)
  const mass = F.field(K.LO)
  for (const rings of kFills) F.region(rings, K.LO, mass)
  if (massLines.length) F.strokes(massLines, W, K.LO, mass)
  let part = null
  if (aFills.length || partLines.length) {
    part = F.field(K.LO)
    for (const rings of aFills) F.region(rings, K.LO, part)
    if (partLines.length) F.strokes(partLines, hasFill ? Math.min(W, 2.25) : W, K.LO, part)
  }
  const massPre = F.copy(mass)
  if (part) F.union(massPre, part)
  // enclosed pockets (a mug handle's hole) stay see-through: calm, fewer colours
  const pockets = T.pockets && hasFill ? pocketsOf(massPre, baseFills) : null

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
  // an ink line that only traces the edge of an inlaid opening (a door's outline) is
  // dropped: the well's own rim draws that edge, softer
  if (cutArea.length) {
    for (let i = inkLines.length - 1; i >= 0; i--) {
      const l = inkLines[i]
      if (l.pts.length < 2) continue
      const d = densify(l.pts, 0.25, l.closed)
      const on = d.filter(p => cutArea.some(r => distToPolyline(p, r, true) < 0.8)).length
      if (on / d.length > 0.6) inkLines.splice(i, 1)
    }
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

  // --- INK, split by plate so moving parts (hands, needles) stay their own node
  const textLines = live ? inkLines.filter(l => l.text) : []
  const textSet = new Set(textLines)
  const inkK = F.field(K.LO), inkA = F.field(K.LO)
  const plainInk = inkLines.filter(l => !textSet.has(l))
  const kInk = plainInk.filter(l => l.plate !== 'A'), aInk = plainInk.filter(l => l.plate === 'A')
  if (kInk.length) F.strokes(kInk, WI, K.LO, inkK)
  if (aInk.length) F.strokes(aInk, WI, K.LO, inkA)
  const tall = l => { let a = Infinity, b = -Infinity; for (const p of l.pts) { a = Math.min(a, p[1]); b = Math.max(b, p[1]) } return b - a }
  const capH = textLines.length ? Math.max(...textLines.map(tall)) : 0
  const text = textLines.length ? F.strokes(textLines, !hasFill ? K.WT_LINE : capH < 5.25 ? K.WT_S : K.WT, K.LO) : null
  if (holes.length) { const h = F.region(holes, K.LO); F.intersect(h, massPre); F.union(inkK, h) }

  // --- S overlays: clear a moat, lay discs and modifiers on top
  let badge = null, paper = null
  const moat = (badges.length || freeS.length) ? F.field(K.LO) : null
  if (moat) {
    for (const b of badges) { F.region([b.pts], K.LO, moat); F.strokes([b], W + 2 * K.GAP_S, K.LO, moat) }
    if (freeS.length) F.strokes(freeS, W + 2 * K.GAP_S, K.LO, moat)
    for (const G of [mass, inkK, inkA, text, part, inlay]) if (G) F.subtract(G, moat)
  }
  if (badges.length) {
    badge = F.field(K.LO)
    for (const b of badges) { F.region([b.pts], K.LO, badge); F.strokes([b], W, K.LO, badge) }
    const inner = glyphs.filter(g => badgeOf(g))
    if (inner.length) {
      paper = F.strokes(inner, Math.max(1.6, WI), K.LO)
      F.intersect(paper, F.offset(F.copy(badge), 0.35))
    }
  }
  const sBar = freeS.length ? F.strokes(freeS, Math.min(W, 2.5), K.LO) : null

  // BAND: a frame holding text in rows (calendars, clocks) prints its top row on
  // a band of the part hue, split off along the gap between the rows
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
  // FACE: a dial (clock, watch, gauge) gets a paper face inset in its rim
  let face = null
  if (T.face) {
    face = F.field(3.5)
    for (const rings of kFills) F.region(rings, 3.5, face)
    F.offset(face, (T.face === true ? 2.25 : T.face) - W / 2)
    F.intersect(face, mass)
    if (inlay) F.subtract(face, inlay)
    if (F.extent(face, 0.05).area < 12) face = null
  }
  return { mass, part, inlay, inkK, inkA, text, band, face, badge, paper, sBar, hasFill }
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


// exact signed distance near the edge (the lighting measures thickness and insets)
export function deep(G) {
  if (!G) return null
  const loops = F.contour(F.copy(G)).map(l => simplify(l, 0.02, true)).filter(l => l.length > 2)
  if (!loops.length) return null
  return F.redistance(G, loops, REACH_AUTO)
}
// the field composer measures only this far: broad fields are sized by area / perimeter
const REACH_AUTO = 2.25

// the automatic composition as paint entries (exported so redraws can start from it)
export function autoEntries(icon) {
  const B = build(icon)
  const S = { ...setOf(icon.name), ...(autoTune(icon.name).hues || {}) }
  // a pure line glyph (an arrow, a chevron, a check) is one hue: its A strokes merge into
  // the mass where they touch it, and keep the main hue where they stand apart
  if (!B.hasFill && B.part) {
    S.part = S.main
    const touch = F.intersect(F.copy(B.part), F.offset(F.copy(B.mass), -0.2))
    if (F.any(touch)) { F.union(B.mass, B.part); B.part = null }
  }
  const E = []
  const add = (G, hue, mode, part) => { const D = deep(G); if (D) E.push({ hue, mode, part, F: D, reach: REACH_AUTO }) }
  add(B.mass, S.main, 'lit', 'K')
  add(B.band, S.band || S.part, 'lit', 'K')
  add(B.face, 'paper', 'lit', 'K')
  add(B.part, S.part, 'lit', 'A')
  add(B.inlay, S.inlay, 'well', 'K')
  add(B.inkK, S.main, 'ink', 'K')
  add(B.inkA, S.main, 'ink', 'A')
  add(B.text, S.main, 'ink', 'A')
  add(B.badge, S.badge, 'lit', 'S')
  add(B.paper, S.badge, 'ink', 'S')
  add(B.sBar, S.badge, 'lit', 'S')
  return E
}

export function auto(icon) {
  return paintEntries(autoEntries(icon))
}

// prime the field engine once at load, so the first real render is not paying
// for the JIT (deterministic: nothing is cached, nothing leaks into output)
try {
  auto({
    name: 'pastel-warmup', params: { n: 1 },
    paths: [{ d: 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z', plate: 'K' }, { d: 'M8 8 L12 12 L16 9', plate: 'A' }, { d: 'M9 15 H15', plate: 'A', id: 'text:-:4:2' }, { d: 'M21.5 6 A3.5 3.5 0 1 1 14.5 6 A3.5 3.5 0 1 1 21.5 6 Z', plate: 'S' }],
    fills: [{ d: 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z' }],
    cutouts: [{ d: 'M9 15 H15' }],
  })
} catch { /* never fatal */ }
