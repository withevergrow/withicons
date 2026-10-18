// forge/hand/clay/watch.mjs — a violet clay wristwatch: a round plump case with two chunky straps above and below, a recessed
// round dial and two orange clay hands (a long minute hand up, a short hour hand to the right). The generated watch fused the
// straps and case into one egg with a bean for the hand; here the case is a clear circle, the straps are separate blocks with
// a notch of daylight between strap and case, and the dial is pressed in. Same model and light as the generator (_clay-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.filter(p => p.d).map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.f).map(p => { const subs = parsePath(p.f); return { d: p.f, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`

const CASE = disc(12, 12, 5.4)
const STRAP_T = 'M8.4 8L8.9 3.6Q9 2.2 10.4 2.2H13.6Q15 2.2 15.1 3.6L15.6 8Z'
const STRAP_B = 'M8.4 16L8.9 20.4Q9 21.8 10.4 21.8H13.6Q15 21.8 15.1 20.4L15.6 16Z'
const DIAL = disc(12, 12, 3.9)
const HANDS = 'M12 9.2V12L14 13.1'
// a gap ring round the case, cut through the straps so each strap reads as its own block
const GAP = disc(12, 12, 7.6) + 'M12 5.6A6.4 6.4 0 1 1 12 18.4A6.4 6.4 0 1 1 12 5.6Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'watch'
  return build(skeleton(name, [
    { d: CASE, f: CASE, plate: 'K' },
    { f: STRAP_T, plate: 'K' },
    { f: STRAP_B, plate: 'K' },
    { d: HANDS, plate: 'A' },
  ], [GAP, DIAL, HANDS]))
}
