// forge/hand/gothic/folder-plus.mjs — the plain folder family (smooth stone back with its tab, gold glass front) with
// a bold carved-stone plus centred on the front; the generated drawing laid ashlar bricks and a lancet grid over the
// folder and pushed a circled badge into the corner, which buried the plus.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const plus = g.union(g.rr(10.5, 10.9, 13.5, 18.1, 0.6), g.rr(8.4, 13, 15.6, 16, 0.6))
  const parts = [
    g.stone(g.path('M4.5 3.8 H9.6 L11.6 6 H19.5 A2 2 0 0 1 21.5 8 V19.2 A2 2 0 0 1 19.5 21.2 H4.5 A2 2 0 0 1 2.5 19.2 V5.8 A2 2 0 0 1 4.5 3.8 Z')),
    ...g.pane(g.rr(2.5, 8.2, 21.5, 21.2, [1.2, 1.2, 2, 2]), 'c3', { frame: 1.4, tracery: 'none', glass: { dark: 0.3 } }),
    g.stone(plus, { plate: 'A', outline: 0.4 }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
