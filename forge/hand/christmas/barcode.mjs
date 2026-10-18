// forge/hand/christmas/barcode.mjs — a cranberry label (slim 1.25u frame) with a snow cap and holly around a cream panel
// of eight ink bars in strongly varied widths and uneven gaps; the outer guards and the centre pair run 1u lower, EAN-style.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'barcode'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sh = (d, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${x} ${Math.round((+y + dy) * 100) / 100}`)
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

const LABEL = 'M4.5 5H19.5A2.5 2.5 0 0 1 22 7.5V16.5A2.5 2.5 0 0 1 19.5 19H4.5A2.5 2.5 0 0 1 2 16.5V7.5A2.5 2.5 0 0 1 4.5 5Z'
const PANEL = 'M4 7.75H20A0.75 0.75 0 0 1 20.75 8.5V17A0.75 0.75 0 0 1 20 17.75H4A0.75 0.75 0 0 1 3.25 17V8.5A0.75 0.75 0 0 1 4 7.75Z'
// bars [x, width, guard]: guard bars (outer pair + centre pair) drop to y 17, data bars stop at y 16
const BARS = [[4.5, 0.75, 1], [6, 2], [9, 0.75], [10.75, 0.75, 1], [12.5, 0.75, 1], [14, 0.75], [16, 1.75], [18.75, 0.75, 1]]
  .map(([x, w, g]) => `M${x} 9H${x + w}V${g ? 17 : 16}H${x}Z`).join('')
const SNOW = 'M1.65 7.3C1.45 5.15 2.55 3.85 4.4 3.8C9.5 3.75 14.5 3.75 19.6 3.8C21.45 3.85 22.5 5.1 22.35 7.15C21.9 7.65 21.15 7.55 20.8 7C20.45 6.5 19.75 6.5 19.4 7.05' +
  'C18.95 7.75 18.1 7.75 17.75 7.05C17.45 6.45 16.75 6.4 16.35 6.9C15.9 7.45 15.15 7.4 14.8 6.85C14.45 6.35 13.7 6.35 13.35 6.9C12.95 7.55 12.15 7.55 11.8 6.9' +
  'C11.5 6.4 10.8 6.35 10.4 6.85C9.95 7.4 9.2 7.4 8.85 6.85C8.5 6.35 7.8 6.35 7.45 6.9C7.05 7.6 6.2 7.6 5.85 6.95C5.55 6.4 4.85 6.35 4.45 6.85' +
  'C4 7.45 3.2 7.5 2.85 6.95C2.55 6.5 2 6.75 1.65 7.3Z'

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
      ['linearGradient', { id: id(0), x1: 1.7, y1: 4.7, x2: 13.2, y2: 19.3, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.8, x2: 0, y2: 7.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 3.25, y1: 7.75, x2: 12.5, y2: 17.75, gradientUnits: 'userSpaceOnUse' },
        [st(0.3, C.tint, 0), st(1, C.tint, 0.75)]],
    ]],
    ['path', { d: LABEL, fill: C.c1, stroke: ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: LABEL, fill: url(0), class: 'wm-shine' }],
    ['path', { d: PANEL, fill: C.c4, stroke: ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: PANEL, fill: url(2), class: 'wm-shine' }],
    ['path', { d: BARS, fill: ink, class: 'wm-k' }],
    ['path', { d: sh(SNOW, 0.45), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(15.6, 4, 1.2),
  ]
}
