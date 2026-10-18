// chrome zap-off: a solid zigzag bolt, cut clear where the accent slash crosses it so bolt and slash stay separate
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const C = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
// chrome zap-off: a solid zigzag bolt, cut clear where the accent slash crosses it so bolt and slash stay separate
const PARTS = [
  { d: 'M13 3 L5 13.5 H11 L10 21 L18.5 10.5 H12.5 Z', fill: true },
  { d: 'M3 3 L21 21', plate: 'S' },
]
const CUTS = ['M3.6 1.4 L22.6 20.4 L20.4 22.6 L1.4 3.6 Z']
export default function render(icon) {
  const name = (icon && icon.name) || 'zap-off'
  const Ls = layers(model(skeleton(name, PARTS, CUTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
