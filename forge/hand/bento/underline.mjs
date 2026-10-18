// forge/hand/bento/underline.mjs — a bold U letterform in the house duotone (like bento's bold B) over a solid
// rounded underline bar, so the glyph fills the tile and the bar holds at 16px (the generated thin U and hairline bar
// shrank to a pale mark inside the tile). Drawn on the 24 grid and placed with the house scale, tile and shadow.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'underline'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid: a U with 3u stems and a round bowl, and a 2.5u bar beneath it
const U = 'M6 4H9V10A3 3 0 0 0 15 10V4H18V10A6 6 0 0 1 6 10Z'
const BAR = 'M5.25 18.75H18.75A1.25 1.25 0 0 1 18.75 21.25H5.25A1.25 1.25 0 0 1 5.25 18.75Z'

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
    out.push(['path', { d: M(U, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(BAR, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': w, opacity: op, class: 'wm-shadow' }])
  }
  // the letter: the house duotone mass under a deep outline
  out.push(['path', { d: M(U), fill: col('shine') }])
  out.push(['path', { d: M(U), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(U), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the underline: a solid bar, the A colour over the deep shade
  out.push(['path', { d: M(BAR), fill: col('shadow'), class: 'wm-a' }])
  out.push(['path', { d: M(BAR), fill: col('c1'), 'fill-opacity': 0.72, class: 'wm-a' }])
  return out
}
