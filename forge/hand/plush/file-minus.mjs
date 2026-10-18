// forge/hand/plush/file-minus.mjs — the file family's sky page with its cream dog-ear and nothing else on it but a fat
// tomato minus bar sewn dead centre (no badge, no text lines).
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    ...P.page('c3', 'tint'),
    P.felt('c1', P.pill(8.25, 13.1, 15.75, 15.9), { part: 'A', stitch: false, out: 0.55 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
