// forge/hand/plush/turtle.mjs: a side-view turtle: big green domed shell with hexagon patches, four stubby legs
// (two far legs peeking behind), a round head on a neck raised on the right with an eye, and a pointed tail.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const shell = P.clip(P.ellipse(10, 15, 8.5, 9), P.rect(0, 4, 24, 14))
  const hex = (x, y, r) => P.poly(P.ngon(x, y, r, 6, 0), 0.3)
  const pieces = [
    P.felt('c2', P.rr(7.5, 13, 10, 17.5, 1.2), { part: 'K', stitch: false, out: 0.4 }),
    P.felt('c2', P.rr(15, 13, 17.5, 17.5, 1.2), { part: 'K', stitch: false, out: 0.4 }),
    P.tube('c2', [[3.2, 11.6], [0.8, 13.6]], 2, { part: 'K', stitch: false, out: 0.4 }),
    P.tube('c2', [[16.5, 14.5], [19.3, 11]], 3, { part: 'A', stitch: false, out: 0.4 }),
    P.felt('c2', P.circle(20.2, 9.2, 3), { part: 'A' }),
    P.knot(21.2, 8.5, 0.75, 'ink', { part: 'A' }),
    P.felt('c2', P.rr(3, 13, 6.2, 18.5, 1.4), { part: 'K', stitch: false, out: 0.4 }),
    P.felt('c2', P.rr(11.5, 13, 14.7, 18.5, 1.4), { part: 'K', stitch: false, out: 0.4 }),
    P.felt('c4', P.fillet(shell, 1), { part: 'K' }),
    P.flat('tint', hex(10, 10, 2.1), { part: 'K', op: 0.85 }),
    P.flat('tint', hex(5.7, 12.6, 1.6), { part: 'K', op: 0.85 }),
    P.flat('tint', hex(14.3, 12.6, 1.6), { part: 'K', op: 0.85 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
