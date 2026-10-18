// forge/hand/pastel/remove-formatting.mjs — the pastel clear-formatting glyph: the generated butter T and thin blush x
// were pale and the x fell apart at 16px, so the T is a lavender soft bar (the text family hue) and the x sits on a
// blush badge disc with a heavy ink cross and its moat, the house build for "x" modifiers (S wiggles it).
import * as Kit from '../../styles/_pastel-kit.mjs'
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { W } = Kit
  const { bar, seg2, circle, join } = Prim
  const cx = 17.75, cy = 17.75, r = 4.5, k = 1.75
  return compose([
    ['lavender@K', bar([[3.5, 6.75], [3.5, 4], [16.5, 4], [16.5, 6.75]], 3), seg2(10, 4, 10, 20.25, 3)],
    ['cut', circle(cx, cy, r + W.MOAT)],
    ['blush@S', circle(cx, cy, r)],
    ['ink@S', join(seg2(cx - k, cy - k, cx + k, cy + k, 1.9), seg2(cx - k, cy + k, cx + k, cy - k, 1.9))],
  ], icon)
}
