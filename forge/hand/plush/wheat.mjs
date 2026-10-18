// forge/hand/plush/wheat.mjs: an ear of wheat: a mint stalk with three pairs of separate sunflower grains angling up
// and out, each stuffed and seamed on its own, and one grain on top.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const grain = (x0, y0, x1, y1, h = 1.35) => P.felt('c2', P.lens(x0, y0, x1, y1, h), { part: 'K', seam: [[[x0, y0], [x1, y1]]], trim: 1.1 })
  const pieces = [
    P.tube('c4', [[12, 22], [12, 8.5]], 1.7, { part: 'K', stitch: false, out: 0.55 }),
    grain(11.8, 17.9, 6.6, 13.2),
    grain(12.2, 17.9, 17.4, 13.2),
    grain(11.8, 13.1, 6.6, 8.4),
    grain(12.2, 13.1, 17.4, 8.4),
    grain(11.8, 8.3, 6.8, 3.9),
    grain(12.2, 8.3, 17.2, 3.9),
    grain(12, 8.6, 12, 1.9, 1.55),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
