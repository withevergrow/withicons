// forge/hand/pastel/disc.mjs — the pastel compact disc: a lavender disc with two ink groove arcs (top-left and
// bottom-right) that break the concentric target look, a paper hub (A) and a real centre hole cut through, so it reads
// as a CD instead of a button or crosshair.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { circle, arc, join } = Prim
  return compose([
    ['lavender@K', circle(12, 12, 9.5)],
    ['ink@K', join(arc(12, 12, 6.6, 195, 250, 1.35), arc(12, 12, 6.6, 15, 70, 1.35))],
    ['paper.flat@A', circle(12, 12, 3.6)],
    ['cut', circle(12, 12, 1.5)],
  ], icon)
}
