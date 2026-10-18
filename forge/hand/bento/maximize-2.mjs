// forge/hand/bento/maximize-2.mjs — two diagonal arrows pushed out to the corners, drawn a step heavier and all in the
// deep shade with roomy heads, so they hold contrast on the pale tile: the generated arrows were thin, their heads
// in pale c1, and they read as faint scratches at 16px. Shafts stop short so the centre stays open.
// Drawn on the 24 grid and placed with the house glyph scale, tile and shadow recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'maximize-2'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid
const SHAFTS = 'M4 4L10 10M20 20L14 14'
const HEADS = 'M10.5 4H4V10.5M13.5 20H20V13.5'
const SW = T.SW + 0.15

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  // soft drop shadow, then a tight contact shadow
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(SHAFTS, dy) + M(HEADS, dy), stroke: col('shadow'), 'stroke-width': SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // shafts in the deep shade; heads deep too, with a c1 sheen so the duotone still shows
  out.push(['path', { d: M(SHAFTS), stroke: col('shadow'), 'stroke-width': SW }])
  out.push(['path', { d: M(HEADS), stroke: col('shadow'), 'stroke-width': SW, class: 'wm-a' }])
  out.push(['path', { d: M(HEADS), stroke: col('c1'), 'stroke-opacity': 0.35, 'stroke-width': SW, class: 'wm-a' }])
  return out
}
