// forge/hand/soft3d/trophy.mjs — a gold cup as one solid: a tapered bowl, two open ear handles, a short plain stem and a
// plinth, so it reads as a trophy instead of the generated lumpy handles over a twisted S stem. Built with the house
// soft3d object recipe (forge/styles/_soft3d-core.mjs build) from a hand-made skeleton.
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

// the bowl: wide rim on top, rounded taper into the stem
const CUP = 'M6.5 3 H17.5 V8 C17.5 11.5 15.25 13.75 12 13.75 C8.75 13.75 6.5 11.5 6.5 8 Z'
// the ear handles: open C rings that overlap the bowl, so each reads as a loop with a hole
const EAR_L = 'M7.5 4.5 H5 A3.25 3.25 0 0 0 5 11 H8 V9.25 H5 A1.5 1.5 0 0 1 5 6.25 H7.5 Z'
const EAR_R = 'M16.5 4.5 H19 A3.25 3.25 0 0 1 19 11 H16 V9.25 H19 A1.5 1.5 0 0 0 19 6.25 H16.5 Z'
// the stem and the plinth
const STEM = 'M10.5 13 H13.5 V17.25 H10.5 Z'
const BASE = 'M8.75 17.25 H15.25 A1.25 1.25 0 0 1 16.5 18.5 V19.75 A1.25 1.25 0 0 1 15.25 21 H8.75 A1.25 1.25 0 0 1 7.5 19.75 V18.5 A1.25 1.25 0 0 1 8.75 17.25 Z'
const ALL = [CUP, EAR_L, EAR_R, STEM, BASE]

export default function render(icon) {
  return build(skel(icon, { paths: [], fills: ALL, cutouts: [] }))
}

function skel(icon, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: icon.name, category: icon.category, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}
