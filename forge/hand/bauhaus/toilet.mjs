// forge/hand/bauhaus/toilet.mjs — the common side-view toilet: a blue tank at the back with a yellow lid, a yellow seat
// band, a red bowl and an ink pedestal on a base, replacing the two abstract shapes without a pedestal.
import { rr, ehalf, poly } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c3', rr(4, 5, 10.5, 12, [0.5, 0.5, 1, 1])],
    ['c2', rr(3, 2.5, 11.5, 5.25, [1.4, 1.4, 0.9, 0.9])],
    ['ink', poly([[9, 15], [15, 15], [16, 20.25], [8, 20.25]], [0, 0, 1, 1]), rr(6.5, 19.5, 17.5, 22, 1.25)],
    ['c1', ehalf(12.5, 12, 8.5, 5.5, 's')],
    ['c2', rr(3, 10, 22, 12.75, 1.375)],
  ], icon)
}
