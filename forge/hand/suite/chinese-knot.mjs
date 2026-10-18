// forge/hand/suite/chinese-knot.mjs — the lattice knot: a blue diamond with a woven light lattice (over and under at each
// crossing) around a teal centre cell, two violet side loops, an orange bead and tassel below; the generated drawing was a
// bouquet of blue gems with no loops.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'chinese-knot'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

const diamond = (dy = 0) => `M12 ${2.5 + dy}L18.5 ${9 + dy}L12 ${15.5 + dy}L5.5 ${9 + dy}Z`
const lace = { stroke: col('edge'), 'stroke-width': 1.15, 'stroke-linecap': 'round', fill: 'none', class: 'wm-deco' }

export default function render() {
  const loop = cx => ['ellipse', { cx, cy: 9, rx: 1.55, ry: 3.4, stroke: col('c2'), 'stroke-width': 1.5, fill: 'none', class: 'wm-a' }]
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 5.5, 2.5, 18.5, 15.5, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.26)]),
    ]],
    loop(3.6), loop(20.4),
    ['path', { d: diamond(0.6), fill: url(0), stroke: url(0), 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: diamond(), fill: col('c1'), stroke: col('c1'), 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: diamond(), fill: url(1), stroke: url(1), 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // centre cell
    ['path', { d: 'M12 6.5L14.5 9L12 11.5L9.5 9Z', fill: col('c3'), class: 'wm-k' }],
    // woven lattice: each strand breaks where it passes under another
    ['path', { d: 'M10 4.5L16.5 11', ...lace }],
    ['path', { d: 'M14 4.5L11.2 7.3M8.3 10.2L7.5 11', ...lace }],
    ['path', { d: 'M16.5 7L15.3 8.2M13.7 9.8L10 13.5', ...lace }],
    ['path', { d: 'M7.5 7L14 13.5', ...lace }],
    // bead, cap and tassel
    ['path', { d: 'M12 15.5V17.6', stroke: col('c2'), 'stroke-width': 1.4, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['circle', { cx: 12, cy: 17.1, r: 1.05, fill: col('accent'), class: 'wm-s' }],
    ['path', { d: 'M10.9 18.7H13.1V19.7H10.9Z', fill: col('c2'), class: 'wm-a' }],
    ['path', { d: 'M10.6 19.7H13.4L14.5 22.8Q12 23.5 9.5 22.8Z', fill: col('accent'), class: 'wm-a' }],
    ['path', { d: 'M12 20.6V22.4M11 20.6L10.8 22.2M13 20.6L13.2 22.2', stroke: col('shine'), 'stroke-width': 0.6, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.6, class: 'wm-a' }],
  ]
}
