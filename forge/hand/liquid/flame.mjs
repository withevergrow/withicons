// forge/hand/liquid/flame.mjs: a flame in clear liquid glass with a tall leaning tip, a deep notch and a separate side
// tongue, plus a pointed inner tongue inlaid as coloured glass (the generated drawing rounded the notch away and
// ringed the inner tongue, so it read as a drop inside a drop), built by the style's own glass recipe.
import { build } from '../../styles/_liquid-core.mjs'
import * as F from '../../styles/_liquid-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'

// outer silhouette (pre-frame units; the style scales it into its frame)
const FLAME = 'M12 22.75C7.5 22.75 3.75 19.5 3.75 15C3.75 11.25 4.75 7.75 6.75 4.75C7.5 7.25 8.75 9.25 10.5 10C10 6.25 11.5 3.25 14.75 1C18.5 4.25 20.25 9.25 20.25 15C20.25 19.5 16.5 22.75 12 22.75Z'
// inner tongue: a small flame with a pointed tip, set in a moat of the clear glass
const TONGUE = 'M12 19.75C10.1 19.75 8.75 18.4 8.75 16.6C8.75 14.6 10.25 13.6 11.5 12.5C12.4 11.7 13.25 11 14 10.25C14.75 12.5 15.75 14.4 15.75 16.6C15.75 18.4 13.9 19.75 12 19.75Z'

const rings = d => parsePath(d).map(s => s.pts)
// a piece is its exact fill plus its outline inset by half the style's tube width, so the tube adds nothing to the
// silhouette (no rounded-off notch) while the core still knows which plate the fill belongs to
const inset = (d, e, plate) => F.trace(F.offset(F.region(rings(d), 2), e), 0.02, 0.2).map(pts => ({ pts, closed: true, plate }))
const piece = (d, plate, e) => ({ fill: { subs: parsePath(d) }, lines: inset(d, e, plate) })

const DEEP = { 0: [0.26, 0.48, 0.74], 1: [0.5, 0.92] }
function deepen(nodes) {
  const defs = nodes[0]
  if (defs && defs[0] === 'defs') for (const g of defs[2]) {
    const t = DEEP[g[1].id.split('-').pop()]
    if (t) g[2] = g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': t[i] }])
  }
  return nodes
}

export default function render(icon) {
  const parts = [piece(FLAME, 'K', 1.3), piece(TONGUE, 'A', 1.15)]
  const glass = {
    name: (icon && icon.name) || 'flame', paths: [], cutouts: [],
    lines: parts.flatMap(p => p.lines), fills: parts.map(p => p.fill),
  }
  return deepen(build(glass))
}
