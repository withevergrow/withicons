// forge/hand/halloween/holly.mjs — two spiky slime-green holly leaves fanning up from a cluster of three red-orange
// berries. Leaves wm-k, berries wm-a, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'
import { fmt } from '../../kernel/geom.mjs'

const NAME = 'holly'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

function leaf(a, b, W, n, dx = 0, dy = 0) {
  const ax = b[0] - a[0], ay = b[1] - a[1], L = Math.hypot(ax, ay), nx = -ay / L, ny = ax / L
  const at = (t, w) => [a[0] + ax * t + nx * w + dx, a[1] + ay * t + ny * w + dy]
  const wf = t => W * Math.sin(Math.PI * t) ** 0.7
  const side = s => { const P = []; for (let i = 1; i < 2 * n; i++) { const t = i / (2 * n); P.push(at(t, s * wf(t) * (i % 2 ? 1 : 0.6))) } return P }
  const P = [at(0, 0), ...side(1), at(1, 0), ...side(-1).reverse()]
  return 'M' + P.map(p => p.map(fmt).join(' ')).join('L') + 'Z'
}
const L1 = [[11, 15], [2.2, 3.8]], L2 = [[13, 15], [21.8, 3.8]]
const berries = (dx, dy) => [[9.9, 17.4], [14.1, 17.4], [12, 20.4]]
  .map(([x, y]) => `M${fmt(x - 2.1 + dx)} ${fmt(y + dy)}a2.1 2.1 0 1 0 4.2 0a2.1 2.1 0 1 0 -4.2 0`).join('')

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 11, cy: 17, r: 5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.3, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(1), class: 'wm-deco' }],
    ['path', { d: leaf(...L1, 3.8, 3, 0.15, 0.85) + leaf(...L2, 3.8, 3, 0.15, 0.85) + berries(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: leaf(...L1, 3.8, 3) + leaf(...L2, 3.8, 3), fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: 'M10.4 14.2L3.6 5.6M13.6 14.2L20.4 5.6', ...ROUND, stroke: C.ink, 'stroke-width': 0.8, class: 'wm-k' }],
    ['path', { d: berries(0, 0), fill: url(0), ...INK, class: 'wm-a' }],
    ['path', { d: 'M9.2 16.7h.01M13.4 16.7h.01M11.3 19.7h.01', ...ROUND, stroke: C.shine, 'stroke-width': 0.8, class: 'wm-shine' }],
  ]
}
