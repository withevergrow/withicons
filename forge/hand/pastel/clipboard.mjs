// forge/hand/pastel/clipboard.mjs — the pastel clipboard: a peach board, a paper sheet with two lavender-ink lines so
// it reads as a document on a board (not an empty picture frame), and a broader lavender clip (A) with a cut slot
// that bites over the board's top edge, the family build of clipboard-check / clipboard-list.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, seg2, join } = Prim
  return compose([
    ['peach', rr(4, 4.25, 20, 21.75, 3)],
    ['paper', rr(6.5, 8, 17.5, 19.5, 1.75)],
    ['ink', join(seg2(9, 12.25, 15, 12.25, 1.6), seg2(9, 15.75, 13.25, 15.75, 1.6))],
    ['lavender@A', rr(7.75, 2, 16.25, 7.25, 1.75)],
    ['cut', rr(10.25, 3.5, 13.75, 4.85, 0.65)],
  ], icon)
}
