// forge/hand/bento/avatar-man-beard.mjs — a bearded man filling the tile (about 12.5u wide, 15u tall, the generated
// figure was a 0.59-scale speck): the skeleton's own head, swept hair, scalloped beard and shoulders at 0.85 scale, deep
// brown hair and beard against the skin, bigger ink eyes with catch-lights and a pale smile line on the beard.
// People convention (forge/styles/_people.mjs): c1 = skin, tint/shadow = its light and shade, c2 = hair, c4 = top.
import { squircle, DEF, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'avatar-man-beard'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
// this person's natural colours as the var() fallbacks (the generated build does the same)
const FB = { ...DEF, c1: '#DDA176', tint: '#F4D3BA', shadow: '#94603C', c2: '#43291D', c4: DEF.c1, edge: DEF.tint }
const col = r => `var(--with-bento-${r}, ${FB[r]})`
const M = (d, dy = 0) => mapPath(d, 0.85, [12, 12.25], 0, -0.3 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

// skeleton geometry, scaled by M
const FACE = 'M17.5 10.5A5.5 6 0 1 1 6.5 10.5A5.5 6 0 1 1 17.5 10.5Z'
const FACE_S = 'M6.5 10.5A5.5 6 0 0 0 17.5 10.5'
const HAIR = 'M6.5 10.5C6 6 8.5 3 12 3C15.5 3 18 6 17.5 10.5C17.25 9.5 16.75 8.75 16 8.25C14 8.75 11.25 8.5 9.5 7.25C8.5 8 7 9.25 6.5 10.5Z'
const BEARD = 'M6.75 12A5.5 6 0 0 0 17.25 12C16.5 13.5 15.5 14 14 14C13.25 14 12.5 13.75 12 13.5C11.5 13.75 10.75 14 10 14C8.5 14 7.5 13.5 6.75 12Z'
const TORSO = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5Z'
const TORSO_S = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'
const EYES = ell(9.5, 10.9, 0.85, 1.05) + ell(14.5, 10.9, 0.85, 1.05)
const LIGHTS = ell(9.8, 10.5, 0.3, 0.3) + ell(14.8, 10.5, 0.3, 0.3)
const SMILE = 'M10.75 15.25C11.5 15.75 12.5 15.75 13.25 15.25'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c4', 0.04), stop(1, 'c4', 0.2)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      // the skin's soft light: lit from above, its shade toward the chin
      lin(2, 0, 7, 0, 15, [stop(0, 'tint', 0.55), stop(0.45, 'tint', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.35)]),
    ]],
    ['path', { d: TILE, fill: col('edge'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c4'), 'stroke-opacity': 0.16, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(FACE + HAIR + BEARD + TORSO, dy), fill: col('ink'), stroke: col('ink'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the face: skin, lit from above
  out.push(['path', { d: M(FACE), fill: col('c1'), 'fill-rule': 'evenodd' }])
  out.push(['path', { d: M(FACE), fill: url(2), 'fill-rule': 'evenodd', class: 'wm-shine' }])
  // hair and beard: solid deep brown (the A plate)
  out.push(['path', { d: M(HAIR + BEARD), fill: col('c2'), 'fill-rule': 'evenodd', class: 'wm-a' }])
  // the top: the house pale duotone mass in indigo
  out.push(['path', { d: M(TORSO), fill: col('shine'), 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: M(TORSO), fill: col('c4'), 'fill-opacity': 0.6, 'fill-rule': 'evenodd', class: 'wm-a' }])
  // outlines in the ink
  out.push(['path', { d: M(FACE_S + HAIR + BEARD + TORSO_S), stroke: col('ink'), 'stroke-width': T.SW_P + 0.1 }])
  // features: ink eyes with catch-lights, a pale smile on the beard
  out.push(['path', { d: M(EYES), fill: col('ink') }])
  out.push(['path', { d: M(LIGHTS), fill: col('shine'), class: 'wm-shine' }])
  out.push(['path', { d: M(SMILE), stroke: col('shine'), 'stroke-opacity': 0.9, 'stroke-width': 0.7 }])
  return out
}
