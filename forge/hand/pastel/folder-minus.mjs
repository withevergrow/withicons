// forge/hand/pastel/folder-minus.mjs — the pastel folder family (peach back, butter front) with a larger blush badge and
// a long, heavy ink minus: the generated badge and its short minus melted into the warm folder at 16px. The badge is
// the A part the motion spec pulses.
import * as Kit from '../../styles/_pastel-kit.mjs'
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { folder, W } = Kit
  const { circle, seg2 } = Prim
  const f = folder(2.25, 4, 21.75, 20.25, 7.5)
  const cx = 17.25, cy = 17.25, r = 5
  return compose([
    ['peach', f.back],
    ['butter', f.front],
    ['cut', circle(cx, cy, r + W.MOAT)],
    ['blush@A', circle(cx, cy, r)],
    ['ink@A', seg2(cx - 2.6, cy, cx + 2.6, cy, 2)],
  ], icon)
}
