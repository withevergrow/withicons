// forge/hand/sketch/avatar-boy.mjs — small round head with a spiky tuft and narrow shoulders, kept apart from
// avatar-man (side-part, broad shoulders) at 16px.
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
  const hair = 'M6.9 9.6Q6.7 5.2 10.4 4.6L11.3 2.9L12.6 4.4L14.4 3.1L14.9 5Q17.4 6.2 17.1 9.6M6.9 9.6Q9.6 8.9 11.1 6.8Q13 8.9 17.1 9.6'
  const face = arc(12, 10, 5.15, 172, 8, 0.7)
  const body = 'M7.6 21.6Q7.5 18 12 17.9Q16.5 18 16.4 21.6'
  return [
    ['path', { d: 'M8.6 6.9L9.8 5.8M12.9 5.9L14.2 4.8', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(hair + face + body), ...GHOST, class: 'wm-k' }],
    ['path', { d: hair + face + body, class: 'wm-k' }],
    ['path', { d: 'M10 11h.01M14 11h.01', 'stroke-width': 1.6, class: 'wm-k' }],
    ['path', { d: 'M10.5 13.1Q12 14 13.5 13.1', class: 'wm-k' }],
  ]
}
