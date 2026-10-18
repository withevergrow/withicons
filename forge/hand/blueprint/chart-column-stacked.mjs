// forge/hand/blueprint/chart-column-stacked.mjs — three drafted columns on a clear baseline, each split by segment dividers
// (one, two and one) so they read as stacked, with a faint dashed ghost of the full height above the short columns and
// the sibling construction ticks and baseline end rings of chart-bar. The generated drawing had no visible stack splits.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}`
const col = (x, top, bot) => `M${x} ${bot}V${top + 1}A1 1 0 0 1 ${x + 1} ${top}H${x + 3}A1 1 0 0 1 ${x + 4} ${top + 1}V${bot}`

export default function render() {
  return [
    ['path', { d: 'M12 2.4V1.4M2.4 3.5H3.6M20.4 3.5H21.6M2.4 12H3.6M20.4 8H21.6', ...con(0.5) }],
    ['path', { d: 'M4.5 22.9H19.5M4.5 22.4V23.4M19.5 22.4V23.4', ...con(0.5) }],
    ['path', { d: 'M3.85 23.55L5.15 22.25M18.85 23.55L20.15 22.25', ...con(0.75, 0.5) }],
    ['path', { d: 'M3.5 10.5V3.5H7.5V10.5M16.5 7V3.5H20.5V7', ...con(0.35, 0.4), 'stroke-dasharray': '0.9 1.3' }],
    ['path', { d: col(3.5, 11, 20.5) + col(10, 3.5, 20.5) + col(16.5, 7.5, 20.5), class: 'wm-k' }],
    ['path', { d: 'M3.5 16H7.5M10 8.5H14M10 14.5H14M16.5 14H20.5', class: 'wm-k' }],
    ['path', { d: 'M3.3 20.5H20.7', class: 'wm-a' }],
    ['path', { d: ring(2.5, 20.5, 0.8) + ring(21.5, 20.5, 0.8), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
