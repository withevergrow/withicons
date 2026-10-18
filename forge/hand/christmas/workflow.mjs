// forge/hand/christmas/workflow.mjs: two equal square step nodes, cranberry (start dot) then pine (check), joined by
// a bold gold elbow connector that ends in a clear arrowhead, each node with a thin snow cap, plus one sparkle.
// Replaces the earlier drawing, where the tall red node and plain stem read as a lamp.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'workflow'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
const sh = P => poly(P.map(([x, y]) => [x, y + 0.4]))
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

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
const box = (x, y, s, r) => `M${x + r} ${y}H${x + s - r}A${r} ${r} 0 0 1 ${x + s} ${y + r}V${y + s - r}A${r} ${r} 0 0 1 ${x + s - r} ${y + s}` +
  `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + s - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
const S = 8, RR = 2.2
const AX = 2.5, AY = 3, BX = 13.5, BY = 13
const boxTop = (x0, y0) => x => {
  const dx = x < x0 + RR ? x0 + RR - x : x > x0 + S - RR ? x - (x0 + S - RR) : 0
  return y0 + RR - Math.sqrt(Math.max(0, RR * RR - dx * dx))
}
const LINK_D = 'M6.5 11V16A2 2 0 0 0 8.5 18H10.8'
const HEAD = 'M10.6 15.8L13.9 18L10.6 20.2Z'
const SPARK = 'M20.2 2.2Q20.6 3.5 21.9 3.9Q20.6 4.3 20.2 5.6Q19.8 4.3 18.5 3.9Q19.8 3.5 20.2 2.2Z'
const CHECK = 'M15.8 17.6L17.6 19.4L20.2 16.3'

export default function render() {
  const capA = snow(AX + 1.2, AX + S - 0.4, boxTop(AX, AY), { ph: 0.9, drips: [[8.4, 0.6, 0.4]] })
  const capB = snow(BX + 1.2, BX + S - 0.4, boxTop(BX, BY), { ph: 2.4, drips: [[19.2, 0.6, 0.4]] })
  const line = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2.5, y1: 3, x2: 11, y2: 11, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 13.5, y1: 13, x2: 22, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 2.2, x2: 0, y2: 4.8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(3), x1: 0, y1: 12.2, x2: 0, y2: 14.8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // connector sits under the nodes; the arrowhead is a solid triangle that touches the second node
    ['path', { d: LINK_D, ...line, stroke: C.ink, 'stroke-width': 3, class: 'wm-a' }],
    ['path', { d: HEAD, fill: C.ink, stroke: C.ink, 'stroke-width': 1.2, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: LINK_D, ...line, stroke: C.c3, 'stroke-width': 1.8, class: 'wm-a' }],
    ['path', { d: HEAD, fill: C.c3, stroke: C.c3, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // the two steps
    ['path', { d: box(AX, AY, S, RR), fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: box(AX, AY, S, RR), fill: url(0), class: 'wm-shine' }],
    ['path', { d: box(BX, BY, S, RR), fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: box(BX, BY, S, RR), fill: url(1), class: 'wm-shine' }],
    ['path', { d: disc(6.5, 8, 1.9), fill: C.c4, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-s' }],
    ['path', { d: CHECK, ...line, stroke: C.c4, 'stroke-width': 1.7, class: 'wm-s' }],
    ['path', { d: sh(capA) + sh(capB), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(capA), fill: url(2), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: poly(capB), fill: url(3), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: SPARK, fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
