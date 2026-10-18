// forge/hand/bento/avatar-fox.mjs — a fox mask on the bento tile: a fur-toned face, a white cheek-and-chin band, deep
// inner ears and solid ink eyes and nose, so the fox reads as a fox (the generated glyph was one pale violet mass with
// hairline eyes and ear ticks that vanished at 16px). Skeleton silhouette, house glyph scale, tile and shadow recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'avatar-fox'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

// glyph, on the 24 grid
const HEAD = 'M12 20.5C11 19.5 9.5 18.5 8 17.75L3.5 15.25C4.5 13.75 5 12.25 5 10.75V4.75C5 3.75 5.75 3.5 6.5 4L10 7H14L17.5 4C18.25 3.5 19 3.75 19 4.75V10.75C19 12.25 19.5 13.75 20.5 15.25L16 17.75C14.5 18.5 13 19.5 12 20.5Z'
const MASK = 'M3.5 15.25C6 14 9.25 14.5 12 16.75C14.75 14.5 18 14 20.5 15.25L16 17.75C14.5 18.5 13 19.5 12 20.5C11 19.5 9.5 18.5 8 17.75Z'
const EARS = 'M6.5 5.75C6.5 5.25 6.9 5.1 7.25 5.4L9 7C9.3 7.3 9.25 7.6 8.9 7.85L7.3 9.25C6.9 9.6 6.5 9.4 6.5 8.9Z' +
  'M17.5 5.75C17.5 5.25 17.1 5.1 16.75 5.4L15 7C14.7 7.3 14.75 7.6 15.1 7.85L16.7 9.25C17.1 9.6 17.5 9.4 17.5 8.9Z'
const EYES = ell(9.5, 12.25, 1, 1.25) + ell(14.5, 12.25, 1, 1.25)
const LIGHTS = ell(9.85, 11.8, 0.4, 0.4) + ell(14.85, 11.8, 0.4, 0.4)
const NOSE = 'M10.75 17.4C10.75 16.95 13.25 16.95 13.25 17.4C13.25 18.05 12.6 18.75 12 18.75C11.4 18.75 10.75 18.05 10.75 17.4Z'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 6.9, 0, 15.6, [stop(0, 'c1', 0.5), stop(1, 'c1', 0.82)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(HEAD, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the face: fur tone over the shine, then the white cheek-and-chin band, then deep inner ears
  out.push(['path', { d: M(HEAD), fill: col('shine') }])
  out.push(['path', { d: M(HEAD), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(MASK), fill: col('shine') }])
  out.push(['path', { d: M(EARS), fill: col('shadow'), 'fill-opacity': 0.7 }])
  out.push(['path', { d: M(HEAD), stroke: col('shadow'), 'stroke-width': T.SW }])
  // features: ink eyes (the blinking A part) with a catch-light, an ink nose on the chin
  out.push(['path', { d: M(EYES), fill: col('ink'), class: 'wm-a' }])
  out.push(['path', { d: M(LIGHTS), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(NOSE), fill: col('ink') }])
  return out
}
