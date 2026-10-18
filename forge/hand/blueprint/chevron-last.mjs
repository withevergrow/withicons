// forge/hand/blueprint/chevron-last.mjs — the drafted chevron with an unbroken mitred tip against a full-length stop
// bar; the generated drawing opened the tip around a ring and shortened the bar between two end rings, so at 16px the
// point read gappy and the bar shrank to a stub. Rings now sit only on the free ends of the chevron, the bar runs the
// full height, and the chain centre line starts mid-mouth so it never crosses the bar or reads as a shaft.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M6.5 20.4H17M6.5 20.2V21.1M17 20.2V21.1', ...con(0.5) }],
    ['path', { d: 'M8.9 12h-2.4m-.7 0h-.4m-.7 0h-.4', ...con(0.5) }],
    ['path', { d: 'M5.85 21.05L7.15 19.75M16.35 21.05L17.65 19.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M7.61 7.11L12.5 12L7.61 16.89', class: 'wm-k' }],
    ['path', { d: 'M17 6V18', class: 'wm-a' }],
    ['path', { d: ring(6.5, 6) + ring(6.5, 18), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
