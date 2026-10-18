// forge/hand/chrome/gingerbread-man.mjs — a smooth chrome gingerbread man: round head, stubby arms and legs, two eye dots, a smile and three buttons; replaces the speckled blob of icing dots and zigzags.
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
  const name = (icon && icon.name) || 'gingerbread-man'
  const sil = lines([[[4.5, 11.5], [19.5, 11.5]], [[10.4, 15], [7.4, 20]], [[13.6, 15], [16.6, 20]]], 3.6)
  F.union(sil, lines([[[12, 10], [12, 15.5]]], 6.4))
  F.union(sil, reg(disc(12, 5.9, 3.7)))
  const d = reg(disc(10.6, 5.4, 0.62) + disc(13.4, 5.4, 0.62) + disc(12, 10.6, 0.65) + disc(12, 12.6, 0.65) + disc(12, 14.6, 0.65))
  F.union(d, lines([[[10.5, 7.3], [11.2, 7.8], [12, 7.95], [12.8, 7.8], [13.5, 7.3]]], 0.6))
  const K = F.open(minus(sil, d), 0.2)
  return out(layers({ T: {}, K, Af: null, Ab: null, S: null, sil, txt: null, seam: null }), name)
}
