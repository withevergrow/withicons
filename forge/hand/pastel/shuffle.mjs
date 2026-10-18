// forge/hand/pastel/shuffle.mjs — the pastel shuffle in the media family's lavender (not the off-family blush):
// two soft bands that cross with a moat, so the over/under crossing reads at 16px, and arrowheads as their own part (A).
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { stroke } = Prim
  const { chevron } = Kit
  const w = 2.75
  const under = stroke('M3.5 6.5 H5.5 C10.75 6.5 12.25 17.5 17.5 17.5 H19.5', w)
  const over = stroke('M3.5 17.5 H5.5 C10.75 17.5 12.25 6.5 17.5 6.5 H19.5', w)
  return [
    ...compose([
      ['lavender@K', under],
      ['cut', stroke('M3.5 17.5 H5.5 C10.75 17.5 12.25 6.5 17.5 6.5 H19.5', w + 2.4)],
      ['lavender@K', over],
      ['lavender@A', chevron(20.25, 6.5, 0, 4.5, w), chevron(20.25, 17.5, 0, 4.5, w)],
    ], icon),
  ]
}
