// forge/hand/chrome/rewind.mjs — two separate chrome arrowheads pointing left, the exact mirror of chrome fast-forward:
// a gunmetal back arrow and a leading chrome arrow parted by a clear gap. The generated drawing fused the two touching
// triangles into one inflated blob that read as an "M" at 24 and 16px.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const LEAD = 'M11 5.5V18.5L2.5 12Z'   // leading arrow (front, chrome)
const BACK = 'M21.5 5.5V18.5L13 12Z'  // trailing arrow (gunmetal)

function skeleton(name) {
  const paths = [{ id: 'p0', d: BACK, plate: 'A' }, { id: 'p1', d: LEAD, plate: 'K' }]
    .map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(BACK), fill(LEAD)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'rewind'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
