// forge/hand/liquid/messages.mjs — two speech bubbles told apart by material: a back bubble of clear glass (top left) and a
// front bubble of violet glass (bottom right) that overlaps its corner through a clean moat cut in the clear one.
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

const BACK = 'M3 16V5.5A2.5 2.5 0 0 1 5.5 3H13A2.5 2.5 0 0 1 15.5 5.5V9.5A2.5 2.5 0 0 1 13 12H7Z'
const FRONT = 'M21 21.5V11.5A2.5 2.5 0 0 0 18.5 9H11.5A2.5 2.5 0 0 0 9 11.5V15.5A2.5 2.5 0 0 0 11.5 18H17.5Z'
// the front bubble grown by 0.6, cut out of the back one
const MOAT = 'M21.6 22.9V11.5A3.1 3.1 0 0 0 18.5 8.4H11.5A3.1 3.1 0 0 0 8.4 11.5V15.5A3.1 3.1 0 0 0 11.5 18.6H17Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'messages'
  return build(skeleton(name, [
    { d: BACK, plate: 'K', fill: true },
    { d: FRONT, plate: 'A', fill: true },
  ], [MOAT]))
}
