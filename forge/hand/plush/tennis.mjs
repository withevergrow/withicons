// forge/hand/plush/tennis.mjs — tennis racket: a tall tomato oval head on the diagonal with a bold cream string grid (A),
// a slim throat into a long thin sky grip, and a big sunflower ball tucked against the head's top-right rim.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

const C = 7.4, S = Math.SQRT1_2
const at = (u, v) => [+(C + (u - v) * S).toFixed(2), +(C + (u + v) * S).toFixed(2)]

export default function render(icon) {
  const P = ctxOf(icon)
  const a = 4.75, b = 3.05, L = []
  for (const v of [-1.3, 1.3]) { const h = a * Math.sqrt(1 - (v / b) ** 2); L.push([at(-h, v), at(h, v)]) }
  for (const u of [-1.9, 0, 1.9]) { const h = b * Math.sqrt(1 - (u / a) ** 2); L.push([at(u, -h), at(u, h)]) }
  const head = P.fillet(P.unite(P.rot(P.ellipse(C, C, 6.9, 5), 45, C, C), P.poly([[11.3, 10.1], [13.9, 13.9], [10.1, 11.3]])), 0.8)
  const pieces = [
    P.felt('c3', P.fillet(P.unite(P.seg(12.9, 12.9, 15.6, 15.6, 2.1), P.seg(15.2, 15.2, 21.2, 21.2, 3.3)), 0.5), { part: 'K', stitch: 'seam', seam: [[[16.2, 16.2], [20.4, 20.4]]] }),
    P.felt('c1', head, { part: 'K', stitch: false }),
    P.felt('tint', P.rot(P.ellipse(C, C, a, b), 45, C, C), { part: 'A', stitch: false, out: 0.45, shade: false }),
    P.thread(L, { w: 1.15, op: 1, role: 'c1', part: 'A' }),
    P.felt('c2', P.circle(18, 6, 3.9), { part: 'A', stitch: false, out: 0.5 }),
    P.thread(P.arcPts(20.2, 3.8, 3.6, 110, 160, 8), { w: 0.7, role: 'tint', part: 'A' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
