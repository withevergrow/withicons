// forge/hand/pastel/history.mjs — the pastel history clock, after the new skeleton: a lavender ring that winds
// counter-clockwise from the bottom-left round to a large separated arrowhead on the left, around a sky clock face
// with ink hands (A) pivoting at the centre.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { arc, poly, circle, bar, unite } = Prim
  return compose([
    ['lavender@K', unite(arc(13, 12.5, 8.5, -178, 118, 2.6), poly([[1.25, 11.25], [7.75, 11.25], [4.5, 15.5]], [0.9, 0.9, 1]))],
    ['sky@K', circle(13, 12.5, 5.6)],
    ['ink@A', bar([[13, 9.25], [13, 12.5], [15.5, 14]], 1.7)],
  ], icon)
}
