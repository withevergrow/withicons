// forge/hand/blueprint/chevrons-down.mjs — two drafted chevrons with unbroken mitred tips; the generated drawing opened
// both points around control rings and ran a chain centre line between them, so the leading tips read faint at 16px.
// Rings now sit only on the four free ends and the width dimension stays below, spanning the mouths, clear of the tip.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M6 20.6H18M6 20.2V21.3M18 20.2V21.3', ...con(0.5) }],
    ['path', { d: 'M5.35 21.25L6.65 19.95M17.35 21.25L18.65 19.95', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M7.11 7.11L12 12L16.89 7.11', class: 'wm-k' }],
    ['path', { d: 'M7.11 13.11L12 18L16.89 13.11', class: 'wm-a' }],
    ['path', { d: ring(6, 6) + ring(18, 6), ...node('wm-k') }],
    ['path', { d: ring(6, 12) + ring(18, 12), ...node('wm-a') }],
  ]
}
