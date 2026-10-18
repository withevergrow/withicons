// forge/hand/blueprint/avatar-ghost.mjs — a bigger, friendlier ghost: a wide domed body with a scalloped hem,
// bold filled eyes and an open mouth. The generated drawing's centre guide line and eye ticks crowded the face;
// here the face is clear and only the dimension line and a single node on the crown remain.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ell = (x, y, rx, ry) => `M${x + rx} ${y}A${rx} ${ry} 0 1 0 ${x - rx} ${y}A${rx} ${ry} 0 1 0 ${x + rx} ${y}Z`

export default function render() {
  return [
    ['path', { d: 'M3.5 23.2H20.5M3.5 21.9V24.4M20.5 21.9V24.4', ...con(0.5) }],
    ['path', { d: 'M2.85 23.85L4.15 22.55M19.85 23.85L21.15 22.55', ...con(0.75), 'stroke-width': 0.5 }],
    ['path', { d: 'M3.5 18.6V10.8A8.5 8.5 0 0 1 20.5 10.8V18.6A2.83 2.4 0 0 1 14.83 18.6A2.83 2.4 0 0 1 9.17 18.6A2.83 2.4 0 0 1 3.5 18.6Z', class: 'wm-k' }],
    ['path', { d: ell(8.8, 10.8, 1.15, 1.7) + ell(15.2, 10.8, 1.15, 1.7), fill: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: ell(12, 15, 1.35, 1.7), fill: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: 'M12.8 2.3A.8.8 0 1 0 11.2 2.3A.8.8 0 1 0 12.8 2.3', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-s' }],
  ]
}
