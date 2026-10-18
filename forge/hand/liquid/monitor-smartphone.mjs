// forge/hand/liquid/monitor-smartphone.mjs — a clear-glass monitor with a window screen on a violet stand, and a tall
// violet phone beside it with its own screen cut and a clear gap between the two. The generated phone was a big
// pink slab laid over the monitor's corner, so the monitor looked cut; now both devices are whole, the phone is
// shorter, and the stand and phone share one tint. Same model and light as the generator.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'monitor-smartphone'
  return build(skeleton(name, [
    { d: rr(2.2, 4, 13.8, 14, 1.6), plate: 'K', fill: true },
    { d: 'M8 14.6V18.8M5.1 19.2H10.9', plate: 'A' },
    { d: rr(16.2, 8.4, 21.8, 20.2, 1.6), plate: 'A', fill: true },
  ], [
    rr(4.7, 6.6, 11.3, 11.4, 0.7),
    rr(17.6, 10.8, 20.4, 17.4, 0.6),
  ]))
}
