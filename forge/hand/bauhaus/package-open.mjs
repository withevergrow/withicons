// forge/hand/bauhaus/package-open.mjs — the isometric open carton: blue and red side faces under a dark diamond
// opening with two yellow flaps folded back, replacing the front-on blue box with a slot.
import { poly } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c2', poly([[4, 11], [2, 6.5], [10, 2.5], [12, 7]], [0.6, 1, 1, 0.4]), poly([[12, 7], [14, 2.5], [22, 6.5], [20, 11]], [0.4, 1, 1, 0.6])],
    ['c3', poly([[4, 11], [12, 15], [12, 21.5], [4, 17.5]], [1.4, 0.6, 1.1, 1.1])],
    ['c1', poly([[12, 15], [20, 11], [20, 17.5], [12, 21.5]], [0.6, 1.4, 1.1, 1.1])],
    ['ink', poly([[5.5, 11], [12, 7.75], [18.5, 11], [12, 14.25]], 0.6)],
  ], icon)
}
