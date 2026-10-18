// forge/hand/bauhaus/layout-dashboard.mjs — the redesigned dashboard: four unequal flat tiles on the skeleton's grid
// (a big blue square, a small yellow chip, a tall red column, a short ink bar), each its own primary, so the
// big/small/tall/short rhythm reads at 16px and never as layout-grid's equal 2x2.
import { rr } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c3', rr(2.5, 2.5, 12.5, 13.5, 2.5)],
    ['c2', rr(15.5, 2.5, 21.5, 8, 2)],
    ['c1', rr(15.5, 11, 21.5, 21.5, 2.5)],
    ['ink', rr(2.5, 16.5, 12.5, 21.5, 2)],
  ], icon)
}
