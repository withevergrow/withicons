// forge/hand/pastel/messages.mjs — two chat bubbles in clearly different hues (a sky message in front of a peach
// reply) with a moat between them; the generated sky-on-lavender pair merged into one tone at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, poly, unite } = Prim
  const front = unite(rr(2.25, 2.5, 15.25, 12.75, 3.25), poly([[4, 11.5], [9, 12.25], [2.75, 16.5]], [1, 1, 1.1]))
  const moat = unite(rr(1.05, 1.3, 16.45, 13.95, 4.45), poly([[2.8, 10.3], [10.6, 11.4], [1.4, 17.9]], 1.6))
  return [...compose([
    ['peach@A', unite(rr(8.75, 8.5, 21.75, 18.25, 3.25), poly([[14.75, 17.25], [20, 16.75], [21, 21.75]], [1, 1, 1.1]))],
    ['cut', moat],
    ['sky@K', front],
  ], icon)]
}
