// forge/hand/pastel/zap-off.mjs — the whole butter bolt, intact, with a blush diagonal slash laid over it (no gap).
import * as P from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { paintEntries } from '../../styles/_pastel-paint.mjs'

export default function render(icon) {
  const E = entriesOf([
    ['butter@K', P.poly([[15.2, 1], [4.2, 14.4], [11.6, 14.4], [8.8, 23], [19.8, 9.6], [12.4, 9.6]], [0.9, 1, 0.5, 0.9, 1, 0.5])],
    ['blush@S', P.seg2(3.2, 3.2, 20.8, 20.8, 2.6)],
  ], icon)
  return paintEntries(E, { glint: true })
}
