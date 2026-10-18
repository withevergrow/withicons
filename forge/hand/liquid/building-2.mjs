// forge/hand/liquid/building-2.mjs: two clean tower blocks, a tall clear-glass one with a window grid and a door,
// and a shorter coloured-glass one beside it with its own windows; no inner panel outlines.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const rings = d => parsePath(d).map(s => s.pts)
const circle = (cx, cy, r, n = 24) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)])
// a capsule ring from a to b with radius r
function capsule(a, b, r, n = 10) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out = []
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 + Math.PI * i / n; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 + Math.PI * i / n; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]) }
  return out
}
const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const cut = (pts, closed = true) => ({ subs: [{ pts, closed }] })
const cutD = d => ({ subs: parsePath(d) })

const sq = (cx, cy, s = 0.85) => cut(box(cx - s, cy - s, cx + s, cy + s))
const L = [5.6, 9.4].flatMap(x => [6.4, 10, 13.6].map(y => sq(x, y)))
const R = [15.6, 18.6].flatMap(x => [12, 15.4, 18.6].map(y => sq(x, y, 0.75)))

export default function render(icon) {
  const name = (icon && icon.name) || 'building-2'
  return build({
    name, paths: [], lines: [{ pts: box(3, 3, 12, 21), closed: true, plate: 'K' }, { pts: box(13.2, 8.8, 21, 21), closed: true, plate: 'A' }],
    fills: [{ set: [box(3, 3, 12, 21)] }, { set: [box(13.2, 8.8, 21, 21)] }],
    cutouts: [...L, cut(box(6.2, 17, 8.8, 22)), ...R],
  })
}
