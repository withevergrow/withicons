// forge/hand/pastel/zoom-out.mjs — the pastel magnifier in the search build (thick lavender rim, paper bezel,
// sky well glass, peach handle) with a bold ink minus, so the lens and its sign no longer fade at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2, ring, circle } = Prim
  return compose([
    ['peach@A', seg2(15.75, 15.75, 20.25, 20.25, 3.75)],
    ['lavender', ring(10.5, 10.5, 8.5, 5.5)],
    ['paper.flat', circle(10.5, 10.5, 5.5)],
    ['sky.well', circle(10.5, 10.5, 4.25)],
    ['ink@A', seg2(8, 10.5, 13, 10.5, 2.25)],
  ], icon)
}
