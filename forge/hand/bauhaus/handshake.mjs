// forge/hand/bauhaus/handshake.mjs — two clasped hands in four flat shapes: blue cuffs at each side, a red hand from the
// left and a yellow hand from the right meeting on a slanted seam, one red thumb laid across the join. No finger ticks.
import { rr, bar, poly } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const thumb = [[10, 9.5], [14.5, 12.25]]
  return compose([
    ['c3', rr(1.5, 6.5, 4.75, 17.5, 1.5), rr(19.25, 6.5, 22.5, 17.5, 1.5)],
    ['c2', poly([[11, 8], [18.25, 8], [18.25, 17.5], [8.25, 17.5]], 2.5)],
    ['cut', poly([[5.75, 7], [13.5, 7], [10.4, 18.5], [5.75, 18.5]], 0.5)],
    ['c1', poly([[5.75, 8], [12.5, 8], [9.5, 17.5], [5.75, 17.5]], 2.5)],
    ['cut', bar(thumb, 4.5)],
    ['c1', bar(thumb, 2.75)],
  ], icon)
}
