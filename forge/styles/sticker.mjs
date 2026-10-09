// STICKER — creative. A die-cut vinyl sticker, the kind people collect for laptops,
// planners, Notion pages and Goodnotes journals.
//
// Every icon is printed in bold candy colours with a thick printed-ink outline,
// then cut out with a puffy white paper border (the art silhouette dilated and
// closed, so it ignores notches and never has holes), lifted by a soft offset
// shadow, glazed with one glossy dash + dot, and finished with a sparkle or two
// (now and then a tiny heart or star) in the free corners. Badges, slashes and
// modifiers are mini stickers stuck on top, each with its own paper rim.
//
// Colours are CSS custom properties with literal fallbacks (see _sticker-tune.mjs):
// --with-sticker-{bubblegum,lemon,mint,sky,grape,peach} for the prints, --with-sticker-edge
// for the paper, --with-sticker-ink for the outline, --with-sticker-shine, --with-sticker-shadow.
// The ink defaults to a deep printed plum so a sticker reads the same on white and on
// near-black (white paper next to light ink would vanish); set
// `--with-sticker-ink: currentColor` to drive it from `color`. The paper hairline follows `color`.
// No ids, defs, gradients, filters or masks: depth is layered geometry and opacity.
import { build } from './_sticker-core.mjs'
import { stickerSnowman } from './_sticker-snowman.mjs'
import { stickerDragon } from './_sticker-dragon.mjs'

export default {
  name: 'sticker',
  title: 'Sticker',
  kind: 'creative',
  description: 'Die-cut vinyl stickers in candy colours: bold ink outlines, a puffy white border, a soft drop shadow, a glossy shine and a sparkle or two.',
  strokeWidth: false,
  root: { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render(icon) {
    // hand-drawn per-icon drawings (the skeleton stays the base for every other style)
    if (icon.name === 'snowman' && !icon.params) { try { return stickerSnowman() } catch { /* the generic build below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return stickerDragon() } catch { /* the generic build below */ } }
    try {
      const nodes = build(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    // last resort: the plain line drawing, so nothing ever renders empty
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', { d: p.d, stroke: 'currentColor', 'stroke-width': 1.75 }])
    } catch { return [] }
  },
}
