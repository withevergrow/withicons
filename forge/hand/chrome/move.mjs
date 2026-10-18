// forge/hand/chrome/move.mjs — the four-way cross as one fused chrome casting instead of a chrome cross with four
// gunmetal chevrons parked behind it: two clean bars meet in an uncluttered centre and end in four solid, softly
// rounded arrowheads, so the cross dominates, the centre carries only the mirror horizon, and the heads read at
// 16px. Same model and paint as the generator (_chrome-core.mjs); the geometry and the glint are drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const f = v => String(Math.round(v * 100) / 100)
// a wedge with rounded corners (radius along each edge per corner)
function wedge(pts, rs) {
  const n = pts.length, seg = []
  for (let i = 0; i < n; i++) {
    const v = pts[i], p = pts[(i + n - 1) % n], q = pts[(i + 1) % n]
    const cut = (a, r) => { const dx = a[0] - v[0], dy = a[1] - v[1], l = Math.hypot(dx, dy); return [v[0] + dx * r / l, v[1] + dy * r / l] }
    seg.push([cut(p, rs[i]), v, cut(q, rs[i])])
  }
  return seg.map(([a, v, b], i) => `${i ? 'L' : 'M'}${f(a[0])} ${f(a[1])}Q${f(v[0])} ${f(v[1])} ${f(b[0])} ${f(b[1])}`).join('') + 'Z'
}
// one solid casting of fills: four wedges and a cross of bars 3.1u wide (2.7 drawn, the weight of the style's tubes)
const R = [0.9, 0.7, 0.7], W = 1.55
const HEADS = [
  wedge([[12, 2.25], [15.5, 7.5], [8.5, 7.5]], R),
  wedge([[21.75, 12], [16.5, 15.5], [16.5, 8.5]], R),
  wedge([[12, 21.75], [8.5, 16.5], [15.5, 16.5]], R),
  wedge([[2.25, 12], [7.5, 8.5], [7.5, 15.5]], R),
]
const BARS = [`M${12 - W} 7 H${12 + W} V17 H${12 - W} Z`, `M7 ${12 - W} H17 V${12 + W} H7 Z`]
const P = (x, y) => [(x - 12) * K.SCALE + 12 + K.TX, (y - 12) * K.SCALE + 12 + K.TY]
const star = (x, y, r, w = 0.26) =>
  `M${f(x)} ${f(y - r)}Q${f(x + w)} ${f(y - w)} ${f(x + r)} ${f(y)}Q${f(x + w)} ${f(y + w)} ${f(x)} ${f(y + r)}` +
  `Q${f(x - w)} ${f(y + w)} ${f(x - r)} ${f(y)}Q${f(x - w)} ${f(y - w)} ${f(x)} ${f(y - r)}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'move'
  const fills = [...BARS, ...HEADS].map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const Ls = layers(model({ name, paths: [], lines: [], fills, cutouts: [] }))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  // the glint: on the up arrowhead's upper-left face, clear of its tip
  const [gx, gy] = P(10.6, 6)
  Ls.glint = ['path', { d: star(gx, gy, 1), fill: col('shine'), class: 'wm-shine' }]
  return emit(Ls, name, 0)
}
