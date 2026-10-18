// forge/hand/bauhaus/candy-cane.mjs — the new cane: one red round-capped band with a wide hook, crossed by four even
// cream stripes clipped flush to it; replaces a blue hook with ink dashes that read as a P or a question mark.
import { stroke, seg2, clip, join } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const cane = stroke('M6.25 19.25V10.5A5.75 5.75 0 0 1 17.75 10.5V12.75', 4.5)
  const stripes = join(
    seg2(2.5, 18.2, 10, 13.7, 2.25),
    seg2(2.5, 11.7, 10, 7.2, 2.25),
    seg2(10, 2, 13, 7.5, 2.25),
    seg2(20, 6.25, 15, 11.25, 2.25),
  )
  return compose([
    ['c1', cane],
    ['tint', clip(stripes, cane)],
  ], icon)
}
