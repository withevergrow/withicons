// forge/hand/gothic/cast.mjs: a stone screen frame left open at the lower-left corner, its sapphire glass carved back in
// a quarter circle so a clear moat separates it from the gilt cast waves and dot; reads as cast, not an RSS feed.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import * as P from '../../styles/_gothic-prim.mjs'

export default function render() {
  const glassF = P.cut(g.rr(3.4, 5, 20.6, 19, 1.2), g.circle(2.8, 19.2, 12))
  return paint([
    g.glass(glassF, 'c2', { tracery: 'lancet', s: 3, dark: 0.36 }),
    g.stone(g.stroke('M3.5 8 V6.2 A2.2 2.2 0 0 1 5.7 4 H19.4 A2.2 2.2 0 0 1 21.6 6.2 V17.8 A2.2 2.2 0 0 1 19.4 20 H14.8', 2.1), { ticks: [[[11.5, 2.5], [11.5, 5.5]], [[20, 12], [23, 12]]] }),
    g.gilt(g.union(g.arc(2.8, 19.2, 8.4, -90, 0, 1.9), g.arc(2.8, 19.2, 4.8, -90, 0, 1.9), g.circle(3.5, 18.5, 1.5)), { plate: 'A' }),
  ])
}
