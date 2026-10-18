// forge/hand/christmas/volume-off.mjs — a gold speaker under a snow cap with a holly sprig and a bold, separate
// cranberry X, replacing the generated pale cream speaker whose thin pine X merged into the pudding-like silhouette.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'volume-off'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sh = (d, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${x} ${Math.round((+y + dy) * 100) / 100}`)
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

const SPEAKER = 'M9.34 5.42A1.75 1.75 0 0 1 12.25 6.73V17.27A1.75 1.75 0 0 1 9.34 18.58L6.71 16.25H4.5A2.25 2.25 0 0 1 2.25 14V10A2.25 2.25 0 0 1 4.5 7.75H6.71L9.34 5.42Z'
// the X: round-capped bars, mass half-width 1.35 with a 0.6 ink outline centred on the edge
const X = 'M15.4 9.4L20.6 14.6M20.6 9.4L15.4 14.6'
const SNOW = 'M1.66 10.14C1.43 8.05 2.37 6.68 4.02 6.63L6.43 6.63C7.54 5.86 8.6 4.99 9.6 4.27C10.72 3.51 12.07 3.67 12.66 4.55C13.01 5.1 13.01 6.08 12.84 7.18' +
  'C12.42 7.73 11.84 7.67 11.6 7.12C11.37 6.63 10.84 6.52 10.48 6.9C10.01 7.4 9.31 7.51 9.01 8.11C8.66 9.04 7.66 9.26 7.25 8.55C6.96 8.16 6.25 8.22 5.9 8.66' +
  'C5.31 9.7 4.07 9.64 3.78 8.99C3.55 8.55 2.84 8.55 2.49 9.15C2.19 9.75 1.78 10.47 1.66 10.14Z'

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
  const ink = C.ink
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 1.95, y1: 4.8, x2: 14.1, y2: 19.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.6, x2: 0, y2: 10.2, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 14, y1: 8, x2: 19, y2: 16, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: SPEAKER, fill: C.c3, stroke: ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: SPEAKER, fill: url(0), class: 'wm-shine' }],
    ['path', { d: sh(SNOW, 0.45), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(4.95, 6.55, 1.1),
    // the bold X badge
    ['path', { d: X, stroke: ink, 'stroke-width': 3.3, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: X, stroke: C.c1, 'stroke-width': 2.1, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: X, stroke: url(2), 'stroke-width': 2.1, 'stroke-linecap': 'round', class: 'wm-s wm-shine' }],
  ]
}
