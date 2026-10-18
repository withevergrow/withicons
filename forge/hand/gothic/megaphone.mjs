// forge/hand/gothic/megaphone.mjs — the new megaphone skeleton in Gothic: one wide ruby glass horn in a stone frame
// opening to the right, a carved stone back cap, a gilt band (A) where cap meets horn and a gilt grip below; the
// generated drawing was the old tilted herald's horn that lost its mouth at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const horn = g.path('M7.6 9 L17.4 4.2 Q20.2 2.9 20.2 5.6 V18.4 Q20.2 21.1 17.4 19.8 L7.6 15 Z')
  const parts = [
    g.gilt(g.rr(5.9, 14, 9.6, 20.2, 1.6)),
    ...g.pane(horn, 'c1', { frame: 1.3, tracery: 'lancet', glass: { s: 2.6 } }),
    g.stone(g.rr(2.8, 8.9, 8.4, 15.1, [2, 0, 0, 2]), { ticks: [[[5.6, 8.9], [5.6, 15.1]]] }),
    g.gilt(g.rr(7.3, 8.1, 9.3, 15.9, 0.6), { plate: 'A', thin: true }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
