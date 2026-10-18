// forge/hand/gothic/salad.mjs: a wide emerald-glazed bowl on a stone foot, with a carrot, a half egg and a
// lettuce leaf poking out above the gilded rim.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { cut as sub } from '../../styles/_gothic-prim.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'
const out = (parts, icon) => paint(enamel(parts.flat(Infinity).filter(Boolean), icon))

export default function render(icon) {
  const bowl = g.path('M3 12.7 H21 C21 16.75 18 19 14.5 19 H9.5 C6 19 3 16.75 3 12.7 Z')
  return out([
    g.stone(g.rr(9.2, 18.4, 14.8, 21, 0.6)),
    g.glass(g.path('M16.1 12 C15.1 9 15.6 6 17.3 5 C17.8 3.7 19.6 3.7 20.1 5 C21.4 5.6 21.5 7.3 20.8 8 C21.4 9.2 20.8 10.9 19.8 12 Z'), 'c4', { plate: 'A', tracery: [[[17.2, 12], [19.2, 6.5]], [[18, 9.4], [19.8, 9.4]]] }),
    g.stone(g.path('M8.9 12 C8.6 7.5 10 4 11.75 4 C13.5 4 14.9 7.5 14.6 12 Z')),
    g.gilt(g.circle(11.75, 9.3, 1.4), { thin: true, glint: false }),
    g.gilt(g.stroke('M4.7 6.5 L3.6 3.8 M5.8 6.1 L5.6 3 M6.8 6.2 L8 3.8', 0.6), { thin: true, glint: false }),
    g.glass(g.path('M3.8 7 L6.6 12 L7.6 6.6 C6.5 5.9 4.7 6.1 3.8 7 Z'), 'c1', { tracery: 'none' }),
    g.pane(bowl, 'c4', { frame: 1.1, tracery: 'quarry' }),
    g.gilt(g.rr(2.4, 11.9, 21.6, 13.3, 0.6), { thin: true }),
  ], icon)
}
