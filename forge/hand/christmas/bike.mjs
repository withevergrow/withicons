// christmas/bike: green ring wheels with cream centres, a thin red frame, a gold seat and a handlebar
import { C } from '../../styles/_christmas-core.mjs'

const N = 'bike'
const id = n => 'wg-christmas-' + N + '-' + n, url = n => 'url(#' + id(n) + ')'
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const R = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const ring = (cx, cy, r) => 'M' + (cx - r) + ' ' + cy + 'a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0Z'
const FRAME = 'M6 16.5L10 10H16M6 16.5H12L10 10M12 16.5L16 10L18 16.5M16 10L15.2 7.6H17.6M10 10L9.7 7.8'
const SEAT = 'M8.4 7.6H11'

export default function render() {
  const W = ring(6, 16.5, 3.7) + ring(18, 16.5, 3.7)
  return [
    ['defs', {}, [['linearGradient', { id: id(0), x1: 2, y1: 10, x2: 14, y2: 21, gradientUnits: 'userSpaceOnUse' },
      [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]]]],
    ['path', { d: W, fill: C.c4, stroke: C.ink, 'stroke-width': 2.5, class: 'wm-k' }],
    ['path', { d: W, stroke: C.c2, 'stroke-width': 1.3, class: 'wm-k' }],
    ['path', { d: W, stroke: url(0), 'stroke-width': 1.3, class: 'wm-shine' }],
    ['path', { d: FRAME, stroke: C.ink, 'stroke-width': 2.3, ...R, class: 'wm-a' }],
    ['path', { d: SEAT, stroke: C.ink, 'stroke-width': 2.7, ...R, class: 'wm-a' }],
    ['path', { d: FRAME, stroke: C.c1, 'stroke-width': 1.2, ...R, class: 'wm-a' }],
    ['path', { d: SEAT, stroke: C.c3, 'stroke-width': 1.5, ...R, class: 'wm-a' }],
    ['path', { d: ring(6, 16.5, 0.9) + ring(18, 16.5, 0.9) + ring(12, 16.5, 0.8), fill: C.c3, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
