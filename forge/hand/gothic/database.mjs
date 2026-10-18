// forge/hand/gothic/database.mjs — the database as three stacked carved-stone drums, each set slightly into the one
// below so a lead seam curves like the cylinder's base, an emerald glass top in a stone rim; the generated drawing
// (one ashlar cylinder girdled by gilt hoops with arched niches) read as a barrel.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const RX = 7.8, RY = 2.8
const drum = (t, b) => g.union(g.ellipse(12, t, RX, RY), g.rect(12 - RX, t, 12 + RX, b), g.ellipse(12, b, RX, RY))

export default function render() {
  const parts = [
    g.stone(drum(14.2, 18.2)),
    g.stone(drum(10, 14), { plate: 'A' }),
    g.stone(drum(5.6, 9.8)),
    g.glass(g.ellipse(12, 5.6, 6.3, 1.75), 'c4', { outline: 0.4, glow: 0.26 }),
    ...[7.7, 11.9, 16.1].map((y, i) => [
      g.gilt(g.circle(16.3, y + 1.3, 1.05), { thin: true, glint: false, outline: 0.3, plate: i === 1 ? 'A' : 'K' }),
      g.glass(g.circle(16.3, y + 1.3, 0.55), 'c4', { outline: 0.18, glint: false, glow: 0.34, plate: i === 1 ? 'A' : 'K' }),
    ]),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
