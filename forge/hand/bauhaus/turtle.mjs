// forge/hand/bauhaus/turtle.mjs: side-view turtle, green domed shell with yellow hexagons, head up on the right, four legs, tail.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
const { circle, ellipse, rect, rr, pill, half, seg2, bar, poly, tri, lens, arc, dot, ngon } = P

export default function render(icon) {
  return compose([
    ['ink', pill(3.5, 15, 6, 20.5), pill(7.5, 15, 10, 20.5), pill(12.5, 15, 15, 20.5), pill(16.5, 15, 19, 20.5), tri([1, 16.5], [4, 14.5], [4, 17], 0.4)],
    ['c1', seg2(17.5, 14.5, 20, 10, 2.75), circle(20.25, 9.5, 2.75)],
    ['shadow', dot(21, 8.75, 0.8)],
    ['accent', half(11, 15, 8.5, 'n')],
    ['c2', poly(ngon(11, 10.5, 2.25, 6, 0), 0.4), poly(ngon(6, 13.25, 1.6, 6, 0), 0.3), poly(ngon(16, 13.25, 1.6, 6, 0), 0.3)],
    ['c3', pill(1.75, 14.5, 20.25, 17)],
  ], icon)
}
