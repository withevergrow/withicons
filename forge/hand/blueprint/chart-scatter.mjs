// forge/hand/blueprint/chart-scatter.mjs — L-shaped drafted axis at lower left with four plotted points, each an open
// technical circle, and a dimension line under the baseline (the dashed trend line and diagonals are gone).
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}`

export default function render() {
  return [
    ['path', { d: 'M3.5 23H20.5M3.5 21.7V23.3M20.5 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.85 23.65L4.15 22.35M19.85 23.65L21.15 22.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M3.5 5.08V18.5A2 2 0 0 0 5.5 20.5H18.93', class: 'wm-a' }],
    ['path', { d: ring(8.25, 15.75, 1.4) + ring(11.5, 8.5, 1.4) + ring(15.75, 12.75, 1.4) + ring(18.75, 5.5, 1.4), 'stroke-width': 1, class: 'wm-k' }],
    ['path', { d: ring(3.5, 3.5, 0.8) + ring(21.3, 20.5, 0.8), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
