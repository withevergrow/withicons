// forge/hand/pastel/piggy-bank.mjs — round blush pig in side view, butter coin dropping into the slot on top,
// curly tail, pointed ear, peach snout with nostril, two short legs, eye dot.
import * as P from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { paintEntries } from '../../styles/_pastel-paint.mjs'

export default function render(icon) {
  const body = P.unite(
    P.ellipse(11.5, 14.2, 7.3, 5.6),
    P.poly([[14.6, 9.6], [18.6, 7.4], [17.9, 11.6]], 0.7),
    P.pill(6.6, 16.5, 9.4, 21.3),
    P.pill(13.4, 16.5, 16.2, 21.3),
  )
  return paintEntries(entriesOf([
    ['blush@K', body],
    ['blush@K', P.arc(3.4, 11.6, 1.2, 100, 400, 1.3)],
    ['peach@K', P.rr(17.6, 12.2, 21.4, 16.2, 1.4)],
    ['butter@S', P.circle(11.5, 6, 2.6)],
    ['text.butter@S', P.ring(11.5, 6, 1.4, 0.75)],
    ['text.blush@K', P.pill(8.6, 8.6, 14.4, 9.8)],
    ['text.blush@K', P.circle(16, 12.3, 0.85)],
    ['text.peach@K', P.pill(19.6, 13.4, 20.5, 15)],
  ], icon), { glint: true })
}
