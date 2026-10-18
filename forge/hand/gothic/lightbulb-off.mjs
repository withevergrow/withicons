// forge/hand/gothic/lightbulb-off.mjs — the common bulb: a round sapphire glass dome tapering to a neck, a stone screw
// cap with iron threads and a tip, an unlit filament and a gilded slash; the generated drawing read as a key or lantern.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const bulb = g.union(g.circle(12, 9, 7), g.poly([[6.6, 11.6], [17.4, 11.6], [14.9, 16.4], [9.1, 16.4]]))
  const base = g.rr(8.8, 16, 15.2, 20.8, 1.3)
  const parts = [
    g.stone(base, { plate: 'K' }),
    g.iron(g.rr(10.4, 20.4, 13.6, 22.2, 0.9), { plate: 'K' }),
    g.lead([[[8.8, 18], [15.2, 18]], [[9, 19.8], [15, 19.8]]], { w: 0.6 }),
    ...g.pane(bulb, 'c2', { frame: 1.4, tracery: 'none', glass: { dark: 0.2, glow: 0.1 } }),
    g.lead([[[9.8, 16], [10.2, 11.2], [12, 9.6], [13.8, 11.2], [14.2, 16]]], { w: 0.7 }),
    ...g.slash(4.4, 4.4, 19.6, 19.6, 1.8),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
