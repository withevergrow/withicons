// ANIME — creative. Every icon is a prop from a modern anime: crisp ink line art that
// is thin on the lit side and heavier on the shadow side, flat cel colour with ONE
// hard-edged shadow tone per surface (light from the upper left), bright specular
// "anime shine" (a pointed streak and a dot, glass bars on screens, star glints),
// a vivid sky-blue / sakura-pink / warm-gold palette and, now and then, a sparkle.
//
// Architecture (forge/styles/ANIME-GUIDE.md):
//   _anime-compose.mjs   ops -> outline, cel colour, cel + cast shadow, rim light, shine, deco
//   _anime-prim.mjs      shapes;  _anime-kit.mjs  layer constructors + family parts (frozen)
//   _anime-exemplars.mjs the art director's exemplars; _anime-redraw-1..5.mjs hand-drawn icons
//   _anime-auto.mjs      any skeleton (and every live icon) -> ops, automatically
//   _anime-live.mjs      live icons drawn in their static family's colours (clocks, calendars, batteries...)
//   _anime-tune.mjs      palette, measures, colour casting by meaning
// Colours are role-named variables --with-anime-<role> (ink c1 c2 c3 c4 tint accent shadow
// shine edge) with literal fallbacks. No ids, defs, gradients, filters or masks.
import render from './_anime-render.mjs'
import { PALETTE } from './_anime-tune.mjs'

export { PALETTE }

export default {
  name: 'anime',
  title: 'Anime',
  kind: 'creative',
  description: 'Anime cel style: crisp tapered ink line art, flat cel colour with one hard shadow tone, bright specular shine and the odd sparkle, in sky blue, sakura pink and warm gold.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    try {
      const nodes = render(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, fill: 'none', stroke: 'var(--with-anime-ink, #2B2148)', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }])
    } catch { return [] }
  },
}
