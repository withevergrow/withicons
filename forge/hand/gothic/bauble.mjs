// forge/hand/gothic/bauble.mjs — a round ruby glass Christmas bauble in a limestone frame: a gilded cap and hanging
// loop on top, two curved gilt bands across the belly each studded with three sapphire jewels, and a glint.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const ball = g.circle(12, 14, 7.7)
  const inner = g.shrink(ball, 1.4)
  const b1 = g.inter(g.stroke('M4 10.6 C9 13.2 15 13.2 20 10.6', 1.5), inner)
  const b2 = g.inter(g.stroke('M4.3 16.6 C9 19.2 15 19.2 19.7 16.6', 1.5), inner)
  const parts = [
    ...g.pane(ball, 'c1', { frame: 1.4, tracery: 'none', glass: { glow: 0.3 } }),
    g.gilt(b1, { plate: 'A', thin: true, outline: 0.3, glint: false }),
    g.gilt(b2, { plate: 'A', thin: true, outline: 0.3, glint: false }),
    ...[[8, 11.9], [12, 12.7], [16, 11.9]].map(([x, y]) => g.bead(x, y, 0.8, 'c2', { plate: 'A' })),
    ...[[8.2, 18], [12, 18.8], [15.8, 18]].map(([x, y]) => g.bead(x, y, 0.8, 'c2', { plate: 'A' })),
    g.gilt(g.rr(9.6, 4.4, 14.4, 7, 0.9), { plate: 'A', outline: 0.35 }),
    g.gilt(g.stroke('M10.8 4.6 C10.6 2 13.4 2 13.2 4.6', 0.9), { plate: 'A', thin: true, outline: 0.3, glint: false }),
    g.shine(g.stroke('M6.8 12.4 C7.2 11 8 10.2 9.2 9.6', 1.1), { plate: 'K', op: 0.8 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
