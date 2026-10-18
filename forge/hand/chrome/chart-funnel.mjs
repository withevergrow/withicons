// forge/hand/chrome/chart-funnel.mjs: the stacked-tier funnel of the line version in chrome: a wide top bar, a narrower
// middle bar and a small stem, three separate polished pieces with a clear gap between tiers (each gets its own sky and
// horizon). The first drawing fused the tiers into one smooth cone; the tier steps are what make it a funnel chart.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

const TIERS = [rr(2.6, 3.2, 21.4, 9.0, 2), rr(5.6, 10.0, 18.4, 15.4, 2), rr(8.8, 16.4, 15.2, 21.2, 2)]

export default function render() {
  const Kf = F.field()
  for (const d of TIERS) F.region(rings(d), M0, Kf)
  const Kb = F.open(Kf, 0.3)
  const Ls = layers({ T: {}, K: Kb, Af: null, Ab: null, S: null, sil: F.copy(Kb), txt: null, seam: null })
  let out = emit(Ls, 'chart-funnel', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'chart-funnel', t)
  return out
}
