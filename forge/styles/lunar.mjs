// LUNAR: creative (site group "Holidays"). Lunar New Year icons for campaigns, red-envelope promos and app
// themes across East and Southeast Asia: lucky red lacquer bodies with a gold-foil rim, gold parts, jade
// signals, a fine paper-cut gold line inside broad shapes, an auspicious cloud scroll in open centres, a silk
// tassel under things that hang and a plum blossom where it means something. No text or characters.
//
// Rich style (forge/CONTRACT.md "Rich styles"): one defs node first (ids wg-lunar-<icon>-<n>, userSpaceOnUse),
// every colour a role-named variable --with-lunar-<role> (ink c1 c2 c3 c4 tint accent shadow shine edge).
// Geometry: _lunar-core.mjs (on the private Solid copy _lunar-solid.mjs). Palettes: _lunar-palettes.mjs.
import { build, fallback } from './_lunar-core.mjs'
import { PALETTES, DEFAULT } from './_lunar-palettes.mjs'

export { PALETTES, DEFAULT as PALETTE }
import { snowmanNodes } from './_holiday-snowman.mjs'
import { dragonNodes } from './_holiday-dragon.mjs'

export default {
  name: 'lunar',
  title: 'Lunar New Year',
  kind: 'creative',
  description: 'Lunar New Year: lucky red lacquer with a gold-foil rim, gold and jade parts, paper-cut cloud scrolls, silk tassels and plum blossoms.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon.name === 'snowman' && !icon.params) { try { return snowmanNodes('lunar') } catch { /* below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return dragonNodes('lunar') } catch { /* below */ } }
    try {
      const nodes = build(icon)
      if (nodes && nodes.length > 1) return nodes
    } catch { /* degrade below: never throw */ }
    try { return fallback(icon) } catch { return [] }
  },

}
