// forge/hand/bauhaus/piggy-bank.mjs: round red pig, yellow coin dropping into the slot, ear, snout, legs, curly tail.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
const { circle, ellipse, rect, rr, pill, half, seg2, bar, poly, tri, lens, arc, dot, ngon } = P

export default function render(icon) {
  return compose([
    ['ink', pill(6, 16, 8.75, 21.5), pill(13.75, 16, 16.5, 21.5), arc(2.75, 12, 1.25, 180, 360, 1.5)],
    ['c1', tri([12.5, 9], [17.5, 9], [16.5, 5.5], 0.6)],
    ['c1', ellipse(11.5, 14, 8, 6)],
    ['c2', rr(17.5, 11.5, 22, 16, 1.5)],
    ['shadow', dot(19.75, 13.75, 0.9), dot(14.5, 12, 1.1), pill(9, 9.25, 14, 10.75)],
    ['c2', circle(11.5, 4.25, 2.75)],
  ], icon)
}
