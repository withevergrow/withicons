// forge/hand/liquid/message-circle-more.mjs — a round clear-glass speech bubble with a long, clear tail at the lower left
// and three big violet glass dots (typing), each set in its own moat so they stay legible at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`

const BUBBLE = 'M8.63 19.84A9 9 0 1 0 5.64 17.86L2.8 22Z'
const DOTS = 'M7.3 11.5H7.31M12 11.5H12.01M16.7 11.5H16.71'

export default function render(icon) {
  const name = (icon && icon.name) || 'message-circle-more'
  return build(skeleton(name, [
    { d: BUBBLE, plate: 'K', fill: true },
    { d: DOTS, plate: 'A' },
    { d: disc(7.3, 11.5, 0.4) + disc(12, 11.5, 0.4) + disc(16.7, 11.5, 0.4), plate: 'A', fill: true },
  ]))
}
