// COQUETTE exemplars: the art director's reference icons, one per family. Every redraw
// is measured against these (forge/styles/COQUETTE-GUIDE.md section 7). An entry here
// wins over the same name in _coquette-redraw-*.mjs.
//
// Signature: (icon, k) => parts, painted back to front. k is the frozen kit
// (_coquette-kit.mjs) plus k.auto(icon, opts).

// rotate points about (cx, cy)
import { parsePath } from '../kernel/geom.mjs'

const rot = (pts, deg, cx = 12, cy = 12) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c])
}

export const EXEMPLAR = {
  // blush walls, a rose roof slab with a scalloped lace eave, a ribbon-red arched door
  // with a pearl knob
  home: (icon, k) => [
    k.body(k.rr(5.5, 9.5, 18.5, 21, [0, 0, 2.2, 2.2])),
    k.lace('M4.6 12.4 L12 6.5 L19.4 12.4', 0.8),
    k.rose(k.tube('M3.2 11.4 L12 4 L20.8 11.4', 2.8), { plate: 'K' }),
    k.satin(k.arch(9.6, 14.2, 14.4, 21), { plate: 'A' }),
    k.pearl(13.1, 17.9, 0.65, { plate: 'A' }),
  ],
  // a plump blush satin heart with the bow tied in its cleft and one gold twinkle
  heart: (icon, k) => [
    k.body(k.heartShape(12, 13.4, 18.6)),
    k.bow(12, 6.7, 0.82, 0),
    k.sparkle(19.6, 3.9, 1.7),
  ],
  // the bell hangs from its own bow; gold clapper
  bell: (icon, k) => [
    k.gold(k.disc(12, 19.6, 1.9), { plate: 'A' }),
    k.body(k.path('M4.5 17.6 C5.6 16.4 6.2 15.2 6.2 13 V11.2 A5.8 5.8 0 0 1 17.8 11.2 V13 C17.8 15.2 18.4 16.4 19.5 17.6 Z')),
    k.rose(k.pill(3.6, 16.2, 20.4, 18.8), { plate: 'K' }),
    // the bow is the bell's hanger: structural, so it swings with the bell (plate K)
    k.bow(12, 4.4, 0.8, 0, { plate: 'K' }),
  ],
  // a cream envelope, a blush flap edged in lace, sealed with a ribbon-red heart
  mail: (icon, k) => [
    k.cream(k.rr(2.5, 5.5, 21.5, 19.5, 2.4)),
    k.ink('M4 18 L9.6 12.8 M20 18 L14.4 12.8', 0.8),
    k.lace('M3.9 7 L12 13.4 L20.1 7', 0.72),
    k.body(k.poly([[2.9, 6.1], [21.1, 6.1], [12, 13]], 1.3)),
    k.heart(12, 12.6, 5.4, 0, { plate: 'S' }),
  ],
  // a gold-rimmed lens of pale glass, a rose handle tied with a bow at its neck
  search: (icon, k) => [
    k.rose(k.seg(15.2, 15.2, 20, 20, 3.1), { plate: 'A' }),
    k.gold(k.ring(10.2, 10.2, 6.3, 2.3), { plate: 'K' }),
    k.body(k.disc(10.2, 10.2, 5.25), { plate: 'K', ow: 0 }),
    k.bow(15.4, 15.4, 0.56, -45),
  ],
  // a blush gear around a cream hub that holds a ribbon-red heart
  settings: (icon, k) => {
    const teeth = []
    for (let i = 0; i < 8; i++) teeth.push(k.poly(rot([[10.3, 2.4], [13.7, 2.4], [14.4, 6.5], [9.6, 6.5]], i * 45), 0.9))
    return [
      k.body(k.union(k.disc(12, 12, 7.4), teeth)),
      k.cream(k.disc(12, 12, 4), { ow: 0.6 }),
      k.heart(12, 12.1, 4.6, 0, { plate: 'K' }),
    ]
  },
  // head and shoulders with a hair bow and a pearl necklace
  user: (icon, k) => [
    k.body(k.path('M4.2 21 C4.2 16.4 7.8 13.6 12 13.6 C16.2 13.6 19.8 16.4 19.8 21 Z')),
    k.pearls('M8.2 15.2 Q12 18.9 15.8 15.2', 0.78),
    k.body(k.disc(12, 8.4, 4.4)),
    k.bow(15.7, 4.7, 0.62, 22),
  ],
  // a soft blush star with a pearl at its heart and a gold twinkle
  star: (icon, k) => [
    k.body(k.star(12, 12.9, 10.6, 5, 1.1)),
    k.sparkle(19.4, 4.2, 1.6),
    k.pearl(12, 13.4, 0.9, { plate: 'deco' }),
  ],
  // a cream page with a blush header, gold binder rings and a heart on the day
  calendar: (icon, k) => {
    const page = k.rr(3, 5, 21, 21, 2.6)
    return [
      k.cream(page),
      k.body(k.inter(page, k.rect(2, 4, 22, 9.6))),
      k.fill(k.union(k.disc(7.6, 13.4, 0.95), k.disc(12, 13.4, 0.95), k.disc(7.6, 17.4, 0.95), k.disc(12, 17.4, 0.95), k.disc(16.4, 13.4, 0.95)), 'c2'),
      k.heart(16.4, 17.5, 4.4, 0, { plate: 'S' }),
      k.gold(k.union(k.pill(7, 2.6, 9.2, 7.2), k.pill(14.8, 2.6, 17, 7.2)), { plate: 'A' }),
    ]
  },
  // a blush camera wrapped in a lace band, gold-rimmed rose lens, pearl flash
  camera: (icon, k) => [
    k.rose(k.pill(7.4, 4.4, 13.6, 9.4), { plate: 'K' }),
    k.body(k.rr(2.4, 7, 21.6, 20, 2.8)),
    k.lace('M3.4 13.4 H20.6', 0.78, { eyelets: false }),
    k.gold(k.disc(12, 13.4, 4.7), { plate: 'A' }),
    k.rose(k.disc(12, 13.4, 3.1), { plate: 'A' }),
    k.pearl(18.4, 9.6, 0.85, { plate: 'K' }),
  ],
  // a blush cloud with a bow on its crown
  cloud: (icon, k) => [
    k.body(k.union(k.disc(8.2, 14.2, 4), k.disc(13, 11.6, 5.3), k.disc(17.4, 14.6, 3.6), k.pill(3.6, 13.6, 21, 19.6))),
    k.bow(15.2, 7.6, 0.66, 14),
  ],
  // a cream page, a blush dog-ear, rose text lines, a bow on its corner
  file: (icon, k) => [
    k.cream(k.poly([[5, 3], [13.6, 3], [19, 8.4], [19, 21], [5, 21]], 2)),
    k.body(k.poly([[13.4, 3.4], [13.4, 8.6], [18.6, 8.6]], 0.7), { plate: 'A' }),
    k.fill(k.tube('M8.5 12.5 H15.5 M8.5 15.5 H15.5 M8.5 18.5 H12.5', 1.2), 'c2'),
    k.bow(6.3, 4.8, 0.62, -18),
  ],
  // rose back with its tab, a cream sheet peeking out, blush front, a heart clasp
  folder: (icon, k) => [
    k.rose(k.union(k.rr(2.5, 5, 21.5, 19.5, 2.2), k.rr(2.5, 3.6, 10.4, 8, 1.8)), { plate: 'K' }),
    k.cream(k.rr(4.6, 7, 19.4, 14, 1), { plate: 'A' }),
    k.body(k.rr(2.5, 9.4, 21.5, 20.5, 2.2)),
    k.heart(12, 14.9, 4.6, 0, { plate: 'S' }),
  ],
  // the locket: gold shackle, blush body, a ribbon-red heart keyhole, a little bow
  lock: (icon, k) => [
    k.gold(k.tube('M7.8 11 V8 A4.2 4.2 0 0 1 16.2 8 V11', 2.4), { plate: 'A' }),
    k.body(k.rr(4.4, 10.2, 19.6, 21.2, 3)),
    k.heart(12, 15.6, 5.6, 0, { plate: 'K' }),
    // the bow is tied on the shackle: it nods with it (plate A), never parts from it
    k.bow(7.8, 6.2, 0.55, -20, { plate: 'A' }),
  ],
  // a note whose head is a heart; a gold twinkle beside it
  'music-note': (icon, k) => [
    k.body(k.union(k.tube('M15 15.6 V3.8', 2.3), k.tube('M15 3.8 C15.4 6.6 19.6 6.8 19.4 10.8', 2.3))),
    k.satin(k.heartShape(11.2, 16.4, 9.6, -12), { plate: 'K' }),
    k.sparkle(19.8, 14.6, 1.5),
  ],
  // a blush rocket with ribbon fins, a gold-rimmed porthole and a gold flame
  rocket: (icon, k) => {
    const R = d => rot(parsePath(d)[0].pts, 45, 12, 12.4)
    const at = (x, y) => rot([[x, y]], 45, 12, 12.4)[0]
    return [
      k.gold(k.poly(R('M10.3 16.6 H13.7 C13.7 18.8 12.9 20.4 12 21.8 C11.1 20.4 10.3 18.8 10.3 16.6 Z'), 0.3), { plate: 'A' }),
      k.satin(k.poly(R('M8.6 10.6 C6.2 11.8 5.2 14.2 5.4 17.6 L8.8 15.6 Z'), 0.5), { plate: 'K' }),
      k.satin(k.poly(R('M15.4 10.6 C17.8 11.8 18.8 14.2 18.6 17.6 L15.2 15.6 Z'), 0.5), { plate: 'K' }),
      k.body(k.poly(R('M12 2.2 C15.7 4.7 16.7 9.6 15.7 16.8 H8.3 C7.3 9.6 8.3 4.7 12 2.2 Z'), 0.6)),
      k.gold(k.disc(...at(12, 9.2), 2.55), { plate: 'K' }),
      k.cream(k.disc(...at(12, 9.2), 1.5), { plate: 'K', ow: 0 }),
    ]
  },
  // a blush cup with a gold handle, a ribbon-red heart and rose steam
  coffee: (icon, k) => [
    k.gold(k.tube('M16.4 11.4 H17.4 A2.6 2.6 0 0 1 17.4 16.6 H16', 1.9), { plate: 'A' }),
    k.body(k.path('M3.8 9.6 H17 V15 A5 5 0 0 1 12 20 H8.8 A5 5 0 0 1 3.8 15 Z')),
    k.heart(10.4, 14.6, 4.6, 0, { plate: 'K' }),
    k.fill(k.tube('M8.2 7.4 C7 6.2 9.4 5 8.2 3.4 M12.6 7.4 C11.4 6.2 13.8 5 12.6 3.4', 1.3), 'c2', { plate: 'A' }),
  ],
  // a blush bin under a rose lid trimmed with lace, rose ribs, a gold handle
  trash: (icon, k) => [
    k.gold(k.tube('M9.6 5.6 V4.6 A1.1 1.1 0 0 1 10.7 3.5 H13.3 A1.1 1.1 0 0 1 14.4 4.6 V5.6', 1.5), { plate: 'A' }),
    k.body(k.path('M5.4 7.6 H18.6 L17.5 19.2 A2 2 0 0 1 15.5 21 H8.5 A2 2 0 0 1 6.5 19.2 Z')),
    k.fill(k.tube('M10 12 V17.6 M14 12 V17.6', 1.3), 'c2'),
    k.lace('M5.8 8.6 H18.2', 0.72),
    k.rose(k.pill(3.4, 5.4, 20.6, 8.4), { plate: 'A' }),
  ],
  // a satin ribbon arrow with the bow tied on its tail
  'arrow-right': (icon, k) => [
    k.body(k.union(k.tube('M5.5 12 H19.6', 3), k.tube('M14 6.4 L19.6 12 L14 17.6', 3))),
    k.bow(5.4, 12, 0.72, 0),
  ],
  // a satin ribbon check whose short arm ends in a heart (the ornament is the stroke's terminal,
  // never a crumb floating in a free corner)
  check: (icon, k) => [
    k.body(k.tube('M5.6 13.8 L9.4 17.6 L19.6 6.6', 3.1)),
    k.heart(4.9, 12.6, 5.4, -45, { plate: 'K' }),
  ],
}
