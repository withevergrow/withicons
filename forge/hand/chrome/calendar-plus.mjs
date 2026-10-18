// forge/hand/chrome/calendar-plus.mjs — a chrome calendar page carrying a big plus centred in the day area, passed as an
// A part and as a cutout so it renders as a bright inlay in a dark outline like calendar-check's check. The generated
// plus was a thin pale groove, lost in the face's horizon at 24 and 16px. Same model and paint as the generator
// (_chrome-core.mjs); only the geometry is drawn here.
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

const PAGE = 'M5 5H19A2 2 0 0 1 21 7V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V7A2 2 0 0 1 5 5Z'
const HEADER = 'M3 10H21'
const RINGS = 'M8 3V7M16 3V7'
const PLUS = 'M12 12.75V18.25M9.25 15.5H14.75'

export default function render(icon) {
  const name = (icon && icon.name) || 'calendar-plus'
  const Ls = layers(model(skeleton(name, [
    { d: PAGE, plate: 'K', fill: true },
    { d: HEADER, plate: 'K' },
    { d: RINGS, plate: 'A' },
    { d: PLUS, plate: 'A' },
  ], [HEADER, PLUS])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
