// forge/hand/plush/layout-dashboard.mjs — four felt tiles of clearly unequal size from the redesigned skeleton: a big
// sky tile and a short wide mint strip on the left, a small sunflower chip and a tall tomato column on the right, so it
// never reads as the equal 2x2 of layout-grid.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    P.felt('c3', P.rr(3, 3, 12.25, 13.25, 2.25), { part: 'K' }),
    P.felt('c2', P.rr(15.5, 3, 21, 7.75, 1.9), { part: 'K', stitch: false }),
    P.felt('c1', P.rr(15.5, 11, 21, 21, 2), { part: 'K', stitchMin: 1.2 }),
    P.felt('c4', P.rr(3, 16.75, 12.25, 21, 1.9), { part: 'K', stitch: false }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
