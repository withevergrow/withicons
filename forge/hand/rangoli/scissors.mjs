// forge/hand/rangoli/scissors.mjs — two open finger rings on the left and two straight blades crossing in a clear X
// with a bindu pivot, one tool in saffron glow and one in kumkum-to-violet. Replaces the generated drawing, whose filled
// ball and parallel bar lost the crossing shape. The upper blade casts a soft shadow onto the lower one.
// Roles: ring + blade 1 c1 -> c2, ring + blade 2 c3 -> c4, pivot accent. Motion: blade 2 + ring wm-a (snips), rest wm-k.
import { col } from '../../styles/_rangoli-core.mjs'

const N = 'scissors'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const W = 2.3

export default function render() {
  const stroke = (d, paint, cls, extra = {}) => ['path', { d, stroke: paint, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls, ...extra }]
  const RING1 = 'M9 6A3 3 0 1 1 3 6A3 3 0 1 1 9 6Z'
  const RING2 = 'M9 18A3 3 0 1 1 3 18A3 3 0 1 1 9 18Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 8, cy: 7, r: 18, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    stroke(RING2, url(0), 'wm-a'),
    stroke('M8.4 16.2L20 7.5', url(0), 'wm-a'),
    stroke('M8.9 8.6L20.5 17.3', col('shadow'), 'wm-shadow', { 'stroke-opacity': 0.4 }),
    stroke(RING1, url(1), 'wm-k'),
    stroke('M8.4 7.8L20 16.5', url(1), 'wm-k'),
    ['circle', { cx: 14, cy: 12, r: 1.15, fill: col('shadow'), class: 'wm-deco' }],
    ['circle', { cx: 14, cy: 12, r: 0.55, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: 'M4.2 4.6A2.4 2.4 0 0 1 6.2 3.5', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
