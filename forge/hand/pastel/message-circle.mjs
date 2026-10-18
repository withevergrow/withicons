// forge/hand/pastel/message-circle.mjs — the pastel round chat bubble with a real wedge tail: the generated bubble's
// tail was a small nub that read as a plain pale disc at 16px; this one points clearly down-left from the circle.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { circle, poly, unite } = Prim
  return compose([
    ['sky@K', unite(circle(12.75, 10.75, 8.75), poly([[4.75, 13.5], [10.25, 18.25], [2.5, 21.5]], [1, 1, 1.2]))],
  ], icon)
}
