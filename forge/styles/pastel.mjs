// PASTEL — creative. Soft, airy, premium pastel icons: gentle colour fields (lavender, peach,
// mint, baby blue, butter, blush) built from 2-4 layered soft shapes, each with a slightly
// deeper rim of its own hue, a soft lighter top plane and a gentle deeper bottom plane, a
// faint cast shadow and one small glint. Details print in a mid-tone ink of the field's hue,
// so every icon stays legible at 24px on white and on dark. Calm, modern, no faces, no die-cut.
//
// Architecture (forge/styles/PASTEL-GUIDE.md):
//   _pastel-render.mjs    EXEMPLAR (art-directed) > REDRAW (_pastel-redraw-1..5.mjs) > automatic composer
//   _pastel-compose.mjs   layers of primitives -> paint entries (motion parts from the skeleton)
//   _pastel-paint.mjs     hues, roles and the lighting model -> IconNodes (frozen)
//   _pastel-auto.mjs      the automatic composer for any skeleton, incl. Live icons
//   _pastel-prim.mjs / _pastel-kit.mjs   the vocabulary redraws are built from
//
// Variables (role-named, forge/lib/palette-map.mjs). Fields take c1..c4 (then accent): c1 is the
// hue of the body (the largest K field), the rest follow in order of appearance; the other roles have a
// per-hue literal fallback (hue-matched by default, one override recolours the role everywhere):
//   --with-pastel-c1..c4, accent   field colours        --with-pastel-tint    paper fields, top plane
//   --with-pastel-edge             rims (deeper hue)    --with-pastel-shadow  bottom plane, cast shadow
//   --with-pastel-ink              detail ink           --with-pastel-shine   the glint
// No ids, defs, gradients, filters or masks: every plane is real geometry with fill-opacity.
import render from './_pastel-render.mjs'
import { PALETTE } from './_pastel-paint.mjs'

export { PALETTE }

export default {
  name: 'pastel',
  title: 'Pastel',
  kind: 'creative',
  description: 'Soft pastel colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle tonal depth.',
  strokeWidth: false,
  root: { fill: 'currentColor' },
  render(icon) {
    try {
      const nodes = render(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below */ }
    // last resort: the centrelines as soft lavender strokes, so nothing renders empty
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', { d: p.d, fill: 'none', stroke: 'var(--with-pastel-edge, #9E87E6)', 'stroke-width': 2.25, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
    } catch { return [] }
  },
}
