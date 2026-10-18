// forge/hand/suite/angry.mjs — a lit blue face disc with a deep lip, a top-left sheen and a soft shine, heavy brows that
// slope steeply down to the nose, narrowed eyes and a tight down-turned mouth, plus an accent anger mark at the top
// right; the generated drawing had thin, light brows and read as a sad face.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'angry'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

const CX = 12, CY = 11.6, R = 10, LIP = 0.8

export default function render() {
  const face = { stroke: col('edge'), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 2, 1.6, 22, 21.6, [stop(0, 'shine', 0.32), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.26)]),
    ]],
    ['circle', { cx: CX, cy: CY + LIP, r: R, fill: url(0), class: 'wm-shadow' }],
    ['circle', { cx: CX, cy: CY, r: R, fill: col('c1'), class: 'wm-k' }],
    ['circle', { cx: CX, cy: CY, r: R, fill: url(1), class: 'wm-k' }],
    // soft shine on the upper left of the dome
    ['path', { d: 'M4.6 8.4A8 8 0 0 1 9.4 3.9', stroke: col('shine'), 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-opacity': 0.55, class: 'wm-shine' }],
    // heavy brows, steep and angled in toward the nose
    ['path', { d: 'M5.6 6.9L10.6 9.5L10.1 10.6L5.2 8.5Z', fill: col('edge'), ...face, 'stroke-width': 1.2 }],
    ['path', { d: 'M18.4 6.9L13.4 9.5L13.9 10.6L18.8 8.5Z', fill: col('edge'), ...face, 'stroke-width': 1.2 }],
    // narrowed eyes under the brows
    ['ellipse', { cx: 8.7, cy: 12.4, rx: 1.15, ry: 1.25, fill: col('edge'), class: 'wm-a' }],
    ['ellipse', { cx: 15.3, cy: 12.4, rx: 1.15, ry: 1.25, fill: col('edge'), class: 'wm-a' }],
    // tight, flat-topped frown
    ['path', { d: 'M8.9 17.6Q12 15.4 15.1 17.6', fill: 'none', ...face, 'stroke-width': 1.7 }],
    // anger mark badge at the top right
    ['path', { d: 'M18.3 1.4Q18.4 3.2 16.6 3.3M19.9 1.4Q19.8 3.2 21.6 3.3M18.3 6.6Q18.4 4.8 16.6 4.7M19.9 6.6Q19.8 4.8 21.6 4.7', stroke: col('accent'), 'stroke-width': 1.4, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
