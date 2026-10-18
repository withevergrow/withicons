// forge/hand/lunar/gallery-horizontal.mjs — a cream card with a crimson outline holding a moon over a hill, flanked by
// two half-cards that peek in from the sides as a horizontal carousel cue, with gold pager dots below.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const rr = (x0, y0, x1, y1, r) => `M${r2(x0 + r)} ${r2(y0)}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${r2(x1)} ${r2(y0 + r)}V${r2(y1 - r)}` +
  `A${r} ${r} 0 0 1 ${r2(x1 - r)} ${r2(y1)}H${r2(x0 + r)}A${r} ${r} 0 0 1 ${r2(x0)} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${r2(y0)}Z`

export default function render() {
  return [
    ['path', { d: 'M2 6.5h1.5v10H2M22 6.5h-1.5v10H22', fill: 'none', stroke: C.c2, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: rr(6, 4.5, 18, 18.5, 2), fill: C.tint, stroke: C.c2, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['circle', { cx: 14.5, cy: 8.5, r: 1.5, fill: C.accent, stroke: C.c2, 'stroke-width': 0.8, class: 'wm-a' }],
    ['path', { d: 'M6.8 16.5l3.7-4.5 3 3 1.5-1.5 2.2 3', fill: 'none', stroke: C.c1, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M9.5 21.5h0M12 21.5h0M14.5 21.5h0', fill: 'none', stroke: C.c2, 'stroke-width': 1.8, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
