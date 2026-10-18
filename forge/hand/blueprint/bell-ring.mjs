// forge/hand/blueprint/bell-ring.mjs — the drafted bell with its two ring arcs drawn whole (the generated drawing laid
// the Ø20 keyline circle right over the ring arcs, so they merged into one big dial, and ran a full crosshair through
// the bell): no keyline, no crosshair; control rings stay on the flared rim corners, a short chain axis marks the hang
// point above the dome, and the width dimension sits below the clapper.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 21.2V23.22M21.5 21.2V23.22', ...con(0.5) }],
    ['path', { d: 'M12 1.3v2.4', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M17.93 18.5H6.07M5.45 17.24L6 16.5V11A6 6 0 0 1 18 11V16.5L18.56 17.24', class: 'wm-k' }],
    ['path', { d: 'M9.5 18.5A2.5 2.5 0 0 0 14.5 18.5', class: 'wm-a' }],
    ['path', { d: 'M2.5 9.5A10 10 0 0 1 5.5 3.5M21.5 9.5A10 10 0 0 0 18.5 3.5', class: 'wm-s' }],
    ['path', { d: ring(19.5, 18.5) + ring(4.5, 18.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
