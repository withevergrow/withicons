// forge/hand/sketch/webcam.mjs: round head with a concentric lens ring and pupil, a straight stem and a flat base; no hatch.
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
export default function render() {
  return [
    ['path', { d: loop(12.1, 9.6, 7.3, { a0: -1.6, over: 0.35, ph: 2 }), ...F, class: 'wm-k' }],
    ['path', { d: loop(12, 9.5, 7.2, { a0: -2.2, over: 0.5, ph: 0 }), class: 'wm-k' }],
    ['path', { d: loop(12, 9.5, 3.4, { a0: -1.2, over: 0.5, ph: 1.5, w: 0.015 }), class: 'wm-a' }],
    ['path', { d: 'M11.9 9.1Q12.1 9.5 12.1 9.9', 'stroke-width': 1.9, class: 'wm-a' }],
    ['path', { d: 'M12 16.8Q11.9 18.9 12.1 21', class: 'wm-k' }],
    ['path', { d: 'M12.3 17Q12.2 19 12.3 21', ...F, class: 'wm-k' }],
    ['path', { d: 'M6.6 21.2Q12 21 17.4 21.3', class: 'wm-k', 'stroke-width': 1.7 }],
  ]
}
