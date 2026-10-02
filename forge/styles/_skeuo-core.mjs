// SKEUO core — the geometry behind forge/styles/skeuo.mjs.
//
// A skeleton becomes a small physical object made of separate PIECES, each a
// signed distance field (_skeuo-field.mjs), so the painter can light every piece
// on its own and stack real depth:
//   BODY    K fills ∪ chunky K strokes: the object itself (one material)
//   BACK    A parts that only meet the body (a shackle, a handle, a stand): a
//           second material, tucked BEHIND the body, which casts a contact shadow on it
//   FRONT   A parts that cross the body (an arrow over a box, calendar rings):
//           laid ON the body, casting their own shadow onto it
//   HOLES   closed cutouts go right through, with the inner wall showing
//   SCREENS closed cutouts of a device become inlaid glass instead (tune/material)
//   GROOVES open cutouts and interior lines are debossed into the surface
//   BADGES  S-plate badges: enamel discs set apart by a moat; their glyph is embossed
//   TUBES   free S glyphs and slashes: enamel rods, set apart by a moat
// Everything is in skeleton coordinates (24u grid), so the result always lines up
// with Line and the rest of the family.
import { parsePath, simplify, area, pointInRing, distToPolyline, arclen, V } from '../kernel/geom.mjs'
import * as F from './_skeuo-field.mjs'

export const K = {
  W: 2.2,          // body stroke weight
  WT: 2.6,         // stroke weight when the whole icon is line-only (rods need room for light)
  WS: 2.3,         // free S glyphs / slashes
  GAP: 0.95,       // moat around badges and free glyphs
  CUT: 1.5,        // open cutouts that go through (tune.cutThrough)
  GROOVE: 1.05,    // debossed groove width
  MARK: 1.45,      // embossed glyph on a badge
  DEEP: 1.4,       // an A part reaching this deep into the body sits in FRONT of it
  SLIVER: 0.2,     // opening radius on the body
  REACH: 1.6,      // exact distance kept this far from every edge (deepest inset is 1.3)
  SCREEN: 9,       // a closed cutout this big (u^2) can become a screen
}

const polyArea = r => Math.abs(area(r))
const straight = (pts, tol = 0.05) => pts.length >= 2 && pts.every(p => distToPolyline(p, [pts[0], pts.at(-1)]) <= tol)
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
export const at = (G, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  return (i < 0 || j < 0 || i >= F.N || j >= F.N) ? 1 : G[j * F.N + i]
}
export const densify = (pts, step = 0.1, closed = false) => {
  const P = closed ? [...pts, pts[0]] : pts, out = []
  for (let i = 0; i + 1 < P.length; i++) {
    const a = P[i], b = P[i + 1], n = Math.max(1, Math.ceil(V.dist(a, b) / step))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  if (!closed || !P.length) out.push(P.at(-1))
  return out.filter(Boolean)
}

// An open 2-arm polyline with equal arms and a 45-115 degree apex: a chevron.
function chevron(l) {
  if (l.closed) return null
  const s = simplify(l.pts, 0.06)
  if (s.length !== 3) return null
  const [a, m, b] = s, la = V.dist(a, m), lb = V.dist(b, m)
  if (la < 2.5 || lb < 2.5 || la > 10 || lb > 10 || la / lb > 1.3 || lb / la > 1.3) return null
  const ang = Math.acos(Math.max(-1, Math.min(1, V.dot(V.norm(V.sub(a, m)), V.norm(V.sub(b, m)))))) * 180 / Math.PI
  if (ang < 45 || ang > 115) return null
  return [a, m, b]
}

// portions of a closed cutout ring that sit on a wall: a strip that breaks through (a door in a house wall)
function wallBreaches(ring, mass) {
  const n = ring.length, out = []
  const sgn = area(ring) > 0 ? 1 : -1
  const flags = [], norms = []
  for (let i = 0; i < n; i++) {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const t = V.norm(V.sub(b, a))
    const nrm = [t[1] * sgn, -t[0] * sgn]
    norms.push(nrm)
    const p = ring[i]
    flags.push(at(mass, [p[0] + nrm[0] * 1.4, p[1] + nrm[1] * 1.4]) > 0 && at(mass, [p[0] + nrm[0] * 0.5, p[1] + nrm[1] * 0.5]) < 0)
  }
  const cnt = flags.filter(Boolean).length
  if (!cnt || cnt > n * 0.6) return out
  const start = flags.findIndex(f => !f)
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n
    if (!flags[i] || flags[(i - 1 + n) % n]) continue
    const run = []
    for (let m = 0; m < n && flags[(i + m) % n]; m++) run.push((i + m) % n)
    if (run.length < 2 || arclen(run.map(r => ring[r])) < 0.4) continue
    const outer = run.map(r => [ring[r][0] + norms[r][0] * 1.7, ring[r][1] + norms[r][1] * 1.7])
    const inner = run.map(r => [ring[r][0] - norms[r][0] * 0.2, ring[r][1] - norms[r][1] * 0.2])
    out.push([...inner, ...outer.reverse()])
  }
  return out
}

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

const any = f => f && F.any(f)

// T: per-icon tune (see _skeuo-tune.mjs)
export function build(icon, T = {}) {
  const R = K.REACH
  const lines = [...(icon.lines || []).filter(l => l.pts && l.pts.length), ...dots(icon)]
  const plateOf = l => (T.plates && T.plates[l.pathId]) || l.plate
  for (const l of lines) l.plate = plateOf(l)
  // T.lift: paths raised off the surface as their own piece (a compass needle, an iris, a toggle knob)
  const liftL = T.lift ? lines.filter(l => T.lift.includes(l.pathId)) : []
  if (liftL.length) for (const l of liftL) lines.splice(lines.indexOf(l), 1)
  const base = lines.filter(l => l.plate !== 'S')
  const sig = lines.filter(l => l.plate === 'S')
  const fills = T.noFills ? [] : (icon.fills || []).filter(f => f.set && f.set.length)
  const hasFill = fills.length > 0
  const lineOnly = !hasFill
  const W = T.w || (lineOnly ? K.WT : K.W)

  // --- S plate: badges (outermost closed rings), slashes, glyphs
  const closedS = sig.filter(l => l.closed && l.pts.length > 2)
  const badges = T.noBadge ? [] : closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const badgeOf = g => badges.find(b => b !== g && fracInside(g.pts, b.pts) > 0.5)
  const glyphs = sig.filter(l => !badges.includes(l))
  const free = glyphs.filter(g => !badgeOf(g))

  // --- fills that trace a badge belong to it
  const onBadge = set => {
    const pts = set.flat()
    return badges.some(b => pts.filter(p => distToPolyline(p, b.pts, true) < 0.6).length / pts.length > 0.6)
  }
  const bodyFills = fills.filter(f => !onBadge(f.set))

  // --- which fills belong to an outside A part (their outline follows an A centreline)
  const aLines = base.filter(l => l.plate === 'A')
  const aNear = aLines.length && bodyFills.length ? F.strokes(aLines, 0, 0.4) : null
  const kNear = aNear ? F.strokes(base.filter(l => l.plate === 'K'), 0, 0.4) : null
  const near = (pts, G) => pts.filter(p => at(G, p) < 0.35).length / Math.max(1, pts.length)
  const fillPlate = bodyFills.map(f => {
    if (!aNear) return 'K'
    const pts = f.set.flat()
    const a = near(pts, aNear), k = near(pts, kNear)
    return a > 0.6 && a > k ? 'A' : 'K'
  })
  const kFills = bodyFills.filter((f, i) => fillPlate[i] === 'K')
  const aFills = bodyFills.filter((f, i) => fillPlate[i] === 'A')
  const allFill = F.field(2)
  for (const f of bodyFills) F.region(f.set, 2, allFill)

  // --- arrowheads close into solid triangles (a lone chevron stays a chevron)
  const heads = new Map()
  if (!T.noHeads) for (const l of [...base, ...free]) {
    const v = !l.closed && chevron(l)
    if (v && [...base, ...free].some(o => o !== l && distToPolyline(v[1], o.pts, o.closed) < 0.3)) heads.set(l, v)
  }
  const partField = (ls, w, reach, into = null) => {
    const G = F.strokes(ls, w, reach, into)
    for (const l of ls) {
      const v = heads.get(l)
      if (v) { F.region([v], reach, G); F.strokes([{ pts: v, closed: true }], w, reach, G) }
    }
    return G
  }

  // --- body: K fills, K lines, and A lines that live inside the fills
  const inFill = l => { const d = densify(l.pts, 0.25, l.closed); return d.filter(p => at(allFill, p) < -0.3).length / d.length }
  const innerA = l => hasFill && l.plate === 'A' && inFill(l) > 0.6
  const kLines = base.filter(l => l.plate === 'K' || innerA(l) || !hasFill || (T.aAsBody && l.plate === 'A'))
  const outerA = hasFill ? base.filter(l => l.plate === 'A' && !kLines.includes(l)) : []
  const body = F.field(R)
  for (const f of kFills) F.region(f.set, R, body)
  partField(kLines, W, R, body)

  // --- outside A parts: behind the body when they only meet it, in front when they cross it
  let back = null, front = null
  for (const l of outerA) {
    const lNear = aFills.length ? F.strokes([l], 0, 0.4) : null
    const own = aFills.filter(f => near(f.set.flat(), lNear) > 0.5)
    const P = partField([l], T.wA || W, R)
    for (const f of own) F.region(f.set, R, P)
    const pts = densify(l.pts, 0.1, l.closed)
    const depth = pts.reduce((m, p) => Math.max(m, -at(body, p)), -9)
    const where = (T.front === true || (T.front !== false && depth > K.DEEP)) ? 'front' : 'back'
    if (where === 'front') front = front ? F.union(front, P) : P
    else back = back ? F.union(back, P) : P
  }

  // --- cutouts: closed areas go through (or become screens), open ones are grooves
  const holeRings = [], screenRings = [], grooveLines = [], decals = {}
  for (const [ci, c] of (T.noCutouts ? [] : (icon.cutouts || [])).entries()) {
    if (T.skipCut && T.skipCut.includes(ci)) continue
    for (const s of c.subs) {
      if (!s.pts.length) continue
      if (s.closed && s.pts.length > 2) {
        if (T.decal && T.decal[ci]) { (decals[T.decal[ci]] ||= []).push(s.pts); continue }
        if (T.screen && polyArea(s.pts) >= (T.screenMin || K.SCREEN)) screenRings.push(s.pts)
        else holeRings.push(s.pts)
      } else grooveLines.push({ pts: s.pts, closed: false, ci })
    }
  }
  // interior centrelines the author did not cut (a calendar header, a mouth): debossed too
  if (!T.noInner && hasFill) {
    const deep = F.copy(allFill)
    const cutNear = grooveLines.length ? F.strokes(grooveLines, 0, 1.0) : null
    const holeNear = holeRings.length || screenRings.length ? F.strokes([...holeRings, ...screenRings].map(pts => ({ pts, closed: true })), 0, 1.2) : null
    for (const l of base) {
      if (outerA.includes(l)) continue
      const d = densify(l.pts, 0.25, l.closed)
      if (d.filter(p => at(deep, p) < -1.0).length / d.length < 0.6) continue
      if (cutNear && d.filter(p => at(cutNear, p) < 0.8).length / d.length > 0.5) continue
      if (holeNear && d.filter(p => at(holeNear, p) < 1.0).length / d.length > 0.5) continue
      grooveLines.push(l)
    }
  }
  const holes = holeRings.length ? F.region(holeRings, R) : null
  if (holes) {
    for (const b of holeRings.flatMap(r => wallBreaches(r, body))) F.region([b], R, holes)
    F.subtract(body, holes)
    if (back) F.subtract(back, holes)
    if (front) F.subtract(front, holes)
  }
  if (T.cutThrough && grooveLines.length) {
    // open cuts that knock right through (a gap that must read as a gap)
    const c = F.strokes(grooveLines, K.CUT, R)
    F.subtract(body, c)
    if (front) F.subtract(front, c)
    grooveLines.length = 0
  }
  let screens = screenRings.length ? F.region(screenRings, R) : null

  // --- badges and free glyphs clear a moat through everything below them
  let badge = null, marks = null, tubes = null
  if (badges.length || free.length) {
    const moat = F.field(R)
    for (const b of badges) { F.region([b.pts], R, moat); F.strokes([b], W + 2 * K.GAP, R, moat) }
    if (free.length) partField(free, (T.wS || K.WS) + 2 * K.GAP, R, moat)
    F.subtract(body, moat)
    if (back) F.subtract(back, moat)
    if (front) F.subtract(front, moat)
    if (screens) F.subtract(screens, moat)
  }
  if (badges.length) {
    badge = F.field(R)
    for (const b of badges) { F.region([b.pts], R, badge); F.strokes([b], W, R, badge) }
    const gl = glyphs.filter(g => badgeOf(g))
    if (gl.length) {
      marks = F.field(R)
      const closedG = gl.filter(g => g.closed && g.pts.length > 2)
      if (closedG.length) F.region(closedG.map(g => g.pts), R, marks)
      const open = gl.filter(g => !(g.closed && g.pts.length > 2))
      if (open.length) partField(open, T.wMark || K.MARK, R, marks)
      F.intersect(marks, F.offset(F.copy(badge), 0.5))
    }
    // badge cutouts (a gear's hub)
    if (holes) F.subtract(badge, holes)
  }
  if (free.length) tubes = partField(free, T.wS || K.WS, R)
  let lifted = null
  if (liftL.length) {
    lifted = partField(liftL, T.wLift || W, R)
    const closedL = liftL.filter(l => l.closed && l.pts.length > 2)
    if (closedL.length) F.region(closedL.map(l => l.pts), R, lifted)
  }

  // --- tidy: no slivers, exact distances for the painter
  // only fields that were cut (holes, moats) need the sliver pass and re-distancing
  const cut = !!(holes || badges.length || free.length || T.cutThrough)
  const clean = (G, open = true, ex = open) => {
    if (!any(G)) return null
    if (open && cut) G = F.open(G, K.SLIVER)
    return any(G) ? (ex ? F.exact(G, R) : G) : null
  }
  const out = {
    lineOnly, W,
    body: clean(body, true, true),
    back: clean(back, true, true),
    front: clean(front, true, true),
    screens: null, grooves: null, holes: null,
    badge: clean(badge, false, true), marks: clean(marks, false), tubes: clean(tubes, false), lifted: clean(lifted, false, true),
    // the plate most lifted lines come from (motion parts)
    liftPlate: liftL.length ? ['K', 'A', 'S'].reduce((a, p) => liftL.filter(l => l.plate === p).length > liftL.filter(l => l.plate === a).length ? p : a, 'K') : null,
  }
  if (out.back && out.body) out.back = (G => any(G) ? F.exact(G, R) : null)(F.subtract(out.back, F.offset(F.copy(out.body), -0.05))) // only what shows
  // grooves: only where they cross the surface
  if (grooveLines.length && (out.body || out.front)) {
    const surf = F.copy(out.body || out.front)
    if (out.body && out.front) F.union(surf, out.front)
    F.offset(surf, 0.35)
    // T.print: the payload is printed in colour; the cutouts in printSkip (a fold) stay debossed
    const skip = T.printSkip || [0]
    const isPrint = l => T.print && !(l.ci != null && skip.includes(l.ci)) && !(l.ci == null && T.printCutsOnly)
    const ink = grooveLines.filter(l => !isPrint(l)), pr = grooveLines.filter(isPrint)
    if (ink.length) out.grooves = clean(F.intersect(partField(ink, T.groove || K.GROOVE, R), surf), false)
    if (pr.length) out.prints = clean(F.intersect(partField(pr, T.wPrint || 1.4, R), surf), false)
    out.grooveLines = grooveLines
  }
  if (screens && out.body) {
    F.intersect(screens, F.offset(F.copy(out.body), 0.6))
    out.screens = clean(screens, false)
  }
  if (holes) out.holes = holes
  // decals: closed cutouts painted as raised coloured shapes (a photo's sun and hills)
  out.decals = Object.entries(decals).map(([mat, rings]) => {
    const G = F.region(rings, R)
    if (out.body) F.intersect(G, F.offset(F.copy(out.body), 0.3))
    return { mat, f: any(G) ? F.exact(G, R) : null }
  }).filter(d => d.f)
  // the whole silhouette
  const sil = F.field(R)
  for (const k of ['body', 'back', 'front', 'badge', 'tubes', 'screens', 'lifted']) if (out[k]) F.union(sil, out[k])
  out.sil = any(sil) ? sil : null
  return out
}
