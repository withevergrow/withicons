// forge/hand/bauhaus/share-2.mjs — the share sheet of the line version: a heavy blue open-top tray (a U with a thick
// floor) with a long ink shaft rising out of it into a full red head; the tray is cut open on top so the box reads
// at 16px and the arrow sits clear above its walls.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { head } from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const tray = P.cut(P.rr(4.5, 10.5, 19.5, 21.25, 3), P.rr(7.5, 9, 16.5, 17.5, 1.25))
  return compose([
    ['c3', tray],
    ['ink', P.seg2(12, 15, 12, 8.5, 2.5)],
    ['c1', head(12, 2.5, 270, 6, 4.75, 1.5)],
  ], icon)
}
