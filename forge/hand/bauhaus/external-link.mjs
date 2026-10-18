// forge/hand/bauhaus/external-link.mjs — a blue tile with a yellow corner quarter, opened by a moat along the arrow so
// the single bold ink shaft prints on the page (visible light and dark) and runs straight into a full red swept head
// clear of the tile; the generated shaft printed in fixed black on the tile and vanished outside it in dark mode.
import * as P from '../../styles/_bauhaus-prim.mjs'
import * as K from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const box = P.rr(3, 7.5, 16.5, 21, 3.5)
  const x0 = 9.75, y0 = 14.25, x1 = 21, y1 = 3
  return compose([
    ['c3', box],
    ['c2', K.cornerQuarter(box, 3, 21, 6.5, 'ne')],
    ['cut', P.seg2(x0, y0, x1, y1, 5)],
    ...K.arrow(x0, y0, x1, y1, { len: 7, half: 5.75 }),
  ], icon)
}
