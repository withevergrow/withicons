// forge/hand/blueprint/list-filter.mjs — three tapering bars, control nodes only on the full-width top bar, over one
// dimension line; replaces the generated drawing whose chain axis cut every bar and whose middle-bar nodes widened it
// toward the top bar, so the taper (the filter) blurred at 16px.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const con = { color: AC, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: AC, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M3 21H21M3 19.2V21.7M21 19.2V21.7', ...con }],
    ['path', { d: 'M2.35 21.65L3.65 20.35M20.35 21.65L21.65 20.35', ...tick }],
    // the list's full width between its two nodes, then two solid, clearly shorter bars
    ['path', { d: 'M4.58 6H19.43M6.5 12H17.5M9.5 18H14.5', class: 'wm-k' }],
    ['path', { d: ring(3, 6) + ring(21, 6), ...node('wm-k') }],
  ]
}
