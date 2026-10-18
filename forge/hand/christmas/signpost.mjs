// forge/hand/christmas/signpost.mjs: a candy-striped pole with two bright arrow boards pointing opposite ways
// (cranberry right, gold left, each with a cream text line), a thin snow cap and holly on the top board, and a
// little snow drift at the foot. Replaces the generated drawing, where dark pine boards sank into the outline and
// a thick snow cap swallowed the top sign.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'signpost'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
const sh = P => poly(P.map(([x, y]) => [x, y + 0.4]))

function snow(xa, xb, top, { up = 0.85, dn = 0.5, drips = [], ph = 0, maxDn = 1.1 } = {}) {
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

const POLE = 'M10.5 21.4V6H13.5V21.4Z'
const BOARD1 = 'M5.7 4.7H17.6L21.7 7.4L17.6 10.1H5.7A1.2 1.2 0 0 1 4.5 8.9V5.9A1.2 1.2 0 0 1 5.7 4.7Z'
const BOARD2 = 'M18.4 12.5H6.5L2.3 15.2L6.5 17.9H18.4A1.2 1.2 0 0 0 19.6 16.7V13.7A1.2 1.2 0 0 0 18.4 12.5Z'
const DRIFT = 'M5.8 22.2C5.8 20.2 8.6 19.5 12 19.5C15.4 19.5 18.2 20.2 18.2 22.2C15 23 9 23 5.8 22.2Z'
// candy stripes on the pole, kept inside the outline
const STRIPES = [10, 12.1, 14.2, 16.3, 18.4].map(y => `M10.8 ${y}L13.2 ${y - 1}V${y + 0.1}L10.8 ${y + 1.1}Z`).join('')

export default function render() {
  const top1 = x => x < 17.6 ? 4.7 : 4.7 + (x - 17.6) * (2.7 / 4.1)
  const cap = snow(5.4, 18.6, top1, { ph: 1.1, drips: [[14.2, 0.6, 0.45]] })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2.4, y1: 2.4, x2: 16, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.8, x2: 0, y2: 6.1, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 19.5, x2: 0, y2: 22.6, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: POLE, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: STRIPES, fill: C.c1, class: 'wm-k' }],['path', { d: POLE, fill: url(0), class: 'wm-shine' }],
    ['path', { d: BOARD1, fill: C.c1, ...INK, class: 'wm-a' }],
    ['path', { d: 'M7 7.4H14.8', stroke: C.c4, 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: BOARD2, fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: 'M9.2 15.2H17.2', stroke: C.c4, 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: BOARD1, fill: url(0), class: 'wm-shine' }],['path', { d: BOARD2, fill: url(0), class: 'wm-shine' }],
    ['path', { d: sh(cap), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), ...INK, 'stroke-width': 0.42, class: 'wm-deco' }],
    ...holly(8.2, 3.9, 1.05),
    ['path', { d: DRIFT, fill: url(2), ...INK, 'stroke-width': 0.42, class: 'wm-deco' }],
  ]
}
