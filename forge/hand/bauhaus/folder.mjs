// forge/hand/bauhaus/folder.mjs — the line folder (rounded body, tab up on the left) from flat primitives:
// a red back with its square-shouldered tab, a blue front flap moated off it, and a yellow quarter in the corner.
import { rr, unite, quarter, clip, cut } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const back = unite(rr(2.5, 6.5, 21.5, 20, 2.5), rr(2.5, 3.5, 11.5, 10, [2.25, 2.25, 0, 0]))
  const front = rr(2.5, 11, 21.5, 20, [0, 0, 2.5, 2.5])
  return compose([
    ['c1', back],
    ['cut', rr(1.5, 10, 22.5, 21, [0, 0, 3, 3])],
    ['c3', front],
    ['c2', clip(quarter(21.5, 20, 7.5, 'nw'), front)],
  ], icon)
}
