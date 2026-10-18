// forge/hand/pastel/close.mjs — the pastel close: one heavier blush X (bars 3.6, check-exemplar weight) so it is
// broad enough for the house top and bottom planes and holds its rim on white; no ornament anywhere near the cross.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2 } = Prim
  return compose([
    ['blush', seg2(5.25, 5.25, 18.75, 18.75, 3.6), seg2(18.75, 5.25, 5.25, 18.75, 3.6)],
  ], icon)
}
