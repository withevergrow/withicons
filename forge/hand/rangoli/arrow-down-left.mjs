// forge/hand/rangoli/arrow-down-left.mjs — one diagonal shaft running into a bold corner head, the shaft's tail end
// buried inside the head's corner so shaft and head read as a single arrow (the generated pair floated apart as a bracket
// plus a line). Same weights and colours as the arrow-down / arrow-left siblings.
// Roles: shaft c1 -> c2 glow, head c3 -> c4, shine on the shaft. Motion: shaft wm-k, head wm-a (nudges).
import { col } from '../../styles/_rangoli-core.mjs'

const N = 'arrow-down-left'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 13, cy: 8, r: 15, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: 'M18.2 5.8L5.8 18.2', stroke: url(1), 'stroke-width': 2.4, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M5.5 9.5V18.5H14.5', stroke: url(0), 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
