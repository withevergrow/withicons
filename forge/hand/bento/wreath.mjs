// forge/hand/bento/wreath.mjs — a holiday wreath: a deep evergreen scalloped ring around a clear open centre, three
// accent berries and an accent bow at the bottom, so the hole and the holiday colours read at 16px (the generated glyph
// was a pale ring with a small hole and an outlined bow that read as a gear or a flower). House tile, shadow and line.
const NAME = 'wreath'
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

function tile() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  return [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 7.77, 0, 17.21, [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
}
// soft drop shadow, then a tight contact shadow, under the masses (filled) and the open strokes
function shadow(out, mass, lines = '') {
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(mass, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    if (lines) out.push(['path', { d: M(lines, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
}

// glyph, on the 24 grid (the skeleton's ring, with the centre opened a touch)
const OUTER = 'M19.5 10.5A7.5 7.5 0 1 1 4.5 10.5A7.5 7.5 0 1 1 19.5 10.5Z'
const HOLE = 'M16 10.5A4 4 0 1 1 8 10.5A4 4 0 1 1 16 10.5Z'
const RING = OUTER + HOLE
const BERRIES = 'M7.5 8.5A1.25 1.25 0 1 1 5 8.5A1.25 1.25 0 1 1 7.5 8.5Z' +
  'M16.25 5.5A1.25 1.25 0 1 1 13.75 5.5A1.25 1.25 0 1 1 16.25 5.5Z' +
  'M19 12.5A1.25 1.25 0 1 1 16.5 12.5A1.25 1.25 0 1 1 19 12.5Z'
const LOOPS = 'M11 18C9.25 16.25 5.5 16 5.5 18.75C5.5 21.5 9.25 21.25 11 19.5Z' +
  'M13 18C14.75 16.25 18.5 16 18.5 18.75C18.5 21.5 14.75 21.25 13 19.5Z'
const KNOT = 'M13.4 18.75A1.4 1.4 0 1 1 10.6 18.75A1.4 1.4 0 1 1 13.4 18.75Z'

export default function render() {
  const out = tile()
  shadow(out, RING + LOOPS)
  // the evergreen ring: a deep c1 band, the open centre left as tile
  out.push(['path', { d: M(RING), fill: col('shine'), 'fill-rule': 'evenodd' }])
  out.push(['path', { d: M(RING), fill: col('c1'), 'fill-opacity': 0.78, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: M(OUTER + HOLE), stroke: col('shadow'), 'stroke-width': T.SW }])
    // the bow: accent loops and knot, outlined in the deep line
  out.push(['path', { d: M(LOOPS), fill: col('accent'), class: 'wm-a' }])
  out.push(['path', { d: M(LOOPS + KNOT), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(KNOT), fill: col('accent'), class: 'wm-a' }])
  out.push(['path', { d: M(KNOT), fill: col('shadow'), 'fill-opacity': 0.35, class: 'wm-a' }])
  return out
}
