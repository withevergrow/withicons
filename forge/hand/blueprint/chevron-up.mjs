// forge/hand/blueprint/chevron-up.mjs — the drafted chevron with an unbroken mitred apex, same recipe as chevron-left/right:
// rings on the two free ends, the centre line starts mid-mouth, and the width dimension runs as a thin baseline below
// (the loose vertical tick beside the apex is gone).
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M6 19.6H18M6 17.4V20.3M18 17.4V20.3', ...con(0.5) }],
    ['path', { d: 'M12 13.1v2.4m0 .7v.4m0 .7v.4', ...con(0.5) }],
    ['path', { d: 'M5.35 20.25L6.65 18.95M17.35 20.25L18.65 18.95', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M7.11 13.89L12 9L16.89 13.89' }],
    ['path', { d: ring(6, 15) + ring(18, 15), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5 }],
  ]
}
