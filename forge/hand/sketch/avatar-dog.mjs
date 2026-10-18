// forge/hand/sketch/avatar-dog.mjs: dog face: round head, long dark floppy ears hanging past the cheeks, bold dot
// eyes, an outlined snout with a solid nose and a small tongue; the ears carry the weight so it reads as a dog.
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
const ell = (cx, cy, rx, ry, a0, a1, ph = 0) => {
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 18))
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180
    const k = 1 + 0.025 * Math.sin(a * 3 + ph)
    pts.push([cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)])
  }
  return smooth(pts)
}
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
export default function render() {
  const head = ell(12, 12.2, 6.2, 7, -105, 255, 0.6)
  const earL = 'M7 6.7Q4.1 5.8 3.5 9.4Q3.1 13 4.6 15.8Q6.1 16.4 6.8 14Q7 10.5 7 6.7Z'
  const earR = 'M17 6.7Q19.9 5.8 20.5 9.4Q20.9 13 19.4 15.8Q17.9 16.4 17.2 14Q17 10.5 17 6.7Z'
  return [
    ['path', { d: 'M10.2 7.4l1.5-1.3M12 7.8l1.5-1.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: g(head), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: head, class: 'wm-k' }],
    ['path', { d: earL, fill: 'currentColor', class: 'wm-k' }],
    ['path', { d: earR, fill: 'currentColor', class: 'wm-k' }],
    ['path', { d: 'M8.9 13.4Q8.8 17.4 12 17.6Q15.2 17.4 15.1 13.4', 'stroke-width': 0.9, 'stroke-opacity': 0.55, class: 'wm-k' }],
    ['path', { d: 'M9.4 10h.01M14.6 10h.01', 'stroke-width': 1.8, class: 'wm-a' }],
    ['path', { d: 'M10.2 12.2Q12 11.2 13.8 12.2Q13.3 13.8 12 13.9Q10.7 13.8 10.2 12.2Z', fill: 'currentColor', 'stroke-width': 0.8, class: 'wm-a' }],
    ['path', { d: 'M12 14V15.3M10.5 15.4Q12 16.6 12 15.3Q12 16.6 13.5 15.4', 'stroke-width': 1, class: 'wm-a' }],
    ['path', { d: 'M11.2 16.2Q11.2 17.6 12.2 17.6Q13.2 17.6 13.2 16.2', 'stroke-width': 0.9, class: 'wm-a' }],
  ]
}
