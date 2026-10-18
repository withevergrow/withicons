// forge/hand/chrome/candy-corn.mjs — the common upright candy corn in liquid chrome: a rounded cone cut into three bands, bright chrome tip,
// a gunmetal middle band and a chrome base, each a polished piece with its own reflection and a dark parting seam between them.
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

const CONE = 'M12 2.1 C13.7 2.1 14.8 3.5 15.6 5.5 L20.1 16.3 C21.2 19.7 17.3 22 12 22 C6.7 22 2.8 19.7 3.9 16.3 L8.4 5.5 C9.2 3.5 10.3 2.1 12 2.1 Z'
const BAND = 'M0 8.4 C6 11 18 11 24 8.4 L24 14.4 C18 17 6 17 0 14.4 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'candy-corn'
  const body = blob(CONE)
  const band = F.intersect(F.copy(body), blob(BAND))
  const gap = grow(band, 0.32)
  const K0 = minus(body, gap)
  const seam = F.intersect(F.copy(gap), body)
  const Ls = layers({ T: {}, K: F.open(K0, K.ROUND), Af: F.open(band, 0.25), Ab: null, S: null, sil: F.copy(body), txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
