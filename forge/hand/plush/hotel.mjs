// forge/hand/plush/hotel.mjs — a sky hotel block on a wide ground slab, a tomato sign bar sewn across its roofline
// (narrower than the walls) and one bed on the front (sunflower pillow on a cream mattress); three clean colours.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    P.felt('c3', P.rr(3.25, 5.5, 20.75, 20.5, [1.2, 1.2, 0.5, 0.5]), { part: 'K' }),
    P.felt('ink', P.pill(2, 19.75, 22, 22.25), { part: 'K', stitch: false, out: 0.4 }),
    P.felt('c1', P.pill(4.5, 2.25, 19.5, 6.25), { part: 'A', stitch: false, out: 0.55 }),
    P.felt('tint', P.rr(6.25, 15.5, 17.75, 19, 1.1), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c2', P.pill(7.5, 11.5, 12, 15.25), { part: 'A', stitch: false, out: 0.5 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
