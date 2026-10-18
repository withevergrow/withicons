// forge/hand/blueprint/superscript.mjs — x-squared drafted as a glyph: a plain, square-ended X on the baseline and a smaller
// 2 raised against the X's top-right (the generated drawing hung node dots on the X ends and floated the 2 on a crosshair).
// Only the baseline dimension stays as construction.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3 22.4H13.5M3 21.4V23.4M13.5 21.4V23.4', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M12.85 23.65L14.15 22.35', ...con(0.75, 0.5) }],
    // the X, bold and square-ended, sitting on the baseline
    ['path', { d: 'M3 10L13.5 20M13.5 10L3 20', class: 'wm-k' }],
    // the raised 2
    ['path', { d: 'M15.75 5.5A2.75 2.75 0 0 1 21.25 5.5C21.25 7 20.4 8.1 15.75 10.5H21.5', class: 'wm-a' }],
  ]
}
