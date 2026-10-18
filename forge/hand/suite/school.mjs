// forge/hand/suite/school.mjs — a schoolhouse in the blue family: a deep-blue pitched roof over a lighter blue hall, one
// large arched door and a bold flag on a pole above the gable, few enough parts to hold at 16px and on dark.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'school'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

const HALL = dy => `M5 ${12 + dy}H19V${19.5 + dy}A1.5 1.5 0 0 1 17.5 ${21 + dy}H6.5A1.5 1.5 0 0 1 5 ${19.5 + dy}Z`
const ROOF = 'M2.6 12.6L11.2 6.3A1.4 1.4 0 0 1 12.8 6.3L21.4 12.6A0.9 0.9 0 0 1 20.9 14.2H3.1A0.9 0.9 0 0 1 2.6 12.6Z'
const DOOR = 'M9.6 21V17.2A2.4 2.4 0 0 1 14.4 17.2V21Z'

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, 4, 0, 22, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 5, 12, 19, 21, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.22)]),
    ]],
    ['line', { x1: 12, y1: 6.2, x2: 12, y2: 1.6, stroke: col('ink'), 'stroke-width': 1.2, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: 'M12.5 1.6H17L15.8 3.1L17 4.6H12.5Z', fill: col('accent'), class: 'wm-s' }],
    ['path', { d: HALL(0.7), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: HALL(0), fill: col('c3'), class: 'wm-k' }],
    ['path', { d: HALL(0), fill: url(1), class: 'wm-k' }],
    ['path', { d: ROOF, fill: col('c1'), class: 'wm-k' }],
    ['path', { d: ROOF, fill: col('shine'), 'fill-opacity': 0.18, class: 'wm-shine' }],
    ['path', { d: DOOR, fill: col('c1'), class: 'wm-a' }],
  ]
}
