// forge/hand/blueprint/text-cursor-input.mjs — the input field opened around a serifed I-beam, nodes at the four field
// breaks, one dimension line; replaces the generated drawing whose keyline circle, corner fillet crosses and chain
// centre line crowded the field and cursor into noise at 16px.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const con = { color: AC, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: AC, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M2 22.9H22M2 19.2V23.3M22 19.2V23.3', ...con }],
    ['path', { d: 'M1.35 23.55L2.65 22.25M21.35 23.55L22.65 22.25', ...tick }],
    // field: two rounded halves stopping at the nodes either side of the cursor
    ['path', { d: 'M9.93 17H4A2 2 0 0 1 2 15V9A2 2 0 0 1 4 7H9.93M19.08 7H20A2 2 0 0 1 22 9V15A2 2 0 0 1 20 17H19.08', class: 'wm-k' }],
    ['path', { d: ring(11.5, 7) + ring(11.5, 17) + ring(17.5, 7) + ring(17.5, 17), ...node('wm-k') }],
    // typed text and the I-beam cursor
    ['path', { d: 'M5.5 12H8.5M12.5 3.5H16.5M14.5 3.5V20.5M12.5 20.5H16.5', class: 'wm-a' }],
  ]
}
