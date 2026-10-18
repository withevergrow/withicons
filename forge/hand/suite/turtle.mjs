// forge/hand/suite/turtle.mjs — the line design's side-view turtle: a blue domed shell on a deep rim with a light hex scute
// and seam lines, a teal head raised on a neck at the right with an eye, four stubby legs below and a little tail; the
// generated drawing was an abstract teal swirl with violet bars.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'turtle'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

const dome = (dy = 0) => `M2.8 ${13 + dy}C2.8 ${8.3 + dy} 6.1 ${5 + dy} 9.9 ${5 + dy}C13.7 ${5 + dy} 17 ${8.3 + dy} 17 ${13 + dy}Z`
const rim = (dy = 0) => `M3.5 ${12.4 + dy}H16.3A.9 .9 0 0 1 17.2 ${13.3 + dy}V${13.6 + dy}A.9 .9 0 0 1 16.3 ${14.5 + dy}H3.5A.9 .9 0 0 1 2.6 ${13.6 + dy}V${13.3 + dy}A.9 .9 0 0 1 3.5 ${12.4 + dy}Z`
const leg = x => `M${x - 1.1} 13.5H${x + 1.1}V16.4A1.1 1.1 0 0 1 ${x - 1.1} 16.4Z`

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 2.6, 5, 17.2, 14.5, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.26)]),
    ]],
    // back plane: legs, tail, neck and head
    ['path', { d: `${leg(4.8)}${leg(8.4)}${leg(12.2)}${leg(15.4)}`, fill: col('c3'), class: 'wm-a' }],
    ['path', { d: 'M1.2 13.6L3.9 10.6L4.4 13.6Z', fill: col('c3'), stroke: col('c3'), 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M15.4 12.2C17.2 11.9 18 10.8 18.2 9.4', stroke: col('c3'), 'stroke-width': 3.2, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['circle', { cx: 19.4, cy: 7.6, r: 2.6, fill: col('c3'), class: 'wm-a' }],
    ['path', { d: `${dome(0.6)}${rim(0.6)}`, fill: url(0), class: 'wm-shadow' }],
    ['path', { d: dome(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: rim(), fill: col('c2'), class: 'wm-k' }],
    ['path', { d: dome(), fill: url(1), class: 'wm-k' }],
    // scute seams and the central hexagon
    ['path', { d: 'M7.4 9.7H4.6M12.4 9.7H15.2M8.7 7.6L7.6 5.9M11.1 7.6L12.2 5.9', stroke: col('edge'), 'stroke-width': 1.1, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.85, class: 'wm-deco' }],
    ['path', { d: 'M8.7 7.5H11.1L12.3 9.7L11.1 11.9H8.7L7.5 9.7Z', fill: col('tint'), stroke: col('tint'), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M4.4 9.5A5.8 5.8 0 0 1 7.6 6.2', stroke: col('shine'), 'stroke-width': 1.1, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.5, class: 'wm-shine' }],
    // eye
    ['circle', { cx: 20.1, cy: 7.1, r: 0.85, fill: col('shadow'), class: 'wm-a' }],
    ['circle', { cx: 20.4, cy: 6.8, r: 0.28, fill: col('shine'), class: 'wm-a' }],
  ]
}
