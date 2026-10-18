// forge/hand/bento/chart-bar.mjs — three bars (low, tall, middle) joined into one stepped silhouette with deep dividers
// and a baseline underneath, enlarged to fill the tile (the generated bars were thin and tiny in the big tile).
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'chart-bar'
const S = 0.8
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

const BARS = 'M4.5 20.5V13.5A1.5 1.5 0 0 1 6 12H9.5V5.5A1.5 1.5 0 0 1 11 4H13A1.5 1.5 0 0 1 14.5 5.5V8.5H18A1.5 1.5 0 0 1 19.5 10V20.5Z'
const DIVS = 'M9.5 12V20.5M14.5 8.5V20.5'
const BASE = 'M2.5 20.5H21.5'
const LIT = 'M11 6.6V10.2'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(4), 0, Y(20.5), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.58)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(BARS, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(BASE, dy), stroke: col('shadow'), 'stroke-opacity': op, 'stroke-width': T.SW + w, class: 'wm-shadow' }])
  }
  out.push(['path', { d: M(BARS), fill: col('shine') }])
  out.push(['path', { d: M(BARS), fill: url(2) }])
  out.push(['path', { d: M(LIT), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.55, class: 'wm-shine' }])
  out.push(['path', { d: M(BARS) + M(DIVS), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(BASE), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(BASE), stroke: col('c1'), 'stroke-opacity': 0.72, 'stroke-width': T.SW, class: 'wm-a' }])
  return out
}
