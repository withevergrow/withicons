// LUXE: creative. Premium, luxurious, multi-layered 3D: every icon is a small
// precious object. Jewel enamel slabs (K) with a deep extruded side wall, a cast
// shadow, a stepped tonal ramp, lit chamfers, a cool rim light and a crisp
// specular sickle; polished gold for secondary parts (A); ruby cabochons in a gold
// bezel for badges and modifiers (S); cutouts engraved as recesses.
// No defs, gradients, filters or masks: all depth is stacked geometry and opacity.
// Every colour is a role-named variable --with-luxe-<role> with a literal fallback
// (ink c1 c2 c3 c4 tint accent shadow shine edge), so palettes recolour it.
// Geometry: _luxe-core.mjs (on _luxe-field.mjs). Per-icon tuning: _luxe-tune.mjs.
import { build, col } from './_luxe-core.mjs'

export default {
  name: 'luxe',
  title: 'Luxe',
  kind: 'creative',
  description: 'Premium multi-layered 3D: jewel enamel, polished gold and ruby set in deep extruded slabs, with soft shadows, lit chamfers and crisp highlights.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    try {
      const nodes = build(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    // last resort: the line drawing in enamel, so nothing ever renders empty
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: col(p.plate === 'K' || !p.plate ? 'c1' : p.plate === 'S' ? 'c2' : 'accent'),
        'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }])
    } catch { return [] }
  },
}
