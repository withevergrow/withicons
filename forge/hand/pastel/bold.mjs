// forge/hand/pastel/bold.mjs — the pastel bold: a heavy lavender B built from a stem and two rounded bowls (the lower one
// wider), with clean open counters cut through, so the letter keeps a crisp, high-contrast silhouette at 16px instead
// of a soft lump with pinched counters and a stray glint.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, unite } = Prim
  const body = unite(
    rr(5, 2.75, 15.75, 12, [1.75, 4.6, 4.6, 0]),
    rr(5, 10.75, 17.75, 21.25, [0, 5.25, 5.25, 1.75]),
  )
  return compose([
    ['lavender', body],
    ['cut', rr(9.25, 6.25, 12.25, 8.75, 1.25), rr(9.25, 13.75, 13.5, 17.75, 2)],
  ], icon)
}
