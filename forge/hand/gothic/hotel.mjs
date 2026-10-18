// forge/hand/gothic/hotel.mjs — a limestone hotel tower on a stone ground line: a gilt sign band under the roof, a 3x2 grid
// of lit windows and a ruby glass arched door in a gilt frame (the door is the moving part); the old guest-in-bed
// interior was unreadable at 16-24px, this is the plain building silhouette the line version shows.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const wins = []
  for (const y of [7.8, 11.8]) for (const x of [6.8, 10.8, 14.8]) wins.push(g.rr(x, y, x + 2.4, y + 2.6, 0.4))
  const parts = [
    g.stone(g.rr(4.4, 2.6, 19.6, 20.8, [1.6, 1.6, 0, 0])),
    g.recess(g.union(...wins), { glow: 'c3' }),
    g.gilt(g.rr(6.6, 4, 17.4, 6.2, 0.7), { thin: true, plate: 'S' }),
    g.gilt(g.rr(9.8, 15.4, 14.2, 20.8, [2.2, 2.2, 0, 0]), { thin: true, glint: false, plate: 'A' }),
    g.glass(g.rr(10.6, 16.2, 13.4, 20.8, [1.4, 1.4, 0, 0]), 'c1', { outline: 0.2, glint: false, tracery: 'none', plate: 'A' }),
    g.stone(g.rr(2, 20.2, 22, 22.4, 0.9), { thin: true }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
