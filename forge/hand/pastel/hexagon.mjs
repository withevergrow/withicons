// forge/hand/pastel/hexagon.mjs — the pastel honeycomb cell: a pointy-top butter hexagon with soft corners around an
// inset butter well cell (A), following the redesigned skeleton; the generated drawing was a bare lavender polygon
// with no subject.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { poly, ngon } = Prim
  return compose([
    ['butter@K', poly(ngon(12, 12, 9.75, 6), 2)],
    ['butter.well@A', poly(ngon(12, 12, 5, 6), 1.1)],
  ], icon)
}
