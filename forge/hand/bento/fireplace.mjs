// forge/hand/bento/fireplace.mjs — a fireplace with a thick deep mantel shelf, a pale surround and a dark arched hearth
// holding one big warm flame on a log, so the opening and the fire carry the icon at 16px (the generated glyph had a
// hairline mantel and a white opening with a tiny flame that vanished on the pale tile). On the 24 grid, placed with
// the house glyph scale, tile, drop shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'fireplace'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid
const SURROUND = 'M4.5 7.5H19.5V21H4.5Z'
const MANTEL = 'M3.75 4H20.25A1.5 1.5 0 0 1 21.75 5.5V6A1.5 1.5 0 0 1 20.25 7.5H3.75A1.5 1.5 0 0 1 2.25 6V5.5A1.5 1.5 0 0 1 3.75 4Z'
const HEARTH = 'M7.5 21V15.5A4.5 4.5 0 0 1 16.5 15.5V21Z'
const FLAME = 'M12 19.75C10.1 19.75 9.2 18.4 9.6 16.9C10 15.4 11.4 14.6 12 12.75C12.6 14.6 14 15.4 14.4 16.9C14.8 18.4 13.9 19.75 12 19.75Z'
const CORE = 'M12 19.25C11.1 19.25 10.75 18.6 10.95 17.9C11.15 17.2 11.75 16.8 12 16C12.25 16.8 12.85 17.2 13.05 17.9C13.25 18.6 12.9 19.25 12 19.25Z'
const LOG = 'M9.5 20.4H14.5'
const FLOOR = 'M2.5 21H21.5'

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
    out.push(['path', { d: M(SURROUND + MANTEL, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(FLOOR, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // the surround: the house duotone mass
  out.push(['path', { d: M(SURROUND), fill: col('shine') }])
  out.push(['path', { d: M(SURROUND), fill: `url(#${id(2)})` }])
  // the hearth: a dark arched opening
  out.push(['path', { d: M(HEARTH), fill: col('shadow') }])
  out.push(['path', { d: M(HEARTH), fill: col('ink'), 'fill-opacity': 0.35 }])
  // outlines of the surround, hearth and floor
  out.push(['path', { d: M(SURROUND + HEARTH + FLOOR), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the mantel shelf: a solid deeper bar over the surround
  out.push(['path', { d: M(MANTEL), fill: col('shine') }])
  out.push(['path', { d: M(MANTEL), fill: col('c1'), 'fill-opacity': 0.62 }])
  out.push(['path', { d: M(MANTEL), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the fire: one warm flame with a lit core on a log (the A part flickers about its base)
  out.push(['path', { d: M(LOG), stroke: col('c1'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(FLAME), fill: col('accent'), class: 'wm-a' }])
  out.push(['path', { d: M(CORE), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-a' }])
  return out
}
