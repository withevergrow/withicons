// forge/hand/sketch/target.mjs: three hand-wobbled concentric rings (outer, middle, bullseye) like line, each closed with a small pencil overshoot.
const r2 = v => Math.round(v * 100) / 100
function ring(cx, cy, r, a0, ph, over) {
  const n = 16, sweep = Math.PI * 2 + over
  const p = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + t * sweep
    const rr = r * (1 + 0.028 * Math.sin(a * 2 + ph) + 0.015 * Math.sin(a * 5 + ph * 2)) - 0.35 * t
    p.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  let d = `M${r2(p[0][0])} ${r2(p[0][1])}`
  for (let i = 1; i < n; i++) { const q = m(p[i], p[i + 1]); d += `Q${r2(p[i][0])} ${r2(p[i][1])} ${r2(q[0])} ${r2(q[1])}` }
  return d + `L${r2(p[n][0])} ${r2(p[n][1])}`
}
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  return [
    ['path', { d: ring(12.3, 11.8, 9.5, -2.2, 1.7, 0.3), ...F, class: 'wm-k' }],
    ['path', { d: ring(12.3, 11.8, 5.5, 0.4, 3.1, 0.3), ...F, class: 'wm-a' }],
    ['path', { d: ring(12, 12, 9.5, -2.4, 0.2, 0.45), class: 'wm-k' }],
    ['path', { d: ring(12, 12, 5.5, 0.2, 1.4, 0.4), class: 'wm-a' }],
    ['path', { d: ring(12, 12, 1.1, 0, 0.5, 0.3), fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }],
  ]
}
