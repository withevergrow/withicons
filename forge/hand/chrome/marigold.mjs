// forge/hand/chrome/marigold.mjs — a marigold in three rings: ten bright chrome outer petals parted by deep notches,
// a ring of ten gunmetal petals turned half a step so they sit in the notches, and a hot enamel heart in a chrome
// bezel. Light, dark, bright: it reads as a flower, not the dark scalloped medal the generator drew.
// The outer petals keep the chrome sky ramp without the dark horizon laid across them, so the petals stay pale
// beside the gunmetal ring. Same layer recipe as the generator (_chrome-core.mjs); only the geometry is drawn here.
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const circle = (cx, cy, r, n = 28) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return tf([cx + r * Math.cos(a), cy + r * Math.sin(a)]) })
const polar = (r, deg) => { const a = deg * Math.PI / 180; return [12 + r * Math.cos(a), 12 + r * Math.sin(a)] }

// a rosette of n petals: discs of radius pr centred on a ring of radius cr, round a core disc
function rosette(n, cr, pr, turn) {
  const Fd = F.region([circle(12, 12, cr)], M0)
  for (let k = 0; k < n; k++) { const [x, y] = polar(cr, turn + 360 * k / n); F.union(Fd, F.region([circle(x, y, pr)], M0)) }
  return Fd
}

export default function render(icon) {
  const name = (icon && icon.name) || 'marigold'
  const outer = rosette(10, 6.5, 3.15, -90)
  const mid = rosette(10, 3.9, 2.55, -90 + 18)
  const heart = F.region([circle(12, 12, 2.25)], M0)
  // notches: a slim groove down each valley of the outer ring, so the petals stand apart
  const slits = []
  for (let k = 0; k < 10; k++) { const a = -90 + 18 + 36 * k; slits.push({ pts: [polar(8.1, a), polar(10.5, a)].map(tf), closed: false }) }
  const groove = F.strokes(slits, 0.55, M0)
  const gapMid = grow(mid, 0.55)
  const body = minus(minus(outer, gapMid), groove)
  const moat = grow(heart, K.MOAT)
  const sil = F.copy(outer)
  const round = Fd => F.open(Fd, 0.25)
  const txt = F.copy(outer)
  const Ls = layers({ T: { noGlint: true }, K: round(body), Af: round(minus(mid, moat)), Ab: null, S: heart, sil, txt, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  // the glint: a small four-point star on the upper-left petal
  const [gx, gy] = tf(polar(8.1, -128))
  const f = v => Math.round(v * 100) / 100, r = 1.15, w = 0.28
  const d = `M${f(gx)} ${f(gy - r)}Q${f(gx + w)} ${f(gy - w)} ${f(gx + r)} ${f(gy)}Q${f(gx + w)} ${f(gy + w)} ${f(gx)} ${f(gy + r)}Q${f(gx - w)} ${f(gy + w)} ${f(gx - r)} ${f(gy)}Q${f(gx - w)} ${f(gy - w)} ${f(gx)} ${f(gy - r)}Z`
  Ls.glint = ['path', { d, fill: col('shine'), class: 'wm-shine' }]
  return emit(Ls, name, 0)
}
