// forge/hand/bento/passport.mjs: a passport booklet with a deep binding band down its spine and a lit globe emblem
// (equator + meridian) over a name line; the generated tile was a plain rounded slab with a minus-in-a-circle that read
// as a phone or a no-entry card.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'passport'
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
const COVER = 'M7 2.5H17A2 2 0 0 1 19 4.5V19.5A2 2 0 0 1 17 21.5H7A2 2 0 0 1 5 19.5V4.5A2 2 0 0 1 7 2.5Z'
const BAND = 'M8 2.5V21.5H7A2 2 0 0 1 5 19.5V4.5A2 2 0 0 1 7 2.5Z'
const SPINE = 'M8 2.5V21.5'
const GLOBE = 'M17 10A3.5 3.5 0 1 1 10 10A3.5 3.5 0 1 1 17 10Z'
const GRID = 'M10 10H17M13.5 6.5A1.5 3.5 0 0 1 13.5 13.5A1.5 3.5 0 0 1 13.5 6.5Z'
const LINE = 'M11 17.5H16'

export default function render() {
  return [
    ...tile(),
    ...shadow([COVER], [COVER, LINE]),
    // the cover: the house duotone mass, with a deep binding band down the spine
    ['path', { d: M(COVER), fill: col('shine') }],
    ['path', { d: M(COVER), fill: url(2) }],
    ['path', { d: M(BAND), fill: col('c1'), 'fill-opacity': 0.75 }],
    ['path', { d: M(SPINE), stroke: col('shadow'), 'stroke-width': 0.6 }],
    // the globe emblem: a lit pane with a fine equator and meridian
    ['path', { d: M(GLOBE), fill: col('shine'), 'fill-opacity': 0.92, class: 'wm-a' }],
    ['path', { d: M(GRID), stroke: col('shadow'), 'stroke-width': 0.6, class: 'wm-a' }],
    // lines
    ['path', { d: M(COVER), stroke: col('shadow'), 'stroke-width': T.SW }],
    ['path', { d: M(GLOBE + LINE), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }],
    ['path', { d: M(GLOBE + LINE), stroke: col('c1'), 'stroke-opacity': 0.55, 'stroke-width': T.SW, class: 'wm-a' }],
  ]
}
