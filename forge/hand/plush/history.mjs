// forge/hand/plush/history.mjs — the redesigned history: a tomato tube looping almost all the way round a cream
// clock face, ending at the left in a big separate downward arrowhead; ink hands set at 13, 12.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    P.felt('tint', P.circle(12.9, 12, 5.9), { part: 'K', stitch: false }),
    P.felt('c1', P.stroke('M9 20 A8.5 8.5 0 1 0 4.5 11.75', 2.7), { part: 'K', stitch: false }),
    P.felt('c1', P.poly([[1.25, 10.5], [7.75, 10.5], [4.5, 15]], [0.8, 0.8, 0.8]), { part: 'K', stitch: false, out: 0.5 }),
    P.thread([[[13, 8.75], [13, 12.25], [15.75, 14.1]]], { w: 1.25, part: 'A' }),
    P.knot(13, 12.25, 0.85, 'c1', { part: 'A' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
