// forge/hand/blueprint/chart-bar.mjs — three plain drafted bars standing on a clear baseline. The generated drawing ran
// the dashed keyline circle around the chart (a box-like object that should not have one) and broke the bar tops open
// for control rings at the step corners, so the bars read as loose fragments in a target. Here the bar outline is
// unbroken with its fillet construction, the baseline ends carry the control rings, and the dimension spans the bars.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M9.5 3.1V1.9M7.4 4H8.6M15.4 4H16.6M14.5 1.9V3.1M20.4 8.5H21.6M19.5 6.4V7.6M4.5 11.1V9.9M2.4 12H3.6', ...con(0.5) }],
    ['path', { d: 'M4.5 22.9H19.5M4.5 22.4V23.4M19.5 22.4V23.4', ...con(0.5) }],
    ['path', { d: 'M3.85 23.55L5.15 22.25M18.85 23.55L20.15 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M4.5 20.5V13.5A1.5 1.5 0 0 1 6 12H9.5V5.5A1.5 1.5 0 0 1 11 4H13A1.5 1.5 0 0 1 14.5 5.5V8.5H18A1.5 1.5 0 0 1 19.5 10V20.5M9.5 12V20.5M14.5 8.5V20.5', class: 'wm-k' }],
    ['path', { d: 'M3.3 20.5H20.7', class: 'wm-a' }],
    ['path', { d: ring(2.5, 20.5) + ring(21.5, 20.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
