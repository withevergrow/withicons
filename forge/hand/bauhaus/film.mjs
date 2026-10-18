// forge/hand/bauhaus/film.mjs — a blue film strip: a row of square sprocket holes along the top and bottom edge
// (knocked out of the strip) and one wide yellow frame window with a red sun disc and a blue hill.
import { rr, circle, cut, clip } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const X = [5.5, 8.75, 12, 15.25, 18.5]
const holes = y => X.map(x => rr(x - 0.9, y, x + 0.9, y + 1.8, 0.9))
const win = rr(4, 9, 20, 15, 1.5)

export default function render(icon) {
  return compose([
    ['c3', cut(rr(2, 4, 22, 20, 3), ...holes(5.3), ...holes(16.9))],
    ['c2', win],
    ['c1', circle(8.5, 12, 2)],
    ['c3', clip(win, circle(16, 17, 4.5))],
  ], icon)
}
