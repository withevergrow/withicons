// BAUHAUS — creative. Every icon is a small Bauhaus composition: a few bold
// geometric primitives (full, half and quarter discs, rings, arches, pills,
// lenses, drops, generously rounded rectangles and polygons) in flat fields of
// the primaries, with black geometric accents and cream details.
//
// Design system (see _bauhaus-prim.mjs, _bauhaus-kit.mjs):
//   - curves dominate: every corner is rounded, every bar has round caps; compose
//     softens any remaining sharp corner (0.8u) unless it sits flush on another field
//   - arrowheads are swept (concave back, rounded corners); curved arrows ride the arc
//     with the band buried in the head (kit arcArrow)
//   - 2-4 colours per icon, each primitive one flat colour; overlaps are their
//     own region in black or a deliberate third colour, never a random backdrop
//   - two-part glyphs (chevrons, checks, crosses) print each arm in its own
//     primary with the joint overprinted in black
//   - weights: colour bars 2.5u, black detail bars 2-2.25u, dots r 1.25-2u
//
// Every one of the 500 icons is hand-composed (_bauhaus-redraw-*.mjs; the 20 family
// exemplars in _bauhaus-render.mjs). The design system is forge/styles/BAUHAUS-GUIDE.md. Live
// icons (forge/dynamic) and any future icon fall back to the automatic composer
// (_bauhaus-auto.mjs), which rebuilds the skeleton as rounded flat fields.
//
// Variables (role-named, see forge/lib/palette-map.mjs):
//   --with-bauhaus-ink    currentColor  black geometry, text
//   --with-bauhaus-c1     #E0412E       red
//   --with-bauhaus-c2     #F2B33D       yellow
//   --with-bauhaus-c3     #2A6BC2       blue
//   --with-bauhaus-c4     #E9772E       orange (red over yellow)
//   --with-bauhaus-accent #2E7A5E       green (leaves, money)
//   --with-bauhaus-tint   #F3EBDD       cream paper: light details on dark fields
// No ids, defs, gradients, filters, masks or strokes: every field is real geometry.
import render from './_bauhaus-render.mjs'
import { PALETTE } from './_bauhaus-compose.mjs'

export { PALETTE }

export default {
  name: 'bauhaus',
  title: 'Bauhaus',
  kind: 'creative',
  description: 'Bauhaus compositions in miniature: circles, arches, half and quarter discs and pills in red, yellow, blue and black.',
  strokeWidth: false,
  root: { fill: 'currentColor' },
  render(icon) {
    try {
      const nodes = render(icon)
      if (nodes.length) return nodes
    } catch { /* degrade below */ }
    // last resort: the centrelines as plain round strokes, so nothing renders empty
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', { d: p.d, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
    } catch { return [] }
  },
}
