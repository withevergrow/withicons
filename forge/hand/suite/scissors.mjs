// forge/hand/suite/scissors.mjs — an open pair of scissors drawn as a bold X: two tapered blades crossing at a pivot screw,
// each with a shank running back to an open ring handle (violet back blade, blue front blade); the generated drawing read as
// a solid ball on a stick.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'scissors'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])
const r = n => +n.toFixed(2)

// one arm: ring centre C, blade tip T. returns {ring, shank, blade, edge}
function arm(cx, cy, tx, ty, dy = 0) {
  const dx = tx - cx, dyy = ty - cy, len = Math.hypot(dx, dyy)
  const ux = dx / len, uy = dyy / len, nx = -uy, ny = ux
  const P = d => [cx + ux * d, cy + uy * d + dy]
  const a = P(2.7), s = P(7.4), t = [tx, ty + dy]
  const q = (d, w) => [P(d)[0] + nx * w, P(d)[1] + ny * w]
  const pts = [q(5.5, 1.2), q(10.5, 2.1), t, q(10.5, -2.1), q(5.5, -1.2)]
  const blade = 'M' + pts.map(p => `${r(p[0])} ${r(p[1])}`).join('L') + 'Z'
  const shank = `M${r(a[0])} ${r(a[1])}L${r(s[0])} ${r(s[1])}`
  const e0 = [s[0] + nx * 0.9 + ux * 1.2, s[1] + ny * 0.9 + uy * 1.2], e1 = [t[0] - ux * 1.6 + nx * 0.25, t[1] - uy * 1.6 + ny * 0.25]
  return { ring: [r(cx), r(cy + dy)], shank, blade, edge: `M${r(e0[0])} ${r(e0[1])}L${r(e1[0])} ${r(e1[1])}` }
}
const A = (dy = 0) => arm(5.4, 6, 21.6, 16.6, dy)   // violet, back
const B = (dy = 0) => arm(5.4, 18, 21.6, 7.4, dy)   // blue, front

const draw = (a, role, grad, extra = {}) => [
  ['circle', { cx: a.ring[0], cy: a.ring[1], r: 2.75, stroke: col(role), 'stroke-width': 2.4, fill: 'none', ...extra }],
  ['path', { d: a.shank, stroke: col(role), 'stroke-width': 2.4, 'stroke-linecap': 'round', ...extra }],
  ['path', { d: a.blade, fill: col(role), stroke: col(role), 'stroke-width': 0.7, 'stroke-linejoin': 'round', ...extra }],
]

export default function render() {
  const sh = col('shadow')
  const back = A(), front = B(), bs = A(0.6), fs = B(0.6)
  const shadowOf = (a, cls) => [
    ['circle', { cx: a.ring[0], cy: a.ring[1], r: 2.75, stroke: sh, 'stroke-width': 2.4, fill: 'none', 'stroke-opacity': 0.55, class: cls }],
    ['path', { d: a.shank, stroke: sh, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-opacity': 0.55, class: cls }],
    ['path', { d: a.blade, fill: sh, 'fill-opacity': 0.55, stroke: sh, 'stroke-opacity': 0.55, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: cls }],
  ]
  return [
    ['defs', {}, [sheenG(0, 3, 3, 22, 21)]],
    ...shadowOf(bs, 'wm-shadow'),
    ...draw(back, 'c2').map(n => (n[1].class = 'wm-a', n)),
    ['path', { d: back.edge, stroke: col('shine'), 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.55, class: 'wm-a' }],
    ...shadowOf(fs, 'wm-shadow'),
    ...draw(front, 'c1').map(n => (n[1].class = 'wm-k', n)),
    ['path', { d: front.edge, stroke: col('edge'), 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, class: 'wm-k' }],
    ['path', { d: front.blade, fill: url(0), class: 'wm-k' }],
    ['circle', { cx: 14.4, cy: 12, r: 1.35, fill: col('edge'), class: 'wm-k' }],
    ['circle', { cx: 14.4, cy: 12, r: 0.55, fill: col('shadow'), 'fill-opacity': 0.6, class: 'wm-k' }],
  ]
}
