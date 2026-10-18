// forge/hand/bento/avatar-person-glasses.mjs — a person with glasses on the bento tile: the figure is drawn at the sibling avatars' size, the hair is deepened with an ink wash so it parts from the skin, and the
// glasses are pale lenses in strong ink frames with lit eyes, so they read at 16px. Skeleton composition, tile and shadow recipe.
import { squircle, col as col0, DEF, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

// a person's own fallbacks (skin, hair, tint, shade); palettes override all of them
const OV = { c1: '#C3845A', c2: '#6E4428', tint: '#EBC7AC', shadow: '#7C4A2A', c4: DEF.c1, edge: DEF.tint }
const col = r => OV[r] ? `var(--with-bento-${r}, ${OV[r]})` : col0(r)
const NAME = 'avatar-person-glasses'
const id = n => `wg-bento-${NAME}-${n}`
const D = (d, dy = 0) => mapPath(d, 1, [12, 12], 0, dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`

// glyph, on the 24 grid: head, hair and shoulders sit at the sibling avatars' size (head 6.5 x 7, shoulders 8.9 wide)
const HEAD = ell(12, 11.02, 3.24, 3.54)
const HAIR = 'M8.76 11.02C8.31 8.36 9.79 6.59 12 6.59C14.21 6.59 15.69 8.36 15.25 11.02C15.1 9.98 14.66 9.1 13.77 8.66C13.03 9.39 11.71 9.69 10.53 9.69C9.64 9.69 9.05 10.13 8.76 11.02Z'
const TOPS = 'M7.58 17.51C7.58 16.18 8.61 15.44 9.94 15.44C10.67 15.44 11.26 15.88 12 15.88C12.74 15.88 13.33 15.44 14.07 15.44C15.39 15.44 16.43 16.18 16.43 17.51Z'
const LENS_L = rr(9, 10.2, 2.5, 2.1, 0.9)
const LENS_R = rr(12.5, 10.2, 2.5, 2.1, 0.9)
const FRAME = LENS_L + LENS_R + 'M11.5 11H12.5'
const EYES = ell(10.25, 11.3, 0.4, 0.45) + ell(13.75, 11.3, 0.4, 0.45)
const SMILE = 'M11 13.35C11.5 13.85 12.5 13.85 13 13.35'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c4', 0.04), stop(1, 'c4', 0.2)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 8.36, 0, 13.08, [stop(0, 'tint', 0.55), stop(0.45, 'tint', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.35)]),
    ]],
    ['path', { d: TILE, fill: col('edge'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c4'), 'stroke-opacity': 0.16, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.6, 1.6, 0.07], [0.3, 0.5, 0.08]]) {
    out.push(['path', { d: D(HEAD + HAIR + TOPS, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': 0.8 + w, opacity: op, class: 'wm-shadow' }])
  }
  // shoulders (the A plate): pale top with an indigo wash
  out.push(['path', { d: TOPS, fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: TOPS, fill: col('c4'), 'fill-opacity': 0.6, class: 'wm-a' }])
  out.push(['path', { d: TOPS.slice(0, -1), stroke: col('ink'), 'stroke-width': 0.8, class: 'wm-a' }])
  // head: skin with a soft shade toward the chin
  out.push(['path', { d: HEAD, fill: col('c1') }])
  out.push(['path', { d: HEAD, fill: `url(#${id(2)})`, class: 'wm-shine' }])
  out.push(['path', { d: HEAD, stroke: col('ink'), 'stroke-width': 0.8 }])
  // hair: deep tone with an ink wash for contrast against the skin
  out.push(['path', { d: HAIR, fill: col('c2'), class: 'wm-a' }])
  out.push(['path', { d: HAIR, fill: col('ink'), 'fill-opacity': 0.5, class: 'wm-a' }])
  out.push(['path', { d: HAIR, stroke: col('ink'), 'stroke-width': 0.8, class: 'wm-a' }])
  // glasses: pale lenses, strong ink frames, lit eyes
  out.push(['path', { d: LENS_L + LENS_R, fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-a' }])
  out.push(['path', { d: EYES, fill: col('ink') }])
  out.push(['path', { d: FRAME, stroke: col('ink'), 'stroke-width': 0.55, class: 'wm-a' }])
  out.push(['path', { d: SMILE, stroke: col('ink'), 'stroke-width': 0.6 }])
  return out
}
