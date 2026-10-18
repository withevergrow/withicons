// forge/hand/glass/traffic-cone.mjs — a traffic cone: a saturated violet glass cone with two bold white reflective bands and a wide dark square base slab. The generated cone had washed-out stripes and no base. Motion: cone wm-k.
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const rr = (x1, y1, x2, y2, r) => `M${f(x1 + r)} ${f(y1)}H${f(x2 - r)}A${r} ${r} 0 0 1 ${f(x2)} ${f(y1 + r)}V${f(y2 - r)}A${r} ${r} 0 0 1 ${f(x2 - r)} ${f(y2)}H${f(x1 + r)}A${r} ${r} 0 0 1 ${f(x1)} ${f(y2 - r)}V${f(y1 + r)}A${r} ${r} 0 0 1 ${f(x1 + r)} ${f(y1)}Z`
// half width of the cone at height y
const HW = y => 2.4 + (y - 3.3) * 0.307
const band = (y1, y2) => `M${f(12 - HW(y1))} ${y1}H${f(12 + HW(y1))}L${f(12 + HW(y2))} ${y2}H${f(12 - HW(y2))}Z`
const cone = (dx = 0, dy = 0) => `M${f(10.6 + dx)} ${f(2.5 + dy)}H${f(13.4 + dx)}Q${f(14.2 + dx)} ${f(2.5 + dy)} ${f(14.4 + dx)} ${f(3.3 + dy)}L${f(19.1 + dx)} ${f(18.6 + dy)}H${f(4.9 + dx)}L${f(9.6 + dx)} ${f(3.3 + dy)}Q${f(9.8 + dx)} ${f(2.5 + dy)} ${f(10.6 + dx)} ${f(2.5 + dy)}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'traffic-cone'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }
  const id = () => `wg-glass-${name}-${n++}`
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  const back = add(lin(id(), 3, 2.5, 21, 21.8, [stop(0, V.c1), stop(1, V.shadow)]))
  const glow = add(rad(id(), 15, 15, 8, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 3, 2, 19, 20, [stop(0, V.frost, 0.42), stop(0.4, V.tint, 0.22), stop(1, V.tint, 0.08)]))
  const bandG = add(lin(id(), 4, 8, 20, 16, [stop(0, V.frost, 1), stop(1, V.tint, 0.92)]))
  const baseG = add(lin(id(), 2, 18.4, 22, 21.8, [stop(0, V.c1), stop(1, V.shadow)]))
  const basePane = add(lin(id(), 2, 18.2, 2, 21.5, [stop(0, V.frost, 0.5), stop(0.5, V.tint, 0.14), stop(1, V.tint, 0.04)]))
  return [['defs', {}, defs],
    ['path', { d: rr(2.8, 19.3, 22.4, 22.9, 1.2), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: cone(0.9, 0.7), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: cone(0.5, 0.4), fill: back, class: 'wm-k' }],
    ['path', { d: cone(0.5, 0.4), fill: glow, class: 'wm-k' }],
    ['path', { d: cone(), fill: pane, ...edge, class: 'wm-k' }],
    ['path', { d: band(7.6, 10.6) + band(12.6, 15.6), fill: bandG, stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rr(2.3, 18.3, 21.7, 21.7, 1.2), fill: baseG, class: 'wm-k' }],
    ['path', { d: rr(2.3, 18.3, 21.7, 21.7, 1.2), fill: basePane, ...edge, class: 'wm-k' }],
    ['path', { d: 'M10.4 3.1L5.9 17.5', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M3.5 19.1H8', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
