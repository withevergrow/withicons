// forge/hand/glass/circle-chevron-right.mjs — a thick frosted glass disc over its colour body with a bold etched chevron pointing right:
// the generated drawing etched the chevron as a 0.7u hairline that vanished at 24/16px, leaving a blank lavender button.
// Layers the Glass way (same build as glass/x-circle): soft shadow, colour body down-right with an accent orb, frosted
// pane up-left with a currentColor hairline, an inner bevel ring, a lit rim top-left, the chevron etched deep at 2u
// with a light lower lip. Motion: the chevron is plate A (wm-a, nudges right about 11.5 11.5); disc wm-k.
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`
const arc = (x, y, r, a0, a1) => {
  const p = a => [f(x + r * Math.cos(a * Math.PI / 180)), f(y + r * Math.sin(a * Math.PI / 180))]
  const [sx, sy] = p(a0), [ex, ey] = p(a1)
  return `M${sx} ${sy}A${f(r)} ${f(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${ex} ${ey}`
}
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const glyph = (dx, dy) => `M${f(9.4 + dx)} ${f(7.1 + dy)}L${f(13.8 + dx)} ${f(11.5 + dy)}L${f(9.4 + dx)} ${f(15.9 + dy)}`

export default function render(icon) {
  const name = icon.name || 'circle-chevron-right'
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`
  const defs = [], out = []
  const add = g => { defs.push(g); return `url(#${g[1].id})` }
  const C = 11.5, R = 10.25, BC = 12.4, BR = 9.6
  // soft diffuse shadow
  out.push(['path', { d: disc(BC, BC + 0.5, BR + 0.95), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: disc(BC, BC + 0.5, BR + 0.4), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }])
  // colour body behind, down-right, with an accent orb
  const back = add(lin(id(), 2.8, 2.8, 24, 24, [stop(0, V.c1), stop(1, V.shadow)]))
  const orb = add(rad(id(), 16.6, 16.6, 8, [stop(0, V.accent, 0.62), stop(0.5, V.accent, 0.24), stop(1, V.accent, 0)]))
  out.push(['path', { d: disc(BC, BC, BR), fill: back, class: 'wm-k' }])
  out.push(['path', { d: disc(BC, BC, BR), fill: orb, class: 'wm-k' }])
  // frosted pane, a little clearer than the default so the colour reads
  const pane = add(lin(id(), 1.25, 1.25, 21.75, 21.75, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)]))
  out.push(['path', { d: disc(C, C, R), fill: pane, stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, class: 'wm-k' }])
  // inner bevel: the disc reads as thick glass
  out.push(['path', { d: disc(C, C, R - 1.55), fill: 'none', stroke: V.frost, 'stroke-opacity': 0.42, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: arc(C, C, R - 1.55, 20, 110), fill: 'none', stroke: V.shadow, 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }])
  // the chevron: deep etch with a light lip below-right (cut into the glass)
  const round = { fill: 'none', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  out.push(['path', { d: glyph(0.35, 0.4), stroke: V.shine, 'stroke-opacity': 0.75, ...round }])
  out.push(['path', { d: glyph(0, 0), stroke: V.etch, ...round }])
  // lit rim along the top-left edge
  out.push(['path', { d: arc(C, C, R - 0.5, 160, 290), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
