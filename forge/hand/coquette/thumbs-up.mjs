// forge/hand/coquette/thumbs-up.mjs — the common upright thumb over a rounded fist with finger grooves and a rose cuff
// on the left; a pearl row trims the cuff and one small satin bow sits in the free top-left corner.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.body(k.path('M7 10 L9.97 3.78 A2.25 2.25 0 0 1 14.25 4.88 L14 9 H18.5 C19.9 9 20.9 10.3 20.6 11.7 L19.2 19.1 C19 20.2 18.1 21 17 21 H7 Z')),
    k.ink('M11.2 13.4 H19.7 M10.8 16.9 H18.9', 0.8),
    k.rose(k.path('M7 10 H4.5 A1.5 1.5 0 0 0 3 11.5 V19.5 A1.5 1.5 0 0 0 4.5 21 H7 Z'), { plate: 'A' }),
    k.pearls('M5 12.7 V18.8', 0.62),
    k.bow(5.6, 5.4, 0.56, -14),
  ]].flat(Infinity).filter(Boolean))
}
