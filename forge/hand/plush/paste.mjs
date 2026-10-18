// forge/hand/plush/paste.mjs — the clipboard toy (sky board, sunflower clip) with a cream page sewn on its lower
// right, matching the redesigned skeleton; replaces the old two-tile drawing that read as copy, not paste.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const sheet = P.rr(10.25, 10.5, 21, 21.5, 2)
  const pieces = [
    P.felt('c3', P.rr(3, 4.25, 17.25, 20.25, 2.5), { part: 'K', stitch: false }),
    P.felt('c2', P.unite(P.pill(6.5, 3.5, 13.75, 7.25), P.rr(8.5, 1.75, 11.75, 4.75, 1.5)), { part: 'A', stitch: false, out: 0.5 }),
    P.knot(10.12, 3.4, 0.55, 'ink', { part: 'A' }),
    P.moat(sheet, 1),
    P.felt('tint', sheet, { part: 'K', stitchMin: 1.2, inset: 0.8 }),
    P.thread([[[13, 14.5], [18.25, 14.5]], [[13, 17.75], [16, 17.75]]], { w: 1.25, role: 'ink', op: 0.8, part: 'K' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
