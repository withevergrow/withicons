// forge/hand/sketch/drag-handle.mjs — six heavy, slightly uneven pencil-filled dots (about 3u across with the pencil edge) in a 2x3 grid,
// matching more-vertical, replacing tiny scribbled spirals that dissolved into specks at 16px.
const dot = (x, y, a, b) =>
  `M${x - 1.15} ${y + a}Q${x - 1.1} ${y - 1.15} ${x + b} ${y - 1.15}Q${x + 1.2} ${y - 1.05} ${x + 1.15} ${y + 0.1}` +
  `Q${x + 1.05} ${y + 1.2} ${x - b} ${y + 1.15}Q${x - 1.2} ${y + 1.1} ${x - 1.15} ${y + a}Z`
const r = (s) => s.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 100) / 100))
const P = [[9, 5, 0.05, 0.05], [15.05, 5, -0.05, 0.1], [8.95, 12, 0.1, 0], [15, 12, 0.05, 0.05], [9.05, 19, -0.05, 0.1], [14.95, 19, 0.1, 0]]
export default function render() {
  return P.map(([x, y, a, b]) => ['path', { d: r(dot(x, y, a, b)), fill: 'currentColor', class: 'wm-k' }])
}
