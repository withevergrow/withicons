// forge/hand/chrome/file-lock.mjs — a polished chrome page with its dog-eared fold and a big solid gunmetal padlock
// set proud on its face in a dark seam: a wide case with a keyhole slot and a tall shackle arch. The generated drawing
// cut the case out as a hole and laid a thin gunmetal ring in it, with the shackle only a groove, so the lock read as
// a faint outline at 24px and vanished at 16px. Same model and paint as the generator (_chrome-core.mjs); only the
// geometry is drawn here.
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

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const GROOVE = 'M14 1.5V6A1.5 1.5 0 0 0 15.5 7.5H20.5'
const CASE = 'M9 14H15A1 1 0 0 1 16 15V17.75A1 1 0 0 1 15 18.75H9A1 1 0 0 1 8 17.75V15A1 1 0 0 1 9 14Z'
const SHACKLE = 'M9.5 14V11.5A2.5 2.5 0 0 1 14.5 11.5V14'
const KEYHOLE = 'M12 15.85V16.85'
// the air inside the shackle, cut through like the chrome lock's (a chrome window there read as a second keyhole)
const WINDOW = 'M10.625 12.875V11.5A1.375 1.375 0 0 1 13.375 11.5V12.875Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'file-lock'
  const Ls = layers(model(skeleton(name, [
    { d: PAGE, plate: 'K', fill: true },
    { d: CASE, plate: 'A', fill: true },
    { d: SHACKLE, plate: 'A' },
  ], [GROOVE, KEYHOLE, WINDOW])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
