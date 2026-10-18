// forge/hand/bento/panel-right.mjs — a window frame that fills the tile: a wide left pane and a narrow (~28%) right
// pane tinted deeper, split by one deep divider, like the line design. Larger glyph scale than the house 0.59 so the
// two panes read as a layout at 16px; house tile, duotone mass, shadow stack and deep outline otherwise.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'panel-right'
const S = 0.8
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

const FRAME = 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
const PANE = 'M15.5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H15.5Z'
const DIV = 'M15.5 3V21'
const LIT = 'M5.6 5.8H13.2'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(3), 0, Y(21), [stop(0, 'c1', 0.28), stop(1, 'c1', 0.5)]),
      lin(3, 0, Y(3), 0, Y(21), [stop(0, 'c1', 0.55), stop(1, 'c1', 0.8)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(FRAME, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  out.push(['path', { d: M(FRAME), fill: col('shine') }])
  out.push(['path', { d: M(FRAME), fill: url(2) }])
  out.push(['path', { d: M(PANE), fill: url(3), class: 'wm-a' }])
  out.push(['path', { d: M(LIT), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.55, class: 'wm-shine' }])
  out.push(['path', { d: M(FRAME) + M(DIV), stroke: col('shadow'), 'stroke-width': T.SW }])
  return out
}
