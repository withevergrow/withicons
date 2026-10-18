// forge/hand/sketch/lucky-coin.mjs — one wide hand-drawn rim around a small square hole with open space between them,
// four short marks on the face and firm hatching, replacing a crowded ring + square that clumped at 16px.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
function ring(cx, cy, r, a0, sweep, wob, ph) {
  const n = 28, P = []
  for (let i = 0; i <= n; i++) {
    const a = (a0 + sweep * i / n) * Math.PI / 180, rr = r * (1 + wob * Math.sin(3 * a + ph))
    P.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  let d = `M${r2(P[0][0])} ${r2(P[0][1])}`
  for (let i = 1; i < P.length - 1; i++) d += `Q${r2(P[i][0])} ${r2(P[i][1])} ${r2((P[i][0] + P[i + 1][0]) / 2)} ${r2((P[i][1] + P[i + 1][1]) / 2)}`
  return d + `L${r2(P.at(-1)[0])} ${r2(P.at(-1)[1])}`
}
const RIM = ring(12, 12, 9.6, 200, 378, 0.012, 0.7)
const HOLE = 'M9.6 9.75Q12 9.55 14.4 9.7Q14.55 12 14.35 14.35Q12 14.5 9.65 14.3Q9.5 12 9.7 9.4'
const MARKS = 'M11 6.2L13.1 6.1M17.8 11L17.9 13.1M11 17.9L13.1 17.85M6.15 11L6.1 13.1'
const HATCH = 'M14.4 18.6L18.1 14.9M16.9 19.1L19.6 16.4M12.3 19.9L15.9 16.3'
export default function render() {
  return [
    ['path', { d: HATCH, 'stroke-width': 0.9, 'stroke-opacity': 0.8, class: 'wm-k' }],
    ['path', { d: ghost(RIM, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: RIM, class: 'wm-k' }],
    ['path', { d: HOLE, class: 'wm-k' }],
    ['path', { d: MARKS, 'stroke-width': 1.1, class: 'wm-a' }],
  ]
}
