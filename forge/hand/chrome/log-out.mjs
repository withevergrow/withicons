// forge/hand/chrome/log-out.mjs — a chrome door bracket with a solid gunmetal arrow stepping out of it. The generator
// drew the arrow as a thin stroked wire with a dark ring, pale and spindly on white; here the arrow is one fat filled
// shape (shaft and head) in darker gunmetal, so it reads against light backgrounds, and the bracket arms end well clear
// of the arrowhead so the door stays open at 16px. Same model and paint as the generator (_chrome-core.mjs).
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

const DOOR = 'M10.5 3.5 H5.5 A2 2 0 0 0 3.5 5.5 V18.5 A2 2 0 0 0 5.5 20.5 H10.5'
const DOOR_FILL = 'M10.5 3.5 H5.5 A2 2 0 0 0 3.5 5.5 V18.5 A2 2 0 0 0 5.5 20.5 H10.5 V19.5 H5.5 V4.5 H10.5 Z'
const ARROW = 'M8 11.75 H15.5 V8 L20.5 12 L15.5 16 V12.25 H8 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'log-out'
  const Ls = layers(model(skeleton(name, [
    { d: DOOR, plate: 'K' },
    { d: DOOR_FILL, plate: 'K', fill: true },
    { d: ARROW, plate: 'A', fill: true },
  ])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
