// forge/hand/bauhaus/file-image.mjs — a blue page with the folded top-right corner (yellow flap), a yellow sun disc
// and a red mountain peak rising from the foot of the page.
import { poly, circle, tri, clip } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const page = poly([[4.5, 2], [13.5, 2], [19.5, 8], [19.5, 22], [4.5, 22]], [1.8, 0.9, 1.2, 1.8, 1.8])

export default function render(icon) {
  return compose([
    ['c3', page],
    ['c2', tri([13.5, 2], [13.5, 8], [19.5, 8], 1)],
    ['c2', circle(9.25, 11.5, 1.9)],
    ['c1', clip(page, tri([2, 23.5], [11.5, 13.5], [21, 23.5], 1.2))],
  ], icon)
}
