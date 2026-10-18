// forge/hand/plush/cloud-off.mjs — the redesigned cloud-off: a sky-blue stitched cloud cushion with its big puff
// high on the right (left lobe, crown, right lobe on a flat base) cut by a slim moated tomato slash.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const cloud = P.fillet(P.unite(
    P.circle(7, 14.5, 4.5),
    P.circle(12.1, 12.1, 6.2),
    P.circle(17.2, 14.75, 4.25),
    P.rr(7, 13, 17.2, 19.25, 0),
  ), 1)
  const pieces = [
    P.felt('c3', cloud, { part: 'K' }),
    ...P.slash({ from: [4.25, 4.25], to: [19.75, 19.75], w: 1.9, gap: 0.7 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
