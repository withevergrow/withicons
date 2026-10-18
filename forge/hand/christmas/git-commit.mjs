// christmas/git-commit: a hollow cranberry ring on a continuous cranberry bar (one colour), a holly sprig on the ring's shoulder, no snow
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'git-commit'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const R = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

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
  const ring = 'M12 12m-4.2 0a4.2 4.2 0 1 0 8.4 0a4.2 4.2 0 1 0 -8.4 0'
  const bars = 'M2.6 12H7.4M16.6 12H21.4'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 5, x2: 16, y2: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: bars, stroke: C.ink, 'stroke-width': 3, ...R, class: 'wm-k' }],
    ['path', { d: ring, stroke: C.ink, 'stroke-width': 3.6, class: 'wm-k' }],
    ['path', { d: bars, stroke: C.c1, 'stroke-width': 1.8, ...R, class: 'wm-k' }],
    ['path', { d: ring, stroke: C.c1, 'stroke-width': 2.4, class: 'wm-k' }],
    ['path', { d: bars, stroke: url(0), 'stroke-width': 1.8, ...R, class: 'wm-shine' }],
    ['path', { d: ring, stroke: url(0), 'stroke-width': 2.4, class: 'wm-shine' }],
    ...holly(16.6, 6.4, 1),
  ]
}
