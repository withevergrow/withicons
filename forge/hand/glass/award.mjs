// forge/hand/glass/award.mjs — a frosted glass medal on a ribbon of colour glass: the generated drawing frosted the
// ribbon and the medal alike almost to white and etched the inner ring as a hairline, so the rosette faded into the
// page. Here the ribbon tails are deep colour glass with a firm edge, the medal is a thick frosted lens over a rich
// colour body with a bevel ring and a bold etched inner ring, all under the Glass light (shadow, orb, lit rim).
// Motion: medal wm-k (glows), ribbon plate A (wm-a, sways about 12 14.5).
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

// the ribbon: two tails with a V notch between them, tucked under the medal (front frame)
const RIBBON = 'M8.2 13L6.55 20.05Q6.35 21.05 7.3 20.75L11.5 19.1L15.7 20.75Q16.65 21.05 16.45 20.05L14.8 13Z'
const RIBBON_B = 'M8.8 13.6L7.25 20.6Q7.1 21.5 7.95 21.25L12.1 19.65L16.25 21.25Q17.1 21.5 16.95 20.6L15.4 13.6Z'

export default function render(icon) {
  const name = icon.name || 'award'
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`
  const defs = [], out = []
  const def = g => { defs.push(g); return `url(#${g[1].id})` }
  const C = [11.5, 8.6], R = 6.9, B = [12.25, 9.35], BR = 6.35
  // soft diffuse shadow under medal and ribbon
  out.push(['path', { d: disc(B[0], B[1] + 0.5, BR + 0.9) + RIBBON_B.replace(/(\d+\.?\d*) (\d+\.?\d*)/g, (m, x, y) => `${f(+x + 0.1)} ${f(+y + 0.5)}`), fill: V.shadow, 'fill-opacity': 0.07, class: 'wm-shadow' }])
  // ribbon: deep colour glass behind, a thin frost in front with a firm edge
  const rib = def(lin(id(), 7, 13, 17, 21.5, [stop(0, V.c1), stop(1, V.shadow)]))
  out.push(['path', { d: RIBBON_B, fill: rib, class: 'wm-a' }])
  out.push(['path', { d: RIBBON, fill: rib, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: RIBBON, fill: def(lin(id(), 6.5, 13, 14, 21, [stop(0, V.frost, 0.5), stop(0.6, V.tint, 0.18), stop(1, V.tint, 0)])), class: 'wm-a' }])
  out.push(['path', { d: 'M8.05 15.3L7.05 19.85', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a wm-shine' }])
  // medal: colour body behind, down-right, with an accent orb
  out.push(['path', { d: disc(B[0], B[1], BR), fill: def(lin(id(), 5.5, 3, 20, 17.5, [stop(0, V.c1), stop(1, V.shadow)])), class: 'wm-k' }])
  out.push(['path', { d: disc(B[0], B[1], BR), fill: def(rad(id(), 15.3, 12.3, 5.6, [stop(0, V.accent, 0.62), stop(0.5, V.accent, 0.24), stop(1, V.accent, 0)])), class: 'wm-k' }])
  // frosted lens in front, a currentColor hairline, an inner bevel
  out.push(['path', { d: disc(C[0], C[1], R), fill: def(lin(id(), 4.6, 1.7, 18.4, 15.5, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)])), stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: arc(C[0], C[1], R - 1.1, 20, 110), fill: 'none', stroke: V.shadow, 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }])
  // the inner ring: etched deep with a light lower lip, the rosette's medallion
  out.push(['path', { d: disc(C[0] + 0.3, C[1] + 0.35, 4.05), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 1.25, class: 'wm-k' }])
  out.push(['path', { d: disc(C[0], C[1], 4.05), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.88, 'stroke-width': 1.25, class: 'wm-k' }])
  // lit rim along the top-left edge
  out.push(['path', { d: arc(C[0], C[1], R - 0.45, 160, 290), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
