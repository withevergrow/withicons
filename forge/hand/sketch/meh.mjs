// forge/hand/sketch/meh.mjs — an even, round marker circle (a gentle wobble only), two solid dot eyes, a straight
// flat mouth, a pencilled ghost of the circle and two light hatches kept clear of the mouth.
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
const arc = (cx, cy, r, a0, a1, ph = 0) => {
  const n = Math.round(Math.abs(a1 - a0) / 15)
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180
    const rr = r * (1 + 0.012 * Math.sin(a * 2 + ph))
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  return smooth(pts)
}
export default function render() {
  return [
    ['path', { d: 'M14.4 19L18.2 16.2M11.6 19.8L14.6 17.7', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: arc(11.75, 12.3, 9.3, 120, 480, 2.2), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: arc(12, 12, 9.3, 100, 460, 0.6), class: 'wm-k' }],
    ['path', { d: 'M9 9.6h.01M15 9.6h.01', 'stroke-width': 2.6, class: 'wm-a' }],
    ['path', { d: 'M8.3 15.4Q12 15.7 15.7 15.3', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
