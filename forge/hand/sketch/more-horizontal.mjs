// forge/hand/sketch/more-horizontal.mjs — three heavy, slightly uneven pencil-filled dots (about 3u across) so the
// row survives 16px, replacing tiny scribbled spirals that shrank to specks.
const dot = (x, y, a, b) =>
  `M${x - 1.15} ${y + a}Q${x - 1.1} ${y - 1.15} ${x + b} ${y - 1.15}Q${x + 1.2} ${y - 1.05} ${x + 1.15} ${y + 0.1}` +
  `Q${x + 1.05} ${y + 1.2} ${x - b} ${y + 1.15}Q${x - 1.2} ${y + 1.1} ${x - 1.15} ${y + a}Z`
const r = (s) => s.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 100) / 100))
export default function render() {
  return [
    ['path', { d: r(dot(5, 12.05, 0.05, 0.05)), fill: 'currentColor', class: 'wm-k' }],
    ['path', { d: r(dot(12, 11.95, -0.05, 0.1)), fill: 'currentColor', class: 'wm-k' }],
    ['path', { d: r(dot(19, 12.05, 0.1, 0)), fill: 'currentColor', class: 'wm-k' }],
  ]
}
