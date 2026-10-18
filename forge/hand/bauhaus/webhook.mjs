// forge/hand/bauhaus/webhook.mjs — the line webhook's composition in flat colour: three nodes (red top, blue right,
// yellow left), each with the arm that leaves it; every arm runs straight, then hooks round the next node.
import { circle, stroke } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const W = 2.25
const A1 = 'M12 7.5 L13.95 10.88 A3.75 3.75 0 0 0 17.2 12.75 A3.75 3.75 0 0 1 20.95 16.5 A3.75 3.75 0 0 1 17.2 20.25'
const A2 = 'M17.2 16.5 L13.3 16.5 A3.75 3.75 0 0 0 10.05 18.38 A3.75 3.75 0 0 1 4.93 19.75 A3.75 3.75 0 0 1 3.56 14.63'
const A3 = 'M6.8 16.5 L8.75 13.13 A3.75 3.75 0 0 0 8.75 9.38 A3.75 3.75 0 0 1 10.13 4.25 A3.75 3.75 0 0 1 15.25 5.63'

export default function render(icon) {
  return compose([
    ['c1', stroke(A1, W)], ['c3', stroke(A2, W)], ['c2', stroke(A3, W)],
    ['c1', circle(12, 7.5, 2.1)], ['c3', circle(17.2, 16.5, 2.1)], ['c2', circle(6.8, 16.5, 2.1)],
    ['ink', circle(12, 7.5, 0.8)], ['ink', circle(17.2, 16.5, 0.8)], ['ink', circle(6.8, 16.5, 0.8)],
  ], icon)
}
