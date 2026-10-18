// forge/hand/plush/map-pin.mjs: a tomato teardrop pin pillow with a clear round hole, the stitching running round
// the same silhouette.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const body = P.fillet(P.unite(
    P.circle(12, 10, 7.5),
    P.poly([[5.4, 13.2], [12, 21.8], [18.6, 13.2]], [0, 1, 0]),
  ), 1.6)
  const pieces = [
    P.felt('c1', P.cut(body, P.circle(12, 10, 3.1)), { part: 'K' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
