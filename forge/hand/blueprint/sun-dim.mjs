// forge/hand/blueprint/sun-dim.mjs — the drafted dim sun (the generated drawing circled it with a keyline and ran
// chain centre lines through the core, a crosshair that turned the sun into a target and added a second ring of marks
// between the rays at 16px): a clean core with eight short square rays, and only the width dimension below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3.5 22.9H20.5M3.5 21V23.3M20.5 21V23.3', ...con(0.5) }],
    ['path', { d: 'M2.85 23.55L4.15 22.25M19.85 23.55L21.15 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M16 12A4 4 0 0 1 8 12A4 4 0 0 1 16 12Z', class: 'wm-k' }],
    ['path', { d: 'M12 4.5V3.5M17.25 6.75L18 6M19.5 12H20.5M17.25 17.25L18 18M12 19.5V20.5M6.75 17.25L6 18M4.5 12H3.5M6.75 6.75L6 6', class: 'wm-a' }],
  ]
}
