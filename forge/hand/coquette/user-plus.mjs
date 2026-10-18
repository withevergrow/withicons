// forge/hand/coquette/user-plus.mjs — the common person: a round blush head over a rounded shoulder dome, with a
// small satin bow on the hair as accent, and the red plus badge at the upper right clear of the shoulders.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  const BX = 18.4, BY = 7.2
  return paint([[
    k.body(k.path('M2 21.5 A6.5 6.4 0 0 1 15 21.5 Z')),
    k.body(k.disc(8.5, 8.2, 4.1)),
    k.bow(8.5, 17.4, 0.5, 0),
    k.satin(k.disc(BX, BY, 3.8), { plate: 'S', ow: 0.55 }),
    k.fill(k.union(k.seg(BX - 1.8, BY, BX + 1.8, BY, 1.3), k.seg(BX, BY - 1.8, BX, BY + 1.8, 1.3)), 'edge', { plate: 'S' }),
  ]].flat(Infinity).filter(Boolean))
}
