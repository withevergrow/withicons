// forge/hand/rangoli/rotate-cw.mjs — a bold festive-glow ring open at the right, finished by a real triangular arrowhead
// (c3 -> c4) at the top-right end pointing clockwise into the gap. The generated drawing ended in a tiny square tip.
// Roles: ring c1 -> c2 (diya glow), arrowhead c3 -> c4.
// Motion: ring wm-k, arrowhead wm-a.
import { col } from '../../styles/_rangoli-core.mjs'

const NAME = 'rotate-cw'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8, cy: 7.5, r: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: 'M19.88 15.18A8.5 8.5 0 1 1 19.21 7.5', stroke: url(0), 'stroke-width': 2.6, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M21.4 5.4L20.7 9.9L16.3 8.6Z', fill: url(1), stroke: url(1), 'stroke-width': 1.2, 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
