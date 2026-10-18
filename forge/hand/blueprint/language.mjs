// forge/hand/blueprint/language.mjs — the CJK glyph beside a Latin A with a solid mitred apex (the generated drawing
// broke the A open at its point for a control ring, so at 16px the letter lost its tip and read as a stray chevron with
// dots): rings sit on the four free feet, mirror-paired, and one unbroken dimension spans both glyphs.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 16.6V23.3M21.5 22.4V23.3', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M2.5 6H12.5M7.5 3V6M11 6C10.56 10.42 8.17 13.27 4.51 14.57M4 6C4.86 10.07 7.18 12.67 10.02 13.96', class: 'wm-k' }],
    ['path', { d: ring(3, 15) + ring(11.5, 14.5), ...node('wm-k') }],
    ['path', { d: 'M14.08 19.54L17.5 11L20.92 19.54M15 17.5H20', class: 'wm-a' }],
    ['path', { d: ring(13.5, 21) + ring(21.5, 21), ...node('wm-a') }],
  ]
}
