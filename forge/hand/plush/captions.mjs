// forge/hand/plush/captions.mjs — the redesigned captions icon: a sky felt screen with a big cream "CC" sewn on as two
// stuffed C tubes (A), replacing the old subtitle pills that read as a card or keyboard.
import { ctxOf, restoreParts } from '../../styles/_plush-render.mjs'
import { compose } from '../../styles/_plush-compose.mjs'

const C = x => `M${x + 4.5} 8.25 H${x + 2.75} A2.75 2.75 0 0 0 ${x} 11 V13 A2.75 2.75 0 0 0 ${x + 2.75} 15.75 H${x + 4.5}`

export default function render(icon) {
  const P = ctxOf(icon)
  const pieces = [
    P.felt('c3', P.rr(1.75, 4, 22.25, 20, 3), { part: 'K' }),
    P.felt('tint', P.unite(P.stroke(C(5.75), 2.4), P.stroke(C(13.25), 2.4)), { part: 'A', stitch: false, out: 0.5 }),
  ]
  return compose(restoreParts(pieces, icon), icon)
}
