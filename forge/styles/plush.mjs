// PLUSH — creative, for kids. Every icon is a soft stuffed toy sewn from felt and fleece:
// puffy inflated panels with dark piping, one gentle fabric shade and a soft highlight,
// a running stitch along every seam, sewn-on buttons, embroidered details and the odd
// little label. Joyful, safe, huggable; reads at 24px.
//
// Design system: forge/styles/PLUSH-GUIDE.md.
//   _plush-field.mjs     signed-distance engine (private copy)
//   _plush-prim.mjs      shapes as fields: circle rr pill seg bar arc poly heart cloud + booleans/offsets
//   _plush-kit.mjs       the vocabulary: felt tube flat thread knot moat button patch tag smile badge arrow
//   _plush-compose.mjs   pieces -> nodes: ground, piping, felt, shade, highlight, stitches; motion parts
//   _plush-auto.mjs      the automatic stuffed-toy maker (any skeleton, Live icons; Live text on felt labels)
//   _plush-live.mjs      Live icons dressed as their static families (calendar, mail, bell, folder, battery,
//                        watch) and meters sewn in full (signal, wifi, rating, progress: empty steps in cream)
//   _plush-exemplars.mjs the art director's exemplars; _plush-redraw-1..5.mjs the hand redraws
//
// Variables (role-named, forge/lib/palette-map.mjs): --with-plush-<role>
//   ink #4A2C3D piping + embroidery   c1 #F4695E tomato   c2 #FFC53D sunflower   c3 #4C9FE6 sky
//   c4 #4FBF8A mint   accent #FF8DB4 bubblegum   tint #FFF0D9 cream felt   shadow #3A1E46 fabric shade
//   shine #FFFFFF fleece highlight   edge #FFF9F0 light stitching thread
// No ids, defs, gradients, filters, masks or text: every layer is real geometry.
import render from './_plush-render.mjs'
import { PALETTE } from './_plush-compose.mjs'

export { PALETTE }

export default {
  name: 'plush',
  title: 'Plush',
  kind: 'creative',
  description: 'Stuffed-toy icons sewn from felt: puffy panels, dark piping, running stitches, buttons and embroidered details.',
  strokeWidth: false,
  root: { fill: 'currentColor' },
  render(icon) {
    try {
      const nodes = render(icon)
      if (nodes.length) return nodes
    } catch { /* degrade below */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', { d: p.d, fill: 'none', stroke: 'var(--with-plush-ink, #4A2C3D)', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
    } catch { return [] }
  },
}
