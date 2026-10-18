// forge/hand/bauhaus/gem.mjs — the cut stone of the line icon: flat table on top, pointed pavilion below, the same
// six facets, each a flat colour (yellow crown flanks, red centre, blue pavilion flanks) side by side.
import { poly, clip } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const shell = poly([[7, 3.5], [17, 3.5], [21.5, 9], [12, 21], [2.5, 9]], [1.1, 1.1, 1.2, 1.4, 1.2])
  const f = pts => clip(poly(pts, 0), shell)
  return compose([
    ['c2', f([[0, 0], [10, 0], [8.5, 9], [0, 9]]), f([[14, 0], [24, 0], [24, 9], [15.5, 9]])],
    ['c1', f([[10, 0], [14, 0], [15.5, 9], [8.5, 9]])],
    ['c3', f([[0, 9], [8.5, 9], [12, 22], [2, 12]]), f([[15.5, 9], [24, 9], [22, 12], [12, 22]])],
    ['c2', f([[8.5, 9], [15.5, 9], [12, 22]])],
  ], icon)
}
