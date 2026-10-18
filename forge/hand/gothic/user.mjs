// forge/hand/gothic/user.mjs — the person glyph with its silhouette leading: a gold glass head over broad rounded
// sapphire shoulders (a bust, not the pointed lancet robe that read as an arch), a leaded pointed neckline,
// and no halo so nothing crowds the head at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const parts = [
    ...g.pane(g.circle(12, 7.2, 4.2), 'c3', { frame: 1.3, tracery: 'none' }),
    ...g.pane(g.path('M4.2 21.4 V19.2 A5.6 5.6 0 0 1 9.8 13.6 H14.2 A5.6 5.6 0 0 1 19.8 19.2 V21.4 Z'), 'c2', { frame: 1.4, tracery: [[[9.4, 13.2], [12, 17], [14.6, 13.2]], [[12, 17], [12, 22]]] }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
