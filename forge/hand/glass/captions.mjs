// forge/hand/glass/captions.mjs — a frosted glass screen over a deep colour back pane with a bold etched CC mark.
// The generated drawing etched the two Cs as faint 0.7 hairlines that vanished at 16-24px; here they are thick,
// near-opaque etch strokes (wm-a, plate A) centred on the front pane, under the Glass light (shadow, orb, lit rim).
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const rr = (x, y, w, h, r) =>
  `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}` +
  `H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
// a C opening right: top end, arc down the left, bottom end
const cee = (x, y) => `M${f(x + 3.6)} ${f(y)}H${f(x + 2.3)}A2.3 2.3 0 0 0 ${f(x)} ${f(y + 2.3)}V${f(y + 2.9)}A2.3 2.3 0 0 0 ${f(x + 2.3)} ${f(y + 5.2)}H${f(x + 3.6)}`
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render(icon) {
  const name = (icon && icon.name) || 'captions'
  const g = n => `wg-glass-${name}-${n}`
  const defs = [
    lin(g(0), 2.5, 4.5, 23, 21.5, [stop(0, V.c1), stop(1, V.shadow)]),
    rad(g(1), 18.2, 17.4, 7.5, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]),
    lin(g(2), 1, 3, 21.5, 19.5, [stop(0, V.frost, 0.72), stop(0.45, V.tint, 0.66), stop(1, V.tint, 0.55)]),
  ]
  const out = [
    ['path', { d: rr(2.6, 5.6, 20.4, 16.2, 2.6), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: rr(3, 5, 19.6, 15.6, 2.4), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: rr(2.8, 4.5, 19.2, 15.4, 2.2), fill: `url(#${g(0)})`, class: 'wm-k' }],
    ['path', { d: rr(2.8, 4.5, 19.2, 15.4, 2.2), fill: `url(#${g(1)})`, class: 'wm-deco' }],
    ['path', { d: rr(1.6, 3.2, 19.6, 15.6, 2.4), fill: `url(#${g(2)})`, stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: cee(5.4, 8.4) + cee(12.6, 8.4), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.95, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M2.35 15.6V5.6A1.65 1.65 0 0 1 4 3.95H18.6', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
  return [['defs', {}, defs], ...out]
}
