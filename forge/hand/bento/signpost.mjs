// forge/hand/bento/signpost.mjs: a fingerpost with two arrow boards pointing opposite ways, slimmer boards with a wider
// gap and sharper tips, the upper board pale and the lower one deeper so the two arms stay apart at 16px.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'signpost'
const r2 = v => +v.toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const id = n => `wg-bento-${NAME}-${n}`, url = n => `url(#${id(n)})`
// skeleton coordinates (24 grid) -> the glyph area of the tile, exactly as the generated bento glyphs
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const J = (ds, dy = 0) => ds.map(d => M(d, dy)).join('')

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
const TOP = 'M6.5 3H16.5L19.5 5.25L16.5 7.5H6.5A1 1 0 0 1 5.5 6.5V4A1 1 0 0 1 6.5 3Z'
const LOW = 'M17.5 12H7.5L4.5 14.25L7.5 16.5H17.5A1 1 0 0 0 18.5 15.5V13A1 1 0 0 0 17.5 12Z'
const POST = 'M12 7.5V12M12 16.5V21.5'
const BASE = 'M9 21.5H15'

export default function render() {
  return [
    ...tile(),
    ...shadow([TOP, LOW], [TOP, LOW, POST, BASE]),
    // the post and its foot, behind the boards
    ['path', { d: M(POST + BASE), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }],
    ['path', { d: M(POST + BASE), stroke: col('c1'), 'stroke-opacity': 0.55, 'stroke-width': T.SW, class: 'wm-a' }],
    // upper board: the pale house duotone; lower board: a deeper tone so the arms read as two
    ['path', { d: M(TOP), fill: col('shine') }],
    ['path', { d: M(TOP), fill: url(2) }],
    ['path', { d: M(LOW), fill: col('shine') }],
    ['path', { d: M(LOW), fill: col('c1'), 'fill-opacity': 0.55 }],
    ['path', { d: M(TOP + LOW), stroke: col('shadow'), 'stroke-width': T.SW }],
  ]
}
