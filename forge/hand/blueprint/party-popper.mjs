// forge/hand/blueprint/party-popper.mjs — the drafted party popper: a big whole mitred cone with a clear mouth rim and a
// stripe band, and exactly three simple confetti marks (a dot, a dash, a star) floating clear of the cone (the generated
// drawing had a small cone and a scatter of squiggles that merged into stray shapes at 16px). The keyline and one
// dimension line under the cone stay faint behind.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const R = v => Math.round(v * 100) / 100
const dot = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}`

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
    ['path', { d: keyArc(188, 250), ...con(0.34) }],
    ['path', { d: 'M3 23H16.5M3 22.3V23.3M16.5 20.3V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M15.85 23.65L17.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // cone and its mouth rim
    ['path', { d: 'M3 21L8.5 7L17 15.5Z', class: 'wm-k' }],
    // stripe band across the cone
    ['path', { d: 'M6.85 11.2L12.8 17.15', class: 'wm-a' }],
    // confetti: a dot, a dash and a star
    ['path', { d: dot(13.75, 4.5, 0.9), class: 'wm-s' }],
    ['path', { d: 'M17.25 7.25L19.25 9.25', class: 'wm-s' }],
    ['path', { d: 'M20.5 11.25V14.75M18.75 13H22.25', class: 'wm-s' }],
  ]
}
