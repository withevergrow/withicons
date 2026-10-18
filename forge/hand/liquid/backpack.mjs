// forge/hand/liquid/backpack.mjs — a clear-glass backpack seen from the front: a tall body with a domed top, a carry
// loop on top, a curved flap seam, violet glass shoulder straps hanging off both sides and a violet front pocket. The generated drawing put a wide violet band across the middle and a dark slot below it,
// so it read as a lunch box or a basket; the domed shape, side straps and pocket now say "backpack" at 16px. Same model
// and light as the generator (_liquid-core.mjs); only geometry here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// body (K): domed top, rounded bottom corners, x 6.25..17.75, y 6.75..21.5
const BODY = 'M8.25 21.5H15.75A2 2 0 0 0 17.75 19.5V11.75A5 5 0 0 0 12.75 6.75H11.25A5 5 0 0 0 6.25 11.75V19.5A2 2 0 0 0 8.25 21.5Z'
// carry loop (K): on top of the dome
const LOOP = 'M9.25 7.25V5.25A2.75 2.75 0 0 1 14.75 5.25V7.25'
// shoulder straps (A): violet glass loops hanging off both sides of the body, clear of it
const STRAPS = 'M6.75 10C3.75 11.25 3 15.5 3.5 20.25M17.25 10C20.25 11.25 21 15.5 20.5 20.25'
// front pocket (A): a violet glass pocket on the lower front
const POCKET = 'M9.75 14.5H14.25A1.5 1.5 0 0 1 15.75 16V18A1.5 1.5 0 0 1 14.25 19.5H9.75A1.5 1.5 0 0 1 8.25 18V16A1.5 1.5 0 0 1 9.75 14.5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'backpack'
  return build(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: LOOP, plate: 'K' },
    { d: STRAPS, plate: 'A' },
    { d: POCKET, plate: 'A', fill: true },
  ], [
    'M6.75 11C8.5 11.9 10 12.25 12 12.25C14 12.25 15.5 11.9 17.25 11',   // flap seam
  ]))
}
