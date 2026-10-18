// forge/hand/coquette/usb.mjs — the new usb trident as one blush satin ribbon: a rose arrow tip, a pearl on the left
// branch, a gold square on the right branch, a blush base disc, with clear air between branches and stem; the generated
// drawing was the old rose trident whose heavy nodes crowded the joints at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.union(
      k.tube('M12 18.6 V5', 2.8),
      k.tube('M12 16 L5.5 12.7 V10.4', 2.4),
      k.tube('M12 13.9 L19 10.5 V9.4', 2.4),
      k.disc(12, 19.8, 2.4),
    )),
    k.rose(k.poly([[12, 1.4], [15.4, 6.4], [8.6, 6.4]], 0.7), { plate: 'K' }),
    k.pearl(5.5, 9.4, 2.1, { plate: 'K' }),
    k.gold(k.rr(16.8, 5.8, 21.2, 10.2, 0.9), { plate: 'K' }),
  ])
}
