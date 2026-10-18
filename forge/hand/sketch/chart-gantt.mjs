// forge/hand/sketch/chart-gantt.mjs: L axis with timeline ticks and three task bars stepping diagonally
// down and to the right, the middle (active) task hatched.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const bar = (a, b, c, d, r = 0.8) => `M${r2(a + r)} ${b}Q${r2((a + c) / 2)} ${r2(b - 0.15)} ${r2(c - r)} ${b}Q${c} ${b} ${c} ${r2(b + r)}` +
  `Q${r2(c + 0.1)} ${r2((b + d) / 2)} ${c} ${r2(d - r)}Q${c} ${d} ${r2(c - r)} ${d}Q${r2((a + c) / 2)} ${r2(d + 0.15)} ${r2(a + r)} ${d}` +
  `Q${a} ${d} ${a} ${r2(d - r)}Q${r2(a - 0.1)} ${r2((b + d) / 2)} ${a} ${r2(b + r)}Q${a} ${b} ${r2(a + r + 0.3)} ${r2(b - 0.05)}`
const AXIS = 'M3.2 3Q3 12 3.2 20.5Q12 20.3 21.2 20.6M8.5 20.5v1.1M13.6 20.5v1.1M18.6 20.5v1.1'
const BARS = bar(5.4, 4.6, 11.8, 7.8) + bar(8.8, 9.6, 16.4, 12.8) + bar(13.2, 14.6, 20.4, 17.8)
const HATCH = 'M10.3 12.2l1.9-2m.3 2.1l1.9-2m.3 2l1.4-1.5'
export default function render() {
  return [
    ['path', { d: HATCH, 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: ghost(AXIS, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: AXIS, class: 'wm-k' }],
    ['path', { d: ghost(BARS, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: BARS, class: 'wm-a' }],
  ]
}