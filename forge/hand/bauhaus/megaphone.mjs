// forge/hand/bauhaus/megaphone.mjs — the new megaphone: a blue rear block flush against a wide red horn that ends in a
// tall yellow mouth rim, with an ink handle below; replaces the old small cone that broke apart at 16px.
import { rr, poly, pill } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['ink', pill(6, 13, 9.75, 20.25)],
    ['c3', rr(2.75, 8.75, 8.75, 15.25, [2, 0, 0, 2])],
    ['c1', poly([[8.75, 8.75], [18.5, 3.75], [18.5, 20.25], [8.75, 15.25]], [0, 0, 0, 0])],
    ['c2', pill(17.25, 2.75, 20.75, 21.25)],
  ], icon)
}
