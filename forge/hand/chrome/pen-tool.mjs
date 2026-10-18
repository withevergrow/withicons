// forge/hand/chrome/pen-tool.mjs: a clean chrome pen nib (diamond, point down-left) with a round breather hole and a slit running to the tip, and a separate gunmetal grip block behind it.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const circ = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`
const NIB = 'M3.6 20.4L6.2 9.8L12.6 7.2L16.8 11.4L14.2 17.8Z'
const GRIP = 'M13.9 5.9L16.1 3.7Q16.8 3 17.5 3.7L20.3 6.5Q21 7.2 20.3 7.9L18.1 10.1Z'
const SLIT = 'M4.9 19.1L9 15'

export default function render(icon) {
  const name = (icon && icon.name) || 'pen-tool'
  const Ls = layers(model(skeleton(name, [{ d: NIB, plate: 'K', fill: true }, { d: GRIP, plate: 'A', fill: true }], [circ(10.3, 13.7, 1.55), SLIT])))
  return emit(Ls, name, 0)
}
