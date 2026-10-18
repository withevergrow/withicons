// forge/hand/bento/bot-off.mjs: the bento bot robot (same mid-blue vertical pill eyes, no mouth) with a deeper head mass and a lit
// antenna bulb, struck through by the accent slash in a clean outline gap; eyes sit at x 8 and 16 with the skeleton's
// vertical offset so they clear the head walls and the slash at every size.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'bot-off'
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
const HEAD = 'M10.5 8H16A3 3 0 0 1 19 11V16.5M6.15 8.65A3 3 0 0 0 5 11V17.5A3 3 0 0 0 8 20.5H16A3 3 0 0 0 17.55 20.05'
const HEADM = 'M10.5 8H16A3 3 0 0 1 19 11V16.5ZM6.15 8.65A3 3 0 0 0 5 11V17.5A3 3 0 0 0 8 20.5H16A3 3 0 0 0 17.55 20.05Z'
const BULB = 'M13.25 3.5A1.25 1.25 0 1 1 10.75 3.5A1.25 1.25 0 1 1 13.25 3.5Z'
const PARTS = 'M12 8V4.75M2 12.5V16M22 12.5V16'
const EYES = 'M8 12.5V14M16 10V11.5'   // vertical pills, as bento bot (stroked, a touch narrower than T.SW)
const EW = 0.95
const SLASH = 'M3 3L21 21'

export default function render() {
  return [
    ...tile(),
    ...shadow([HEADM], [HEAD, BULB, PARTS, EYES, SLASH]),
    // the head: a fuller mass (deeper than the house duotone, so the robot holds its own against the slash)
    ['path', { d: M(HEADM), fill: col('shine') }],
    ['path', { d: M(HEADM), fill: col('c1'), 'fill-opacity': 0.5 }],
    // antenna bulb: a solid knob
    ['path', { d: M(BULB), fill: col('c1'), class: 'wm-a' }],
    // lines
    ['path', { d: M(HEAD), stroke: col('shadow'), 'stroke-width': T.SW }],
    ['path', { d: M(PARTS + BULB), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }],
    ['path', { d: M(PARTS + BULB), stroke: col('c1'), 'stroke-opacity': 0.55, 'stroke-width': T.SW, class: 'wm-a' }],
    // face: bot's eyes (shadow core under the c1 overlay), no mouth
    ['path', { d: M(EYES), stroke: col('shadow'), 'stroke-width': EW, class: 'wm-a' }],
    ['path', { d: M(EYES), stroke: col('c1'), 'stroke-opacity': 0.72, 'stroke-width': EW, class: 'wm-a' }],
    // the slash: accent over an ink underline
    ['path', { d: M(SLASH), stroke: col('ink'), 'stroke-width': T.SW, class: 'wm-s' }],
    ['path', { d: M(SLASH), stroke: col('accent'), 'stroke-opacity': 0.8, 'stroke-width': T.SW, class: 'wm-s' }],
  ]
}
