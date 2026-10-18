// forge/hand/pastel/language.mjs — the pastel translate mark as plain soft glyphs, no tiles: a lavender 文 (top bar, tick
// and two crossing strokes) upper left and a blush A (A) lower right with a clear gap between them, so it keeps the
// source-glyph-to-letter metaphor of the other styles instead of becoming two coloured cards.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2, stroke, bar, unite } = Prim
  const w = 2.5
  const wen = unite(
    seg2(3.25, 6.25, 12.75, 6.25, w),
    seg2(8, 3, 8, 6.25, w),
    stroke('M11.25 6.75 C10.75 11.5 8.25 14.25 3.5 15.25', w),
    stroke('M4.75 6.75 C5.75 11 8.5 13.75 11.75 14.5', w),
  )
  const a = unite(
    bar([[13.75, 20.75], [17.75, 10.75], [21.75, 20.75]], 2.6),
    seg2(15.5, 18, 20, 18, 2.2),
  )
  return compose([
    ['lavender', wen],
    ['blush@A', a],
  ], icon)
}
