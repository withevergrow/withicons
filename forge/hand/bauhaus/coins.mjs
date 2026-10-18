// forge/hand/bauhaus/coins.mjs — two solid coins in perspective (yellow faces on blue and red rims), replacing the
// generated pair of flat ringed discs that read as buttons or targets rather than money.
import { ellipse, ehalf, rect, join } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

// a coin seen from above at an angle: an elliptical face over a rim of depth h
const rim = (cx, cy, rx, ry, h) => join(rect(cx - rx, cy, cx + rx, cy + h), ehalf(cx, cy + h, rx, ry, 's'))

export default function render(icon) {
  return compose([
    // back coin (the one that hops): blue rim, yellow face
    ['c3', rim(8, 5.25, 6, 3, 3.5)],
    ['c2', ellipse(8, 5.25, 6, 3)],
    ['c4', ellipse(8, 5.25, 3.25, 1.5)],
    // a moat clears the front coin off the back one
    ['cut', ellipse(16, 15, 7.25, 4.25), rect(8.75, 15, 23.25, 18.25)],
    // front coin: red rim, yellow face
    ['c1', rim(16, 15, 6, 3, 3.5)],
    ['c2', ellipse(16, 15, 6, 3)],
    ['c4', ellipse(16, 15, 3.25, 1.5)],
  ], icon)
}
