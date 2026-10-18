// forge/hand/blueprint/avatar-monster-fluffy.mjs — the drafted fluffy monster: a round body with a soft scalloped fur edge
// (ten round bumps, not points), two eyes and a grin with two fangs. The previous drawing used six big pointed tufts that
// read as a star or flower; here the bumps are arcs so the outline reads as fluff, and the grin keeps its fangs.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const f = v => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, '$1.')
const R = Math.PI / 180

// ten bumps: cusps on r 8.6 at -72 + 36k degrees, each joined by an outward arc, so a bump sits at the very top
function fur() {
  const cx = 12, cy = 11.5, rc = 8.6, N = 10, ra = 2.9
  const P = a => `${f(cx + rc * Math.cos(a * R))} ${f(cy + rc * Math.sin(a * R))}`
  let d = 'M' + P(-72)
  for (let i = 1; i <= N; i++) d += `A${ra} ${ra} 0 0 1 ${P(-72 + 36 * i)}`
  return d + 'Z'
}

export default function render() {
  return [
    ['path', { d: 'M6.2 23H17.8', ...con(0.5) }],
    ['path', { d: 'M3.85 23.65L5.15 22.35M18.85 23.65L20.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: fur(), class: 'wm-k' }],
    // eyes
    ['path', { d: 'M9 8.5V10.75M15 8.5V10.75', class: 'wm-a' }],
    // grin with two fangs
    ['path', { d: 'M7.75 12.75C10.5 14.3 13.5 14.3 16.25 12.75', class: 'wm-k' }],
    ['path', { d: 'M9 13.55L9.9 16.2L10.8 14.05M13.2 14.05L14.1 16.2L15 13.55', class: 'wm-k' }],
  ]
}
