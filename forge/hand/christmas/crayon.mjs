// christmas/crayon: a diagonal pine-green crayon, lighter pointed tip, cream wrapper band, snow-free, a holly sprig below
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'crayon'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

function holly(x, y, s = 1) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a)
    const L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L], nx = -sa, ny = ca
    const pt = (t, side) => {
      const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4))
      return [p0[0] + (tip[0] - p0[0]) * t + nx * w * side, p0[1] + (tip[1] - p0[1]) * t + ny * w * side]
    }
    const P = []
    for (let k = 0; k <= 8; k++) P.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) P.push(pt(k / 8, -1))
    return 'M' + P.map(p => num(p[0]) + ' ' + num(p[1])).join('L') + 'Z'
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(x - 0.42 * s, y + 0.18 * s, b) + disc(x + 0.42 * s, y + 0.18 * s, b) + disc(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: disc(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}

export default function render() {
  // local frame: u runs tip -> end along the axis (pointing up-right), v across
  const T = [4.6, 19.6], e = [0.7071, -0.7071], p = [0.7071, 0.7071], w = 3.2
  const P = (u, v) => num(T[0] + e[0] * u + p[0] * v) + ' ' + num(T[1] + e[1] * u + p[1] * v)
  const poly = pts => 'M' + pts.map(([u, v]) => P(u, v)).join('L') + 'Z'
  const tipD = poly([[0, 0], [5.8, -w], [5.8, w]])
  const bodyD = poly([[5.8, -w], [18.4, -w], [18.4, w], [5.8, w]])
  const bandD = poly([[9.4, -w], [14.2, -w], [14.2, w], [9.4, w]])
  const tipLines = 'M' + P(2.2, -0.9) + 'L' + P(2.2, 0.9)
  const J = { 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 4, x2: 20, y2: 20, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: bodyD, fill: C.c2, stroke: C.ink, 'stroke-width': 0.6, ...J, class: 'wm-k' }],
    ['path', { d: bandD, fill: C.c4, stroke: C.ink, 'stroke-width': 0.5, ...J, class: 'wm-a' }],
    ['path', { d: tipD, fill: C.c2, stroke: C.ink, 'stroke-width': 0.6, ...J, class: 'wm-k' }],
    ['path', { d: tipD, fill: C.shine, 'fill-opacity': 0.28, class: 'wm-shine' }],
    ['path', { d: bodyD + tipD, fill: url(0), class: 'wm-shine' }],
    ...holly(17.4, 6.2, 1.05),
  ]
}
