// forge/hand/rangoli/minimize.mjs: two diagonal arrows pointing in at the centre, like the line drawing: orange shafts
// with open c3 -> c4 chevron heads, longer than the generated ones so they read as arrowheads and not stubby corners.
// Motion: heads wm-a, shafts wm-k.
import { col } from '../../styles/_rangoli-core.mjs'

const NAME = 'minimize'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const W = 2.6

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.8, cy: 6.7, r: 24.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: 'M14 4.2V10H19.8M10 19.8V14H4.2', stroke: url(1), 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M20.3 3.7L14 10M3.7 20.3L10 14', stroke: url(0), 'stroke-width': W, 'stroke-linecap': 'round', class: 'wm-k' }],
  ]
}
