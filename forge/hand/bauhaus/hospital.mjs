// forge/hand/bauhaus/hospital.mjs — a plain rectangular red block (no church-like arch) between low blue wings,
// a big cream medical cross and a yellow door, so it reads as a hospital building at 16px.
import * as Prim from '../../styles/_bauhaus-prim.mjs'
import * as Kit from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const p = { ...Prim, ...Kit }
  return compose([
    ['c3', p.rr(2.5, 11, 21.5, 21, [2, 2, 1.5, 1.5])],
    ['c1', p.rr(6.5, 3, 17.5, 21, [2.5, 2.5, 0, 0])],
    ['tint', p.seg2(12, 6.25, 12, 11.75, 2.5), p.seg2(9.25, 9, 14.75, 9, 2.5)],
    ['c2', p.rr(10.25, 16, 13.75, 21, [1.25, 1.25, 0, 0])],
  ], icon)
}
