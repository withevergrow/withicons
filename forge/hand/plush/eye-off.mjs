// forge/hand/plush/eye-off.mjs — the redesigned eye-off: a cream almond eye with a sky iris and ink pupil (A), crossed
// by a tomato slash (S) whose wide moat opens a clean gap through lid and iris so the two never merge.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    P.felt('c2', P.path('M2.25 12 C4.5 7.25 8 5 12 5 C16 5 19.5 7.25 21.75 12 C19.5 16.75 16 19 12 19 C8 19 4.5 16.75 2.25 12 Z'), { part: 'K' }),
    P.felt('c3', P.circle(12, 12, 4.3), { part: 'A', stitch: false, out: 0.6 }),
    P.flat('ink', P.circle(12, 12, 2.1), { part: 'A' }),
    P.knot(13.15, 10.85, 0.7, 'shine', { part: 'A', op: 0.95 }),
    ...P.slash({ from: [3.5, 3.5], to: [20.5, 20.5], w: 2.6, gap: 1.2 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
