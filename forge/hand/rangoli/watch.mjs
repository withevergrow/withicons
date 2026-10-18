// forge/hand/rangoli/watch.mjs — a wristwatch: a round orange case with a pale dial and violet hands, a crown on the
// right and two magenta-violet straps above and below, so the case and the straps read as separate parts.
import { col } from '../../styles/_rangoli-core.mjs'
import { sparkle, disc } from '../../styles/_rangoli-motifs.mjs'

const N = 'watch'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const top = dy => `M8.4 ${6.8 + dy}L8.9 ${3.5 + dy}A1.3 1.3 0 0 1 10.2 ${2.4 + dy}H13.8A1.3 1.3 0 0 1 15.1 ${3.5 + dy}L15.6 ${6.8 + dy}Z`
const bot = dy => `M8.4 ${17.2 + dy}L8.9 ${20.5 + dy}A1.3 1.3 0 0 0 10.2 ${21.6 + dy}H13.8A1.3 1.3 0 0 0 15.1 ${20.5 + dy}L15.6 ${17.2 + dy}Z`
const crown = dy => `M18.4 ${10.9 + dy}H19.5A.8 .8 0 0 1 20.3 ${11.7 + dy}V${12.3 + dy}A.8 .8 0 0 1 19.5 ${13.1 + dy}H18.4Z`

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 9, cy: 8, r: 15, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: top(0.6) + bot(0.6) + crown(0.6) + disc(12, 12.6, 6.6), fill: col('shadow'), 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: top(0) + bot(0), fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M9.5 20.1H14.5M9.7 4.2H14.3', fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.5, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: crown(0), fill: url(1), class: 'wm-k' }],
    ['path', { d: disc(12, 12, 6.6), fill: url(1), class: 'wm-k' }],
    ['path', { d: disc(12, 12, 4.5), fill: col('tint'), class: 'wm-k' }],
    ['path', { d: 'M12 8.6V12L14.4 13.7', fill: 'none', stroke: col('c4'), 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['circle', { cx: 12, cy: 12, r: 0.8, fill: col('c3'), class: 'wm-a' }],
    ['path', { d: 'M6.8 9.7A5.7 5.7 0 0 1 10 6.7', fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: sparkle(20.6, 4.8, 1.8), fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: sparkle(3.6, 19.4, 1.1), fill: col('c3'), class: 'wm-deco' }],
  ]
}
