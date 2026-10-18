// forge/hand/plush/thumbs-down.mjs: a mitten hand with its thumb hanging down under the palm, a sky cuff on the left.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const hand = P.fillet(P.unite(
    P.rr(7.25, 2.75, 20.75, 14.75, [1.25, 2.75, 3, 1.25]),
    P.seg(11.6, 12, 12, 18.6, 4.8),
  ), 1.4)
  const pieces = [
    P.felt('c2', hand, { part: 'K' }),
    P.felt('c3', P.rr(2.5, 2.75, 7.75, 14.5, 1.75), { part: 'A', stitch: false }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
