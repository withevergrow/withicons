// forge/hand/sketch/paper-fan.mjs: folding fan, half-disc of pleats radiating from a pivot rivet, zigzag pleat top.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)
const P = [12, 18.5], R = 9.5, N = 8
const pt = (a, r) => [r2(P[0] + Math.cos(a) * r), r2(P[1] - Math.sin(a) * r)]
const angs = Array.from({ length: N + 1 }, (_, i) => Math.PI * (0.06 + 0.88 * i / N))
let top = '', ribs = ''
angs.forEach((a, i) => {
  const [x, y] = pt(a, i % 2 ? R - 1 : R)
  top += (i ? 'L' : 'M') + x + ' ' + y
  if (i > 0 && i < N) { const [ix, iy] = pt(a, 3); ribs += `M${ix} ${iy}L${x} ${y}` }
})
const [lx, ly] = pt(angs[0], R), [rx, ry] = pt(angs[N], R)
const BODY = `${top}M${lx} ${ly}L${P[0]} ${P[1]}L${rx} ${ry}`
export default function render() {
  return [
    ['path', { d: ghost(BODY, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: ribs, 'stroke-width': 0.8, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 18.5, r: 1.1, class: 'wm-s' }],
  ]
}
