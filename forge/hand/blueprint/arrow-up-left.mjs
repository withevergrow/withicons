// forge/hand/blueprint/arrow-up-left.mjs — the drafted diagonal arrow with a solid mitred head corner (the generated
// drawing hollowed the tip with a control ring and hung a dimension line under the arrow, cluttering it at 16px):
// rings stay on the tail and the two head ends, and a chain centre line runs on out of the tail along the shaft's axis.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M19.1 19.1l1.7 1.7m.49.49l.29.29', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: 'M16.39 16.39L7.6 7.6', class: 'wm-k' }],
    ['path', { d: 'M14.43 6.5H6.5V14.43', class: 'wm-a' }],
    ['path', { d: ring(17.5, 17.5), ...node('wm-k') }],
    ['path', { d: ring(16, 6.5) + ring(6.5, 16), ...node('wm-a') }],
  ]
}
