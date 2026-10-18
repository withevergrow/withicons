// pastel thumbs-down: one peach thumb-down silhouette (no finger lines) beside a lavender cuff, as in the line design.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { path, rr } = Prim
  const hand = path('M7.6 14 L10.3 20 A2.25 2.25 0 0 0 14.5 19 L14.1 15.4 H18.6 C20.2 15.4 21.2 14 20.9 12.4 L19.5 5.2 C19.3 3.9 18.2 3 17 3 H7.6 Z')
  return compose([
    ['peach@K', hand],
    ['lavender@A', rr(2.5, 3, 7.4, 14.5, 1.7)],
  ], icon)
}
