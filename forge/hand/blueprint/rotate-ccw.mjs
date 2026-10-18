// forge/hand/blueprint/rotate-ccw.mjs — the counter-clockwise arc and its corner arrowhead alone over a dimension
// line; replaces the generated drawing whose chain crosshair through the centre competed with the arc.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const con = { color: AC, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: AC, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M3.5 23H20.48M3.5 21.06V23.3M20.48 21.06V23.3', ...con }],
    ['path', { d: 'M2.85 23.65L4.15 22.35M19.83 23.65L21.13 22.35', ...tick }],
    // arc about (11.98, 12.36), r 8.5, from the tail node round to the arrow corner
    ['path', { d: 'M3.76 14.55A8.5 8.5 0 1 0 5 7.5', class: 'wm-k' }],
    // arrowhead: a square corner on the arc end, its two legs opened for nodes
    ['path', { d: 'M5 4.08V7.5H8.43', class: 'wm-a' }],
    ['path', { d: ring(3.5, 13), ...node('wm-k') }],
    ['path', { d: ring(5, 2.5) + ring(10, 7.5), ...node('wm-a') }],
  ]
}
