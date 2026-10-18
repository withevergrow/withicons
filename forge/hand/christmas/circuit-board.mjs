// forge/hand/christmas/circuit-board.mjs — a pine green board with one bold cream trace between two ringed solder
// pads (2 nodes), under a thick snow cap with holly. The generated
// drawing split the plate and drew hairline traces that blurred at 16-24px.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

function snowCap(top, xa, xb, { up = 1.3, dn = 0.85, drips = [], ph = 0.7, ph2 = 2.1, taper = 1.2 } = {}) {
  const U = [], D = []
  for (let x = xa; x <= xb + 1e-6; x += 0.25) {
    const s = Math.abs(top(x + 0.4) - top(x - 0.4)) / 0.8
    const e = Math.max(0, Math.min(1, (x - xa) / taper, (xb - x) / taper))
    const q = Math.sqrt(Math.max(0, Math.min(1, 1 - (s - 0.5) / 1.1)) * e * e * (3 - 2 * e))
    let d = dn * q * (1 + 0.18 * Math.sin(x * 2.1 + ph2))
    for (const p of drips) { const u = (x - p.x) / p.w; if (Math.abs(u) < 1) d = Math.max(d, dn * q + p.l * q * Math.sqrt(1 - u * u)) }
    U.push([x, top(x) - up * q * (1 + 0.1 * Math.sin(x * 1.4 + ph))]); D.push([x, top(x) + d])
  }
  return { cap: loopsD([[...U, ...D.slice().reverse()]]), shadow: loopsD([[...U.map(([x]) => [x, top(x) + 0.05]), ...D.map(([x, y]) => [x, y + 0.42]).reverse()]]) }
}
const rrTop = (x0, x1, y, r) => x => {
  const dx = x < x0 + r ? x0 + r - x : x > x1 - r ? x - (x1 - r) : 0
  return y + r - Math.sqrt(Math.max(0, r * r - Math.min(dx, r) ** 2))
}
const holly = (x, y) => [
  ['path', { d: `M${x} ${y}q-1.1-.9-2.2-.1q1 .9 2.2 .1zM${x} ${y}q1.1-.9 2.2-.1q-1 .9-2.2 .1z`, fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ['path', { d: disc(x - 0.45, y - 0.15, 0.5) + disc(x + 0.45, y - 0.15, 0.5) + disc(x, y - 0.75, 0.5), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
]

const PLATE = 'M5.4 4H18.6A2.4 2.4 0 0 1 21 6.4V18.6A2.4 2.4 0 0 1 18.6 21H5.4A2.4 2.4 0 0 1 3 18.6V6.4A2.4 2.4 0 0 1 5.4 4Z'
// one bold stepped trace between the two solder pads
const TRACE = 'M7.6 9.6H12.4L16.4 13.6V16.6M7.6 9.6V17.2H12.2'
const PADS = [[7.6, 9.6], [16.4, 16.6]]

export default function render(icon) {
  const name = icon.name || 'circuit-board'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const snow = snowCap(rrTop(3, 21, 4, 2.4), 3.4, 20.6, { up: 1.8, dn: 1.15, drips: [{ x: 7.6, w: 1.0, l: 0.7 }, { x: 14.5, w: 0.9, l: 0.55 }], taper: 1.1 })
  const line = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 4, x2: 13, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.7, x2: 0, y2: 5.6, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: PLATE, fill: C.c2, ...INK, class: 'wm-k' }],
    // deeper board inset so the cream copper pops in light and dark
    ['path', { d: 'M5.6 6.2H18.4A1.6 1.6 0 0 1 20 7.8V18.4A1.6 1.6 0 0 1 18.4 20H5.6A1.6 1.6 0 0 1 4 18.4V7.8A1.6 1.6 0 0 1 5.6 6.2Z', fill: C.ink, 'fill-opacity': 0.3, class: 'wm-k' }],
    // traces: a dark under-line keeps them crisp, the bright cream line is the copper
    ['path', { d: TRACE, ...line, stroke: C.ink, 'stroke-width': 3.6, 'stroke-opacity': 0.8, class: 'wm-a' }],
    ['path', { d: TRACE, ...line, stroke: C.shine, 'stroke-width': 2.3, class: 'wm-a' }],
    // the two nodes: ringed solder pads
    ['path', { d: PADS.map(([x, y]) => disc(x, y, 2.5)).join(''), fill: C.shine, ...INK, 'stroke-width': 0.7, class: 'wm-s' }],
    ['path', { d: PADS.map(([x, y]) => disc(x, y, 1.05)).join(''), fill: C.c2, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-s' }],
    ['path', { d: PLATE, fill: url(0), class: 'wm-shine' }],
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: snow.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(17.2, 3.8),
  ]
}
