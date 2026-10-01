// Robust polygon booleans over REGION SETS.
// A set is a list of rings; nesting defines holes (even-odd). Never union rings
// from different sets pairwise — that fills holes back in. Always pass whole sets.
import PolyBool from 'polybooljs'
import { Q, ribbon } from './geom.mjs'

const S = rings => ({ regions: rings.map(r => r.map(p => [Q(p[0]), Q(p[1])])), inverted: false })
const clean = set => set.filter(r => r.length > 2)

export const normalize = ring => ring.length > 2 ? clean(PolyBool.union(S([ring]), S([ring])).regions) : []
export const setOf = rings => rings.length ? clean(PolyBool.union(S(rings), S([])).regions) : []
export const unionSets = sets => clean(sets.filter(s => s && s.length)
  .reduce((a, s) => a.length ? PolyBool.union(S(a), S(s)).regions : s, []))
export const differenceSets = (a, b) => (a.length && b.length) ? clean(PolyBool.difference(S(a), S(b)).regions) : a
export const intersectSets = (a, b) => (a.length && b.length) ? clean(PolyBool.intersect(S(a), S(b)).regions) : []
export const xorSets = (a, b) => clean(PolyBool.xor(S(a), S(b)).regions)

// A ribbon result -> region set (annulus handled correctly)
export const solid = rb => rb.annulus
  ? differenceSets(normalize(rb.outer), normalize(rb.inner))
  : normalize(rb.outer)

// constant-width stroke of a centreline -> region set
export const strokeSet = (pts, w, closed = false) => solid(ribbon(pts, () => w, null, closed))

// round-capped stroke: ribbon + disc at each free end
import { circle } from './geom.mjs'
export const roundStrokeSet = (pts, w, closed = false) => {
  const body = strokeSet(pts, w, closed)
  if (closed) return body
  return unionSets([body, normalize(circle(pts[0][0], pts[0][1], w / 2, 0.15)), normalize(circle(pts.at(-1)[0], pts.at(-1)[1], w / 2, 0.15))])
}

// dilate / erode a region set by r using a ribbon of its own boundary
const rim = (set, r) => unionSets(set.map(ring => {
  const rb = ribbon(ring, () => r * 2, null, true)
  return differenceSets(normalize(rb.outer), normalize(rb.inner))
}))
export const dilate = (set, r) => r <= 0 ? set : unionSets([set, rim(set, r)])
export const erode = (set, r) => r <= 0 ? set : differenceSets(set, rim(set, r))
export const translateSet = (set, dx, dy) => set.map(r => r.map(p => [p[0] + dx, p[1] + dy]))
