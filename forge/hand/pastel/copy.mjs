// forge/hand/pastel/copy.mjs — the pastel copy: two equal soft sheets with a smaller overlap (5u instead of 6u), the
// lavender back sheet (A) showing a broad L behind a sky front sheet, separated by a clean moat so the duplicate
// reads as two pages at 16px rather than one blob with a notch.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr } = Prim
  const M = 1.2
  return compose([
    ['lavender@A', rr(2.5, 2.5, 14.5, 14.5, 3)],
    ['cut', rr(9.5 - M, 9.5 - M, 21.5 + M, 21.5 + M, 3 + M)],
    ['sky@K', rr(9.5, 9.5, 21.5, 21.5, 3)],
  ], icon)
}
