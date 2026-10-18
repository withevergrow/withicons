// forge/hand/sketch/component.mjs — four crisp pencil diamonds in a cross, one stroke weight and wide open gaps,
// replacing lumpy rounded diamonds with shadow ticks that clotted into one blob at 24px.
const r2 = (n) => Math.round(n * 100) / 100
function diamond(cx, cy, r, w) {
  // slight hand wobble on each edge, corners kept sharp-ish so the diamond reads at 16px
  const p = (x, y) => `${r2(x)} ${r2(y)}`
  return `M${p(cx, cy - r)}Q${p(cx + r / 2 + w, cy - r / 2 - w)} ${p(cx + r, cy)}` +
    `Q${p(cx + r / 2 - w, cy + r / 2 + w)} ${p(cx, cy + r)}` +
    `Q${p(cx - r / 2 - w, cy + r / 2 + w)} ${p(cx - r, cy)}` +
    `Q${p(cx - r / 2 + w, cy - r / 2 - w)} ${p(cx + 0.15, cy - r - 0.1)}`
}
export default function render() {
  const r = 3.1
  return [
    ['path', { d: diamond(12, 5.3, r, 0.12) + diamond(12, 18.7, r, -0.1), class: 'wm-k' }],
    ['path', { d: diamond(18.7, 12, r, -0.12) + diamond(5.3, 12, r, 0.1), class: 'wm-a' }],
  ]
}
