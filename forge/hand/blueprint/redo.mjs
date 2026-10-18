// forge/hand/blueprint/redo.mjs — the forward hook and its head with arrow-sibling nodes over one dimension line;
// replaces the generated drawing whose chain crosshair inside the hook cluttered the curve.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const con = { color: AC, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: AC, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M3.5 22.9H20.5M3.5 20.7V23.3M20.5 20.7V23.3', ...con }],
    ['path', { d: 'M2.85 23.55L4.15 22.25M19.85 23.55L21.15 22.25', ...tick }],
    // hook: shaft from the tip node, half-turn r5.5, tail to its node
    ['path', { d: 'M18.93 9.5H9A5.5 5.5 0 0 0 9 20.5H12.93', class: 'wm-k' }],
    ['path', { d: 'M16.61 5.61L19.39 8.39M19.39 10.61L16.61 13.39', class: 'wm-a' }],
    ['path', { d: ring(20.5, 9.5) + ring(14.5, 20.5), ...node('wm-k') }],
    ['path', { d: ring(15.5, 4.5) + ring(15.5, 14.5), ...node('wm-a') }],
  ]
}
