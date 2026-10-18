// forge/hand/suite/oven.mjs — the front-facing oven: blue body on two violet feet, control strip with a display and two knobs,
// a light window with orange heat lines and a drawer seam (the generated stacked bars had no knobs, feet or heat lines).
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'oven'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const lipG = (n, role) => lin(n, 0, -40, 0, 80, [stop(0, role), stop(1, 'shadow')])
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

// body 3..21 x 2..20.5, corner radius 2.5
const body = (dy = 0) => `M5.5 ${2 + dy}H18.5A2.5 2.5 0 0 1 21 ${4.5 + dy}V${18 + dy}A2.5 2.5 0 0 1 18.5 ${20.5 + dy}H5.5A2.5 2.5 0 0 1 3 ${18 + dy}V${4.5 + dy}A2.5 2.5 0 0 1 5.5 ${2 + dy}Z`
const FEET = 'M5.5 19.5H8.5V21.25A1.25 1.25 0 0 1 7.25 22.5H6.75A1.25 1.25 0 0 1 5.5 21.25ZM15.5 19.5H18.5V21.25A1.25 1.25 0 0 1 17.25 22.5H16.75A1.25 1.25 0 0 1 15.5 21.25Z'
const WINDOW = 'M7 8.5H17A1.5 1.5 0 0 1 18.5 10V15A1.5 1.5 0 0 1 17 16.5H7A1.5 1.5 0 0 1 5.5 15V10A1.5 1.5 0 0 1 7 8.5Z'
const HEAT = 'M9 10.4C8.2 11.4 8.2 12.1 9 12.9C9.8 13.7 9.8 14.4 9 15.1M12 10.4C11.2 11.4 11.2 12.1 12 12.9C12.8 13.7 12.8 14.4 12 15.1M15 10.4C14.2 11.4 14.2 12.1 15 12.9C15.8 13.7 15.8 14.4 15 15.1'

export default function render() {
  return [
    ['defs', {}, [
      lipG(0, 'c1'),
      sheenG(1, 3, 2, 21, 20.5),
    ]],
    ['path', { d: FEET, fill: col('c2'), class: 'wm-k' }],
    ['path', { d: body(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: body(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: body(), fill: url(1), class: 'wm-k' }],
    // control strip: display + two knobs, seam beneath
    ['path', { d: 'M3.6 6.6H20.4', stroke: col('shadow'), 'stroke-width': 1, 'stroke-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: 'M5.5 3.6H11.5A.8 .8 0 0 1 12.3 4.4V4.8A.8 .8 0 0 1 11.5 5.6H5.5A.8 .8 0 0 1 4.7 4.8V4.4A.8 .8 0 0 1 5.5 3.6Z', fill: col('edge'), class: 'wm-a' }],
    ['circle', { cx: 15.5, cy: 4.6, r: 1.1, fill: col('edge'), class: 'wm-a' }],
    ['circle', { cx: 18.5, cy: 4.6, r: 1.1, fill: col('edge'), class: 'wm-a' }],
    // window with glare, heat lines
    ['path', { d: WINDOW, fill: col('tint'), class: 'wm-k' }],
    ['path', { d: HEAT, stroke: col('accent'), 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-s' }],
    // drawer seam
    ['path', { d: 'M3.6 18.2H20.4', stroke: col('shadow'), 'stroke-width': 1, 'stroke-opacity': 0.4, class: 'wm-k' }],
  ]
}
