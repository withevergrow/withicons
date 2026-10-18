// forge/hand/bento/piggy-bank.mjs — the line design's pig scaled up to fill the tile (about 15.5u): round body, a deep
// ear and snout, curly tail, two legs, a coin slot, and a solid accent coin dropping in from above. The skeleton's own
// geometry (arcs stay exact), with the contrast raised so the ear, snout and slot read at 16-24px. House tile recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'piggy-bank'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const S = 0.86
const M = (d, dy = 0) => mapPath(d, S, [11.65, 12.45], 0.35, -0.25 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const dot = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

// skeleton geometry (the line design), scaled by M
const BODY = 'M18.5 14A7.2 6 0 1 1 4.1 14A7.2 6 0 1 1 18.5 14Z'
const BODY_S = 'M18.2 12.3A7.2 6 0 1 0 18.2 15.7'
const LEGS = 'M7.2 18.6V20.5A1 1 0 0 0 8.2 21.5H8.6A1 1 0 0 0 9.6 20.5V19.7ZM13 19.7V20.5A1 1 0 0 0 14 21.5H14.4A1 1 0 0 0 15.4 20.5V18.6Z'
const LEGS_S = 'M7.2 18.6V20.5A1 1 0 0 0 8.2 21.5H8.6A1 1 0 0 0 9.6 20.5V19.7M13 19.7V20.5A1 1 0 0 0 14 21.5H14.4A1 1 0 0 0 15.4 20.5V18.6'
const EAR = 'M13.9 8.6L17.6 6.3L17.4 10.7Z'
const SNOUT = 'M18.2 12.3H20A1 1 0 0 1 21 13.3V14.7A1 1 0 0 1 20 15.7H18.2Z'
const TAIL = 'M4.3 12.8C2.8 12.8 2.3 11 3.3 10.4C4.2 10 4.8 11 4 11.6'
const SLOT = 'M9 8.9H13.6'
const COIN = dot(11.3, 5.6, 2.2)
const COIN_IN = dot(11.3, 5.6, 1)
const EYE = dot(15.6, 12.15, 0.6)
const NOSTRIL = 'M19.85 13.5V14.5'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 7, 0, 20, [stop(0, 'c1', 0.34), stop(1, 'c1', 0.6)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(BODY + LEGS + EAR + SNOUT, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // legs, then the body: the house duotone mass under a deep outline
  for (const d of [LEGS, BODY]) {
    out.push(['path', { d: M(d), fill: col('shine') }])
    out.push(['path', { d: M(d), fill: url(2) }])
  }
  out.push(['path', { d: M(LEGS_S + BODY_S + TAIL), stroke: col('shadow'), 'stroke-width': T.SW }])
  // ear and snout (the A plate): solid deep wax, then the slot, eye and nostril in ink
  out.push(['path', { d: M(EAR + SNOUT), fill: col('shadow'), class: 'wm-a' }])
  out.push(['path', { d: M(EAR + SNOUT), fill: col('c1'), 'fill-opacity': 0.8, class: 'wm-a' }])
  out.push(['path', { d: M(EAR + SNOUT), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(SLOT), stroke: col('shadow'), 'stroke-width': T.SW + 0.2 }])
  out.push(['path', { d: M(EYE), fill: col('shadow') }])
  out.push(['path', { d: M(NOSTRIL), stroke: col('shadow'), 'stroke-width': 0.8 }])
  // the coin (the S plate): accent, with a lit ring
  out.push(['path', { d: M(COIN), fill: col('shine'), class: 'wm-s' }])
  out.push(['path', { d: M(COIN), fill: col('accent'), 'fill-opacity': 0.9, class: 'wm-s' }])
  out.push(['path', { d: M(COIN), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-s' }])
  out.push(['path', { d: M(COIN_IN), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.6, class: 'wm-s' }])
  return out
}
