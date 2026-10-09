// VALENTINE — creative. Cute Valentine's Day stickers: every icon is a little cartoon in reds, pinks, cream and
// chocolate, outlined in a warm berry line (never black), with a soft top-left highlight and a gentle shade along
// the bottom; gifts and boxes wear polka dots, sweets wear sprinkles, round friendly objects (hearts, mugs, sweets,
// envelopes, clouds) get a tiny face with dot eyes, a smile and blush, and 1-3 little hearts float in the free space.
// Background-free (transparent); reads on white and on #0B0B12.
//
// Build logic: _valentine-core.mjs (on a private copy of the Solid mass builder, _valentine-solid.mjs + _valentine-sfield.mjs);
// per-icon nudges: _valentine-tune.mjs; festival palettes (data): _valentine-palettes.mjs.
//
// Variables (role-named, forge/lib/palette-map.mjs): --with-valentine-<role>
//   ink #6A1B3A berry outline + faces   c1 #FF5C82 body top   c2 #E02C55 body bottom   c3 #8E4A3B chocolate (A parts)
//   c4 #FFF1DE cream inlay   tint #FFD2DE polka dots + sprinkles   accent #FF3366 floating hearts + badges
//   shadow #A3163F shade   shine #FFFFFF highlights   edge #FF8FB0 blush
// One defs node (the body gradient, id wg-valentine-<icon>-0, userSpaceOnUse). No filters, masks, clips or text.
import { valentineNodes, fallback } from './_valentine-core.mjs'
import { PALETTES } from './_valentine-palettes.mjs'

export { PALETTES }
import { snowmanNodes } from './_holiday-snowman.mjs'
import { dragonNodes } from './_holiday-dragon.mjs'

export default {
  name: 'valentine',
  title: 'Valentine',
  kind: 'creative',
  description: "Cute Valentine's stickers: pink-to-red cartoon shapes in a warm berry outline, a soft shine, polka dots and sprinkles, tiny blushing faces and little floating hearts.",
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon.name === 'snowman' && !icon.params) { try { return snowmanNodes('valentine') } catch { /* below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return dragonNodes('valentine') } catch { /* below */ } }
    try {
      const nodes = valentineNodes(icon)
      if (nodes && nodes.length > 1) return nodes
    } catch { /* degrade below: never throw */ }
    try { return fallback(icon) } catch { return [] }
  },
}
