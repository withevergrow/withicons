// forge/hand/suite/stocking.mjs — a blue Christmas stocking with a violet cuff and matching violet heel and toe patches,
// so the foot separates from the leg by a full value step; the generated drawing marked heel and toe only with thin
// inlay arcs that blurred into one blue boot at 24 and 16px.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'stocking'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const lipG = (n, role) => lin(n, 0, -40, 0, 80, [stop(0, role), stop(1, 'shadow')])
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

// leg and foot (the skeleton's sock, foot a touch rounder)
const sock = (dy = 0) => `M7.5 ${7.5 + dy}H16V${13.75 + dy}A1.25 1.25 0 0 0 17.25 ${15 + dy}H17.75A3 3 0 0 1 17.75 ${21 + dy}H13.5A6 6 0 0 1 7.5 ${15 + dy}Z`
// heel patch: the back of the foot below a curved seam
const HEEL = 'M7.63 16.25C10.5 16.25 13 18.25 13.5 21A6 6 0 0 1 7.63 16.25Z'
// toe cap: the front of the foot past a curved seam
const TOE = 'M15.25 15H17.75A3 3 0 0 1 17.75 21H15.25C16.5 19.25 16.5 16.75 15.25 15Z'
// cuff, overhanging the leg
const cuff = (dy = 0) => `M7 ${3.5 + dy}H16.5A1.5 1.5 0 0 1 18 ${5 + dy}V${6.75 + dy}A1.5 1.5 0 0 1 16.5 ${8.25 + dy}H7A1.5 1.5 0 0 1 5.5 ${6.75 + dy}V${5 + dy}A1.5 1.5 0 0 1 7 ${3.5 + dy}Z`

export default function render() {
  return [
    ['defs', {}, [
      lipG(0, 'c1'),
      lipG(1, 'c2'),
      sheenG(2, 7.5, 7.5, 20.75, 21),
      sheenG(3, 5.5, 3.5, 18, 8.25),
    ]],
    ['path', { d: sock(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: sock(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: HEEL, fill: col('c2'), class: 'wm-k' }],
    ['path', { d: TOE, fill: col('c2'), class: 'wm-k' }],
    ['path', { d: sock(), fill: url(2), class: 'wm-k' }],
    // a light stripe band across the leg
    ['path', { d: 'M8.5 11.25H15', stroke: col('edge'), 'stroke-width': 1.25, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, class: 'wm-k' }],
    ['path', { d: cuff(0.6), fill: url(1), class: 'wm-shadow' }],
    ['path', { d: cuff(), fill: col('c2'), class: 'wm-a' }],
    ['path', { d: cuff(), fill: url(3), class: 'wm-a' }],
    // hanging loop tab
    ['path', { d: 'M15.75 3.5V2.75A1.25 1.25 0 0 1 17 1.5', stroke: col('c2'), 'stroke-width': 1.25, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
