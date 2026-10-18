// forge/hand/liquid/timer.mjs — a stopwatch: a round case of clear liquid glass under a big violet crown button on a
// short stem, a violet side pusher at the top right, and one long violet hand inlaid from a hub toward the upper right.
// The generated timer had a thin T for a crown, a pusher fused into the rim and its hand only as a faint groove, so at
// 16px it was a plain pale disc that read as a clock or a plate. Same model and light as the generator
// (_liquid-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`

// the case (K): centre (12, 14), radius 8
const CASE = disc(12, 14, 8)
// crown (A): a wide rounded button on a stem that dips into the case (outlines are centrelines: the model strokes
// every part as a 2.3u tube, so this thin bar grows into a fat pill)
const CROWN = 'M10.6 1.9H13.4A0.7 0.7 0 0 1 13.4 3.3H10.6A0.7 0.7 0 0 1 10.6 1.9Z'
const STEM = 'M12 3.3V6.5'
// side pusher (A): a short stub standing off the rim at 45 degrees
const PUSHER = 'M18.4 7.6L20.1 5.9'
// the hand (A): long, from the hub toward the upper right
const HAND = 'M12 14L15.9 10.1'

export default function render(icon) {
  const name = (icon && icon.name) || 'timer'
  return build(skeleton(name, [
    { d: CASE, plate: 'K', fill: true },
    { d: CROWN, plate: 'A', fill: true },
    { d: STEM, plate: 'A' },
    { d: PUSHER, plate: 'A' },
    { d: HAND, plate: 'A' },
  ]))
}
