// forge/hand/bauhaus/motorcycle.mjs — the side-on motorcycle: two blue wheels with cream hubs, a black engine block
// and swingarm between them, a raked black fork up to the bars, a red tank and a yellow seat sitting on the frame.
import { circle, seg2, poly, pill, rr } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c3', circle(4.75, 17, 3.75), circle(19.25, 17, 3.75)],
    ['ink', rr(8, 12.5, 15.25, 18, 1.5), seg2(4.75, 17, 9.5, 13.5, 2.25), seg2(19.25, 17, 16, 7.5, 2.25), seg2(16, 7.5, 13.25, 6.5, 2.25)],
    ['tint', circle(4.75, 17, 1.25), circle(19.25, 17, 1.25)],
    ['c1', poly([[7, 8.25], [16, 8.25], [15.5, 13.25], [7, 13.25]], 1.4)],
    ['c2', pill(2, 8.5, 9.5, 11.5)],
  ], icon)
}
