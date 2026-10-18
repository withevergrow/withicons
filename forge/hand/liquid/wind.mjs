// forge/hand/liquid/wind.mjs: three gusts as liquid-glass tubes, the long middle one clear glass and the two short
// ones coloured glass, with rounder, more open curls and a deeper tint (the generated tubes were so pale they faded
// into the page), built by the style's own glass recipe.
import { build } from '../../styles/_liquid-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

// pre-frame units (the style scales them into its frame); the tails curl back clear of their own stem
const GUSTS = [
  ['M2.75 8H9.25A3 3 0 1 0 6.4 4.05', 'A'],
  ['M2.75 12.25H18A3.25 3.25 0 1 0 15.1 7.4', 'K'],
  ['M2.75 16.5H13.5A3 3 0 1 1 10.65 20.45', 'A'],
]

const DEEP = { 0: [0.34, 0.56, 0.8], 1: [0.55, 0.95] }
function deepen(nodes) {
  const defs = nodes[0]
  if (defs && defs[0] === 'defs') for (const g of defs[2]) {
    const t = DEEP[g[1].id.split('-').pop()]
    if (t) g[2] = g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': t[i] }])
  }
  // the ink hairline a touch firmer on these slim tubes
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = 0.42
  return nodes
}

export default function render(icon) {
  const glass = {
    name: (icon && icon.name) || 'wind', paths: [], fills: [], cutouts: [],
    lines: GUSTS.flatMap(([d, plate]) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))),
  }
  return deepen(build(glass))
}
