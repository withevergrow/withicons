// forge/hand/glass/tablet.mjs — a tablet: a frosted bezel with a round home button and a camera dot, around a deep colour screen with a soft glint, over a violet glass back. The generated drawing was a pale blob whose screen barely differed from the bezel.
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const rr = (x1, y1, x2, y2, r) => `M${f(x1 + r)} ${f(y1)}H${f(x2 - r)}A${r} ${r} 0 0 1 ${f(x2)} ${f(y1 + r)}V${f(y2 - r)}A${r} ${r} 0 0 1 ${f(x2 - r)} ${f(y2)}H${f(x1 + r)}A${r} ${r} 0 0 1 ${f(x1)} ${f(y2 - r)}V${f(y1 + r)}A${r} ${r} 0 0 1 ${f(x1 + r)} ${f(y1)}Z`
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x + r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x - r)} ${f(y)}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'tablet'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }
  const id = () => `wg-glass-${name}-${n++}`
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5 }
  const back = add(lin(id(), 4, 3, 22, 23.5, [stop(0, V.c1), stop(1, V.shadow)]))
  const glow = add(rad(id(), 16.5, 17.5, 8, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 2.5, 1.5, 20, 22, [stop(0, V.frost, 0.7), stop(0.4, V.tint, 0.64), stop(1, V.tint, 0.52)]))
  const scr = add(lin(id(), 5.8, 5, 16.8, 16.2, [stop(0, V.shadow, 0.92), stop(1, V.etch, 0.97)]))
  const SCREEN = rr(5.8, 5, 16.8, 16.2, 1.1)
  return [['defs', {}, defs],
    ['path', { d: rr(3.3, 3.2, 22, 23.8, 3.2), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: rr(3.7, 3, 21.7, 23.3, 3), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: rr(4.8, 3.6, 21.4, 23, 2.9), fill: back, class: 'wm-k' }],
    ['path', { d: rr(4.8, 3.6, 21.4, 23, 2.9), fill: glow, class: 'wm-k' }],
    ['path', { d: rr(3, 2, 19.6, 21.5, 2.8) + SCREEN, fill: pane, ...edge, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: SCREEN, fill: scr, class: 'wm-k' }],
    ['path', { d: 'M6.9 5H11.6L5.8 11.2V6.1Q5.8 5 6.9 5Z', fill: V.shine, 'fill-opacity': 0.34, class: 'wm-shine' }],
    ['path', { d: disc(11.3, 18.85, 1.45), fill: V.frost, 'fill-opacity': 0.98, stroke: V.etch, 'stroke-opacity': 0.75, 'stroke-width': 0.8, class: 'wm-k' }],
    ['path', { d: disc(11.3, 3.5, 0.62), fill: V.etch, 'fill-opacity': 0.9, class: 'wm-k' }],
    ['path', { d: 'M3.45 8V4.9A2.45 2.45 0 0 1 5.9 2.45H9.6', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
