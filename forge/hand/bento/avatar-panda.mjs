// forge/hand/bento/avatar-panda.mjs — a panda on the bento tile: a white face with only a faint wash, solid deep ears
// and droopy eye patches with lit eyes, an ink nose and mouth (the generated glyph tinted the face and patches the same
// pale violet, so the black-and-white read was lost). Skeleton composition, house glyph scale, tile and shadow recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'avatar-panda'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

// glyph, on the 24 grid
const HEAD = ell(12, 13.75, 7, 7)
const EARS = ell(6.25, 7.5, 2.5, 2.5) + ell(17.75, 7.5, 2.5, 2.5)
const PATCHES = 'M8 15.05A2 2.6 30 1 1 10.6 10.55A2 2.6 30 1 1 8 15.05Z' + 'M16 15.05A2 2.6 -30 1 1 13.4 10.55A2 2.6 -30 1 1 16 15.05Z'
const EYES = ell(9.7, 12.5, 0.75, 0.75) + ell(14.3, 12.5, 0.75, 0.75)
const NOSE = 'M10.9 15.9C10.9 15.45 13.1 15.45 13.1 15.9C13.1 16.45 12.5 16.95 12 16.95C11.5 16.95 10.9 16.45 10.9 15.9Z'
const MOUTH = 'M12 16.95V17.5M10.9 17.9C11.5 18.25 12 18.05 12 17.5C12 18.05 12.5 18.25 13.1 17.9'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 9.5, 0, 16.6, [stop(0, 'c1', 0), stop(1, 'c1', 0.2)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(EARS + HEAD, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // ears: solid deep, tucked behind the head
  out.push(['path', { d: M(EARS), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the face: white, with only a faint wash toward the chin
  out.push(['path', { d: M(HEAD), fill: col('shine') }])
  out.push(['path', { d: M(HEAD), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(HEAD), stroke: col('shadow'), 'stroke-width': T.SW }])
  // patches and eyes (the A plate), nose and mouth in ink
  out.push(['path', { d: M(PATCHES), fill: col('shadow'), class: 'wm-a' }])
  out.push(['path', { d: M(EYES), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(NOSE), fill: col('ink') }])
  out.push(['path', { d: M(MOUTH), stroke: col('ink'), 'stroke-width': 0.55 }])
  return out
}
