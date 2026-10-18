// forge/hand/bauhaus/circle.mjs — the line version's plain ring, built as a thick annulus split once down the middle:
// a red left half and a blue right half, so the open hole reads as "circle outline" at 16px instead of a filled disc.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { halves } from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ...halves(P.ring(12, 12, 9.75, 5.5), 'c1', 'c3', 'v', 12),
  ], icon)
}
