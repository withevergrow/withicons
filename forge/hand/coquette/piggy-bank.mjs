// forge/hand/coquette/piggy-bank.mjs — a round blush pig in profile with a rose snout, ear and legs, a coin slot on its
// back, a gold coin dropping in, and a little bow by the ear.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.rose(k.union(k.rr(6.4, 15, 8.8, 20.6, 1.1), k.rr(13.6, 15, 16, 20.6, 1.1)), { plate: 'K' }),
    k.body(k.cut(k.union(k.ellipse(11.6, 13, 8, 6.2), k.poly([[13.6, 8.4], [16.4, 5], [17.4, 9.6]], 0.6)),
      k.pill(9, 7.4, 13.2, 8.6))),
    k.rose(k.ellipse(19.7, 13.4, 1.7, 2.3), { plate: 'K' }),
    k.fill(k.union(k.disc(15.8, 11.6, 0.8), k.disc(19.3, 12.8, 0.35), k.disc(20.1, 14, 0.35)), 'ink', { plate: 'K' }),
    k.ink('M3.8 12.4 Q2.2 12.8 2.8 11 Q3.4 9.8 2.2 9.8', 1),
    k.gold(k.disc(11.1, 3.8, 2.3), { plate: 'S', ow: 0.4 }),
    k.bow(6.6, 8.6, 0.42, -20),
  ]].flat(Infinity).filter(Boolean))
}
