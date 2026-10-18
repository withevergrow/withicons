// forge/hand/rangoli/repeat.mjs — two horizontal rounded-corner arrows, the top one running right and the bottom one left,
// festive-glow shafts with c3 -> c4 chevron heads and one small gold sparkle between them. The generated
// drawing slanted the heads into diagonal ribbons and let the sparkle dominate.
// Motion: shafts wm-k, heads wm-a, sparkle wm-deco.
import { col } from '../../styles/_rangoli-core.mjs'
import { sparkle } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'repeat'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const line = { 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 8, cy: 8, r: 20, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: 'M4.5 11.5V10A3.5 3.5 0 0 1 8 6.5H19.5M19.5 12.5V14A3.5 3.5 0 0 1 16 17.5H4.5', stroke: url(1), ...line, class: 'wm-k' }],
    ['path', { d: 'M16 3L19.5 6.5L16 10M8 14L4.5 17.5L8 21', stroke: url(0), ...line, class: 'wm-a' }],
    ['path', { d: sparkle(12, 12, 1.9), fill: col('accent'), class: 'wm-deco' }],
  ]
}
