// forge/hand/blueprint/puzzle-piece.mjs — a jigsaw piece with two round knobs (top and right) and a matching socket on
// the left, so it can only be a puzzle piece (the generated one read as a mug); crosshair ticks mark the knob centres.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M4.5 23H17.5M4.5 22.1V23.9M17.5 22.1V23.9', ...con(0.5) }],
    ['path', { d: 'M3.85 23.65L5.15 22.35M16.85 23.65L18.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M10.2 5.5H11.8M11 4.7V6.3M20.5 13.7V15.3M19.7 14.5H21.3', ...con(0.5) }],
    ['path', { d: 'M6.5 8.2H9Q10.1 8.2 10.1 7.2A2.2 2.2 0 1 1 11.9 7.2Q11.9 8.2 13 8.2H15.5A2 2 0 0 1 17.5 10.2V12.3Q17.5 13.4 18.5 13.4A2.2 2.2 0 1 1 18.5 15.2Q17.5 15.2 17.5 16.3V18.7A2 2 0 0 1 15.5 20.7H6.5A2 2 0 0 1 4.5 18.7V16.3Q4.5 15.2 5.5 15.2A2.2 2.2 0 1 0 5.5 13.4Q4.5 13.4 4.5 12.3V10.2A2 2 0 0 1 6.5 8.2Z', class: 'wm-k' }],
  ]
}
