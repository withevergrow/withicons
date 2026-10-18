// forge/hand/clay/scissors.mjs — clay scissors, open: two plump ring handles (real holes) on the left, and two orange
// blades that cross and run out to the right, as in the line layout. The generated scissors fused
// the blades into one stick and filled a handle, so it read as a lollipop; here both handles stay open rings and the
// blades stay two separate arms of an X. Same model and light as the generator (_clay-core.mjs).
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

const RING_T = circ(6, 5.7, 3.1)
const RING_B = circ(6, 18.3, 3.1)
const BLADE_T = 'M8.4 7.8L20.2 16.6'
const BLADE_B = 'M8.4 16.2L20.2 7.4'

export default function render(icon) {
  const name = (icon && icon.name) || 'scissors'
  return build(skeleton(name, [
    { d: RING_T, plate: 'K' },
    { d: RING_B, plate: 'K' },
    { d: BLADE_T, plate: 'A' },
    { d: BLADE_B, plate: 'A' },
  ]))
}
