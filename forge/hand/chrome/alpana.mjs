// forge/hand/chrome/alpana.mjs — the common alpana in liquid chrome: five curled swirl tubes round a pink enamel gem,
// with five gunmetal dots between the curls.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const shrink = (A, e) => F.offset(F.copy(A), e)
const subs = d => parsePath(d).filter(s => s.pts && s.pts.length).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const line = (d, w, m = M0) => F.strokes(subs(d), w, m)
const blob = (d, m = M0) => F.region(subs(d).filter(s => s.closed || s.pts.length > 2).map(s => s.pts), m)
const circ = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
const U = (...A) => A.reduce((a, b) => F.union(a, b))

const SW = [
  'M12 9.07 C10.88 7.5 10.88 5.48 12.23 4.35 C13.58 3.22 15.83 3.67 16.05 5.48 C16.27 7.05 14.7 7.95 13.8 7.05',
  'M14.79 11.09 C15.93 9.54 17.85 8.92 19.35 9.85 C20.84 10.79 21.11 13.07 19.45 13.84 C18.03 14.53 16.69 13.32 17.26 12.18',
  'M13.72 14.37 C15.55 14.98 16.74 16.62 16.31 18.32 C15.88 20.03 13.8 20.99 12.56 19.66 C11.46 18.51 12.2 16.86 13.45 17.06',
  'M10.28 14.37 C10.26 16.3 9.07 17.93 7.32 18.05 C5.56 18.17 4.01 16.49 4.89 14.89 C5.64 13.49 7.44 13.69 7.63 14.95',
  'M9.21 11.09 C7.37 11.67 5.45 11.05 4.8 9.42 C4.14 7.78 5.26 5.78 7.05 6.13 C8.61 6.41 8.98 8.18 7.85 8.76',
]
const DOTS = [[19.39, 6.43], [19.58, 17.31], [9.3, 20.85], [2.75, 12.16], [8.99, 3.25]]
export default function render(icon) {
  const name = (icon && icon.name) || 'alpana'
  const swirls = line(SW.join(' '), 1.75)
  const gem = blob(circ(12, 12, 2.55), 1.15)
  const body = minus(swirls, grow(gem, K.MOAT))
  const dots = blob(DOTS.map(([x, y]) => circ(x, y, 1.15)).join(' '))
  const sil = U(F.copy(body), F.copy(dots), F.copy(gem))
  const Ls = layers({ T: {}, K: F.open(body, 0.2), Af: null, Ab: dots, S: gem, sil, txt: null, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 1)
}
