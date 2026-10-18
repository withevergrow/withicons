// forge/hand/bauhaus/camera-off.mjs: blue camera, open yellow lens, red slash that holds on light and dark.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
const { circle, rr, seg2 } = P

export default function render(icon) {
  return compose([
    ['c2', rr(8, 3.5, 16, 8.5, 1.5)],
    ['c3', rr(2, 6.5, 22, 20.5, 3)],
    ['c2', circle(12, 13.5, 4)],
    ['shadow', circle(12, 13.5, 1.5)],
    ['c1', seg2(3.5, 3.5, 20.5, 20.5, 2.75)],
  ], icon)
}
