// forge/hand/gothic/newspaper.mjs — a limestone broadsheet with its folded-out back leaf, a full-width ruby masthead in a
// gilt rim, a sapphire picture pane in a thin gilt rim at the head of the left column with a line of type under it, and
// a right column of thin ink type lines; earlier drawings set the type as a 2x4 grid of heavy bars that read as a keypad.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'


export default function render(icon) {
  const L = []
  for (const y of [11.6, 13.9, 16.2, 18.5]) L.push([[15.1, y], [18.6, y]])
  L.push([[10.2, 18.5], [13.4, 18.5]])
  const parts = [
    g.stone(g.path('M7 9 H4.5 A1.5 1.5 0 0 0 3 10.5 V18.5 A1.6 1.6 0 0 0 4.6 20.1 H7.2 Z'), { thin: true }),
    g.stone(g.path('M4.5 20.1 H19 A2.1 2.1 0 0 0 21.1 18 V6 A2.1 2.1 0 0 0 19 3.9 H9 A2.1 2.1 0 0 0 6.9 6 V17.5 A2.6 2.6 0 0 1 4.5 20.1 Z')),
    g.gilt(g.rr(9.1, 5.3, 19.5, 9.7, 0.7), { plate: 'A' }),
    g.glass(g.rr(9.6, 5.8, 19, 9.2, 0.4), 'c1', { outline: 0.25, glint: false, glow: 0.3, plate: 'A' }),
    g.gilt(g.rr(9.8, 10.8, 13.8, 16.2, 0.5), { thin: true, plate: 'A' }),
    g.glass(g.rr(10.2, 11.2, 13.4, 15.8, 0.3), 'c2', { outline: 0.25, glow: 0.3, plate: 'A' }),
    g.lead(L, { role: 'ink', w: 0.65, plate: 'A' }),
  ]
  return paint(enamel(parts, icon))
}
