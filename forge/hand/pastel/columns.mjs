// forge/hand/pastel/columns.mjs — the pastel columns: a lavender frame holding two distinct paper columns, a tall
// left one and a shorter right one, each capped by a coloured header so the two-column read survives at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr } = Prim
  return compose([
    ['lavender@K', rr(2.5, 3, 21.5, 21, 3.25)],
    ['paper.well@K', rr(4.75, 5.5, 11, 18.75, 1.5)],
    ['paper.well@A', rr(13, 5.5, 19.25, 14, 1.5)],
    ['peach@K', rr(4.75, 5.5, 11, 8.5, 1.5)],
    ['peach@A', rr(13, 5.5, 19.25, 8.5, 1.5)],
  ], icon)
}
