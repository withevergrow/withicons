// forge/hand/christmas/battery-low.mjs — a cream cell with a gold terminal and a frosty empty window holding one small
// cranberry sliver on the left, so "low" reads against the full red battery; snow and a holly sprig on the top edge.
// Roles: cell c4, terminal c3, window tint, sliver c1, snow shine->tint. Motion: the sliver is wm-a (the fill blinks).
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'battery-low'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const P = (a, b) => `${num(a)} ${num(b)}`
const poly = pts => 'M' + pts.map(([x, y]) => P(x, y)).join('L') + 'Z'
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
function snow(xa, xb, y, { up = 1.2, dn = 0.8, drips = [] } = {}) {
  const n = 28, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.14 * Math.sin(x * 2.3))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, y - up * e * (1 + 0.08 * Math.sin(x * 1.5))]); L.push([x, y + Math.min(d, 2)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}
function holly(x, y) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05, W = 0.62
    const p0 = [x + ca * 0.25, y + sa * 0.25], tip = [x + ca * L, y + sa * L]
    const pt = (t, s) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t - sa * w * s, p0[1] + (tip[1] - p0[1]) * t + ca * w * s] }
    const pts = []
    for (let k = 0; k <= 8; k++) pts.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) pts.push(pt(k / 8, -1))
    return poly(pts)
  }
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: discD(x - 0.42, y + 0.18, 0.46) + discD(x + 0.42, y + 0.18, 0.46) + discD(x, y - 0.42, 0.46), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: discD(x - 0.12, y - 0.58, 0.13), fill: C.shine, class: 'wm-deco' }],
  ]
}

const CELL = rr(2, 6.5, 19.5, 17.5, 2.6)
const NUB = rr(19.5, 9.8, 22.4, 14.2, 1.1)
const WINDOW = rr(4.1, 8.6, 17.4, 15.4, 1.3)
const SLIVER = rr(4.9, 9.4, 8, 14.6, 0.8)

export default function render() {
  const cap = snow(3.6, 11.4, 6.5, { up: 1.2, dn: 0.8, drips: [[5.6, 0.55, 0.65]] })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 5, x2: 14, y2: 18, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 4.4, x2: 0, y2: 7.8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: NUB, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: CELL, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: WINDOW, fill: C.shine, ...INK, 'stroke-width': 0.45, class: 'wm-k' }],
    ['path', { d: SLIVER, fill: C.c1, ...INK, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: SLIVER, fill: url(0), class: 'wm-shine' }],
    ['path', { d: CELL + NUB, fill: url(0), 'fill-rule': 'evenodd', class: 'wm-shine' }],
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.38])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(9.4, 5.4),
    ['path', { d: sparkle(19.2, 3.6, 1.5), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
