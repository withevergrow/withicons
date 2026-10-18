// forge/hand/bento/croissant.mjs — a full crescent in three bold segments: a pale centre lobe between two deep seams
// and one solid horn on each side in the deeper tone, with the horn tips curling down and in so the shape reads as a
// croissant, not a crown (the generated glyph's pale seams collapsed into one hump). House glyph scale, tile, shadow.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'croissant'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * T.S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// glyph, on the 24 grid: centre lobe (dome over 7.5..16.5, top at y 6.5), two fat horns curling down to tips at y 19.75, inner curve
// rising to y 15.5 at the centre (belly 10u thick)
const BODY = 'M4.25 19.75C2 16.75 2.75 11 7.5 10.25A4.5 3.75 0 0 1 16.5 10.25C21.25 11 22 16.75 19.75 19.75' +
  'Q12 11.25 4.25 19.75Z'
// the horns: outline from the notch, down the outer edge to the tip, back along the inner curve, up the seam
const HORNS = 'M7.5 10.25C2.75 11 2 16.75 4.25 19.75Q6.75 17 9.25 16Q8.25 13.25 7.5 10.25Z' +
  'M16.5 10.25C21.25 11 22 16.75 19.75 19.75Q17.25 17 14.75 16Q15.75 13.25 16.5 10.25Z'
const SEAMS = 'M7.5 10.25Q8.25 13.25 9.25 16M16.5 10.25Q15.75 13.25 14.75 16'
const LIT = 'M9.75 9C10.25 8.25 11 8 12 8'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(5), 0, Y(19.75), [stop(0, 'c1', 0.26), stop(1, 'c1', 0.5)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(BODY, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the crescent: house duotone, then both horns a step deeper
  out.push(['path', { d: M(BODY), fill: col('shine') }])
  out.push(['path', { d: M(BODY), fill: url(2) }])
  out.push(['path', { d: M(HORNS), fill: col('c1'), 'fill-opacity': 0.42 }])
  out.push(['path', { d: M(LIT), stroke: col('shine'), 'stroke-opacity': 0.9, 'stroke-width': 0.55, class: 'wm-shine' }])
  out.push(['path', { d: M(BODY), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the two seams around the centre lobe: full deep strokes, outline to inner curve
  out.push(['path', { d: M(SEAMS), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  return out
}
