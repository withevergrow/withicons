// forge/hand/bauhaus/pin.mjs — a real pushpin silhouette (round knob, flared red body, short wide blue collar, a bold
// ink needle) tilted 45 degrees like the skeleton; the generated ball-and-dome read as a matchstick at 16px.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

// drawn upright (needle down), then turned so the head sits upper right
const t = s => P.rot(s, 45, 12, 12)

export default function render(icon) {
  const head = P.unite(
    P.pill(7.25, 1.5, 16.75, 5.75),
    P.poly([[10, 4.5], [14, 4.5], [16.25, 13], [7.75, 13]], [0, 0, 0, 0]),
  )
  const nodes = compose([
    ['ink', t(P.seg2(12, 14, 12, 22, 2.5))],
    ['c1', t(head)],
    ['c3', t(P.pill(5.5, 11.5, 18.5, 15.75))],
  ], icon)
  // the needle is the A plate (motion pulses it from its point); head and collar are the body
  return nodes.map(([tag, a]) => [tag, { ...a, class: /bauhaus-(ink|shadow)/.test(a.fill) ? 'wm-a' : 'wm-k' }])
}
