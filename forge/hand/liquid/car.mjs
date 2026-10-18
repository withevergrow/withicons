// forge/hand/liquid/car.mjs — a chunky side-view car of clear liquid glass: one long body with a cabin hump and a
// window cut through it, and two big violet wheels with hubs set clearly apart under it, so it reads at 16-24px.
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



const BODY = 'M2.4 17.4V13.2C2.4 12.2 3 11.5 4 11.3L6.7 10.6L8.7 6.9C9 6.3 9.5 6 10.2 6H14C14.6 6 15.2 6.3 15.6 6.8L17.9 10.4L20.2 11C21 11.2 21.6 11.9 21.6 12.8V17.4Z'
const WIN1 = 'M8.2 10.4L9.7 7.3H11.8V10.4Z'
const WIN2 = 'M13 10.4V7.3H14.3L16.1 10.4Z'
const WHEELS = disc(7.2, 17.4, 2.2) + disc(16.8, 17.4, 2.2)
const HUBS = disc(7.2, 17.4, 0.7) + disc(16.8, 17.4, 0.7)

export default function render(icon) {
  const name = (icon && icon.name) || 'car'
  return build(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: WHEELS, plate: 'A', fill: true },
  ], [WIN1, WIN2, HUBS]))
}
