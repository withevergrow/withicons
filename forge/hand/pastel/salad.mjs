// forge/hand/pastel/salad.mjs — wide peach bowl on a foot, with a carrot, a half egg and a lettuce leaf poking out.
import * as P from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { paintEntries } from '../../styles/_pastel-paint.mjs'

export default function render(icon) {
  return paintEntries(entriesOf([
    ['mint@A', P.poly([[3.9, 2.6], [5.2, 2], [6.8, 6], [5.6, 6.6]], 0.6), P.poly([[6.6, 1.6], [8, 1.6], [8, 6], [6.6, 6]], 0.6)],
    ['peach@A', P.poly([[3.6, 7.2], [8.2, 5.4], [9.6, 11], [6, 11]], 0.9)],
    ['mint@A', P.unite(P.circle(17.2, 5.6, 2.4), P.circle(19.2, 7.8, 2.2), P.circle(15.4, 8.4, 2.4), P.circle(17.6, 9.8, 2))],
    ['text.mint@A', P.seg2(15.4, 11, 18.4, 5.2, 0.6), P.seg2(16.5, 8.8, 18.6, 8.6, 0.55)],
    ['paper@A', P.ellipse(12.2, 8.4, 2.9, 3.6)],
    ['butter.flat@A', P.circle(12.2, 9.4, 1.4)],
    ['peach@K', P.path('M2.6 11H21.4C21.4 15.6 18.1 19 12 19C5.9 19 2.6 15.6 2.6 11Z')],
    ['peach@K', P.rr(7.6, 18.4, 16.4, 21.2, 1)],
    ['shade.peach@K', P.rect(3.6, 11, 20.4, 12.2)],
  ], icon), { glint: true })
}
