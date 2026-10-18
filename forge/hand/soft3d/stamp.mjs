// forge/hand/soft3d/stamp.mjs — an upright, symmetrical rubber stamp: a round knob, a short neck, a wide base plate and
// a separate red ink pad bar below, lit as a soft front-facing solid (the generated drawing was a tilted wooden block).
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

function skel(icon, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    ...icon, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const KNOB = 'M12 3.5 A3.25 3.25 0 1 1 11.99 3.5 Z'
const NECK = 'M10.25 8.5 H13.75 V13 H10.25 Z'
const PLATE = 'M5 11.75 H19 A2 2 0 0 1 21 13.75 V16.75 A1 1 0 0 1 20 17.75 H4 A1 1 0 0 1 3 16.75 V13.75 A2 2 0 0 1 5 11.75 Z'
const PAD = 'M5.5 20.5 H18.5'

export default function render(icon) {
  return build(skel({ ...icon, category: 'shapes' }, { paths: [[PAD, 'A']], fills: [KNOB, NECK, PLATE], cutouts: [] }))
}
