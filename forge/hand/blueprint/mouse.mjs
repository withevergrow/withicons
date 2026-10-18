// forge/hand/blueprint/mouse.mjs — a computer mouse, not a dial: the capsule body with its cable, a scroll wheel
// seated in the button split and the cross-line under the buttons. The generated drawing's guide circle and
// crosshair ticks ran through the body and made it read as a clock; the only drafting left sits outside it.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M5.5 23H18.5M5.5 21.6V24.2M18.5 21.6V24.2', ...con(0.5) }],
    ['path', { d: 'M4.85 23.65L6.15 22.35M17.85 23.65L19.15 22.35', ...con(0.75), 'stroke-width': 0.5 }],
    ['path', { d: 'M12 5C6.5 5 6 8.5 6 11V15A6 6 0 0 0 18 15V11C18 8.5 17.5 5 12 5Z', class: 'wm-k' }],
    ['path', { d: 'M12 5C12 2.6 15.2 3.4 15.2 1', class: 'wm-k' }],
    ['path', { d: 'M6 11.6H18', class: 'wm-a' }],
    ['path', { d: 'M11.1 7H12.9A.4.4 0 0 1 13.3 7.4V9.6A.4.4 0 0 1 12.9 10H11.1A.4.4 0 0 1 10.7 9.6V7.4A.4.4 0 0 1 11.1 7Z', fill: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: ring(6, 11.6) + ring(18, 11.6), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
