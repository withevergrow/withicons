// forge/hand/coquette/paw-print.mjs: the common paw: a rounded-triangle main pad with four toes (two outer, two inner) in blush
// satin, a small ribbon-red heart on the pad, and a gold twinkle; it replaces the
// heart-shaped pad.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.path('M12 11.2 C13.7 11.2 14.8 12.7 16.4 14.7 C17.9 16.6 19.2 17.8 19.2 19.1 C19.2 20.4 18 21 16.6 21 H7.4 C6 21 4.8 20.4 4.8 19.1 C4.8 17.8 6.1 16.6 7.6 14.7 C9.2 12.7 10.3 11.2 12 11.2 Z'), { plate: 'K' }),
    k.body(k.ellipse(8.4, 6.1, 1.95, 2.55, -8), { plate: 'A', ow: 0.5 }),
    k.body(k.ellipse(15.6, 6.1, 1.95, 2.55, 8), { plate: 'A', ow: 0.5 }),
    k.body(k.ellipse(3.8, 11, 1.85, 2.45, -28), { plate: 'A', ow: 0.5 }),
    k.body(k.ellipse(20.2, 11, 1.85, 2.45, 28), { plate: 'A', ow: 0.5 }),
    k.heart(12, 17.1, 4, 0, { plate: 'K' }),
    k.sparkle(20.6, 3.4, 1.6),
  ].flat(Infinity))
}
