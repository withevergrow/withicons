// forge/hand/coquette/smartphone.mjs — a blush satin phone with a deep, clearly inset cream screen, a rose earpiece
// and home bar, and one small bow tied on its corner; the generated drawing hung a heart on the screen, a pearl
// string and a second floating heart off the side, which buried the phone at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.body(k.rr(5.6, 2.5, 18.4, 21.5, 2.9)),
    k.cream(k.rr(7.6, 5, 16.4, 17, 1.2), { ow: 0.6 }),
    k.fill(k.pill(10.6, 3.35, 13.4, 4.25), 'c2'),
    k.rose(k.pill(10, 18.6, 14, 19.9), { plate: 'K', ow: 0.4 }),
    // tied on the corner: it buzzes with the phone
    k.bow(17.2, 3.7, 0.52, 18, { plate: 'K' }),
  ]].flat(Infinity).filter(Boolean))
}
