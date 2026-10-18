// forge/hand/chrome/holly.mjs — a holly sprig in chrome: two large separated spiky leaves with a dark central vein each, and three distinct enamel berries at the joint; replaces the pyramid of small pointy blobs.
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
  const name = (icon && icon.name) || 'holly'
  const leaf = (A, B, w) => {
    const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, n = 8
    const side = s => { const pts = []; for (let i = 1; i < n; i++) { const t = i / n, o = w * Math.sin(Math.PI * t) ** 0.6 * (i % 2 ? 1 : 0.5) * s; pts.push([A[0] + dx * t + nx * o, A[1] + dy * t + ny * o]) } return pts }
    const pts = [A, ...side(1), B, ...side(-1).reverse()]
    return 'M' + pts.map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + 'Z'
  }
  const leaves = reg(leaf([11, 12.4], [1.4, 18.6], 3.8) + leaf([13, 12.4], [22.6, 18.6], 3.8))
  const veins = lines([[[10, 13.1], [3, 17.6]], [[14, 13.1], [21, 17.6]]], 0.8)
  const berries = reg(disc(12, 7.4, 2.5) + disc(8.8, 10.4, 2.3) + disc(15.2, 10.4, 2.3))
  const K = F.open(minus(minus(leaves, grow(berries, 0.5)), veins), 0.2)
  const sil = F.union(F.copy(leaves), berries)
  const Af = F.open(F.copy(berries), 0.2)
  return out(layers({ T: {}, K, Af, Ab: null, S: null, sil, txt: null, seam: F.intersect(F.copy(veins), leaves) }), name)
}
