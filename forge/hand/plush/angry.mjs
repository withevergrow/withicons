// forge/hand/plush/angry.mjs — the redesigned angry face: a tomato cushion with thick slanted ink brows, two button
// eyes and an embroidered frown, so the brows alone tell it apart from a sad face.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const frown = P.arcPts(12, 20.65, 4, 221.4, 318.6, 8)
  const pieces = [
    P.felt('c1', P.circle(12, 12, 9.75), { part: 'K' }),
    P.thread([[[7.1, 6.6], [10.4, 8.85]], [[16.9, 6.6], [13.6, 8.85]]], { w: 1.7, part: 'A' }),
    P.knot(9, 12.9, 1.05, 'ink', { part: 'A' }), P.knot(15, 12.9, 1.05, 'ink', { part: 'A' }),
    P.thread(frown, { w: 1.3, part: 'A' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
