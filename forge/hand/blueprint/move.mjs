// forge/hand/blueprint/move.mjs — four equal closed chevrons on a cross whose crossing is one datum node; replaces the
// generated drawing whose nodes clipped only the top and bottom heads, leaving a lopsided cross with stubby heads.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const con = { color: AC, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: AC, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    // one dimension line under the cross
    ['path', { d: 'M3 23H21M3 21.2V23.3M21 21.2V23.3', ...con }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', ...tick }],
    // the four arms, opened at the centre for the datum node; they stop 0.9u short of each tip so their square caps
    // hide inside the mitred chevron point
    ['path', { d: 'M12 3.9V10.43M12 13.57V20.1M3.9 12H10.43M13.57 12H20.1', class: 'wm-k' }],
    // four equal closed chevrons (3u legs), sharp mitred points
    ['path', { d: 'M9 6L12 3L15 6M18 9L21 12L18 15M15 18L12 21L9 18M6 15L3 12L6 9', class: 'wm-a' }],
    ['path', { d: ring(12, 12), ...node('wm-k') }],
  ]
}
