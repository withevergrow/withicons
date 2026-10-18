// forge/hand/blueprint/chevron-left.mjs — the drafted chevron with an unbroken mitred tip (the generated drawing broke
// the line open at the tip for a control ring, so the point read faint and gappy): rings sit on the two free ends, the
// centre line starts mid-mouth so it never reads as a shaft, and the depth dimension stays below, clear of the glyph.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M9 20.4H15M9 18.2V21.1M15 20.3V21.1', ...con(0.5) }],
    ['path', { d: 'M13.1 12h2.4m.7 0h.4m.7 0h.4', ...con(0.5) }],
    ['path', { d: 'M8.35 21.05L9.65 19.75M14.35 21.05L15.65 19.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M13.89 7.11L9 12L13.89 16.89' }],
    ['path', { d: ring(15, 6) + ring(15, 18), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5 }],
  ]
}
