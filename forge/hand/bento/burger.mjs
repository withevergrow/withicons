// forge/hand/bento/burger.mjs — a burger scaled up to fill the tile (about 16u wide): a domed bun with sesame dashes,
// a solid deep patty that overhangs both buns (the strongest contrast in the glyph) and a rounded base bun, with wider
// gaps between the three layers so the stack still reads at 16px. House tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'burger'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid
const BUN = 'M4 9.75A8 5.5 0 0 1 20 9.75Z'
const PATTY = 'M4.75 12H19.25A1.25 1.25 0 0 1 19.25 14.5H4.75A1.25 1.25 0 0 1 4.75 12Z'
const BASE = 'M4 17H20V17.75A2.25 2.25 0 0 1 17.75 20H6.25A2.25 2.25 0 0 1 4 17.75Z'
const SEEDS = 'M8.5 8.2L9.5 7.5M14.5 7.5L15.5 8.2M11.5 6.5H12.5'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 4.25, 0, 20, [stop(0, 'c1', 0.36), stop(1, 'c1', 0.62)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  // soft drop shadow, then a tight contact shadow (the glyph offset down)
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: mapPath(BUN + PATTY + BASE, 1, [12, 12], 0, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // buns: the house duotone mass
  for (const d of [BUN, BASE]) {
    out.push(['path', { d, fill: col('shine') }])
    out.push(['path', { d, fill: url(2) }])
  }
  // the patty (the A plate): solid deep, a highlight along its top
  out.push(['path', { d: PATTY, fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: 'M6.5 12.9H9', stroke: col('shine'), 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-shine' }])
  // outlines and sesame
  out.push(['path', { d: BUN + BASE, stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: SEEDS, stroke: col('shadow'), 'stroke-width': 0.9 }])
  return out
}

