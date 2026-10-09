// GOTHIC snowman, hand-composed: the body is a rose window (stone ring, frosted sapphire glass
// round a gold medallion), the head a carved limestone boss with recessed coal eyes and a gold
// glass carrot, a wrought-iron top hat with a ruby glass band, a ruby scarf of leaded glass whose
// end hangs down (A), iron twig arms (A) and a gilt finial star of frost.
export const R = {
  snowman: (icon, g) => [
    g.iron(g.union(g.stroke('M7.4 14.4 L3.6 11.6 M4.8 12.5 V10 M4.4 12.2 L2.4 12.4', 1.1), g.stroke('M16.6 14.4 L20.4 11.6 M19.2 12.5 V10 M19.6 12.2 L21.6 12.4', 1.1)), { plate: 'A' }),
    ...g.rose(12, 16.6, 5.4, 'c2', { n: 8, frame: 1.25, medal: 'c3' }),
    g.stone(g.circle(12, 8.8, 3.7)),
    g.recess(g.union(g.circle(10.6, 8.2, 0.6), g.circle(13.4, 8.2, 0.6)), { outline: 0 }),
    g.glass(g.poly([[11.7, 9.3], [15.4, 10.3], [11.7, 10.9]]), 'c3', { outline: 0.25, glint: false, glow: 0.4 }),
    g.iron(g.union(g.rr(9.1, 1.4, 14.9, 5.6, 0.6), g.rr(7.4, 5, 16.6, 6.3, 0.6))),
    g.glass(g.rect(9.1, 3.9, 14.9, 4.9), 'c1', { outline: 0.15, glint: false }),
    ...g.plate('A', g.glass(g.union(g.rr(7.6, 11.5, 16.4, 13.4, 0.95), g.rr(13.4, 12.4, 15.4, 16.8, 0.6)), 'c1', { tracery: [[[10.4, 11], [10.4, 14]], [[13.4, 11], [13.4, 14]], [[13.2, 14.6], [15.6, 14.6]]], outline: 0.35 })),
    g.deco(g.gilt(g.star(20.6, 3.6, 1.7, 0.6, 4), { thin: true, outline: 0.25, glint: false })),
  ],
}
