// forge/hand/suite/coins.mjs — one centred stack of three blue coins with a lit top face carrying a bold coin slot glyph,
// so it reads as money at 16px and sits in the blue family.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'coins'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

// stack: top ellipse 8 x 3 at (12, 7.5), side down to 17.5
const body = dy => `M4 ${7.5 + dy}A8 3 0 0 1 20 ${7.5 + dy}V${17.5 + dy}A8 3 0 0 1 4 ${17.5 + dy}Z`
const seam = y => `M4.6 ${y}A8 3 0 0 0 19.4 ${y}`

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, 4, 0, 22, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 4, 0, 20, 0, [stop(0, 'shine', 0.28), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.26)]),
    ]],
    ['path', { d: body(0.7), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: body(0), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: body(0), fill: url(1), class: 'wm-k' }],
    ['path', { d: seam(11), stroke: col('edge'), 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, class: 'wm-k' }],
    ['path', { d: seam(14.5), stroke: col('edge'), 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 7.5, rx: 8, ry: 3, fill: col('c3'), class: 'wm-a' }],
    ['ellipse', { cx: 12, cy: 7.5, rx: 8, ry: 3, fill: col('shine'), 'fill-opacity': 0.35, class: 'wm-shine' }],
    ['ellipse', { cx: 12, cy: 7.5, rx: 5.6, ry: 1.9, stroke: col('c1'), 'stroke-width': 1.1, class: 'wm-a' }],
    ['line', { x1: 10.2, y1: 7.5, x2: 13.8, y2: 7.5, stroke: col('c1'), 'stroke-width': 1.4, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
