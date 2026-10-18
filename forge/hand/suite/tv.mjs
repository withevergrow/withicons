// forge/hand/suite/tv.mjs — a blue set with a light screen, a knob inlay and two little feet, its two violet antenna rods
// splayed from separate roots with ball tips; the generated rods met in one point and read as a chevron (a play-down
// arrow) sitting on a monitor.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'tv'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const lipG = (n, role) => lin(n, 0, -40, 0, 80, [stop(0, role), stop(1, 'shadow')])
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

// cabinet 2..22 x 7..19.5, corner radius 2.5
const body = (dy = 0) => `M4.5 ${7 + dy}H19.5A2.5 2.5 0 0 1 22 ${9.5 + dy}V${17 + dy}A2.5 2.5 0 0 1 19.5 ${19.5 + dy}H4.5A2.5 2.5 0 0 1 2 ${17 + dy}V${9.5 + dy}A2.5 2.5 0 0 1 4.5 ${7 + dy}Z`
// screen pane, slightly bulged like a tube
const SCREEN = 'M5.75 9.25H15.25C16.5 9.25 16.75 10.25 16.75 13.25C16.75 16.25 16.5 17.25 15.25 17.25H5.75C4.5 17.25 4.25 16.25 4.25 13.25C4.25 10.25 4.5 9.25 5.75 9.25Z'
const RODS = 'M10.25 6.75L7.25 3M13.75 6.75L17.5 3.5'
const FEET = 'M5 19.5H7.5V20.75A.75 .75 0 0 1 6.75 21.5H5.75A.75 .75 0 0 1 5 20.75ZM16.5 19.5H19V20.75A.75 .75 0 0 1 18.25 21.5H17.25A.75 .75 0 0 1 16.5 20.75Z'

export default function render() {
  return [
    ['defs', {}, [
      lipG(0, 'c1'),
      sheenG(1, 2, 7, 22, 19.5),
    ]],
    // antenna: two rods from separate roots, ball tips (back plane, behind the cabinet)
    ['path', { d: RODS, stroke: col('c2'), 'stroke-width': 1.75, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: 7.25, cy: 3, r: 1.25, fill: col('c2'), class: 'wm-a' }],
    ['circle', { cx: 17.5, cy: 3.5, r: 1.25, fill: col('c2'), class: 'wm-a' }],
    ['path', { d: FEET, fill: col('c2'), class: 'wm-k' }],
    ['path', { d: body(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: body(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: body(), fill: url(1), class: 'wm-k' }],
    ['path', { d: SCREEN, fill: col('tint'), class: 'wm-k' }],
    // a soft glare across the glass
    ['path', { d: 'M6.25 10.5H10.5L7.5 16H5.75C5.5 15.25 5.4 14.25 5.4 13.25C5.4 12 5.6 11 6.25 10.5Z', fill: col('shine'), 'fill-opacity': 0.55, class: 'wm-k' }],
    // control column: two knobs
    ['circle', { cx: 19.25, cy: 11, r: 1.1, fill: col('edge'), class: 'wm-k' }],
    ['circle', { cx: 19.25, cy: 14.75, r: 1.1, fill: col('edge'), class: 'wm-k' }],
  ]
}
