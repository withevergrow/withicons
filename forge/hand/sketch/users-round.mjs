// forge/hand/sketch/users-round.mjs — two clean pencil figures: a full front head and dome, and a back figure drawn as
// a half head and half shoulder peeking out, with clear gaps so the pair reads at 16px instead of lumpy loops.
function arc(cx, cy, r, a0, a1, amp, ph) {
  const pts = []
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 15))
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180
    const rr = r + amp * Math.sin(3 * a + ph)
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  const f = (v) => +v.toFixed(2)
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = i === pts.length - 2 ? pts[i + 1] : [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]
    d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(m[0])} ${f(m[1])}`
  }
  return d
}
export default function render() {
  return [
    ['path', { d: 'M10.8 20.1l2.6-2M13.3 20.3l1.4-1.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: arc(9.3, 8.3, 3.5, -110, 265, 0.1, 0.9), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: arc(9, 8, 3.5, -130, 260, 0.08, 0.3), 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: 'M2.4 21.3Q2.7 16 9.2 15.7Q15.8 15.9 16.3 21.2', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M2 21Q2.3 15.6 9 15.5Q15.7 15.6 16 21', 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: arc(16.3, 6.8, 3.5, -108, 108, 0.08, 0.5), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: arc(16, 6.5, 3.5, -110, 105, 0.06, 0.2), 'stroke-width': 1.45, class: 'wm-a' }],
    ['path', { d: 'M17.8 15.3Q21.5 16.6 21.8 21.2', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M17.5 15Q21.2 16.3 21.5 21', 'stroke-width': 1.45, class: 'wm-a' }],
  ]
}
