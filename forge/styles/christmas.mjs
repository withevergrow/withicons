// CHRISTMAS — creative (site group "Holidays"). Warm, cosy, premium seasonal icons for holiday app themes,
// campaigns and emails: cranberry, pine, gold and cream forms with a deep outline and a soft warm light,
// a snow cap resting on every top edge (real geometry following the silhouette), candy-cane stripes on
// secondary parts, a tiny holly sprig on the snow and one gold sparkle.
// Rich style (forge/CONTRACT.md "Rich styles"): one defs node, ids wg-christmas-<icon>-<n>, every colour a
// role variable --with-christmas-<role>. Build logic: _christmas-core.mjs; tuning: _christmas-tune.mjs;
// palettes: _christmas-palettes.mjs.
import { christmasNodes, C } from './_christmas-core.mjs'
import { snowmanNodes } from './_holiday-snowman.mjs'
import { dragonNodes } from './_holiday-dragon.mjs'

export default {
  name: 'christmas',
  title: 'Christmas',
  kind: 'creative',
  description: 'Cosy holiday icons: cranberry, pine and gold forms with a soft warm light, a snow cap resting on every top edge, candy-cane stripes and a sprig of holly.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon.name === 'snowman' && !icon.params) { try { return snowmanNodes('christmas') } catch { /* below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return dragonNodes('christmas') } catch { /* below */ } }
    try {
      const n = christmasNodes(icon)
      if (n && n.length) return n
    } catch { /* degrade below: never throw */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: C.c1, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        class: p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : undefined,
      }])
    } catch { return [] }
  },
}
