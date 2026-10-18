// forge/hand/plush/folder-minus.mjs: the stuffed folder (tomato back with a tab, sunflower pocket) with the minus
// sewn straight onto the pocket as a sky felt bar, no badge.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    ...P.folder('c1', 'c2'),
    P.felt('c3', P.pill(7.9, 13.2, 16.1, 16.2), { part: 'A', stitch: false, out: 0.5, shade: false }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
