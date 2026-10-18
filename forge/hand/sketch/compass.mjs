// forge/hand/sketch/compass.mjs: wobbly ring, a clean diamond needle (NE-SW) split on its long axis with hachure on
// one half only, a pivot dot and a north tick; a clear gap separates needle and ring.
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
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 18))
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180
    const rr = r * (1 + 0.03 * Math.sin(a * 3 + ph))
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  return smooth(pts)
}
export default function render() {
  // needle: tips NE (16,8) and SW (8,16); side points (14.7,14.7) and (9.3,9.3)
  const needle = 'M16 8L14.7 14.7L8 16L9.3 9.3Z'
  const axis = 'M16 8L8 16'
  const hatch = 'M14 10.6l-1.1 1.1M12.9 12.3l-1.5 1.5M11.5 13.9l-1.1 1.1'
  const ring = arc(12, 12, 9.5, -100, 262, 0.7)
  const ringG = arc(11.8, 12.3, 9.5, -80, 200, 2.1)
  return [
    ['path', { d: hatch, 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: ringG, 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ring, class: 'wm-k' }],
    ['path', { d: 'M12 4.7v1.5', class: 'wm-k' }],
    ['path', { d: needle + axis, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 12, r: 0.55, fill: 'currentColor', 'stroke-width': 0.8, class: 'wm-a' }],
  ]
}
