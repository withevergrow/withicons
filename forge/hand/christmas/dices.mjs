// christmas/dices: two separate cream dice, a red-pip five (tilted left) and a pine-pip three (tilted right), a holly sprig on the upper die's corner
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'dices'
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

const rot = (cx, cy, deg) => (x, y) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
  return [cx + x * c - y * s, cy + x * s + y * c]
}
function rrect(cx, cy, s, r, deg) {
  const h = s / 2 - r, T = rot(cx, cy, deg), P = ([x, y]) => num(x) + ' ' + num(y)
  const q = (ccx, ccy, dx, dy) => P(T(ccx + dx * r, ccy + dy * r))
  return 'M' + q(-h, -h, -1, 0) + 'A' + r + ' ' + r + ' 0 0 1 ' + q(-h, -h, 0, -1) +
    'L' + q(h, -h, 0, -1) + 'A' + r + ' ' + r + ' 0 0 1 ' + q(h, -h, 1, 0) +
    'L' + q(h, h, 1, 0) + 'A' + r + ' ' + r + ' 0 0 1 ' + q(h, h, 0, 1) +
    'L' + q(-h, h, 0, 1) + 'A' + r + ' ' + r + ' 0 0 1 ' + q(-h, h, -1, 0) + 'Z'
}

export default function render() {
  const S = 9.2, r = 1.9
  const A = [7.2, 16.8, -8], B = [16.8, 7.2, 10]
  const dieA = rrect(A[0], A[1], S, r, A[2]), dieB = rrect(B[0], B[1], S, r, B[2])
  const pip = (d, o, fill) => { const [x, y] = rot(d[0], d[1], d[2])(o[0], o[1]); return ['circle', { cx: num(x), cy: num(y), r: 0.95, fill, stroke: C.ink, 'stroke-width': 0.3, class: 'wm-a' }] }
  const k = 2.3
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 2, x2: 22, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.3)]],
    ]],
    ['path', { d: dieA, fill: C.c4, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: dieA, fill: url(0), class: 'wm-shine' }],
    ...[[-k, -k], [k, -k], [0, 0], [-k, k], [k, k]].map(o => pip(A, o, C.c1)),
    ['path', { d: dieB, fill: C.c4, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: dieB, fill: url(0), class: 'wm-shine' }],
    ...[[-k, -k], [0, 0], [k, k]].map(o => pip(B, o, C.c2)),
    ...holly(12.6, 3.4, 0.9),
  ]
}
