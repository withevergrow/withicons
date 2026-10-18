// forge/hand/pastel/lasso.mjs — the pastel lasso select: one soft lavender rope band (2.5) drawn as a wide open loop with
// a short trailing end, and a broad peach pointer (A) at its tail, so it reads as the selection tool, not a ring.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { stroke, poly } = Prim
  const rope = 'M11 15.25 C9.5 14.75 8.25 13 7 11.5 C5.75 10 3.25 9.25 3.25 6.75 C3.25 4.25 7.5 2.25 12 2.25 C16.5 2.25 20.75 4.25 20.75 6.75 C20.75 9.5 16.5 11 12 11 C9.75 11 8.25 11 7 11.5 L4.75 12.75'
  return compose([
    ['lavender@K', stroke(rope, 2.5)],
    ['peach@A', poly([[13, 13.25], [21.75, 17.25], [17.75, 18.25], [16.75, 22.25]], [0.9, 1.3, 0.8, 1.3])],
  ], icon)
}
