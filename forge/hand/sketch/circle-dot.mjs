// forge/hand/sketch/circle-dot.mjs — a clean hand-drawn ring around a solid, slightly wobbly pencil-filled centre dot,
// replacing a tiny ringed dot with a speck inside that read as a spiral or an eye.
function ring(cx, cy, r, a0, amp, ph) {
  const pts = []
  const n = 26
  for (let i = 0; i <= n; i++) {
    const t = i / 24
    const a = (a0 + t * 360) * Math.PI / 180
    const rr = r + amp * Math.sin(3 * a + ph) + (t > 1 ? (t - 1) * 5 : 0)
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
    ['path', { d: 'M13.7 18.4L18.3 13.8M15.6 18.9L18.9 15.6M13.9 16.4L16.6 13.7', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: ring(12, 12, 9.4, -118, 0.3, 0.6), class: 'wm-k' }],
    ['path', { d: ring(12, 12, 2.5, -40, 0.03, 1.4), fill: 'currentColor', 'stroke-width': 1, class: 'wm-a' }],
  ]
}
