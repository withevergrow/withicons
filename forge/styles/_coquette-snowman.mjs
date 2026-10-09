// COQUETTE snowman, hand-composed: two cream satin snowballs, a blush beret tipped to one side
// with a ribbon-red bow, a ribbon-red scarf whose tail hangs down with a tiny heart (A),
// wine ink twig arms and dot eyes, a gold carrot, pearl buttons and a sparkle.
export const R = {
  snowman: (icon, k) => [
    k.ink('M7.4 14.6 L3.8 11.8 M5 12.7 L4.9 10.5 M4.6 12.4 L2.7 12.5', 1, { plate: 'A' }),
    k.ink('M16.6 14.6 L20.2 11.8 M19 12.7 L19.1 10.5 M19.4 12.4 L21.3 12.5', 1, { plate: 'A' }),
    k.cream(k.disc(12, 16.5, 5.3)),
    k.cream(k.disc(12, 8.7, 3.9)),
    k.body(k.ellipse(11.6, 4.9, 4.6, 1.9, -8)),
    k.ink('M10.5 8.4 V9.2 M13.5 8.4 V9.2', 1.25),
    k.gold(k.poly([[11.6, 9.7], [15.6, 10.8], [11.6, 11.5]], 0.35), { plate: 'K' }),
    k.satin(k.union(k.pill(7.6, 11.6, 16.4, 13.5), k.rr(13.3, 12.6, 15.3, 17, 0.9)), { plate: 'A' }),
    k.heart(14.3, 18.3, 2.4, 0, { plate: 'A' }),
    k.pearl(10.6, 15.6, 0.75, { plate: 'K' }), k.pearl(10.6, 18.4, 0.75, { plate: 'K' }),
    k.bow(15.4, 3.6, 0.55, 15),
    k.sparkle(20.6, 3.8, 1.4),
  ],
}
