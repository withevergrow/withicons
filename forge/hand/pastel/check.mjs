// forge/hand/pastel/check.mjs — the pastel check at a heavier weight (w 4 instead of 3.5) so the mint tick holds its
// rim, top plane and bottom plane at 16px and no longer reads as a thin pale sliver beside the other glyphs.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { bar } = Prim
  return compose([
    ['mint', bar([[4.5, 12.75], [9.5, 17.75], [19.5, 6.75]], 4)],
  ], icon)
}
