// forge/hand/gothic/hexagon.mjs — a honeycomb cell after the new skeleton: a pointy-top limestone hexagon glazed in
// sapphire, leaded corner to corner onto an inset gilt cell of gold glass; the generated drawing still showed the old
// bare hexagon with a rose window and no inset cell.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
const V = r => [-90, -30, 30, 90, 150, 210].map(a => [f1(12 + r * Math.cos(a * Math.PI / 180)), f1(12 + r * Math.sin(a * Math.PI / 180))])
const OUT = 'M12.98 3.05 L19.48 6.68 A2 2 0 0 1 20.5 8.42 L20.5 15.58 A2 2 0 0 1 19.48 17.32 L12.98 20.95 A2 2 0 0 1 11.02 20.95 L4.52 17.32 A2 2 0 0 1 3.5 15.58 L3.5 8.42 A2 2 0 0 1 4.52 6.68 L11.02 3.05 A2 2 0 0 1 12.98 3.05 Z'
const IN = 'M12.49 6.77 L16.49 8.98 A1 1 0 0 1 17 9.86 L17 14.14 A1 1 0 0 1 16.49 15.02 L12.49 17.23 A1 1 0 0 1 11.51 17.23 L7.51 15.02 A1 1 0 0 1 7 14.14 L7 9.86 A1 1 0 0 1 7.51 8.98 L11.51 6.77 A1 1 0 0 1 12.49 6.77 Z'

export default function render() {
  const a = V(5), b = V(9.5)
  const inner = g.path(IN)
  const parts = [
    ...g.pane(g.path(OUT), 'c2', { frame: 1.6, tracery: a.map((p, i) => [p, b[i]]) }),
    g.gilt(g.rim(inner, 1.1), { plate: 'A' }),
    g.glass(g.shrink(inner, 1.1), 'c3', { plate: 'A', outline: 0.3, tracery: 'none', glow: 0.32 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
