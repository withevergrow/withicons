// forge/hand/chrome/tree-pine.mjs — a three-tier chrome pine, each tier its own polished cone cut off from the next
// by a groove, on a gunmetal trunk. The generated tree was one blob whose dark horizon band cut across it like a wedge cap.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const TREE = 'M12 1.8L7.6 8.4H9.8L4.8 14.2H7.6L2.8 19.6H21.2L16.4 14.2H19.2L14.2 8.4H16.4Z'
const TRUNK = 'M10 19.2H14V22.6H10Z'
const PARTS = [
  { d: TREE, plate: 'K', fill: true },
  { d: TRUNK, plate: 'A', fill: true },
]
const CUTS = ['M7 8.6Q12 10 17 8.6', 'M4.4 14.5Q12 16 19.6 14.5']

export default function render(icon) {
  const name = (icon && icon.name) || 'tree-pine'
  const Ls = layers(model(skeleton(name, PARTS, CUTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
