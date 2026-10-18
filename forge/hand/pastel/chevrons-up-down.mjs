// forge/hand/pastel/chevrons-up-down.mjs — two bold lavender chevrons, one up and one down, at the check exemplar's
// 3.5 weight with a firmer rim and a clear gap between them; the generated pair (thin, rim-only, pale) faded into
// two faint smudges at 16px.
import { P as p } from '../../styles/_pastel-render.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { paintEntries } from '../../styles/_pastel-paint.mjs'

export default function render(icon) {
  const E = entriesOf([['lavender@K', p.chevron(12, 4.25, 270, 6.5, 3.5), p.chevron(12, 19.75, 90, 6.5, 3.5)]], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E)
}
