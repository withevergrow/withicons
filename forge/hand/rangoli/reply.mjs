// forge/hand/rangoli/reply.mjs — a reply arrow: festive-glow curved shaft with a c3 -> c4 arrowhead laid cleanly on
// top at the tip, and a small marigold well clear in the top-right corner. The generated drawing wore a big marigold
// that competed with the arrowhead, and the shaft's end showed over the tip.
// Motion: arrowhead wm-a (nudges left), shaft wm-k, marigold wm-deco (floats).
import { col } from '../../styles/_rangoli-core.mjs'
import { marigold } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'reply'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const line = { 'stroke-width': 4.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const [outer, inner, heart] = marigold(19.6, 4.4, 1.7)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.6, cy: 11.1, r: 20.1, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: 'M5 9.5H13A7 7 0 0 1 20 16.5V19.5', stroke: url(0), ...line, class: 'wm-k' }],
    ['path', { d: 'M8.5 4.5L3.5 9.5L8.5 14.5', stroke: url(1), ...line, class: 'wm-a' }],
    ['path', { d: outer, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: inner, fill: url(1), class: 'wm-deco' }],
    ['path', { d: heart, fill: col('shadow'), class: 'wm-deco' }],
  ]
}
