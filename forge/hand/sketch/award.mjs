// forge/hand/sketch/award.mjs — rosette medal: outer ring, inner ring with a small star, and two separate swallow-tail ribbons.
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
  const outer = arc(12, 8.8, 6.4, 200, 560, 0.5)
  const inner = arc(12, 8.8, 4, 120, 480, 1.3)
  const star = 'M12 6.6L12.7 8.1L14.3 8.3L13.1 9.4L13.4 11L12 10.2L10.6 11L10.9 9.4L9.7 8.3L11.3 8.1Z'
  const tails = 'M8.9 13.5L7.4 21.5L10.2 19.3L11.3 15M12.7 15L13.8 19.3L16.6 21.5L15.1 13.5'
  return [
    ['path', { d: 'M15.2 13.6L16 11.4', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(tails), ...GHOST, class: 'wm-a' }],
    ['path', { d: g(outer), ...GHOST, class: 'wm-k' }],
    ['path', { d: tails, class: 'wm-a' }],
    ['path', { d: outer, class: 'wm-k' }],
    ['path', { d: inner, 'stroke-width': 0.9, class: 'wm-k' }],
    ['path', { d: star, 'stroke-width': 0.8, class: 'wm-s' }],
  ]
}
