// forge/hand/liquid/award.mjs: a medal in liquid glass: a thick clear disc with an enamel bead set in a moat at its
// centre, and a V-notched ribbon tucked behind it in coloured glass (the generated rosette was a pale ring that faded
// into the page), built by the style's own glass recipe with a deeper tint.
import { build } from '../../styles/_liquid-core.mjs'
import * as F from '../../styles/_liquid-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'

// pre-frame units (the style scales them into its frame)
const DISC = 'M4.6 8.75A7.4 7.4 0 1 1 19.4 8.75A7.4 7.4 0 1 1 4.6 8.75Z'
// the enamel centre: a closed badge ring the core grows into a bead and clears a moat around
const BEAD = 'M9.6 8.75A2.4 2.4 0 1 1 14.4 8.75A2.4 2.4 0 1 1 9.6 8.75Z'
// the ribbon's top edge follows the disc a hairline away, so it sits behind the medal
const RIBBON = 'M7.25 15.06L5.5 22.25L12 19.5L18.5 22.25L16.75 15.06A7.9 7.9 0 0 1 7.25 15.06Z'

const rings = d => parsePath(d).map(s => s.pts)
// exact fill plus its outline inset by half the tube width: the tube adds nothing to the silhouette
const inset = (d, e, plate) => F.trace(F.offset(F.region(rings(d), 2), e), 0.02, 0.2).map(pts => ({ pts, closed: true, plate }))

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
  const glass = {
    name: (icon && icon.name) || 'award', paths: [], cutouts: [],
    lines: [
      ...inset(DISC, 1.3, 'K'), ...inset(RIBBON, 1.15, 'A'),
      ...parsePath(BEAD).map(s => ({ pts: s.pts, closed: true, plate: 'S' })),
    ],
    fills: [{ subs: parsePath(DISC) }, { subs: parsePath(RIBBON) }],
  }
  return deepen(build(glass))
}
