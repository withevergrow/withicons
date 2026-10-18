// forge/hand/liquid/taxi.mjs: a side-view car: clear glass body with a cabin, coloured windows, two separate
// coloured wheels and a small accent roof light.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const rings = d => parsePath(d).map(s => s.pts)
const circle = (cx, cy, r, n = 24) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)])
function capsule(a, b, r, n = 10) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out = []
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 + Math.PI * i / n; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 + Math.PI * i / n; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]) }
  return out
}
const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const piece = (pts, plate) => ({ line: { pts, closed: true, plate }, fill: { set: [pts] } })
const go = (name, ps) => build({ name, paths: [], lines: ps.map(p => p.line), fills: ps.map(p => p.fill), cutouts: [] }) || []

export default function render(icon) {
  return go((icon && icon.name) || 'taxi', [
    piece(rings('M4 16.1 A1.5 1.5 0 0 1 2.5 14.6 V13.3 A2 2 0 0 1 4.5 11.3 H5.6 L8 7 H15 L18.2 11.3 H19.5 A2 2 0 0 1 21.5 13.3 V14.6 A1.5 1.5 0 0 1 20 16.1 Z')[0], 'K'),
    piece(rings('M8.9 8.4 H11.3 V11.1 H7.4 Z')[0], 'A'),
    piece(rings('M12.7 8.4 H14.4 L16.4 11.1 H12.7 Z')[0], 'A'),
    piece(circle(7.2, 18.4, 2), 'A'),
    piece(circle(16.8, 18.4, 2), 'A'),
    piece(box(9.7, 4.2, 13.3, 6.3), 'S'),
  ])
}
