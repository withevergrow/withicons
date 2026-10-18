// forge/hand/bento/lightbulb-off.mjs — the line design's struck-through bulb enlarged to fill the tile (about 15.5u tall):
// the glass and the screw base split by a wide diagonal gap, a bold accent slash through it and a thread line on the
// base. Skeleton geometry (arcs stay exact) at 0.82 scale instead of the tiny house 0.59, so the bulb and the slash
// read at 16-24px. House tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'lightbulb-off'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, 0.82, [12, 11.5], 0, 0.1 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// skeleton geometry (the line design), scaled by M
const GLASS_A = 'M7.14 3.96A7 7 0 0 1 19 9C19 10.9 17.63 12.21 16.49 13.31L7.14 3.96Z'
const GLASS_B = 'M12.32 15.5L9 15.5C9 13.75 5 12.25 5 9A7 7 0 0 1 5.04 8.23L12.32 15.5Z'
const BASE = 'M15 18.18L15 19A2 2 0 0 1 13 21L11 21A2 2 0 0 1 9 19L9 15.5L12.32 15.5L15 18.18Z'
const OUT_GLASS = 'M10.9 15.5L9 15.5C9 13.87 5.54 12.46 5.05 9.65M7.91 3.32A7 7 0 0 1 19 9C19 10.51 18.13 11.65 17.2 12.61'
const OUT_BASE = 'M9 15.5L9 19A2 2 0 0 0 11 21L13 21A2 2 0 0 0 14.93 19.53'
const THREAD = 'M9 18.25H14.75'
const SLASH = 'M3 3L21 21'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 4, 0, 19.5, [stop(0, 'c1', 0.34), stop(1, 'c1', 0.62)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(GLASS_A + GLASS_B + BASE, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // glass and base: the house duotone mass under a deep outline
  for (const d of [GLASS_A + GLASS_B, BASE]) {
    out.push(['path', { d: M(d), fill: col('shine') }])
    out.push(['path', { d: M(d), fill: url(2) }])
  }
  out.push(['path', { d: M(OUT_GLASS + OUT_BASE + THREAD), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the slash (the S plate): bold accent
  out.push(['path', { d: M(SLASH), stroke: col('accent'), 'stroke-width': 1.7, class: 'wm-s' }])
  return out
}
