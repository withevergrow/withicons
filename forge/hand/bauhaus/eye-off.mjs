// forge/hand/bauhaus/eye-off.mjs — eye-off: one whole blue lens with a red pupil on a yellow iris, so it reads as an eye
// at 16px; the ink slash sits on top with the kit's page moat separating it from the lens.
import * as P from '../../styles/_bauhaus-prim.mjs'
import * as K from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const lid = P.soften(P.lens(2, 12, 22, 12, 7), 1.5, { tmax: 3 })
  return compose([
    ['c3', lid],
    ['c2', P.circle(12, 12, 3.75)],
    ['c1', P.circle(12, 12, 1.75)],
    ...K.slash(4, 4, 20, 20),
  ], icon)
}
