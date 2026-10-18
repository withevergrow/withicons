// forge/hand/glass/flame.mjs — a frosted glass flame with a pointed, flicking tip, a side tongue split off by a sharp
// notch and a bright inner tongue of accent glass: the generated drawing rounded the tip and the notch away and cut
// the inner tongue as a dark round window, so the whole thing read as a water drop. Same Glass layers: soft shadow,
// colour body down-right with an accent orb, frosted pane up-left with a currentColor hairline, lit rim top-left.
// Motion: body wm-k (flickers from its base), inner tongue plate A (wm-a, dances out of step about 12 17.5).
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
// bake a scale about (cx, cy) plus a shift into an absolute M/L/C/Q/Z path
function xf(d, s, cx, cy, dx, dy) {
  let i = 0
  return d.replace(/-?\d*\.?\d+/g, v => { const x = +v, odd = i++ % 2; return String(f(odd ? cy + (x - cy) * s + dy : cx + (x - cx) * s + dx)) })
}
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

// skeleton frame (24 grid): round base, a side tongue tipped at 6.6 7.6, a sharp notch, the main tip at 14.2 2.5
const BODY = 'M12 21.5C8.1 21.5 5 18.7 5 15C5 12.3 5.6 9.7 6.6 7.6C7.5 9.2 8.8 10.1 10.3 10.3C10 7.4 11.3 4.6 14.2 2.5C17.6 5.4 19 9.8 19 14.6C19 18.6 15.9 21.5 12 21.5Z'
// colour-body frame: the same flame with the side tongue drawn out further, so after the 0.9 scale some c1 still
// reaches up behind the frosted side tongue and the notch reads as glass, not as an empty outline
const BODY_B = 'M12 21.5C8.1 21.5 5 18.7 5 15C5 12.1 5.3 9.1 6 6.8C7.1 8.9 8.6 10 10.3 10.3C10 7.4 11.3 4.6 14.2 2.5C17.6 5.4 19 9.8 19 14.6C19 18.6 15.9 21.5 12 21.5Z'
// inner tongue: a flame tongue, not a drop — sharp tip leaning toward the main tip, a concave S on the left flank,
// a small notch on the left echoing the outer side tongue, a full convex right flank, a base about 5.4u wide sitting 1.6u above the body's base
const TONGUE = 'M12.4 19.9C10.9 19.9 9.8 18.7 9.8 17.1C9.8 16.3 10.1 15.6 10.5 15.1C10.75 15.55 11.05 15.7 11.35 15.6C11.6 14.3 12.8 13 13.4 10.9C14.8 12.5 15.4 14.6 15.3 16.7C15.2 18.6 14 19.9 12.4 19.9Z'
const TSHINE = 'M10.6 18.1C10.45 17.4 10.55 16.75 10.8 16.25'
const RIM = 'M5.3 14.2C5.4 12 5.9 9.9 6.75 8.25M10.65 9.4C10.6 7.2 11.7 5.1 13.6 3.4'

const pane = d => xf(d, 0.94, 12, 12, -0.5, -0.5)

export default function render(icon) {
  const name = icon.name || 'flame'
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`
  const defs = [], out = []
  const def = g => { defs.push(g); return `url(#${g[1].id})` }
  const back = xf(BODY_B, 0.9, 12, 12, 0.4, 0.65)
  // soft diffuse shadow
  out.push(['path', { d: xf(BODY, 0.95, 12, 12, 0.6, 1.2), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: xf(BODY, 0.91, 12, 12, 0.6, 1.1), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  // colour body behind, down-right, with an accent orb low in the bowl
  out.push(['path', { d: back, fill: def(lin(id(), 5, 3.5, 21, 23, [stop(0, V.c1), stop(1, V.shadow)])), class: 'wm-k' }])
  out.push(['path', { d: back, fill: def(rad(id(), 15, 17.4, 7, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])), class: 'wm-k' }])
  // frosted pane, clear enough that the colour reads, a currentColor hairline edge
  out.push(['path', { d: pane(BODY), fill: def(lin(id(), 4, 2, 19, 21, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)])), stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }])
  // inner tongue: luminous accent glass with a hot pale core at its base
  const t = pane(TONGUE)
  out.push(['path', { d: t, fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: t, fill: def(lin(id(), 12.4, 10.6, 12.4, 18.4, [stop(0, V.shadow, 0.3), stop(0.45, V.shine, 0), stop(1, V.shine, 0.6)])), class: 'wm-a' }])
  out.push(['path', { d: pane(TSHINE), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-a wm-shine' }])
  // lit rim along the upper-left edges: the side tongue and the main tongue's flank
  out.push(['path', { d: pane(RIM), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
