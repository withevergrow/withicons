// forge/hand/plush/bamboo.mjs — bamboo: two sunflower stalks with felt node bands, and mint-green leaves sprouting
// from the nodes so the plant reads as bamboo rather than a cactus.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

export default function render(icon) {
  const P = ctxOf(icon)
  const stalkA = P.unite(P.pill(8.2, 2.6, 12, 11.6), P.pill(8.2, 11.6, 12, 21))
  const stalkB = P.unite(P.pill(14.6, 9.4, 18.2, 15.4), P.pill(14.6, 15.2, 18.2, 21))
  const leaf = { part: 'K' }
  return compose(restoreParts([
    P.felt('c4', P.lens(9, 8, 2.4, 4.4, 2.6), leaf),
    P.felt('c4', P.lens(11.4, 10.6, 20.6, 5.2, 2.8), leaf),
    P.felt('c4', P.lens(17.6, 13.2, 22, 9.4, 2.2), leaf),
    P.felt('c2', stalkA, { part: 'K' }),
    P.felt('c2', stalkB, { part: 'K' }),
    P.thread([[[8.6, 11.6], [11.6, 11.6]], [[15, 15.3], [17.8, 15.3]]], { w: 0.9, role: 'ink' }),
  ], icon), icon)
}
