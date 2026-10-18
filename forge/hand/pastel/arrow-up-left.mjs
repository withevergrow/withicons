// forge/hand/pastel/arrow-up-left.mjs — one soft lavender arrow reaching up-left, a touch bolder than the generated
// glyph (the check exemplar's 3.5 weight) so it earns the house top plane, bottom plane and glint, with a firmer rim:
// the generated 3.25 bar painted rim-only and washed out to a pale smudge at 16px on white.
import { P as p } from '../../styles/_pastel-render.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { paintEntries } from '../../styles/_pastel-paint.mjs'

export default function render(icon) {
  const E = entriesOf([['lavender@K', p.arrow(18, 18, 6.25, 6.25, { w: 3.5, head: 8.25 })]], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E)
}
