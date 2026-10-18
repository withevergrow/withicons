// forge/hand/gothic/files.mjs — two stacked leaves as in the line set: the sapphire leaf with its gilded dog-ear in front,
// a second ruby leaf offset to the upper left behind it; the generated drawing was a stone-tile frame with a diamond
// lattice that read as a wall tile, not a pair of pages.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const FRONT = 'M9.5 6.5 H15.5 L20.5 11.5 V19.5 A2 2 0 0 1 18.5 21.5 H9.5 A2 2 0 0 1 7.5 19.5 V8.5 A2 2 0 0 1 9.5 6.5 Z'

export default function render(icon) {
  const parts = [
    ...g.pane(g.rr(3.2, 2.5, 15.6, 17.5, 2), 'c1', { frame: 1.4, tracery: 'none', glass: { dark: 0.4 } }),
    ...g.pane(g.path(FRONT), 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.poly([[15.5, 7.1], [15.5, 11.4], [19.9, 11.4]]), { plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
