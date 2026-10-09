// DOCK: creative (site group "Product"). The polished app-icon look: every icon is an app tile, a
// continuous-corner squircle in the icon's own colour (lighter at the top, deeper at the bottom, a soft
// glow from above, a lit top rim and a darker bottom rim) carrying the glyph as a raised light object
// with its own subtle gradient, a darker bottom lip and a soft shadow on the tile. Free-standing parts
// (plate A) are separate pieces; badges and modifiers (plate S) are small coloured badges.
// Rich style (forge/CONTRACT.md "Rich styles"): one defs node of userSpaceOnUse gradients with ids
// wg-dock-<icon>-<n>, every colour a role variable --with-dock-<role> with a literal fallback.
// Geometry and paint: _dock-core.mjs. Default colourways per icon: _dock-tune.mjs.
import { snowman } from './_dock-snowman.mjs'
import { dragon } from './_rich-dragon.mjs'
import { build } from './_dock-core.mjs'

export default {
  name: 'dock',
  title: 'Dock',
  kind: 'creative',
  description: 'App-icon tiles: a glossy continuous-corner squircle in a rich two-tone colour carrying a raised, softly shaded glyph, so a set of icons looks like a colourful dock.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon && icon.name === 'snowman') { try { return snowman() } catch { /* generic below */ } }
    if (icon && icon.name === 'dragon-head') { try { return dragon('dock') } catch { /* generic below */ } }
    try {
      const nodes = build(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    // last resort: the line drawing, so nothing ever renders empty
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }])
    } catch { return [] }
  },
}
