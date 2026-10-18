// forge/hand/glass/toggle.mjs — a switched-on toggle: a saturated colour glass pill track with a power-bar mark, and a bright white glass knob with its own rim and contact shadow resting at the right end. The previous drawing had a pale track the same white as the knob, so the on state was unclear. Motion: track wm-k, knob wm-a (parts.A slides it left).
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const pill = (x1, y1, x2, y2) => {
  const r = f((y2 - y1) / 2)
  return `M${f(x1 + r)} ${f(y1)}H${f(x2 - r)}A${r} ${r} 0 0 1 ${f(x2 - r)} ${f(y2)}H${f(x1 + r)}A${r} ${r} 0 0 1 ${f(x1 + r)} ${f(y1)}Z`
}
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x + r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x - r)} ${f(y)}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'toggle'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }
  const id = () => `wg-glass-${name}-${n++}`
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }
  const KX = 15.5, KY = 11.4, KR = 4.5
  const back = add(lin(id(), 3, 6, 22, 18, [stop(0, V.c1), stop(1, V.shadow)]))
  const glow = add(rad(id(), 16, 14, 8, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 2, 5.5, 21, 17.3, [stop(0, V.frost, 0.34), stop(0.4, V.tint, 0.16), stop(1, V.tint, 0.06)]))
  const knob = add(lin(id(), 11, 7, 19.5, 16, [stop(0, V.frost, 1), stop(0.55, V.frost, 0.98), stop(1, V.tint, 0.9)]))
  return [['defs', {}, defs],
    ['path', { d: pill(2.5, 6.4, 22.3, 18.7), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: pill(2.9, 6.1, 21.9, 18.3), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: pill(2.7, 6.3, 22, 18.1), fill: back, class: 'wm-k' }],
    ['path', { d: pill(2.7, 6.3, 22, 18.1), fill: glow, class: 'wm-k' }],
    ['path', { d: pill(2, 5.5, 21.3, 17.3), fill: pane, ...edge, class: 'wm-k' }],
    ['path', { d: 'M2.55 11.4A5.6 5.6 0 0 1 8.1 5.95H11', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.88, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M7.2 8.6V14.2', fill: 'none', stroke: V.frost, 'stroke-opacity': 0.95, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: disc(KX + 0.3, KY + 0.9, KR + 0.1), fill: V.shadow, 'fill-opacity': 0.36, class: 'wm-a' }],
    ['path', { d: disc(KX, KY, KR), fill: knob, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: disc(KX, KY, 2.9), fill: V.c1, 'fill-opacity': 0.1, class: 'wm-a' }],
    ['path', { d: 'M11.9 10.5A3.8 3.8 0 0 1 15 7.5', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
