// forge/hand/rangoli/message-square-text.mjs: a square speech bubble in the orange glow with its tail at the lower
// left and two c3 -> c4 text lines inside (long above, short below), like the line drawing. The generated drawing
// swapped the lines for faint cutouts and a corner flower, so it read as a blank bubble.
// Motion: bubble wm-k, text lines wm-a, shine wm-shine.
import { col } from '../../styles/_rangoli-core.mjs'

const NAME = 'message-square-text'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const f = v => +v.toFixed(2)
const bubble = (dx = 0, dy = 0) => {
  const X = v => f(v + dx), Y = v => f(v + dy)
  return `M${X(5.5)} ${Y(3)}H${X(18.5)}A3 3 0 0 1 ${X(21.5)} ${Y(6)}V${Y(15)}A3 3 0 0 1 ${X(18.5)} ${Y(18)}H${X(7.2)}` +
    `L${X(3.7)} ${Y(21.4)}C${X(3.1)} ${Y(22)} ${X(2.5)} ${Y(21.7)} ${X(2.5)} ${Y(21)}V${Y(6)}A3 3 0 0 1 ${X(5.5)} ${Y(3)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.6, cy: 6.8, r: 24.9, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: bubble(0.2, 0.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: bubble(), fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M5.2 5.6H9.5M4.9 7.6V9.2', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M7 8.4H17M7 12.8H13.4', stroke: url(1), 'stroke-width': 2, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
