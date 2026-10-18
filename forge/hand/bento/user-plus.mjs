// forge/hand/bento/user-plus.mjs — the person bust in the house duotone beside a solid accent badge with a white plus,
// so the "add" modifier pops off the pale tile (the generated glyph had a thin pale-pink plus that vanished at 16px).
// The badge (r 3.5 at 19,10.5, on the motion S origin) stays smaller than the head and >= 2.7u clear of it.
// Drawn on the 24 grid and placed with the house glyph scale, tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'user-plus'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], -0.15, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const dot = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

// glyph, on the 24 grid
const HEAD = dot(8.5, 7.5, 3.75)
const BODY_F = 'M2 21V19.5A4.5 4.5 0 0 1 6.5 15H10.5A4.5 4.5 0 0 1 15 19.5V21Z'
const BODY_S = 'M2 21V19.5A4.5 4.5 0 0 1 6.5 15H10.5A4.5 4.5 0 0 1 15 19.5V21'
const BADGE = dot(19, 10.5, 3.5)
const PLUS = 'M19 9V12M17.5 10.5H20.5'

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
  // soft drop shadow, then a tight contact shadow (person and badge)
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(HEAD + BODY_F, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(BADGE, dy), fill: col('shadow'), opacity: op * 1.6, class: 'wm-shadow' }])
  }
  // the person: the house duotone mass under a deep outline
  const P = M(HEAD + BODY_F)
  out.push(['path', { d: P, fill: col('shine') }])
  out.push(['path', { d: P, fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(HEAD + BODY_S), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the badge: a solid accent disc (accent over the ink, so a pale accent still holds the white plus)
  out.push(['path', { d: M(BADGE), fill: col('ink'), class: 'wm-s' }])
  out.push(['path', { d: M(BADGE), fill: col('accent'), 'fill-opacity': 0.88, class: 'wm-s' }])
  out.push(['path', { d: M(PLUS), stroke: col('shine'), 'stroke-width': 1.15, class: 'wm-s' }])
  return out
}
