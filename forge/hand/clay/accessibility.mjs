// forge/hand/clay/accessibility.mjs — the universal-access figure on a round clay badge: a round orange head, a
// horizontal arms bar, and a torso that splits into two angled legs, all chunky tubes pressed onto the sphere. The
// generated figure was a tiny dot over a chevron; here the head is a proper ball and the limbs keep their line layout.
// Same model and light as the generator (_clay-core.mjs).
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

const BADGE = circ(12, 12, 9.2)
const HEAD = circ(12, 6.9, 0.8)
const ARMS = 'M7.7 10.7H16.3'
const BODY = 'M12 10.7V13.8'
const LEGS = 'M9.7 18.1L12 13.8L14.3 18.1'

export default function render(icon) {
  const name = (icon && icon.name) || 'accessibility'
  return build(skeleton(name, [
    { d: BADGE, plate: 'K', fill: true },
    { d: HEAD, plate: 'A', fill: true },
    { d: ARMS, plate: 'A' },
    { d: BODY, plate: 'A' },
    { d: LEGS, plate: 'A' },
  ]))
}
