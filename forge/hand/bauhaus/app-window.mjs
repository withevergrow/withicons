// forge/hand/bauhaus/app-window.mjs — the same window as the line version: a blue rounded frame with a red title bar
// carrying three cream dots, and a clear cream body panel inset under it (no quarter-circle, no unframed colour block).
import { rr, circle } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
import { join } from '../../styles/_bauhaus-prim.mjs'

export default function render(icon) {
  const frame = rr(2, 3.5, 22, 20.5, 3)
  return compose([
    ['c3', frame],
    ['c1', rr(2, 3.5, 22, 9.25, 3)],
    ['c3', rr(2, 7.5, 22, 9.25, 0)],
    ['tint', rr(4.25, 11.25, 19.75, 18.25, 1.5)],
    ['tint', join(circle(5.75, 6.4, 1.25), circle(9.25, 6.4, 1.25), circle(12.75, 6.4, 1.25))],
  ], icon)
}
