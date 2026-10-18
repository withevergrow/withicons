// forge/hand/pastel/cast.mjs — the pastel cast mark: a broad sky screen with an inset well, its bottom-left corner
// carved away by a wide moat, and two compact lavender signal waves plus a dot (A) tucked into that corner, following
// the redesigned skeleton; the generated drawing kept the old big stacked-arcs card that read as an RSS feed.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, circle, arc, cut, join } = Prim
  const cx = 3, cy = 20
  return compose([
    ['sky@K', cut(rr(2, 4, 22, 20, 3.25), circle(cx, cy, 11))],
    ['sky.well@K', cut(rr(4.75, 6.75, 19.25, 17.25, 1.5), circle(cx, cy, 13.5))],
    ['lavender@A', join(circle(cx + 0.6, cy - 0.6, 1.7), arc(cx, cy, 4.75, 270, 360, 2.5), arc(cx, cy, 8.25, 270, 360, 2.5))],
  ], icon)
}
