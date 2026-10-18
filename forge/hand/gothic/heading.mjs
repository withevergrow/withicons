// forge/hand/gothic/heading.mjs — a bare capital H in gilded metal, each stroke inlaid with a thread of
// sapphire enamel, the crossbar (A) mortised between the stems; the generated drawing built it from two
// pinnacled stone piers on plinths with a jewelled bar and read as a gate, not a letter.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const stems = g.union(g.rr(4.4, 3.4, 7.8, 20.6, 0.6), g.rr(16.2, 3.4, 19.6, 20.6, 0.6))
  const parts = [
    g.gilt(g.rect(7.4, 10.7, 16.6, 13.3), { plate: 'A' }),
    g.glass(g.rect(7.4, 11.45, 16.6, 12.55), 'c2', { outline: 0.2, glint: false, glow: 0.32, plate: 'A' }),
    g.gilt(stems),
    g.glass(g.union(g.rr(5.55, 4.6, 6.65, 19.4, 0.55), g.rr(17.35, 4.6, 18.45, 19.4, 0.55)), 'c2', { outline: 0.2, glint: false, glow: 0.32 }),
  ]
  return paint(enamel(parts, icon))
}
