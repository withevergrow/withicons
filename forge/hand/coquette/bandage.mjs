// forge/hand/coquette/bandage.mjs — the new bandage: a diagonal blush strip with a cream gauze pad across its middle,
// four rose breathing dots on the pad and one gold twinkle in the free corner; it replaces the old pill-like strip
// with a heart that read as a capsule.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.path('M14 3.5 A2.83 2.83 0 0 1 18 3.5 L20.5 6 A2.83 2.83 0 0 1 20.5 10 L10 20.5 A2.83 2.83 0 0 1 6 20.5 L3.5 18 A2.83 2.83 0 0 1 3.5 14 Z')),
    k.cream(k.poly([[12.2, 6.7], [17.3, 11.8], [11.8, 17.3], [6.7, 12.2]], 0.8), { ow: 0.45 }),
    k.fill(k.union(k.disc(12, 9.5, 0.7), k.disc(14.5, 12, 0.7), k.disc(12, 14.5, 0.7), k.disc(9.5, 12, 0.7)), 'c2'),
    k.sparkle(5.2, 5.2, 1.8),
  ])
}
