// forge/hand/sketch/radar.mjs — scope with an outer ring, a range ring, a hatched sweep wedge and a blip,
// so it reads as radar (not a clock) at 16px.
const R = (v) => Math.round(v * 100) / 100
const P = (pts) => pts.map(([x, y]) => `${R(x)} ${R(y)}`)
// hand-wobbled arc as a smooth quadratic chain (angles in degrees, SVG orientation)
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
const smooth = (pts) => {
  let d = `M${R(pts[0][0])} ${R(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]
    d += `Q${R(pts[i][0])} ${R(pts[i][1])} ${R(m[0])} ${R(m[1])}`
  }
  const l = pts[pts.length - 1]
  return d + `L${R(l[0])} ${R(l[1])}`
}
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const rings = arc(12, 12, 9.2, -100, 268, 1.9) + arc(12, 12, 5, -80, 285, 1.3)
  return [
    ['path', { d: 'M13 6.4L14.4 5M13.3 8.4L16 5.7M14.6 9.2L17 6.8', ...HATCH, class: 'wm-a' }],
    ['path', { d: g(rings), ...GHOST, class: 'wm-k' }],
    ['path', { d: rings, class: 'wm-k' }],
    ['path', { d: 'M12 12L18.3 5.7', class: 'wm-a' }],
    ['path', { d: 'M12 12h.01M7.9 16.4h.01', 'stroke-width': 2.4, class: 'wm-s' }],
  ]
}
