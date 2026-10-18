// forge/hand/sketch/circle-stop.mjs: a pencilled ring (stroke overshoots where it closes) around a crisp square with
// tight corners and straight sides; the old wobbly hatched blob read as a rounded lump, not a stop square.
const r2 = n => Math.round(n * 100) / 100
function ring(cx, cy, r, a0, amp, ph) {
  const pts = []
  for (let i = 0; i <= 26; i++) {
    const t = i / 24
    const a = (a0 + t * 360) * Math.PI / 180
    const rr = r + amp * Math.sin(3 * a + ph) + (t > 1 ? (t - 1) * 5 : 0)
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  let d = `M${r2(pts[0][0])} ${r2(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    d += `Q${r2(pts[i][0])} ${r2(pts[i][1])} ${r2((pts[i][0] + pts[i + 1][0]) / 2)} ${r2((pts[i][1] + pts[i + 1][1]) / 2)}`
  }
  return d
}
export default function render() {
  return [
    ['path', { d: 'M17.6 18.4L19.3 16.8M15.4 20.1L18.8 17.4', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: ring(12, 12, 9.4, -112, 0.25, 0.6), class: 'wm-k' }],
    ['path', { d: 'M8.9 8.6L15.2 8.5Q15.5 8.5 15.5 8.9L15.4 15.1Q15.4 15.5 15 15.4L8.8 15.5Q8.5 15.5 8.5 15.1L8.6 8.9Q8.5 8.5 8.9 8.6Z', 'stroke-width': 1.4, class: 'wm-a' }],
  ]
}
