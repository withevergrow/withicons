// forge/hand/chrome/firecracker-string.mjs — a string of three big chrome firecrackers hanging from one bold cord, each with dark wrapper bands and a short fuse; replaces the noisy cluster of tiny crackers with pink bits.
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
  const name = (icon && icon.name) || 'firecracker-string'
  const cord = lines([[[2.6, 3.6], [7, 5.4], [12, 6], [17, 5.4], [21.4, 3.6]], [[6, 5.2], [6, 8]], [[12, 5.8], [12, 9]], [[18, 5.2], [18, 8]]], 2.4)
  const fuses = lines([[[6, 17], [6, 19.6]], [[12, 18], [12, 20.6]], [[18, 17], [18, 19.6]]], 1.3)
  const body = reg(rr(3.6, 7.6, 4.8, 9.6, 2) + rr(9.6, 8.6, 4.8, 9.6, 2) + rr(15.6, 7.6, 4.8, 9.6, 2))
  const bands = lines([[[3, 12.4], [9, 12.4]], [[9, 13.4], [15, 13.4]], [[15, 12.4], [21, 12.4]]], 0.7)
  const gap = grow(body, 0.45)
  const K = F.open(F.union(minus(body, bands), minus(F.union(cord, fuses), gap)), 0.2)
  const sil = F.union(F.copy(body), F.union(F.copy(cord), fuses))
  return out(layers({ T: {}, K, Af: null, Ab: null, S: null, sil, txt: null, seam: F.intersect(F.copy(bands), body) }), name)
}
