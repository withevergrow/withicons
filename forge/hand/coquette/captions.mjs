// forge/hand/coquette/captions.mjs — the new captions skeleton: a blush screen with a cream panel carrying a bold
// ribbon-red CC mark, and a small bow tied on its corner; the generated drawing was the old caption-lines card that
// read as a card or keyboard.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.body(k.rr(2, 4, 22, 20, 2.6)),
    k.cream(k.rr(3.8, 5.8, 20.2, 18.2, 1.4), { ow: 0.45 }),
    k.satin(k.tube('M10.4 8.6 H8.7 A2.6 2.6 0 0 0 6.1 11.2 V12.8 A2.6 2.6 0 0 0 8.7 15.4 H10.4 M17.9 8.6 H16.2 A2.6 2.6 0 0 0 13.6 11.2 V12.8 A2.6 2.6 0 0 0 16.2 15.4 H17.9', 2), { plate: 'A', ow: 0.45 }),
    k.bow(19.8, 5, 0.46, 18),
  ]].flat(Infinity).filter(Boolean))
}
