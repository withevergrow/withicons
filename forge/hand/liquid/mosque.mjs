// forge/hand/liquid/mosque.mjs — a mosque in liquid glass: a violet onion dome on a clear prayer hall with an arched
// door, a pink crescent riding the dome and a tall minaret of its own, standing clear of the hall. The generated
// drawing fused dome, hall and minaret into one mass and the crescent turned into a stray swirl. Same model and light
// as the generator.
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


// crescent: outer circle minus an offset inner circle, as one filled closed shape
const f2 = n => +n.toFixed(2)
function crescent(cx, cy, R, r, dx, dy) {
  const ix = cx + dx, iy = cy + dy, d = Math.hypot(dx, dy)
  const a = (R * R - r * r + d * d) / (2 * d), h = Math.sqrt(R * R - a * a)
  const ux = dx / d, uy = dy / d, mx = cx + ux * a, my = cy + uy * a
  const p1 = [mx - uy * h, my + ux * h], p2 = [mx + uy * h, my - ux * h]
  return `M${f2(p1[0])} ${f2(p1[1])}A${R} ${R} 0 1 0 ${f2(p2[0])} ${f2(p2[1])}A${r} ${r} 0 1 1 ${f2(p1[0])} ${f2(p1[1])}Z`
}

const HALL = 'M2.8 21.5V16.8H15V21.5Z'
const DOME = 'M4 16.8C3.2 12.6 6.4 11.2 8.9 7.6C11.4 11.2 14.6 12.6 13.8 16.8Z'

const MINARET = 'M18.5 21.5V13.2H20.7V21.5Z'
const BALCONY = rr(17.4, 11.6, 21.8, 13.2, 0.7)
const CAP = 'M18.5 11.6C18.5 9 19.6 7.6 19.6 5.4C19.6 7.6 20.7 9 20.7 11.6Z'
const CRESCENT = crescent(8.9, 5.1, 2.2, 1.85, 1, -0.5)

export default function render(icon) {
  const name = (icon && icon.name) || 'mosque'
  return build(skeleton(name, [
    { d: HALL, plate: 'K', fill: true },
    { d: MINARET, plate: 'K', fill: true },
    { d: BALCONY, plate: 'K', fill: true },
    { d: CAP, plate: 'K', fill: true },
    { d: DOME, plate: 'A', fill: true },
    { d: CRESCENT, plate: 'S', fill: true },
  ], [
    'M6.7 21.5V19.6A2.2 2.2 0 0 1 11.1 19.6V21.5Z',
  ]))
}
