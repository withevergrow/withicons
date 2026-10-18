// forge/hand/bento/bat.mjs — a bat in flight as one clear M/W silhouette: broad deep-toned wings whose leading edge
// arches up to the wrist (finger bones and a lit top edge) and whose scalloped membrane dips lower toward the body, a
// round head with two tall pointed ears and a short body ending level with the lowest scallop. Wing tips sit on the
// siblings' keyline. On the 24 grid, placed with the house glyph scale, tile, drop shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'bat'
const id = n => `wg-bento-${NAME}-${n}`
// the glyph runs from the ear tips (y 4.75) to the body (y 17.25): nudge it a hair down so it sits centred in the tile
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + 0.4 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const dot = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
// mirror an absolute M/L/C/Z path across x = 12
const mir = d => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${+(24 - x).toFixed(2)} ${y}`)

// glyph, on the 24 grid
// right wing: shoulder -> arched leading edge up to the wrist -> out to the tip, then three scallops back to the body,
// each lower than the last, so the membrane dips toward the body
const WING_R = 'M13 10.5C14 8 15.5 6 17 5.25C18.5 5.5 20.25 6.75 21 8.5' +
  'C19.5 10 19 11.75 20 13.5C19 12.25 17.5 12.75 17 15C16 13.5 14.25 14 13.25 17Z'
const WINGS = WING_R + mir(WING_R)
// finger bones from the wrist to the scallop points, and a lit line just inside the leading edge
const BONES_R = 'M17 6.5L19.5 12.25M16.75 6.75L16.75 13.75'
const LIT_R = 'M14.25 10.1C15.1 8.3 16.1 7.05 17.1 6.45C18.2 6.65 19.4 7.45 20 8.4'
// body (short, ends level with the lowest scallop), round head, two tall pointed ears
const BODY = 'M12 11.25C13.4 11.25 14.1 12.6 14.1 14.25C14.1 15.9 13.2 17.25 12 17.25C10.8 17.25 9.9 15.9 9.9 14.25C9.9 12.6 10.6 11.25 12 11.25Z'
const EARS = 'M10.25 8.75L10 4.75L12 7.5ZM13.75 8.75L14 4.75L12 7.5Z'
const HEAD = dot(12, 9.85, 2.1)
const EYES = dot(11.1, 9.85, 0.55) + dot(12.9, 9.85, 0.55)

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  // soft drop shadow, then a tight contact shadow
  const SIL = WINGS + BODY + HEAD + EARS
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(SIL, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // wings: a deep tonal mass with finger bones and a lit leading edge
  out.push(['path', { d: M(WINGS), fill: col('shine') }])
  out.push(['path', { d: M(WINGS), fill: col('c1'), 'fill-opacity': 0.78 }])
  out.push(['path', { d: M(BONES_R + mir(BONES_R)), stroke: col('shadow'), 'stroke-opacity': 0.45, 'stroke-width': 0.5 }])
  out.push(['path', { d: M(LIT_R + mir(LIT_R)), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.5, class: 'wm-shine' }])
  out.push(['path', { d: M(WINGS), stroke: col('shadow'), 'stroke-width': T.SW }])
  // body, then ears and head over it: the darkest tone, so the animal has a deep centre (A part)
  for (const P of [BODY, EARS, HEAD]) {
    out.push(['path', { d: M(P), fill: col('shadow'), class: 'wm-a' }])
    out.push(['path', { d: M(P), fill: col('c1'), 'fill-opacity': 0.45, class: 'wm-a' }])
    out.push(['path', { d: M(P), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  }
  out.push(['path', { d: M(EYES), fill: col('shine'), 'fill-opacity': 0.95, class: 'wm-a' }])
  return out
}
