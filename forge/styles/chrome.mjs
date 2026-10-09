// CHROME: creative (Trend). Liquid metal / Y2K chrome: every icon is a polished, inflated
// chrome object. The silhouette is thickened and rounded, then painted with a reflective
// chrome ramp (bright sky above, a sharp dark horizon just above the middle, a warm ground
// reflection below, a bright bounce at the bottom edge), a dark outer edge, a lighter
// bevelled inner rim, a white sheen along the upper-left edges, one specular glint and a
// soft shadow. A parts are gunmetal, S parts are enamel jewels in a chrome bezel.
// Rich style (forge/CONTRACT.md): one defs node of linear gradients, ids wg-chrome-<icon>-<n>;
// every colour is a role variable --with-chrome-<role> with a literal fallback.
// Geometry and paint: _chrome-core.mjs (on _chrome-field.mjs / _chrome-path.mjs);
// per-icon tuning: _chrome-tune.mjs.
import { snowman } from './_chrome-snowman.mjs'
import { dragon } from './_rich-dragon.mjs'
import { build, col } from './_chrome-core.mjs'

export default {
  name: 'chrome',
  title: 'Chrome',
  kind: 'creative',
  description: 'Liquid metal Y2K chrome: every icon an inflated, polished object with a mirror horizon, bevelled rim, crisp glint and soft shadow.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon && icon.name === 'snowman') { try { return snowman() } catch { /* generic below */ } }
    if (icon && icon.name === 'dragon-head') { try { return dragon('chrome') } catch { /* generic below */ } }
    try {
      const nodes = build(icon)
      if (nodes && nodes.some(n => n[0] === 'path')) return nodes
    } catch { /* degrade below: never throw */ }
    try {
      return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
        d: p.d, stroke: col(p.plate === 'S' ? 'accent' : p.plate === 'A' ? 'c2' : 'c1'),
        'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }])
    } catch { return [] }
  },
}
