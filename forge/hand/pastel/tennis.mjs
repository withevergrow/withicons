// forge/hand/pastel/tennis.mjs — the pastel tennis racket, after the new skeleton: a tilted lavender teardrop head
// with a paper string bed and an ink diagonal weave, a slim neck into a long peach grip, and a separate butter ball.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { path, ellipse, rot, clip, join, seg2, circle } = Prim
  const head = path('M14 14 C13.75 12 14.75 6.75 12 4 A6.36 5.66 45 0 0 3.5 3.5 A6.36 5.66 45 0 0 4 12 C6.75 14.75 12 13.75 14 14 Z')
  const bed = rot(ellipse(7.6, 7.6, 4.15, 3.6), 45, 7.6, 7.6)
  const strings = join(
    seg2(4, 1, 14, 11, 1.15), seg2(2, 2, 13, 13, 1.15), seg2(1, 4, 11, 14, 1.15),
    seg2(11.2, 1, 1, 11.2, 1.15), seg2(13.2, 2, 2, 13.2, 1.15), seg2(14.2, 4, 4, 14.2, 1.15))
  return compose([
    ['lavender@K', head, seg2(13, 13, 16.25, 16.25, 2.25)],
    ['peach@K', seg2(16.75, 16.75, 19.75, 19.75, 4.25)],
    ['paper.well@K', bed],
    ['ink', clip(strings, bed)],
    ['butter@A', circle(19.5, 4.5, 2.75)],
  ], icon)
}
