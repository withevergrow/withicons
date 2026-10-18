// forge/hand/chrome/scan-search.mjs — four slim gunmetal scanner corners round a chrome magnifier: a fat chrome rim
// cut away from a bright glass lens by a thin dark seam, and a short gunmetal handle behind it. The generated lens was
// a dark filled disc with a stub of a handle and fat brackets; here the glass stays bright (no horizon or ground laid
// across it), the handle is long enough to read, and the brackets are slimmer than the lens rim.
// Same layer recipe as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const LX = 10.2, LY = 10.2
const CORNERS = [
  'M3 7.6V5.4Q3 3 5.4 3H7.6', 'M16.4 3H18.6Q21 3 21 5.4V7.6',
  'M21 16.4V18.6Q21 21 18.6 21H16.4', 'M7.6 21H5.4Q3 21 3 18.6V16.4',
]
const HANDLE = `M${LX + 4.2} ${LY + 4.2}L${LX + 7.6} ${LY + 7.6}`

export default function render(icon) {
  const name = (icon && icon.name) || 'scan-search'
  const brackets = F.strokes(CORNERS.flatMap(lines), 1.9, M0)
  const handle = F.strokes(lines(HANDLE), 2.1, M0)
  const lens = F.region(rings(disc(LX, LY, 5.1)), M0)
  const glass = F.region(rings(disc(LX, LY, 3.5)), M0)
  const groove = F.strokes(lines(disc(LX, LY, 3.95)), 0.5, M0)
  const Ab = F.copy(brackets); F.union(Ab, handle)
  const round = Fd => F.open(Fd, K.ROUND)
  // the handle runs behind the lens; the lens carries a little dark moat where it crosses
  const Kb = minus(lens, groove)
  const sil = F.copy(Ab); F.union(sil, lens)
  const Ls = layers({ T: {}, K: round(Kb), Af: null, Ab: round(Ab), S: null, sil, txt: glass, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
