// forge/hand/pastel/rotate-ccw.mjs — the pastel counter-clockwise turn, the line design in soft lavender: one ring band
// (w 2.6) that opens on the left with a wide gap, ending at the top left in a square-cornered head (one arm straight up,
// one straight in over the ring's hole) so the arrowhead reads on its own at 16px; the old thick ring melted into its head.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { paintEntries } from '../../styles/_pastel-paint.mjs'

const RAD = Math.PI / 180
const pt = (x, y, r, a) => [+(x + r * Math.cos(a * RAD)).toFixed(2), +(y + r * Math.sin(a * RAD)).toFixed(2)]

export default function render(icon) {
  const { arc, bar, join } = Prim
  const cx = 12.5, cy = 13, r = 7.5, w = 2.6
  const a0 = 225, a1 = 515            // from the top left tip, clockwise over the top, right and bottom to the left gap
  const tip = pt(cx, cy, r, a0)
  const E = entriesOf([
    ['lavender@K', join(
      arc(cx, cy, r, a0, a1, w),
      bar([pt(tip[0], tip[1], 5.8, -82), tip, pt(tip[0], tip[1], 5.8, 8)], w),
    )],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E)
}
