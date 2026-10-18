// christmas/bandage: a red diagonal strip with a cream centre pad and four red dots, no snow
import { C } from '../../styles/_christmas-core.mjs'

const N = 'bandage'
const id = n => 'wg-christmas-' + N + '-' + n, url = n => 'url(#' + id(n) + ')'
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const R = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const f = v => Math.round(v * 100) / 100
const L = 'M6.4 17.6L17.6 6.4'

export default function render() {
  const u = [0.7071, -0.7071], v = [0.7071, 0.7071]
  const P = (a, b) => [f(12 + u[0] * a + v[0] * b), f(12 + u[1] * a + v[1] * b)]
  const padD = 'M' + [P(-2.9, -2.9), P(2.9, -2.9), P(2.9, 2.9), P(-2.9, 2.9)].map(p => p.join(' ')).join('L') + 'Z'
  const dot = ([x, y]) => 'M' + f(x - 0.55) + ' ' + y + 'a.55 .55 0 1 0 1.1 0a.55 .55 0 1 0 -1.1 0Z'
  const dots = [P(-1.2, -1.2), P(1.2, -1.2), P(1.2, 1.2), P(-1.2, 1.2)].map(dot).join('')
  return [
    ['defs', {}, [['linearGradient', { id: id(0), x1: 4, y1: 4, x2: 18, y2: 20, gradientUnits: 'userSpaceOnUse' },
      [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]]]],
    ['path', { d: L, stroke: C.ink, 'stroke-width': 8.6, ...R, class: 'wm-k' }],
    ['path', { d: L, stroke: C.c1, 'stroke-width': 7.4, ...R, class: 'wm-k' }],
    ['path', { d: padD, fill: C.c4, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: dots, fill: C.c1, class: 'wm-a' }],
    ['path', { d: L, stroke: url(0), 'stroke-width': 7.4, ...R, class: 'wm-shine' }],
  ]
}
