// forge/hand/bauhaus/rocket.mjs — an upright rocket turned to the usual 45 degrees: a long blue body with a red nose
// cone, a cream porthole, yellow fins and a red flame, built from flat geometric blocks (leaf, dome, triangles).
import { poly, rr, lens, circle, drop, rect, clip, unite, rot } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const R = s => rot(s, 45, 12, 12)
  const body = unite(clip(lens(12, 0.75, 12, 13, 3.9), rect(0, 0, 24, 9.5)), rr(8.1, 6.75, 15.9, 17.25, [0, 0, 1.1, 1.1]))
  const nose = clip(body, rect(0, 0, 24, 6.25))
  const finL = poly([[8.5, 11.5], [4, 18.5], [4, 20.25], [8.5, 18]], [0.9, 1.1, 1.1, 0.9])
  const finR = poly([[15.5, 11.5], [20, 18.5], [20, 20.25], [15.5, 18]], [0.9, 1.1, 1.1, 0.9])
  return compose([
    ['c1', R(drop(12, 19.25, 2.1, 12, 23.5, 0.9))],
    ['c2', R(finL), R(finR)],
    ['c3', R(body)],
    ['c1', R(nose)],
    ['tint', R(circle(12, 11, 2.25))],
  ], icon)
}
