// forge/hand/blueprint/hard-drive.mjs — a drive casing with a divider, two status lights and a width dimension.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const dot = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}Z`

export default function render() {
  return [
    ['path', { d: 'M2.5 20.5H21.5M2.5 19.7V21.3M21.5 19.7V21.3', ...con(0.5) }],
    ['path', { d: 'M5 5H19L21.5 12V17.5H2.5V12ZM2.5 12H21.5', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: dot(6, 14.75, 0.7) + dot(9, 14.75, 0.7), fill: ACCENT, stroke: 'none', class: 'wm-s' }],
    ['path', { d: 'M13 14.75H18.5', class: 'wm-a' }],
  ]
}
