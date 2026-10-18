// forge/hand/pastel/layout-dashboard.mjs — the pastel dashboard to the new design: a big lavender tile top-left over a
// short wide peach strip, beside a small peach tile over a tall sky column, so the uneven split reads apart from layout-grid.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr } = Prim
  return compose([
    ['lavender@K', rr(2.5, 2.5, 13, 13.75, 2.75)],
    ['sky@K', rr(15.5, 10.75, 21.5, 21.5, 2.5)],
    ['peach@K', rr(15.5, 2.5, 21.5, 8.25, 2.25), rr(2.5, 16.25, 13, 21.5, 2.25)],
  ], icon)
}
