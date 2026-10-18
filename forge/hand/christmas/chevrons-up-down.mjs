// christmas/chevrons-up-down: a red chevron up and a green chevron down, ink-edged like chevrons-up/down
import { C } from '../../styles/_christmas-core.mjs'

const N = 'chevrons-up-down'
const id = n => 'wg-christmas-' + N + '-' + n, url = n => 'url(#' + id(n) + ')'
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const R = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const UP = 'M7 10L12 5L17 10', DN = 'M7 14L12 19L17 14'

export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: id(0), x1: 5, y1: 3.5, x2: 12.5, y2: 20.5, gradientUnits: 'userSpaceOnUse' },
      [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]]]],
    ['path', { d: UP, stroke: C.ink, 'stroke-width': 3.1, ...R, class: 'wm-k' }],
    ['path', { d: UP, stroke: C.c1, 'stroke-width': 1.9, ...R, class: 'wm-k' }],
    ['path', { d: UP, stroke: url(0), 'stroke-width': 1.9, ...R, class: 'wm-shine' }],
    ['path', { d: DN, stroke: C.c4, 'stroke-width': 4.1, ...R, class: 'wm-a' }],
    ['path', { d: DN, stroke: C.ink, 'stroke-width': 3.1, ...R, class: 'wm-a' }],
    ['path', { d: DN, stroke: C.c2, 'stroke-width': 2.1, ...R, class: 'wm-a' }],
    ['path', { d: DN, stroke: url(0), 'stroke-width': 1.9, ...R, class: 'wm-a wm-shine' }],
    ['path', { d: 'M8.2 14.3L12 18.1', stroke: C.c4, 'stroke-width': 0.6, 'stroke-opacity': 0.75, ...R, class: 'wm-a wm-shine' }],
  ]
}
