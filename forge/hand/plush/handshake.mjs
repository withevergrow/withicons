// forge/hand/plush/handshake.mjs: a handshake on the line layout: big sky cuffs left and right, one chunky clasp in the
// middle split into a gold hand from the left and a pink hand from the right. Three plump finger bumps along the
// bottom, no running stitch on the clasp (it only added noise at 16px), one clean thread crease for the knuckles.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

const MASS = 'M6.6 8.2 L10.4 7.4 C12.6 6.9 14.8 8.4 17.4 7.7 L20 13.8 L18.4 15.6 A1.7 1.7 0 0 1 16.4 17.9 A1.7 1.7 0 0 1 14.2 19.8 A1.7 1.7 0 0 1 11.4 20.4 L10.4 20.2 A1.7 1.7 0 0 1 8.2 18.4 A1.7 1.7 0 0 1 6.2 16.4 L4.2 14 Z'

export default function render(icon) {
  const P = ctxOf(icon)
  const mass = P.round(P.fillet(P.path(MASS), 0.9), 0.9)
  const pinkZone = P.poly([[11, 4], [26, 4], [26, 23], [15, 23], [13.4, 16.4], [10, 12.4]])
  const pink = P.clip(mass, pinkZone)
  const gold = P.cut(mass, pinkZone)
  const pieces = [
    P.felt('c3', P.poly([[4.6, 5.6], [8.6, 7.8], [5, 15.4], [1.2, 13.2]], 1.2), { part: 'K', stitch: false }),
    P.felt('c3', P.poly([[19.4, 5.6], [22.8, 13.2], [19, 15.4], [15.4, 7.8]], 1.2), { part: 'K', stitch: false }),
    P.felt('c2', gold, { part: 'A', stitch: false }),
    P.felt('c1', pink, { part: 'A', stitch: false }),
    P.thread([[[8.2, 17.4], [10.2, 14.8]]], { w: 0.9, role: 'ink', op: 0.5, part: 'A' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
