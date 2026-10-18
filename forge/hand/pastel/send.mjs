// forge/hand/pastel/send.mjs — the paper plane as two folded faces: a sky wing and a lavender keel face whose own rim
// draws the fold; the generated plane was one pale sky field crossed by a dark ink stroke that ran off its edge.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { poly } = Prim
  // acute corners take small radii (compose softens them further), so the plane keeps its full span
  const T = [22, 2], L = [2, 10], F = [10.5, 13.5], B = [14, 22]
  return compose([
    ['sky@K', poly([T, L, F, B], [0.45, 0.6, 0.3, 0.6])],
    ['lavender@K', poly([T, F, B], [0.45, 0.3, 0.6])],
  ], icon)
}
