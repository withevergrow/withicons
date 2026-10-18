// forge/hand/sketch/angry.mjs — clean round face, two bold inward-slanted brows, plain eyes and a flat frown; no face hatching.
const R = (v) => Math.round(v * 100) / 100
const smooth = (pts) => {
  let d = `M${R(pts[0][0])} ${R(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]
    d += `Q${R(pts[i][0])} ${R(pts[i][1])} ${R(m[0])} ${R(m[1])}`
  }
  const l = pts[pts.length - 1]
  return d + `L${R(l[0])} ${R(l[1])}`
}
// hand-wobbled arc (degrees, SVG orientation)
const arc = (cx, cy, r, a0, a1, ph = 0) => {
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 18))
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180
    const rr = r * (1 + 0.03 * Math.sin(a * 3 + ph))
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  return smooth(pts)
}
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const face = arc(12, 12, 9.2, 200, 560, 0.4)
  return [
    ['path', { d: 'M5.6 19.2L7.4 17.6M17 19.4L18.6 17.8', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(face), ...GHOST, class: 'wm-k' }],
    ['path', { d: face, class: 'wm-k' }],
    ['path', { d: 'M6.9 8.1Q8.7 8.9 10.6 10.2M17.1 8.1Q15.3 8.9 13.4 10.2', 'stroke-width': 1.7, class: 'wm-a' }],
    ['path', { d: 'M8.9 12.9h.01M15.1 12.9h.01', 'stroke-width': 2, class: 'wm-k' }],
    ['path', { d: 'M8.9 18Q12 15.7 15.1 18', class: 'wm-k' }],
  ]
}
