// forge/hand/chrome/test-tube.mjs: one continuous chrome test tube lying at 45 degrees: a round bottom at the lower left,
// straight walls, and a separate rim lip at the upper right. The generated drawing cut the tube across the liquid line into
// two grey halves; here the tube stays whole and nothing crosses it.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const r2 = v => Math.round(v * 100) / 100

// local frame: d runs up to the upper right, n across the tube (lower right)
const D = [Math.SQRT1_2, -Math.SQRT1_2], N = [Math.SQRT1_2, Math.SQRT1_2]
const C0 = [7.6, 16.3], R = 3.4, H = 10.2
const pt = (c, a, b) => [c[0] + D[0] * a + N[0] * b, c[1] + D[1] * a + N[1] * b]
const P = p => `${r2(p[0])} ${r2(p[1])}`
const C1 = pt(C0, H, 0)
const BODY = `M${P(pt(C1, 0, R))}L${P(pt(C0, 0, R))}A${R} ${R} 0 0 1 ${P(pt(C0, 0, -R))}L${P(pt(C1, 0, -R))}Z`
// the rim lip: a wider, short band across the open end
const L0 = pt(C0, H + 0.9, 0), LW = R + 0.95, LT = 0.9
const rim = [pt(L0, -LT, LW), pt(L0, LT, LW), pt(L0, LT, -LW), pt(L0, -LT, -LW)]
const RIM = `M${P(rim[0])}L${P(rim[1])}L${P(rim[2])}L${P(rim[3])}Z`

export default function render() {
  const Kf = F.field()
  F.region(rings(BODY), M0, Kf)
  const body = F.open(Kf, 0.3)
  const lipF = F.field()
  F.region(rings(RIM), M0, lipF)
  const lip = F.open(F.subtract(lipF, F.offset(F.copy(body), 0.3)), 0.2)
  const sil = F.copy(body); F.union(sil, lip)
  const Ls = layers({ T: {}, K: body, Af: null, Ab: lip, S: null, sil, txt: null, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, 'test-tube', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'test-tube', t)
  return out
}
