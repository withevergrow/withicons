// forge/hand/bauhaus/arrow-down-left.mjs — mirror of arrow-down-right: round-capped ink shaft and the same
// solid rounded-triangle red head (shared rhead from the run 9 arrows), so the diagonal family reads as one.
import { seg2, poly } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
import { rhead } from '../../styles/_bauhaus-redraw-2.mjs'

export default function render(icon) {
  const len = 7.5, half = 5.25, deg = 135, r = 1.6
  const R = Math.PI / 180, ux = Math.cos(deg * R), uy = Math.sin(deg * R), into = len - 2.5
  const x0 = 18.5, y0 = 5.5, x1 = 5.25, y1 = 18.75
  return compose([
    ['ink', seg2(x0, y0, x1 - ux * into, y1 - uy * into, 2.5)],
    ['c1', rhead({ poly }, x1, y1, deg, len, half, r)],
  ], icon)
}
