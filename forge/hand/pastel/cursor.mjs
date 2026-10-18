// forge/hand/pastel/cursor.mjs — the pastel pointer: one broad lavender arrowhead with soft corners and a chunky
// tail (3.25) united into the same field (one body, no seam), sized to the exemplars so it reads as a cursor at 16px instead of a thin sliver.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { poly, seg2 } = Prim
  return compose([
    ['lavender@K',
      poly([[4.5, 2.75], [19.75, 12.75], [12.25, 13.75], [8.25, 20.25]], [1.4, 1.6, 0.9, 1.6]),
      seg2(12, 13.25, 15.75, 20.25, 3.25)],
  ], icon)
}
