// forge/hand/bento/avatar-bear.mjs — a teddy-bear face on the bento tile: a fur-toned round head and round ears with
// pale inner-ear insets, a big pale muzzle carrying an ink nose and mouth, solid ink eyes (the generated glyph was one
// pale mass with hairline features and read as the dog at 16px). Skeleton composition, house scale, tile and shadow.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'avatar-bear'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

// glyph, on the 24 grid
const HEAD = ell(12, 13.75, 7, 7)
const EARS = ell(6.25, 7.5, 2.75, 2.75) + ell(17.75, 7.5, 2.75, 2.75)
const INNER = ell(6.1, 7.35, 1.35, 1.35) + ell(17.9, 7.35, 1.35, 1.35)
const MUZZLE = ell(12, 16.75, 3.5, 2.6)
const EYES = ell(9.25, 12.25, 1, 1.2) + ell(14.75, 12.25, 1, 1.2)
const LIGHTS = ell(9.6, 11.85, 0.38, 0.38) + ell(15.1, 11.85, 0.38, 0.38)
const NOSE = 'M10.6 15.35C10.6 14.75 13.4 14.75 13.4 15.35C13.4 16.1 12.7 16.7 12 16.7C11.3 16.7 10.6 16.1 10.6 15.35Z'
const MOUTH = 'M12 16.7V17.4M10.75 17.9C11.4 18.35 12 18.05 12 17.4C12 18.05 12.6 18.35 13.25 17.9'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 6.3, 0, 16.4, [stop(0, 'c1', 0.5), stop(1, 'c1', 0.82)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(EARS + HEAD, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // ears behind the head: fur tone, outline, pale inset
  out.push(['path', { d: M(EARS), fill: col('shine') }])
  out.push(['path', { d: M(EARS), fill: `url(#${id(2)})`, stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(INNER), fill: col('shine'), 'fill-opacity': 0.9 }])
  // the head, then the pale muzzle
  out.push(['path', { d: M(HEAD), fill: col('shine') }])
  out.push(['path', { d: M(HEAD), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(HEAD), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(MUZZLE), fill: col('shine') }])
  // features: ink eyes (the blinking A part) with catch-lights, ink nose and mouth
  out.push(['path', { d: M(EYES), fill: col('ink'), class: 'wm-a' }])
  out.push(['path', { d: M(LIGHTS), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(NOSE), fill: col('ink') }])
  out.push(['path', { d: M(MOUTH), stroke: col('ink'), 'stroke-width': 0.55 }])
  return out
}
