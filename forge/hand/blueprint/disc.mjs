// forge/hand/blueprint/disc.mjs — the drafted disc as a rim, a clear centre hub and two opposed glint arcs on the
// playing surface (the generated drawing ran chain centre lines through the disc and a centre mark inside the hub,
// so rim, hub and single arc read as a target or crosshair): no axes cross the face, only the dimension stays below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 21.7V23.3M21.5 21.7V23.3', ...con }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', ...tick }],
    // rim
    ['path', { d: 'M21.5 12A9.5 9.5 0 0 1 2.5 12A9.5 9.5 0 0 1 21.5 12Z', class: 'wm-k' }],
    // hub and the two glints that sweep round with the spin
    ['path', { d: 'M14.5 12A2.5 2.5 0 0 1 9.5 12A2.5 2.5 0 0 1 14.5 12ZM6.09 10.96A6 6 0 0 1 10.96 6.09M17.91 13.04A6 6 0 0 1 13.04 17.91', class: 'wm-a' }],
  ]
}
