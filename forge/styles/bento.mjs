// BENTO: creative (rich style, site group "Product"). Icons for feature grids, bento layouts and
// dashboards: every icon sits on its own rounded-square tile (a continuous-corner squircle, 2 -> 22)
// with a soft tinted gradient, a faint edge and a hairline top highlight; the glyph is centred at
// ~60% in a strong duotone with a tiny soft drop shadow for lift.
// Colours are role-named variables --with-bento-<role> (forge/lib/palette-map.mjs), so each icon's
// palettes recolour the tile and the glyph. Build logic: _bento-core.mjs.
import { snowman } from './_bento-snowman.mjs'
import { dragon } from './_rich-dragon.mjs'
import { build, fallback } from './_bento-core.mjs'

export default {
  name: 'bento',
  title: 'Bento',
  kind: 'creative',
  description: 'Feature-grid tiles: each glyph sits on a soft gradient squircle with a hairline highlight, in a crisp duotone with a gentle lift.',
  strokeWidth: false,
  root: { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render(icon) {
    if (icon && icon.name === 'snowman') { try { return snowman() } catch { /* generic below */ } }
    if (icon && icon.name === 'dragon-head') { try { return dragon('bento') } catch { /* generic below */ } }
    try {
      const nodes = build(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    try { return fallback(icon) } catch { return [] }
  },
}
