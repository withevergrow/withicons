// forge/hand/plush/megaphone.mjs — a level tomato horn with a wide sunflower mouth rim, a sky back cap and a sky
// grip below it, one continuous toy silhouette matching the redesigned skeleton (no more tilted fragments).
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    P.felt('c3', P.rr(5.75, 12.5, 9.75, 20.75, 1.9), { part: 'K', stitch: false }),
    P.felt('c3', P.rr(2.5, 8.25, 9, 15.75, 2.25), { part: 'A', stitch: false }),
    P.felt('c1', P.poly([[8, 8.5], [17.5, 3.75], [17.5, 20.25], [8, 15.5]], [0.8, 1.2, 1.2, 0.8]), { part: 'K' }),
    P.felt('c2', P.rr(16.25, 2.5, 20.75, 21.5, 2.25), { part: 'K', stitch: false }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
