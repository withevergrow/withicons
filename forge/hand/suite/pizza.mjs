// forge/hand/suite/pizza.mjs — a pizza slice, tip down-left and a fat crust band along the top-right arc, with pepperoni
// discs and small cheese holes on the body; the generated drawing was a plain wedge with a dark swoosh.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'pizza'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

const body = dy => `M3.75 ${20.25 + dy}L9.4 ${3.4 + dy}A13.5 13.5 0 0 1 20.6 ${14.6 + dy}Z`
const CRUST = 'M9.4 3.4A13.5 13.5 0 0 1 20.6 14.6L16.5 16A8.4 8.4 0 0 0 8 7.5Z'
const rd = { 'stroke-width': 1.5, 'stroke-linejoin': 'round' }

const pep = (cx, cy, rr) => [
  ['circle', { cx, cy, r: rr, fill: col('accent'), class: 'wm-a' }],
  ['circle', { cx: +(cx - rr * 0.3).toFixed(2), cy: +(cy - rr * 0.3).toFixed(2), r: +(rr * 0.35).toFixed(2), fill: col('shine'), 'fill-opacity': 0.5, class: 'wm-shine' }],
]

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      sheenG(1, 3, 3, 21, 21),
      sheenG(2, 8, 3, 21, 16),
    ]],
    ['path', { d: body(0.6), fill: url(0), stroke: col('shadow'), ...rd, class: 'wm-shadow' }],
    ['path', { d: body(0), fill: col('c1'), stroke: col('c1'), ...rd, class: 'wm-k' }],
    ['path', { d: body(0), fill: url(1), class: 'wm-k' }],
    ['path', { d: CRUST, fill: col('c4'), stroke: col('c4'), ...rd, class: 'wm-k' }],
    ['path', { d: CRUST, fill: url(2), class: 'wm-k' }],
    ['path', { d: 'M8 7.5A8.4 8.4 0 0 1 16.5 16', stroke: col('shadow'), 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.35, class: 'wm-k' }],
    ...pep(9.3, 15.3, 1.6),
    ...pep(13.2, 11.6, 1.7),
    ['circle', { cx: 12.9, cy: 15.4, r: 0.9, fill: col('shadow'), 'fill-opacity': 0.55, class: 'wm-k' }],
    ['circle', { cx: 8.6, cy: 11.4, r: 0.7, fill: col('shadow'), 'fill-opacity': 0.55, class: 'wm-k' }],
  ]
}
