// forge/hand/liquid/mouse.mjs — a plump clear-glass mouse: a groove splits the two buttons, a seam parts them from the
// palm, and a violet glass scroll wheel sits in a clear moat on the divider. The generated drawing painted the whole
// lower half as a heavy gradient with a faint seam and no readable wheel. Same model and light as the generator.
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

const BODY = rr(6.5, 2.5, 17.5, 21.5, 5.5)

export default function render(icon) {
  const name = (icon && icon.name) || 'mouse'
  return build(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: 'M12 5.6V8.9', plate: 'A' },
  ], [
    'M12 3.3V11.6',            // divider between the buttons
    'M7.6 10.9Q12 12.6 16.4 10.9',     // curved seam between buttons and palm
  ]))
}
