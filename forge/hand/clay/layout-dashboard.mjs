// forge/hand/clay/layout-dashboard.mjs — four plump clay panels: tall top-left, short top-right, short bottom-left, tall bottom-right.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'

// a skeleton in the shape the clay model expects: parts [{ d, plate, fill }]
function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r = (x, y, w, h, k = 1.5) => `M${x + k} ${y} H${x + w - k} Q${x + w} ${y} ${x + w} ${y + k} V${y + h - k} Q${x + w} ${y + h} ${x + w - k} ${y + h} H${x + k} Q${x} ${y + h} ${x} ${y + h - k} V${y + k} Q${x} ${y} ${x + k} ${y} Z`
export default function render(icon) {
  const name = (icon && icon.name) || 'layout-dashboard'
  return build(skeleton(name, [
    { d: r(3, 3, 7, 8.5), plate: 'K', fill: true },
    { d: r(14, 3, 7, 4.5), plate: 'K', fill: true },
    { d: r(3, 15.5, 7, 4.5), plate: 'K', fill: true },
    { d: r(14, 11.5, 7, 8.5), plate: 'K', fill: true },
  ]))
}
