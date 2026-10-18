// forge/hand/gothic/user-circle.mjs — the default avatar as a clean sapphire roundel in a plain stone ring: a gold glass
// head over gold glass shoulders cut off by the ring, one silhouette like the line icon; the generated drawing set a
// ruby lancet bust under the head that read as a face (eyes and mouth) rather than a person.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const C = g.circle(12, 12, 9.6), inner = g.shrink(C, 1.5)
  const bust = g.path('M4.2 19.4 C5.6 16.4 7.4 15 10 15 H14 C16.6 15 18.4 16.4 19.8 19.4 V24 H4.6 Z')
  const parts = [
    ...g.pane(C, 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.45 } }),
    g.glass(g.inter(bust, inner), 'c3', { outline: 0.42, tracery: [[[10.2, 14.8], [12, 17.6], [13.8, 14.8]], [[12, 17.6], [12, 22]]], glow: 0.24 }),
    ...g.pane(g.circle(12, 8.7, 3.5), 'c3', { frame: 1.1, tracery: 'none' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
