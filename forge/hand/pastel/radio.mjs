// forge/hand/pastel/radio.mjs — the pastel radio: a sky cabinet with a big butter speaker cone (ink ring), a paper
// dial window with an ink needle and two lavender knobs, and a lavender antenna (A) with a ball tip that tucks behind
// the cabinet, so it reads as a radio rather than a blue box with a small ring.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, circle, ring, seg2, join, cut } = Prim
  const body = rr(2, 8.5, 22, 20.5, 3)
  return compose([
    ['sky@K', body],
    ['lavender.flat@A', cut(join(seg2(6.5, 10, 17, 4.5, 2), circle(17.5, 4.25, 1.75)), body)],
    ['butter@A', circle(7.75, 14.5, 3.9)],
    ['ink@A', ring(7.75, 14.5, 2.2, 1.2)],
    ['paper.well@A', rr(13.25, 11, 19.75, 14.25, 1.25)],
    ['ink@A', seg2(16.5, 11.85, 16.5, 13.4, 1.2)],
    ['lavender.flat@A', circle(14.75, 17.5, 1.35), circle(18.25, 17.5, 1.35)],
  ], icon)
}
