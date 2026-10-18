// forge/hand/gothic/ship.mjs — the steamship every other style draws: a sapphire glass hull under a stone deck
// rail with three gilt-bezelled gold portholes, a carved stone deckhouse lit by three glowing lancet windows, a ruby
// funnel with a gilt cap, gilt waves below; the generated drawing was a sailboat, so the meaning drifted.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const lancets = [9, 12, 15].map(x => g.lancet(x - 0.7, 9.2, x + 0.7, 11.6, 1))
  const ports = [[7.4, 14.6], [12, 14.6], [16.6, 14.6]]
  const parts = [
    g.glass(g.rr(10.2, 3.4, 13.8, 8.6, 0), 'c1', { plate: 'A', outline: 0.42, tracery: [[[9, 5.6], [15, 5.6]]], glint: false }),
    g.gilt(g.rr(9.6, 2.4, 14.4, 3.8, 0.6), { plate: 'A', thin: true, glint: false }),
    g.stone(g.rr(6.4, 7.8, 17.6, 12.6, [1.4, 1.4, 0, 0])),
    g.recess(g.union(...lancets), { glow: 'c3' }),
    g.glass(g.path('M3.2 12.4 H20.8 L18.6 17.2 H5.4 Z'), 'c2', { outline: 0.42, glow: 0.22 }),
    g.stone(g.rr(2.2, 11.8, 21.8, 13.4, 0.7), { thin: true }),
    g.gilt(g.union(...ports.map(([x, y]) => g.circle(x, y, 1.15))), { thin: true, glint: false, outline: 0.32 }),
    g.glass(g.union(...ports.map(([x, y]) => g.circle(x, y, 0.6))), 'c3', { outline: 0.18, glow: 0.34, glint: false }),
    g.deco(g.gilt(g.stroke('M2.6 20.4 C4 19.2 5.6 19.2 7 20.4 C8.4 21.6 10 21.6 11.4 20.4 C12.8 19.2 14.4 19.2 15.8 20.4 C17.2 21.6 18.8 21.6 20.4 20.4', 1.4), { thin: true, outline: 0.32, glint: false })),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
