// forge/hand/rangoli/ban.mjs — a festive-glow prohibition sign: ring and slash at one even weight over cream halves,
// with a deep lip and a soft highlight. Replaces the generated drawing, where a sun-ray petal ring crowded the rim
// and the slash was thinner than the ring, so the bar no longer read first.
// Roles: ring + slash c1 -> c2, halves tint, lip shadow, highlight shine.
// Motion: whole sign wm-k (pulses).
import { col } from '../../styles/_rangoli-core.mjs'

const NAME = 'ban'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]

// inner disc r 7 split by the slash (half-width 1.25 along the 45 degree diagonal)
const HALVES = 'M8.01 6.25A7 7 0 0 1 17.75 15.99ZM15.99 17.75A7 7 0 0 1 6.25 8.01Z'
const LIP = 'M2.5 12A9.5 9.5 0 0 0 21.5 12A9.5 8.6 0 0 1 2.5 12Z'
const SHINE = 'M3.6 9.6A8.75 8.75 0 0 1 8.3 4.1'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.5, cy: 7.5, r: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: HALVES, fill: col('tint'), class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 8.25, stroke: url(0), 'stroke-width': 2.5, class: 'wm-k' }],
    ['path', { d: 'M6.75 6.75L17.25 17.25', stroke: url(0), 'stroke-width': 2.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: LIP, fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: SHINE, stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
