// forge/hand/bauhaus/file-archive.mjs — the file family page (blue sheet, yellow dog-ear, same measures as file)
// carrying a real zipper: cream teeth staggered left and right of one axis down the page, ending in a yellow pull
// with an ink slot (the generated pull read as a bottle).
import { rr, pill, cut, path } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const X0 = 4.5, Y0 = 2, X1 = 19.5, Y1 = 22, F = 5.5, NR = 2
function page() {
  const cx = X1 - F, cy = Y0 + F, nx = cx - 1, ny = cy + 1, R = F + 3
  const notch = path(`M${nx} ${ny - R}V${ny - NR}A${NR} ${NR} 0 0 0 ${nx + NR} ${ny}H${nx + R}A${R} ${R} 0 0 0 ${nx} ${ny - R}Z`)
  const body = cut(rr(X0, Y0, X1, Y1, 2.5), notch)
  const fr = NR - 1
  const fold = path(`M${cx} ${cy - F}V${cy - fr}A${fr} ${fr} 0 0 0 ${cx + fr} ${cy}H${cx + F}A${F} ${F} 0 0 0 ${cx} ${cy - F}Z`)
  return [['c3', body], ['c2', fold]]
}

const ZX = 10 // zipper axis
export default function render(icon) {
  const teeth = [4.25, 6.75, 9.25, 11.75].map((y, i) => i % 2 ? pill(ZX, y, ZX + 2.75, y + 1.75) : pill(ZX - 2.75, y, ZX, y + 1.75))
  return compose([
    ...page(),
    ['tint', ...teeth],
    ['c2', rr(ZX - 2.5, 14.25, ZX + 2.5, 20, 1.75)],
    ['ink', pill(ZX - 1, 16.25, ZX + 1, 18.25)],
  ], icon)
}
