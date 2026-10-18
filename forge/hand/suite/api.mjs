// forge/hand/suite/api.mjs — one clear rounded block with a violet node on the left and two separate nodes on the right, each joined by
// a stub (the generated one merged block and nodes into a puzzle-piece blob).
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'api'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const lipG = (n, role) => lin(n, 0, -40, 0, 80, [stop(0, role), stop(1, 'shadow')])
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

const body = (dy = 0) => `M9.5 ${5.5 + dy}H14A2.5 2.5 0 0 1 16.5 ${8 + dy}V${16 + dy}A2.5 2.5 0 0 1 14 ${18.5 + dy}H9.5A2.5 2.5 0 0 1 7 ${16 + dy}V${8 + dy}A2.5 2.5 0 0 1 9.5 ${5.5 + dy}Z`
const STUBS = 'M5 12H8M16 8H19M16 16H19'
const NODES = [[3.3, 12], [20.7, 8], [20.7, 16]]

export default function render() {
  return [
    ['defs', {}, [
      lipG(0, 'c1'),
      sheenG(1, 7, 5.5, 16.5, 18.5),
    ]],
    ['path', { d: STUBS, stroke: col('c2'), 'stroke-width': 1.8, 'stroke-linecap': 'round', class: 'wm-a' }],
    ...NODES.map(([cx, cy]) => ['circle', { cx, cy, r: 2, fill: col('c2'), class: 'wm-a' }]),
    ...NODES.map(([cx, cy]) => ['circle', { cx: cx - 0.5, cy: cy - 0.5, r: 0.6, fill: col('edge'), 'fill-opacity': 0.7, class: 'wm-shine' }]),
    ['path', { d: body(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: body(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: body(), fill: url(1), class: 'wm-k' }],
    // three bars, a stack of endpoints
    ['path', { d: 'M9.6 9.5H13.9M9.6 12H13.9M9.6 14.5H12.4', stroke: col('edge'), 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-k' }],
  ]
}
