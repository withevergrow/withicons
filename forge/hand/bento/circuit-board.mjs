// forge/hand/bento/circuit-board.mjs — a board with a chip set into its lower-right corner and two long 45-degree
// traces that run from separate pads along the top and down the left side into it, so it reads as traces plus chip and
// not as a frame round a blob (the generated glyph had no chip; an earlier hand pass crowded the pads into the outline).
// Drawn on the 24 grid with >= 1.77u between every pad, trace and chip and the outline's inner edge, and placed with the
// house glyph scale, tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'circuit-board'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const dot = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

// glyph, on the 24 grid (the outline stroke is ~1.86u here, so its inner edge sits at 3.93 / 20.07)
const BOARD = 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
// the chip, 6u, 2.14u clear of the outline on its right and bottom
const CHIP = 'M12.25 11H15.75A1.25 1.25 0 0 1 17 12.25V15.75A1.25 1.25 0 0 1 15.75 17H12.25A1.25 1.25 0 0 1 11 15.75V12.25A1.25 1.25 0 0 1 12.25 11Z'
// trace A: from the top-left pad along the top, a 45-degree turn, down into the chip's top
// trace B: from the bottom-left pad up the left side, a 45-degree turn, across into the chip's left
const TRACES = 'M7 7H11.5L14 9.5V11M7 17V14.5L9 12.5H11'
const PADS = dot(7, 7, 1.3) + dot(7, 17, 1.3) + dot(17.5, 7, 1)
const HOLES = dot(7, 7, 0.5) + dot(7, 17, 0.5) + dot(17.5, 7, 0.4)
const DIE = 'M13 14.25V13.25H14'

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
    out.push(['path', { d: M(BOARD, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the board: the house duotone mass under a deep outline
  out.push(['path', { d: M(BOARD), fill: col('shine') }])
  out.push(['path', { d: M(BOARD), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(BOARD), stroke: col('shadow'), 'stroke-width': T.SW }])
  // traces and pads: the A plate (current runs along them), deep with lit drilled holes
  out.push(['path', { d: M(TRACES), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(PADS), fill: col('shadow'), class: 'wm-a' }])
  out.push(['path', { d: M(HOLES), fill: col('shine'), class: 'wm-a' }])
  // the chip: a bright c1 block in a deep outline, with a lit corner mark (pin 1)
  out.push(['path', { d: M(CHIP), fill: col('shine'), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(CHIP), fill: col('c1'), 'fill-opacity': 0.85 }])
  out.push(['path', { d: M(DIE), stroke: col('shine'), 'stroke-opacity': 0.9, 'stroke-width': 0.55, class: 'wm-shine' }])
  return out
}
