// forge/hand/chrome/bamboo.mjs: two chrome bamboo canes built from stacked segments with proud node collars and a dark
// seam at every node, plus two pointed gunmetal leaves fanning off the tall cane. Segments + collars are what make it
// bamboo (the old two-tube version read as bottles); the leaves sit behind as a second metal. Painted with the style's
// own layer recipe (_chrome-core layers/emit) on its own field engine.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const loopsOf = Fd => F.contour(F.copy(Fd)).filter(l => l.length > 2)

// a rounded segment: centre x, top, bottom, half width, corner
const seg = (cx, y0, y1, hw, r = 0.9) => `M${cx - hw} ${y0 + r}Q${cx - hw} ${y0} ${cx - hw + r} ${y0}H${cx + hw - r}Q${cx + hw} ${y0} ${cx + hw} ${y0 + r}V${y1 - r}Q${cx + hw} ${y1} ${cx + hw - r} ${y1}H${cx - hw + r}Q${cx - hw} ${y1} ${cx - hw} ${y1 - r}Z`

const A = 8.6, B = 16.6
// continuous canes (not stacked boxes) with a swelling at every node; a thin gunmetal band marks each joint
const bulge = (cx, y, hw) => seg(cx, y - 1.0, y + 1.0, hw + 0.45, 0.8)
const SEGS = [seg(A, 2.6, 21.6, 2.0, 1.0), seg(B, 10.4, 21.6, 1.85, 1.0), bulge(A, 9.6, 2.0), bulge(A, 16.0, 2.0), bulge(B, 16.2, 1.85)]
const band = (cx, y, hw) => seg(cx, y - 0.55, y + 0.55, hw + 0.7, 0.5)
const COLLARS = [band(A, 9.6, 2.0), band(A, 16.0, 2.0), band(B, 16.2, 1.85)]
const SEAMS = ''
const LEAVES = 'M9.6 8.6Q13.4 2.6 22.8 2.8Q20.8 10.2 9.6 8.6ZM7.6 15Q4.6 9.2 0.9 9Q1.2 16 7.6 15ZM17.4 14.4Q20 10 23.2 10.4Q22.8 15.8 17.4 14.4Z'

export default function render() {
  const Fc = F.copy(F.field()); for (const d of COLLARS) F.region(rings(d), M0, Fc)
  const Kf = F.copy(F.field()); for (const d of SEGS) F.region(rings(d), M0, Kf)
  const Kb = F.open(Kf, 0.25)
  const Af = F.strokes(lines(LEAVES), 1.4, M0)
  F.region(rings(LEAVES), M0, Af)
  const Ab = F.open(F.subtract(Af, F.offset(F.copy(Kb), -0.3)), 0.2)
  const Afr = F.open(Fc, 0.15)
  const sil = F.copy(Kb); F.union(sil, Ab)

  const Ls = layers({ T: {}, K: Kb, Af: Afr, Ab, S: null, sil, txt: null, seam: null })
  let out = emit(Ls, 'bamboo', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'bamboo', t)
  return out
}
