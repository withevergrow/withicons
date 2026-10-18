// forge/hand/chrome/speaker.mjs — a tall chrome cabinet with a gunmetal tweeter dot above a big woofer: a gunmetal
// surround ring round a chrome cone. The generated speaker cut the woofer ring clean through, leaving a white
// keyhole instead of a cabinet. Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
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

const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const BODY = 'M7 2H17A2 2 0 0 1 19 4V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V4A2 2 0 0 1 7 2Z'
const PARTS = [
  { d: BODY, plate: 'K', fill: true },
  { d: disc(12, 14.5, 3.9), plate: 'A' },
  { d: 'M12 6.5V6.51', plate: 'A' },
]
const CUTS = []

export default function render(icon) {
  const name = (icon && icon.name) || 'speaker'
  const Ls = layers(model(skeleton(name, PARTS, CUTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
