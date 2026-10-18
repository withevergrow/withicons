// forge/hand/christmas/hotel.mjs — the common hotel: a tall building with a sign bar and a bed in the room below it, dressed
// for the season — a snow cap along the roofline under a gold star, and a pine garland swagged across the front with gold baubles. Roles: building c1, sign bar + headboard c3, bed linen c4, blanket + garland c2, star accent.
// Motion: the sign bar is wm-a, the building wm-k, the garland and star wm-deco.
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'hotel'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const P = (a, b) => `${num(a)} ${num(b)}`
const poly = pts => 'M' + pts.map(([x, y]) => P(x, y)).join('L') + 'Z'
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const star = (x, y, r) => {
  const pts = []
  for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? r * 0.46 : r; pts.push([x + q * Math.cos(a), y + q * Math.sin(a)]) }
  return poly(pts)
}
function snow(xa, xb, y, { up = 1, dn = 0.7, drips = [] } = {}) {
  const n = 28, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.14 * Math.sin(x * 2.3))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, y - up * e]); L.push([x, y + Math.min(d, 2)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}

const BUILD = 'M4.5 21.5V7.2A2 2 0 0 1 6.5 5.2H17.5A2 2 0 0 1 19.5 7.2V21.5Z'
const SIGN = rr(8, 10.2, 16, 12.4, 0.7)
const SWAG = 'M5.4 7.8Q8.7 10.6 12 7.8Q15.3 10.6 18.6 7.8'

export default function render() {
  const cap = snow(4.9, 19.1, 5.4, { up: 1.5, dn: 1.1, drips: [[7.4, 0.6, 0.7], [16.6, 0.55, 0.5]] })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 19, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.9, x2: 0, y2: 7.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: BUILD, fill: C.c1, ...INK, class: 'wm-k' }],
    // the bed: gold headboard, cream mattress, pine blanket, pillow
    ['path', { d: rr(6, 14.4, 7.6, 21.5, 0.5), fill: C.c3, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rr(7.6, 17.6, 18, 20.2, 0.8), fill: C.c4, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M11.2 17.6H16.6A1.4 1.4 0 0 1 18 19V20.2H11.2Z', fill: C.c2, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M8 16.9A1.6 1.2 0 0 1 11.2 16.9V17.6H8Z', fill: C.c4, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: BUILD, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SIGN, fill: C.c3, ...INK, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: 'M2 21.5H22', fill: 'none', stroke: C.ink, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-k' }],
    // garland swag with baubles
    ['path', { d: SWAG, fill: 'none', stroke: C.ink, 'stroke-width': 2.3, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: SWAG, fill: 'none', stroke: C.c2, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: discD(8.7, 9.2, 0.7) + discD(15.3, 9.2, 0.7), fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.4])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: star(12, 3.3, 2.5), fill: C.accent, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
