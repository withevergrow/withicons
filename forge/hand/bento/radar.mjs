// forge/hand/bento/radar.mjs — a radar scope: a pale duotone disc with one range ring, a deep sweep wedge with a sharp
// leading edge from the hub and a bright accent blip inside the sweep, so it reads as radar (not a clock or a gauge)
// at 16px. The generated glyph had a white sliver of a wedge and two thin hands. Tile, shadow and duotone as the house.
const NAME = 'radar'
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

// glyph, on the 24 grid
const DISC = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
const RING = 'M17.25 12A5.25 5.25 0 1 1 6.75 12A5.25 5.25 0 1 1 17.25 12Z'
const WEDGE = 'M12 12L17.66 6.34A8 8 0 0 0 9.93 4.27Z'
const EDGE = 'M12 12L18.36 5.64'
const HUB = 'M13.25 12A1.25 1.25 0 1 1 10.75 12A1.25 1.25 0 1 1 13.25 12Z'
const BLIP = 'M13.8 6.5A1.3 1.3 0 1 1 11.2 6.5A1.3 1.3 0 1 1 13.8 6.5Z'
const BLIP2 = 'M8.5 16.25A1 1 0 1 1 6.5 16.25A1 1 0 1 1 8.5 16.25Z'

export default function render() {
  const out = tile()
  shadow(out, DISC)
  out.push(['path', { d: M(DISC), fill: col('shine') }])
  out.push(['path', { d: M(DISC), fill: `url(#${id(2)})` }])
  // the sweep: a deep wedge trailing the leading edge (A pings from the centre)
  out.push(['path', { d: M(WEDGE), fill: col('c1'), 'fill-opacity': 0.8, class: 'wm-a' }])
  out.push(['path', { d: M(RING), stroke: col('c1'), 'stroke-width': T.SW * 0.8, 'stroke-opacity': 0.75, class: 'wm-a' }])
  out.push(['path', { d: M(DISC + EDGE + HUB), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(HUB), fill: col('shadow') }])
  out.push(['path', { d: M(BLIP2), fill: col('c1'), 'fill-opacity': 0.8, class: 'wm-a' }])
  out.push(['path', { d: M(BLIP), fill: col('accent'), class: 'wm-a' }])
  return out
}
