// forge/hand/plush/backpack.mjs — the redesigned backpack: a tomato domed body, a sky top flap sewn along the
// skeleton's dipping curve, a sky carry loop, a sunflower front pocket and one button: a bag, not a house.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const body = P.rr(4.5, 6, 19.5, 21.5, [6, 6, 2.5, 2.5])
  const flap = P.clip(body, P.path('M3 3 H21 V11.6 C16.75 13.1 14.5 13.6 12 13.6 C9.5 13.6 7.25 13.1 3 11.6 Z'))
  const pieces = [
    P.tube('c3', P.arcPts(12, 6, 2.5, 180, 360), 1.8, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', body, { part: 'K' }),
    P.felt('c3', flap, { part: 'A' }),
    P.knot(12, 12.1, 0.8, 'c2', { part: 'A' }),
    P.felt('c2', P.rr(8.25, 15.5, 15.75, 19.25, [0.9, 0.9, 1.6, 1.6]), { part: 'A', stitch: false }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
