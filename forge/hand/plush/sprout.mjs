// forge/hand/plush/sprout.mjs: a stuffed mint sprout: a stem, two puffy leaves (small left, big right) and a flat
// tomato base bar it grows from, no pot.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    P.tube('c4', [[12, 19.5], [12, 10.5]], 2.4, { part: 'K', stitch: false }),
    P.felt('c4', P.lens(12.2, 13.2, 3.4, 5.6, 3.9), { part: 'K', stitch: 'seam', seam: [[[11, 12], [5.4, 7.1]]] }),
    P.felt('c4', P.lens(11.8, 10.6, 20.6, 3.2, 4.2), { part: 'K', stitch: 'seam', seam: [[[13.2, 9.6], [19, 4.8]]] }),
    P.felt('c1', P.pill(5.6, 19.1, 18.4, 22.1), { part: 'A', stitch: false }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
