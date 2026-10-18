// forge/hand/pastel/map-pin.mjs — the pastel pin: a fuller blush drop with a larger paper well (r 3.3) so the ring
// of the pin holds as a clear donut at 16px, tip landing on the skeleton's point (12, 21.5).
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { drop, circle } = Prim
  return compose([
    ['blush', drop(12, 9.75, 7.75, 12, 22, 1.1)],
    ['paper.well@A', circle(12, 9.75, 3.3)],
  ], icon)
}
