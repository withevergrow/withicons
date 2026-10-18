// forge/hand/chrome/bandage.mjs — a long polished chrome adhesive strip on the diagonal with a gunmetal gauze
// pad set into its middle (a dark parting seam all round) and four vent holes punched through the pad. The generated
// drawing ran the pad edge to edge as two white grooves and left the pad itself chrome, so the strip read as a dice
// capsule; here the pad is a second metal clearly inset in the tape, the one detail that makes it a bandage. Same
// model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
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

// the strip: a long rounded bar on the rising diagonal
const STRIP = 'M18.54 5.46L19.21 6.46L19.45 7.65L19.21 8.84L18.54 9.84L9.84 18.54L8.84 19.21L7.65 19.45L6.46 19.21L5.46 18.54L4.79 17.54L4.55 16.35L4.79 15.16L5.46 14.16L14.16 5.46L15.16 4.79L16.35 4.55L17.54 4.79Z'
// the gauze pad, inset across the middle
const PAD = 'M14.72 11.05L14.83 11.21L14.87 11.4L14.83 11.59L14.72 11.75L11.75 14.72L11.59 14.83L11.4 14.87L11.21 14.83L11.05 14.72L9.28 12.95L9.17 12.79L9.13 12.6L9.17 12.41L9.28 12.25L12.25 9.28L12.41 9.17L12.6 9.13L12.79 9.17L12.95 9.28Z'
// four vent holes through the pad
const HOLES = [
  'M14.23 11.89A.5 .5 0 1 1 13.23 11.89A.5 .5 0 1 1 14.23 11.89Z',
  'M12.61 10.27A.5 .5 0 1 1 11.61 10.27A.5 .5 0 1 1 12.61 10.27Z',
  'M12.39 13.73A.5 .5 0 1 1 11.39 13.73A.5 .5 0 1 1 12.39 13.73Z',
  'M10.77 12.11A.5 .5 0 1 1 9.77 12.11A.5 .5 0 1 1 10.77 12.11Z',
]

export default function render(icon) {
  const name = (icon && icon.name) || 'bandage'
  const Ls = layers(model(skeleton(name, [
    { d: STRIP, plate: 'K', fill: true },
    { d: PAD, plate: 'A', fill: true },
  ], HOLES)))
  return emit(Ls, name, 0)
}
