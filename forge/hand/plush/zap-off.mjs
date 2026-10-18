// forge/hand/plush/zap-off.mjs: the sunflower bolt cushion crossed by a sky-blue slash tube (moated), so the
// slash reads apart from the yellow bolt.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const bolt = P.poly([[14.2, 1.8], [4.6, 13.9], [11.2, 13.9], [9.8, 22.2], [19.4, 10.1], [12.8, 10.1]], 0.7)
  const pieces = [
    P.felt('c2', bolt, { part: 'K' }),
    ...P.slash({ from: [3.25, 3.25], to: [20.75, 20.75], w: 2, gap: 0.7, role: 'c3' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
