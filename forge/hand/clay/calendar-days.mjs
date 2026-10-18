// forge/hand/clay/calendar-days.mjs — a violet clay calendar with orange ring tabs and six plump orange day buttons
// pressed onto the page in two rows of three. The generated days were six tiny dark pits that vanished at 16px; these
// are fewer-looking, larger raised dots in the A clay so the grid still reads as a month at a glance. Same model and
// light as the generator (_clay-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'

// a skeleton in the shape the clay model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const BODY = 'M5 5H19A2 2 0 0 1 21 7V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V7A2 2 0 0 1 5 5Z'
const RINGS = 'M8 3V7M16 3V7'
// every part is also stroked as a tube (A: 2.3 wide), so a 0.2 core inflates into a 1.35 radius button
const X = [7.3, 12, 16.7], Y = [13.2, 17.55], R = 0.2
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`
const DOTS = Y.flatMap(y => X.map(x => disc(x, y, R))).join('')

export default function render(icon) {
  const name = (icon && icon.name) || 'calendar-days'
  return build(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: RINGS, plate: 'A' },
    { d: DOTS, plate: 'A', fill: true },
  ], ['M3 10H21']))
}
