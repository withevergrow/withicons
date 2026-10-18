// forge/hand/bento/hand-coins.mjs — an open hand (sleeve cuff, filled palm, a clear thumb crease, cupped fingers)
// under a flat stack of two coins told apart by tone, so it reads as a hand offering money at 16px (the generated
// outline-only hand under a tall coin stack read as a generic tray). Drawn on the 24 grid with the house recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'hand-coins'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0.35, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid
const CUFF = 'M2.75 12.25H3.25A1 1 0 0 1 4.25 13.25V20.75A1 1 0 0 1 3.25 21.75H2.75A1 1 0 0 1 1.75 20.75V13.25A1 1 0 0 1 2.75 12.25Z'
const HAND_F = 'M6 13H10.75A2 2 0 0 1 12.7 14.55L17.9 13.35A1.9 1.9 0 0 1 19.95 16.45L13.9 20.6A2.25 2.25 0 0 1 12.6 21H6Z'
const HAND_S = 'M6 13H10.75A2 2 0 0 1 12.7 14.55L17.9 13.35A1.9 1.9 0 0 1 19.95 16.45L13.9 20.6A2.25 2.25 0 0 1 12.6 21H6'
const THUMB = 'M8.25 17H10.75A2 2 0 0 0 12.65 15.6'
const COIN_F = 'M10.75 3.5A4.25 1.5 0 0 1 19.25 3.5V7.5A4.25 1.5 0 0 1 10.75 7.5Z'
const COIN_LOW = 'M10.75 5.5A4.25 1.5 0 0 0 19.25 5.5V7.5A4.25 1.5 0 0 1 10.75 7.5Z'
const COIN_FACE = 'M19.25 3.5A4.25 1.5 0 1 1 10.75 3.5A4.25 1.5 0 1 1 19.25 3.5Z'
const COIN_S = COIN_FACE + 'M10.75 3.5V7.5A4.25 1.5 0 0 0 19.25 7.5V3.5'

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
    out.push(['path', { d: M(HAND_F + CUFF, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(COIN_F, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the sleeve cuff: a solid bar, the A colour over the deep shade
  out.push(['path', { d: M(CUFF), fill: col('shadow') }])
  out.push(['path', { d: M(CUFF), fill: col('c1'), 'fill-opacity': 0.72 }])
  // the hand: the house duotone mass under a deep outline, with the thumb's crease
  out.push(['path', { d: M(HAND_F), fill: col('shine') }])
  out.push(['path', { d: M(HAND_F), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(HAND_S + THUMB), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the coins (A plate, they float): a pale mass, the lower coin's edge a tone deeper, a lit top face
  out.push(['path', { d: M(COIN_F), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(COIN_F), fill: col('c1'), 'fill-opacity': 0.42, class: 'wm-a' }])
  out.push(['path', { d: M(COIN_LOW), fill: col('c1'), 'fill-opacity': 0.5, class: 'wm-a' }])
  out.push(['path', { d: M(COIN_FACE), fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-a' }])
  out.push(['path', { d: M(COIN_S), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(COIN_S), stroke: col('c1'), 'stroke-opacity': 0.72, 'stroke-width': T.SW, class: 'wm-a' }])
  return out
}
