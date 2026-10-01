// DUO — universal. Line on top of the icon's mass at 20%. The tint defaults to
// currentColor, and can be recoloured with --with-duo without touching the line.
export default {
  name: 'duo',
  title: 'Duo',
  kind: 'universal',
  description: 'The line drawing over a soft tonal fill of the object\'s mass. Recolour the tone with --with-duo.',
  strokeWidth: 1.75,
  root: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render(icon) {
    const tone = icon.fills.map(f => ['path', {
      d: f.d, fill: 'var(--with-duo, currentColor)', 'fill-opacity': 0.2, stroke: 'none', 'fill-rule': 'evenodd',
    }])
    return [...tone, ...icon.paths.map(p => ['path', { d: p.d }])]
  },
}
