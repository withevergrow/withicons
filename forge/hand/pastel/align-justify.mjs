// forge/hand/pastel/align-justify.mjs — four full-width lavender bars drawn as lit soft fields (w 2.75) so the
// deeper rim and planes hold on white, where the generated thin flat bars washed out.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2 } = Prim
  const w = 2.75
  return compose([['lavender',
    seg2(3.75, 4.5, 20.25, 4.5, w), seg2(3.75, 9.5, 20.25, 9.5, w),
    seg2(3.75, 14.5, 20.25, 14.5, w), seg2(3.75, 19.5, 20.25, 19.5, w)]], icon)
}
