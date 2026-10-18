// forge/hand/blueprint/gold-ingot.mjs — the drafted gold ingot stack: three whole trapezoid bars, two below and one
// resting across them, with an even 2.5u gap between the rows (the generated drawing crowded the pyramid with corner
// nodes and plate lines, so the bars merged into a muddle). No nodes; the bevel on each bar is a single top-face line.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
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
    ['path', { d: keyArc(200, 262), ...con(0.34) }],
    ['path', { d: 'M2.5 22.5H21.5M2.5 21.5V23.5M21.5 21.5V23.5', ...con(0.5) }],
    ['path', { d: 'M1.85 23.15L3.15 21.85M20.85 23.15L22.15 21.85', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // bottom row: two bars
    ['path', { d: 'M2.5 18.5H10.75L9.6 13H3.65Z', class: 'wm-k' }],
    ['path', { d: 'M13.25 18.5H21.5L20.35 13H14.4Z', class: 'wm-k' }],
    // top bar resting across both
    ['path', { d: 'M7.25 10.5H16.75L15.65 5H8.35Z', class: 'wm-a' }],
    // sparkle off the top bar
    ['path', { d: 'M20.25 3.5V7M18.5 5.25H22', class: 'wm-s' }],
  ]
}
