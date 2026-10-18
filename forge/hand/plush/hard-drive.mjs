// forge/hand/plush/hard-drive.mjs — the redesigned drive slab: a cream sloped top panel over a sky front box with
// an embroidered slot and a mint activity light (A, flickers); replaces the old platter that read as a speaker.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    P.felt('tint', P.poly([[2.5, 12], [5, 5.25], [19, 5.25], [21.5, 12]], [0.6, 1.6, 1.6, 0.6]), { part: 'K' }),
    P.felt('c3', P.rr(2.5, 11, 21.5, 19.5, [0.75, 0.75, 2.5, 2.5]), { part: 'K' }),
    P.tube('ink', [[6.25, 15.25], [12.25, 15.25]], 1.5, { part: 'A', stitch: false, line: false, shade: false, hi: false, pinch: false, ground: false }),
    P.felt('c4', P.circle(17.5, 15.25, 1.5), { part: 'A', stitch: false, out: 0.5 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
