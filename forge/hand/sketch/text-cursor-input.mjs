// forge/hand/sketch/text-cursor-input.mjs: open text field with a left text dash and a crisp serifed I-beam caret that runs past the field.
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
const L = 'M12.2 7.6L4.8 7.5Q2.8 7.5 2.8 9.5L2.9 14.5Q2.9 16.5 4.8 16.5L12.2 16.4'
const R = 'M17 7.5L19.2 7.6Q21.2 7.6 21.2 9.5L21.1 14.5Q21.1 16.4 19.2 16.5L17 16.4'
const DASH = 'M5.6 12Q7.6 11.9 9.5 12'
const CARET = 'M14.6 4.2Q14.5 12 14.6 19.8M12.2 3.9Q14.5 3.8 17 3.9M12.2 20.1Q14.5 20.2 17 20.1'
export default function render() {
  return [
    ['path', { d: ghost(L, 0.3, -0.3), ...F, class: 'wm-k' }],
    ['path', { d: ghost(R, 0.3, -0.3), ...F, class: 'wm-k' }],
    ['path', { d: L, class: 'wm-k' }],
    ['path', { d: R, class: 'wm-k' }],
    ['path', { d: DASH, class: 'wm-k' }],
    ['path', { d: ghost(CARET, 0.25, 0.1), ...F, class: 'wm-a' }],
    ['path', { d: CARET, 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
