// forge/hand/chrome/beer.mjs — a chrome beer mug: a cloud of foam crowning the glass, parted from it by a groove, two
// glass slots and a looped handle. The generated mug turned the foam into a gunmetal outline and read as a metal
// tankard. Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
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

const FOAM = 'M4 9.5C2.5 7.5 4.5 4.5 7 5.5C8 3 12.5 2.5 13.5 5C15.5 4.5 17.5 7 16 9.5Z'
const GLASS = 'M4 9.5V19.5A2 2 0 0 0 6 21.5H14A2 2 0 0 0 16 19.5V9.5Z'
const PARTS = [
  { d: FOAM + GLASS, plate: 'K', fill: true },
  { d: 'M16 11.5H18A2 2 0 0 1 20 13.5V16A2 2 0 0 1 18 18H16', plate: 'K' },
]
const CUTS = ['M3 9.5H17', 'M8 13.5V17.5', 'M12 13.5V17.5']

export default function render(icon) {
  const name = (icon && icon.name) || 'beer'
  const Ls = layers(model(skeleton(name, PARTS, CUTS)))
  // the foam sloshes a beat behind the mug: every piece lying wholly above the groove is the moving part
  const foam = L => L.loops.every(r => r.every(p => p[1] < 9.9))
  for (const L of Ls.list) if (!L.cls) L.cls = foam(L) ? 'wm-a' : 'wm-k'
  return emit(Ls, name, 0)
}
