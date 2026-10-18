// forge/hand/plush/cloud-sun.mjs — the new skeleton in felt: a big cream cloud cushion (K) sewn in front of a sunflower
// sun at (10, 10) whose five fat stuffed rays fan out N to SW (A), replacing the old bespoke drawing with petal-like dashes.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

const CLOUD = 'M11.06 20.5 A3.24 3.24 0 0 1 10.48 14.09 A4.46 4.46 0 0 1 19.05 14.45 A3.06 3.06 0 0 1 18.44 20.5 Z'

export default function render(icon) {
  const P = ctxOf(icon)
  const cl = P.grow(P.path(CLOUD), 0.2)
  const rays = [270, 315, 225, 180, 135].map(a =>
    P.tube('c2', [P.pt(10, 10, 6.4, a), P.pt(10, 10, 7.7, a)], 2.2, { part: 'A', stitch: false, out: 0.5 }))
  const pieces = [
    ...rays,
    P.felt('c2', P.circle(10, 10, 3.9), { part: 'A', stitch: false }),
    P.moat(cl, 0.9),
    P.felt('tint', cl, { part: 'K' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
