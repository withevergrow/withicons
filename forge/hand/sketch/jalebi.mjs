// forge/hand/sketch/jalebi.mjs — one open two-turn coil (wide gaps so it stays a spiral at 16px) running out into a looping tail,
// wobbly pencil line, a ghost pass on the tail only, shade hatch and sturdy spark ticks like the sibling sweets.
const r2 = n => Math.round(n * 100) / 100
// spiral points (deterministic wobble) joined as a quadratic B-spline
function spiral(cx, cy) {
  const pts = []
  for (let a = 0; a <= 24; a++) {
    const th = Math.PI + (a * Math.PI) / 6
    const r = (1.3 + (5.1 * (a * Math.PI) / 6) / (4 * Math.PI)) * (1 + 0.03 * Math.sin(th * 3))
    pts.push([cx + r * Math.cos(th), cy + r * Math.sin(th)])
  }
  let d = `M${r2(pts[0][0])} ${r2(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2
    d += `Q${r2(pts[i][0])} ${r2(pts[i][1])} ${r2(mx)} ${r2(my)}`
  }
  const e = pts[pts.length - 1]
  return d + `L${r2(e[0])} ${r2(e[1])}`
}
const TAIL = 'C5 8 8.2 4.4 12.2 4.4C14.6 4.4 15.6 5.3 17.4 4.9C18.6 4.6 19.4 5.3 19.8 6.4'
export default function render() {
  const main = spiral(11.5, 12.1) + TAIL
  const ghost = 'M5.4 11.7C5.4 8 8.5 4.8 12.5 4.7C14.9 4.7 15.9 5.6 17.7 5.2C18.9 4.9 19.6 5.6 20 6.7'
  return [
    ['path', { d: 'M18.9 9L20.4 10.3M16.2 2.9L17 1.8M8.7 2.7L9 1.4', 'stroke-width': 0.9, 'stroke-opacity': 0.6, class: 'wm-deco' }],
    ['path', { d: 'M15.3 18.6L17 16.9M17.4 19.6L19 18', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ghost, 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: main, class: 'wm-k' }],
  ]
}
