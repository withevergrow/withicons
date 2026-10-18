// forge/hand/coquette/salad.mjs — the new salad skeleton: a wide blush bowl on a little foot, with a rose carrot
// stick, a cream half egg with a gold yolk and a ruffled lettuce leaf poking out over the rim; replaces the older
// bowl with a single leaf and a heart.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const BOWL = 'M2.4 11.8 H21.6 C21.6 16.4 17.4 19.4 12 19.4 C6.6 19.4 2.4 16.4 2.4 11.8 Z'

export default function render() {
  return paint([[
    // lettuce leaf, back left
    k.blush(k.path('M4.6 12.4 C4 9 5.4 5.6 8.4 4.4 C9.6 5.6 11 7.8 11.4 12.4 Z'), { plate: 'A' }),
    k.ink('M6 11.8 C6.6 9.4 7.4 7.4 8.4 5.6', 0.6, { plate: 'A' }),
    // carrot stick, back right, with its leafy top
    k.ink('M18.4 5.2 L19.6 3.4 M18.8 5.6 L20.8 4.8', 0.8, { plate: 'A' }),
    k.rose(k.poly([[17.2, 5.2], [19.4, 6.4], [16.4, 12.6], [14.4, 12]], 0.6), { plate: 'A' }),
    // half egg, middle
    k.cream(k.ellipse(12.4, 10.8, 3.2, 3.6), { plate: 'A' }),
    k.gold(k.disc(12.4, 11.2, 1.6), { plate: 'A', ow: 0.4 }),
    k.body(k.rr(9.2, 18, 14.8, 20.8, 0.8)),
    k.body(k.path(BOWL)),
  ]].flat(Infinity).filter(Boolean))
}
