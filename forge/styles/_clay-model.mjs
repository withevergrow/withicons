// CLAY model: a prepared skeleton -> material pieces as signed distance fields
// (_clay-field.mjs, negative = inside).
//
//   K    the main clay body: K fills + K strokes as plump round tubes
//   Ab   secondary (A) pieces that lie off the body: behind it (a shackle, a handle)
//   Af   secondary (A) pieces that lie on the body: pressed on top (a door, a flap)
//   S    badges and modifiers: candy spheres / pills, cleared from everything below by a moat
//   Sg   glyphs inside a badge (a plus, a check): raised white piping on the candy
//   pits small closed cutouts / short slots: dark glossy pits (eyes, keyholes)
//   dents large closed cutouts with nothing in them: a recessed panel pressed into the body
//   creases open cutouts and inner K lines: a pressed crease
//
// Skeleton cutouts usually trace the mass of an A detail (a door, a sun, a lens ring), so a
// closed cutout that hugs an A line becomes that A piece's body instead of a hole.
import { parsePath, distToPolyline, pointInRing, area, simplify, arclen, resample } from '../kernel/geom.mjs'
import { setOf } from '../kernel/bool.mjs'
import * as F from './_clay-field.mjs'
import { tuneFor } from './_clay-tune.mjs'
import { hasText, glyphLines, glyphWeight, isGlyphSub } from './_live-text.mjs'

export const K = {
  SCALE: 0.84,          // drawing scale about the centre (room for the wall and ground shadow)
  TX: 0, TY: -0.95,     // move up so object + wall + shadow sit centred
  WK: 2.55,             // clay tube width (K strokes)
  WA: 2.3,              // A tube width
  WS: 2.3,              // S glyph width
  WG: 1.25,             // glyph piping inside a badge
  MOAT: 0.5,            // gap cleared around S overlays
  M: 0.9,               // field margin while building
  REACH: 1.6,           // exact-distance reach
}

const polyArea = r => Math.abs(area(r))
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
export const at = (Fd, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  if (i < 0 || j < 0 || i >= F.N || j >= F.N) return 1
  return Fd[j * F.N + i]
}
export const exact = (Fd, reach = K.REACH) => F.any(Fd) ? F.redistance(Fd, F.contour(F.copy(Fd)).map(l => simplify(l, 0.006, true)), reach) : Fd
const minus = (A, B) => F.subtract(F.copy(A), B)

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

export function model(icon, T = tuneFor(icon.name)) {
  const s = K.SCALE * (T.scale || 1)
  const tf = p => [(p[0] - 12) * s + 12 + K.TX + (T.dx || 0), (p[1] - 12) * s + 12 + K.TY + (T.dy || 0)]
  const plateOf = l => (T.plate && T.plate[l.pathId]) || l.plate || 'K'
  // Live icons: glyph strokes are lettering, never clay mass (handled apart below)
  const live = hasText(icon)
  const glyph0 = live ? glyphLines(icon) : []
  const textIds = new Set(glyph0.map(g => g.pathId))
  const all = [...(icon.lines || []), ...dots(icon)].filter(l => l.pts && l.pts.length && !textIds.has(l.pathId))
    .map(l => ({ ...l, plate: plateOf(l), pts: l.pts.map(tf) }))
  const glyphs = glyph0.map(g => ({ ...g, pts: g.pts.map(tf), w: glyphWeight({ ...g, pts: g.pts }) * s }))
  const Kl = all.filter(l => l.plate === 'K')
  let Al = all.filter(l => l.plate === 'A')
  const Sl = all.filter(l => l.plate === 'S')
  const dense = l => { const r = l.pts.length > 1 ? resample(l.pts, 0.25, l.closed).map(o => o.p) : l.pts; return r.length ? r : l.pts }

  // fills: each belongs to the plate whose lines run closest to its edge
  const fills = { K: [], A: [], S: [] }
  for (const f of icon.fills || []) {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(x => x.pts)).filter(r => r && r.length > 2).map(r => r.map(tf))
    if (!rings.length) continue
    const votes = { K: 0, A: 0, S: 0 }
    for (const r of rings) for (let i = 0; i < r.length; i += 3) {
      let best = Infinity, pl = 'K'
      for (const l of all) { const d = distToPolyline(r[i], l.pts, l.closed); if (d < best) { best = d; pl = l.plate } }
      votes[pl]++
    }
    fills[T.fillPlate || (votes.S > votes.K + votes.A ? 'S' : votes.A > votes.K ? 'A' : 'K')].push(rings)
  }

  // cutouts
  const cutArea = [], cutLine = []
  if (!T.noCutouts) for (const c of icon.cutouts || []) {
    for (const x of c.subs || []) {
      if (!x.pts || !x.pts.length) continue
      if (live && isGlyphSub(x, glyph0)) continue
      const pts = x.pts.map(tf)
      if (x.closed && pts.length > 2) cutArea.push(pts); else cutLine.push({ pts, closed: false })
    }
  }
  // closed cutouts grouped as even-odd sets (a lens ring = two circles of one cutout)
  const cutSets = []
  for (const c of T.noCutouts ? [] : icon.cutouts || []) {
    const rings = (c.subs || []).filter(x => x.closed && x.pts.length > 2 && !(live && isGlyphSub(x, glyph0))).map(x => x.pts.map(tf))
    if (rings.length) cutSets.push(rings)
  }

  const mass = F.field(K.M)
  for (const r of fills.K) F.region(r, K.M, mass)
  const inMass = l => { const P = dense(l); return P.filter(p => at(mass, p) < -0.4).length / P.length }

  // A lines along an open cutout: a short one is a slot (a keyhole: a pit); a long one is a piece
  const along = (l, c) => c.pts.every(p => distToPolyline(p, l.pts, l.closed) < 0.45) || l.pts.every(p => distToPolyline(p, c.pts) < 0.45)
  const slots = []
  const usedCut = new Set()
  Al = Al.filter(l => {
    const cs = cutLine.filter(c => along(l, c))
    if (!cs.length) return true
    if (T.aCrease) return false            // the cut stays: a pressed crease (a brain's folds)
    for (const c of cs) usedCut.add(c)
    if (arclen(l.pts, l.closed) < 3.4 && !T.inlay) { slots.push(l); return false }
    return true
  })
  const creaseLines = cutLine.filter(c => !usedCut.has(c))

  // closed cutouts: hugging an A line -> that A piece's mass; small and empty -> a pit; large -> a dent
  const aFillSets = [], pitSets = [], dentSets = [], holeSets = []
  for (const set of cutSets) {
    const pts = set.flatMap(r => r.filter((_, i) => i % 2 === 0))
    const near = Al.length ? pts.filter(p => Al.some(l => distToPolyline(p, l.pts, l.closed) < 1.35)).length / pts.length : 0
    const outer = set.reduce((a, r) => Math.max(a, polyArea(r)), 0)
    const ar = set.reduce((a, r) => a + polyArea(r), 0) - (set.length > 1 ? 2 * (set.reduce((a, r) => a + polyArea(r), 0) - outer) : 0)
    // a cutout that runs out past the mass cuts clean through it (gaps between wifi arcs, chart bars)
    const outside = pts.filter(p => at(mass, p) > 0.05).length / pts.length
    if (near > 0.55 && ar >= (T.pitMax || 6.5)) aFillSets.push(set)
    else if (outside > 0.12 || (T.holes && !T.pits)) holeSets.push(set)
    else if (ar < (T.pitMax || 6.5) || T.pits) pitSets.push(set)
    else dentSets.push(set)
  }
  // A lines that lie inside a pit are the pit (bot eyes): drop them
  if (pitSets.length) Al = Al.filter(l => !pitSets.some(set => fracInside(dense(l), set[0]) > 0.7))

  // K lines lying inside the mass are inner detail: creases, not fused away
  const deep = l => { const P = dense(l); return P.filter(p => at(mass, p) < -0.85).length / P.length }
  const inner = T.noCrease ? [] : Kl.filter(l => fills.K.length && inMass(l) > 0.7 && deep(l) > 0.6 && !l.closed)
  const KlBody = Kl.filter(l => !inner.includes(l))

  // A on the body = pressed on top (front); off the body = behind
  const front = [], back = [], cloth = []
  // people: A parts low on the figure (shoulders, a collar) are clothing, a material of their own
  if (T.clothes) {
    const yMid = tf([12, 15.5])[1], yTop = tf([12, 13])[1]
    Al = Al.filter(l => {
      const ys = dense(l).map(p => p[1]), mean = ys.reduce((a, b) => a + b, 0) / ys.length
      if (mean > yMid && Math.min(...ys) > yTop) { cloth.push(l); return false }
      return true
    })
  }
  for (const l of Al) (T.aFront === true || (T.aFront !== false && inMass(l) > 0.3) ? front : back).push(l)

  // S: outermost closed rings are badges (filled discs); the rest are glyphs
  const closedS = Sl.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && polyArea(o.pts) > polyArea(l.pts) && fracInside(l.pts, o.pts) > 0.9))
  const inBadge = Sl.filter(l => !badges.includes(l) && badges.some(b => fracInside(dense(l), b.pts) > 0.8))

  // lettering: in a badge -> piping on the candy; on a face -> printed in ink; free -> small clay letters
  const face = F.copy(mass)
  for (const r of fills.A) F.region(r, K.M, face)
  for (const set of aFillSets) F.region(set, K.M, face)
  const gBadge = [], gPrint = [], gFree = []
  const byId = new Map()
  for (const g of glyphs) { if (!byId.has(g.pathId)) byId.set(g.pathId, []); byId.get(g.pathId).push(g) }
  for (const gs of byId.values()) {
    const P = gs.flatMap(g => g.pts)
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of P) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    const c = [(x0 + x1) / 2, (y0 + y1) / 2]
    if (gs[0].plate === 'S' || badges.some(b => pointInRing(c, b.pts))) gBadge.push(...gs)
    else if (at(face, c) < 0) gPrint.push(...gs)
    else gFree.push(...gs)
  }
  const strokeEach = (ls, margin, k = 1) => { if (!ls.length) return null; const G = F.field(margin); for (const l of ls) F.strokes([l], l.w * k, margin, G); return G }

  // ---- fields
  const fK = F.strokes(KlBody, T.wk || K.WK, K.M)
  F.union(fK, mass)
  const fAf = F.strokes(front, T.wa || K.WA, K.M)
  const fAb = F.strokes(back, T.wa || K.WA, K.M)
  for (const set of aFillSets) F.region(set, K.M, fAf)
  const fAc = F.strokes(cloth, T.wa || K.WA, K.M)
  for (const r of fills.A) {
    const pts = r.flat()
    if (cloth.length && pts.filter(p => cloth.some(l => distToPolyline(p, l.pts, l.closed) < 0.6)).length > pts.length * 0.5) { F.region(r, K.M, fAc); continue }
    const nf = front.length ? pts.filter(p => front.some(l => distToPolyline(p, l.pts, l.closed) < 0.6)).length : 0
    const nb = back.length ? pts.filter(p => back.some(l => distToPolyline(p, l.pts, l.closed) < 0.6)).length : 0
    F.region(r, K.M, nf >= nb && front.length ? fAf : (back.length ? fAb : fAf))
  }
  const MS = K.MOAT + K.M
  const fS = F.strokes(Sl.filter(l => !badges.includes(l) && !inBadge.includes(l)), T.ws || K.WS, MS)
  for (const b of badges) { F.region([b.pts], MS, fS); F.strokes([b], T.ws || K.WS, MS, fS) }
  for (const r of fills.S) F.region(r, MS, fS)
  let fSg = inBadge.length ? F.strokes(inBadge, T.wg || K.WG, K.M) : null
  if (gBadge.length) { const G = strokeEach(gBadge, K.M, 0.85); fSg = fSg ? F.union(fSg, G) : G }
  // a badge holding lettering is a disc even when the skeleton draws it as a ring
  const fPrint = strokeEach(gPrint, K.M, 0.9)
  const fFree = strokeEach(gFree, K.M, 1)

  // pits, dents, creases
  const fPit = F.field(K.M)
  for (const set of pitSets) F.region(set, K.M, fPit)
  if (slots.length) F.strokes(slots, T.wslot || 1.35, K.M, fPit)
  // eyes pressed into an A piece (a penguin's white face, an owl's goggles): dark pits drawn on top of that piece
  const fPitA = F.field(K.M)
  for (const [cx, cy, rx, ry = rx] of T.eyes || []) {
    const ring = []
    for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2; ring.push(tf([cx + rx * Math.cos(t), cy + ry * Math.sin(t)])) }
    F.region([ring], K.M, fPitA)
  }
  const fDent = F.field(K.M)
  for (const set of dentSets) F.region(set, K.M, fDent)
  const fCrease = F.field(K.M)
  const creases = [...creaseLines, ...inner]
  if (creases.length) F.strokes(creases, T.wcrease || 0.95, K.M, fCrease)

  // S clears a moat through what lies below it
  const hasS = F.any(fS)
  let K0 = fK, Af = fAf, Ab = fAb
  if (holeSets.length) { const H = F.field(K.M); for (const set of holeSets) F.region(set, K.M, H); K0 = minus(K0, H) }
  if (hasS) {
    const moat = F.offset(F.copy(fS), -K.MOAT)
    K0 = minus(K0, moat); Af = minus(Af, moat); Ab = minus(Ab, moat); F.subtract(fAc, moat)
  }
  // only what lies on the body is pressed into it
  const onK = G => F.any(G) ? exact(F.intersect(F.copy(G), F.offset(F.copy(K0), 0.15))) : G
  return {
    T, live,
    print: fPrint ? exact(fPrint) : null, free: fFree ? exact(fFree) : null,
    K: exact(K0), Af: exact(Af), Ab: exact(Ab), Ac: exact(fAc), S: exact(fS), Sg: fSg ? exact(fSg) : null,
    pit: onK(fPit), pitA: F.any(fPitA) ? exact(fPitA) : null, dent: onK(fDent), crease: F.any(fCrease) ? exact(F.intersect(fCrease, F.offset(exact(K0), 0.5))) : fCrease,
  }
}
