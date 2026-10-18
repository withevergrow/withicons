// forge/hand/lunar/clipboard-list.mjs — cream rice-paper clipboard with a crimson outline (matching file/archive/book),
// a gold clip, and two bold list rows that hold at 16px.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const rr = (x0, y0, x1, y1, r) => `M${r2(x0 + r)} ${r2(y0)}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${r2(x1)} ${r2(y0 + r)}V${r2(y1 - r)}` +
  `A${r} ${r} 0 0 1 ${r2(x1 - r)} ${r2(y1)}H${r2(x0 + r)}A${r} ${r} 0 0 1 ${r2(x0)} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${r2(y0)}Z`

export default function render() {
  return [
    ['path', { d: rr(4.5, 4.5, 19.5, 21.5, 2), fill: C.tint, stroke: C.c2, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M8 11.5h1.2M8 16.5h1.2', fill: 'none', stroke: C.c1, 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M12 11.5h4.5M12 16.5h4.5', fill: 'none', stroke: C.c2, 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: rr(8.5, 2.5, 15.5, 6.5, 1.2), fill: C.accent, stroke: C.c2, 'stroke-width': 1.4, 'stroke-linejoin': 'round', class: 'wm-s' }],
  ]
}
