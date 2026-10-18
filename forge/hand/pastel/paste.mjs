// forge/hand/pastel/paste.mjs — the pastel paste: a peach clipboard with a lavender clip (A) and a sky page laid over
// its lower right corner behind a clean moat, with two ink text lines; the generated drawing still showed the old
// two-rectangle "copy" shape and a lavender L that never read as a clipboard.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, seg2, join } = Prim
  const M = 1.2
  return compose([
    ['peach@K', rr(3, 4.25, 17, 20.25, 3)],
    ['lavender@A', rr(6.5, 2, 13.5, 6.75, 1.75)],
    ['cut', rr(8.25, 3.4, 11.75, 4.75, 0.65)],
    ['cut', rr(10.5 - M, 10.5 - M, 21.5 + M, 22 + M, 2.75 + M)],
    ['sky@K', rr(10.5, 10.5, 21.5, 22, 2.75)],
    ['ink', join(seg2(13.25, 14.25, 18.75, 14.25, 1.6), seg2(13.25, 17.75, 16.5, 17.75, 1.6))],
  ], icon)
}
