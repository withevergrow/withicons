// forge/hand/sketch/circle-arrow-down.mjs — a hand-drawn ring with a big bold down arrow and hachure kept to the lower-right
// crescent, replacing a small arrow whose shaft and head were crossed by shading and muddied at 16px.
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
    ['path', { d: 'M14.6 18.2L18.2 14.6M16.4 18.8L18.8 16.4', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: ring(12, 12, 9.4, -118, 0.3, 0.6), class: 'wm-k' }],
    ['path', { d: 'M12.2 6.7Q12.1 11.4 11.9 16.6M7.3 11.9Q9.6 14.3 12.2 17.1Q14.3 14.6 16.8 12.2', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M12 7.1Q11.95 11.6 12.05 16.4M7.7 12.4Q9.8 14.6 12 16.9Q14.2 14.7 16.3 12.4', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
