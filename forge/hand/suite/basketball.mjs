// forge/hand/suite/basketball.mjs — a round ball with the classic seams: a vertical and a horizontal line plus two curved
// side seams, in deep ink over a lit body with a highlight; the generated drawing was a pale cross on a disc that read as a globe.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'basketball'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const seam = d => ['path', { d, stroke: col('shadow'), 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-k' }]

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 3, 3, 21, 21, [stop(0, 'shine', 0.35), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.3)]),
    ]],
    ['circle', { cx: 12, cy: 12.6, r: 9.5, fill: url(0), class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12, r: 9.5, fill: col('c1'), class: 'wm-k' }],
    seam('M12 2.7V21.3'),
    seam('M2.7 12H21.3'),
    seam('M5.4 5.1C8.6 8.6 8.6 15.4 5.4 18.9'),
    seam('M18.6 5.1C15.4 8.6 15.4 15.4 18.6 18.9'),
    ['circle', { cx: 12, cy: 12, r: 9.5, fill: url(1), class: 'wm-k' }],
    ['path', { d: 'M7.6 4.9A8.2 8.2 0 0 1 10.6 3.4', stroke: col('shine'), 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-opacity': 0.6, class: 'wm-shine' }],
  ]
}
