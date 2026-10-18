// forge/hand/pastel/image-plus.mjs — the pastel picture with an add badge that stays clear of it: a smaller sky
// frame whose mint hill stays left of the badge (so the two mints never touch), and a solid mint badge with a
// heavier ink plus in its own moat at the corner, so the plus still reads at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, poly, clip, circle } = Prim
  const { glyph } = Kit
  const frame = rr(2, 3.5, 20, 18, 3)
  const hills = clip(poly([[1, 19], [1, 14.25], [6.75, 8.75], [13.25, 17.25], [13.25, 19]], [0, 0, 1.8, 1.2, 0]), frame)
  return compose([
    ['sky', frame],
    ['mint', hills],
    ['butter.flat@A', circle(14.5, 8, 1.9)],
    ['cut', circle(18, 18, 5.85)],
    ['mint@S', circle(18, 18, 4.65)],
    ['ink@S', glyph('plus', 18, 18, 2.45, 1.9)],
  ], icon)
}
