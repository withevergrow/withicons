// forge/hand/clay/file-image.mjs — a plump clay page with a clipped top-right corner and a folded flap, a round pink
// sun ball in the upper left (well away from the fold) and an orange clay mountain range along the foot. The generated
// page lost the fold and smeared the sun and ridge into one blob; here each is its own clean lump. Same model and light as the generator.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'

// a skeleton in the shape the clay model expects: parts [{ d, plate, fill }]
function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const circ = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`

const PAGE = 'M7 2.8H13.6L19 8.2V19.6A2 2 0 0 1 17 21.6H7A2 2 0 0 1 5 19.6V4.8A2 2 0 0 1 7 2.8Z'
const FLAP = 'M14 3.5V6.9A1 1 0 0 0 15 7.9H18.4Z'
const SUN = circ(9.2, 9.6, 1.05)
const HILLS = 'M7.6 18.9L11.2 13.9L13.8 16.9L15.8 14.6L17.4 18.9Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'file-image'
  return build(skeleton(name, [
    { d: PAGE, plate: 'K', fill: true },
    { d: FLAP, plate: 'A', fill: true },
    { d: SUN, plate: 'S', fill: true },
    { d: HILLS, plate: 'A', fill: true },
  ]))
}
