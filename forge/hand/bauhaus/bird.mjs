// forge/hand/bauhaus/bird.mjs — the songbird of the line icon in flat geometry: a round red body, a blue head disc at
// the upper right, a yellow beak triangle, a yellow wing leaf (wm-a), a yellow tail wedge and two ink legs.
import { circle, poly, lens, seg2 } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['ink', seg2(9.5, 17, 9.5, 21, 2), seg2(13.5, 17, 13.5, 21, 2)],
    ['c2', poly([[1.75, 7.25], [9.5, 9.5], [6.75, 16]], [0.9, 0.9, 1])],
    ['c1', circle(11.5, 12.25, 6.5)],
    ['c2', poly([[17.5, 5.75], [22.75, 8.25], [17.5, 10.75]], [0.9, 1.1, 0.9])],
    ['c3', circle(15.5, 8, 3.75)],
    ['tint', circle(16.25, 7.25, 1.1)],
    ['c2', lens(7.5, 13.5, 14, 12.5, 2.4, 2.4)],
  ], icon)
}
