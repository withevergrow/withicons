// forge/hand/bauhaus/ruler.mjs — the tilted ruler as a yellow slab with a red end block and three ink graduation
// ticks (long, short, long) along its upper edge, replacing the two dots and face-like notches.
import { rr, rot, clip, poly, seg2 } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const body = rot(rr(1.4, 8.46, 22.6, 15.54, 1.6), -45)
  const redEnd = clip(body, poly([[9.8, 0], [24, 0], [24, 14.2]], 0))
  // ticks start on the upper-left edge (x + y = 19) and run inward along (1, 1)
  const tick = (s, len) => seg2(3 + s + 0.9, 16 - s + 0.9, 3 + s + 0.9 + len / 1.414, 16 - s + 0.9 + len / 1.414, 1.3)
  return compose([
    ['c2', body],
    ['c1', redEnd],
    ['shadow', tick(3.25, 3.4), tick(6.25, 2.2), tick(9.25, 3.4)],
  ], icon)
}
