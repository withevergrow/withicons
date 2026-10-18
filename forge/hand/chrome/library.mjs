// forge/hand/chrome/library.mjs — a chrome shelf rod with two upright chrome books standing apart on it (a tall one and
// a shorter one, parted by a clean groove) and a gunmetal book leaning beside them with air between. The generated drawing
// fused the two upright spines into one block with a thin seam and let the leaning book touch them, so at 16px the shelf
// read as a single lump with highlight blobs. Same model and paint as the generator (_chrome-core.mjs); only the
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

const SHELF = 'M2.5 20.5H21.5'
const TALL = 'M3.5 20.5V4.5A1 1 0 0 1 4.5 3.5H6A1 1 0 0 1 7 4.5V20.5Z'
const SHORT = 'M10 20.5V8A1 1 0 0 1 11 7H11.25A1 1 0 0 1 12.25 8V20.5Z'
// the leaning book, tipped 12 degrees, resting on the shelf behind the rod
const LEAN = 'M15.6 8.9L18.05 8.38L20.45 19.63L18 20.15Z'
// the parting between the two upright books
const PART = 'M8.5 2.5V18.75'

export default function render(icon) {
  const name = (icon && icon.name) || 'library'
  const Ls = layers(model(skeleton(name, [
    { d: SHELF, plate: 'K' },
    { d: TALL, plate: 'K', fill: true },
    { d: SHORT, plate: 'K', fill: true },
    { d: LEAN, plate: 'A', fill: true },
  ], [PART])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
