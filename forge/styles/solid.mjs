// SOLID — universal. The filled companion to Line.
//
// The icon is built as stacked PLATES, and every overlap between plates is
// resolved by a precise occlusion gap — that gap is the style's signature:
//   K (object)   fills ∪ round 2.0 strokes of its centrelines
//   A (parts)    parts outside the fills: touching parts are trimmed back from K
//                by GAP_A (shackles, handles, stands); parts that cross K are
//                inlaid — K is carved around them (external-link arrow, rings)
//   S (signals)  badges become solid discs with the glyph knocked out; badges,
//                modifiers and slashes clear everything under them by GAP_S
// Detail is knocked out of the mass (cutouts: areas, or 1.5u lines), doors that
// sit on a wall break through it, arrowheads close into solid triangles, and
// anything thinner than 0.4u is removed. Everything is computed
// on a signed-distance field (see _solid-field.mjs) and traced to ONE even-odd path.
import { snowmanFor } from './_line-snowman.mjs'
import { polyD, pointInRing, distToPolyline, arclen, simplify, bbox, parsePath, V } from '../kernel/geom.mjs'
import * as F from './_solid-field.mjs'
import { hasText, splitText, openText, glyphLines, glyphWeight, TEXT_REF } from './_live-text.mjs'

export const K = {
  W: 2.0,          // stroke weight of every centreline
  CUT: 1.5,        // knockout line width
  GAP_S: 1.5,      // clearance around badges, modifiers and slashes
  GAP_A: 1.0,      // occlusion gap between an outside A part and the K mass
  SLIVER: 0.2,     // opening radius: removes anything thinner than 2x this
  TOL: 0.03,       // output simplification tolerance
  AUTO: true,      // knock out interior lines when an icon has fills but no cutouts
  HEADS: true,     // close arrowheads into solid triangles
  RESPECT: true,   // leave plate joins alone where the author's cutouts already resolve them
  PARTS: true,     // emit free-standing A / S pieces as their own wm-a / wm-s nodes (motion parts).
                   // Geometry is loop-for-loop identical; only anti-aliasing where two pieces share a
                   // pixel can differ (<= 12/255 alpha on a few pixels at 16px, none from 32px up)
  // Live icons only (the skeleton carries `params`; static icons never take these paths):
  TEXT_CUT: TEXT_REF, // knocked-out glyphs: Line's text weight, so counters and letter gaps read exactly as in Line
  INLAY: 0.75,     // gap around a moving part inlaid in the mass (see autoCut)
  TEXT_GAP: 0.4,   // free text (no fill behind it) is set apart from the mass by this clear gap
  OUTLINE: 0.25,   // a fill whose outline is partly drawn (>= this share runs along K centrelines) is outlined
                   // all round, so open arcs along a badge edge never leave lips where they end
}

const LO = 0.5   // field reach where only the edge matters

const polyArea = r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return a / 2 }
const straight = (pts, tol = 0.05) => pts.length >= 2 && pts.every(p => distToPolyline(p, [pts[0], pts.at(-1)]) <= tol)
const fracInside = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
const at = (G, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  return (i < 0 || j < 0 || i >= F.N || j >= F.N) ? 1 : G[j * F.N + i]
}
const densify = (pts, step = 0.1, closed = false) => {
  const P = closed ? [...pts, pts[0]] : pts, out = []
  for (let i = 0; i + 1 < P.length; i++) {
    const a = P[i], b = P[i + 1], n = Math.max(1, Math.ceil(V.dist(a, b) / step))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  if (!closed) out.push(P.at(-1))
  return out
}
// longest contiguous stretch of a polyline that lies inside a field's ink
const maxRun = (G, pts) => {
  let best = 0, cur = 0
  for (let i = 1; i < pts.length; i++) {
    if (at(G, pts[i]) < 0 && at(G, pts[i - 1]) < 0) { cur += V.dist(pts[i], pts[i - 1]); if (cur > best) best = cur }
    else cur = 0
  }
  return best
}

// a ring that never crosses itself (a command symbol's loops do: knocking it out as an area would blot it)
function simpleRing(r) {
  const n = r.length, cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
    if (i === 0 && j === n - 1) continue
    const a = r[i], b = r[(i + 1) % n], c = r[j], d = r[(j + 1) % n]
    if (cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0) return false
  }
  return true
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

// portions of a closed cutout ring that sit on a wall (the ink between the cut
// and the paper is only the outer half of a stroke): a strip that breaks through
function wallBreaches(ring, mass) {
  const n = ring.length, out = []
  const sgn = polyArea(ring) > 0 ? 1 : -1
  const flags = [], norms = []
  for (let i = 0; i < n; i++) {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const t = V.norm(V.sub(b, a))
    const nrm = [t[1] * sgn, -t[0] * sgn] // points away from the cut
    norms.push(nrm)
    const p = ring[i]
    flags.push(at(mass, [p[0] + nrm[0] * 1.3, p[1] + nrm[1] * 1.3]) > 0 && at(mass, [p[0] + nrm[0] * 0.5, p[1] + nrm[1] * 0.5]) < 0)
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
    const outer = run.map(r => [ring[r][0] + norms[r][0] * 1.6, ring[r][1] + norms[r][1] * 1.6])
    const inner = run.map(r => [ring[r][0] - norms[r][0] * 0.2, ring[r][1] - norms[r][1] * 0.2])
    out.push([...inner, ...outer.reverse()])
  }
  return out
}

// zero-length subpaths ("M12 16 L12 16") stroke as a round dot in Line, but the
// kernel's parser drops them — recover them so a dot is never lost
function dots(icon) {
  const out = []
  for (const p of icon.paths || []) {
    for (const chunk of String(p.d || '').split(/(?=M)/)) {
      const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
      if (!m) continue
      let subs
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) out.push({ pts: [[+m[1], +m[2]]], closed: false, plate: p.plate || 'K', pathId: p.id })
    }
  }
  return out
}

function build(icon) {
  let cut = false // did anything subtract? (only then can slivers exist)
  const live = !!icon.params
  const glyphIds = live ? new Set(glyphLines(icon).map(l => l.pathId)) : null
  const isGlyph = l => !!glyphIds && glyphIds.has(l.pathId)
  const lines = [...(icon.lines || []).filter(l => l.pts && l.pts.length), ...dots(icon)]
  const base = lines.filter(l => l.plate !== 'S')
  const sig = lines.filter(l => l.plate === 'S')
  const fills = (icon.fills || []).filter(f => f.set && f.set.length)
  const hasFill = fills.length > 0

  // --- S plate: badges (outermost closed rings), slashes, glyphs
  const closedS = sig.filter(l => l.closed && l.pts.length > 2)
  const badges = closedS.filter(l => !closedS.some(o => o !== l && Math.abs(polyArea(o.pts)) > Math.abs(polyArea(l.pts)) && fracInside(l.pts, o.pts) > 0.9))
  const slashes = sig.filter(l => !l.closed && straight(l.pts) && arclen(l.pts) >= 8 && !badges.some(b => fracInside(l.pts, b.pts) > 0.5))
  const glyphs = sig.filter(l => !badges.includes(l) && !slashes.includes(l))
  const badgeOf = g => badges.find(b => fracInside(g.pts, b.pts) > 0.5)

  // --- which fills belong to an A part (their outline follows an A centreline)
  const aLines = base.filter(l => l.plate === 'A')
  const aNear = aLines.length && fills.length ? F.strokes(aLines, 0, 0.4) : null
  const kNear = aNear ? F.strokes(base.filter(l => l.plate === 'K'), 0, 0.4) : null
  const near = (pts, G) => pts.filter(p => at(G, p) < 0.35).length / Math.max(1, pts.length)
  const fillPlate = fills.map(f => {
    if (!aNear) return 'K'
    const pts = f.set.flat()
    const a = near(pts, aNear), k = near(pts, kNear)
    return a > 0.6 && a > k ? 'A' : 'K'
  })
  const kFills = fills.filter((f, i) => fillPlate[i] === 'K')
  const autoCut = K.AUTO && hasFill && !(icon.cutouts || []).length
  const fillReach = autoCut ? 1.9 : LO
  const allFill = F.field(fillReach)
  for (const f of fills) F.region(f.set, fillReach, allFill)

  // --- arrowheads: an equal-armed V whose apex meets another line closes into a
  // solid triangle. A lone chevron stays a chevron (a solid caret reads as "play").
  const heads = new Map()
  if (K.HEADS) for (const l of base) {
    const v = !l.closed && chevron(l)
    if (v && base.some(o => o !== l && distToPolyline(v[1], o.pts, o.closed) < 0.3)) heads.set(l, v)
  }
  const partField = (l, w, reach, into = null) => {
    const G = F.strokes([l], w, reach, into)
    const v = heads.get(l)
    if (v) { F.region([v], reach, G); F.strokes([{ pts: v, closed: true }], w, reach, G) }
    return G
  }

  // --- K mass: K fills, K lines, and A lines that live inside the fills
  const inFill = l => { const d = densify(l.pts, 0.25, l.closed); return d.filter(p => at(allFill, p) < -0.3).length / d.length }
  const innerA = l => hasFill && l.plate === 'A' && inFill(l) > 0.6
  const kLines = base.filter(l => l.plate === 'K' || innerA(l) || !hasFill)
  const outerA = hasFill ? base.filter(l => l.plate === 'A' && !innerA(l)) : []
  const kMass = F.field(LO)
  for (const f of kFills) F.region(f.set, LO, kMass)
  if (live && K.OUTLINE) {
    // Live: a fill whose outline is drawn only in part (a ribbon's top and bottom arcs) is outlined all round
    const kl = base.filter(l => l.plate === 'K' && !isGlyph(l))
    const kNear2 = kl.length ? F.strokes(kl, 0, 0.5) : null
    if (kNear2) for (const f of kFills) {
      const pts = f.set.flatMap(r => densify(r, 0.25, true))
      const share = pts.filter(p => at(kNear2, p) < 0.35).length / Math.max(1, pts.length)
      if (share >= K.OUTLINE && share < 0.97) F.strokes(f.set.map(r => ({ pts: r, closed: true })), K.W, LO, kMass)
    }
  }
  for (const l of kLines) partField(l, K.W, LO, kMass)
  // distance to the object, exact out to the gap — only computed around the A parts
  let kDist = null
  if (outerA.length) {
    const kr = K.GAP_A + 0.6, m = K.W / 2 + K.GAP_A + 0.3
    kDist = F.field(kr)
    for (const l of outerA) {
      const b = bbox(l.pts)
      F.setClip([b.x0 - m, b.y0 - m, b.x1 + m, b.y1 + m])
      try {
        for (const f of kFills) F.region(f.set, kr, kDist)
        for (const l2 of kLines) partField(l2, K.W, kr, kDist)
      } finally { F.setClip(null) }
    }
  }

  // --- A parts: trimmed back from K when they touch it, inlaid when they cross it
  const cutGeo = (icon.cutouts || []).flatMap(c => c.subs).filter(s => s.pts.length)
  const cutNear = cutGeo.length ? F.strokes(cutGeo, 0, 1.0) : null
  for (const s of cutGeo) if (s.closed && s.pts.length > 2) F.region([s.pts], 1.0, cutNear) // inside a cut area counts as near
  const parts = []
  const aFills = fills.filter((f, i) => fillPlate[i] === 'A')
  for (const l of outerA) {
    const lNear = aFills.length ? F.strokes([l], 0, 0.4) : null
    const own = aFills.filter(f => near(f.set.flat(), lNear) > 0.5)
    const reach = own.length ? K.GAP_A + 0.3 : LO
    const P = partField(l, K.W, reach)
    for (const f of own) F.union(P, F.region(f.set, reach))
    const pts = densify(l.pts, 0.1, l.closed)
    // does its ink come within the gap of the object's ink, and how deep does it go?
    let close = false
    for (let i = 0; i < P.length; i++) if (P[i] < 0 && kDist[i] < K.GAP_A - 0.05) { close = true; break }
    const depth = pts.reduce((m, p) => Math.max(m, -at(kDist, p)), 0)
    // an author's cutout already resolves how this part meets the object
    const authored = cutNear ? pts.some(p => at(cutNear, p) < 0.9) : false
    let inA = 0, both = 0
    if (own.length) for (let i = 0; i < P.length; i++) if (P[i] < 0) { inA++; if (kDist[i] < 0) both++ }
    parts.push({ l, P, close, depth, authored, run: maxRun(kDist, pts), filled: own.length > 0, overlap: inA ? both / inA : 0 })
  }
  let kDil = null
  for (const pt of parts) {
    if (!pt.close || (pt.authored && K.RESPECT)) continue
    const carve = pt.depth > 1.4 || (pt.filled && pt.overlap > 0.15)
    cut = true
    if (carve) {
      // it sits on the object: the object is carved around it
      F.subtract(kMass, pt.filled ? F.offset(Float32Array.from(pt.P), -K.GAP_A) : partField(pt.l, K.W + 2 * K.GAP_A, 0.6))
    } else if (pt.run <= 1.8 || pt.filled) {
      // it only meets the outline: the part tucks behind the object
      if (!kDil) kDil = F.offset(Float32Array.from(kDist), -K.GAP_A)
      F.subtract(pt.P, kDil)
    }
    // else: it runs along the outline (a stem, a pole) — one continuous mass
  }
  const mass = kMass
  for (const pt of parts) F.union(mass, pt.P)
  // ink that belongs to the A plate (outer parts) and the S plate (badges, modifiers,
  // slashes): only used to tag separate pieces for motion, never to shape the mass
  const aInk = parts.length ? F.field(1) : null
  if (aInk) for (const pt of parts) F.union(aInk, pt.P)
  let sInk = null
  const addS = G => { if (!sInk) sInk = F.field(1); F.union(sInk, G) }

  // --- knockouts
  const cutArea = [], cutLine = [], cutText = [], inlay = []
  // Live: a cutout LINE knocks a drawn line out of the mass; one that traces no drawn line is an orphan (the half of a
  // glyph whose text is not drawn) and is dropped
  const traces = s => (icon.lines || []).some(l => s.pts.every(p => distToPolyline(p, l.pts, l.closed) < 0.15))
  for (const c of icon.cutouts || []) for (const s of c.subs) {
    if (s.closed && s.pts.length > 2) cutArea.push(s.pts)
    else if (live && !s.glyph && !traces(s)) continue
    else if (live && s.glyph) cutText.push(s)
    else cutLine.push(s)
  }
  if (live && cutLine.length) {
    // Live: a closed part outline (a key's backspace or shift symbol) traced by open cutout lines is knocked out as an
    // AREA, a crisp white symbol, not as a groove around a leftover island of ink
    const covered = l => {
      const d = densify(l.pts, 0.25, true)
      return d.every(p => cutLine.some(c => distToPolyline(p, c.pts, c.closed) < 0.1))
    }
    for (const l of base) {
      if (l.plate !== 'A' || !l.closed || l.pts.length < 3 || isGlyph(l) || !simpleRing(l.pts) || !covered(l)) continue
      const d = densify(l.pts, 0.25, true)
      if (d.filter(p => at(allFill, p) < 0).length / d.length < 0.9) continue
      // an authored shape (closed with Z, one ring) that stands alone: no other part line within 1u of it
      const src = (icon.paths || []).find(p => p.id === l.pathId)
      if (!src || !/z\s*$/i.test(String(src.d).trim()) || (src.subs || []).length !== 1) continue
      if (base.some(o => o !== l && o.plate !== 'K' && o.pts.some(p => distToPolyline(p, l.pts, true) < 1))) continue
      cutArea.push(l.pts)
    }
  }
  if (autoCut) {
    // never lose a line: when the author gave no cutouts, an interior centreline
    // is knocked out as a 1.5u line (a calendar header, a document fold, a pupil)
    const inner = F.offset(Float32Array.from(allFill), 1.75) // room for the cut + ink both sides
    for (const l of base) {
      const d = densify(l.pts, 0.25, l.closed)
      if (d.filter(p => at(inner, p) < 0).length / d.length > 0.6) {
        // Live: a moving part inside the mass (a thermometer's column at full) is INLAID (ink, ringed by a clear
        // gap), never knocked out: a knocked-out column reads inverted (a full tube drawn as an empty channel)
        if (live && l.plate === 'A' && !isGlyph(l)) inlay.push(l)
        else (isGlyph(l) ? cutText : cutLine).push(l)
      }
    }
  }
  const cuts = F.region(cutArea)
  if (cutLine.length) F.union(cuts, F.strokes(cutLine, K.CUT))
  if (cutText.length) F.union(cuts, F.strokes(cutText, K.TEXT_CUT))
  for (const b of cutArea.flatMap(r => wallBreaches(r, mass))) F.union(cuts, F.region([b]))
  if (inlay.length) F.union(cuts, F.strokes(inlay, K.W + 2 * K.INLAY))
  if (cutArea.length || cutLine.length || cutText.length || inlay.length) { F.subtract(mass, cuts); cut = true }
  if (inlay.length) { const G = F.strokes(inlay, K.W); F.union(mass, G); if (aInk) F.union(aInk, G) }

  // --- badges: clear a zone, add back a solid disc with the glyph knocked out
  for (const b of badges) {
    cut = true
    F.subtract(mass, F.union(F.region([b.pts]), F.strokes([b], K.W + 2 * K.GAP_S)))
    const disc = F.union(F.region([b.pts]), F.strokes([b], K.W))
    const gl = glyphs.filter(g => badgeOf(g) === b)
    const knock = F.region(gl.filter(g => g.closed && g.pts.length > 2).map(g => g.pts))
    const gLines = gl.filter(g => !(g.closed && g.pts.length > 2))
    const gText = gLines.filter(isGlyph), gOther = gLines.filter(g => !isGlyph(g))
    if (gOther.length) F.union(knock, F.strokes(gOther, K.CUT))
    if (gText.length) F.union(knock, F.strokes(gText, K.TEXT_CUT))
    F.subtract(disc, knock)
    F.subtract(disc, cuts)
    F.union(mass, disc)
    addS(disc)
  }
  // --- free modifiers (S glyphs outside any badge): separated bold strokes
  const free = glyphs.filter(g => !badgeOf(g))
  if (free.length) {
    cut = true
    F.subtract(mass, F.strokes(free, K.W + 2 * K.GAP_S))
    const G = F.strokes(free, K.W)
    F.union(mass, G)
    addS(G)
  }
  // --- slashes: a clean gap either side, then the slash itself
  for (const s of slashes) {
    cut = true
    F.subtract(mass, F.strokes([s], K.W + 2 * K.GAP_S))
    const G = F.strokes([s], K.W)
    F.union(mass, G)
    addS(G)
  }
  return { mass, cut, aInk, sInk }
}

export function solidLoops(icon) {
  return solidPlates(icon).flatMap(p => p.loops)
}

// The mass split by plate for motion (forge/MOTION.md "Parts choreography"): every
// separate piece of ink (8-connected on the field grid) that is made only of A-part
// ink becomes plate A, only of S ink plate S, everything else (and every piece where
// a part runs into the object) stays K. Pieces never touch, so tracing each plate's
// pieces on its own yields exactly the loops of the whole mass.
export function solidPlates(icon) {
  // Live icons: glyphs are always lines (a "D" or "0" whose ends meet is not a filled ring), and FREE text (no fill
  // behind it: "37°" beside a thermometer, "12" under the wind) is set at a weight that keeps its counters open,
  // clear of the mass, instead of being inflated with it
  let free = []
  if (icon.params && hasText(icon)) {
    const gl = glyphLines(icon)
    const sp = splitText(openText(icon))
    const ids = new Set(sp.free.map(g => g.id))
    free = gl.filter(l => ids.has(l.pathId))
    icon = sp.icon
  }
  let { mass, cut, aInk, sInk } = build(icon)
  if (free.length) {
    const clear = F.field(1), byPlate = { A: null, S: null, K: null }
    // a glyph's weight comes from all of its strokes (the degree ring is two arcs)
    const boxOf = new Map()
    for (const l of free) for (const [x, y] of l.pts) {
      const b = boxOf.get(l.pathId) || { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
      b.x0 = Math.min(b.x0, x); b.y0 = Math.min(b.y0, y); b.x1 = Math.max(b.x1, x); b.y1 = Math.max(b.y1, y)
      boxOf.set(l.pathId, b)
    }
    for (const l of free) {
      const w = glyphWeight({ ch: l.ch, cap: l.cap, box: boxOf.get(l.pathId) }, { base: K.W })
      F.strokes([l], w + 2 * K.TEXT_GAP, 1, clear)
      const pl = l.plate === 'S' ? 'S' : l.plate === 'K' ? 'K' : 'A'
      byPlate[pl] = F.strokes([l], w, 1, byPlate[pl])
    }
    F.subtract(mass, clear)
    for (const [pl, G] of Object.entries(byPlate)) {
      if (!G) continue
      F.union(mass, G)
      if (pl === 'A') { if (!aInk) aInk = F.field(1); F.union(aInk, G) }
      if (pl === 'S') { if (!sInk) sInk = F.field(1); F.union(sInk, G) }
    }
    cut = true
  }
  if (cut && K.SLIVER > 0) mass = F.open(mass, K.SLIVER)
  if (!K.PARTS || (!aInk && !sInk)) return [{ plate: 'K', loops: F.trace(mass, K.TOL) }]
  const N = F.N, NN = N * N
  const comp = new Int32Array(NN).fill(-1)
  const stats = [] // per piece: [cells, aCells, sCells]
  const stack = []
  for (let s = 0; s < NN; s++) {
    if (!(mass[s] < 0) || comp[s] >= 0) continue
    const id = stats.length, st = [0, 0, 0]
    stats.push(st)
    comp[s] = id; stack.push(s)
    while (stack.length) {
      const c = stack.pop(), j = (c / N) | 0, i = c - j * N
      st[0]++
      if (sInk && sInk[c] < 0) st[2]++
      else if (aInk && aInk[c] < 0) st[1]++
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const ii = i + di, jj = j + dj
        if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue
        const q = jj * N + ii
        if (comp[q] < 0 && mass[q] < 0) { comp[q] = id; stack.push(q) }
      }
    }
  }
  const plateOf = stats.map(([n, a, s]) => {
    const k = n - a - s
    if (k > n * 0.02) return 'K'
    return s >= a ? 'S' : 'A'
  })
  const plates = ['K', 'A', 'S'].filter(p => plateOf.includes(p))
  if (plates.length < 2) return [{ plate: plates[0] || 'K', loops: F.trace(mass, K.TOL) }]
  return plates.map(p => {
    const G = Float32Array.from(mass)
    for (let c = 0; c < NN; c++) if (comp[c] >= 0 && plateOf[comp[c]] !== p) G[c] = 1
    return { plate: p, loops: F.trace(G, K.TOL) }
  }).filter(p => p.loops.length)
}

export default {
  name: 'solid',
  title: 'Solid',
  kind: 'universal',
  description: 'The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap.',
  strokeWidth: false,
  root: { fill: 'currentColor' },
  render(icon) {
    icon = snowmanFor('solid', icon)
    let plates = []
    try { plates = solidPlates(icon) } catch (e) { plates = [] }
    if (!plates.some(p => p.loops.length)) {
      // last resort: the plain centrelines, so nothing ever renders empty
      let loops = []
      try { loops = F.trace(F.strokes(icon.lines || [], K.W), K.TOL) } catch { loops = [] }
      plates = [{ plate: 'K', loops }]
    }
    // K stays untagged (motion treats untagged geometry as wm-k); A and S pieces that
    // stand apart from the object become their own nodes
    return plates.map(({ plate, loops }) => {
      const a = { d: loops.map(l => polyD(l, true)).join(''), 'fill-rule': 'evenodd' }
      if (plate !== 'K') a.class = plate === 'A' ? 'wm-a' : 'wm-s'
      return ['path', a]
    })
  },
}
