// forge/hand/pastel/align-right.mjs — the pastel align-right as four lit lavender bars at the glyph weight (w 3 instead
// of the thin flat 2.25 bars), long / short / long / short flush to the right edge, so the stagger keeps its rim and
// top plane and stays bright and legible at 16px beside list-checks and wrap-text.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2 } = Prim
  const w = 3
  return compose([
    ['lavender', seg2(4.5, 4.5, 19.5, 4.5, w), seg2(10.5, 9.5, 19.5, 9.5, w), seg2(4.5, 14.5, 19.5, 14.5, w), seg2(10.5, 19.5, 19.5, 19.5, w)],
  ], icon)
}
