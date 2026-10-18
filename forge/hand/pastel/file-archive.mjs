// forge/hand/pastel/file-archive.mjs — the pastel zip file after the new skeleton: the family sky sheet with its paper
// fold (A), a column of alternating ink zipper teeth and a butter zip pull (A) with an ink slot, so it reads as a zipped
// page instead of a bottle or jar.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, seg2, join } = Prim
  const f = Kit.page(4.5, 2.25, 19.5, 21.75, 5.75, 2.75)
  const t = 1.6
  const teeth = join(
    seg2(8.25, 5, 9.75, 5, t), seg2(10.25, 7.5, 11.75, 7.5, t),
    seg2(8.25, 10, 9.75, 10, t), seg2(10.25, 12.5, 11.75, 12.5, t),
  )
  return compose([
    ['sky', f.sheet],
    ['paper@A', f.fold],
    ['ink@A', teeth],
    ['butter@A', rr(7.5, 14.5, 12.5, 19.75, 2)],
    ['ink@A', seg2(10, 16.35, 10, 17.9, 1.5)],
  ], icon)
}
