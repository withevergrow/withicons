// forge/hand/gothic/cauldron.mjs — the line cauldron in black iron: a gilt rim plate, a wide potbelly with gilt rivets
// and a gilded band with a ruby jewel as trim, two short feet and two green bubbles over it; the old drawing was a stone
// medallion with a cross.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const BODY = g.path('M7.5 12 C2 13.5 2 18.25 6.5 19.75 C8 20.25 10 20.5 12 20.5 C14 20.5 16 20.25 17.5 19.75 C22 18.25 22 13.5 16.5 12 Z')
  const FEET = g.path('M6.6 19.2 L5.5 22.2 H9.2 L9.8 20.2 Z M17.4 19.2 L18.5 22.2 H14.8 L14.2 20.2 Z')
  const BAND = g.stroke('M3.9 16.1 C6 17.7 9 18.2 12 18.2 C15 18.2 18 17.7 20.1 16.1', 1.1)
  const parts = [
    g.iron(FEET, { outline: 0.4 }),
    g.iron(BODY, { outline: 0.42 }),
    g.shine(g.path('M4.4 14.6 C5 13.8 6 13.2 7.2 12.9 C6 13.8 5.3 14.8 5.1 15.9 Z'), { op: 0.55 }),
    g.gilt(BAND, { thin: true, outline: 0.32, glint: false }),
    ...g.bead(12, 16.1, 1.35, 'c1'),
    g.studs([[6.4, 15.2], [17.6, 15.2], [9.2, 17.7], [14.8, 17.7]], 0.5),
    g.gilt(g.rr(6.6, 9, 17.4, 12.1, 1.5), { plate: 'A', outline: 0.4 }),
    ...g.bead(10.5, 4.4, 1.0, 'c4', { plate: 'S' }),
    ...g.bead(15, 3.5, 1.7, 'c4', { plate: 'S' }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
