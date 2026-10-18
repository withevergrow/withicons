// forge/hand/christmas/video-camera.mjs — a cranberry camera body with a snow cap and holly, a separate gold lens horn
// with its own rounded corners, and a little gold record light, replacing the generated green box and red wedge that
// merged under one snow cap and read as a cube.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'video-camera'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sh = (d, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${x} ${Math.round((+y + dy) * 100) / 100}`)
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

const BODY = 'M4.1 5.5H13.4A2.6 2.6 0 0 1 16 8.1V15.9A2.6 2.6 0 0 1 13.4 18.5H4.1A2.6 2.6 0 0 1 1.5 15.9V8.1A2.6 2.6 0 0 1 4.1 5.5Z'
// the lens horn: a flared trapezoid with soft corners, its narrow end tucked against the body
const HORN = 'M17 10.7L21.05 7.75C21.75 7.25 22.5 7.6 22.5 8.45V15.55C22.5 16.4 21.75 16.75 21.05 16.25L17 13.3C16.65 13.05 16.5 12.6 16.5 12C16.5 11.4 16.65 10.95 17 10.7Z'
const SNOW = 'M1.14 7.99C1 5.66 2.07 4.25 3.99 4.2C7.2 4.15 10.41 4.15 13.57 4.2C15.43 4.25 16.52 5.61 16.36 7.83C15.9 8.48 15.07 8.32 14.71 7.67C14.34 7.07 13.57 7.07 13.15 7.72C12.53 9.13 11.18 9.13 10.67 7.72C10.36 7.07 9.63 6.96 9.16 7.5C8.65 8.05 7.82 8.05 7.3 7.5C6.73 6.85 5.9 7.07 5.49 7.94C4.92 9.45 3.47 9.45 3.05 8.15C2.74 7.4 1.71 7.29 1.14 7.99Z'

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
  const ink = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 1.2, y1: 5.2, x2: 13.9, y2: 18.8, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 4.2, x2: 0, y2: 9.2, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 16.5, y1: 7.3, x2: 20.3, y2: 16.7, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.4), st(0.45, C.shine, 0), st(0.6, C.shadow, 0), st(1, C.shadow, 0.4)]],
    ]],
    ['path', { d: HORN, fill: C.c3, ...ink, class: 'wm-a' }],
    ['path', { d: HORN, fill: url(2), class: 'wm-a wm-shine' }],
    ['path', { d: BODY, fill: C.c1, ...ink, class: 'wm-k' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    // record light
    ['path', { d: disc(4.6, 15.3, 1.1), fill: C.c3, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-k' }],
    ['path', { d: disc(4.28, 14.98, 0.33), fill: C.shine, class: 'wm-shine' }],
    ['path', { d: sh(SNOW, 0.5), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(11, 4.45, 1.2),
  ]
}
