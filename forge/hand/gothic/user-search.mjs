// forge/hand/gothic/user-search.mjs: the common person-search glyph: a gold glass head over broad rounded sapphire
// shoulders (a bust, not the pointed arch with an eye) at the upper left, and a large gilded magnifier at the lower
// right (emerald lens, thick gilt rim and handle) cut clear of the shoulders by a moat, at the line design's size.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const lens = g.circle(16.3, 15.9, 3.9)
  return paint([
    ...g.pane(g.circle(8.4, 7.4, 3.9), 'c3', { frame: 1.3, tracery: 'none' }),
    ...g.pane(g.path('M1.9 21.3 V19.4 A5 5 0 0 1 6.9 14.4 H10 A5 5 0 0 1 15 19.4 V21.3 Z'), 'c2', { frame: 1.3, tracery: [[[6.4, 14.1], [8.5, 17.2], [10.6, 14.1]]] }),
    g.cut(g.grow(g.union(lens, g.seg(19, 18.7, 22, 21.7, 2.6)), 1.0)),
    g.gilt(g.seg(19, 18.7, 21.9, 21.6, 2.3), { plate: 'S' }),
    g.gilt(lens, { plate: 'S', glint: false }),
    g.glass(g.shrink(lens, 1.1), 'c4', { plate: 'S', outline: 0.25, glow: 0.3, tracery: 'none' }),
  ])
}
