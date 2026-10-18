// forge/hand/pastel/file-pdf.mjs — the pastel PDF file: the family sky sheet with its paper fold (A) and a blush
// label bar spelling PDF in ink strokes, so the format reads as PDF instead of a generic letter P.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

const M = 1.2 // moat (W.MOAT)

export default function render(icon) {
  const { rr, seg2, stroke, join } = Prim
  const f = Kit.page(4.5, 2.25, 19.5, 21.75, 5.75, 2.75)
  const w = 1.4, t = 14.5, b = 18.75, m = 16.75
  const letters = join(
    // P
    seg2(4.75, t, 4.75, b, w), stroke(`M4.75 ${t} H6.1 A1.12 1.12 0 0 1 6.1 ${m} H4.75`, w),
    // D
    stroke(`M9.25 ${t} V${b} H10.1 C11.9 ${b} 12.55 17.75 12.55 16.62 C12.55 15.5 11.9 ${t} 10.1 ${t} Z`, w),
    // F
    seg2(14.75, t, 14.75, b, w), seg2(14.75, t, 17, t, w), seg2(14.75, m, 16.5, m, w),
  )
  return compose([
    ['sky', f.sheet],
    ['paper@A', f.fold],
    ['ink', Kit.lines(8.25, [13.25, 11.25], [8.75, 11.25])],
    ['cut', rr(2.25 - M, 12.75 - M, 18.75 + M, 20.5 + M, 2.25 + M)],
    ['blush@A', rr(2.25, 12.75, 18.75, 20.5, 2.25)],
    ['ink@A', letters],
  ], icon)
}
