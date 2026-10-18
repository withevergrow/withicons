// forge/hand/pastel/headset.mjs — the pastel headset with solid cups: two chunky lavender ear cups (the deepest hue, no
// pale inserts) under a sky headband that stops at their tops, and a peach boom mic curling to the mouth.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, arc, cut, stroke, pill, join } = Prim
  const cups = join(rr(2.75, 11.25, 8.75, 19.25, 2.5), rr(15.25, 11.25, 21.25, 19.25, 2.5))
  return compose([
    ['lavender', cups],
    ['sky@A', cut(arc(12, 12.75, 8.25, 180, 360, 2.6), rr(2.25, 10.75, 9.25, 19.75, 2.75), rr(14.75, 10.75, 21.75, 19.75, 2.75))],
    ['peach.flat@A', stroke('M18.25 19.75 V19.75 A2.5 2.5 0 0 1 15.75 21.25 H13.5', 1.75)],
    ['peach@A', pill(9.5, 19.75, 14.25, 22.5)],
  ], icon)
}
