// forge/hand/pastel/timer.mjs — the pastel stopwatch: a lavender case, a big peach crown-and-stem (A) and a peach side
// pusher (A) so it reads apart from the clock, a paper face with a sky elapsed wedge and one long ink hand (A).
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { circle, rr, seg2, sector, unite, cut } = Prim
  const cx = 12, cy = 13.25
  return compose([
    ['lavender@K', circle(cx, cy, 8.5)],
    ['peach@A', cut(unite(rr(8.75, 1.25, 15.25, 4.5, 1.6), rr(10.75, 3.5, 13.25, 5.5, 0.6)), circle(cx, cy, 9.1)),
      cut(seg2(18.4, 7.1, 20.1, 5.4, 2.6), circle(cx, cy, 9.1))],
    ['paper@K', circle(cx, cy, 6.1)],
    ['sky.flat@A', sector(cx, cy, 4.6, -90, -40)],
    ['ink@A', seg2(cx, cy, cx + 4.55 * Math.cos(-40 * Math.PI / 180), cy + 4.55 * Math.sin(-40 * Math.PI / 180), 1.75), circle(cx, cy, 1.4)],
  ], icon)
}
