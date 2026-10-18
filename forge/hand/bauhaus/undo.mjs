// forge/hand/bauhaus/undo.mjs — the ink U-turn with the red swept head, drawn as the true mirror of redo: redo is
// stroke('M16 9.5 H9.25 A5.5 5.5 0 0 0 9.25 20.5 H14.5') + head(21, 9.5, 0, 6.5, 6.25), mirrored about x = 12 that is
// this hook + head(3, 9.5, 180, 6.5, 6.25). The generated head (6.5 / 5.5) was a size smaller than redo's. redo.json
// swaps to undo with 'flip', so the two heads must match exactly; the shaft starts at x = 8, buried in the notch.
import * as P from '../../styles/_bauhaus-prim.mjs'
import * as K from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['ink', P.stroke('M8 9.5 H14.75 A5.5 5.5 0 0 1 14.75 20.5 H9.5', 2.5)],
    ['c1', K.head(3, 9.5, 180, 6.5, 6.25)],
  ], icon)
}
