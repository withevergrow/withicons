// forge/hand/clay/calendar-plus.mjs — a violet clay calendar with orange ring tabs and a big chunky orange plus
// pressed onto the page, like calendar-check's tick. The generated plus was a cutout, so it became a tiny dark
// cross-shaped pit that vanished at 16px. Same model and light as the generator (_clay-core.mjs); only the geometry
// is drawn here.
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
const PLUS = 'M12 11.9V17.8M9.05 14.85H14.95'

export default function render(icon) {
  const name = (icon && icon.name) || 'calendar-plus'
  return build(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: RINGS, plate: 'A' },
    { d: PLUS, plate: 'A' },
  ], ['M3 10H21']))
}
