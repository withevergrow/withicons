// forge/hand/gothic/user-plus.mjs — the user bust of the people family (gold glass head, broad sapphire shoulders with
// a leaded neckline) shifted left, and an emerald roundel with a heavy stone plus in the free top-right corner;
// the generated drawing had a gold-orb head over an arched window and a thin plus that vanished at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const parts = [
    ...g.pane(g.circle(9.2, 7.6, 4.2), 'c3', { frame: 1.3, tracery: 'none' }),
    ...g.pane(g.path('M2.4 21.4 V19.4 A5.6 5.6 0 0 1 8 13.8 H12.4 A5.6 5.6 0 0 1 18 19.4 V21.4 Z'), 'c2', { frame: 1.4, tracery: [[[7.6, 13.4], [10.2, 17.2], [12.8, 13.4]], [[10.2, 17.2], [10.2, 22]]] }),
    g.badge('plus', 18.2, 7, 3.7, 'c4', { plate: 'S' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
