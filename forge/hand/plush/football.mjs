// forge/hand/plush/football.mjs — the redesigned football: a cream ball with one tomato centre pentagon (A) and five
// tomato rim patches cut by the ball's edge, joined by sewn seams, as in the skeleton (no star or flower in the middle).
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

const RIM = 'M7.84 3.46 L9.18 4.25 L12 5 L14.82 4.25 L16.16 3.46 L12 1 Z M18.83 5.4 L18.5 6.92 L18.66 9.84 L20.24 12.29 L21.41 13.32 L23 8 Z M20.39 16.46 L18.84 16.61 L16.11 17.66 L14.27 19.93 L13.65 21.36 L19 22 Z M10.35 21.36 L9.73 19.93 L7.89 17.66 L5.16 16.61 L3.61 16.46 L5 22 Z M2.59 13.32 L3.76 12.29 L5.34 9.84 L5.5 6.92 L5.17 5.4 L1 8 Z'

export default function render(icon) {
  const P = ctxOf(icon)
  const ball = P.circle(12, 12, 9.5)
  const pent = P.ngon(12, 12, 3.6, 5, -90)
  const pieces = [
    P.felt('tint', ball, { part: 'K', stitch: false }),
    P.thread(pent.map((p, i) => [p, P.pt(12, 12, 7.2, -90 + i * 72)]), { w: 0.8, op: 0.75, part: 'K' }),
    P.felt('c1', P.clip(P.shrink(ball, 0.05), P.round(P.path(RIM), 0.4)), { part: 'A', stitch: false, line: false, hi: false }),
    P.felt('c1', P.poly(pent, 0.6), { part: 'A', stitch: false, out: 0.5 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
