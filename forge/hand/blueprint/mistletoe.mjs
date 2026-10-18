// forge/hand/blueprint/mistletoe.mjs — a hung sprig: a tied bow, a short stem, two clear almond leaves with midribs
// and three berries clustered under the fork (the generated drawing crumbled into one blob at 16px, with guide arcs
// crowding it). Only the dimension line stays as drafting furniture.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const f = n => +n.toFixed(2)
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const berry = (x, y, r = 1.55) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}Z`
// almond leaf from base J to tip T, half-width w
function leaf(J, T, w) {
  const dx = T[0] - J[0], dy = T[1] - J[1], L = Math.hypot(dx, dy)
  const px = -dy / L * w, py = dx / L * w
  const p = (t, s) => `${f(J[0] + dx * t + px * s)} ${f(J[1] + dy * t + py * s)}`
  return `M${J[0]} ${J[1]}C${p(0.25, 1.35)} ${p(0.7, 1.35)} ${T[0]} ${T[1]}C${p(0.7, -1.35)} ${p(0.25, -1.35)} ${J[0]} ${J[1]}Z`
}
const rib = (J, T) => `M${J[0]} ${J[1] + 0.2}L${f(J[0] + (T[0] - J[0]) * 0.78)} ${f(J[1] + (T[1] - J[1]) * 0.78)}`

export default function render() {
  const J = [12, 8.2], TL = [3, 14.8], TR = [21, 14.8]
  return [
    ['path', { d: 'M3.5 22.6H20.5M3.5 21V24M20.5 21V24', ...con(0.5) }],
    ['path', { d: 'M2.85 23.25L4.15 21.95M19.85 23.25L21.15 21.95', ...con(0.75), 'stroke-width': 0.5 }],
    ['path', { d: leaf(J, TL, 1.9) + leaf(J, TR, 1.9), class: 'wm-k' }],
    ['path', { d: rib(J, TL) + rib(J, TR), class: 'wm-a' }],
    ['path', { d: 'M12 4.6V8.2M12 4.6C10.6 2.2 7.4 1.8 7.4 3.5C7.4 5.2 10.6 5.1 12 4.6ZM12 4.6C13.4 2.2 16.6 1.8 16.6 3.5C16.6 5.2 13.4 5.1 12 4.6Z', class: 'wm-a' }],
    ['path', { d: berry(9.9, 14.9) + berry(14.1, 14.9) + berry(12, 18.6), fill: 'currentColor', 'stroke-width': 0.5, class: 'wm-s' }],
    ['path', { d: ring(12, 4.6), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-s' }],
  ]
}
