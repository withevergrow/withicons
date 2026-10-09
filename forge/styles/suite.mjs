// SUITE: creative (site group "Product"). Colour icons for enterprise and productivity
// apps: each icon is 2-3 layered flat planes with gentle gradients. A main body plane in a
// calm blue, a second plane in violet behind it, light panes and inlays set into it,
// a deeper folded corner on documents, translucent overlap where planes cross, and
// plate-S modifiers as bright warm badges. No outlines, no shadows, crisp edges.
// Built for 24-48 px in dense UIs and nav bars, on white and on #0B0B12.
//
// Rich style (forge/CONTRACT.md "Rich styles"): one defs node first with the per-plane
// sheen gradients (ids wg-suite-<icon>-<n>, userSpaceOnUse), every colour a role-named
// variable --with-suite-<role>: ink c1 c2 c3 c4 tint accent shadow shine edge.
// Geometry: _suite-core.mjs (on the private field engine _suite-field.mjs).
import { snowman } from './_suite-snowman.mjs'
import { dragon } from './_rich-dragon.mjs'
import { build, col, PALETTE } from './_suite-core.mjs'

export { PALETTE }

export default {
  name: 'suite',
  title: 'Suite',
  kind: 'creative',
  description: 'Office-suite colour icons: layered flat planes in calm blues and violets with gentle gradients, folded corners and bright badges.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon && icon.name === 'snowman') { try { return snowman() } catch { /* generic below */ } }
    if (icon && icon.name === 'dragon-head') { try { return dragon('suite') } catch { /* generic below */ } }
    try {
      const nodes = build(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: col(p.plate === 'S' ? 'accent' : p.plate === 'A' ? 'c2' : 'c1'),
        'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        class: p.plate === 'S' ? 'wm-s' : p.plate === 'A' ? 'wm-a' : 'wm-k',
      }])
    } catch { return [] }
  },
}
