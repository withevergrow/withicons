// forge/hand/sketch/smile-plus.mjs — clean smiley (bold eyes, clear smile, no hatch) with a same-weight plus tucked at the shoulder.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
const arc = (cx, cy, r, a0, a1, ph = 0) => {
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 18))
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180
    const rr = r * (1 + 0.025 * Math.sin(a * 3 + ph))
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  let d = `M${R(pts[0][0])} ${R(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]
    d += `Q${R(pts[i][0])} ${R(pts[i][1])} ${R(m[0])} ${R(m[1])}`
  }
  const l = pts[pts.length - 1]
  return d + `L${R(l[0])} ${R(l[1])}`
}
export default function render() {
  const face = arc(10.4, 13.6, 7.4, -40, 322, 0.6)
  return [
    ['path', { d: g(face), ...GHOST, class: 'wm-k' }],
    ['path', { d: face, class: 'wm-k' }],
    ['path', { d: 'M7.8 11.8h.01M13 11.8h.01', 'stroke-width': 2.1, class: 'wm-a' }],
    ['path', { d: 'M7 15.4Q10.4 18.8 13.8 15.4', 'stroke-width': 1.5, class: 'wm-a' }],
    ['path', { d: 'M19.2 2.6L19.1 7.4M16.8 5.1L21.6 5', class: 'wm-s' }],
  ]
}
