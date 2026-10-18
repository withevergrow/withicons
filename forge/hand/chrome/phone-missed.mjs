// forge/hand/chrome/phone-missed.mjs — the chrome handset with a big pink missed-call arrow in the open corner.
// The generated arrow was a small bounce-zigzag wedged against the handset. Here it is a plain diagonal arrow pointing
// down-left at the handset (the universal missed-call mark): a long shaft and a bold right-angle head, in the style's
// pink enamel jewel, set in the empty upper-right quarter with a clear moat to the handset. The handset is the skeleton's
// own; modelling and paint are the style's (_chrome-core).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const PHONE = 'M3 5 A2 2 0 0 1 5 3 H8 A1.5 1.5 0 0 1 9.5 4.5 V6 C9.5 7.25 8.5 7.25 8.5 8.5 A7 7 0 0 0 15.5 15.5 C16.75 15.5 16.75 14.5 18 14.5 H19.5 A1.5 1.5 0 0 1 21 16 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 Z'
const ARROW = 'M20.6 3.4 L13.6 10.4 M13.6 5.4 V10.4 H18.6'

function skeleton(name) {
  const paths = [{ id: 'p0', d: PHONE, plate: 'K' }, { id: 'p1', d: ARROW, plate: 'S' }].map(p => ({ ...p, subs: parsePath(p.d) }))
  const subs = parsePath(PHONE)
  return { name, paths, fills: [{ d: PHONE, subs, set: setOf(subs.map(s => s.pts)) }], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))) }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'phone-missed'
  return emit(layers(model(skeleton(name))), name, 0)
}
