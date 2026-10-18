// pastel door-open: arched peach frame around a warm doorway, a lavender leaf swung open on the left hinge (its free
// edge taller, toward the viewer) with a knob, standing on a floor line.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { path, poly, pill, circle } = Prim
  const frame = path('M3 21 V6 A3 3 0 0 1 6 3 H18 A3 3 0 0 1 21 6 V21 Z')
  const opening = path('M5.25 21 V6.6 A1.4 1.4 0 0 1 6.65 5.2 H17.35 A1.4 1.4 0 0 1 18.75 6.6 V21 Z')
  const leaf = poly([[6.2, 6.6], [13.4, 4.3], [13.4, 22.7], [6.2, 20.2]], 0.7)
  return compose([
    ['peach@K', frame],
    ['butter.well@K', opening],
    ['lavender@A', leaf],
    ['ink@A', circle(11.7, 13.6, 0.85)],
    ['peach.flat@K', pill(1.5, 21, 22.5, 22.5)],
  ], icon)
}
