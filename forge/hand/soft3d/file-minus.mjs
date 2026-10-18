// forge/hand/soft3d/file-minus.mjs — the teal page as a soft slab with a long, thick dark minus bar across its middle
// (the same dark as file-plus's plus) and a white folded corner. The generated minus was a short pale lozenge that read
// as a button or a generic dash; a wide, crisp bar in the dark role says "remove" at 24px and 16px.
// Built with the house soft3d front-slab recipe (forge/styles/_soft3d-core.mjs build) from a hand-made skeleton.
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const PAGE = 'M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z'
// the minus: a closed bar (filled, plus the 2u A stroke around it) -> 10u x 3u visible
const MINUS = 'M8.5 13.75 H15.5 A0.5 0.5 0 0 1 15.5 15.25 H8.5 A0.5 0.5 0 0 1 8.5 13.75 Z'
const FOLD = 'M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19'

export default function render(icon) {
  // the minus first so it takes the dark part role (c2), the fold the light one (c3)
  return build(skel(icon, { paths: [[PAGE, 'K'], [MINUS, 'A'], [FOLD, 'A']], fills: [PAGE], cutouts: [FOLD] }))
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
