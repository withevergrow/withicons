// christmas/eye-off: a cream eye with a green iris and pupil, crossed by one red slash with a thin cream gap, no snow
import { C } from '../../styles/_christmas-core.mjs'

const N = 'eye-off'
const id = n => 'wg-christmas-' + N + '-' + n, url = n => 'url(#' + id(n) + ')'
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const R = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const f = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => 'M' + f(cx - r) + ' ' + cy + 'a' + r + ' ' + r + ' 0 1 0 ' + f(2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + f(-2 * r) + ' 0Z'
const EYE = 'M2.5 12C5 7.2 8.6 5.5 12 5.5C15.4 5.5 19 7.2 21.5 12C19 16.8 15.4 18.5 12 18.5C8.6 18.5 5 16.8 2.5 12Z'
const S = 'M4.5 4.5L19.5 19.5', G = 'M7 7L17 17'

export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: id(0), x1: 3, y1: 5, x2: 14, y2: 19, gradientUnits: 'userSpaceOnUse' },
      [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]]]],
    ['path', { d: EYE, fill: C.c4, stroke: C.ink, 'stroke-width': 1.3, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: EYE, fill: url(0), class: 'wm-shine' }],
    ['path', { d: disc(12, 12, 3.3), fill: C.c2, stroke: C.ink, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: disc(12, 12, 1.4), fill: C.ink, class: 'wm-k' }],
    ['path', { d: disc(10.9, 10.9, 0.6), fill: C.shine, class: 'wm-shine' }],
    ['path', { d: G, stroke: C.c4, 'stroke-width': 3.9, ...R, class: 'wm-a' }],
    ['path', { d: S, stroke: C.ink, 'stroke-width': 3.1, ...R, class: 'wm-a' }],
    ['path', { d: S, stroke: C.c1, 'stroke-width': 1.9, ...R, class: 'wm-a' }],
  ]
}
