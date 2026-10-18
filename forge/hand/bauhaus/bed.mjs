// forge/hand/bauhaus/bed.mjs — the line bed: ink headboard post and foot, a blue mattress with a red blanket over
// its right side and a yellow disc for the pillow, replacing the half-circle and bar that hid the bed.
import { rr, circle, clip } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const mattress = rr(3.5, 12.5, 22, 18, 2.5)
  return compose([
    ['ink', rr(1.75, 4.5, 4.75, 20.5, 1.5), rr(19.5, 16, 22.25, 20.5, 1.25)],
    ['c3', mattress],
    ['c1', clip(rr(11, 12.5, 22, 18, 0), mattress)],
    ['cut', circle(8.25, 10.75, 3.9)],
    ['c2', circle(8.25, 10.75, 2.9)],
  ], icon)
}
