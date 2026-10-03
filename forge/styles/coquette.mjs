// COQUETTE: creative. The Gen-Z "coquette" aesthetic: every icon keeps its object but
// is dressed for a ballet-pink romance. A blush satin body with a smooth satin ramp,
// a soft rose shadow and a crisp sheen, outlined in a fine wine-berry line; delicate
// gold for handles and chains, cream for paper and panels, pearls for dots, and one
// signature ornament (a ribbon-red satin bow, a pearl string, a lace trim, a heart).
// Elegant and dainty: 1-2 ornaments per icon, never a face.
//
// Architecture (forge/styles/COQUETTE-GUIDE.md):
//   _coquette-paint.mjs    materials + the painter (parts -> layered nodes)
//   _coquette-kit.mjs      shapes and ornaments (bow, pearls, lace, hearts, sparkles)
//   _coquette-auto.mjs     dresses any skeleton (all icons, Live icons, future icons); Live text is a
//                          fine wine line, free text sits on a cream label plate
//   _coquette-exemplars.mjs + _coquette-redraw-1..5.mjs   hand-composed icons
//   _coquette-tune.mjs     per-icon nudges for the automatic path (and each Live icon's ornament)
//
// Variables (role-named, forge/lib/palette-map.mjs): --with-coquette-<role>
//   ink #7E2443 wine-berry line   c1 #F9C8D3 blush   c2 #EE97AD rose   c3 #D7385F ribbon red
//   c4 #FCEADD cream   tint #FFE5EC satin   accent #D9A45B gold   shadow #A8345C rose shadow
//   shine #FFFFFF sheen   edge #FFFBF6 lace
// No ids, defs, gradients, filters, masks or strokes: every layer is real geometry.
import render from './_coquette-render.mjs'
import { PALETTE, col } from './_coquette-paint.mjs'

export { PALETTE }

export default {
  name: 'coquette',
  title: 'Coquette',
  kind: 'creative',
  description: 'Ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    try {
      const nodes = render(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, fill: 'none', stroke: col('ink'), 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k',
      }])
    } catch { return [] }
  },
}
