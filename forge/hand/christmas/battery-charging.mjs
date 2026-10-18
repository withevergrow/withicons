// forge/hand/christmas/battery-charging.mjs — a bold horizontal battery: thick cranberry case with a gold terminal, a frosty
// window holding a pine charge bar, and one big gold lightning bolt standing out of the case; a small snow cap on the top
// edge. Kept to few large shapes so it still reads at 16px. Roles: case c1, charge c2, terminal + bolt c3, window shine.
// Motion: the bolt is wm-s (flickers), the case wm-k.
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'battery-charging'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const P = (a, b) => `${num(a)} ${num(b)}`
const poly = pts => 'M' + pts.map(([x, y]) => P(x, y)).join('L') + 'Z'
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
function snow(xa, xb, y, { up = 1.2, dn = 0.8, drips = [] } = {}) {
  const n = 28, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.14 * Math.sin(x * 2.3))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, y - up * e * (1 + 0.08 * Math.sin(x * 1.5))]); L.push([x, y + Math.min(d, 2)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}
const CELL = rr(2, 5.5, 19.5, 18.5, 3)
const NUB = rr(19, 8.8, 22.6, 15.2, 1.4)
const WINDOW = rr(4.3, 7.8, 17.2, 16.2, 1.4)
const CHARGE = rr(4.9, 8.4, 13.4, 15.6, 0.9)
const BOLT = poly([[14, 2.8], [6.6, 12.8], [11, 12.8], [9.4, 21.2], [17.4, 10.6], [12.8, 10.6]])

export default function render() {
  const cap = snow(3.6, 9.4, 5.5, { up: 1.1, dn: 0.7, drips: [[4.9, 0.5, 0.55]] })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 5, x2: 14, y2: 18, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.6, x2: 0, y2: 6.6, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: NUB, fill: C.c3, ...INK, 'stroke-width': 0.8, class: 'wm-k' }],
    ['path', { d: CELL, fill: C.c1, ...INK, 'stroke-width': 0.9, class: 'wm-k' }],
    ['path', { d: WINDOW, fill: C.shine, ...INK, 'stroke-width': 0.55, class: 'wm-k' }],
    ['path', { d: CHARGE, fill: C.c2, class: 'wm-k' }],
    ['path', { d: CELL + NUB, fill: url(0), 'fill-rule': 'evenodd', class: 'wm-shine' }],
    ['path', { d: BOLT, fill: C.c3, ...INK, 'stroke-width': 0.8, class: 'wm-s' }],
    ['path', { d: BOLT, fill: url(0), class: 'wm-shine' }],
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.38])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
