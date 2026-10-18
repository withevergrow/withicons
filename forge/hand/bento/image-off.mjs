// forge/hand/bento/image-off.mjs — a crossed-out picture on the bento tile: a heavier split frame, the hill and sun as solid
// c1 masses (no white window) and a bold accent slash running down a clear channel, so it reads on pale tiles at 16px.
import { col, T, squircle } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const N = 'image-off'
const id = n => `wg-bento-${N}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op) => ['stop', { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

// skeleton-space drawing (24 grid), mapped onto the tile
const FRAME = ['M9 4H20A2 2 0 0 1 22 6V17', 'M15 20H4A2 2 0 0 1 2 18V7']
const MASS = 'M9 4H20A2 2 0 0 1 22 6V17ZM15 20H4A2 2 0 0 1 2 18V7Z'
const HILL = 'M2 17L6 13A1.41 1.41 0 0 1 8 13L15 20H4A2 2 0 0 1 2 18Z'
const HILL_EDGE = 'M2 17L6 13A1.41 1.41 0 0 1 8 13L15 20'
const SUN = 'M19 9.25A2 2 0 1 1 15 9.25A2 2 0 1 1 19 9.25Z'
const SLASH = 'M3 3L21 21'
const SW = 1.25, SW_S = 1.4

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 7.6, 0, 17.2, [stop(0, 'c1', 0.24), stop(1, 'c1', 0.42)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  // lift: the glyph offset down in the shadow role, a soft pass and a contact pass
  const all = [...FRAME, HILL_EDGE, SUN, SLASH]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(MASS, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: all.map(d => M(d, dy)).join(''), stroke: col('shadow'), 'stroke-width': SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // the picture: a pale duotone mass in two halves (the channel between them carries the slash)
  out.push(['path', { d: M(MASS), fill: col('shine') }])
  out.push(['path', { d: M(MASS), fill: url(2) }])
  // hill and sun: solid c1 masses, the part that moves
  out.push(['path', { d: M(HILL), fill: col('c1'), 'fill-opacity': 0.62, class: 'wm-a' }])
  out.push(['path', { d: M(SUN), fill: col('shadow'), class: 'wm-a' }])
  out.push(['path', { d: M(SUN), fill: col('c1'), 'fill-opacity': 0.75, class: 'wm-a' }])
  // frame in the deep shade, a touch heavier than the house stroke
  out.push(['path', { d: FRAME.map(d => M(d)).join(''), stroke: col('shadow'), 'stroke-width': SW }])
  out.push(['path', { d: M(HILL_EDGE), stroke: col('shadow'), 'stroke-width': SW, class: 'wm-a' }])
  // the slash: accent over an ink underline, bolder than the frame
  out.push(['path', { d: M(SLASH), stroke: col('ink'), 'stroke-width': SW_S, class: 'wm-s' }])
  out.push(['path', { d: M(SLASH), stroke: col('accent'), 'stroke-opacity': 0.85, 'stroke-width': SW_S, class: 'wm-s' }])
  return out
}
