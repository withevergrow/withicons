// SKEUO — creative. Skeuomorphism: every icon is a small real object.
// Real materials chosen per object (paper, leather, brushed metal, brass, wood,
// ceramic, lacquered plastic, glass), one light from the upper left, soft
// ambient-occlusion shadows, inner walls where something is cut through,
// debossed print and seams, stitching and grain where the material has them.
// Pieces (body, parts, badges) are lit separately and stacked with contact shadows.
// No defs, gradients or filters: all depth is stacked tonal geometry.
// Geometry: _skeuo-core.mjs; light: _skeuo-paint.mjs; materials: _skeuo-mat.mjs;
// composition: _skeuo-render.mjs; per-icon tuning and redraws: _skeuo-tune.mjs.
// Every colour is a role variable --with-skeuo-<role> with a literal fallback.
import { draw } from './_skeuo-render.mjs'

export default {
  name: 'skeuo',
  title: 'Skeuo',
  kind: 'creative',
  description: 'Skeuomorphic: every icon is a tactile object in a real material (paper, leather, metal, brass, wood, glass), lit from above with soft shadows, inner walls and debossed detail.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    try {
      const nodes = draw(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below */ }
    // never empty: the plain line drawing
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }])
    } catch { return [] }
  },
}
