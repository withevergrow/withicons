// forge/hand/bento/wheat.mjs — an ear of wheat: three rows of plump kernels spaced so each shows its own pale interior,
// a short deep awn at the top and a clear run of deep stalk below the ear, so the ear-on-stalk silhouette stays light
// and reads at 16px; the generated glyph's narrow kernels and pale violet stalk shrank to a stick. House tile, duotone.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'wheat'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * T.S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const n2 = v => +v.toFixed(2)

// a kernel: a plump grain from the stalk point (12 + side * GAP, y) leaning up and out at ANG, LEN long, W wide
const LEN = 6, W = 3.6, GAP = 1, ANG = 26 * Math.PI / 180
function kernel(y, side) {
  const ux = side * Math.cos(ANG), uy = -Math.sin(ANG)        // along the grain
  const px = -uy * side, py = ux * side                        // across it (sign flips with the side; the shape is symmetric)
  const P = (u, v) => `${n2(12 + side * GAP + u * ux + v * px)} ${n2(y + u * uy + v * py)}`
  const h = W / 2 / 0.75                                       // cubic control offset that bulges to W / 2
  return `M${P(0, 0)}C${P(LEN * 0.05, h)} ${P(LEN * 0.92, h)} ${P(LEN, 0)}` +
    `C${P(LEN * 0.92, -h)} ${P(LEN * 0.05, -h)} ${P(0, 0)}Z`
}
const ROWS = [6.5, 11.75, 17]
const STALK = 'M12 22V2'
const EAR = ROWS.map(y => kernel(y, -1) + kernel(y, 1)).join('')

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(3.5), 0, Y(18), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(EAR, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(STALK, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // the stalk and its awn, behind the ear
  out.push(['path', { d: M(STALK), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  // the kernels, top row first, so a lower kernel overlaps the one above where they touch
  for (const y of ROWS) {
    const d = M(kernel(y, -1) + kernel(y, 1))
    out.push(['path', { d, fill: col('shine') }])
    out.push(['path', { d, fill: url(2) }])
    out.push(['path', { d, stroke: col('shadow'), 'stroke-width': T.SW }])
  }
  return out
}
