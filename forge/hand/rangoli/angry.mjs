// forge/hand/rangoli/angry.mjs: a festive-glow face whose features are solid deep-plum strokes (heavy slanted brows,
// round eyes, a frown) so the anger reads at 16px; no flower badge competing with the face.
import { col } from '../../styles/_rangoli-core.mjs'
import { disc } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'angry'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const ink = w => ({ stroke: col('shadow'), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' })

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8, cy: 6.5, r: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: disc(12, 12.75, 9.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: disc(12, 12.25, 9.5), fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M4.3 10.4A8 8 0 0 1 10.4 4.4', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M6.4 8.6L10.4 10.4M17.6 8.6L13.6 10.4', ...ink(2), class: 'wm-k' }],
    ['path', { d: disc(8.9, 13, 1.3) + disc(15.1, 13, 1.3), fill: col('shadow'), class: 'wm-k' }],
    ['path', { d: 'M8.6 18.3Q12 15.4 15.4 18.3', ...ink(1.9), class: 'wm-k' }],
  ]
}
