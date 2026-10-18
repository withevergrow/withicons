// forge/hand/bauhaus/lamp.mjs — the table lamp of the line icon: a yellow trapezoid shade, a red half-disc bulb
// under its rim, an ink stem and a blue dome base.
import { poly, half, ehalf, bar } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['ink', bar([[12, 11], [12, 19]], 2.25)],
    ['c3', ehalf(12, 21.5, 5.75, 3.5, 'n')],
    ['c2', poly([[8.25, 2.75], [15.75, 2.75], [20, 12], [4, 12]], [1.1, 1.1, 1.1, 1.1])],
    ['c1', half(12, 12, 2.4, 's')],
  ], icon)
}
