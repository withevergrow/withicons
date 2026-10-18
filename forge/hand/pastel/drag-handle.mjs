// forge/hand/pastel/drag-handle.mjs — six lit lavender pearls (r 2.25, 7u pitch) in the more-horizontal build,
// so the grip keeps its weight at 16px instead of six small flat specks that dissolve into the page.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { circle } = Prim
  const r = 2.25, dots = []
  for (const y of [5, 12, 19]) for (const x of [8.5, 15.5]) dots.push(circle(x, y, r))
  return compose([['lavender', ...dots]], icon)
}
