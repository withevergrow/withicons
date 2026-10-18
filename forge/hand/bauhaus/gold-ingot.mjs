// forge/hand/bauhaus/gold-ingot.mjs — three stacked ingots, two below and one on top: yellow trapezoid bars each with a
// red top face, separated by clean gaps, replacing the black-stroked tangle that muddied the pyramid.
import { poly, clip, rect } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const bar = (cx, yb) => poly([[cx - 5, yb], [cx + 5, yb], [cx + 3.4, yb - 6], [cx - 3.4, yb - 6]], [1.4, 1.4, 1.4, 1.4])
  const a = bar(6.75, 20.5), b = bar(17.25, 20.5), c = bar(12, 13.75)
  const top = (s, yb) => clip(s, rect(0, yb - 6.5, 24, yb - 3.6))
  return compose([
    ['c2', a, b, c],
    ['c1', top(a, 20.5), top(b, 20.5), top(c, 13.75)],
  ], icon)
}
