// forge/hand/rangoli/chevron-last.mjs — a glowing marigold-orange chevron against a firm magenta end bar, with the
// style's corner marigold tucked into the open space above the chevron tip; the generated bar was thin beside the
// chevron and the flower crowded both, so here the bar gets a solid 2.6u weight and the flower its own clear pocket.
import { col } from '../../styles/_rangoli-core.mjs'
import * as M from '../../styles/_rangoli-motifs.mjs'

export default function render(icon) {
  const id = n => `wg-rangoli-${icon.name}-${n}`
  const [o, i, h] = M.marigold(12, 4.2, 2.2)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.7, cy: 8, r: 14.8, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': col('c1') }],
        ['stop', { offset: 0.3, 'stop-color': col('c1') }],
        ['stop', { offset: 1, 'stop-color': col('c2') }],
      ]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': col('c3') }],
        ['stop', { offset: 1, 'stop-color': col('c4') }],
      ]],
    ]],
    ['path', { d: 'M17.25 6.25V17.75', stroke: `url(#${id(1)})`, 'stroke-width': 2.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M6.75 6.5L12.25 12L6.75 17.5', stroke: `url(#${id(0)})`, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: o, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: i, fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: h, fill: col('shadow'), class: 'wm-deco' }],
  ]
}
