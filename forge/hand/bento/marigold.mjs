// forge/hand/bento/marigold.mjs — a marigold pompom on the bento tile: nine round, deeply notched outer petals, a second
// layer of six petals in a deeper tone and a solid centre, so the flower reads as layered blooms and no longer as a
// scalloped gear (or the rangoli pattern) in the flat duotone.
import { col, T, squircle } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const N = 'marigold'
const id = n => `wg-bento-${N}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op) => ['stop', { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

// skeleton-space drawing (24 grid), mapped onto the tile
// outer layer: 9 petals, notches on r 6, each petal a 2.5 arc (more than a half circle: round, ball-like petals)
const OUTER = 'M9.95 6.36A2.5 2.5 0 1 1 14.05 6.36A2.5 2.5 0 1 1 17.2 9A2.5 2.5 0 1 1 17.91 13.04A2.5 2.5 0 1 1 15.86 16.6' +
  'A2.5 2.5 0 1 1 12 18A2.5 2.5 0 1 1 8.14 16.6A2.5 2.5 0 1 1 6.09 13.04A2.5 2.5 0 1 1 6.8 9A2.5 2.5 0 1 1 9.95 6.36Z'
// inner layer: 6 petals, notches on r 3.3 (a notch under the top outer petal, so the layers interleave)
const INNER = 'M12 8.7A1.75 1.75 0 1 1 14.86 10.35A1.75 1.75 0 1 1 14.86 13.65A1.75 1.75 0 1 1 12 15.3A1.75 1.75 0 1 1 9.14 13.65A1.75 1.75 0 1 1 9.14 10.35A1.75 1.75 0 1 1 12 8.7Z'
const CENTRE = 'M13.4 12A1.4 1.4 0 1 1 10.6 12A1.4 1.4 0 1 1 13.4 12Z'
const SW = 1   // a hair under the house 1.1: nine small petals would otherwise read as rings

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 6.2, 0, 17.6, [stop(0, 'c1', 0.42), stop(1, 'c1', 0.7)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(OUTER, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // outer petals: the house duotone mass
  out.push(['path', { d: M(OUTER), fill: col('shine') }])
  out.push(['path', { d: M(OUTER), fill: url(2) }])
  // inner petals: one value step deeper, edged in a fine deep line (the layer that turns)
  out.push(['path', { d: M(INNER, 0.18), fill: col('shadow'), 'fill-opacity': 0.18, class: 'wm-a' }])
  out.push(['path', { d: M(INNER), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(INNER), fill: col('c2'), 'fill-opacity': 0.72, stroke: col('shadow'), 'stroke-opacity': 0.8, 'stroke-width': 0.6, class: 'wm-a' }])
  // centre: a solid deep disc
  out.push(['path', { d: M(CENTRE), fill: col('shadow'), class: 'wm-a' }])
  // the silhouette in the deep shade
  out.push(['path', { d: M(OUTER), stroke: col('shadow'), 'stroke-width': SW }])
  return out
}
