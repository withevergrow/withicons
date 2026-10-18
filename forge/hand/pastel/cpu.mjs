// forge/hand/pastel/cpu.mjs — the pastel chip: a lavender die with two well-spaced butter pins per side (moated off the
// body) and a large butter core (A) with an ink centre, so the core holds at 16px where the small sky core washed out.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, seg2, join, cut } = Prim
  const pins = []
  for (const v of [9, 15]) pins.push(seg2(v, 1.75, v, 6, 2.4), seg2(v, 18, v, 22.25, 2.4), seg2(1.75, v, 6, v, 2.4), seg2(18, v, 22.25, v, 2.4))
  return compose([
    ['lavender@K', rr(5, 5, 19, 19, 3)],
    ['butter.flat@K', cut(join(...pins), rr(4.1, 4.1, 19.9, 19.9, 3.7))],
    ['butter@A', rr(8, 8, 16, 16, 2.25)],
    ['ink@A', rr(10.6, 10.6, 13.4, 13.4, 0.9)],
  ], icon)
}
