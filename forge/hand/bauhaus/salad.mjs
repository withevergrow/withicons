// forge/hand/bauhaus/salad.mjs: wide blue bowl on a foot, lettuce leaf, carrot and half egg poking out over a yellow rim.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
const { circle, ellipse, rect, rr, pill, half, seg2, bar, poly, tri, lens, arc, dot, ngon } = P

export default function render(icon) {
  return compose([
    ['accent', lens(3.5, 12.5, 9.5, 3.5, 2.5)],
    ['c4', tri([9.75, 12.5], [14, 12.5], [12.5, 3.5], 0.6)],
    ['c2', half(17.5, 12.5, 4, 'n')],
    ['c4', half(17.5, 12.5, 1.75, 'n')],
    ['c3', half(12, 13.25, 8, 's')],
    ['ink', rr(8, 20, 16, 22.5, 1)],
    ['c2', pill(1.5, 12, 22.5, 14.5)],
  ], icon)
}
