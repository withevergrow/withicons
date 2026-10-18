// forge/hand/bento/warehouse.mjs: a wide, low-gabled depot with a big ribbed roller door and a clerestory slot; the
// generated tile was a tall pentagon with a two-pane door that read as a house or garage at 16px.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'warehouse'
const r2 = v => +v.toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const id = n => `wg-bento-${NAME}-${n}`, url = n => `url(#${id(n)})`
// skeleton coordinates (24 grid) -> the glyph area of the tile, exactly as the generated bento glyphs
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const J = (ds, dy = 0) => ds.map(d => M(d, dy)).join('')
const cls = c => (c ? { class: c } : {})

function tile() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  return [
    ['defs', {}, [
      lin(id(0), 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(id(1), T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(id(2), 0, r2(T.CY - 7 * T.S), 0, r2(T.CY + 9 * T.S), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
}
function shadow(masses, lines) {
  const out = []
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: J(masses, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: J(lines, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  return out
}

// geometry (skeleton units: 2u strokes)
const BODY = 'M3 21V10.5L12 5.5L21 10.5V21Z'
const DOOR = 'M6.5 21V14A1 1 0 0 1 7.5 13H16.5A1 1 0 0 1 17.5 14V21'
const SLATS = 'M6.5 15.75H17.5M6.5 18.5H17.5'
const VENT = 'M10 9.25H14A.75.75 0 0 1 14.75 10A.75.75 0 0 1 14 10.75H10A.75.75 0 0 1 9.25 10A.75.75 0 0 1 10 9.25Z'

export default function render() {
  return [
    ...tile(),
    ...shadow([BODY], [BODY, DOOR]),
    // the building: the house duotone mass
    ['path', { d: M(BODY), fill: col('shine') }],
    ['path', { d: M(BODY), fill: url(2) }],
    // clerestory slot under the ridge: a lit pane
    ['path', { d: M(VENT), fill: col('shine'), 'fill-opacity': 0.9 }],
    ['path', { d: M(VENT), stroke: col('shadow'), 'stroke-width': 0.55 }],
    // roller door: a deeper A mass with ribbed slats (the part that eases up and down)
    ['path', { d: M(DOOR + 'Z'), fill: col('shine'), class: 'wm-a' }],
    ['path', { d: M(DOOR + 'Z'), fill: col('c1'), 'fill-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: M(SLATS), stroke: col('shadow'), 'stroke-width': 0.6, 'stroke-linecap': 'butt', class: 'wm-a' }],
    // lines: the building in the deep shade, the door frame dark under its colour
    ['path', { d: M(BODY), stroke: col('shadow'), 'stroke-width': T.SW }],
    ['path', { d: M(DOOR), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }],
    ['path', { d: M(DOOR), stroke: col('c1'), 'stroke-opacity': 0.55, 'stroke-width': T.SW, ...cls('wm-a') }],
  ]
}
