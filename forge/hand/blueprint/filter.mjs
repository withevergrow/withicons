// forge/hand/blueprint/filter.mjs — the drafted funnel with crisp mitred rim corners (the generated drawing wrapped the
// funnel in a dashed keyline circle that read as a second ring, and its rounded rim had nowhere for control nodes):
// no keyline circle, rings on the two rim corners, a chain centre line down the cone and stem, dimension line below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M3.5 22.9H20.5M3.5 21.7V23.5M20.5 21.7V23.5', ...con(0.5) }],
    ['path', { d: 'M12 .9v1.8M12 5.4v2.4m0 .7v.4m0 .7v2.4m0 .7v.4m0 .7v2.4m0 .7v.4', ...con(0.5) }],
    ['path', { d: 'M2.85 23.55L4.15 22.25M19.85 23.55L21.15 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M4.49 5.22L10 12V20.5L14 18.5V12L19.51 5.22M5.08 4H18.92', class: 'wm-k' }],
    ['path', { d: ring(3.5, 4) + ring(20.5, 4), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
