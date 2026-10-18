// forge/hand/bauhaus/cast.mjs — the redesigned cast: a blue screen whose lower-left corner is opened by a wide arc
// (a 2u page gap all round), with the red source dot, an ink wave and a yellow wave rising from that corner (wm-a),
// so the screen reads first and the waves sit clear of it instead of fusing into an RSS feed glyph.
import { rr, circle, arc, cut } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const C = [3.5, 20.5] // the corner the waves rise from

export default function render(icon) {
  return compose([
    ['c3', cut(rr(2, 4, 22, 20, 3), circle(...C, 13.5))],
    ['c1', circle(C[0] + 0.75, C[1] - 0.75, 1.75)],
    ['ink', arc(...C, 6.5, 270, 360, 2.5)],
    ['c2', arc(...C, 10.25, 270, 360, 2.5)],
  ], icon)
}
