// christmas/database-zap: a cranberry three-disc cylinder (cream top, ink band arcs) with a bright gold bolt over its lower right, no snow
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'database-zap'
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
  const body = 'M3.4 5.4V18.2A7.1 2.6 0 0 0 17.6 18.2V5.4Z'
  const top = 'M3.4 5.4A7.1 2.6 0 0 1 17.6 5.4A7.1 2.6 0 0 1 3.4 5.4Z'
  const bands = 'M3.4 9.7A7.1 2.6 0 0 0 17.6 9.7M3.4 13.95A7.1 2.6 0 0 0 17.6 13.95'
  const bolt = 'M18.6 10.2L12.2 17.4H15.8L13.8 22.6L21.4 14.8H17.6Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3.4, y1: 3, x2: 15, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.8, x2: 0, y2: 8, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: body, fill: C.c1, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: body, fill: url(0), class: 'wm-shine' }],
    ['path', { d: bands, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: top, fill: C.c4, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: top, fill: url(1), 'fill-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: 'M6.2 5.1C8 3.9 10.4 3.6 12.6 4', stroke: C.shine, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: bolt, fill: C.c3, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M17.6 11.9L14.2 16', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, class: 'wm-shine' }],
    ...holly(17.8, 4.2, 0.95),
  ]
}
