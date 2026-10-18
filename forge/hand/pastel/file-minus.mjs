// forge/hand/pastel/file-minus.mjs — the pastel file minus after the line design: the family sky sheet with its paper
// fold (A) and one centred ink minus dash, no text lines and no badge disc.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2 } = Prim
  const f = Kit.page(4.5, 2.25, 19.5, 21.75, 5.75, 2.75)
  return compose([
    ['sky', f.sheet],
    ['paper@A', f.fold],
    ['ink@A', seg2(8.5, 14.5, 15.5, 14.5, 2.2)],
  ], icon)
}
