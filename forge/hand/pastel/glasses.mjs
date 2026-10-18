// forge/hand/pastel/glasses.mjs — the pastel glasses: one lavender frame (two soft D-shaped rims, an arched bridge
// with a clear gap and two short temples) holding sky glass wells with a small shine each; the generated drawing
// was a solid mint mass that read as sunglasses or a bra.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

const RIM = 'M2.75 8.25 H9 A1.75 1.75 0 0 1 10.75 10 V13.25 A4.88 4.88 0 0 1 1 13.25 V10 A1.75 1.75 0 0 1 2.75 8.25 Z'
const GLASS = 'M3.5 10.25 H8.25 A0.5 0.5 0 0 1 8.75 10.75 V13.25 A2.88 2.88 0 0 1 3 13.25 V10.75 A0.5 0.5 0 0 1 3.5 10.25 Z'

export default function render(icon) {
  const { path, stroke, seg2, arc, unite, join, flipX } = Prim
  const rimL = path(RIM), glassL = path(GLASS)
  return compose([
    ['lavender@K', unite(rimL, flipX(rimL), stroke('M10.25 10.75 C11 9.5 13 9.5 13.75 10.75', 3),
      seg2(2, 9.5, 1.75, 5.75, 2.75), seg2(22, 9.5, 22.25, 5.75, 2.75))],
    ['sky.well@K', join(glassL, flipX(glassL))],
    ['shine', join(arc(5.9, 13, 2.1, 195, 250, 1.1), arc(18.1, 13, 2.1, 195, 250, 1.1))],
  ], icon)
}
