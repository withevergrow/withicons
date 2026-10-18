// forge/hand/blueprint/chevron-right.mjs — the drafted chevron with an unbroken mitred tip (the generated drawing broke
// the line open at the tip for a control ring, so the point read faint and gappy): rings sit on the two free ends, the
// centre line starts mid-mouth so it never reads as a shaft, and the depth dimension stays below, clear of the glyph.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M9 20.4H15M9 20.3V21.1M15 18.2V21.1', ...con(0.5) }],
    ['path', { d: 'M10.9 12h-2.4m-.7 0h-.4m-.7 0h-.4', ...con(0.5) }],
    ['path', { d: 'M8.35 21.05L9.65 19.75M14.35 21.05L15.65 19.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M10.11 7.11L15 12L10.11 16.89' }],
    ['path', { d: ring(9, 6) + ring(9, 18), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5 }],
  ]
}
