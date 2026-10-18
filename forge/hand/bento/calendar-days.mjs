// forge/hand/bento/calendar-days.mjs — a calendar page whose days are six solid rounded cells (one accent "today"),
// big enough to hold as a grid at 16px (the generated six hairline dots vanished on the pale page at small sizes).
// Drawn on the 24 grid and placed with the house glyph scale, tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'calendar-days'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
// rounded cell centred on (cx, cy)
const cell = (cx, cy, w, h, r) => {
  const x0 = cx - w / 2, y0 = cy - h / 2, x1 = cx + w / 2, y1 = cy + h / 2
  return `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}` +
    `H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
}

// glyph, on the 24 grid
const PAGE = 'M5 5H19A2 2 0 0 1 21 7V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V7A2 2 0 0 1 5 5Z'
const HEADER = 'M3 10H21'
const RINGS = 'M8 3V7M16 3V7'
const W = 3.5, H = 2.75, R = 0.75
const DAYS = [[7.25, 13.5], [12, 13.5], [7.25, 17.5], [12, 17.5], [16.75, 17.5]].map(([x, y]) => cell(x, y, W, H, R)).join('')
const TODAY = cell(16.75, 13.5, W, H, R)

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
    out.push(['path', { d: M(PAGE, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(RINGS, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // the page: the house duotone mass under a deep outline, with its header rule
  out.push(['path', { d: M(PAGE), fill: col('shine') }])
  out.push(['path', { d: M(PAGE), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(PAGE + HEADER), stroke: col('shadow'), 'stroke-width': T.SW }])
  // binder rings: the A plate, colour over a deep underline
  out.push(['path', { d: M(RINGS), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(RINGS), stroke: col('c1'), 'stroke-opacity': 0.72, 'stroke-width': T.SW, class: 'wm-a' }])
  // the days: solid cells in the A colour over the deep shade; today in the accent
  out.push(['path', { d: M(DAYS), fill: col('shadow'), class: 'wm-a' }])
  out.push(['path', { d: M(DAYS), fill: col('c1'), 'fill-opacity': 0.72, class: 'wm-a' }])
  out.push(['path', { d: M(TODAY), fill: col('ink'), class: 'wm-a' }])
  out.push(['path', { d: M(TODAY), fill: col('accent'), 'fill-opacity': 0.88, class: 'wm-a' }])
  return out
}
