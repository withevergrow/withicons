// forge/hand/sketch/user-search.mjs: pencil bust with a bold magnifier set clear of the shoulder line.
const r2 = n => Math.round(n * 100) / 100
// hand-wobbled circle as an open stroke that overshoots its start slightly (pencil lap); smooth Catmull-Rom cubics
function loop(cx, cy, r, { n = 12, a0 = -1.9, over = 0.5, w = 0.022, ph = 0, ry = 1 } = {}) {
  const pts = []
  const total = Math.PI * 2 + over
  const m = n + 1
  for (let i = 0; i <= m; i++) {
    const t = i / m, a = a0 + t * total
    const k = 1 + w * Math.sin(3 * a + ph) + w * 0.6 * Math.sin(5 * a + ph * 2) - (t > 0.9 ? 0.03 * (t - 0.9) * 10 : 0)
    pts.push([cx + r * k * Math.cos(a), cy + r * ry * k * Math.sin(a)])
  }
  let d = `M${r2(pts[0][0])} ${r2(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    d += `C${r2(p1[0] + (p2[0] - p0[0]) / 6)} ${r2(p1[1] + (p2[1] - p0[1]) / 6)} ${r2(p2[0] - (p3[0] - p1[0]) / 6)} ${r2(p2[1] - (p3[1] - p1[1]) / 6)} ${r2(p2[0])} ${r2(p2[1])}`
  }
  return d
}
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const F = { "stroke-width": 0.5, "stroke-opacity": 0.5 }
const SH = 'M2.2 21.4C2.1 18.4 3.9 15.9 6.6 15.7L8.4 15.7C9.9 15.8 10.9 16.6 11.5 17.6'
export default function render() {
  return [
    ['path', { d: ghost(SH, 0.3, -0.3), ...F, class: 'wm-k' }],
    ['path', { d: loop(8.6, 7.7, 3.6, { a0: -2, over: 0.5, ph: 1, w: 0.015 }), ...F, class: 'wm-k' }],
    ['path', { d: loop(8.5, 7.6, 3.5, { a0: -2.4, over: 0.5, ph: 0, w: 0.015 }), class: 'wm-k' }],
    ['path', { d: SH, class: 'wm-k' }],
    ['path', { d: loop(16.8, 15.7, 3.9, { a0: -2.2, over: 0.4, ph: 2, w: 0.015 }), 'stroke-width': 1.6, class: 'wm-s' }],
    ['path', { d: 'M19.7 18.7Q21 20 22 21.2', 'stroke-width': 2.2, class: 'wm-s' }],
  ]
}
