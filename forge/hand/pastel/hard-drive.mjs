// pastel hard-drive: front-view drive box (slanted lid, seam, slot and two status dots) in lavender over a sky front panel.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { path, pill, circle } = Prim
  const body = path('M2 11 L4 7 Q5 5 7 5 H17 Q19 5 20 7 L22 11 V17 A2 2 0 0 1 20 19 H4 A2 2 0 0 1 2 17 Z')
  const front = path('M2 11.6 H22 V17 A2 2 0 0 1 20 19 H4 A2 2 0 0 1 2 17 Z')
  return compose([
    ['lavender@K', body],
    ['sky.flat@K', front],
    ['ink@A', pill(5.5, 14.4, 12.5, 16)],
    ['butter@A', circle(16.6, 15.2, 1.15)],
    ['blush@A', circle(19.4, 15.2, 1.15)],
  ], icon)
}
