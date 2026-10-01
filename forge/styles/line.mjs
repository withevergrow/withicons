// LINE — universal. The skeleton itself, stroked. Emits the authored path data
// verbatim, so files are tiny and curves stay exact.
export default {
  name: 'line',
  title: 'Line',
  kind: 'universal',
  description: 'A precise 1.75px outline with round caps and joins. The default for any interface.',
  strokeWidth: 1.75,
  root: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render(icon) {
    return icon.paths.map(p => ['path', { d: p.d }])
  },
}
