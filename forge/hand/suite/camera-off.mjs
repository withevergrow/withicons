// forge/hand/suite/camera-off.mjs — the whole camera (bump, body) with a clearly ringed lens, one bold orange slash with a pale halo so it
// holds against the blue.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'camera-off'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const lipG = (n, role) => lin(n, 0, -40, 0, 80, [stop(0, role), stop(1, 'shadow')])
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

// body 2..22 x 4..20.5 with the viewfinder bump on top
const body = (dy = 0) => `M4 ${6.5 + dy}H7.5L9 ${4 + dy}H15L16.5 ${6.5 + dy}H20A2 2 0 0 1 22 ${8.5 + dy}V${18.5 + dy}A2 2 0 0 1 20 ${20.5 + dy}H4A2 2 0 0 1 2 ${18.5 + dy}V${8.5 + dy}A2 2 0 0 1 4 ${6.5 + dy}Z`
const SLASH = 'M4 4L20 20'

export default function render() {
  return [
    ['defs', {}, [
      lipG(0, 'c1'),
      sheenG(1, 2, 4, 22, 20.5),
    ]],
    ['path', { d: body(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: body(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: body(), fill: url(1), class: 'wm-k' }],
    // lens: pale ring, violet iris, glint
    ['circle', { cx: 12, cy: 13.5, r: 4.8, fill: col('tint'), class: 'wm-k' }],
    ['circle', { cx: 12, cy: 13.5, r: 3, fill: col('c2'), class: 'wm-a' }],
    ['circle', { cx: 10.8, cy: 12.3, r: 0.6, fill: col('edge'), class: 'wm-shine' }],
    ['circle', { cx: 18.5, cy: 9.4, r: 0.9, fill: col('edge'), class: 'wm-k' }],
    // the slash, haloed
    ['path', { d: SLASH, stroke: col('tint'), 'stroke-width': 4.2, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: SLASH, stroke: col('accent'), 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
