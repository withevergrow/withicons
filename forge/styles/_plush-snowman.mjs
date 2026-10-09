// PLUSH snowman, hand-sewn: two stuffed cream felt balls, a tomato knit beanie with a sunflower
// cuff and a fluffy pompom, French-knot eyes and an embroidered smile, a sunflower felt carrot,
// a sky felt scarf with its tail (A), embroidered twig arms (A), two sewn-on buttons, a felt
// snow mound underneath.
export const R = {
  snowman: (icon, P) => [
    P.felt('edge', P.pill(4.5, 19.6, 19.5, 22.4), { part: 'K', stitch: false, out: 0.35 }),
    P.thread('M7.4 14.6 L3.6 11.6 M4.8 12.6 L4.6 10.2 M4.4 12.2 L2.4 12.3', { w: 1, part: 'A' }),
    P.thread('M16.6 14.6 L20.4 11.6 M19.2 12.6 L19.4 10.2 M19.6 12.2 L21.6 12.3', { w: 1, part: 'A' }),
    P.felt('tint', P.circle(12, 16, 5.4), { part: 'K' }),
    P.felt('tint', P.circle(12, 8.8, 4), { part: 'K' }),
    P.felt('c1', P.round(P.unite(P.half(12, 6.4, 4, 'n'), P.rect(8, 5.4, 16, 6.4)), 0.6), { part: 'K', stitch: false }),
    P.felt('c2', P.pill(7.6, 5.2, 16.4, 7.2), { part: 'K', stitch: false, out: 0.4 }),
    P.felt('c2', P.circle(12, 2.1, 1.35), { part: 'K', stitch: false, out: 0.4 }),
    P.knot(10.5, 9, 0.7, 'ink'), P.knot(13.5, 9, 0.7, 'ink'),
    P.felt('c2', P.poly([[11.7, 9.9], [15.2, 10.8], [11.7, 11.4]], 0.35), { part: 'K', stitch: false, out: 0.3, shade: false, hi: false }),
    P.felt('c3', P.unite(P.pill(7.4, 11.7, 16.6, 13.7), P.rr(13.4, 12.6, 15.6, 17.4, 1)), { part: 'A', stitchMin: 1.2 }),
    ...P.button(10.4, 15.6, 0.95, 'c1', { part: 'K', n: 2 }),
    ...P.button(10.4, 18.4, 0.95, 'c1', { part: 'K', n: 2 }),
  ],
}
