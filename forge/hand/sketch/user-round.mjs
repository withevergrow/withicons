// forge/hand/sketch/user-round.mjs — a clean closed pencil head and a smooth shoulder dome with clear air between them,
// replacing a lumpy head whose overshooting tail read as a stray circle at 16px.
function ring(cx, cy, r, a0, amp, ph, over) {
  const pts = []
  const n = 24 + over
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (i / 24) * 360) * Math.PI / 180
    const rr = r + amp * Math.sin(3 * a + ph)
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  const f = (v) => +v.toFixed(2)
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]
    d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(m[0])} ${f(m[1])}`
  }
  return d
}
export default function render() {
  return [
    ['path', { d: 'M13.7 20.1l3-2.2M16.6 20.3l1.7-1.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: ring(12.3, 7.3, 4, -100, 0.12, 1.1, 1), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ring(12, 7, 4, -120, 0.1, 0.4, 2), 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: 'M4.4 21.3Q4.7 15.3 12.2 15.2Q19.8 15.3 20.3 21.2', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M4 21Q4.3 15 12 15Q19.7 15.05 20 21', 'stroke-width': 1.45, class: 'wm-k' }],
  ]
}
