// forge/hand/rangoli/sunrise.mjs — a big glowing half sun on the horizon, two short rays, a rising purple arrow and one
// small twinkle: the generated drawing had a small sun and two sparkles that competed with the arrow.
import { col } from '../../styles/_rangoli-core.mjs'
import { sparkle } from '../../styles/_rangoli-motifs.mjs'

const N = 'sunrise'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const bars = dy => `M2.6 ${17 + dy}H21.4M8 ${21 + dy}H16`
const line = (w) => ({ fill: 'none', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
const sun = dy => `M6.25 ${17 + dy}A5.75 5.75 0 0 1 17.75 ${17 + dy}Z`

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.8, cy: 12.6, r: 19, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 2, x2: 20, y2: 14, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    // depth lip
    ['path', { d: bars(0.5), ...line(2.2), stroke: col('shadow'), 'stroke-opacity': 0.5, class: 'wm-shadow' }],
    // sun and horizon
    ['path', { d: sun(0), fill: url(0), class: 'wm-k' }],
    ['path', { d: bars(0), ...line(2.2), stroke: url(0), class: 'wm-k' }],
    // two rays
    ['path', { d: 'M6.5 11.5L5.2 10.2M17.5 11.5L18.8 10.2', ...line(2), stroke: url(1), class: 'wm-a' }],
    // rising arrow
    ['path', { d: 'M12 8.8V3M9 5.7L12 2.7L15 5.7', ...line(2.2), stroke: url(1), class: 'wm-s' }],
    // shine
    ['path', { d: 'M7.4 15.2A4.9 4.9 0 0 1 10.2 12.5', ...line(0.6), stroke: col('shine'), 'stroke-opacity': 0.7, class: 'wm-shine' }],
    // one twinkle
    ['path', { d: sparkle(19.3, 4.6, 1.9), fill: col('accent'), class: 'wm-deco' }],
  ]
}
