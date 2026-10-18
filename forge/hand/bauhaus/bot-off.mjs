// forge/hand/bauhaus/bot-off.mjs — the bot head (rounded blue square, ink ears and antenna, two cream eyes) cut
// by a red slash that rides in its own moat, so the slash reads on both the blue head and the dark page.
import { circle, rr, pill, seg2 } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['ink', pill(11, 4.5, 13, 8.5), pill(2, 12, 4.5, 16.5), pill(19.5, 12, 22, 16.5)],
    ['c2', circle(12, 3.5, 1.9)],
    ['c3', rr(4.5, 7.5, 19.5, 20.5, 3.5)],
    ['tint', circle(7.5, 12.75, 1.5), circle(16.5, 11.25, 1.5)],
    ['cut', seg2(2.5, 2.5, 21.5, 21.5, 4)],
    ['c1', seg2(3, 3, 21, 21, 2.5)],
  ], icon)
}
