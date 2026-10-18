// forge/hand/plush/navigation.mjs — the pointer as one big stuffed tomato dart with a sewn fold seam from the
// notch to the tip, replacing the generated two-felt fragments that shrank the arrow and split its silhouette.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const dart = P.poly([[21, 3], [13.75, 21.25], [10.75, 13.25], [2.75, 10.25]], [1.5, 1.4, 0.8, 1.4])
  const pieces = [
    P.felt('c1', dart, { part: 'K' }),
    P.thread([[[11.6, 12.4], [17.6, 6.4]]], { w: 1, role: 'edge', op: 0.9, part: 'K' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
