// forge/hand/gothic/book.mjs — a missal whose outline leads: a plain ruby cover (no quarry mesh) with one gold
// quatrefoil, a gilded spine band down the left and a stone page block with ruled page edges at the foot.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const cover = g.path('M4.5 18.6 V5 A2.5 2.5 0 0 1 7 2.5 H18 A1.5 1.5 0 0 1 19.5 4 V16.6 H7 A2.5 2.5 0 0 0 4.5 18.6 Z')
  const parts = [
    ...g.pane(cover, 'c1', { frame: 1.4, tracery: 'none', glass: { dark: 0.38 } }),
    g.gilt(g.rr(5.9, 3.9, 7.7, 15.4, 0.6), { thin: true, outline: 0.32, glint: false }),
    g.glass(g.foil(13.1, 9.4, 2.4, 4), 'c3', { outline: 0.34 }),
    g.stone(g.path('M19.5 16.4 V20 A1.5 1.5 0 0 1 18 21.5 H7 A2.5 2.5 0 0 1 4.5 19 A2.5 2.5 0 0 1 7 16.4 Z'), { thin: true, plate: 'A' }),
    g.lead([[[7.6, 18.3], [18, 18.3]], [[7.6, 19.6], [18, 19.6]]], { role: 'edge', w: 0.32, plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
