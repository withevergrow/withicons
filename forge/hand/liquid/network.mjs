// forge/hand/liquid/network.mjs — a hub glass on top feeding three device glasses below through a violet glass bus:
// one trunk down, a crossbar, three drops. The earlier drawing closed the links into a triangle mesh that read as a
// share or graph icon; the tree (one node branching to three) is what says "network / topology". Same model and light
// as the generator; only geometry here. Motion: nodes wm-k, links wm-a (the spec lights parts.A from the hub out).
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

const HUB = rr(9, 2.6, 15, 6.2, 1.1)
const DEVS = [rr(1.9, 17, 6, 21, 1), rr(9.9, 17, 14.1, 21, 1), rr(18, 17, 22.1, 21, 1)]
const LINKS = 'M12 6.2V17.2M3.95 17.2V11.4H20.05V17.2'

export default function render(icon) {
  const name = (icon && icon.name) || 'network'
  return build(skeleton(name, [
    { d: HUB, plate: 'K', fill: true },
    ...DEVS.map(d => ({ d, plate: 'K', fill: true })),
    { d: LINKS, plate: 'A' },
  ]))
}
