// forge/hand/bauhaus/inbox.mjs — the open tray: a blue back (flared walls) with a red front whose notch dips in the
// middle and shows the blue behind it, plus a yellow message line inside the open top.
import { poly, rr, clip } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const back = poly([[5.5, 4], [18.5, 4], [21.5, 12], [21.5, 17.5], [19, 20], [5, 20], [2.5, 17.5], [2.5, 12]], [1.25, 1.25, 0.9, 2.25, 2.25, 2.25, 2.25, 0.9])
  const front = clip(poly([[1, 11.5], [7.5, 11.5], [9.25, 15], [14.75, 15], [16.5, 11.5], [23, 11.5], [23, 21], [1, 21]], [0, 0.9, 1.1, 1.1, 0.9, 0, 0, 0]), back)
  return compose([
    ['c3', back],
    ['c1', front],
    ['c2', rr(8, 6.75, 16, 9, 1.1)],
  ], icon)
}
