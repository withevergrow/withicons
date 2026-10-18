// forge/hand/pastel/angry.mjs — the pastel angry face, after the new skeleton: a blush disc with thick ink brows slanting
// down to the nose, small oval eyes set low beneath them and a wide frown, so the brows alone say "angry" at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { circle, seg2, ellipse, arc } = Prim
  return compose([
    ['blush@K', circle(12, 12, 10)],
    ['ink@A', seg2(6.75, 6.75, 10.25, 8.75, 2.1), seg2(17.25, 6.75, 13.75, 8.75, 2.1),
      ellipse(8.9, 12.75, 1.3, 1.55), ellipse(15.1, 12.75, 1.3, 1.55),
      arc(12, 20.6, 4.25, -140, -40, 2)],
  ], icon)
}
