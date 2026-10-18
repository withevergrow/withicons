// forge/hand/pastel/captions.mjs — the pastel closed-captions mark: a sky screen box with a bold paper "CC" (A)
// lettered on it, following the redesigned skeleton; the generated drawing still showed the old text-bar card that
// read as a keyboard.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, stroke, join } = Prim
  return compose([
    ['sky@K', rr(2, 4, 22, 20, 3.25)],
    ['paper.flat@A', join(
      stroke('M10.25 8.75 H8.75 A2.5 2.5 0 0 0 6.25 11.25 V12.75 A2.5 2.5 0 0 0 8.75 15.25 H10.25', 2.5),
      stroke('M17.75 8.75 H16.25 A2.5 2.5 0 0 0 13.75 11.25 V12.75 A2.5 2.5 0 0 0 16.25 15.25 H17.75', 2.5),
    )],
  ], icon)
}
