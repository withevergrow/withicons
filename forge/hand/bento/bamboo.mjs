// forge/hand/bento/bamboo.mjs — simplified for 16-24px: ONE thick stalk with two node bands and two accent leaves
// (one up-right, one left), so it reads as bamboo without clumping. Stalk is the house duotone mass (c1) with the
// deep outline; leaves are filled accent with a lighter c2 contour. Larger glyph scale than the house 0.59.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'bamboo'
const S = 0.82
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

const STALKS = 'M9.8 21V5L9.4 3H14.6L14.2 5V21Z'
const LEAVES = 'M14.4 9Q15.2 4.6 21 3.4Q21.4 8.6 14.4 9ZM9.6 15.6Q8.8 11.2 3 10Q2.6 15.2 9.6 15.6Z'
const NODES = 'M9.4 9.2H14.6M9.4 15.8H14.6'
const LIT = 'M11.2 4.8V8'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(2.5), 0, Y(21.5), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.6)]),
      lin(3, 0, Y(4.5), 0, Y(16), [stop(0, 'accent', 0.75), stop(1, 'accent', 1)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(STALKS, dy) + M(LEAVES, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  out.push(['path', { d: M(STALKS), fill: col('shine') }])
  out.push(['path', { d: M(STALKS), fill: url(2) }])
  out.push(['path', { d: M(LIT), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.55, class: 'wm-shine' }])
  out.push(['path', { d: M(STALKS), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(NODES), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(LEAVES), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(LEAVES), fill: url(3), class: 'wm-a' }])
  out.push(['path', { d: M(LEAVES), stroke: col('c2'), 'stroke-width': 0.8, class: 'wm-a' }])
  return out
}
