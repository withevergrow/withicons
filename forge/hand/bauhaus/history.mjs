// forge/hand/bauhaus/history.mjs — the new history: the dial sits right of centre (13, 12.5) so a large red kit head can
// ride the curve on the left, the blue band running counter-clockwise from the foot round the top into it; a yellow
// face carries the ink hands. The old bespoke drawing was centred and its head was small and crowded at 16px.
import * as P from '../../styles/_bauhaus-prim.mjs'
import * as K from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ...K.arcArrow(13, 12.5, 8.5, 172, 478, { ccw: true, len: 6.5, half: 4.75, r: 1.4, rb: 1.1 }),
    ['c2', P.circle(13, 12.5, 5.25)],
    ['ink', P.bar([[13, 8.75], [13, 12.5], [15.75, 14.25]], 2.25)],
  ], icon)
}
