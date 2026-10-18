// forge/hand/plush/file-archive.mjs — the file-family sky page with its cream dog-ear, a column of light zipper teeth
// stitched down the left and a sunflower zip pull, following the redesigned skeleton (the old toy was a centred
// bottle-like pull that read as a jar).
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const teeth = [5, 7, 9, 11].map((y, i) => (i % 2 ? [[10.75, y], [12.25, y]] : [[8.5, y], [10, y]]))
  const pieces = [
    ...P.page('c3', 'tint'),
    P.thread(teeth, { w: 1.35, role: 'edge', op: 0.95, part: 'A' }),
    P.felt('c2', P.rr(7.75, 13.25, 12.75, 19, 1.9), { part: 'A', stitch: false, out: 0.55 }),
    P.thread([[[9.5, 16.1], [11, 16.1]]], { w: 0.9, role: 'ink', op: 0.75, part: 'A' }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
