// forge/hand/pastel/phone-incoming.mjs — a chunkier sky handset with a big, bold peach arrow diving down-left into its
// curve; the generated thin arrow and slim handset shrank to a smudge at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

const HSD = 'M3 5 A2 2 0 0 1 5 3 H8 A1.5 1.5 0 0 1 9.5 4.5 V6 C9.5 7.25 8.5 7.25 8.5 8.5 A7 7 0 0 0 15.5 15.5 C16.75 15.5 16.75 14.5 18 14.5 H19.5 A1.5 1.5 0 0 1 21 16 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 Z'

export default function render(icon) {
  const { path, stroke, unite } = Prim
  return compose([
    ['sky@K', unite(path(HSD), stroke(HSD, 2.25))],
    ['peach@S', Kit.arrow(20.5, 3.5, 13.75, 10.25, { w: 3.25, head: 6.5 })],
  ], icon)
}
