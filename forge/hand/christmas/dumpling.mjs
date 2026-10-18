// christmas/dumpling: a tan pleated dumpling with a pinched crest and a dark outline on a soft shadow
import { C } from '../../styles/_christmas-core.mjs'

const N = 'dumpling'
const id = n => 'wg-christmas-' + N + '-' + n, url = n => 'url(#' + id(n) + ')'
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const R = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const BODY = 'M3 16.3C3 11.4 6.8 7.6 10.6 7.2C11 6 13 6 13.4 7.2C17.2 7.6 21 11.4 21 16.3C21 18.2 18.5 19 12 19C5.5 19 3 18.2 3 16.3Z'
const PLEATS = 'M10.6 7.4C9 9 8.4 11 8.6 13.2M11.5 7.2C11 9.2 10.9 11.2 11.2 13.4M12.5 7.2C13 9.2 13.1 11.2 12.8 13.4M13.4 7.4C15 9 15.6 11 15.4 13.2'

export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: id(0), x1: 4, y1: 6, x2: 15, y2: 20, gradientUnits: 'userSpaceOnUse' },
      [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]]]],
    ['ellipse', { cx: 12, cy: 19.4, rx: 8.5, ry: 1.1, fill: C.shadow, 'fill-opacity': 0.25, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: C.c4, class: 'wm-k' }],
    ['path', { d: BODY, fill: C.c3, 'fill-opacity': 0.4, stroke: C.shadow, 'stroke-width': 1.1, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: PLEATS, stroke: C.shadow, 'stroke-width': 0.75, 'stroke-opacity': 0.7, ...R, class: 'wm-a' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M5.6 14.6C5.8 12.4 7 10.6 8.4 9.6', stroke: C.shine, 'stroke-width': 0.8, 'stroke-opacity': 0.8, ...R, class: 'wm-shine' }],
  ]
}
