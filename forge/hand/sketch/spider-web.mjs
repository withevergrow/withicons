// forge/hand/sketch/spider-web.mjs — a light, open orb web: six spokes and two sagging rings (not three), a soft hachure
// tint in the hub like its siblings, and a small hanging spider as the accent, so 16px stays open instead of a blob.
const r2 = v => Math.round(v * 100) / 100
const CX = 12, CY = 11.5
const pt = (a, r) => [CX + r * Math.cos(a), CY + r * Math.sin(a)]
const ANG = [0, 1, 2, 3, 4, 5].map(i => -Math.PI / 2 + i * Math.PI / 3)
const P = ([x, y]) => `${r2(x)} ${r2(y)}`
const spokes = ANG.map(a => `M${P(pt(a, 1.6))}L${P(pt(a, 9.6))}`).join('')
// a ring of sagging threads: each segment bows toward the hub
const ring = r => ANG.map((a, i) => {
  const b = ANG[(i + 1) % 6], m = (a + b) / 2 + (i === 5 ? Math.PI : 0)
  return `${i ? '' : `M${P(pt(a, r))}`}Q${P(pt(m, r * 0.78))} ${P(pt(b, r))}`
}).join('')
const RINGS = ring(3.6) + ring(7)
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)
export default function render() {
  return [
    ['path', { d: 'M10.2 12.6L12.4 9.1M11.6 13.9L14 10.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: g(ring(7)), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: spokes + RINGS, class: 'wm-k' }],
    ['path', { d: 'M19.3 16.4V19.6', 'stroke-width': 0.8, class: 'wm-a' }],
    ['circle', { cx: 19.3, cy: 21, r: 1.3, fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
  ]
}
