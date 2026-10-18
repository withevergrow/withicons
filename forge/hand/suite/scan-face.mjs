// forge/hand/suite/scan-face.mjs — four coloured scan corners round a violet disc that carries the two eyes and the smile, so it reads as a face.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'scan-face'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const lipG = (n, role) => lin(n, 0, -40, 0, 80, [stop(0, role), stop(1, 'shadow')])
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

const CORNERS = [
  ['c1', 'M3 7.5V5A2 2 0 0 1 5 3H7.5'],
  ['c3', 'M16.5 3H19A2 2 0 0 1 21 5V7.5'],
  ['c4', 'M21 16.5V19A2 2 0 0 1 19 21H16.5'],
  ['c2', 'M7.5 21H5A2 2 0 0 1 3 19V16.5'],
]
const ALL = CORNERS.map(c => c[1]).join('')
const DISC = (dy = 0) => `M18.5 ${12 + dy}A6.5 6.5 0 1 1 5.5 ${12 + dy}A6.5 6.5 0 1 1 18.5 ${12 + dy}Z`

export default function render() {
  return [
    ['defs', {}, [
      lipG(0, 'c1'),
      sheenG(1, 5.5, 5.5, 18.5, 18.5),
    ]],
    ['path', { d: ALL, stroke: url(0), 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-opacity': 0.6, class: 'wm-shadow' }],
    ...CORNERS.map(([r, d]) => ['path', { d, stroke: col(r), 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }]),
    ['path', { d: DISC(0.5), fill: col('shadow'), 'fill-opacity': 0.35, class: 'wm-shadow' }],
    ['path', { d: DISC(), fill: col('c2'), class: 'wm-a' }],
    ['path', { d: DISC(), fill: url(1), class: 'wm-a' }],
    ['ellipse', { cx: 9.4, cy: 10.2, rx: 0.95, ry: 1.4, fill: col('edge'), class: 'wm-a' }],
    ['ellipse', { cx: 14.6, cy: 10.2, rx: 0.95, ry: 1.4, fill: col('edge'), class: 'wm-a' }],
    ['path', { d: 'M9.2 13.8A3.2 3.2 0 0 0 14.8 13.8', stroke: col('edge'), 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
