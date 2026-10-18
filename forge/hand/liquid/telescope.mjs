// forge/hand/liquid/telescope.mjs: a long tapered clear-glass tube angled up-right with a coloured objective
// band and eyepiece, sitting on a coloured hub over a splayed three-leg tripod.
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
  return go((icon && icon.name) || 'telescope', [
    piece([[6.57, 13.76], [5.43, 11.64], [16.46, 4.61], [18.54, 8.49]], 'K'),
    piece([[18.04, 8.95], [16.6, 6.25], [16.16, 3.8], [18.06, 2.78], [20.73, 7.81], [18.83, 8.83]], 'A'),
    piece(capsule([3.2, 14.2], [5.6, 12.9], 1), 'A'),
    piece(capsule([11.1, 14.6], [6.6, 21.4], 0.7), 'A'),
    piece(capsule([11.9, 14.6], [16.4, 21.4], 0.7), 'A'),
    piece(circle(11.5, 12.6, 1.5), 'S'),
  ])
}
