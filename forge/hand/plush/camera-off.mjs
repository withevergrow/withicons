// forge/hand/plush/camera-off.mjs: the whole sky camera cushion (bump, lens, shutter knot) intact, with one tomato
// slash tube laid over it; no moat or gap is cut around the slash.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const body = P.fillet(P.unite(P.rr(2, 7, 22, 20, 2.6), P.rr(7.5, 4, 14.5, 8.5, 1.4)), 0.6)
  const pieces = [
    P.felt('c3', body, { part: 'K' }),
    P.felt('c2', P.circle(12, 13.25, 4.4), { part: 'K', stitch: false, out: 0.6 }),
    P.felt('c3', P.circle(12, 13.25, 2.2), { part: 'K', stitch: false, out: 0.5 }),
    P.knot(13, 12.3, 0.6, 'shine', { part: 'K', op: 0.9 }),
    P.knot(18.6, 9.9, 0.85, 'c1', { part: 'K' }),
    P.tube('c1', [[3.25, 3.25], [20.75, 20.75]], 2.4, { part: 'S', stitch: false, out: 0.6 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
