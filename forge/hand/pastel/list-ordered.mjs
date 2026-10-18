// forge/hand/pastel/list-ordered.mjs — the pastel ordered list at the glyph weight: three lit lavender rows (w 3) and
// heavier peach numerals (w 2.5, the 1 with its foot) so the 1 and 2 keep their contrast on a light page at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2, stroke, unite } = Prim
  const w = 2.5
  const one = unite(seg2(5.5, 3.25, 5.5, 9, w), seg2(3.75, 4.5, 5.5, 3.25, w), seg2(3.5, 9, 7.5, 9, w))
  const two = stroke('M3.5 16 C3.75 14.5 4.75 14 5.6 14 C6.85 14 7.6 14.85 7.6 15.9 C7.6 16.9 7 17.5 6.25 18.15 L3.75 20.5 H7.75', w)
  return compose([
    ['lavender', seg2(13, 6, 20.5, 6, 3), seg2(13, 12, 20.5, 12, 3), seg2(13, 18, 20.5, 18, 3)],
    ['peach@A', one, two],
  ], icon)
}
