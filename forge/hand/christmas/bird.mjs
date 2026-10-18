// christmas/bird: a plump cranberry robin facing right, gold beak, pine wing, ink eye with a glint, legs, a holly sprig on its head
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'bird'
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
  const body = 'M15.2 4.2C17.6 4.2 19.1 6 19.1 8C19.1 9.6 18.5 10.8 17.9 12C16.9 15.4 14 18.3 10.6 18.3C9 18.3 7.6 17.7 6.6 16.6L2.4 17.2L4.4 14.6L2.4 12L7.2 11.1C8 7.2 11 4.2 15.2 4.2Z'
  const wing = 'M14.6 10.2C11.6 9.4 8.4 11.2 6.8 14.6C10 15.6 13.4 14.8 14.8 12.4C15.1 11.6 15 10.8 14.6 10.2Z'
  const beak = 'M18.9 6.7L22.2 8.1L18.9 9.5Z'
  const legs = 'M11.4 18.2V20.6M9.9 20.6H12.9M14.2 17.6V20.4M12.7 20.4H15.7'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2.4, y1: 4.2, x2: 14, y2: 18.3, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: legs, stroke: C.ink, 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: beak, fill: C.c3, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d: body, fill: C.c1, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: wing, fill: C.c2, stroke: C.ink, 'stroke-width': 0.55, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M13.6 11.6C11.8 11.6 10 12.4 8.8 13.8', stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: body, fill: url(0), class: 'wm-shine' }],
    ['circle', { cx: 16.3, cy: 7.4, r: 1.05, fill: C.ink, class: 'wm-k' }],
    ['circle', { cx: 16.65, cy: 7.05, r: 0.34, fill: C.shine, class: 'wm-shine' }],
    ...holly(13.4, 4.3, 0.95),
  ]
}
