// forge/hand/sketch/users.mjs: two people with a clear gap: a full front figure and a back figure drawn only as
// the open right-hand arcs of head and shoulders, so nothing overlaps or hatches over the overlap.
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
  const head = arc(9, 8, 3.6, -90, 272, 0.4)
  const body = 'M2.4 21.4Q2.3 15.7 9 15.7Q15.7 15.7 15.6 21.4'
  const bHead = arc(16.6, 8, 3.2, -118, 92, 1.1)
  const bBody = 'M18 15.9Q21.8 16.4 21.7 21.4'
  return [
    ['path', { d: 'M4.8 20.4L6.4 18.6M7.5 21L8.8 19.6', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(head + body), ...GHOST, class: 'wm-k' }],
    ['path', { d: head + body, class: 'wm-k' }],
    ['path', { d: bHead + bBody, class: 'wm-a' }],
  ]
}
