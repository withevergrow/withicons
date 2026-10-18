// forge/hand/rangoli/chevron-right.mjs — a clean, even-weight festive-glow chevron with its corner marigold moved clear of the
// arms. Replaces the generated drawing, where the flower crowded the arm end and the tapered stroke looked thin.
// Roles: chevron c1 -> c2 (diya glow from the upper left), marigold accent / c3 -> c4 / shadow heart.
// Motion: chevron wm-k (nudges), marigold wm-deco (breathes).
import { col } from '../../styles/_rangoli-core.mjs'
import { marigold } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'chevron-right'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]

export default function render() {
  const [outer, inner, heart] = marigold(19.4, 4.6, 2.7)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.5, cy: 8, r: 14, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: 'M9 6L15 12L9 18', stroke: url(0), 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: outer, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: inner, fill: url(1), class: 'wm-deco' }],
    ['path', { d: heart, fill: col('shadow'), class: 'wm-deco' }],
  ]
}
