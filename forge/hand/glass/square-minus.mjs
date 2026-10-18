// forge/hand/glass/square-minus.mjs — a thick frosted glass tile over its colour body with a bold etched minus bar:
// the generated drawing etched the bar as a 0.7u hairline that nearly vanished at 24/16px, leaving a blank tile.
// Layers the Glass way (as glass/x-circle, on the square keyline): soft shadow, colour body down-right with an accent
// orb, frosted pane up-left with a currentColor hairline, an inner bevel, a lit rim along the top and left edges kept
// clear of the bar, the bar etched deep at 2.2u with a light lower lip. Motion: the bar is plate A (wm-a, jelly about
// 11.5 11.5); tile wm-k.
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
// rounded rectangle, x0 y0 to x1 y1, corner radius r
const rr = (x0, y0, x1, y1, r) => `M${f(x0 + r)} ${f(y0)}H${f(x1 - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y0 + r)}V${f(y1 - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x1 - r)} ${f(y1)}H${f(x0 + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x0)} ${f(y1 - r)}V${f(y0 + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x0 + r)} ${f(y0)}Z`
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render(icon) {
  const name = icon.name || 'square-minus'
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`
  const defs = [], out = []
  const add = g => { defs.push(g); return `url(#${g[1].id})` }
  // pane 1.75..21.25 (centre 11.5), body 3.25..21.75 down-right, like the generated tile
  const P0 = 1.75, P1 = 21.25, PR = 3, B0 = 3.25, B1 = 21.75, BR = 2.75
  // soft diffuse shadow
  out.push(['path', { d: rr(B0 - 0.95, B0 - 0.45, B1 + 0.95, B1 + 1.45, BR + 0.95), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: rr(B0 - 0.4, B0 + 0.1, B1 + 0.4, B1 + 0.9, BR + 0.4), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }])
  // colour body behind, down-right, with an accent orb
  const back = add(lin(id(), 3, 3, 24, 24, [stop(0, V.c1), stop(1, V.shadow)]))
  const orb = add(rad(id(), 16.8, 16.8, 8, [stop(0, V.accent, 0.62), stop(0.5, V.accent, 0.24), stop(1, V.accent, 0)]))
  const body = rr(B0, B0, B1, B1, BR)
  out.push(['path', { d: body, fill: back, class: 'wm-k' }])
  out.push(['path', { d: body, fill: orb, class: 'wm-k' }])
  // frosted pane, a little clearer than the default so the colour reads
  const pane = add(lin(id(), P0, P0, P1, P1, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)]))
  out.push(['path', { d: rr(P0, P0, P1, P1, PR), fill: pane, stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, class: 'wm-k' }])
  // inner bevel: the tile reads as thick glass (light all round, a faint shade inside the lower-right corner)
  const I = 1.55
  out.push(['path', { d: rr(P0 + I, P0 + I, P1 - I, P1 - I, PR - 1), fill: 'none', stroke: V.frost, 'stroke-opacity': 0.42, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: `M${f(P1 - I)} ${f(P0 + I + 4)}V${f(P1 - I - (PR - 1))}A${f(PR - 1)} ${f(PR - 1)} 0 0 1 ${f(P1 - I - (PR - 1))} ${f(P1 - I)}H${f(P0 + I + 4)}`, fill: 'none', stroke: V.shadow, 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }])
  // the minus: deep etch with a light lip below-right (cut into the glass), heavier than Line so it holds at 16px
  const bar = (dx, dy) => `M${f(7.25 + dx)} ${f(11.5 + dy)}H${f(15.75 + dx)}`
  const round = { fill: 'none', 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'wm-a' }
  out.push(['path', { d: bar(0.3, 0.45), stroke: V.shine, 'stroke-opacity': 0.75, ...round }])
  out.push(['path', { d: bar(0, 0), stroke: V.etch, ...round }])
  // lit rim along the top and left edges (well clear of the bar)
  const q = P0 + 0.5, k = PR - 0.5
  out.push(['path', { d: `M${f(q)} ${f(14.5)}V${f(q + k)}A${f(k)} ${f(k)} 0 0 1 ${f(q + k)} ${f(q)}H${f(14.5)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
