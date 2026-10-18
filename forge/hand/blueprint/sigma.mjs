// forge/hand/blueprint/sigma.mjs — the drafted sigma as one unbroken mitred stroke (the generated drawing cut the glyph
// open at all five vertices for control rings and ran a chain axis through its middle point, so it read as loose dashes
// at 16px): the letter stays whole with its two serifs, accent node rings sit just past both serif tips, a short chain
// stub rests in the open side of the middle vertex, and one dimension line under it carries the drafting.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M6 22.5H17.5M6 22V23.2M17.5 21.4V23.2', ...con(0.5) }],
    ['path', { d: 'M5.35 23.15L6.65 21.85M16.85 23.15L18.15 21.85', ...con(0.75, 0.5) }],
    ['path', { d: 'M10.6 12H9.2M8.5 12H8.1', ...con(0.5) }],
    ['path', { d: 'M17.5 6.5V4H6L12.5 12L6 20H17.5V17.5', class: 'wm-k' }],
    // node rings just past the square caps of the two serif tips
    ['path', { d: ring(17.5, 8.35) + ring(17.5, 15.65), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
}
