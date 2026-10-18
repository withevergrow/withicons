// forge/hand/plush/cast.mjs — cast: a sky screen frame (a clean ring with a tint screen inside) whose lower-left corner
// is opened by one curve, with a tomato knot and two tomato wave tubes (A) in that corner. No stray arc band.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const cx = 3.25, cy = 19.75, bite = P.circle(cx, cy, 10.6)
  const wave = { part: 'A', stitch: false, out: 0.45 }
  const pieces = [
    P.felt('c3', P.fillet(P.cut(P.rr(2, 3.75, 22, 20.25, 2.5), P.rr(4.6, 6.35, 19.4, 17.65, 1.2), bite), 0.6), { part: 'K' }),
    P.felt('tint', P.fillet(P.cut(P.rr(4.6, 6.35, 19.4, 17.65, 1.2), bite), 0.5), { part: 'K', stitch: false, out: 0.4, shade: false }),
    P.felt('c1', P.circle(cx + 0.3, cy - 0.3, 1.5), wave),
    P.arcTube('c1', cx, cy, 4.5, -90, 0, 2.1, wave),
    P.arcTube('c1', cx, cy, 7.9, -90, 0, 2.1, wave),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
