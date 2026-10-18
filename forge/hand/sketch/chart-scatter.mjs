// forge/hand/sketch/chart-scatter.mjs — firm hand-drawn axes with four open rings instead of muddy blobs; the top
// ring is the hachured accent so the scatter keeps a clear shape and a focal point at 16px.
const ring = (cx, cy, r) => `M${(cx - r).toFixed(2)} ${(cy + 0.2).toFixed(2)}A${r} ${r} 0 1 1 ${(cx - r + 0.35).toFixed(2)} ${(cy + 0.75).toFixed(2)}`
export default function render() {
  return [
    ['path', { d: 'M17.2 6.9L19.3 4.8M17.6 8L20.1 5.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M3.6 3.2Q3.45 11 3.6 18.6Q3.65 20.45 5.5 20.4Q13 20.55 20.8 20.35', 'stroke-width': 1.5, class: 'wm-k' }],
    ['path', { d: [ring(7.8, 15.6, 1.5), ring(11.4, 10.2, 1.5), ring(14.9, 14, 1.5)].join(''), 'stroke-width': 1.4, class: 'wm-k' }],
    ['path', { d: ring(18.6, 6.4, 1.9), 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
