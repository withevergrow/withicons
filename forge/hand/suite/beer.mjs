// forge/hand/suite/beer.mjs — a blue glass mug filled with amber beer (rising bubbles) under a pale foam head that drips
// over the rim, handle on the right; the generated drawing fused a violet foam and the body into one lilac blob that
// read as a bucket.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'beer'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const lipG = (n, role) => lin(n, 0, -40, 0, 80, [stop(0, role), stop(1, 'shadow')])
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

const glass = (dy = 0) => `M3.75 ${9 + dy}H16.25V${19.25 + dy}A2.25 2.25 0 0 1 14 ${21.5 + dy}H6A2.25 2.25 0 0 1 3.75 ${19.25 + dy}Z`
const HANDLE = 'M16 11.75H18A2 2 0 0 1 20 13.75V16A2 2 0 0 1 18 18H16'
const BEER = 'M5.5 11H14.5V19A1 1 0 0 1 13.5 20H6.5A1 1 0 0 1 5.5 19Z'
// foam head: three puffs over the rim, two drips running down the glass
const foam = (dy = 0) => `M4.25 ${10.75 + dy}C2.5 ${9 + dy} 3.75 ${5.5 + dy} 6.75 ${5.75 + dy}C7.75 ${3 + dy} 12.25 ${2.75 + dy} 13.25 ${5 + dy}C15.75 ${4.75 + dy} 17.75 ${7.75 + dy} 16 ${10.25 + dy}C15.5 ${11 + dy} 14.5 ${10.75 + dy} 14.25 ${11.5 + dy}V${12.25 + dy}A1 1 0 0 1 12.25 ${12.25 + dy}V${11.5 + dy}C12.25 ${11 + dy} 11.5 ${10.75 + dy} 10.5 ${10.75 + dy}H8.5C7.75 ${10.75 + dy} 7.5 ${11.25 + dy} 7.5 ${11.75 + dy}V${13.25 + dy}A1 1 0 0 1 5.5 ${13.25 + dy}V${11.5 + dy}C5.5 ${11 + dy} 4.75 ${11.25 + dy} 4.25 ${10.75 + dy}Z`

export default function render() {
  return [
    ['defs', {}, [
      lipG(0, 'c1'),
      lipG(1, 'c4'),
      sheenG(2, 3.75, 9, 16.25, 21.5),
      sheenG(3, 2.75, 3, 17.5, 13.5),
    ]],
    ['path', { d: HANDLE, stroke: col('c1'), 'stroke-width': 2.25, class: 'wm-k' }],
    ['path', { d: glass(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: glass(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: glass(), fill: url(2), class: 'wm-k' }],
    // the beer: amber pane set into the glass, its own sheen deepening to the bottom
    ['path', { d: BEER, fill: col('accent'), class: 'wm-k' }],
    ['path', { d: BEER, fill: url(2), class: 'wm-k' }],
    ['circle', { cx: 8, cy: 17.5, r: 0.8, fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-k' }],
    ['circle', { cx: 11.5, cy: 15.75, r: 0.65, fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-k' }],
    ['circle', { cx: 9.75, cy: 14.25, r: 0.5, fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-k' }],
    // foam head
    ['path', { d: foam(0.6), fill: url(1), class: 'wm-shadow' }],
    ['path', { d: foam(), fill: col('tint'), class: 'wm-a' }],
    ['path', { d: foam(), fill: url(3), class: 'wm-a' }],
  ]
}
