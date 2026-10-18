// forge/hand/bauhaus/filter.mjs — a true funnel (straight-sided cone tapering into a slanted stem), cut by two
// crisp seams into a yellow rim, a blue cone and a red stem; replaces the half-disc bowl that read as a plunger.
import { poly, clip, rect } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
// untagged nodes are the body: tag them wm-k so motion keeps them with the object
const body = nodes => nodes.map(([t, a]) => [t, a.class ? a : { ...a, class: 'wm-k' }])

export default function render(icon) {
  // one silhouette: a wide mouth (visible rim about x 2.8 to 21.2), cone to a 4u neck at y 12.5, stem with the
  // skeleton's slanted foot reaching y 21.2, so the funnel fills the live area like its siblings
  const funnel = poly([[1.5, 3.5], [22.5, 3.5], [14, 12.5], [14, 20], [10, 22], [10, 12.5]], [1, 1, 1, 1.25, 1.25, 1])
  return body(compose([
    ['c1', clip(funnel, rect(-2, 13, 26, 26))],
    ['c3', clip(funnel, rect(-2, 6.75, 26, 13))],
    ['c2', clip(funnel, rect(-2, -2, 26, 6.75))],
  ], icon))
}
