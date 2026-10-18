// forge/hand/gothic/piggy-bank.mjs: a round ruby-glass pig in side view on stone legs, stone ear and snout with a
// nostril, curled tail, an eye, a slot on top and a gilded coin dropping into it.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { cut as sub } from '../../styles/_gothic-prim.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'
const out = (parts, icon) => paint(enamel(parts.flat(Infinity).filter(Boolean), icon))

export default function render(icon) {
  const body = g.ellipse(11.3, 14, 7.2, 6)
  const slot = g.seg(9.2, 8.9, 13.4, 8.9, 0.7)
  const legs = g.union(g.rr(7.2, 18, 9.6, 21.5, 1), g.rr(13, 18, 15.4, 21.5, 1))
  const snout = g.rr(17.6, 12.1, 21.1, 15.9, 1.1)
  return out([
    g.stone(legs),
    g.stone(g.stroke('M4.3 12.8 C2.8 12.8 2.3 11 3.3 10.4 C4.2 10 4.8 11 4 11.6', 0.9)),
    g.glass(sub(body, slot, g.circle(15.6, 12.1, 0.6)), 'c1', { tracery: 'none' }),
    g.stone(g.path('M14.2 9 L17.9 6.6 L17.5 11 Z')),
    g.stone(sub(snout, g.ellipse(19.85, 14, 0.45, 0.65))),
    g.gilt(sub(g.circle(11.3, 5.2, 2.3), g.ring(11.3, 5.2, 1.1, 0.5)), { plate: 'S' }),
  ], icon)
}
