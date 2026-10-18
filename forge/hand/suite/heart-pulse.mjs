// forge/hand/suite/heart-pulse.mjs — the blue heart with the ECG trace running across it in white (the generated one lost the
// trace and showed two small triangles).
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'heart-pulse'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const lipG = (n, role) => lin(n, 0, -40, 0, 80, [stop(0, role), stop(1, 'shadow')])
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

const heart = (dy = 0) => `M12 ${20.8 + dy}C12 ${20.8 + dy} 2.6 ${15.4 + dy} 2.6 ${9 + dy}C2.6 ${6.2 + dy} 4.8 ${3.9 + dy} 7.6 ${3.9 + dy}C9.5 ${3.9 + dy} 11.1 ${4.9 + dy} 12 ${6.5 + dy}C12.9 ${4.9 + dy} 14.5 ${3.9 + dy} 16.4 ${3.9 + dy}C19.2 ${3.9 + dy} 21.4 ${6.2 + dy} 21.4 ${9 + dy}C21.4 ${15.4 + dy} 12 ${20.8 + dy} 12 ${20.8 + dy}Z`
const PULSE = 'M4.6 12.2H8L9.6 9L12.3 15.6L14.2 12.2H19.4'

export default function render() {
  return [
    ['defs', {}, [
      lipG(0, 'c1'),
      sheenG(1, 2.6, 3.9, 21.4, 20.8),
    ]],
    ['path', { d: heart(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: heart(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: heart(), fill: url(1), class: 'wm-k' }],
    ['path', { d: PULSE, stroke: col('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: PULSE, stroke: col('edge'), 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
