// forge/hand/bauhaus/reply-all.mjs — one ink arm runs through both swept heads (blue rear, red front) and curls
// down into the tail, so the two heads ride a shared shaft instead of floating loose beside it.
import * as Prim from '../../styles/_bauhaus-prim.mjs'
import * as Kit from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const p = { ...Prim, ...Kit }
  return compose([
    ['ink', p.stroke('M5 9.5 H13.5 A7 7 0 0 1 20.5 16.5 V19.75', 2.5)],
    ['c3', p.head(2, 9.5, 180, 5.25, 5.25)],
    ['c1', p.head(7.75, 9.5, 180, 6.25, 6)],
  ], icon)
}
