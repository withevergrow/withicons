// forge/hand/chrome/dhak.mjs — the common dhak in liquid chrome: a barrel drum on its side, a gunmetal drum head on the left, X lacing in gunmetal
// straps across the barrel and a gunmetal tuft of fronds on top.
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

const BODY = 'M5.5 10.4 H18.5 C22.1 12.6 22.1 19.9 18.5 22.1 H5.5 A2.7 5.85 0 0 1 5.5 10.4 Z'
const HEAD = 'M5.5 12.3 A1.7 4.0 0 1 1 5.5 20.3 A1.7 4.0 0 1 1 5.5 12.3 Z'
const LACE = 'M8.9 11.6 L13.7 21 L18.5 11.6 M8.9 21 L13.7 11.6 L18.5 21'
const TUFT = 'M14.6 10.4 C12.2 8.4 10.8 5.4 11.8 3.4 C14.4 4.2 15.8 7.2 14.6 10.4 Z M15.8 10.2 C14.6 7.2 15.4 3.8 17.2 2.2 C19 4.2 18.4 7.8 15.8 10.2 Z M17.2 10.6 C18 8.2 20.2 6.4 22.6 6.6 C22.2 9.2 20.2 11 17.2 10.6 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'dhak'
  const body = blob(BODY)
  const head = blob(HEAD)
  const gap = grow(head, 0.35)
  const seam = F.intersect(F.copy(gap), body)
  const K0 = minus(body, gap)
  const tuft = U(blob(TUFT), line('M15.4 11.4 L14.6 9.4 M16.2 11.4 L16.2 9 M17 11.4 L17.6 9.6', 1.5))
  const Ab = minus(tuft, grow(body, 0.3))
  const sil = U(F.copy(body), F.copy(Ab))
  const Ls = layers({ T: {}, K: F.open(K0, K.ROUND), Af: F.open(head, 0.25), Ab, S: null, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  // the lacing: gunmetal straps over the barrel, a dark edge and a steel core
  const w = v => Math.round(v * K.SCALE * 100) / 100
  const d = subs(LACE).map(s => 'M' + s.pts.map(p => p.map(v => Math.round(v * 100) / 100).join(' ')).join('L')).join('')
  out.push(['path', { d, stroke: col('shadow'), 'stroke-width': w(1.7), 'stroke-linejoin': 'round', 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
  out.push(['path', { d, stroke: col('c2'), 'stroke-width': w(0.85), 'stroke-linejoin': 'round', 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
  return out
}
