// forge/hand/sketch/avatar-person.mjs: a round head with two widely spaced bold dot eyes and a short smile
// (no extra features so the face stays open at 16px), over broad pencil shoulders.
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
  const head = arc(12, 8.8, 5, -90, 275, 0.6)
  const body = 'M4.6 21.6Q4.5 16.9 9 16.8Q12 17.8 15 16.8Q19.5 16.9 19.4 21.6'
  return [
    ['path', { d: 'M7.6 18.6L6.4 20M17.4 18.6L18.6 20', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(head + body), ...GHOST, class: 'wm-k' }],
    ['path', { d: head + body, class: 'wm-k' }],
    ['path', { d: 'M10 8.4h.01M14 8.4h.01', 'stroke-width': 1.6, class: 'wm-k' }],
    ['path', { d: 'M10.6 11.1Q12 12 13.4 11.1', class: 'wm-k' }],
  ]
}
