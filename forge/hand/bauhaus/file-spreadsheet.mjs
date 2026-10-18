// forge/hand/bauhaus/file-spreadsheet.mjs — a green page with the folded top-right corner (yellow flap) carrying
// the line table: a yellow header row and two rows of two cream cells, each cell its own block with a green gap.
import { poly, rr, tri } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['accent', poly([[4.5, 2], [13.5, 2], [19.5, 8], [19.5, 22], [4.5, 22]], [1.8, 0.9, 1.2, 1.8, 1.8])],
    ['c2', tri([13.5, 2], [13.5, 8], [19.5, 8], 1)],
    ['c2', rr(7, 10.25, 17, 13.25, 0.8)],
    ['tint', rr(7, 14.5, 11.4, 17.4, 0.8), rr(12.6, 14.5, 17, 17.4, 0.8), rr(7, 18.65, 11.4, 20.5, 0.8), rr(12.6, 18.65, 17, 20.5, 0.8)],
  ], icon)
}
