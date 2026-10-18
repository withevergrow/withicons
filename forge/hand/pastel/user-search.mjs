// forge/hand/pastel/user-search.mjs — the user family (lavender shoulders, peach head) with a bold magnifier badge: a
// thick sky ring around a paper lens with a glint and a peach handle, all inside a moat; the generated lavender ring
// melted into the lavender shoulders.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { circle, ring, seg2, arc } = Prim
  const u = Kit.person(9.5, 3, 0.86)
  const cx = 16, cy = 16
  return compose([
    ['lavender@K', u.body],
    ['peach@K', u.head],
    ['cut', circle(cx, cy, 6.15), seg2(19.5, 19.5, 21.25, 21.25, 5.15)],
    ['peach@S', seg2(19.5, 19.5, 21.25, 21.25, 2.95)],
    ['sky@S', ring(cx, cy, 4.95, 2.35)],
    ['paper.flat@S', circle(cx, cy, 2.35)],
    ['shine', arc(cx, cy, 1.3, 200, 260, 0.9)],
  ], icon)
}
