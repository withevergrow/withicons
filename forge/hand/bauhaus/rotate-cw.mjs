// forge/hand/bauhaus/rotate-cw.mjs — the exact mirror of rotate-ccw: one blue kit arcArrow running clockwise into a red
// swept head that rides the curve (band buried flat in the head, no hand-placed head), around the yellow hub.
// rotate-ccw is arcArrow(205..505, ccw, len 6.25, half 4.75); mirroring x about 12 maps angle a to 180 - a, so the tail
// lands at 35 and the tip at 335 with identical head measures. rotate-cw.json swaps to rotate-ccw with 'flip', so any
// change to the head must be made to both icons together.
import * as P from '../../styles/_bauhaus-prim.mjs'
import * as K from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ...K.arcArrow(12, 12.5, 8.25, 35, 335, { len: 6.25, half: 4.75, r: 1.1, rb: 1.1 }),
    ['c2', P.circle(12, 12.5, 2.25)],
  ], icon)
}
