// KAWAII — creative. The cutest set on the web, built on the baby schema
// (Kindchenschema): every sharp corner is filleted generously so silhouettes go
// chubby, a soft thick outline in currentColor holds a pastel body from a
// six-colour candy-box palette, and the largest open area of the body gets a
// tiny face: low, wide-set dot eyes, a "u" or "w" smile and pink blush. Glyphs
// that should not wear a face (arrows, chevrons, punctuation, text tools) get a
// little heart or sparkle beside them instead.
//
// Colours (every one a CSS custom property with a literal fallback):
//   --with-kawaii-fill-1 #FF6FA5 strawberry  --with-kawaii-fill-4 #45D99A mint
//   --with-kawaii-fill-2 #FF9A66 peach       --with-kawaii-fill-5 #5AB4FF baby blue
//   --with-kawaii-fill-3 #FFD23A lemon       --with-kawaii-fill-6 #A98BFF lavender
//   --with-kawaii-blush #FF6F9C, --with-kawaii-shine #FFFFFF, --with-kawaii-accent #FF5C9A (hearts),
//   --with-kawaii-sparkle #FFB627, --with-kawaii-face (eyes and mouth, defaults to currentColor).
// Bodies are laid at 55-72% opacity: soft pastels on white, jewel tones on dark.
// Per-icon expression / position / colour: ./_kawaii-tune.mjs.
import { render as renderCore, INK } from './_kawaii-core.mjs'
import { kawaiiSnowman } from './_kawaii-snowman.mjs'
import { kawaiiDragon } from './_kawaii-dragon.mjs'

export default {
  name: 'kawaii',
  title: 'Kawaii',
  kind: 'creative',
  description: 'Chubby pastel shapes with a soft thick outline and a tiny blushing face: the cutest icons on the web.',
  strokeWidth: INK,
  root: { fill: 'none', stroke: 'currentColor', 'stroke-width': INK, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render(icon) {
    // hand-drawn per-icon drawings (the skeleton stays the base for every other style)
    if (icon.name === 'snowman' && !icon.params) { try { return kawaiiSnowman() } catch { /* the generic build below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return kawaiiDragon() } catch { /* the generic build below */ } }
    try {
      const nodes = renderCore(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    // fallback: the plain skeleton at kawaii weight, so nothing ever renders empty
    return (icon.paths || []).filter(p => p && p.d).map(p => ['path', { d: p.d }])
  },
}
