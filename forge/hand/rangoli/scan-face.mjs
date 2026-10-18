// forge/hand/rangoli/scan-face.mjs — four glowing scan brackets round a bold magenta face whose cream eyes and thick
// smile stay open: the generated drawing filled the face disc solid, so the features vanished into a plain dot.
import { col } from '../../styles/_rangoli-core.mjs'

const N = 'scan-face'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const corners = dy => `M3 ${7.5 + dy}V${5 + dy}A2 2 0 0 1 5 ${3 + dy}H7.5M16.5 ${3 + dy}H19A2 2 0 0 1 21 ${5 + dy}V${7.5 + dy}` +
  `M21 ${16.5 + dy}V${19 + dy}A2 2 0 0 1 19 ${21 + dy}H16.5M7.5 ${21 + dy}H5A2 2 0 0 1 3 ${19 + dy}V${16.5 + dy}`
const line = { fill: 'none', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.6, cy: 6.5, r: 25.2, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 6, y1: 6, x2: 18, y2: 18, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    // depth lip
    ['path', { d: corners(0.5), ...line, stroke: col('shadow'), 'stroke-opacity': 0.5, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12.5, r: 6.4, fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    // scan brackets
    ['path', { d: corners(0), ...line, stroke: url(0), class: 'wm-k' }],
    // the face: a bold disc with open features
    ['circle', { cx: 12, cy: 12, r: 6.4, fill: url(1), class: 'wm-a' }],
    ['ellipse', { cx: 9.6, cy: 10.3, rx: 1, ry: 1.4, fill: col('tint'), class: 'wm-a' }],
    ['ellipse', { cx: 14.4, cy: 10.3, rx: 1, ry: 1.4, fill: col('tint'), class: 'wm-a' }],
    ['path', { d: 'M8.9 13.5A3.6 3.6 0 0 0 15.1 13.5', fill: 'none', stroke: col('tint'), 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-a' }],
    // shine
    ['path', { d: 'M2.75 6.6V5A2.25 2.25 0 0 1 5 2.75H6.6', fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M7.07 10.68A5.1 5.1 0 0 1 9.84 7.38', fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
