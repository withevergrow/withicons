// forge/hand/bauhaus/mail-open.mjs — the open envelope: its yellow flap swung up into a peak, a cream letter
// rising out of the opening (two red lines on it), the dark inside showing around it and the blue front pocket
// with its V lip in front. Flat fields cut from one envelope silhouette, so it reads as opened, not closed.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
// untagged nodes are the body: tag them wm-k so motion keeps them with the object
const body = nodes => nodes.map(([t, a]) => [t, a.class ? a : { ...a, class: 'wm-k' }])

const ENV = P.poly([[2.5, 10.5], [12, 3], [21.5, 10.5], [21.5, 21], [2.5, 21]], [1.5, 2, 1.5, 2.75, 2.75])
const BODY = P.poly([[0, 10.5], [24, 10.5], [24, 24], [0, 24]], 0)
const POCKET = P.poly([[0, 9.25], [12, 17], [24, 9.25], [24, 24], [0, 24]], [0, 2, 0, 0, 0])

export default function render(icon) {
  return body(compose([
    ['c2', ENV],
    ['ink', P.clip(ENV, BODY)],
    ['tint', P.rr(6.25, 7.5, 17.75, 18, 1)],
    ['c1', P.pill(8.75, 9.4, 15.25, 10.9), P.pill(8.75, 12.4, 13, 13.9)],
    ['c3', P.clip(ENV, POCKET)],
  ], icon))
}
