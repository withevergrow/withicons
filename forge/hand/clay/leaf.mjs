// forge/hand/clay/leaf.mjs — a plump green clay leaf on a short stem of the same clay, with one centred midrib pressed
// into the face as a crease. The generator laid the skeleton's diagonal vein over the leaf as a fat orange tube that ran
// out past the tip and read as a stick on a leaf; here the vein is a crease along the leaf's centre line and the stem is
// part of the body. Same model, light and colour as the generator (_clay-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'

// a skeleton in the shape the clay model expects: parts [{ d, plate, fill }]
function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// the leaf blade (fill + its rim), a stem of body clay out of the base, the midrib (a K line deep in the blade: a crease)
const BLADE = 'M6 18 C4.5 10.5 10 4 20 4 C20 14 13.5 19.5 6 18 Z'
const STEM = 'M3.5 20.5 L6.75 17.25'
const RIB = 'M7.5 16.5 C10.25 13.25 13.75 9.5 17.5 6.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'leaf'
  return build(skeleton(name, [
    { d: BLADE, plate: 'K', fill: true },
    { d: STEM, plate: 'K' },
    { d: RIB, plate: 'K' },
  ]))
}
