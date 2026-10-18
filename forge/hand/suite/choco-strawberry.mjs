// forge/hand/suite/choco-strawberry.mjs — a blue berry with a violet chocolate-dipped tip whose top edge is a wavy drip
// line across the lower body, little light seeds above it and a teal three-point leaf crown with a curled stem; the
// generated drawing had no chocolate wave and read as a face.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'choco-strawberry'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

const body = (dy = 0) => `M12 ${21.5 + dy}C7.5 ${19.5 + dy} 4.75 ${15 + dy} 5 ${11 + dy}C5.25 ${8.25 + dy} 8 ${7 + dy} 12 ${7 + dy}C16 ${7 + dy} 18.75 ${8.25 + dy} 19 ${11 + dy}C19.25 ${15 + dy} 16.5 ${19.5 + dy} 12 ${21.5 + dy}Z`
// the dipped tip: wavy top edge, then the body outline down to the point
const DIP = 'M5.2 13.44C6.75 12.9 7.5 15.5 9 15.5C10.5 15.5 10.5 13.25 12 13.25C13.5 13.25 13.75 16.5 15.25 16.5C16.75 16.5 17.25 12.95 18.8 13.44C18.08 16.7 15.6 19.9 12 21.5C8.4 19.9 5.92 16.7 5.2 13.44Z'
const CROWN = 'M7.4 8.1L8.7 4.4L12 6.5L15.3 4.4L16.6 8.1C14.4 9.2 9.6 9.2 7.4 8.1Z'

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 5, 7, 19, 21.5, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.26)]),
    ]],
    ['path', { d: 'M12 6.6C12 5 12.5 3.6 13.6 2.5', stroke: col('c3'), 'stroke-width': 1.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: body(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: body(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: DIP, fill: col('c2'), class: 'wm-k' }],
    ['path', { d: body(), fill: url(1), class: 'wm-k' }],
    // seeds on the flesh above the dip
    ['path', { d: 'M8.4 9.6l.55 1.1-.55 1.1-.55-1.1zM12 10.4l.55 1.1-.55 1.1-.55-1.1zM15.6 9.6l.55 1.1-.55 1.1-.55-1.1z', fill: col('edge'), 'fill-opacity': 0.9, class: 'wm-deco' }],
    ['path', { d: 'M6.6 12.2A6.4 6.4 0 0 1 9.3 8.9', stroke: col('shine'), 'stroke-width': 1.1, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.5, class: 'wm-shine' }],
    // leaf crown with a thin light rim so it separates from the berry
    ['path', { d: CROWN, fill: col('c3'), stroke: col('edge'), 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
