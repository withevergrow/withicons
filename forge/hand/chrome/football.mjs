// forge/hand/chrome/football.mjs — a light chrome soccer ball: one sphere with a single dark central pentagon and seam strokes branching out to the rim; replaces the heavy grey disc of busy patches.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 1.15
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, m = M0, into = null) => F.region(rings(d), m, into)
const lines = (polys, w, m = M0) => F.strokes(polys.map(p => ({ pts: p.map(tf) })), w * S, m)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const out = (Ls, name) => { let o = emit(Ls, name, 0); for (let t = 1; t < 3 && size(o) > 8000; t++) o = emit(Ls, name, t); return o }

export default function render(icon) {
  const name = (icon && icon.name) || 'football'
  const at = (r, deg) => { const a = deg * Math.PI / 180; return [12 + r * Math.cos(a), 12 + r * Math.sin(a)] }
  const P = [0, 1, 2, 3, 4].map(k => at(3.5, -90 + 72 * k))
  const pent = reg('M' + P.map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + 'Z')
  const ball = reg(disc(12, 12, 9.6))
  const polys = []
  for (let k = 0; k < 5; k++) { const a = -90 + 72 * k; polys.push([P[k], at(9.8, a)]) }
  const seams = lines(polys, 0.7)
  const cut = F.union(F.copy(seams), grow(pent, 0.5))
  const K = F.open(minus(ball, cut), 0.25)
  const Af = pent
  return out(layers({ T: {}, K, Af, Ab: null, S: null, sil: ball, txt: null, seam: F.intersect(F.copy(seams), ball) }), name)
}
