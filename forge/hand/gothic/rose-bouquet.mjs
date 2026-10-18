// forge/hand/gothic/rose-bouquet.mjs — the line bouquet in glass: three ruby swirl roses with leaded spirals, two
// emerald leaves, a gilt bow and a gold-glass paper cone; the old gilt blob lost the roses.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const spiral = (cx, cy, r) => [g.curlPts(cx, cy, r, 200, 1.5, 1)]
  const rosette = (cx, cy) => [
    ...g.pane(g.circle(cx, cy, 3.3), 'c1', { frame: 0.8, tracery: 'none', glass: { dark: 0.3, glow: 0.3 } }),
    g.lead(spiral(cx, cy, 1.55), { w: 0.4 }),
  ]
  const L = g.path('M5.2 12.9 C3.5 13.2 2.2 14.6 2 16.4 C3.8 17 5.8 16.2 7.2 14.6 Z')
  const R = g.path('M18.8 12.9 C20.5 13.2 21.8 14.6 22 16.4 C20.2 17 18.2 16.2 16.8 14.6 Z')
  const CONE = g.path('M8.6 15 L10.2 21.9 H13.8 L15.4 15 Z')
  const parts = [
    g.glass(L, 'c4', { tracery: 'none', outline: 0.42 }), g.lead([[[2.6, 16], [6, 14.2]]], { w: 0.3 }),
    g.glass(R, 'c4', { tracery: 'none', outline: 0.42 }), g.lead([[[21.4, 16], [18, 14.2]]], { w: 0.3 }),
    g.glass(CONE, 'c3', { tracery: [[[12, 15.8], [12, 21.6]]], glow: 0.25 }),
    ...rosette(12, 5.4), ...rosette(7.2, 10.6), ...rosette(16.8, 10.6),
    g.glass(g.circle(12, 13.2), 'c4', { outline: 0.3, tracery: 'none' }),
    g.gilt(g.union(g.poly([[12, 15.8], [8.4, 13.6], [8, 17.6]]), g.poly([[12, 15.8], [15.6, 13.6], [16, 17.6]]), g.circle(12, 15.8, 1.1)), { thin: true, outline: 0.36, plate: 'A' }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
