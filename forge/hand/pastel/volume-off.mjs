// forge/hand/pastel/volume-off.mjs — the pastel muted speaker: a fuller sky speaker and a bold lit blush X (bars 3,
// the close-glyph build) instead of the thin flat cross, so the mute mark holds its rim and contrast at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { poly, seg2 } = Prim
  return compose([
    ['sky', poly([[2, 8.5], [6.25, 8.5], [11.75, 3.5], [11.75, 20.5], [6.25, 15.5], [2, 15.5]], [1.5, 0.9, 1.5, 1.5, 0.9, 1.5])],
    ['blush@S', seg2(15, 9, 20.75, 14.75, 3), seg2(20.75, 9, 15, 14.75, 3)],
  ], icon)
}
