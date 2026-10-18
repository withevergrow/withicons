// forge/hand/sketch/avatar-girl.mjs — hair dome with centre-parted bangs and two pigtails that stand clear of the head.
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
  const hair = arc(12, 10, 6.3, 196, 344, 0.5) + 'M6.9 9.8Q9.8 9.4 12 6.6Q14.2 9.4 17.1 9.8'
  const tails = 'M6.2 7.9Q2.4 7.9 2.9 12.8Q3.6 14.4 5.6 12.4M17.8 7.9Q21.6 7.9 21.1 12.8Q20.4 14.4 18.4 12.4'
  const face = arc(12, 10, 5.1, 176, 4, 0.9)
  const body = 'M7.4 21.6Q7.4 18 12 18Q16.6 18 16.6 21.6'
  return [
    ['path', { d: 'M3.9 11.3L5 10.2M19 11.3L20.1 10.2M9.4 6.5L10.6 5.4M13.4 5.4L14.6 4.4', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(hair + tails + face + body), ...GHOST, class: 'wm-k' }],
    ['path', { d: hair + face + body, class: 'wm-k' }],
    ['path', { d: tails, class: 'wm-a' }],
    ['path', { d: 'M10 11.3h.01M14 11.3h.01', 'stroke-width': 1.6, class: 'wm-k' }],
    ['path', { d: 'M10.5 13.4Q12 14.3 13.5 13.4', class: 'wm-k' }],
  ]
}
