// SUITE core: the geometry behind forge/styles/suite.mjs.
//
// Every icon becomes a small stack of flat, crisp colour planes, the way modern
// office-suite colour icons are built (our own construction, no borrowed art):
//
//   BACK    A parts that sit outside the body (a shackle, a handle, a second person,
//           a stand) are a second plane in a second hue, behind the body
//   BODY    the K mass (fills + K strokes) as one flat plane in the main hue. Interior
//           K lines split it into compartments: a top band becomes a header over a light
//           page (calendar, window), several similar cells become multi-hue cells (charts);
//           3-8 separate pieces of similar weight (tiles, box faces, bars) do too
//   KNOCK   closed cutouts reaching outside the object are real holes (gaps between bars)
//   DEPTH   a deeper copy of each plane just behind it shows as a thin lip below (wm-shadow)
//   PAGE    large closed cutouts (a screen, a door) are light panes set into the body
//   FOLD    a document's folded corner is a deeper flap
//   SEEN    where the body crosses a back plane, a little of the back hue shows through
//           (translucent overlap), so the two planes read as layered sheets
//   SHEEN   one gentle diagonal gradient per plane group (light top-left, deeper
//           bottom-right), painted over the plane's solid base colour; the lip's deep tone is
//           a two-stop gradient (hue -> shadow) whose first stop is the hue. One defs node.
//   DETAIL  inner lines and small cutouts as light inlays on the body, deep ink on a page
//   BADGE   S plates as bright solid accent badges (discs with a white glyph, or bars),
//           cleared from everything below by a moat
//
// No outlines, no cast shadows, no cartoon effects. Dense icons are re-traced coarser to stay < 6 KB. Every colour is a
// role-named variable --with-suite-<role> with a hex fallback.
import { parsePath, distToPolyline, pointInRing, area, simplify, resample } from '../kernel/geom.mjs'
import * as F from './_suite-field.mjs'
import { ringsD } from './_suite-path.mjs'
import { tuneFor } from './_suite-tune.mjs'
import { isPerson } from './_people.mjs'
import { people } from './_suite-people.mjs'

export const PALETTE = {
  ink: '#1F4FB8',    // detail drawn on a light page
  c1: '#3478F6',     // main body
  c2: '#7B61F0',     // back plane / secondary parts
  c3: '#15A5B8',     // extra cells (charts, split bodies)
  c4: '#5C9DFF',     // a third cell hue
  tint: '#E4EEFF',   // light pages, screens, panes
  accent: '#FF7A3D', // badges and modifiers (warm)
  shadow: '#0B1E5B', // folds, deeper bottom of the sheen, see-through shade
  shine: '#FFFFFF',  // top of the sheen, badge glyphs
  edge: '#F2F7FF',   // light inlays on the body
}
export const col = r => `var(--with-suite-${r}, ${PALETTE[r]})`

const C = {
  WK: 2.0,      // K stroke width (fused into the body)
  WL: 2.25,     // K stroke width when the icon has no fills (line glyphs)
  WA: 2.0,      // A back-plane stroke width
  WD: 1.5,      // detail inlay width
  WS: 2.0,      // S bar width
  WG: 1.5,      // badge glyph width
  WT: 1.2,      // Live text width (stroke-font letters)
  MOAT: 0.75,   // clearance around S badges
  RIM: 0.75,    // inlays stop this far inside the body edge
  GAP: 1.0,     // gap between compartments
  LIP: 0.6,     // depth lip under the body
  M: 1.4,       // field margin
  TOL: 0.025,   // trace simplification
  FIT: 0.045,   // curve fit tolerance
}

// ---------------------------------------------------------------------------
const at = (Fd, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  if (i < 0 || j < 0 || i >= F.N || j >= F.N) return 1
  return Fd[j * F.N + i]
}
const exact = (Fd, reach = C.M) => F.any(Fd) ? F.redistance(Fd, F.contour(F.copy(Fd)).map(l => simplify(l, 0.015, true)), reach) : F.field(reach)
const grow = (Fd, r) => F.offset(exact(Fd, r + 0.4), -r)       // dilate
const shrink = (Fd, r) => F.offset(exact(Fd, r + 0.4), r)      // erode
const minus = (A, B) => F.subtract(F.copy(A), B)
const and = (A, B) => F.intersect(F.copy(A), B)
const or = (...L) => { const G = F.field(C.M); for (const x of L) if (x) F.union(G, x); return G }
const empty = Fd => !Fd || !F.any(Fd)
const polyArea = r => Math.abs(area(r))
const dense = l => { const r = l.pts.length > 1 ? resample(l.pts, 0.25, l.closed).map(o => o.p) : l.pts; return r.length ? r : l.pts }
const frac = (l, test) => { const P = dense(l); return P.length ? P.filter(test).length / P.length : 0 }

// zero-length subpaths ("M12 16 L12 16") stroke as a round dot; the parser drops them
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m || !/[LlHhVvCcSsQqTtAaZz]/.test(chunk)) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K', pathId: p.id })
    }
  }
  return out
}

let COARSE = 1 // > 1 when a dense icon is re-traced to stay small
const trace = (Fd, minArea = 0.25) => empty(Fd) ? '' : ringsD(F.trace(F.copy(Fd), C.TOL * COARSE, minArea), C.FIT * COARSE)
function bboxOf(Fd) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) if (Fd[j * F.N + i] < 0) {
    const x = i * F.H, y = j * F.H
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  return x0 === Infinity ? null : [x0, y0, x1, y1]
}

// ---------------------------------------------------------------------------
// dense icons (many cells, long outlines) are traced again with a coarser fit to stay near the size target
export function build(icon) {
  const { recs, defs } = build1(icon)
  const run = () => { const cache = new Map(); return recs.map(r => { if (!cache.has(r.Fd)) cache.set(r.Fd, trace(r.Fd)); return cache.get(r.Fd) }) }
  let ds
  try {
    COARSE = 1; ds = run()
    if (ds.reduce((n, d) => n + d.length, 0) > 4300) { COARSE = 2.2; ds = run() }
  } finally { COARSE = 1 }
  const out = []
  recs.forEach((r, i) => { if (ds[i]) out.push(['path', { d: ds[i], ...r.a }]) })
  if (!out.length) return []
  const used = new Set(out.map(n => String(n[1].fill).match(/^url\(#(.+)\)$/)).filter(Boolean).map(m => m[1]))
  const live = defs.filter(g => used.has(g[1].id))
  return live.length ? [['defs', {}, live], ...out] : out
}
function build1(icon) {
  F.setClip(null)
  const name = String(icon.name || 'icon').replace(/[^a-z0-9-]/gi, '')
  const T = tuneFor(icon.name)
  // people avatars: skin, hair and clothes in their own roles (_suite-people.mjs)
  if (isPerson(icon)) { try { return people(icon, name, PALETTE.accent) } catch { F.setClip(null) } }
  const all = [...(icon.lines || []), ...dots(icon)].filter(l => l.pts && l.pts.length)
  const Kl = all.filter(l => l.plate !== 'A' && l.plate !== 'S')
  const Al = all.filter(l => l.plate === 'A')
  const Sl = all.filter(l => l.plate === 'S')
  const hasFills = (icon.fills || []).length > 0

  // fills -> plate by vote of the nearest centreline
  const fills = { K: [], A: [], S: [] }
  for (const f of icon.fills || []) {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2)
    if (!rings.length) continue
    const votes = { K: 0, A: 0, S: 0 }
    for (const r of rings) for (let i = 0; i < r.length; i += 3) {
      let best = Infinity, pl = 'K'
      for (const l of all) { if (String(l.pathId || '').startsWith('text:')) continue; const d = distToPolyline(r[i], l.pts, l.closed); if (d < best) { best = d; pl = l.plate === 'A' || l.plate === 'S' ? l.plate : 'K' } }
      votes[pl]++
    }
    fills[votes.S > votes.K + votes.A ? 'S' : votes.A > votes.K ? 'A' : 'K'].push(rings)
  }

  const fillK = F.field(C.M)
  for (const r of fills.K) F.region(r, C.M, fillK)
  // closed cutouts that reach outside the object are knock-outs (gaps between bars, notches): real holes
  const knock = F.field(C.M)
  const knockRings = new Set()
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.closed || !s.pts || s.pts.length < 3 || !hasFills) continue
    const dn = resample(s.pts, 0.3, true).map(o => o.p)
    const inside = dn.filter(p => at(fillK, p) < 1.0).length / (dn.length || 1)
    if (inside <= 0.85) { F.region([s.pts], C.M, knock); knockRings.add(s) }
  }
  const hasKnock = F.any(knock)
  if (hasKnock) F.subtract(fillK, knock)

  // K lines inside the fill are compartment walls / inner detail, not outline
  const inner = hasFills ? Kl.filter(l => l.pts.length > 1 && !(l.closed && polyArea(l.pts) < 6) && frac(l, p => at(fillK, p) < -1.1) > 0.6) : []
  const KlBody = Kl.filter(l => !inner.includes(l))
  let body = F.strokes(KlBody, hasFills ? C.WK : C.WL, C.M)
  // small closed loops (dots, pips, nodes) are solid
  // (never a self-crossing loop: an infinity sign's lobes cancel to a near-zero signed area, but it is a line, not a pip)
  const dotLoop = l => l.closed && l.pts.length > 2 && polyArea(l.pts) < 6 && !selfCrossing(l.pts)
  for (const l of KlBody) if (dotLoop(l)) F.region([l.pts], C.M, body)
  F.union(body, fillK)
  if (hasKnock) F.subtract(body, knock)

  // fold: an open A line from outline to outline enclosing a small corner flap
  const onK = p => KlBody.some(l => distToPolyline(p, l.pts, l.closed) < 0.45)
  const folds = hasFills ? Al.filter(l => !l.closed && l.pts.length > 3 && onK(l.pts[0]) && onK(l.pts.at(-1)) && polyArea(l.pts) > 2.5 && polyArea(l.pts) < 30 && frac(l, p => at(fillK, p) < 0.25) > 0.9) : []
  const Al2 = Al.filter(l => !folds.includes(l))

  // A: inside the body = inlay detail, else a back plane
  const bodyX = exact(body)
  // share of an A line's stroke the body would hide if it sat behind
  const hidden = l => { const g = F.strokes([l], C.WA, 0.3); const a = F.extent(g, 99).area; return a ? F.extent(and(g, bodyX), 99).area / a : 0 }
  const Ain = [], Aback = [], Afront = []
  for (const l of Al2) {
    if (!hasFills) { Aback.push(l); continue }
    const fin = frac(l, p => at(bodyX, p) < -0.35)
    const endsIn = l.closed || [l.pts[0], l.pts.at(-1)].every(p => at(bodyX, p) < 0.3)
    if (fin > 0.8 && endsIn) Ain.push(l)
    else if (fin > 0.6 && endsIn) Ain.push(l)
    else if (fin > 0.22 || hidden(l) > 0.4) Afront.push(l)
    else Aback.push(l)
  }
  let back = F.strokes(Aback, C.WA, C.M)
  for (const l of Aback) if (dotLoop(l)) F.region([l.pts], C.M, back)
  let front = F.strokes(Afront, C.WA, C.M)
  for (const l of Afront) if (dotLoop(l)) F.region([l.pts], C.M, front)
  for (const r of fills.A) F.region(r, C.M, back)
  if (!hasFills) { /* line glyphs: A joins the body hue (an arrow's head is not a second object) */ }

  // S: closed outer rings are badge discs, the rest glyph bars
  const closedS = Sl.filter(l => l.closed && l.pts.length > 2 && polyArea(l.pts) > 5)
  const discs = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && l.pts.every(p => pointInRing(p, o.pts))))
  let disc = F.field(C.M)
  for (const d of discs) F.region([d.pts], C.M, disc)
  for (const r of fills.S) F.region(r, C.M, disc)
  const discX = empty(disc) ? null : exact(disc)
  const glyphL = Sl.filter(l => !discs.includes(l))
  const inDisc = discX ? glyphL.filter(l => frac(l, p => at(discX, p) < -0.3) > 0.7) : []
  const bars = glyphL.filter(l => !inDisc.includes(l))
  let sBar = F.strokes(bars, C.WS, C.M)
  const sAll = or(disc, sBar)
  const isTxt = l => String(l.pathId || '').startsWith('text:')
  let glyph = F.strokes(inDisc.filter(l => !isTxt(l)), C.WG, C.M)
  F.strokes(inDisc.filter(isTxt), C.WT, C.M, glyph)
  if (discX) F.intersect(glyph, F.offset(F.copy(discX), 0.5))
  const hasS = !empty(sAll)
  const moat = hasS ? grow(sAll, C.MOAT) : null

  // cutouts: big closed ones mostly inside the body are pages; the rest are detail lines
  const pages = F.field(C.M), cutLines = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || !s.pts.length) continue
    if (knockRings.has(s)) continue
    if (s.closed && s.pts.length > 2) {
      const a = polyArea(s.pts)
      const inside = s.pts.filter(p => at(bodyX, p) < 0.2).length / s.pts.length
      if (a >= 5 && inside > 0.85) F.region([s.pts], C.M, pages)
      else if (a < 5 && inside > 0.85) cutLines.push({ pts: s.pts, closed: true, area: true })
    } else if (!folds.some(l => s.pts.filter(p => distToPolyline(p, l.pts, false) < 0.5).length > 0.75 * s.pts.length)) cutLines.push({ pts: s.pts, closed: false })
  }

  // compartments: interior K walls split the body (an end that meets the outline runs on through it)
  const wallsBy = len => inner.map(l => {
    const P = l.pts.slice()
    if (l.closed || P.length < 2) return l
    const ext = (e, q) => {
      const dx = e[0] - q[0], dy = e[1] - q[1], n = Math.hypot(dx, dy) || 1
      const o = [e[0] + dx / n * 1.0, e[1] + dy / n * 1.0]
      return at(fillK, o) > -0.3 ? [e[0] + dx / n * len, e[1] + dy / n * len] : null
    }
    const a = ext(P[0], P[Math.min(2, P.length - 1)]), b = ext(P.at(-1), P[Math.max(0, P.length - 3)])
    return { ...l, pts: [...(a ? [a] : []), ...P, ...(b ? [b] : [])] }
  })
  const wallLines = wallsBy(1.6)
  let header = null, cells = null
  if (inner.length) {
    const walls = F.strokes(wallLines, C.GAP, C.M)
    const parts = minus(fillK, walls)
    const comps = F.components(parts, true).filter(c => c.area > 1.5).sort((a, b) => b.area - a.area)
    if (comps.length >= 2) {
      const top = [...comps].sort((a, b) => a.y0 - b.y0)[0]
      const wide = comps.every(c => c === top || (c.y0 >= top.y1 - 0.2))
      if (comps.length === 2 && wide && top.area < comps.find(c => c !== top).area) header = { top, rest: comps.filter(c => c !== top) }
      else cells = comps
    }
  }

  // DETAIL inlays
  let detA = F.strokes(Ain.filter(l => !isTxt(l)), C.WD, C.M)
  F.strokes(Ain.filter(isTxt), C.WT, C.M, detA)
  for (const l of Ain) if (l.closed && !isTxt(l) && polyArea(l.pts) < 5) F.region([l.pts], C.M, detA)
  let detK = F.strokes(cutLines.filter(c => !c.area), C.WD, C.M)
  for (const c of cutLines.filter(c => c.area)) F.region([c.pts], C.M, detK)
  if (!header && !cells) F.union(detK, F.strokes(inner, C.WD, C.M))
  if (!empty(detA)) F.subtract(detK, grow(detA, 0.35))

  // pages from compartments
  if (header) {
    const pg = F.field(1)
    for (const c of header.rest) for (const q of c.cells) pg[q] = -1
    F.union(pages, and(grow(pg, C.GAP * 0.5 + 0.05), F.offset(F.copy(fillK), 0.5)))
    const nearWall = grow(F.strokes(inner, 0.2, C.M), 1.0)
    F.subtract(detK, nearWall)
  }
  const pagesIn = and(pages, bodyX)
  // detail lines along a page's border are drawn by the page itself
  if (!empty(pagesIn)) {
    const ring = minus(grow(pagesIn, 0.95), shrink(pagesIn, 0.95))
    F.subtract(detA, ring); F.subtract(detK, ring)
  }
  const inset = F.offset(F.copy(bodyX), C.RIM)
  F.intersect(detA, inset); F.intersect(detK, inset)

  // cells: body becomes separate cells
  let cellFields = null
  if (cells) {
    // each cell owns the part of the body nearer its own fill than any other's, less half a gap
    const ds = cells.map(c => { const g = F.field(1); for (const q of c.cells) g[q] = -1; return exact(g, 2.5) })
    // a wall runs straight on through the outline (never through a fill), so cell edges stay straight
    const cutZone = minus(F.strokes(wallsBy(10), C.GAP, C.M), shrink(fillK, 0.7))
    const bodyCut = minus(body, cutZone)
    const NN = bodyCut.length, m1 = new Float32Array(NN).fill(1e9), m2 = new Float32Array(NN).fill(1e9), am = new Int16Array(NN)
    ds.forEach((d, j) => { for (let k = 0; k < NN; k++) { const v = d[k]; if (v < m1[k]) { m2[k] = m1[k]; m1[k] = v; am[k] = j } else if (v < m2[k]) m2[k] = v } })
    cellFields = ds.map((di, i) => {
      const cf = F.copy(bodyCut)
      for (let k = 0; k < NN; k++) {
        if (cf[k] > 0.5) continue
        const v = (di[k] - (am[k] === i ? m2[k] : m1[k]) + C.GAP) / 2
        if (v > cf[k]) cf[k] = v
      }
      return cf
    })
    // one opening for all cells (they are apart by the gap), then each keeps its main piece
    const opened = F.open(or(...cellFields), 0.3)
    cellFields = cellFields.map(cf => { const c = and(cf, opened); return F.any(c) ? largest(c) : c })
  }

  let frontGap = null
  if (!empty(front)) { frontGap = grow(front, 0.55); body = minus(body, frontGap); F.subtract(detA, frontGap); F.subtract(detK, frontGap) }
  // separate pieces of similar weight (tiles, blocks) become multi-hue cells too
  if (!cellFields && !header && hasFills && !hasS && T.cells !== false) {
    const comps = F.components(body, true).filter(c => c.area >= 5)
    const tot = comps.reduce((a, c) => a + c.area, 0)
    if (comps.length >= 3 && comps.length <= 8 && comps.every(c => c.area > tot * 0.08)) {
      const raw = comps.map(c => { const g = F.field(1); for (const q of c.cells) g[q] = -1; return and(g, body) })
      // small leftover pieces (a dot, a handle) keep the main hue: they join the first cell
      const restB = minus(body, or(...raw))
      if (F.extent(restB, 99).area > 0.3) F.union(raw[0], restB)
      const opened = F.open(or(...raw), 0.45)
      cellFields = raw.map(cf => and(cf, opened))
      cellFields.order = 'read'
    }
  }
  // inlays stay inside their cell (never across a gap)
  if (cellFields) { const inC = F.offset(exact(or(...cellFields)), 0.55); F.intersect(detA, inC); F.intersect(detK, inC) }
  // clear the moat
  if (moat) {
    front = minus(front, moat)
    body = minus(body, moat); back = minus(back, moat)
    if (cellFields) { const o = cellFields.order; cellFields = cellFields.map(cf => minus(cf, moat)); cellFields.order = o }
    F.subtract(detA, moat); F.subtract(detK, moat)
  }
  const pageD = moat ? minus(pagesIn, moat) : pagesIn
  const detOnPageA = and(detA, pageD), detOnPageK = and(detK, pageD)
  const detOffA = minus(detA, pageD), detOffK = minus(detK, pageD)

  // fold flap
  let flap = null
  if (folds.length) {
    const poly = F.field(C.M)
    for (const l of folds) F.region([l.pts], C.M, poly)
    const rest = minus(fillK, poly)
    flap = minus(and(body, grow(poly, C.WK * 0.5 + 0.1)), rest)
  }
  // see-through: body over the back plane
  const seen = !empty(back) ? and(body, back) : null

  // ---------------------------------------------------------------------------
  // paint
  const recs = []
  const defs = []
  const gid = n => `wg-suite-${name}-${n}`
  let gN = 0
  // the lip's solid deep tone: its hue half way to the shadow role. A two-stop gradient whose vector
  // is so long that the whole lip sits at its middle (the first stop, the hue, is the solid fallback)
  const deepCache = new Map()
  const deep = (hue, Fd) => {
    const bb = bboxOf(Fd)
    if (!bb) return col(hue)
    const cy = f2((bb[1] + bb[3]) / 2)
    const key = hue + cy
    if (deepCache.has(key)) return deepCache.get(key)
    const id = gid(gN++)
    defs.push(['linearGradient', { id, x1: 0, y1: f2(cy - 60), x2: 0, y2: f2(cy + 60), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': col(hue) }],
      ['stop', { offset: 1, 'stop-color': col('shadow') }],
    ]])
    const u = 'url(#' + id + ')'
    deepCache.set(key, u)
    return u
  }
  const sheen = (Fd) => {
    const bb = bboxOf(Fd)
    if (!bb) return null
    const id = gid(gN++)
    defs.push(['linearGradient', { id, x1: f2(bb[0]), y1: f2(bb[1]), x2: f2(bb[2]), y2: f2(bb[3]), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': col('shine'), 'stop-opacity': 0.3 }],
      ['stop', { offset: 0.5, 'stop-color': col('shine'), 'stop-opacity': 0 }],
      ['stop', { offset: 0.5, 'stop-color': col('shadow'), 'stop-opacity': 0 }],
      ['stop', { offset: 1, 'stop-color': col('shadow'), 'stop-opacity': 0.24 }],
    ]])
    return `url(#${id})`
  }
  const put = (Fd, fill, cls, extra = {}) => {
    if (empty(Fd)) return false
    recs.push({ Fd, a: { fill, ...extra, class: cls } })
    return true
  }

  // DEPTH: a deeper copy of the body just behind it, showing as a thin lip below (filled glyphs only)
  const allBody = cellFields ? or(...cellFields) : body
  const lipOf = (src, hue) => {
    if (!hasFills || !(C.LIP > 0)) return
    const lip = minus(F.shift(src, 0, Math.round(C.LIP / F.H), 1), or(allBody, back))
    if (F.extent(lip, 99).area > 0.3) put(lip, deep(hue, lip), 'wm-shadow')
  }
  if (!cellFields) lipOf(body, T.warm ? 'accent' : 'c1')
  // BACK
  const backHue = T.backHue || (hasFills ? 'c2' : T.warm ? 'accent' : 'c1')
  const backD = put(back, col(backHue), 'wm-a')
  if (backD) { const g = sheen(back); if (g) put(back, g, 'wm-a') }

  // BODY
  if (cellFields) {
    const hues = ['c1', 'c3', 'c2', 'c4']
    // cells left to right get hues in order (so charts read as a series)
    // reading order for a grid of tiles; left to right for a row (a chart's series)
    const bbs = cellFields.map(cf => bboxOf(cf) || [0, 0, 0, 0])
    const grid = cellFields.order === 'read' && bbs.some(a => bbs.some(b => a[3] < b[1] || b[3] < a[1]))
    const order = cellFields.map((cf, i) => { const b = bbs[i]; return { cf, i, x: b[0], y: Math.round(b[1] / 3) } })
      .sort((a, b) => grid ? (a.y - b.y) || (a.x - b.x) : a.x - b.x)
    order.forEach((o, n) => lipOf(o.cf, hues[n % hues.length]))
    order.forEach((o, n) => { put(o.cf, col(hues[n % hues.length]), 'wm-k') })
    const all2 = or(...cellFields)
    const g = sheen(all2); if (g) put(all2, g, 'wm-k')
  } else {
    const bodyD = put(body, col(T.warm ? 'accent' : 'c1'), 'wm-k')
    if (seen) put(seen, col(backHue), 'wm-k', { 'fill-opacity': 0.35 })
    if (flap) put(flap, col('shadow'), 'wm-k', { 'fill-opacity': 0.38 })
    if (T.panelY) { const band = F.field(1); F.clipBand(band, -1, T.panelY); band.fill(-1); F.clipBand(band, -1, T.panelY); put(and(body, band), col('shadow'), 'wm-k', { 'fill-opacity': 0.3 }) }
    if (bodyD) { const g = sheen(body); if (g) put(body, g, 'wm-k') }
  }
  // FRONT (A parts straddling the body: tabs, clappers)
  const frontD = put(front, col('c2'), 'wm-a')
  if (frontD) { const g = sheen(front); if (g) put(front, g, 'wm-a') }
  // PAGES
  put(pageD, col('tint'), 'wm-k')
  // DETAIL
  put(detOffK, col('edge'), 'wm-k')
  put(detOffA, col('edge'), 'wm-a')
  put(detOnPageK, col('ink'), 'wm-k')
  put(detOnPageA, col('ink'), 'wm-a')
  // DOTS (per-icon tune: a face's eye and nostrils, dark dots on top)
  if (T.dots) put(F.region(T.dots.map(([x, y, r]) => Array.from({ length: 20 }, (_, i) => [x + r * Math.cos(i * Math.PI / 10), y + r * Math.sin(i * Math.PI / 10)]))), col('shadow'), 'wm-a')
  // BADGE
  if (hasS) {
    put(sAll, col('accent'), 'wm-s')
    put(glyph, col('shine'), 'wm-s')
  }
  return { recs, defs }
}
// the largest connected piece of a field (a coarse field: for painting cells)
function largest(Fd) {
  const cs = F.components(Fd, true)
  if (cs.length < 2) return Fd
  cs.sort((a, b) => b.area - a.area)
  const keep = new Uint8Array(Fd.length)
  for (const q of cs[0].cells) keep[q] = 1
  const G = F.copy(Fd)
  for (let k = 0; k < G.length; k++) if (G[k] < 0 && !keep[k]) G[k] = 0.05
  return G
}
const f2 = n => Math.round(n * 100) / 100
// does a closed polyline cross itself (two non-adjacent edges intersect)?
function selfCrossing(P) {
  const n = P.length
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  for (let i = 0; i < n; i++) {
    const a = P[i], b = P[(i + 1) % n]
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue
      const c = P[j], d = P[(j + 1) % n]
      // passing back through one of its own points (a figure eight drawn through its centre) counts too
      if (j > i + 2 && !(i === 0 && j === n - 1) && Math.hypot(a[0] - c[0], a[1] - c[1]) < 1e-6) return true
      const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d)
      if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true
    }
  }
  return false
}
