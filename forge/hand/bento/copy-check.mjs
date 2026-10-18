// forge/hand/bento/copy-check.mjs — two stacked sheets with a large, bold check centred on the front sheet: the
// generated glyph's check was a small pink fleck that vanished at 16px and its back sheet faded into the tile.
// Drawn on the 24 grid and placed with the house glyph scale, tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'copy-check'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid
const FRONT = 'M11 9H19A2 2 0 0 1 21 11V19A2 2 0 0 1 19 21H11A2 2 0 0 1 9 19V11A2 2 0 0 1 11 9Z'
// the back sheet's visible part: its mass stops short of the front sheet (a clean gap), its outline ends at the gap
const BACK_MASS = 'M5 3H13A2 2 0 0 1 15 5V6.5H11A4.5 4.5 0 0 0 6.5 11V15H5A2 2 0 0 1 3 13V5A2 2 0 0 1 5 3Z'
const BACK = 'M15 6.5V5A2 2 0 0 0 13 3H5A2 2 0 0 0 3 5V13A2 2 0 0 0 5 15H6.5'
const CHECK = 'M12 15.25L14.25 17.5L18 12.75'

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
  // soft drop shadow, then a tight contact shadow
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(FRONT, dy) + M(BACK_MASS, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // back sheet (A plate): a deeper c1 mass, outline in c1 over a deep underline
  out.push(['path', { d: M(BACK_MASS), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(BACK_MASS), fill: col('c1'), 'fill-opacity': 0.42, class: 'wm-a' }])
  out.push(['path', { d: M(BACK), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(BACK), stroke: col('c1'), 'stroke-opacity': 0.5, 'stroke-width': T.SW, class: 'wm-a' }])
  // front sheet: the house duotone mass, lightened so the check owns it, under a deep outline
  out.push(['path', { d: M(FRONT), fill: col('shine') }])
  out.push(['path', { d: M(FRONT), fill: `url(#${id(2)})`, 'fill-opacity': 0.6 }])
  out.push(['path', { d: M(FRONT), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the check (S plate, draws on): accent over an ink underline, a touch heavier than the outlines
  out.push(['path', { d: M(CHECK), stroke: col('ink'), 'stroke-width': T.SW + 0.2, class: 'wm-s' }])
  out.push(['path', { d: M(CHECK), stroke: col('accent'), 'stroke-opacity': 0.85, 'stroke-width': T.SW + 0.2, class: 'wm-s' }])
  return out
}
