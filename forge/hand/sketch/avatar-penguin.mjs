// forge/hand/sketch/avatar-penguin.mjs: firm egg body with flippers, open belly, small beak and two bold dot eyes;
// symmetric side hachure on both flanks so the dark back reads evenly at 16px.
const R = (v) => Math.round(v * 100) / 100
const P = (pts) => pts.map(([x, y]) => `${R(x)} ${R(y)}`)
// hand-wobbled arc as a smooth quadratic chain (angles in degrees, SVG orientation)
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
const smooth = (pts) => {
  let d = `M${R(pts[0][0])} ${R(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]
    d += `Q${R(pts[i][0])} ${R(pts[i][1])} ${R(m[0])} ${R(m[1])}`
  }
  const l = pts[pts.length - 1]
  return d + `L${R(l[0])} ${R(l[1])}`
}
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const body = 'M12 2.6Q17.9 2.7 17.9 10V15.5Q17.9 18.9 12 19Q6.1 18.9 6.1 15.5V10Q6.1 2.7 12 2.6'
  const flip = 'M6 11.1Q3.4 12.8 3.6 16.6Q5.2 16.2 6 15M18 11.1Q20.6 12.8 20.4 16.6Q18.8 16.2 18 15'
  const belly = 'M8.3 18.2Q7.7 13.4 12 13.3Q16.3 13.4 15.7 18.2'
  const feet = 'M8.6 21.4H10.6M13.4 21.4H15.4'
  const hatch = 'M7.1 12.6L8.3 11.2M7.1 15L9 12.8M16.9 12.6L15.7 11.2M16.9 15L15 12.8'
  return [
    ['path', { d: hatch, ...HATCH, class: 'wm-k' }],
    ['path', { d: g(body + flip), ...GHOST, class: 'wm-k' }],
    ['path', { d: body + flip + belly + feet, class: 'wm-k' }],
    ['path', { d: 'M10.6 9.2H13.4L12 11.1Z', class: 'wm-k' }],
    ['path', { d: 'M9.5 6.9h.01M14.5 6.9h.01', 'stroke-width': 1.7, class: 'wm-a' }],
  ]
}
