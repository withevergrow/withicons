// forge/hand/bauhaus/tennis.mjs — the new tennis racket: a red oval rim round a blue string bed crossed by a cream
// string grid, an ink throat that thickens into a long ink grip running to the lower right, and the yellow ball standing
// clear at the top right. The old bespoke drawing (round head, short thin handle) read as a magnifier.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const head = (rx, ry) => P.rot(P.ellipse(8.25, 8.25, rx, ry), 45, 8.25, 8.25)

export default function render(icon) {
  const bed = head(4.5, 3.25)
  return compose([
    // throat, then the wider grip: the handle tapers into the head
    ['ink', P.seg2(11.5, 11.5, 15.5, 15.5, 2.25), P.seg2(15.25, 15.25, 19.75, 19.75, 3.75)],
    ['c1', head(6.75, 5.5)],
    ['c3', bed],
    // cream strings, two each way, cut to the bed
    ['tint', P.clip(P.join(P.seg2(4, 6, 10.5, 12.5, 1), P.seg2(6, 4, 12.5, 10.5, 1), P.seg2(11.5, 7, 7, 11.5, 1), P.seg2(9.5, 5, 5, 9.5, 1)), bed)],
    ['c2', P.circle(19.25, 4.75, 2.5)],
  ], icon)
}
