// RANGOLI: creative (site group "Holidays"). Brand-grade Indian festival icons for Diwali, Durga Puja and Holi
// campaigns: one clean, confident object in a warm festive glow gradient, plus ONE Indian festival motif chosen per
// icon (a rangoli petal ring behind round objects, a lotus base under vessels, a toran of mango leaves under a top
// edge, a marigold, a diya flame, Diwali twinkles, a Holi gulal burst, or an inlaid paisley). Modern and premium,
// never kitsch: the motif simplifies away when an icon is too dense to carry it.
//
// Rich style (forge/CONTRACT.md "Rich styles"): one defs node first (ids wg-rangoli-<icon>-<n>, userSpaceOnUse),
// every colour a role variable --with-rangoli-<role> (ink c1 c2 c3 c4 tint accent shadow shine edge). Festival
// palettes (Diwali default, Durga Puja, Holi, Navratri, Pongal, Onam, jewel tones ...) in _rangoli-palettes.mjs.
// Build: _rangoli-core.mjs; motifs: _rangoli-motifs.mjs; per-icon motif choice: _rangoli-tune.mjs.
import { build, col, PALETTE } from './_rangoli-core.mjs'
import { PALETTES } from './_rangoli-palettes.mjs'

export { PALETTE, PALETTES }
import { snowmanNodes } from './_holiday-snowman.mjs'
import { dragonNodes } from './_holiday-dragon.mjs'

export default {
  name: 'rangoli',
  title: 'Rangoli',
  kind: 'creative',
  description: 'Indian festival icons for Diwali, Durga Puja and Holi: clean objects in a warm festive glow, each with one motif of its own (rangoli petals, lotus, toran, marigold, diya flame or gulal).',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon.name === 'snowman' && !icon.params) { try { return snowmanNodes('rangoli') } catch { /* below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return dragonNodes('rangoli') } catch { /* below */ } }
    try {
      const nodes = build(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: col(p.plate === 'S' ? 'c4' : p.plate === 'A' ? 'c3' : 'c2'),
        'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        class: p.plate === 'S' ? 'wm-s' : p.plate === 'A' ? 'wm-a' : 'wm-k',
      }])
    } catch { return [] }
  },
}
