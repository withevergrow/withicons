// forge/hand/rangoli/close.mjs — a bold, even-weight festive-glow X as the whole icon, with a small marigold kept clear in the top-right
// corner as the only accent. The earlier version ringed the crossing with dots and a bead, which read as a flower;
// now the two crossing strokes carry it and nothing touches them.
// Roles: X c1 -> c2 (diya glow from the upper left), marigold accent / c3 -> c4 / shadow heart.
// Motion: X wm-k (breathes), marigold wm-deco.
import { col } from '../../styles/_rangoli-core.mjs'
import { marigold } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'close'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]

export default function render() {
  const [outer, inner, heart] = marigold(19.8, 4.2, 1.9)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.5, cy: 8, r: 16, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: 'M5.5 7.5L16.5 18.5M16.5 7.5L5.5 18.5', stroke: url(0), 'stroke-width': 3.2, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: outer, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: inner, fill: url(1), class: 'wm-deco' }],
    ['path', { d: heart, fill: col('shadow'), class: 'wm-deco' }],
  ]
}
