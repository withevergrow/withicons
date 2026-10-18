// forge/hand/bauhaus/tv.mjs — red cabinet, yellow screen with a blue half sun, and rabbit-ear antennae splayed from a
// small ink dome with ball tips (tops on y = 2, bases 2.5u apart so the ears stay two strokes at 16px), replacing the generated V of two bars that read as a chevron or a check.
import { rr, seg2, half, clip, circle } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const s = rr(4.75, 9.5, 19.25, 18.25, 1.75)
  return compose([
    ['ink', half(12, 7, 2.5, 'n'), seg2(10.75, 5.5, 7.75, 3.5, 2), seg2(13.25, 5.5, 16.25, 3.5, 2), circle(7.5, 3.25, 1.25), circle(16.5, 3.25, 1.25)],
    ['c1', rr(2, 7, 22, 20.5, 3)],
    ['c2', s],
    ['c3', clip(half(12, 18.25, 4.75, 'n'), s)],
  ], icon)
}
