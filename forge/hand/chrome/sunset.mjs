// forge/hand/chrome/sunset.mjs — a chrome half sun on the horizon with two gunmetal rays and a big hot-pink enamel
// arrow dropping onto it, above a short lower line. The generated arrow was a thin glyph and the dome a muddy grey
// cap. Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
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

const SUN = 'M6.5 17A5.5 5.5 0 0 1 17.5 17Z'
const ARROW = 'M10.7 1.5H13.3V5.4H16.2L12 9.4L7.8 5.4H10.7Z'
const PARTS = [
  { d: SUN, plate: 'K', fill: true },
  { d: 'M2.5 17H21.5', plate: 'K' },
  { d: 'M8 21H16', plate: 'K' },
  { d: 'M6.3 11.3L4.9 9.9M17.7 11.3L19.1 9.9', plate: 'A' },
  { d: ARROW, plate: 'S', fill: true },
]
const CUTS = []

export default function render(icon) {
  const name = (icon && icon.name) || 'sunset'
  const Ls = layers(model(skeleton(name, PARTS, CUTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
