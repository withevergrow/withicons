// forge/hand/pastel/align-center.mjs — lit lavender bars (w 2.75), the short ones clearly inset on both sides,
// so the bars hold on white and the centred rhythm reads apart from left and right at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2 } = Prim
  const w = 2.75
  return compose([['lavender',
    seg2(3.75, 4.5, 20.25, 4.5, w), seg2(7.25, 9.5, 16.75, 9.5, w),
    seg2(3.75, 14.5, 20.25, 14.5, w), seg2(7.25, 19.5, 16.75, 19.5, w)]], icon)
}
