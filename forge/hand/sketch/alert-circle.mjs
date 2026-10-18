// forge/hand/sketch/alert-circle.mjs — open circle with a bold bar and dot; hatching confined to a thin crescent far from the mark.
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
  const ring = arc(12, 12, 9.2, 200, 560, 1.6)
  return [
    ['path', { d: 'M17 17.6L18.5 16M14.6 19.8L17.4 17.6', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(ring), ...GHOST, class: 'wm-k' }],
    ['path', { d: ring, class: 'wm-k' }],
    ['path', { d: 'M12 6.6Q11.8 9.2 12 12.6', 'stroke-width': 1.7, class: 'wm-a' }],
    ['path', { d: 'M12 16.6h.01', 'stroke-width': 2.2, class: 'wm-a' }],
  ]
}
