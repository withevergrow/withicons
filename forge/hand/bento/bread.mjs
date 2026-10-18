// forge/hand/bento/bread.mjs — a domed loaf whose three score cuts are drawn in the deep outline ink (the generated
// glyph painted them in a pale violet that faded into the loaf at 24 and 16px), on a slightly toastier crust tone with
// a soft lit shoulder. Drawn on the 24 grid and placed with the house glyph scale, tile, shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'bread'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * T.S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid
const LOAF = 'M4.5 20H19.5A2 2 0 0 0 21.5 18V13.5C21.5 8 17.5 4.5 12 4.5C6.5 4.5 2.5 8 2.5 13.5V18A2 2 0 0 0 4.5 20Z'
const CUTS = 'M6.5 14.25L8.75 10.25M10.88 13.75L13.13 9.75M15.25 14.25L17.5 10.25'
const LIT = 'M5.5 10.75C6.25 8.5 8.25 7 10.5 6.75'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(4.5), 0, Y(20), [stop(0, 'c1', 0.32), stop(1, 'c1', 0.6)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(LOAF, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the loaf: the house duotone mass, a touch toastier, under the deep outline
  out.push(['path', { d: M(LOAF), fill: col('shine') }])
  out.push(['path', { d: M(LOAF), fill: url(2) }])
  out.push(['path', { d: M(LIT), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.55, class: 'wm-shine' }])
  out.push(['path', { d: M(LOAF), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the score cuts: full-strength deep strokes so they hold at 16px
  out.push(['path', { d: M(CUTS), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  return out
}
