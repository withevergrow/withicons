// COQUETTE dragon head, hand-composed (front view): delicate gold branching antlers (A), a
// ribbon-red satin head whose wide brow narrows into a long snout, a pearl on the forehead,
// cream fur tufts at the cheeks, gold slanted brows (A) over wine dot eyes, a wide bulbous
// blush nose with two nostrils, gold wire whiskers sweeping out level and curling (A), a cream
// lip band over a wine mouth with cream fangs (S), a cream spiked beard, a tiny bow on one
// antler and a sparkle.
const HEAD = 'M12 5.4 C16 5.4 18.4 7.6 18.4 10.4 C18.4 12.2 17.2 13 15.6 13.4 V19.4 C15.6 20.6 14.2 21.2 12 21.2 C9.8 21.2 8.4 20.6 8.4 19.4 V13.4 C6.8 13 5.6 12.2 5.6 10.4 C5.6 7.6 8 5.4 12 5.4 Z'
export const R = {
  'dragon-head': (icon, k) => [
    k.wire('M9.6 7 L7.6 3.7 L6.2 1.6 M7.9 4.2 L9.9 2.3 M6.9 2.7 L4.3 3', 1.35),
    k.wire('M14.4 7 L16.4 3.7 L17.8 1.6 M16.1 4.2 L14.1 2.3 M17.1 2.7 L19.7 3', 1.35),
    k.cream(k.union(k.disc(5.4, 8.2, 1.6), k.disc(4.8, 10.6, 1.4), k.disc(18.6, 8.2, 1.6), k.disc(19.2, 10.6, 1.4))),
    k.body(k.path(HEAD), { mat: 'ribbon' }),
    k.wire('M8.8 15.4 C6.6 15 4.8 14.4 3.2 15.2 C2 15.8 2.4 17.5 3.7 17.1', 1),
    k.wire('M15.2 15.4 C17.4 15 19.2 14.4 20.8 15.2 C22 15.8 21.6 17.5 20.3 17.1', 1),
    k.cream(k.poly([[8.6, 20.4], [15.4, 20.4], [14.6, 23], [13.4, 21.6], [12, 23.2], [10.6, 21.6], [9.4, 23]], 0.3)),
    k.pearl(12, 7.6, 1, { plate: 'S' }),
    k.gold(k.union(k.poly([[6.4, 8.3], [10.9, 10], [10.6, 11], [6.7, 9.9]], 0.4), k.poly([[17.6, 8.3], [13.1, 10], [13.4, 11], [17.3, 9.9]], 0.4))),
    k.ink(k.union(k.disc(9.5, 11.9, 0.95), k.disc(14.5, 11.9, 0.95), k.rr(9.3, 17.4, 14.7, 20.2, 1))),
    k.fill(k.union(k.poly([[9.6, 20.2], [10.8, 20.2], [10.2, 18.5]], 0.15), k.poly([[13.2, 20.2], [14.4, 20.2], [13.8, 18.5]], 0.15)), 'c4', { plate: 'S' }),
    k.cream(k.pill(8.6, 16.6, 15.4, 17.9)),
    k.blush(k.union(k.disc(10.3, 15.1, 1.75), k.disc(13.7, 15.1, 1.75), k.ellipse(12, 14.9, 2.2, 1.6))),
    k.ink(k.union(k.ellipse(10.5, 15.5, 0.6, 0.5), k.ellipse(13.5, 15.5, 0.6, 0.5))),
    k.bow(6.4, 4.4, 0.42, -15, { plate: 'A' }),
    k.sparkle(20.8, 6.2, 1.3),
  ],
}
