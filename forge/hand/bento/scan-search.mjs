// forge/hand/bento/scan-search.mjs — a big lit lens with a sturdy handle inside four short, softer scan corners: the
// generated glyph gave the corner brackets the same deep weight as a small lens, so the frame won over the magnifier.
// Drawn on the 24 grid and placed with the house glyph scale, tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'scan-search'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid: the lens pivots at (11, 11) like the motion spec
const CORNERS = 'M3 7V5A2 2 0 0 1 5 3H7M17 3H19A2 2 0 0 1 21 5V7M21 17V19A2 2 0 0 1 19 21H17M7 21H5A2 2 0 0 1 3 19V17'
const LENS = 'M15.25 11A4.25 4.25 0 1 1 6.75 11A4.25 4.25 0 1 1 15.25 11Z'
const HANDLE = 'M14.25 14.25L17.25 17.25'
const GLARE = 'M8.9 10.1A2.4 2.4 0 0 1 10.6 8.6'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 7.77, 0, 17.21, [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  // soft drop shadow, then a tight contact shadow (corners and magnifier)
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(LENS, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(CORNERS, dy) + M(HANDLE, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // scan corners: the quieter frame, in the house A colour (c1 over a deep underline)
  out.push(['path', { d: M(CORNERS), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(CORNERS), stroke: col('c1'), 'stroke-opacity': 0.72, 'stroke-width': T.SW }])
  // the magnifier (A plate, tilts as one): lit glass, a glare, a deep rim and handle
  out.push(['path', { d: M(LENS), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(LENS), fill: `url(#${id(2)})`, class: 'wm-a' }])
  out.push(['path', { d: M(GLARE), stroke: col('shine'), 'stroke-opacity': 0.9, 'stroke-width': 0.6, class: 'wm-a wm-shine' }])
  out.push(['path', { d: M(LENS) + M(HANDLE), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(HANDLE), stroke: col('shadow'), 'stroke-width': T.SW + 0.3, class: 'wm-a' }])
  return out
}
