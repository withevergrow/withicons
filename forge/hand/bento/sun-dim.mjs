// forge/hand/bento/sun-dim.mjs — a full, lit sun core ringed by eight short round rays set well clear of it: the
// generated glyph had a small core and stub rays only 0.6 units long that read as a dotted smudge around a dot.
// The rays stay short and soft (that is what makes it the dim sun), the core carries the icon.
// Drawn on the 24 grid and placed with the house glyph scale, tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'sun-dim'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid
const CORE = 'M16.5 12A4.5 4.5 0 1 1 7.5 12A4.5 4.5 0 1 1 16.5 12Z'
const RAYS = 'M12 4.5V3.75M17.3 6.7L17.83 6.17M19.5 12H20.25M17.3 17.3L17.83 17.83M12 19.5V20.25M6.7 17.3L6.17 17.83M4.5 12H3.75M6.7 6.7L6.17 6.17'
const GLARE = 'M9.6 10.6A2.75 2.75 0 0 1 11.1 9.3'

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
    out.push(['path', { d: M(CORE, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(RAYS, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // the core: the house duotone mass with a small glare, under a deep outline
  out.push(['path', { d: M(CORE), fill: col('shine') }])
  out.push(['path', { d: M(CORE), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(GLARE), stroke: col('shine'), 'stroke-opacity': 0.9, 'stroke-width': 0.6, class: 'wm-shine' }])
  out.push(['path', { d: M(CORE), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the rays: short and soft, c1 over a deep underline (the A plate)
  out.push(['path', { d: M(RAYS), stroke: col('shadow'), 'stroke-width': T.SW + 0.15, class: 'wm-a' }])
  out.push(['path', { d: M(RAYS), stroke: col('c1'), 'stroke-opacity': 0.72, 'stroke-width': T.SW + 0.15, class: 'wm-a' }])
  return out
}
