// forge/hand/chrome/picture-in-picture.mjs: a chrome screen frame with an open window, and a bright enamel mini-player plate set in its lower-right corner with a clear gap from the frame.
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
const FRAME = 'M4.5 3.5H19.5Q22 3.5 22 6V18Q22 20.5 19.5 20.5H4.5Q2 20.5 2 18V6Q2 3.5 4.5 3.5Z'
const WIN = 'M5.2 6.2Q4.6 6.2 4.6 6.8V17.2Q4.6 17.8 5.2 17.8H18.8Q19.4 17.8 19.4 17.2V6.8Q19.4 6.2 18.8 6.2Z'
const INSET = 'M12.6 11.2H17Q17.7 11.2 17.7 11.9V15.4Q17.7 16.1 17 16.1H12.6Q11.9 16.1 11.9 15.4V11.9Q11.9 11.2 12.6 11.2Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'picture-in-picture'
  const Ls = layers(model(skeleton(name, [{ d: FRAME, plate: 'K', fill: true }, { d: INSET, plate: 'S', fill: true }], [WIN])))
  return emit(Ls, name, 0)
}
