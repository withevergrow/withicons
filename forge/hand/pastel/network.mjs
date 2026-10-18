// pastel network: the line design's orthogonal tree, a lavender top box, a flat bus-and-drop link bar and three sky
// rounded-square nodes, each with an ink port.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, seg2, unite, cut, pill } = Prim
  const hub = rr(8.25, 2.25, 15.75, 8.5, 2.25)
  const nodes = unite(rr(1.75, 15.75, 7.25, 21.5, 2.1), rr(9.25, 15.75, 14.75, 21.5, 2.1), rr(16.75, 15.75, 22.25, 21.5, 2.1))
  const links = cut(unite(seg2(12, 7.5, 12, 12.6, 2.2), seg2(3.4, 12.6, 20.6, 12.6, 2.2), seg2(4.5, 12.6, 4.5, 17, 2.2), seg2(19.5, 12.6, 19.5, 17, 2.2), seg2(12, 12.6, 12, 17, 2.2)), hub, nodes)
  return compose([
    ['lavender@K', hub],
    ['lavender.flat@A', links],
    ['sky@K', nodes],
    ['ink', pill(10.25, 4.6, 13.75, 6.15)],
    ['ink', pill(3.2, 18, 5.8, 19.35), pill(10.7, 18, 13.3, 19.35), pill(18.2, 18, 20.8, 19.35)],
  ], icon)
}
