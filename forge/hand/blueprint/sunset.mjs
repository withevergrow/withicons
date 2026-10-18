// forge/hand/blueprint/sunset.mjs — the drafted sunset: a short down arrow floating well clear of the half sun, a whole
// ground line and two rays (the generated drawing ran a chain axis from the arrow straight down through the sun to the
// ground and cut the lower ground line to a stub between two rings, so arrow, sun and bar fused into a download icon at
// 16px). Rings sit only on the horizon's ends, the keyline shows faintly at the sides, and one dimension line sits below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const R = v => Math.round(v * 100) / 100

// the Ø20 keyline as a chain (long dash, dot) between two angles (degrees, y down)
function keyArc(a0, a1) {
  const C = [2.4, 0.7, 0.4, 0.7], r = 10, L = (a1 - a0) * Math.PI / 180 * r
  const at = s => { const t = (a0 * Math.PI / 180) + s / r; return `${R(12 + r * Math.cos(t))} ${R(12 + r * Math.sin(t))}` }
  let d = '', s = 0, k = 0
  while (s < L - 0.05) {
    const e = Math.min(L, s + C[k % 4])
    if (k % 2 === 0 && e - s > 0.3) d += `M${at(s)}A10 10 0 0 1 ${at(e)}`
    s = e; k++
  }
  return d
}

export default function render() {
  return [
    ['path', { d: keyArc(162, 242) + keyArc(298, 378), ...con(0.34) }],
    ['path', { d: 'M2.5 23H21.5M2.5 19.1V23.3M21.5 19.1V23.3', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M7.5 17A4.5 4.5 0 0 1 16.5 17M4.25 17H19.75M8 21H16', class: 'wm-k' }],
    ['path', { d: 'M6.6 11.6L5 10M17.4 11.6L19 10', class: 'wm-a' }],
    ['path', { d: 'M12 3V7.5M9.75 5.25L12 7.5L14.25 5.25', class: 'wm-s' }],
    ['path', { d: ring(2.5, 17) + ring(21.5, 17), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
