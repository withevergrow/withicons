// forge/hand/plush/user-plus.mjs — the user family's sunflower head over sky rounded shoulders, set to the left, with the
// mint plus badge at the upper right as in the line design (the old bust patch sat the badge lower right).
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const shoulders = P.round(P.clip(P.ellipse(8.75, 19.8, 7.6, 7.6), P.rect(0, 0, 24, 21.25)), 1.2)
  const pieces = [
    P.felt('c3', shoulders, { part: 'K' }),
    P.felt('c2', P.circle(8.75, 6.75, 3.9), { part: 'K' }),
    ...P.badge('plus', 'c4', 18, 7.5, 4.3),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
