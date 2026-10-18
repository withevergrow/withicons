// forge/hand/pastel/bandage.mjs — the pastel bandage after the new skeleton: a peach adhesive strip laid on the diagonal,
// a full-width butter gauze pad across its middle with four ink vent dots, and small ink tape perforations on each end,
// so it reads as a plaster and not a capsule.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, circle, join, rot } = Prim
  const r = s => rot(s, -45, 12, 12)
  const dots = join(circle(10.25, 10.25, 0.9), circle(13.75, 10.25, 0.9), circle(10.25, 13.75, 0.9), circle(13.75, 13.75, 0.9))
  const holes = join(circle(4.9, 10.6, 0.65), circle(4.9, 13.4, 0.65), circle(19.1, 10.6, 0.65), circle(19.1, 13.4, 0.65))
  return compose([
    ['peach', r(rr(2.25, 7.6, 21.75, 16.4, 3.25))],
    ['ink', r(holes)],
    ['butter', r(rr(8.25, 8.4, 15.75, 15.6, 1.5))],
    ['ink', r(dots)],
  ], icon)
}
