// forge/hand/clay/globe.mjs: a full round clay globe with two fat pressed-on landmasses (a western and an eastern
// continent) so it reads as a world at 16-24px, not a bare blue ball. The continents are plump clay lumps like the
// other pressed-on parts (plate A); the ball is the generator's model and light (_clay-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'

// a skeleton in the shape the clay model expects: parts [{ d, plate, fill }]
function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const circ = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`

const BALL = circ(12, 12, 8.6)
const WEST = 'M6 8.4C6.6 7 8.8 6.8 9.8 7.8C10.5 8.6 9.8 9.6 9.6 10.4C9.4 11.4 10.2 12.2 9.8 13.4C9.4 14.8 8 15.2 7.4 14C6.9 13 6.2 12.2 5.9 11C5.7 10 5.6 9.2 6 8.4Z'
const EAST = 'M14.2 7C15.4 6.2 17.6 6.6 18 8.2C18.3 9.4 17.2 10.4 16 10.5C14.8 10.6 13.7 9.9 13.6 8.9C13.5 8.1 13.7 7.4 14.2 7Z'

const ISLE = 'M14.6 15C15.2 14.4 16.4 14.6 16.4 15.4C16.4 16.2 15.4 16.6 14.8 16.2C14.4 16 14.3 15.3 14.6 15Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'globe'
  return build(skeleton(name, [
    { d: BALL, plate: 'K', fill: true },
    { d: WEST, plate: 'A', fill: true },
    { d: EAST, plate: 'A', fill: true },
    { d: ISLE, plate: 'A', fill: true },
  ]))
}
