// forge/hand/pastel/power.mjs — the pastel power symbol: a heavier lavender ring (w 3.5) open at the top with a clear
// gap around a heavier lavender switch bar, one hue so the mark holds on the cream page where the pale mint bar faded.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { arc, seg2, join } = Prim
  return compose([
    ['lavender@K', join(arc(12, 12.75, 7.75, -45, 225, 3.5), seg2(12, 3.75, 12, 11, 3.5))],
  ], icon)
}
