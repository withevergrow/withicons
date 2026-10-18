// forge/hand/gothic/motorcycle.mjs — a motorcycle side on: two large rose-window wheels joined by one gilt frame (fork,
// downtube, lower rail and a rear swingarm that carries the saddle), a dark finned iron engine set low between the
// wheels, a short stone saddle over the rear wheel and an emerald glass tank; replaces a drawing whose saddle floated
// and whose frame broke into separate pieces at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const parts = [
    ...g.rose(5.8, 17.2, 3.8, 'c2', { n: 6, frame: 1.2, medal: 'c3' }),
    ...g.rose(17.8, 17.2, 3.8, 'c2', { n: 6, frame: 1.2, medal: 'c3' }),
    // one gilt frame: fork + bar, downtube to the engine foot, lower rail to the rear hub, swingarm up to the saddle
    g.gilt(g.union(
      g.seg(17.8, 17.2, 15.6, 9, 1.7),
      g.seg(15.6, 9, 13.8, 7.8, 1.6),
      g.seg(15.4, 10, 12.4, 15.6, 1.6),
      g.seg(12.4, 15.6, 5.8, 17.2, 1.5),
      g.seg(5.8, 17.2, 7.6, 11.4, 1.7),
    )),
    // hub bosses where the frame meets the wheels
    g.studs([[5.8, 17.2], [17.8, 17.2]], 0.75),
    // the engine: a gilt-edged block of dark stone cut by three deep cooling fins, sitting on the downtube
    g.gilt(g.rr(9.4, 11.8, 13.6, 15.8, 0.7), { thin: true }),
    g.stone(g.rr(10, 12.4, 13, 15.2, 0.4), { role: 'edge', thin: true, outline: 0.25 }),
    g.recess(g.union(g.seg(10.6, 13.1, 12.4, 13.1, 0.4), g.seg(10.6, 14, 12.4, 14, 0.4), g.seg(10.6, 14.9, 12.4, 14.9, 0.4)), { outline: 0 }),
    g.stone(g.rr(4.2, 9.6, 10.6, 11.6, [1, 0.4, 0.4, 1])),
    g.glass(g.path('M9.8 12.2 V10.4 C9.8 8.6 14.4 8.2 16.2 9.6 L14 12.2 Z'), 'c4', { outline: 0.42, glow: 0.3, tracery: [[[12.4, 8], [12.4, 13]]] }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
