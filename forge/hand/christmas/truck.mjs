// forge/hand/christmas/truck.mjs: a cranberry cargo box with a thin snow cap and holly, a gold cab with a pale
// window, and two big dark tyres with cream hubs. Snow only on the cargo box; cab, window and wheels stay separate.
// Replaces the generated drawing where the green body and snow merged into one mass.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'truck'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
const sh = P => poly(P.map(([x, y]) => [x, y + 0.4]))

function snow(xa, xb, top, { up = 0.9, dn = 0.55, drips = [], ph = 0, maxDn = 1.2 } = {}) {
  const n = 28, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.16 * Math.sin(x * 2.1 + ph))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, top(x) - up * e * (1 + 0.08 * Math.sin(x * 1.4 + ph))]); L.push([x, top(x) + Math.min(d, maxDn)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}
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

const BOX = 'M3.4 5.4H12.6A2 2 0 0 1 14.6 7.4V17.2H1.4V7.4A2 2 0 0 1 3.4 5.4Z'
const CAB = 'M14.6 8.6H18A1.4 1.4 0 0 1 19.1 9.15L22.2 13.1A1.6 1.6 0 0 1 22.6 14.1V17.2H14.6Z'
const WINDOW = 'M16.2 10.3H18L20.5 13.4H16.2Z'
const BAND = 'M1.4 10.6H14.6V12.2H1.4Z'
const WHEELS = [[6.2, 18], [18.4, 18]]

export default function render() {
  const rim = x => { const dx = x < 3.4 ? 3.4 - x : x > 12.6 ? x - 12.6 : 0; return 7.4 - Math.sqrt(Math.max(0, 4 - dx * dx)) }
  const cap = snow(2.1, 13.9, rim, { up: 1.1, dn: 0.8, ph: 0.8, maxDn: 1.5, drips: [[5.6, 0.55, 0.5]] })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 1.4, y1: 5.4, x2: 14, y2: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 14.6, y1: 8.6, x2: 22.6, y2: 17.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 4.5, x2: 0, y2: 7.2, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: CAB, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: WINDOW, fill: C.tint, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: CAB, fill: url(1), class: 'wm-shine' }],
    ['path', { d: BOX, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: BAND, fill: C.c4, stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: BOX, fill: url(0), class: 'wm-shine' }],
    ...WHEELS.flatMap(([x, y]) => [
      ['path', { d: disc(x, y, 3), fill: C.ink, class: 'wm-a' }],
      ['path', { d: disc(x, y, 1.45), fill: C.c4, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-a' }],
      ['path', { d: disc(x, y, 0.45), fill: C.ink, class: 'wm-a' }],
    ]),
    ['path', { d: sh(cap), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(2), ...INK, 'stroke-width': 0.42, class: 'wm-deco' }],
    ...holly(11, 4.8, 1.05),
  ]
}
