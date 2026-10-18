// forge/hand/bento/ban.mjs — a prohibition sign that fills the tile: a big ring on the duotone mass and one strong deep
// slash across it (the generated mark was a small pale-on-pale glyph). Larger glyph scale than the house 0.59.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'ban'
const S = 0.78
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

const RING = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
const SLASH = 'M5.7 5.7L18.3 18.3'
const LIT = 'M5.2 9.2C5.9 7.4 7.2 6 8.9 5.2'
const SWD = 1.9

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(2.5), 0, Y(21.5), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(RING, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  out.push(['path', { d: M(RING), fill: col('shine') }])
  out.push(['path', { d: M(RING), fill: url(2) }])
  out.push(['path', { d: M(LIT), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.55, class: 'wm-shine' }])
  out.push(['path', { d: M(RING), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(SLASH, 0.3), stroke: col('shadow'), 'stroke-opacity': 0.12, 'stroke-width': SWD + 0.6, class: 'wm-shadow' }])
  out.push(['path', { d: M(SLASH), stroke: col('shadow'), 'stroke-width': SWD, class: 'wm-a' }])
  return out
}
