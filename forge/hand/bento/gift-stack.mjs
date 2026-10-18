// forge/hand/bento/gift-stack.mjs — three boxes stacked in a pyramid, each with a deeper lid band, a centre ribbon and a
// big bow on top. Ribbon and bow are solid deep shapes against pale boxes so they read at 16px. House tile, shadow, duotone.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'gift-stack'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const M = (d, dy = 0) => mapPath(d, 0.92, [12, 12.5], 0, -0.6 + dy)
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid
const rr = (x0, y0, x1, y1, r) => `M${x0} ${y0}H${x1}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}Z`
const BOXES = [rr(3.5, 14.6, 20.5, 21, 1.5), rr(5.5, 10, 18.5, 14.6, 0.01), rr(7.5, 6.6, 16.5, 10, 0.01)]
const LIDS = ['M3.5 14.6H20.5V16.1H3.5Z', 'M5.5 10H18.5V11.4H5.5Z', 'M7.5 6.6H16.5V7.9H7.5Z']
const RIBBON = 'M11.1 6.6H12.9V21H11.1Z'
const BOW = 'M12 6.6C10.2 2.6 6.6 2.9 7 5C7.3 6.5 10 6.6 12 6.6ZM12 6.6C13.8 2.6 17.4 2.9 17 5C16.7 6.5 14 6.6 12 6.6Z'
const ALL = BOXES.join('')

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 5, 0, 19.3, [stop(0, 'c1', 0.3), stop(1, 'c1', 0.6)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(ALL + BOW, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the boxes: the house duotone mass, the lid bands a deeper tone so each box reads as its own
  for (const d of BOXES) {
    out.push(['path', { d: M(d), fill: col('shine') }])
    out.push(['path', { d: M(d), fill: url(2) }])
  }
  for (const d of LIDS) out.push(['path', { d: M(d), fill: col('c1'), 'fill-opacity': 0.45 }])
  for (const d of BOXES) out.push(['path', { d: M(d), stroke: col('shadow'), 'stroke-width': T.SW }])
  // ribbon and bow (the A plate): solid, deepest
  out.push(['path', { d: M(RIBBON), fill: col('c1'), 'fill-opacity': 0.9, class: 'wm-a' }])
  out.push(['path', { d: M(BOW), fill: col('shadow'), class: 'wm-a' }])
  out.push(['path', { d: M(BOW), fill: col('c1'), 'fill-opacity': 0.8, class: 'wm-a' }])
  out.push(['path', { d: M(BOW), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  return out
}
