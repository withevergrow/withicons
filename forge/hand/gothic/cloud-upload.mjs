// forge/hand/gothic/cloud-upload.mjs — the cloud exemplar's sapphire pane (plain glass, three lobes) with one big gilded
// upload arrow rising through it, a solid triangular head and a broad shaft running out below the cloud, as in the line
// set; the generated drawing set a tiny arrow in a lattice shield and lost the cloud outline at small size.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const C = g.union(g.circle(6.6, 12.6, 4.2), g.circle(12, 9.6, 5.8), g.circle(17.4, 12.8, 4.1), g.rect(6.6, 11.5, 17.4, 16.9))
  const parts = [
    ...g.pane(C, 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.union(g.rr(10.3, 11, 13.7, 21.6, 0.5), g.poly([[12, 7.6], [17, 13.6], [7, 13.6]])), { plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
