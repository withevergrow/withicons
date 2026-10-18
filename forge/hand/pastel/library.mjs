// forge/hand/pastel/library.mjs — the pastel library shelf: two standing books and one leaning book (A) in three
// separate hues with clear gaps and ink spine bands, on a butter shelf; the generated drawing repeated lavender on the
// first and leaning books and its bare spines merged at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, seg2, rot, join } = Prim
  const lean = s => rot(s, -10, 17.5, 20.5)
  return compose([
    ['lavender@K', rr(2.5, 3, 8, 20.5, 1.5)],
    ['ink', join(seg2(4.25, 6.5, 6.25, 6.5, 1.4), seg2(4.25, 16.75, 6.25, 16.75, 1.4))],
    ['sky@K', rr(9.25, 6.25, 14, 20.5, 1.5)],
    ['ink', seg2(10.9, 9.75, 12.35, 9.75, 1.4)],
    ['peach@A', lean(rr(17.5, 8, 22, 20.5, 1.5))],
    ['ink@A', lean(seg2(19.1, 11.5, 20.4, 11.5, 1.4))],
    ['butter@K', rr(2, 19.5, 22, 22, 1.25)],
  ], icon)
}
