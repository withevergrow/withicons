// forge/hand/bauhaus/atom.mjs — the atom with all three orbits (0, 60 and 120 degrees) as blue, red and yellow rings,
// each cut free of the one beneath, around a solid ink hexagonal nucleus.
import { ellipse, cut, rot, poly, ngon } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const orbit = (deg, k = 0) => rot(cut(ellipse(12, 12, 10 + k, 4.1 + k), ellipse(12, 12, 8.2 - k, 2.3 - k)), deg)
const moat = (deg) => orbit(deg, 0.5)

export default function render(icon) {
  const nuc = poly(ngon(12, 12, 2.9, 6), 0.6)
  return compose([
    ['c3', orbit(0)],
    ['cut', moat(60)],
    ['c1', orbit(60)],
    ['cut', moat(120)],
    ['c2', orbit(120)],
    ['cut', poly(ngon(12, 12, 4.4, 6), 1)],
    ['ink', nuc],
  ], icon)
}
