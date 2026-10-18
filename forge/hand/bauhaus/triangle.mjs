// forge/hand/bauhaus/triangle.mjs — a plain yellow upright triangle with a smaller red triangle inside it,
// the same way up, sitting low like a core.
import { tri } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c2', tri([12, 3], [22, 20.5], [2, 20.5], 2.2)],
    ['c1', tri([12, 10.75], [16.4, 18], [7.6, 18], 1)],
  ], icon)
}
