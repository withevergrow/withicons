// forge/hand/bento/avatar-ghost.mjs — a white ghost on the bento tile with a soft wash toward its wavy hem and a solid
// ink face (big eyes with catch-lights, an "oo" mouth), so the face holds at 16px (the generated glyph tinted the body
// pale violet and drew the face as pale hairlines that disappeared). Skeleton silhouette, house scale, tile and shadow.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'avatar-ghost'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

// glyph, on the 24 grid
const BODY = 'M5 20V11A7 7 0 0 1 19 11V20C19 20.75 18.5 21 17.75 20.5L16.75 19.75C16 19.25 15.5 19.25 14.75 19.75L13.25 20.75C12.5 21.25 11.5 21.25 10.75 20.75L9.25 19.75C8.5 19.25 8 19.25 7.25 19.75L6.25 20.5C5.5 21 5 20.75 5 20Z'
const EYES = ell(9.5, 11.5, 1.1, 1.4) + ell(14.5, 11.5, 1.1, 1.4)
const LIGHTS = ell(9.9, 11, 0.42, 0.42) + ell(14.9, 11, 0.42, 0.42)
const MOUTH = ell(12, 15.4, 0.9, 1.15)

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 9, 0, 17.2, [stop(0, 'c1', 0.04), stop(1, 'c1', 0.34)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(BODY, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the sheet: white, washing into the palette colour toward the hem
  out.push(['path', { d: M(BODY), fill: col('shine') }])
  out.push(['path', { d: M(BODY), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(BODY), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the face (the blinking A part): solid ink, never a pale line
  out.push(['path', { d: M(EYES + MOUTH), fill: col('ink'), class: 'wm-a' }])
  out.push(['path', { d: M(LIGHTS), fill: col('shine'), class: 'wm-a' }])
  return out
}
