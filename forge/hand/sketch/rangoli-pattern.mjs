// forge/hand/sketch/rangoli-pattern.mjs: one clear outer ring, four bold teardrop petals pointing outward,
// a centre bindu and four dots between the petals, so it reads as a floor rangoli rather than a gear or marigold.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const circle = (cx, cy, r, over = 0) => {
  const k = 0.5523 * r
  const f = (x, y) => `${r2(x)} ${r2(y)}`
  return `M${f(cx + r, cy)}C${f(cx + r, cy + k)} ${f(cx + k, cy + r)} ${f(cx, cy + r)}` +
    `C${f(cx - k, cy + r)} ${f(cx - r, cy + k)} ${f(cx - r, cy)}` +
    `C${f(cx - r, cy - k)} ${f(cx - k, cy - r)} ${f(cx, cy - r)}` +
    `C${f(cx + k, cy - r)} ${f(cx + r, cy - k)} ${f(cx + r, cy + over)}`
}
const RING = circle(12, 12, 9.6, 0.5)
// petal pointing up, rotated to the four directions
const PETAL = [[12, 10.2], [10, 8.7], [10.1, 6.1], [12, 4.4], [13.9, 6.1], [14, 8.7], [12, 10.2]]
const ROT = [[1, 0], [0, 1], [-1, 0], [0, -1]]
const rot = (p, n) => {
  const x = p[0] - 12, y = p[1] - 12, [c, s] = ROT[n]
  return `${r2(12 + x * c - y * s)} ${r2(12 + x * s + y * c)}`
}
let PETALS = ''
for (let n = 0; n < 4; n++) {
  const q = PETAL.map(p => rot(p, n))
  PETALS += `M${q[0]}C${q[1]} ${q[2]} ${q[3]}C${q[4]} ${q[5]} ${q[6]}`
}
const D = 4.6
const DOTS = [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sy]) => circle(12 + sx * D, 12 + sy * D, 0.75)).join('')
const BINDU = circle(12, 12, 0.9)
export default function render() {
  return [
    ['path', { d: ghost(RING + PETALS, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: RING, class: 'wm-k' }],
    ['path', { d: PETALS, class: 'wm-a' }],
    ['path', { d: DOTS + BINDU, class: 'wm-s' }],
  ]
}
