// forge/hand/coquette/history.mjs — the new skeleton's backward clock: a blush satin ribbon arc round a cream clock face
// with ribbon-red hands on a pearl, a large rounded arrowhead set clear on the left end and a small bow on the ribbon's
// tail; it replaces the old bespoke drawing whose small hooked arrowhead vanished at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.body(k.union(
      k.tube('M9 20 A8.5 8.5 0 1 0 4.5 11.6', 2.4),
      k.poly([[1.4, 10.8], [7.6, 10.8], [4.5, 15]], 0.7),
    )),
    k.cream(k.disc(13, 12.5, 5.4)),
    k.satin(k.tube('M13 9 V12.5 L15.8 14.3', 1.6), { plate: 'A' }),
    k.pearl(13, 12.5, 0.9, { plate: 'A' }),
    k.bow(8.6, 20.2, 0.56, -20),
  ]].flat(Infinity).filter(Boolean))
}
