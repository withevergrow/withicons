// forge/hand/plush/usb.mjs — the USB trident sewn as one chunky sky toy: a tomato arrowhead, a fat stitched stem on a
// big foot disc, stuffed branch tubes ending well apart in a tomato disc (left) and a sunflower block (right).
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const arm = { part: 'K', stitch: false, out: 0.5 }
  const pieces = [
    P.tube('c3', [[5, 11.5], [5, 13], [12, 16.75]], 2.7, arm),
    P.tube('c3', [[19, 10.5], [19, 11.5], [12, 15]], 2.7, arm),
    P.felt('c3', P.fillet(P.unite(P.seg(12, 6, 12, 18, 3.8), P.circle(12, 19, 3)), 0.8), { part: 'K', seam: [[[12, 7.5], [12, 16]]] }),
    P.felt('c1', P.poly([[12, 1.5], [16.25, 7.5], [7.75, 7.5]], [1.1, 0.9, 0.9]), { part: 'K', stitch: false }),
    P.felt('c1', P.circle(5, 9.25, 2.75), { part: 'K', stitch: false }),
    P.felt('c2', P.rr(16.25, 5.25, 21.75, 10.75, 1.2), { part: 'K', stitch: false }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
