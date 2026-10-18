// forge/hand/gothic/eye-off.mjs — the eye-off after the new skeleton: the carved limestone eye of the eye icon with a
// dimmed sapphire rose iris, split clean into two halves by a long gilt slash in a wide moat (the gaps of the new
// skeleton); the generated drawing laid a short slash over the eye and the halves crowded the bar.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const EYE = 'M2.4 12 C4.4 7.3 8 4.8 12 4.8 C16 4.8 19.6 7.3 21.6 12 C19.6 16.7 16 19.2 12 19.2 C8 19.2 4.4 16.7 2.4 12 Z'

export default function render() {
  const bar = g.seg(3, 3, 21, 21, 1.9)
  const parts = [
    g.stone(g.path(EYE)),
    g.stone(g.ring(12, 12, 4.25, 0.9), { plate: 'A' }),
    g.glass(g.circle(12, 12, 3.85), 'c2', { plate: 'A', tracery: 'rose', n: 8, medal: 'c3', at: { c: [12, 12], r: 3.8 }, deep: 0.2 }),
    g.recess(g.circle(12, 12, 1.2), { plate: 'A', outline: 0.2 }),
    g.cut(g.grow(bar, 1.2)),
    g.gilt(bar, { plate: 'S', thin: true }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
