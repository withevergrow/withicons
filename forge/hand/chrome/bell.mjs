// forge/hand/chrome/bell.mjs — a polished chrome bell with a crown knob, a dark groove that sets off the flared lip,
// and a gunmetal clapper ball hanging clear below the mouth. The generated bell hid its clapper behind the lip and
// had no crown or rim line, so the pale dome washed out on white and read as a cloche or a lamp shade at 16px.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const BODY = 'M12 4.75C8.75 4.75 6.75 7.25 6.75 10.75V14C6.75 15.75 5.75 16.75 4.5 17.25V18.25H19.5V17.25C18.25 16.75 17.25 15.75 17.25 14V10.75C17.25 7.25 15.25 4.75 12 4.75Z'
const KNOB = disc(12, 3.6, 1.1)
const CLAPPER = disc(12, 20.6, 1.35)

function skeleton(name) {
  const paths = [
    { id: 'p0', d: BODY, plate: 'K' }, { id: 'p1', d: KNOB, plate: 'A' },
    { id: 'p3', d: CLAPPER, plate: 'A' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(BODY), fill(KNOB), fill(CLAPPER)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'bell'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
