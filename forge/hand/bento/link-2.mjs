// forge/hand/bento/link-2.mjs — two chain links on the bento tile: each half-link gets the house duotone mass inside its
// loop (the generated outline-only drawing looked thin beside filled siblings) and the joining bar is a deeper c1 stroke.
import { col, T, squircle } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const N = 'link-2'
const id = n => `wg-bento-${N}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op) => ['stop', { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

// skeleton-space drawing (24 grid), mapped onto the tile
const LOOPS = 'M10 6.5H7.5A5.5 5.5 0 0 0 7.5 17.5H10M14 6.5H16.5A5.5 5.5 0 0 1 16.5 17.5H14'
const MASS = 'M10 6.5H7.5A5.5 5.5 0 0 0 7.5 17.5H10ZM14 6.5H16.5A5.5 5.5 0 0 1 16.5 17.5H14Z'
const BAR = 'M8 12H16'
const SW = T.SW

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 8.6, 0, 15.2, [stop(0, 'c1', 0.26), stop(1, 'c1', 0.5)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(MASS, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(LOOPS, dy) + M(BAR, dy), stroke: col('shadow'), 'stroke-width': SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // the loops: a pale duotone mass under deep outlines
  out.push(['path', { d: M(MASS), fill: col('shine') }])
  out.push(['path', { d: M(MASS), fill: url(2) }])
  out.push(['path', { d: M(LOOPS), stroke: col('shadow'), 'stroke-width': SW }])
  // the bar that joins them (the part that pulses): c1 over the deep shade, deeper than the house A tone
  out.push(['path', { d: M(BAR), stroke: col('shadow'), 'stroke-width': SW + 0.15, class: 'wm-a' }])
  out.push(['path', { d: M(BAR), stroke: col('c1'), 'stroke-opacity': 0.8, 'stroke-width': SW + 0.15, class: 'wm-a' }])
  return out
}
