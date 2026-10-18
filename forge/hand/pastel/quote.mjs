// forge/hand/pastel/quote.mjs — the pastel quote: two peach closing marks, each a soft rounded head with a smooth tail
// sweeping down-left to a rounded tip, so the pair reads as a clean "99" at 16px without the lumpy notch where the
// generated tail met the head.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, path, unite, move } = Prim
  const mark = unite(
    rr(2.75, 4.25, 10.25, 12.75, 2.75),
    path('M10.25 10 C10.25 15.25 8.25 18.5 4.6 19.75 C4 19.95 3.6 19.3 4.05 18.85 C5.9 16.9 6.6 15 6.6 12.25 L10.25 10 Z'),
  )
  return compose([
    ['peach', mark, move(mark, 11, 0)],
  ], icon)
}
