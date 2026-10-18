// forge/hand/clay/message-circle.mjs — a round clay chat bubble with a clear moulded tail at the lower left, the way the
// line version has it. The generated bubble was a bare sphere with a barely-there nub; here the tail is a fat pulled
// bump that reads at 16px. Same model and light as the generator (_clay-core.mjs).
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

const BUBBLE = circ(12, 11, 8.4)
const TAIL = 'M5.6 14.6L3.4 20.8L9.8 18.4Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'message-circle'
  return build(skeleton(name, [
    { d: BUBBLE, plate: 'K', fill: true },
    { d: TAIL, plate: 'K', fill: true },
  ]))
}
