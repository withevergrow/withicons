// forge/hand/gothic/water-balloon.mjs: a plump sapphire glass balloon drawn to a tiny tied knot with a short tail,
// a calm deeper pool of water under one gentle surface line and a clear glint on the swell.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const body = g.path('M12 5.4 C11.2 6.6 10.2 7.4 8.6 8.6 C6 10.4 4.6 12.6 4.6 15 C4.6 18.8 7.8 21.8 12 21.8 C16.2 21.8 19.4 18.8 19.4 15 C19.4 12.6 18 10.4 15.4 8.6 C13.8 7.4 12.8 6.6 12 5.4 Z')
  const inner = g.shrink(body, 1.2)
  const below = g.poly([[3, 15.4], [8, 14.9], [12, 15.4], [16, 14.9], [21, 15.4], [21, 23], [3, 23]])
  const water = g.inter(inner, below)
  const parts = [
    g.stone(g.stroke('M12 5.2 C12.4 4 13.4 3.3 14.6 3.5', 0.95), { plate: 'K' }),
    ...g.pane(body, 'c2', { frame: 1.0, tracery: 'none', glass: { glow: 0.3 } }),
    g.glass(water, 'c2', { plate: 'A', tracery: 'none', outline: 0.2, glint: false }),
    g.lead([[[8.4, 14.9], [12, 15.4], [15.6, 14.9]]], { w: 0.45 }),
    g.stone(g.circle(12, 5.7, 1.15), { plate: 'S' }),
    g.shine(g.stroke('M7.3 14 C7.5 12.4 8.6 11.1 10.1 10.3', 1.3), { plate: 'K', op: 0.95 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
