// forge/hand/sketch/user.mjs: a clean open head circle (no hatch inside) floating clear above broad pencil shoulders.
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
// hand-wobbled arc (angles in degrees, SVG orientation); a full circle overshoots slightly like a pencil loop
const arc = (cx, cy, r, a0, a1, ph = 0) => {
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 18))
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180
    const rr = r * (1 + 0.025 * Math.sin(a * 3 + ph))
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  return smooth(pts)
}
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const head = arc(12, 8, 4.3, -90, 272, 0.5)
  const body = 'M4.4 21.4Q4.3 15.6 12 15.6Q19.7 15.6 19.6 21.4'
  return [
    ['path', { d: 'M7 20.4L8.8 18.4M9.9 21L11.2 19.6', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(head + body), ...GHOST, class: 'wm-k' }],
    ['path', { d: head + body, class: 'wm-k' }],
  ]
}
