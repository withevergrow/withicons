// forge/hand/bauhaus/cloud-off.mjs — the cloud family silhouette split by the "-off" slash itself: the lower-left
// piece (front lobe and base) prints red, the upper-right dome blue, the ink slash runs down the moat between them,
// so the slash is the seam and no slivers or stray shards are left (the new skeleton's two-piece cloud).
import { circle, pill, seg2, cut, join, soften } from '../../styles/_bauhaus-prim.mjs'
import { split } from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const S = [3.25, 3.25, 20.75, 20.75]
const DY = 0.5

export default function render(icon) {
  const sil = join(circle(8, 13 + DY, 4.5), circle(14.5, 10.75 + DY, 6), pill(2.5, 13 + DY, 21.5, 19.5 + DY))
  const gap = seg2(...S, 4.75)
  const [[ra, a], [rb, b]] = split(sil, 'c3', 'c1', 12, 12, 45)
  const k = s => soften(cut(s, gap), 1.25, { tmax: 2.5 })
  return compose([[ra, k(a)], [rb, k(b)], ['ink', seg2(...S, 2.5)]], icon)
}
