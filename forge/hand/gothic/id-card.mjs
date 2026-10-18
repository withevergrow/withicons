// forge/hand/gothic/id-card.mjs — the common identity card: a carved stone card with a head-and-shoulders portrait (gold
// head, sapphire shoulders in a leaded sill) on the left and two gilded text pills on the right; the generated
// rocket-like arched emblem read as a spaceship, not a portrait.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const card = g.rr(2, 4, 22, 20, 2.2)
  const bust = g.inter(g.circle(8.5, 21.4, 5.6), g.rect(0, 0, 24, 18.4))
  const parts = [
    g.stone(card),
    g.glass(g.circle(8.5, 10.2, 2.3), 'c3', { outline: 0.25, glint: false, glow: 0.3 }),
    g.glass(bust, 'c2', { outline: 0.25, glint: false }),
    g.gilt(g.seg(14.4, 9.6, 18.8, 9.6, 1.7), { thin: true, glint: false }),
    g.gilt(g.seg(14.4, 14, 17.2, 14, 1.7), { thin: true, glint: false }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
