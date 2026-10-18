// forge/hand/pastel/reply-all.mjs — reply-all at the arrow exemplar's weight: a bold lavender reply arrow (head and
// curved tail) with a second sky chevron behind it, spaced apart and firmly rimmed; the generated thin pale strokes
// melted together at 16px on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { paintEntries } from '../../styles/_pastel-paint.mjs'

export default function render(icon) {
  const { bar, stroke, unite } = Prim
  const w = 3.25
  const front = unite(bar([[14.25, 5], [9.75, 9.5], [14.25, 14]], w), stroke('M9.75 9.5 H13.75 A6.5 6.5 0 0 1 20.25 16 V19.5', w))
  const back = bar([[7.75, 5], [3.25, 9.5], [7.75, 14]], w)
  const E = entriesOf([['lavender@K', front], ['sky@A', back]], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E)
}
