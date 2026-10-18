// forge/hand/plush/user-circle.mjs — the redesigned user-circle: a sky cushion ring holding a sunflower head and
// cream rounded shoulders that sit fully inside the ring, no face rings.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const shoulders = P.round(P.clip(P.rr(5, 16, 19, 26, [5, 5, 0, 0]), P.circle(12, 12, 8.4)), 0.8)
  const pieces = [
    P.felt('c3', P.circle(12, 12, 9.75), { part: 'K' }),
    P.felt('tint', shoulders, { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c2', P.circle(12, 9.4, 3.7), { part: 'K', stitch: false }),
    P.knot(10.9, 8.3, 0.7, 'shine', { part: 'K', op: 0.85 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
