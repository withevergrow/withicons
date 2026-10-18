// forge/hand/pastel/rss.mjs — the feed glyph at full pastel weight: a peach source dot and two broad peach arcs (A)
// at bar weight; the generated arcs and the small butter dot were thin and faint next to wifi and the other siblings.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { circle, arc } = Prim
  return compose([
    ['blush@K', circle(5.5, 18.5, 2.6)],
    ['peach@A', arc(5.5, 18.5, 8, 270, 360, 3), arc(5.5, 18.5, 14.25, 270, 360, 3)],
  ], icon)
}
