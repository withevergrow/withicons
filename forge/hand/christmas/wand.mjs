// forge/hand/christmas/wand.mjs: a slim candy-striped wand (cream with cranberry stripes) running up to a gold
// ferrule and a big gold five-point star at the tip, with one sparkle and a tiny one. Replaces the generated stubby
// gold pill with plus-shaped sparkles.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'wand'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const f = v => Math.round(v * 100) / 100
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'

// wand axis from A (handle end) up to the star; u runs along the axis, n across it
const A = [4.3, 19.7], u = [0.7071, -0.7071], n = [0.7071, 0.7071]
const P = (a, b) => [f(A[0] + u[0] * a + n[0] * b), f(A[1] + u[1] * a + n[1] * b)]
const AXIS = 'M' + P(0, 0).join(' ') + 'L' + P(9.9, 0).join(' ')
const BAND = poly([P(9.9, -1.7), P(11.7, -1.7), P(11.7, 1.7), P(9.9, 1.7)])
const STRIPES = [1.6, 3.5, 5.4, 7.3].map(a => poly([P(a, -1.1), P(a + 0.8, -1.1), P(a + 1.5, 1.1), P(a + 0.7, 1.1)])).join('')

// five-point star at the tip, slightly chubby
const CX = 15.6, CY = 8.2, R1 = 4.7, R2 = 2.2
const STAR = poly(Array.from({ length: 10 }, (_, k) => {
  const r = k % 2 ? R2 : R1, a = -Math.PI / 2 + k * Math.PI / 5
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}))
const sparkle = (x, y, r) => `M${x} ${y - r}Q${f(x + 0.2 * r)} ${f(y - 0.2 * r)} ${x + r} ${y}Q${f(x + 0.2 * r)} ${f(y + 0.2 * r)} ${x} ${y + r}Q${f(x - 0.2 * r)} ${f(y + 0.2 * r)} ${x - r} ${y}Q${f(x - 0.2 * r)} ${f(y - 0.2 * r)} ${x} ${y - r}Z`

export default function render() {
  const line = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const SOFT = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 16, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    // shaft: ink outline, cream body, cranberry candy stripes, a gold ferrule just below the star
    ['path', { d: AXIS, ...line, stroke: C.ink, 'stroke-width': 3.5, class: 'wm-k' }],
    ['path', { d: AXIS, ...line, stroke: C.c4, 'stroke-width': 2.3, class: 'wm-k' }],
    ['path', { d: STRIPES, fill: C.c1, class: 'wm-k' }],
    ['path', { d: AXIS, ...line, stroke: url(0), 'stroke-width': 2.3, class: 'wm-k wm-shine' }],
    ['path', { d: BAND, fill: C.c3, ...SOFT, class: 'wm-k' }],
    ['path', { d: STAR, fill: C.c3, ...SOFT, 'stroke-width': 0.7, class: 'wm-a' }],
    ['path', { d: STAR, fill: url(0), class: 'wm-shine' }],
    ['path', { d: poly([[CX - 0.8, CY - 2.7], [CX - 0.1, CY - 1.4], [CX - 1.4, CY - 1.1]]), fill: C.shine, 'fill-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: sparkle(6.2, 6.4, 1.9), fill: C.accent, ...SOFT, 'stroke-width': 0.3, class: 'wm-deco' }],
    ['path', { d: sparkle(20.6, 16, 1.2), fill: C.accent, ...SOFT, 'stroke-width': 0.28, class: 'wm-deco' }],
  ]
}
