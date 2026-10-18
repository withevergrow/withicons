// forge/hand/bento/teapot.mjs — a round teapot with a solid tapered spout, a looped handle, a deeper domed lid with an
// accent knob and one band, so the spout and lid read as a teapot at 16px (the generated glyph drew the spout as a
// hairline squiggle and the lid as a pale bubble that read like a bowl). On the 24 grid, placed with the house glyph
// scale, tile, drop shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'teapot'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const dot = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

// glyph, on the 24 grid
const BODY = 'M7 20.5H17C18.75 19 19.5 17 19.5 14.75C19.5 11 16.25 8.75 12 8.75C7.75 8.75 4.5 11 4.5 14.75C4.5 17 5.25 19 7 20.5Z'
// the spout's root runs inside the body, which covers it
const SPOUT = 'M6 17.25C3.5 16.75 2.25 13.75 1.9 10.9C1.8 10.1 2.75 9.8 3.2 10.5C4 11.9 5 12.9 6.25 13.25Z'
const HANDLE = 'M18.5 11C21 10.5 22 12.5 21.75 14.4C21.5 16.4 20.25 17.5 18.75 17.5'
const LID = 'M7.75 9.25C7.75 7 9.5 5.5 12 5.5C14.5 5.5 16.25 7 16.25 9.25Z'
const KNOB = dot(12, 4, 1.5)
const BAND = 'M4.75 14C9 15.25 15 15.25 19.25 14'

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
    out.push(['path', { d: M(BODY + SPOUT + LID + KNOB, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(HANDLE, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // spout and handle sit behind the body
  out.push(['path', { d: M(SPOUT), fill: col('shine') }])
  out.push(['path', { d: M(SPOUT), fill: col('c1'), 'fill-opacity': 0.42 }])
  out.push(['path', { d: M(SPOUT + HANDLE), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the pot: the house duotone mass and its band
  out.push(['path', { d: M(BODY), fill: col('shine') }])
  out.push(['path', { d: M(BODY), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(BODY), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(BAND), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(BAND), stroke: col('c1'), 'stroke-opacity': 0.72, 'stroke-width': T.SW, class: 'wm-a' }])
  // the lid: a deeper dome
  out.push(['path', { d: M(LID), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(LID), fill: col('c1'), 'fill-opacity': 0.62, class: 'wm-a' }])
  out.push(['path', { d: M(LID), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  // the knob: the accent (S part, it bounces)
  out.push(['path', { d: M(KNOB), fill: col('accent'), stroke: col('shadow'), 'stroke-width': T.SW * 0.6, class: 'wm-s' }])
  return out
}
