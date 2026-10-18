// forge/hand/pastel/eraser.mjs — the pastel eraser: a tilted lavender block with a blush rubber tip at its lower-left
// end (the skeleton's split), resting its corner on a lavender wiped line (A), so the object has a ground and a
// deeper body hue instead of two pale halves floating on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, rot, seg2 } = Prim
  const cx = 12.5, cy = 11
  const T = s => rot(s, 45, cx, cy)
  const x0 = cx - 3.625, x1 = cx + 3.625, y0 = cy - 8.5, y1 = cy + 8.5, split = y1 - 6.25
  return compose([
    ['lavender@K', T(rr(x0, y0, x1, split, [2.25, 2.25, 0, 0]))],
    ['blush@K', T(rr(x0, split, x1, y1, [0, 0, 2, 2]))],
    ['lavender.flat@A', seg2(9.25, 21.25, 20.5, 21.25, 2.25)],
  ], icon)
}
