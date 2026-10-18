// forge/hand/blueprint/chevrons-up.mjs — two drafted chevrons with unbroken mitred tips; the generated drawing opened both
// tips around control rings and ran a chain centre line through them, so at 16px the points read gappy and the pair
// blurred into a roof. Rings now sit only on the four free ends and the width dimension stays below, clear of the mouths.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M6 20.6H18M6 20.2V21.3M18 20.2V21.3', ...con(0.5) }],
    ['path', { d: 'M5.35 21.25L6.65 19.95M17.35 21.25L18.65 19.95', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M7.11 10.89L12 6L16.89 10.89', class: 'wm-k' }],
    ['path', { d: 'M7.11 16.89L12 12L16.89 16.89', class: 'wm-a' }],
    ['path', { d: ring(6, 12) + ring(18, 12), ...node('wm-k') }],
    ['path', { d: ring(6, 18) + ring(18, 18), ...node('wm-a') }],
  ]
}
