// forge/hand/pastel/mandarin-orange.mjs — the pastel mandarin: a squat peach fruit with ink rind dots and a soft
// rind crease, a mint stem and a broad mint leaf (A) as one clear sprig on top; the generated drawing painted the
// fruit lavender with a peach leaf, so it read as a plum or a ball.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { ellipse, circle, stroke, path, join, unite } = Prim
  return compose([
    ['peach@K', ellipse(12, 15, 9.25, 6.75)],
    ['ink@K', join(stroke('M7.5 17.5 C7 16.25 7.25 14.75 8.5 13.75', 1.35),
      circle(13.75, 13.5, 0.8), circle(16.75, 15.75, 0.8), circle(12.75, 18, 0.8))],
    ['mint@A', unite(
      stroke('M12 8.75 L11.5 5', 2),
      path('M11.25 5.25 C12.5 2.25 16.75 1.25 20.5 2.5 C19.5 5.75 15 7.25 11.25 5.25 Z'),
    )],
  ], icon)
}
