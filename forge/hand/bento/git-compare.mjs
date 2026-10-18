// forge/hand/bento/git-compare.mjs — compare branches on the bento tile: two equal deep-ringed nodes with one even mass
// tone (the generated gradient left the top node near white), and each arrow drawn whole, shaft and head, in its own
// colour (c1 one way, c2 the other) so the two opposing changes read as a pair with clear space at the nodes.
import { col, T, squircle } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const N = 'git-compare'
const id = n => `wg-bento-${N}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op) => ['stop', { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

// skeleton-space drawing (24 grid), mapped onto the tile
const NODES = 'M8 6A3 3 0 1 1 2 6A3 3 0 1 1 8 6ZM22 18A3 3 0 1 1 16 18A3 3 0 1 1 22 18Z'
const ARROW_1 = 'M19 15V8A2 2 0 0 0 17 6H11.5M14.25 3.25L11.5 6L14.25 8.75'   // from the lower node up to the upper branch
const ARROW_2 = 'M5 9V16A2 2 0 0 0 7 18H12.5M9.75 15.25L12.5 18L9.75 20.75'   // from the upper node down to the lower branch
const SW = T.SW

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(NODES, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(ARROW_1, dy) + M(ARROW_2, dy), stroke: col('shadow'), 'stroke-width': SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // the arrows, each whole in its colour over the deep shade
  for (const [d, c] of [[ARROW_1, 'c1'], [ARROW_2, 'c2']]) {
    out.push(['path', { d: M(d), stroke: col('shadow'), 'stroke-width': SW, class: 'wm-a' }])
    out.push(['path', { d: M(d), stroke: col(c), 'stroke-opacity': 0.78, 'stroke-width': SW, class: 'wm-a' }])
  }
  // the nodes: one even duotone mass under a deep ring
  out.push(['path', { d: M(NODES), fill: col('shine') }])
  out.push(['path', { d: M(NODES), fill: col('c1'), 'fill-opacity': 0.55 }])
  out.push(['path', { d: M(NODES), stroke: col('shadow'), 'stroke-width': SW }])
  return out
}
