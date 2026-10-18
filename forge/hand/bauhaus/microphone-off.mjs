// forge/hand/bauhaus/microphone-off.mjs — the microphone's whole red-over-yellow capsule on its ink U cradle and
// stand (axis X = 12, as in microphone), struck by a 2.25u ink "-off" slash whose 1u moat trims capsule and cradle
// alike. The slash keeps the family's 45 deg but runs 1.06u up-left of the diagonal, so the capsule parts into two
// substantial pieces (a red dome with its yellow band, and a >2u yellow foot) instead of a dome and a sliver.
import { pill, arc, seg2, clip, rect } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const X = 12 // mic axis, as in the generated microphone
const SEAM = 8 // red over yellow: high enough that the yellow is a real band on both sides of the slash, not a sliver
const S = [4.75, 3.25, 20.75, 19.25] // the slash: y = x - 1.5
// the capsule is the body (wm-k): compose would file the yellow under the slash (S) since the slash crosses it,
// and the motion's S 'draw' must move only the slash
const body = nodes => nodes.map(([t, a]) => [t, /bauhaus-c[12],/.test(a.fill || '') ? { ...a, class: 'wm-k' } : a])

export default function render(icon) {
  const capsule = pill(X - 3.75, 2, X + 3.75, 15)
  return body(compose([
    // the whole cradle (arc plus 1u posts so both arms stand as a U), stem and foot; the moat parts it below
    ['ink', arc(X, 11, 6.5, 0, 180, 2.25), seg2(X - 6.5, 10, X - 6.5, 11, 2.25), seg2(X + 6.5, 10, X + 6.5, 11, 2.25),
      seg2(X, 17.5, X, 21, 2.25), seg2(X - 3.75, 21, X + 3.75, 21, 2.25)],
    ['c1', clip(capsule, rect(-2, -2, 26, SEAM))],
    ['c2', clip(capsule, rect(-2, SEAM, 26, 26))],
    // a 1u page gap either side of the 2.25u bar
    ['cut', seg2(...S, 4.25)],
    ['ink', seg2(...S, 2.25)],
  ], icon))
}
