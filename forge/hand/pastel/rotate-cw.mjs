// forge/hand/pastel/rotate-cw.mjs — the pastel clockwise turn: one lavender ring band (w 3.25, the arrow weight) that
// opens at the top right and ends in a compact chevron head whose axis leans out of the curve, so the inner arm opens
// into the ring's hole instead of melting into the band and the outer arm no longer sticks up as a stray hook.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

const RAD = Math.PI / 180
const pt = (x, y, r, a) => [+(x + r * Math.cos(a * RAD)).toFixed(2), +(y + r * Math.sin(a * RAD)).toFixed(2)]

export default function render(icon) {
  const { arc, bar, join } = Prim
  const cx = 11.75, cy = 13, r = 7.25, w = 3.25
  const a0 = 20, a1 = 312             // clockwise from just below east, round the bottom, left and top
  const tip = pt(cx, cy, r, a1)
  const axis = a1 + 90 - 22           // travel direction, leaned out of the curve
  const head = 4.75
  return compose([
    ['lavender@K', join(
      arc(cx, cy, r, a0, a1, w),
      bar([pt(tip[0], tip[1], head, axis + 180 - 45), tip, pt(tip[0], tip[1], head, axis + 180 + 45)], w),
    )],
  ], icon)
}
