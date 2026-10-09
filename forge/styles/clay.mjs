// CLAY: creative (site group "AI"). Faux-3D vector clay: every icon becomes a chunky, soft,
// inflated object of matte clay / soft vinyl, like the 3D object icons of modern AI assistants.
// Plump forms seen slightly from above-front, lit from the upper left: a radial-gradient face
// rolling into shade, a visible side wall, a soft ground shadow, a broad soft highlight, a lit
// rim and a crisp specular; secondary parts (A) in a complementary clay, badges and modifiers (S)
// as glossy candy. Pure-line glyphs become extruded round tubes with the same light.
// Rich style (forge/CONTRACT.md "Rich styles"): one defs node of userSpaceOnUse gradients with
// ids wg-clay-<icon>-<n>; every colour is a role variable --with-clay-<role> with a fallback.
// Model: _clay-model.mjs (on _clay-field.mjs); light: _clay-core.mjs; colour: _clay-color.mjs;
// per-icon tuning: _clay-tune.mjs.
import { snowman } from './_clay-snowman.mjs'
import { dragon } from './_rich-dragon.mjs'
import { piggy } from './_clay-piggy.mjs'
import { build } from './_clay-core.mjs'
import { BASE } from './_clay-color.mjs'

const col = r => `var(--with-clay-${r}, ${BASE[r]})`

export default {
  name: 'clay',
  title: 'Clay',
  kind: 'creative',
  description: 'Soft faux-3D clay: plump, inflated objects of matte clay and soft vinyl, lit from above with a visible thickness, a soft ground shadow and glossy candy badges.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon && icon.name === 'snowman') { try { return snowman() } catch { /* generic below */ } }
    if (icon && icon.name === 'dragon-head') { try { return dragon('clay') } catch { /* generic below */ } }
    if (icon && icon.name === 'piggy-bank') { try { return piggy() } catch { /* generic below */ } }
    try {
      const nodes = build(icon)
      if (nodes && nodes.length) return nodes
    } catch { /* degrade below: never throw */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: col(p.plate === 'S' ? 'c3' : p.plate === 'A' ? 'c2' : 'c1'),
        'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-' + (p.plate || 'K').toLowerCase(),
      }])
    } catch { return [] }
  },
}
