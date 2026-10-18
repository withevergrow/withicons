// forge/hand/blueprint/layout-list.mjs — two thumbnails beside their text rows, drafted open: the generated drawing
// wrapped this box-like list in a chain keyline circle and stray fillet overshoots on the left edge, so it read as a
// dashed bounding blob at 16px. Here the rows stand clear, the long lines end in a ring each and one dimension runs below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const tile = y => `M4.5 ${y}H7.5A1.5 1.5 0 0 1 9 ${y + 1.5}V${y + 4.5}A1.5 1.5 0 0 1 7.5 ${y + 6}H4.5A1.5 1.5 0 0 1 3 ${y + 4.5}V${y + 1.5}A1.5 1.5 0 0 1 4.5 ${y}Z`

export default function render() {
  return [
    ['path', { d: 'M3 22.9H21M3 21.8V23.3M21 17.5V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.55L3.65 22.25M20.35 23.55L21.65 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: tile(3.5) + tile(14.5), class: 'wm-k' }],
    ['path', { d: 'M13 4.5H19.43M13 8.5H17.5M13 15.5H19.43M13 19.5H17.5', class: 'wm-a' }],
    ['path', { d: ring(21, 4.5) + ring(21, 15.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
