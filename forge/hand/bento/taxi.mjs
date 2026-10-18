// forge/hand/bento/taxi.mjs: a cab in profile with a big solid roof sign, a checker band along its flank, split lit
// windows and dark tyres; the generated tile was a pale generic car whose tiny roof box vanished at 16px.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'taxi'
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
const OUT = 'M5 18.5H4A1.5 1.5 0 0 1 2.5 17V14A2 2 0 0 1 4.5 12H5.75L8 7H15L18.25 12H19.5A2 2 0 0 1 21.5 14V17A1.5 1.5 0 0 1 20 18.5H19M9.5 18.5H14.5'
const BODY = 'M5 18.5H4A1.5 1.5 0 0 1 2.5 17V14A2 2 0 0 1 4.5 12H5.75L8 7H15L18.25 12H19.5A2 2 0 0 1 21.5 14V17A1.5 1.5 0 0 1 20 18.5H19A2.25 2.25 0 0 0 14.5 18.5H9.5A2.25 2.25 0 0 0 5 18.5Z'
const SIGN = 'M9.5 3.5H13.5A1 1 0 0 1 14.5 4.5V7H8.5V4.5A1 1 0 0 1 9.5 3.5Z'
const BELT = 'M5.75 12H18.25'
const PANES = 'M8.65 8H11V11.5H7.1ZM12 8H14.45L16.7 11.5H12Z'
const CHECK = Array.from({ length: 12 }, (_, i) => `M${4.25 + i * 1.25} ${i % 2 ? 13.25 : 14.5}h1.25v1.25h-1.25Z`).join('')
const WHEELS = 'M9.5 18.5A2.25 2.25 0 1 1 5 18.5A2.25 2.25 0 1 1 9.5 18.5ZM19 18.5A2.25 2.25 0 1 1 14.5 18.5A2.25 2.25 0 1 1 19 18.5Z'
const HUBS = 'M8.1 18.5A.85 .85 0 1 1 6.4 18.5A.85 .85 0 1 1 8.1 18.5ZM17.6 18.5A.85 .85 0 1 1 15.9 18.5A.85 .85 0 1 1 17.6 18.5Z'

export default function render() {
  return [
    ...tile(),
    ...shadow([BODY, SIGN, WHEELS], [OUT, SIGN, WHEELS]),
    // the cab: a strong body colour (the palette's c1: yellow in the cab palettes)
    ['path', { d: M(BODY), fill: col('shine') }],
    ['path', { d: M(BODY), fill: col('c1'), 'fill-opacity': 0.55 }],
    ['path', { d: M(PANES), fill: col('shine'), 'fill-opacity': 0.92 }],
    ['path', { d: M(CHECK), fill: col('shadow'), 'fill-opacity': 0.9 }],
    // the roof sign: solid, the brightest cue
    ['path', { d: M(SIGN), fill: col('c1'), class: 'wm-a' }],
    ['path', { d: M('M10.25 5.25H12.75'), stroke: col('shine'), 'stroke-width': 0.6, class: 'wm-a' }],
    // tyres with lit hubs
    ['path', { d: M(WHEELS), fill: col('shadow') }],
    ['path', { d: M(HUBS), fill: col('shine'), 'fill-opacity': 0.9 }],
    // lines
    ['path', { d: M(OUT + WHEELS), stroke: col('shadow'), 'stroke-width': T.SW }],
    ['path', { d: M(SIGN + BELT), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }],
  ]
}
