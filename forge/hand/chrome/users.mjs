// chrome users: two separate chrome busts, front and back, with a clear gap between them
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
// chrome users: two separate chrome busts, front and back, with a clear gap between them
const PARTS = [
  { d: C(8.5, 8, 3), fill: true },
  { d: 'M3 20 V18.5 A4.5 4.5 0 0 1 7.5 14 H10.5 A4.5 4.5 0 0 1 15 18.5 V20 Z', fill: true },
  { d: C(17.5, 6, 2.4), fill: true },
  { d: 'M18.5 18 V12 H18.5 A3.5 3.5 0 0 1 22 16 V18 Z', fill: true },
]
const CUTS = []
export default function render(icon) {
  const name = (icon && icon.name) || 'users'
  const Ls = layers(model(skeleton(name, PARTS, CUTS)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}

