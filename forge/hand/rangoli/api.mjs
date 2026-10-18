// forge/hand/rangoli/api.mjs — an orange connector block with an inset panel, three magenta-violet round nodes
// on short stubs (one left, two right), so the block and the nodes read as separate shapes.
import { col } from '../../styles/_rangoli-core.mjs'
import { sparkle, disc } from '../../styles/_rangoli-motifs.mjs'

const N = 'api'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const block = dy => `M10 ${5.6 + dy}H14A2.4 2.4 0 0 1 16.4 ${8 + dy}V${16 + dy}A2.4 2.4 0 0 1 14 ${18.4 + dy}H10A2.4 2.4 0 0 1 7.6 ${16 + dy}V${8 + dy}A2.4 2.4 0 0 1 10 ${5.6 + dy}Z`
const nodes = dy => disc(3.8, 12 + dy, 2.1) + disc(20.2, 8.6 + dy, 2.1) + disc(20.2, 15.4 + dy, 2.1)
const stubs = 'M5.6 12H8M16 8.6H18.2M16 15.4H18.2'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 9, cy: 8, r: 14, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: block(0.6) + nodes(0.6), fill: col('shadow'), 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: stubs, fill: 'none', stroke: url(0), 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: block(0), fill: url(1), class: 'wm-k' }],
    ['path', { d: 'M10.2 8H13.8A1 1 0 0 1 14.8 9V15A1 1 0 0 1 13.8 16H10.2A1 1 0 0 1 9.2 15V9A1 1 0 0 1 10.2 8Z', fill: col('shadow'), 'fill-opacity': 0.22, class: 'wm-k' }],
    ['path', { d: 'M12 10.2V10.3M12 12V12.1M12 13.8V13.9', fill: 'none', stroke: col('tint'), 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: nodes(0), fill: url(0), class: 'wm-a' }],
    ['path', { d: 'M3.8 12V12.05M20.2 8.6V8.65M20.2 15.4V15.45', fill: 'none', stroke: col('tint'), 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M8.3 11.5V8.4A1.8 1.8 0 0 1 10.1 6.6H12', fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: sparkle(4.8, 4.8, 1.8), fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: sparkle(12, 21.4, 1), fill: col('c3'), class: 'wm-deco' }],
  ]
}
