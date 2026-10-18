// forge/hand/bento/mistletoe.mjs — a mistletoe sprig in the usual shape: two broad leaves opening up and out in a V
// from a short stem, three berries nested at the joint (two behind, one clearly in front), and a two-loop bow with
// tails tied at the top of the stem, so it reads as mistletoe and not a berry stack on feet. On the 24 grid, placed
// with the house glyph scale, tile, drop shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'mistletoe'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const dot = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

// glyph, on the 24 grid
// leaves: paddle-shaped (narrow at the stem, round and broad toward the tip), opening up and out from the joint
const LEAVES = 'M11.25 17.5C9 17.5 4.75 16 3 12.75C1.75 10.5 2.5 8.5 4.5 8.25C7.25 8 10 10 11 12.5C11.75 14.5 11.9 16.5 11.25 17.5Z' +
  'M12.75 17.5C15 17.5 19.25 16 21 12.75C22.25 10.5 21.5 8.5 19.5 8.25C16.75 8 14 10 13 12.5C12.25 14.5 12.1 16.5 12.75 17.5Z'
// one gentle midrib down the centre of each leaf
const RIBS = 'M10.25 16C8.5 14.25 6.5 12 4.75 10.25M13.75 16C15.5 14.25 17.5 12 19.25 10.25'
// short stem from the knot to the joint
const STEM = 'M12 5.5V16.5'
// two-loop bow with short tails, tied at the top of the stem
const BOW = 'M12 4.5C10.25 1.25 6.5 1.25 6.5 3.5C6.5 5.75 10 6 12 4.5Z' +
  'M12 4.5C13.75 1.25 17.5 1.25 17.5 3.5C17.5 5.75 14 6 12 4.5Z'
const TAILS = 'M11.4 5.1L9.5 7.25M12.6 5.1L14.5 7.25'
const KNOT = dot(12, 4.5, 1.1)
// berries: two behind, one in front, each 4u+ across
const BACK = dot(9.1, 17.1, 2.1) + dot(14.9, 17.1, 2.1)
const FRONT = dot(12, 19.4, 2.35)
const LIGHTS = dot(8.4, 16.4, 0.55) + dot(14.2, 16.4, 0.55) + dot(11.25, 18.6, 0.6)

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
  const SIL = LEAVES + BACK + FRONT + BOW
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(SIL, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // stem first, so the leaves and berries cover its foot
  out.push(['path', { d: M(STEM), stroke: col('shadow'), 'stroke-width': T.SW * 0.8 }])
  // leaves: a step deeper than the house mass, one centred midrib in a light line
  out.push(['path', { d: M(LEAVES), fill: col('shine') }])
  out.push(['path', { d: M(LEAVES), fill: col('c1'), 'fill-opacity': 0.6 }])
  out.push(['path', { d: M(RIBS), stroke: col('shine'), 'stroke-opacity': 0.75, 'stroke-width': 0.45, class: 'wm-shine' }])
  out.push(['path', { d: M(LEAVES), stroke: col('shadow'), 'stroke-width': T.SW }])
  // bow: two loops and tails in the second colour (A part, it sways with the sprig)
  out.push(['path', { d: M(TAILS), stroke: col('shadow'), 'stroke-width': T.SW * 0.8, class: 'wm-a' }])
  out.push(['path', { d: M(BOW), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(BOW), fill: col('c2'), 'fill-opacity': 0.75, class: 'wm-a' }])
  out.push(['path', { d: M(BOW), stroke: col('shadow'), 'stroke-width': T.SW * 0.8, class: 'wm-a' }])
  out.push(['path', { d: M(KNOT), fill: col('c2'), stroke: col('shadow'), 'stroke-width': T.SW * 0.7, class: 'wm-a' }])
  // berries: accent pearls in a deep outline, the front one drawn over the two behind (S part, they pulse)
  for (const B of [BACK, FRONT]) {
    out.push(['path', { d: M(B), fill: col('accent'), class: 'wm-s' }])
    out.push(['path', { d: M(B), stroke: col('shadow'), 'stroke-width': T.SW * 0.6, class: 'wm-s' }])
  }
  out.push(['path', { d: M(LIGHTS), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
  return out
}
