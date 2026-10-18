// forge/hand/sketch/accessibility.mjs — open circle with a symmetric universal-access figure: head dot, level arms, straight torso, spread legs.
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
  const ring = arc(12, 12, 9.2, 200, 560, 0.9)
  return [
    ['path', { d: 'M16.6 17.8L18.1 16.2M13.4 20.3L16 18.3', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(ring), ...GHOST, class: 'wm-k' }],
    ['path', { d: ring, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 6.9, r: 1.15, class: 'wm-a' }],
    ['path', { d: 'M6.8 10.1Q12 11.1 17.2 10.1', class: 'wm-a' }],
    ['path', { d: 'M12 10.6Q12.1 12.6 12 14.2M12 14.2L9.4 18.4M12 14.2L14.6 18.4', class: 'wm-a' }],
  ]
}
