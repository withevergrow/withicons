// forge/hand/chrome/sliders.mjs — three slim chrome rails, each carrying one stout gunmetal thumb (a rounded pill
// standing well above and below its rail, set in front on a dark seam), the thumbs staggered right, left, centre as in
// the skeleton. The generator laid thin gunmetal ticks behind fat rails, so the ticks barely showed past the rails and
// the six bars merged into a hash at 16px; here the rails are lighter and the thumbs are the heaviest marks.
// Same layer recipe as the generator (_chrome-core.mjs layers/emit); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const f = v => Math.round(v * 100) / 100
// a four-point star
const star = (x, y, r, w = 0.26) =>
  `M${f(x)} ${f(y - r)}Q${f(x + w)} ${f(y - w)} ${f(x + r)} ${f(y)}Q${f(x + w)} ${f(y + w)} ${f(x)} ${f(y + r)}` +
  `Q${f(x - w)} ${f(y + w)} ${f(x - r)} ${f(y)}Q${f(x - w)} ${f(y - w)} ${f(x)} ${f(y - r)}Z`

const RAIL_W = 2.3                      // rail tube (output units): lighter than the generator's 2.9
const THUMB_W = 3.5, THUMB_H = 2.6      // thumb tube width and centre-line half height (skeleton units)
const ROWS = [[5.5, 16], [12, 8], [18.5, 14]]   // rail y, thumb x

export default function render(icon) {
  const name = (icon && icon.name) || 'sliders'
  const rails = F.strokes(ROWS.flatMap(([y]) => lines(`M3.5 ${y}H20.5`)), RAIL_W, M0)
  const thumbs = F.strokes(ROWS.flatMap(([y, x]) => lines(`M${x} ${y - THUMB_H / 2}V${y + THUMB_H / 2}`)), THUMB_W, M0)
  // the parting gap round each thumb is a dark seam in its rail
  const gap = grow(thumbs, K.GAP)
  const seam = F.intersect(F.copy(gap), rails)
  const sil = F.copy(rails); F.union(sil, thumbs)
  const round = Fd => F.open(Fd, K.ROUND)
  const Ls = layers({ T: {}, K: round(minus(rails, gap)), Af: round(thumbs), Ab: null, S: null, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  // the glint: a small star on the top thumb's shoulder (the generated one sat on a rail end and read as an arrow tip)
  const [gx, gy] = tf([16, 5.5])
  Ls.glint = ['path', { d: star(gx - 0.7, gy - 1.6, 0.8), fill: col('shine'), class: 'wm-a' }]
  // six pieces make a dense drawing: the generator's lighter trace tier keeps it near the size budget
  return emit(Ls, name, 1)
}
