// forge/hand/pastel/music-note.mjs — the pastel eighth note with more presence: a bolder lavender stem and flag
// (w 3) and a fuller head, so the note holds its shape on white instead of a faint thin stem with a pale blob.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2, stroke, ellipse, rot, unite } = Prim
  return compose([
    ['lavender', unite(
      seg2(12.25, 17, 12.25, 3.75, 3),
      stroke('M12.5 3.5 C13.5 6.5 19 6.75 19 11.5', 3),
      rot(ellipse(8.25, 17.5, 4.5, 3.6), -18, 8.25, 17.5),
    )],
  ], icon)
}
