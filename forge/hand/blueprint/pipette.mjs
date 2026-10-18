// forge/hand/blueprint/pipette.mjs — the drafted eyedropper with its nozzle taper and rubber bulb. The generated drawing
// kept the skeleton's blunt chisel tip and a barrel as wide as the bulb, with a centre mark crossing the bulb and the
// keyline circling the whole tool, so at 16-24px it read as a felt pen in a cluttered ring: here a needle nozzle (control
// ring at its tip) opens in a 60° cone into a glass barrel, a wide collar bar stops it, and a fatter round-ended bulb sits
// on top; like the other drafted tools (edit, eraser) the keyline is dropped and only the width dimension remains.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3.25 23H20.6M20.6 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.6 23.65L3.9 22.35M19.95 23.65L21.25 22.35', ...con(0.75, 0.5) }],
    // nozzle, cone and glass barrel, and the collar bar
    ['path', { d: 'M3.92 20.08L5.55 18.45M11.56 9.61L6.61 14.56L5.55 18.45L9.44 17.39L14.39 12.44M10.67 8.73L15.27 13.33', class: 'wm-k' }],
    // the rubber bulb
    ['path', { d: 'M11.2 9.26L16.33 4.13A2.5 2.5 0 0 1 19.87 7.67L14.74 12.8', class: 'wm-a' }],
    ['path', { d: ring(3.25, 20.75), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
