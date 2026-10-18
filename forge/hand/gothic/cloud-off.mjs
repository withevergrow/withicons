// forge/hand/gothic/cloud-off.mjs — the cloud exemplar's sapphire quarry pane on the new skeleton's three lobes,
// struck through by a gilded slash whose moat cleanly separates it from the glass.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const C = g.union(g.circle(7, 14.5, 4.5), g.circle(12.1, 12.1, 6.2), g.circle(17.2, 14.75, 4.25), g.rect(7, 13, 17.2, 19))
  const parts = [
    ...g.pane(C, 'c2', { frame: 1.6, tracery: 'quarry', glass: { medallion: false, s: 2.5 } }),
    ...g.slash(3, 3, 21, 21, 1.6),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
