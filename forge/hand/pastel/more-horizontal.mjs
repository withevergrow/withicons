// forge/hand/pastel/more-horizontal.mjs — three big lavender pearls (r 2.6, 2u apart) lit like the house fields,
// so the ellipsis keeps its weight at 16px instead of three faint flat specks.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { circle } = Prim
  return compose([
    ['lavender', circle(4.75, 12, 2.6), circle(12, 12, 2.6), circle(19.25, 12, 2.6)],
  ], icon)
}
