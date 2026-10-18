// forge/hand/chrome/settings-2.mjs — two slim chrome rails, each carrying one big gunmetal knob (a fat disc standing
// well above and below its rail, set in front on a dark seam) with a bright enamel hub cut into its face, so each
// knob reads as a ringed dial at 16px. The generated rails were fat chrome bars that swallowed the knobs; here the
// rails are slim and the knobs are the heaviest marks. Same layer recipe as the generator (_chrome-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const f = v => Math.round(v * 100) / 100
const star = (x, y, r, w = 0.26) =>
  `M${f(x)} ${f(y - r)}Q${f(x + w)} ${f(y - w)} ${f(x + r)} ${f(y)}Q${f(x + w)} ${f(y + w)} ${f(x)} ${f(y + r)}` +
  `Q${f(x - w)} ${f(y + w)} ${f(x - r)} ${f(y)}Q${f(x - w)} ${f(y - w)} ${f(x)} ${f(y - r)}Z`
const ROWS = [[7, 8.6], [17, 15.4]]             // rail y, knob x
const KNOB = 3.7                         // knob radius (skeleton units)
const HUB = 1.35                          // enamel hub radius

export default function render(icon) {
  const name = (icon && icon.name) || 'settings-2'
  const rails = F.strokes(ROWS.flatMap(([y]) => lines(`M3 ${y}H21`)), 2.1, M0)
  const knobs = F.region(ROWS.flatMap(([y, x]) => rings(disc(x, y, KNOB))), M0)
  const hubs = F.region(ROWS.flatMap(([y, x]) => rings(disc(x, y, HUB))), M0)
  const gap = grow(knobs, K.GAP)
  const seam = F.intersect(F.copy(gap), rails)
  const sil = F.copy(rails); F.union(sil, knobs)
  const round = Fd => F.open(Fd, K.ROUND)
  const Ls = layers({ T: { noGlint: true }, K: round(minus(rails, gap)), Af: round(minus(knobs, grow(hubs, 0.35))), Ab: null, S: hubs, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  // the glint: a small star on the upper knob's shoulder (the generated one sat on a rail end and read as an arrow tip)
  const [gx, gy] = tf([ROWS[0][1] - 2.2, ROWS[0][0] - 2.4])
  Ls.glint = ['path', { d: star(gx, gy, 1.2), fill: col('shine'), class: 'wm-a' }]
  return emit(Ls, name, 0)
}
