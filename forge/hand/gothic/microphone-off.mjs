// forge/hand/gothic/microphone-off.mjs — a clear capsule-and-stand microphone (ruby capsule with lancet grille,
// gilded yoke, stem and foot) struck through by a thin gilded slash in its moat, so it no longer reads as a hand.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const yoke = g.stroke('M5.6 10.6 A6.4 6.4 0 0 0 18.4 10.6', 1.7)
  const parts = [
    g.gilt(g.union(yoke, g.seg(12, 17, 12, 20.4, 1.7), g.rr(8.2, 19.8, 15.8, 21.6, 0.8)), { plate: 'A' }),
    ...g.pane(g.rr(8.2, 2.4, 15.8, 14.6, 3.8), 'c1', { frame: 1.3, tracery: 'lancet', glass: { s: 2 } }),
    ...g.slash(3.6, 3.6, 20.4, 20.4, 1.5),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
