// GOTHIC: creative. Every icon is carved and glazed like a piece of a cathedral: the
// object's frame in carved limestone (lit chamfer, shaded bevel, mortar joints), its mass in
// stained glass of deep jewel colours set in dark lead, with tracery (quarry diamonds,
// quatrefoil medallions, rose spokes, lancet bars), gilded metal for moving parts and
// ruby roundels in gilded bezels for badges. The hand-drawn exemplars and redraws bring
// the architecture itself: pointed arches, lancets, rose windows, crenellations,
// pinnacles, trefoils and quatrefoils, wrought-iron curls.
//
// Architecture (see forge/styles/GOTHIC-GUIDE.md):
//   _gothic-field.mjs   signed distance fields       _gothic-path.mjs   curve-fitted output
//   _gothic-paint.mjs   materials + scene painter     _gothic-prim.mjs   shapes (fields)
//   _gothic-kit.mjs     the style's vocabulary (g)    _gothic-auto.mjs   automatic composer
//   _gothic-exemplars.mjs  the art director's 20      _gothic-redraw-1..5.mjs  hand redraws
//   _gothic-live.mjs    Live icons: hand compositions from params (ratings, signal, wifi, progress,
//                       volume, bars, the count family on their static siblings) and the family
//                       dress of the automatic ones (crests, calendar headers, stone tablets)
//   _gothic-render.mjs  dispatch, and enamel: an all-gilt icon gets glass inlaid in its metal
//
// Variables (role-named, forge/lib/palette-map.mjs): --with-gothic-<role>
//   ink #221A26 lead/iron   c1 #B3163B ruby   c2 #2552B4 sapphire   c3 #E6A421 gold glass
//   c4 #1C8A5F emerald      tint #D3CDC0 limestone   accent #C79A38 gilt   shadow #140F18
//   shine #FFF6DE candlelight   edge #837A6F stone shade
// No ids, defs, gradients, filters or masks: every layer is real geometry.
import render from './_gothic-render.mjs'
import { PALETTE, col } from './_gothic-paint.mjs'

export { PALETTE }

export default {
  name: 'gothic',
  title: 'Gothic',
  kind: 'creative',
  description: 'Cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches, tracery and rose windows.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    try {
      const nodes = render(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: col(p.plate === 'S' ? 'c1' : p.plate === 'A' ? 'accent' : 'ink'),
        'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }])
    } catch { return [] }
  },
}
