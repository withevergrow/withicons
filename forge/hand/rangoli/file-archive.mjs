// forge/hand/rangoli/file-archive.mjs — a saffron-glow page with a folded corner and a zipper: a column of alternating
// violet teeth ending in a cream pull-tab ring. Replaces the generated drawing, whose decorative dots hid the zipper.
// Roles: page c1 -> c2, fold + teeth c3 -> c4, pull tab tint, lip shadow, highlight shine.
// Motion: page wm-k, fold wm-a, teeth + tab wm-s.
import { col } from '../../styles/_rangoli-core.mjs'

const N = 'file-archive'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const page = dy => `M7 ${2.5 + dy}H14L19.5 ${8 + dy}V${19.5 + dy}A2.5 2.5 0 0 1 17 ${22 + dy}H7A2.5 2.5 0 0 1 4.5 ${19.5 + dy}V${5 + dy}A2.5 2.5 0 0 1 7 ${2.5 + dy}Z`

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.5, cy: 6, r: 22, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: page(0.7), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: page(0), fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M14 2.5V6.5A1.5 1.5 0 0 0 15.5 8H19.5Z', fill: url(1), class: 'wm-a' }],
    ['path', { d: 'M8.2 5.3H10.4M9.8 8H12M8.2 10.7H10.4', stroke: url(1), 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M10 13.4A2.4 2.4 0 0 1 12.4 15.8V17A2.4 2.4 0 0 1 10 19.4A2.4 2.4 0 0 1 7.6 17V15.8A2.4 2.4 0 0 1 10 13.4Z', fill: col('tint'), class: 'wm-s' }],
    ['path', { d: 'M10 15.2A.9.9 0 0 1 10.9 16.1V16.7A.9.9 0 0 1 10 17.6A.9.9 0 0 1 9.1 16.7V16.1A.9.9 0 0 1 10 15.2Z', fill: url(1), class: 'wm-s' }],
    ['path', { d: 'M6 18V6', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
