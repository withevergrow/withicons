// forge/hand/sketch/video-off.mjs: camera outline broken cleanly around one bold slash; no hatch, no double edges.
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
const TOP = 'M9.3 6.2L13 6.1Q15.5 6.1 15.5 8.6L15.5 10.3L21 7.5L21.1 16.5L18.4 15.1'
const LOW = 'M3.4 7.2L3.3 16.2Q3.3 18 5.2 18L14.2 18.1'
export default function render() {
  return [
    ['path', { d: ghost(TOP, 0.3, -0.3), ...F, class: 'wm-k' }],
    ['path', { d: ghost(LOW, 0.3, -0.3), ...F, class: 'wm-k' }],
    ['path', { d: TOP, class: 'wm-k' }],
    ['path', { d: LOW, class: 'wm-k' }],
    ['path', { d: 'M3.3 3.1Q12.2 11.9 20.8 20.9', ...F, class: 'wm-s' }],
    ['path', { d: 'M3.1 3.2Q12 12 20.9 20.8', 'stroke-width': 1.7, class: 'wm-s' }],
  ]
}
