// forge/hand/bauhaus/package.mjs — the parcel as one solid cube of three primary faces (yellow lid, red and blue sides)
// with red tape over the lid and down the front, replacing the generated wide-lidded tub that read as a bin.
import { poly, bar, clip } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const cube = poly([[12, 2.5], [21, 7], [21, 17], [12, 21.5], [3, 17], [3, 7]], [1.75, 1.5, 1.5, 1.75, 1.5, 1.5])
  const big = (pts) => clip(poly(pts, 0), cube)
  const top = big([[12, 2.5], [21, 7], [12, 11.5], [3, 7]])
  const left = big([[3, 7], [12, 11.5], [12, 21.5], [3, 17]])
  const right = big([[12, 11.5], [21, 7], [21, 17], [12, 21.5]])
  return compose([
    ['c2', top],
    ['c1', left],
    ['c3', right],
    ['c1', clip(bar([[5.5, 3.75], [16.5, 9.25], [16.5, 14]], 2.5), cube)],
  ], icon)
}
