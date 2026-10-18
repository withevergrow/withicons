// forge/hand/plush/telescope.mjs — a stuffed telescope that reads at 16px: a tapered sky barrel (slim eyepiece low-left,
// wide end up-right) capped by a fat tomato lens hood with a pale glass lens face, on a chunky sunflower tripod (the legs
// are the A part) with a big tomato pivot button, centred on the grid.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const A = -29.94                                    // barrel axis (up-right)
  const legs = { part: 'A', stitch: false, out: 0.55 }
  const pieces = [
    P.tube('c2', [[11.6, 13.4], [6.4, 21]], 3, legs),
    P.tube('c2', [[12.4, 13.4], [17.6, 21]], 3, legs),
    P.tube('c2', [[12, 14], [12, 20.6]], 2.6, legs),
    P.felt('c3', P.poly([[5.25, 14.5], [3.75, 11.9], [15.7, 3.75], [18.3, 8.25]], 0.9), { part: 'K', stitch: 'seam', seam: [[[6.4, 11.4], [14.6, 6.6]]] }),
    P.felt('c1', P.rot(P.rr(2.1, 12.2, 5.1, 15.2, 0.9), A, 3.6, 13.7), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c1', P.rot(P.rr(16.4, 2.5, 19.4, 8.5, 1.2), A, 17.9, 5.5), { part: 'K', stitchMin: 1.2, inset: 0.7 }),
    P.felt('tint', P.rot(P.ellipse(19.2, 4.75, 0.85, 2.3), A, 19.2, 4.75), { part: 'K', stitch: false, out: 0.4 }),
    ...P.button(12, 13.2, 2, 'c1', { part: 'K' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
