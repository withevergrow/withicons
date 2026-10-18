// forge/hand/suite/rose-bouquet.mjs — three swirl rose heads rising from a paper cone with a fold line and a bow, two
// green leaves poking out at the sides; the generated drawing fused everything into one anonymous blob.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'rose-bouquet'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])
const r = n => +n.toFixed(2)

const CONE = dy => `M6.4 ${r(12.4 + dy)}H17.6L14.1 ${r(21.2 + dy)}A1.1 1.1 0 0 1 13.1 ${r(21.8 + dy)}H10.9A1.1 1.1 0 0 1 9.9 ${r(21.2 + dy)}Z`
const LEAF_L = 'M8 14.4C5.4 12.9 3 13.8 2.4 16.4C4.8 17.2 7 16.4 8.2 15.2Z'
const LEAF_R = 'M16 14.4C18.6 12.9 21 13.8 21.6 16.4C19.2 17.2 17 16.4 15.8 15.2Z'
const BOW = 'M12 16.6C10.6 15.2 8.8 15.4 8.9 16.6C9 18 10.9 17.9 12 16.6C13.1 17.9 15 18 15.1 16.6C15.2 15.4 13.4 15.2 12 16.6Z'
const ROSES = [[16.7, 10, 3.6], [7.3, 10, 3.6], [12, 5.7, 4]]
const swirl = (cx, cy, k) => `M${r(cx - 0.2 * k)} ${r(cy + 0.1 * k)}A${r(0.9 * k)} ${r(0.9 * k)} 0 1 1 ${r(cx + 0.8 * k)} ${r(cy - 0.7 * k)}M${r(cx - 1.9 * k)} ${r(cy + 0.4 * k)}A${r(1.9 * k)} ${r(1.9 * k)} 0 0 1 ${r(cx + 0.3 * k)} ${r(cy - 1.9 * k)}`

export default function render() {
  const roses = ROSES.flatMap(([cx, cy, rr], i) => {
    const k = rr / 3.4
    return [
      ['circle', { cx, cy: r(cy + 0.55), r: rr, fill: col('shadow'), 'fill-opacity': 0.55, class: 'wm-shadow' }],
      ['circle', { cx, cy, r: rr, fill: col(i === 1 ? 'c4' : 'c1'), class: 'wm-a' }],
      ['circle', { cx, cy, r: rr, fill: url(2), class: 'wm-a' }],
      ['path', { d: swirl(cx, cy, k), stroke: col('edge'), 'stroke-width': 0.95, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-a' }],
    ]
  })
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c2'), stop(1, 'shadow')]),
      sheenG(1, 6, 12.6, 18, 21.8),
      sheenG(2, 3, 3, 20, 14),
      sheenG(3, 2, 12, 22, 17),
    ]],
    ['path', { d: LEAF_L, fill: col('c3'), class: 'wm-a' }],
    ['path', { d: LEAF_R, fill: col('c3'), class: 'wm-a' }],
    ['path', { d: LEAF_L, fill: url(3), class: 'wm-a' }],
    ['path', { d: LEAF_R, fill: url(3), class: 'wm-a' }],
    ['path', { d: CONE(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: CONE(0), fill: col('c2'), class: 'wm-k' }],
    ['path', { d: CONE(0), fill: url(1), class: 'wm-k' }],
    ['path', { d: 'M9.6 13.8L11.3 20.4', stroke: col('edge'), 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-k' }],
    ...roses,
    ['path', { d: BOW, fill: col('accent'), class: 'wm-s' }],
    ['circle', { cx: 12, cy: 16.7, r: 0.95, fill: col('shadow'), 'fill-opacity': 0.55, class: 'wm-s' }],
  ]
}
