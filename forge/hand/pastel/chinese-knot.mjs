// forge/hand/pastel/chinese-knot.mjs — the pastel lucky knot: a big blush diamond with an ink woven lattice, two open
// blush side loops behind it, and a butter bead and tassel (A) hanging below, so it reads as a knot, not a green plus.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { poly, ellipse, cut, seg2, circle } = Prim
  const loop = cx => cut(ellipse(cx, 9, 2, 4), ellipse(cx, 9, 0.7, 2.25))
  const L = 1.15
  return compose([
    ['blush.flat@K', loop(3.75), loop(20.25)],
    ['blush@K', poly([[12, 2.25], [18.75, 9], [12, 15.75], [5.25, 9]], 1.5)],
    ['ink@K',
      seg2(10.6, 5.1, 15.9, 10.4, L), seg2(8.1, 7.6, 13.4, 12.9, L),
      seg2(13.4, 5.1, 8.1, 10.4, L), seg2(15.9, 7.6, 10.6, 12.9, L)],
    ['butter.flat@A', seg2(12, 15.5, 12, 17, 1.2), circle(12, 17.25, 1.1)],
    ['butter@A', poly([[10.6, 18.25], [13.4, 18.25], [15, 22.25], [9, 22.25]], [0.6, 0.6, 0.8, 0.8])],
    ['ink@A', seg2(11.1, 19.75, 10.75, 21.25, 1), seg2(12.9, 19.75, 13.25, 21.25, 1)],
  ], icon)
}
