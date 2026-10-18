// forge/hand/gothic/mandarin-orange.mjs — a plain round mandarin: a gold glass fruit in a limestone rind frame with a
// curved stem, an emerald leaf, a glint arc on the left and three rind dots; the generated drawing read as a dial.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const fruit = g.ellipse(12, 14.6, 9, 7.6)
  const leaf = g.path('M12.2 6.6 C13.2 3.8 16.8 2.6 20.4 3.4 C19.6 6.6 16 8 12.2 6.6 Z')
  const parts = [
    g.stone(g.stroke('M12 8 C12 6.8 11.6 6 11.8 5', 1.3), { plate: 'A', thin: true }),
    ...g.pane(leaf, 'c4', { frame: 0.9, tracery: 'none', plate: 'A', glass: { glint: false } }),
    ...g.pane(fruit, 'c3', { frame: 1.4, tracery: 'none', glass: { glow: 0.3 } }),
    g.stone(g.stroke('M12.4 7.8 C12.5 7 12 6.4 11.9 5', 1.3), { plate: 'A', thin: true }),
    ...[[13.6, 13.6], [16.6, 16.2], [12.6, 18]].map(([x, y]) => g.stone(g.circle(x, y, 0.65), { plate: 'deco', thin: true })),
    g.shine(g.stroke('M6.6 16.6 C6.2 14.6 7 12.8 8.6 11.8', 1.2), { plate: 'K', op: 0.85 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
