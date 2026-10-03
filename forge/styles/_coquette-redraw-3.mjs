// COQUETTE redraw chunk 3 of 5: hand-composed icons for this chunk's redrawer
// (icons 201-300 alphabetically: gift .. notebook). Each entry maps an icon name to
// (icon, k) => parts (k = the frozen kit, see forge/styles/COQUETTE-GUIDE.md).
// Entries in the EXEMPLAR map (_coquette-exemplars.mjs) win: heart, home, lock, mail and
// music-note are drawn there.
//
// Family builds used here (guide section 7): satin-ribbon glyphs with a small heart in a
// free corner; screens are cream with a heart on them; message bubbles get a bow on the
// upper-right shoulder; pictures are cream with rose hills and a heart for the sun;
// list markers are pearls; git nodes are pearls with a red heart for the head.

const D2R = Math.PI / 180
// rotate points about (cx, cy)
const rotP = (pts, deg, cx = 12, cy = 12) => {
  const a = deg * D2R, c = Math.cos(a), s = Math.sin(a)
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c])
}
const ngon = (cx, cy, R, n, a0 = -90) => Array.from({ length: n }, (_, i) => [cx + R * Math.cos((a0 + i * 360 / n) * D2R), cy + R * Math.sin((a0 + i * 360 / n) * D2R)])

// a picture: cream mat in a blush frame, rose hills, a heart for the sun
const picture = (k, x0, y0, x1, y1, o = {}) => {
  const frame = k.rr(x0, y0, x1, y1, 2.3)
  const mat = k.rr(x0 + 2, y0 + 2, x1 - 2, y1 - 2, 1)
  const h = y1 - 2
  const hills = k.inter(k.union(
    k.poly([[x0 + 0.6, h + 2], [x0 + 6.2, h - 5.6], [x0 + 11.6, h + 2]], 1.6),
    k.poly([[x0 + 7.6, h + 2], [x1 - 5.6, h - 3.6], [x1 + 1, h + 2]], 1.6),
  ), k.inset(mat, 0.2))
  return [
    k.body(o.cut ? k.cut(frame, o.cut) : frame),
    k.cream(o.cut ? k.cut(mat, o.cut) : mat, { ow: 0.5 }),
    k.rose(o.cut ? k.cut(hills, o.cut) : hills, { plate: 'A', ow: 0.45 }),
    k.heart(x1 - 5.2, y0 + 5.4, 3.8, 0, { plate: 'A' }),
  ]
}
// a round face (laugh, meh): blush disc + a hair bow; no cheeks (that is Kawaii)
const face = k => [k.body(k.disc(12, 12.6, 9.1)), k.bow(18.2, 5.2, 0.6, 20)]
// bold pearl bullets: a rose shade crescent peeking lower-right under each cream pearl,
// with a heavier wine line, so they hold at 24px
const bullets = (k, pts, r, plate = 'K') => [
  k.rose(k.union(pts.map(([x, y]) => k.disc(x + r * 0.2, y + r * 0.22, r * 1.04))), { plate, ow: 0.55 }),
  pts.map(([x, y]) => k.pearl(x - r * 0.06, y - r * 0.06, r * 0.86, { plate, ow: 0.5 })),
]
// a speech bubble with a bow on its upper-right shoulder
const bubbleBow = k => k.bow(18.6, 4.6, 0.58, 18)

export const R = {
  // a blush box under a rose lid, wrapped in ribbon red and tied with its own bow
  gift: (icon, k) => [
    k.body(k.rr(4.6, 11.2, 19.4, 21.2, [0, 0, 2.2, 2.2])),
    k.rose(k.rr(3, 7.8, 21, 12, 1.5), { plate: 'K' }),
    k.satin(k.rect(10.6, 8, 13.4, 21.2), { plate: 'K', ow: 0.5 }),
    k.bow(12, 6.6, 0.86, 0, { plate: 'K' }),
    k.sparkle(20.4, 3.6, 1.5),
  ],
  // git: satin ribbon branches, pearl commits, a ribbon-red heart for the head
  'git-branch': (icon, k) => [
    k.body(k.union(k.tube('M6 6 V18', 2.8), k.tube('M18 7.6 C18 13.4 11 12.6 6.6 17.2', 2.8))),
    k.pearl(6, 5.4, 2.6, { plate: 'K' }),
    k.pearl(6, 18.8, 2.6, { plate: 'K' }),
    k.heart(18, 6.2, 6.4, 0, { plate: 'A' }),
  ],
  'git-commit': (icon, k) => [
    k.body(k.union(k.tube('M2.4 12 H8.4', 2.8), k.tube('M15.6 12 H21.6', 2.8))),
    k.gold(k.ring(12, 12, 3.7, 1.7), { plate: 'K' }),
    k.pearl(12, 12, 2.6, { plate: 'K' }),
    k.sparkle(18.8, 5.4, 1.6),
  ],
  'git-merge': (icon, k) => [
    k.body(k.union(k.tube('M6 6 V18', 2.8), k.tube('M6 7 C6.4 11.2 10 12 15 12', 2.8))),
    k.pearl(6, 5.4, 2.6, { plate: 'K' }),
    k.pearl(6, 18.8, 2.6, { plate: 'K' }),
    k.heart(18, 12.2, 6.4, 0, { plate: 'A' }),
  ],
  'git-pull-request': (icon, k) => [
    k.body(k.union(k.tube('M6 6 V18', 2.8), k.tube('M18 16 V9 A3 3 0 0 0 15 6 H11.4', 2.8))),
    k.rose(k.tube('M13.8 3.4 L11.2 6 L13.8 8.6', 2.8), { plate: 'A' }),
    k.pearl(6, 5.4, 2.6, { plate: 'K' }),
    k.pearl(6, 18.8, 2.6, { plate: 'K' }),
    k.heart(18, 19, 6.2, 0, { plate: 'A' }),
  ],
  // a blush globe with fine meridians and a pearl string for its equator
  globe: (icon, k) => [
    k.body(k.disc(12, 12, 9.2), { detail: k.tube('M12 3.1 C7.4 7.6 7.4 16.4 12 20.9 M12 3.1 C16.6 7.6 16.6 16.4 12 20.9 M12 3.1 V20.9', 0.9) }),
    k.pearls('M3.6 12 H20.4', 0.74),
  ],
  // a blush cap under a rose board, a gold tassel ending in a heart
  'graduation-cap': (icon, k) => [
    k.body(k.path('M6.2 10.2 V15.2 C6.2 17.3 9 18.8 12 18.8 C15 18.8 17.8 17.3 17.8 15.2 V10.2 Z')),
    k.rose(k.poly([[12, 3.6], [22, 8.4], [12, 13.2], [2, 8.4]], 0.9), { plate: 'K' }),
    k.wire('M12 8.4 L19.6 10.4 V14.6', 0.95),
    k.pearl(12, 8.4, 1, { plate: 'K' }),
    k.heart(19.6, 16, 3.8, 0, { plate: 'A' }),
  ],
  // the line's clawed gold head on a blush handle, a little bow tied just under the head
  hammer: (icon, k) => [
    k.body(k.seg(5.3, 19.3, 13.6, 11, 3), { plate: 'A' }),
    k.gold(k.path('M12.68 2.82 L18.34 8.47 C20.82 10.95 21.35 14.31 19.22 17.49 C19.75 15.19 18.87 13.25 17.28 11.66 L16.57 10.95 L14.81 12.72 L8.79 6.71 A1 1 0 0 1 8.79 5.29 L11.27 2.82 A1 1 0 0 1 12.68 2.82 Z'), { plate: 'K' }),
    k.bow(10.9, 14.1, 0.5, 45, { plate: 'A' }),
  ],
  // hands: the automatic dressing reads them well; ornaments swapped for the motif
  'hand-coins': (icon, k) => [k.auto(icon, { bow: false }), k.sparkle(5.6, 4.4, 1.6)],
  'hand-heart': (icon, k) => [k.auto(icon, { bow: false }), k.sparkle(19.6, 3.4, 1.5)],
  // two satin hands after the line skeleton: blush palm, rose fingers moated off it,
  // rose cuffs, a small bow tied on one cuff
  handshake: (icon, k) => {
    const fingers = k.tube('M21.5 14 H18.5 L14.5 18 A1.75 1.75 0 0 1 12 15.5 L13 14.5 L11.5 16 A1.75 1.75 0 0 1 9 13.5 L11.5 11', 2.2)
    const palm = k.tube('M3.4 10 H6 L9.5 7.5 C10.4 6.9 11.6 6.9 12.5 7.5 L17.5 11 H20.6 M3.4 14 H5 L8 17', 2.4)
    return [
      k.body(k.moat(palm, fingers, 0.65)),
      k.rose(fingers, { plate: 'A' }),
      k.rose(k.union(k.pill(1.2, 7.6, 4, 16.8), k.pill(20, 7.6, 22.8, 16.8)), { plate: 'K' }),
      k.bow(21.4, 7.4, 0.48, 18),
    ]
  },
  // a portrait drive: blush case, cream platter with a pearl hub, a gold arm, a small bow
  'hard-drive': (icon, k) => [
    k.body(k.rr(4.6, 2.6, 19.4, 21.4, 2.6)),
    k.cream(k.disc(12, 11.6, 5), { ow: 0.55 }),
    k.gold(k.tube('M16.4 18.4 L13.2 13.2', 1.4), { plate: 'A' }),
    k.pearl(12, 11.6, 1.2, { plate: 'K' }),
    k.bow(6.2, 4.4, 0.55, -18),
  ],
  // satin ribbon glyphs with a small heart in a free corner
  hash: (icon, k) => [
    k.body(k.tube('M10.4 3.6 L8.4 20.4 M15.6 5 L13.6 20.4 M3.8 8.6 H20.2 M3.8 15.4 H20.2', 2.6)),
    k.heart(15.9, 3.5, 5, 7, { plate: 'K' }),
  ],
  heading: (icon, k) => [
    k.body(k.tube('M6.5 4 V20 M17.5 4 V20 M6.5 12 H17.5', 2.7)),
    k.heart(12, 12.3, 4.6, 0, { plate: 'K' }),
  ],
  // a rose headband with the bow tied on top, blush satin ear cups
  headphones: (icon, k) => [
    k.rose(k.tube('M4.4 14 V12 A7.6 7.6 0 0 1 19.6 12 V14', 2.2), { plate: 'K' }),
    k.body(k.rr(2.6, 12.4, 8, 20.8, 2.4)),
    k.body(k.rr(16, 12.4, 21.4, 20.8, 2.4)),
    k.bow(12, 4.4, 0.62, 0),
  ],
  headset: (icon, k) => [
    k.rose(k.tube('M4.8 13.4 V11.6 A7.2 7.2 0 0 1 19.2 11.6 V13.4', 2.2), { plate: 'K' }),
    k.wire('M18.8 17.4 C18.8 20.2 17.2 20.8 13.6 20.8', 1.5),
    k.body(k.rr(2.8, 11.4, 7.8, 18.4, 2.3)),
    k.body(k.rr(16.2, 11.4, 21.2, 18.4, 2.3)),
    k.bow(12, 4.4, 0.6, 0),
  ],
  // a blush heart split by a fine crack (the heart is its own ornament)
  'heart-crack': (icon, k) => {
    const h = k.heartShape(12, 13.4, 18.6)
    const crack = k.tube('M12.2 5.2 L10.2 10 L13.6 13 L11.2 17.2 L12 22', 1)
    return [k.body(k.cut(h, crack))]
  },
  'heart-pulse': (icon, k) => [
    k.body(k.heartShape(12, 13.4, 18.6)),
    k.satin(k.tube('M2.6 12.6 H7.4 L9.4 9 L12.6 16.4 L14.6 11.4 L15.8 12.6 H21.4', 1.7), { plate: 'A' }),
    k.bow(12, 6.8, 0.6, 0),
  ],
  // a blush disc, the glyph in wine, its dot a pearl, a bow on the shoulder
  'help-circle': (icon, k) => [
    k.body(k.disc(12, 12.2, 9.2)),
    k.ink('M9.3 9.6 A2.8 2.8 0 1 1 13.3 12.1 C12.4 12.6 12 13.2 12 14.2', 2.1),
    k.pearl(12, 17.5, 1.3, { plate: 'K' }),
    k.bow(18.4, 5.4, 0.58, 20),
  ],
  // a blush hexagon on a lace doily
  hexagon: (icon, k) => {
    const hex = k.poly(ngon(12, 12, 9.2, 6), 1.4)
    return [k.laceRing(hex, 0.75, 0.35), k.body(hex)]
  },
  // a rose highlight swatch, a blush pen with a rose nib and a bow round its waist
  highlighter: (icon, k) => {
    const pen = k.path('M10 10 L15.94 4.06 A1.5 1.5 0 0 1 18.06 4.06 L19.94 5.94 A1.5 1.5 0 0 1 19.94 8.06 L14 14 Z')
    return [
      k.rose(k.tube('M3.2 20.5 H12', 2.2), { plate: 'A', ow: 0.45 }),
      k.rose(k.poly([[10.4, 9.8], [14.2, 13.6], [10.5, 16.8], [7.2, 13.5]], 0.6), { plate: 'A' }),
      k.body(pen),
      k.cream(k.inter(pen, k.side(15.9, 8.1, 45)), { ow: 0.45 }),
    ]
  },
  // a satin ribbon arc with its arrowhead, red clock hands round a pearl
  history: (icon, k) => [
    k.body(k.union(k.tube('M3.8 13 A8.3 8.3 0 1 0 6.2 6.2 L3.6 8.6', 2.5), k.tube('M3.4 4.6 V8.8 H7.6', 2.5))),
    k.satin(k.tube('M12 7.6 V12 L15.4 14', 1.8), { plate: 'A' }),
    k.pearl(12, 12, 1, { plate: 'A' }),
  ],
  // a blush tower with rose wings, a ribbon-red cross, a cream door, pearl windows
  hospital: (icon, k) => [
    k.rose(k.union(k.rr(2.4, 10.6, 8, 21.2, [2, 0, 0, 0]), k.rr(16, 10.6, 21.6, 21.2, [0, 2, 0, 0])), { plate: 'K' }),
    k.body(k.rr(6.4, 3, 17.6, 21.2, [2.2, 2.2, 0, 0])),
    k.satin(k.union(k.seg(12, 5.6, 12, 11, 2.3), k.seg(9.3, 8.3, 14.7, 8.3, 2.3)), { plate: 'S' }),
    k.cream(k.arch(10.1, 15.4, 13.9, 21.2), { plate: 'A' }),
    k.pearl(4.6, 14.6, 0.85, { plate: 'K' }),
    k.pearl(19.4, 14.6, 0.85, { plate: 'K' }),
  ],
  // a blush hotel with a cream sign, a rose bed with a pearl pillow, a bow on the corner
  // a cream facade under a blush cornice with a lace awning, a blush sign with a small
  // bow, a rose bed with a pearl pillow, a rose kerb
  hotel: (icon, k) => [
    k.cream(k.rect(3.8, 5, 20.2, 21.4)),
    k.lace('M4.8 6 H19.2', 1, { eyelets: false, noShadow: true, step: 2.4 }),
    k.body(k.rr(2.8, 2.6, 21.2, 6, 1.6)),
    k.body(k.rr(8.4, 8, 15.6, 10.6, 1), { plate: 'A', ow: 0.5 }),
    k.rose(k.union(k.tube('M6.8 12 V19.8', 1.9), k.rr(6.2, 16.2, 17.9, 18.7, 0.8), k.tube('M17 17.4 V19.8', 1.9), k.rr(11.4, 13.2, 17.9, 17, [1.6, 1.6, 0, 0])), { plate: 'A', ow: 0.5 }),
    k.pearl(9.5, 14.6, 1.25, { plate: 'A' }),
    k.rose(k.pill(1.8, 20.2, 22.2, 22.6), { plate: 'K' }),
    k.bow(15.6, 8.4, 0.42, 18, { plate: 'A' }),
  ],
  // gold plates, a cream glass, rose sand, a bow tied at the waist
  hourglass: (icon, k) => [
    k.cream(k.union(
      k.disc(12, 12, 0.9),
      k.path('M7 21 V18 C7 15 9.6 13.6 12 12 C14.4 13.6 17 15 17 18 V21 Z'),
      k.path('M7 3 V6 C7 9 9.6 10.4 12 12 C14.4 10.4 17 9 17 6 V3 Z'),
    ), { ow: 0.6 }),
    k.rose(k.union(k.path('M9.3 7.4 H14.7 C14.1 8.9 13 9.9 12 10.6 C11 9.9 9.9 8.9 9.3 7.4 Z'), k.path('M8.6 20 C9 17.6 10.8 16.3 12 15.6 C13.2 16.3 15 17.6 15.4 20 Z')), { plate: 'A', ow: 0.4 }),
    k.gold(k.union(k.pill(4.6, 1.8, 19.4, 4.2), k.pill(4.6, 19.8, 19.4, 22.2)), { plate: 'K' }),
    k.bow(12, 12, 0.5, 0),
  ],
  // a gold waffle cone, a scalloped blush scoop, a ribbon-red heart for the cherry
  'ice-cream': (icon, k) => {
    const cone = k.poly([[7.4, 12.6], [16.6, 12.6], [12, 22]], 1)
    return [
      k.gold(cone, { plate: 'A', detail: k.inter(k.tube('M8.4 12.4 L14.4 18.4 M11.4 12.4 L15.4 16.4 M15.6 12.4 L9.6 18.4 M12.6 12.4 L8.6 16.4', 0.7), k.inset(cone, 0.45)) }),
      k.body(k.union(k.disc(12, 9.6, 6.1), k.disc(7.8, 12.8, 2.1), k.disc(12, 13.4, 2.1), k.disc(16.2, 12.8, 2.1))),
      k.heart(12, 3.8, 4.4, 0, { plate: 'A' }),
    ]
  },
  // a blush card, a cream photo with a rose portrait, wine text, a heart for the seal
  'id-card': (icon, k) => [
    k.body(k.rr(2, 4.4, 22, 19.6, 2.5)),
    k.cream(k.rr(4.4, 7, 11.2, 17.2, 1.1), { ow: 0.5 }),
    k.rose(k.inter(k.union(k.disc(7.8, 10.6, 1.9), k.path('M4.8 17.2 C4.8 14.6 6.2 13.4 7.8 13.4 C9.4 13.4 10.8 14.6 10.8 17.2 Z')), k.rr(4.4, 7, 11.2, 17.2, 1.1)), { plate: 'A', ow: 0.4 }),
    k.ink('M13.8 9.4 H19.2 M13.8 12.4 H17.4', 1.2),
    k.heart(17.6, 16.2, 3.6, 0, { plate: 'S' }),
  ],
  image: (icon, k) => picture(k, 2, 4, 22, 20),
  'image-plus': (icon, k) => {
    const badge = k.disc(17.6, 17.6, 4.4)
    return [
      picture(k, 2, 3, 21, 19, { cut: k.grow(badge, 0.8) }),
      k.satin(badge, { plate: 'S' }),
      k.fill(k.tube('M17.6 15.4 V19.8 M15.4 17.6 H19.8', 1.4), 'edge', { plate: 'S' }),
    ]
  },
  images: (icon, k) => [
    k.rose(k.rr(5.6, 2.6, 22, 17, 2.3), { plate: 'A' }),
    picture(k, 2, 7, 18.4, 21.4),
  ],
  // a blush tray, a cream well, a heart letter dropped in
  inbox: (icon, k) => [
    k.body(k.path('M2.5 12.5 L5.5 5 H18.5 L21.5 12.5 V17.5 A2 2 0 0 1 19.5 19.5 H4.5 A2 2 0 0 1 2.5 17.5 Z')),
    k.cream(k.poly([[5.2, 12.6], [7.1, 7], [16.9, 7], [18.8, 12.6], [15.6, 12.6], [14.6, 14.8], [9.4, 14.8], [8.4, 12.6]], 0.6), { ow: 0.55 }),
    k.heart(12, 10.6, 4.2, 0, { plate: 'A' }),
  ],
  // satin ribbon lines, the arrow in ribbon red
  'indent-decrease': (icon, k) => [
    k.body(k.tube('M3.6 4.8 H20.4 M12.6 9.8 H20.4 M12.6 14.2 H20.4 M3.6 19.2 H20.4', 2.4)),
    k.satin(k.union(k.tube('M9.2 12 H4', 2.2), k.tube('M6.6 9.2 L3.8 12 L6.6 14.8', 2.2)), { plate: 'A' }),
  ],
  'indent-increase': (icon, k) => [
    k.body(k.tube('M3.6 4.8 H20.4 M12.6 9.8 H20.4 M12.6 14.2 H20.4 M3.6 19.2 H20.4', 2.4)),
    k.satin(k.union(k.tube('M3.8 12 H9', 2.2), k.tube('M6.4 9.2 L9.2 12 L6.4 14.8', 2.2)), { plate: 'A' }),
  ],
  'indian-rupee': (icon, k) => [
    k.body(k.union(k.tube('M6 4 H18 M6 8.5 H18', 2.5), k.tube('M9.5 4 C12.8 4 14.5 6 14.5 8.5 C14.5 11.2 12.5 13 9.5 13 H6.5 L15.5 20.5', 2.5))),
  ],
  'info-circle': (icon, k) => [
    k.body(k.disc(12, 12.2, 9.2)),
    k.ink('M12 11.2 V16.8', 2.2),
    k.pearl(12, 7.8, 1.3, { plate: 'K' }),
    k.bow(18.4, 5.4, 0.58, 20),
  ],
  italic: (icon, k) => [
    k.body(k.tube('M15 4 L9 20 M11 4 H17.6 M5 20 H13', 2.6)),
    k.heart(19.3, 4, 5.2, 90, { plate: 'K' }),
  ],
  // a blush board with cream cards, a bow on the corner
  kanban: (icon, k) => [
    k.body(k.rr(3, 3, 21, 21, 2.6)),
    k.cream(k.union(k.pill(6.4, 6.4, 8.6, 17), k.pill(10.9, 6.4, 13.1, 12.4), k.pill(15.4, 6.4, 17.6, 15)), { ow: 0.45 }),
    k.bow(19.2, 4.6, 0.56, 18),
  ],
  // an antique gold key with a blush heart bow (its head) and a satin bow at the neck
  key: (icon, k) => [
    k.gold(k.union(k.tube('M10.4 13.6 L20.4 3.6', 2.2), k.tube('M18.4 5.6 L20.6 7.8 M15.6 8.4 L17.6 10.4', 2)), { plate: 'K' }),
    k.body(k.disc(7.6, 16.4, 4.9)),
    k.heart(7.6, 16.6, 4.6, 0, { plate: 'K' }),
    k.bow(12.2, 11.8, 0.5, -45, { plate: 'K' }),
  ],
  // a blush keyboard whose keys are pearls, a cream spacebar
  keyboard: (icon, k) => [
    k.body(k.rr(2, 4.6, 22, 19.4, 2.6)),
    k.pearls([[6, 8.6], [10, 8.6], [14, 8.6], [18, 8.6]], 0.95, { plate: 'A', step: 4 }),
    k.pearls([[8, 12], [12, 12], [16, 12]], 0.95, { plate: 'A', step: 4 }),
    k.cream(k.pill(7.6, 14.8, 16.4, 16.9), { plate: 'A', ow: 0.45 }),
  ],
  // a blush shade with a lace hem, a gold stem, a rose foot
  lamp: (icon, k) => [
    k.gold(k.tube('M12 12 V19.4', 1.9), { plate: 'A' }),
    k.lace('M5 12.4 H19', 0.72),
    k.body(k.poly([[8.6, 3], [15.4, 3], [19.6, 12.2], [4.4, 12.2]], 1)),
    k.rose(k.path('M6.6 21.6 A5.4 2.8 0 0 1 17.4 21.6 Z'), { plate: 'K' }),
  ],
  // a rose pediment over a lace frieze, blush columns, a rose plinth
  landmark: (icon, k) => [
    k.lace('M4.4 9.8 H19.6', 0.7),
    k.rose(k.poly([[2.4, 9.6], [12, 3.2], [21.6, 9.6]], 1), { plate: 'K' }),
    k.body(k.union(k.pill(5, 12, 7.2, 18.4), k.pill(9.4, 12, 11.6, 18.4), k.pill(12.4, 12, 14.6, 18.4), k.pill(16.8, 12, 19, 18.4))),
    k.rose(k.pill(2.6, 19.4, 21.4, 21.8), { plate: 'K' }),
  ],
  // the two scripts as satin ribbons, a small heart
  language: (icon, k) => [
    k.body(k.tube('M2.5 6 H12.5 M7.5 3 V6 M11 6 C10.5 11 7.5 14 3 15 M4 6 C5 10.75 8 13.5 11.5 14.5', 2.1)),
    k.rose(k.tube('M13.6 21 L17.6 11 L21.6 21 M15 17.6 H20.2', 2.3), { plate: 'A' }),
  ],
  // a blush laptop, a cream screen with a heart on it, a rose base
  laptop: (icon, k) => [
    k.body(k.rr(4, 4, 20, 15.8, 2.2)),
    k.cream(k.rr(5.9, 5.9, 18.1, 13.9, 1), { ow: 0.5 }),
    k.heart(12, 10.1, 4.4, 0, { plate: 'A' }),
    k.rose(k.pill(1.8, 17.6, 22.2, 20.6), { plate: 'K' }),
  ],
  laugh: (icon, k) => [
    face(k)[0],
    k.ink('M7.4 10 A1.6 1.6 0 0 1 10.6 10 M13.4 10 A1.6 1.6 0 0 1 16.6 10', 1.35),
    k.satin(k.path('M7.6 13.4 H16.4 A4.4 4.4 0 0 1 7.6 13.4 Z'), { plate: 'A', ow: 0.6 }),
    face(k)[1],
  ],
  // three stacked sheets: rose, cream, blush, a heart on the top one
  layers: (icon, k) => {
    const D = y => k.poly([[12, y - 4.8], [21.4, y], [12, y + 4.8], [2.6, y]], 1.3)
    return [
      k.rose(D(16.6), { plate: 'A' }),
      k.cream(D(12), { plate: 'A' }),
      k.body(D(7.4)),
      k.heart(12, 7.6, 3.6, 0),
    ]
  },
  // layout tiles in blush and rose, a heart on the hero tile
  'layout-dashboard': (icon, k) => [
    k.body(k.union(k.rr(3, 3, 10.4, 13.4, 2), k.rr(13.6, 10.6, 21, 21, 2))),
    k.rose(k.union(k.rr(13.6, 3, 21, 7.6, 1.8), k.rr(3, 16.4, 10.4, 21, 1.8)), { plate: 'A' }),
    k.heart(6.7, 8.4, 4, 0),
  ],
  'layout-grid': (icon, k) => [
    k.body(k.union(k.rr(3, 3, 10.6, 10.6, 2), k.rr(13.4, 13.4, 21, 21, 2))),
    k.rose(k.union(k.rr(13.4, 3, 21, 10.6, 2), k.rr(3, 13.4, 10.6, 21, 2)), { plate: 'A' }),
    k.heart(6.8, 7, 4, 0),
  ],
  'layout-list': (icon, k) => [
    k.body(k.union(k.rr(3, 3, 10, 10, 2), k.rr(3, 14, 10, 21, 2))),
    k.rose(k.tube('M13.4 4.8 H20.6 M13.4 8.4 H18 M13.4 15.8 H20.6 M13.4 19.4 H18', 2.2), { plate: 'A' }),
    k.heart(6.5, 6.7, 3.6, 0),
  ],
  'layout-template': (icon, k) => [
    k.body(k.rr(3, 3, 21, 9.6, 2)),
    k.rose(k.rr(3, 12.6, 10.4, 21, 2), { plate: 'A' }),
    k.rose(k.tube('M13.6 13.8 H20.6 M13.6 17.2 H20.6 M13.6 20.4 H17.6', 2.1), { plate: 'A' }),
    k.heart(12, 6.5, 3.8, 0),
  ],
  // a blush leaf with a fine midrib, its rose stem tied with a bow
  leaf: (icon, k) => [
    k.rose(k.tube('M2.8 21.2 L7 17', 1.8), { plate: 'A' }),
    k.body(k.path('M5.5 18.5 C3.5 10.5 9.5 3.5 20.5 3.5 C20.5 14.5 13.5 20.5 5.5 18.5 Z'), { detail: k.tube('M7.2 16.8 C10.6 13.4 13.6 10.2 17.4 6.6 M10.6 13.2 L10 9.8 M13.4 10.4 L13.2 7.4 M10.6 13.2 L14 13.8 M13.4 10.4 L16.6 10.8', 0.8) }),
    k.bow(4.6, 19.4, 0.5, -40),
  ],
  // three books on a gold shelf, a heart on the first spine
  library: (icon, k) => [
    k.body(k.path('M16.97 20.24 L19.38 19.59 A1 1 0 0 0 20.09 18.37 L17.11 7.26 A1 1 0 0 0 15.89 6.55 L13.47 7.2 A1 1 0 0 0 12.76 8.43 L15.74 19.53 A1 1 0 0 0 16.97 20.24 Z'), { plate: 'A' }),
    k.rose(k.rr(8.6, 6.2, 12.6, 20.6, 1), { plate: 'K' }),
    k.body(k.rr(3.4, 3.2, 8.6, 20.6, 1.1)),
    k.heart(6, 11.6, 3.4, 0, { plate: 'K' }),
    k.gold(k.pill(2, 19.8, 22, 21.9), { plate: 'K' }),
  ],
  // a cream glass bulb, a gold screw base, a ribbon-red heart for the filament
  lightbulb: (icon, k) => [
    k.cream(k.path('M9 16 C9 13.75 5 12.25 5 9 A7 7 0 0 1 19 9 C19 12.25 15 13.75 15 16 Z')),
    k.gold(k.path('M9 15.4 H15 V19 A2 2 0 0 1 13 21 H11 A2 2 0 0 1 9 19 Z'), { plate: 'K', detail: k.tube('M9.2 17.6 H14.8', 0.8) }),
    k.heart(12, 9.4, 4.8, 0, { plate: 'A' }),
    k.sparkle(20.4, 3.4, 1.5),
  ],
  // a blush link and a rose link, a heart in the free corner
  link: (icon, k) => [
    k.rose(k.tube('M12.71 6.34 L14.65 4.4 A3.5 3.5 0 0 1 19.6 9.35 L15.71 13.24 A3.5 3.5 0 0 1 10.37 12.77', 2.5), { plate: 'A' }),
    k.body(k.tube('M11.29 17.66 L9.35 19.6 A3.5 3.5 0 0 1 4.4 14.65 L8.29 10.76 A3.5 3.5 0 0 1 13.63 11.23', 2.5)),
  ],
  // lists: satin ribbon lines, pearl / heart / gold markers
  list: (icon, k) => [
    k.body(k.tube('M9.4 6 H20.6 M9.4 12 H20.6 M9.4 18 H20.6', 2.5)),
    bullets(k, [[4.6, 6], [4.6, 12], [4.6, 18]], 1.7, 'A'),
  ],
  'list-checks': (icon, k) => [
    k.body(k.tube('M11.6 6 H20.6 M11.6 12 H20.6 M11.6 18 H20.6', 2.5)),
    k.satin(k.tube('M3.2 6.2 L5 8 L8.4 4.4 M3.2 12.2 L5 14 L8.4 10.4', 2), { plate: 'A' }),
  ],
  'list-filter': (icon, k) => [
    k.body(k.tube('M3.4 5.6 H20.6 M6.8 11 H17.2', 2.6)),
    k.heart(12, 17, 5.4, 0, { plate: 'K' }),
  ],
  'list-music': (icon, k) => [
    k.body(k.tube('M3.4 5.6 H13.6 M3.4 10.6 H13.6 M3.4 15.6 H9.6', 2.4)),
    k.body(k.union(k.tube('M17.6 16 V4.2', 2.1), k.tube('M17.6 4.2 C18 6.6 21 6.8 20.8 10', 2.1)), { plate: 'A' }),
    k.satin(k.heartShape(15.6, 17.4, 6.8, -12), { plate: 'A' }),
  ],
  'list-ordered': (icon, k) => [
    k.body(k.tube('M10.4 6 H20.6 M10.4 12 H20.6 M10.4 18 H20.6', 2.5)),
    k.satin(k.tube('M4 4.8 L5.6 3.6 V9 M3.6 15.4 A1.8 1.8 0 1 1 6.8 16.6 L3.6 20.4 H7.2', 1.9), { plate: 'A', ow: 0.4 }),
  ],
  'list-plus': (icon, k) => [
    k.body(k.tube('M3.4 6 H20.6 M3.4 12 H20.6 M3.4 18 H11.4', 2.5)),
    k.satin(k.tube('M17.8 14.4 V21.2 M14.4 17.8 H21.2', 2.4), { plate: 'S' }),
  ],
  // a spinner of graduated pearls led by a ribbon-red heart
  loader: (icon, k) => {
    const P = Array.from({ length: 7 }, (_, j) => { const i = j + 1, a = (-90 + i * 45) * D2R; return [12 + 7.5 * Math.cos(a), 12.2 + 7.5 * Math.sin(a), 2.15 - i * 0.12] })
    return [
      k.heart(12, 4.8, 5.4, 0, { plate: 'K' }),
      k.rose(k.union(P.map(([x, y, r]) => k.disc(x + r * 0.2, y + r * 0.22, r * 1.04))), { plate: 'A', ow: 0.55 }),
      { ...k.pearl(0, 0, 1, { plate: 'A', ow: 0.5 }), f: k.union(P.map(([x, y, r]) => k.disc(x - r * 0.06, y - r * 0.06, r * 0.86))) },
    ]
  },
  // a rose door frame and a blush satin arrow with the bow on its tail
  'log-in': (icon, k) => [
    k.rose(k.tube('M14.4 3.6 H18.4 A2 2 0 0 1 20.4 5.6 V18.4 A2 2 0 0 1 18.4 20.4 H14.4', 2.5), { plate: 'K' }),
    k.body(k.union(k.tube('M4.4 12 H15.6', 2.7), k.tube('M11 7.2 L15.8 12 L11 16.8', 2.7)), { plate: 'A' }),
    k.bow(4.4, 12, 0.56, 0),
  ],
  'log-out': (icon, k) => [
    k.rose(k.tube('M9.6 3.6 H5.6 A2 2 0 0 0 3.6 5.6 V18.4 A2 2 0 0 0 5.6 20.4 H9.6', 2.5), { plate: 'K' }),
    k.body(k.union(k.tube('M9.4 12 H20.4', 2.7), k.tube('M15.8 7.2 L20.6 12 L15.8 16.8', 2.7)), { plate: 'A' }),
    k.bow(9.2, 12, 0.52, 0),
  ],
  // a blush case with rose straps, pearl wheels, a heart luggage tag on the handle
  luggage: (icon, k) => [
    k.gold(k.tube('M9.6 6 V4 A1.2 1.2 0 0 1 10.8 2.8 H13.2 A1.2 1.2 0 0 1 14.4 4 V6', 1.6), { plate: 'A' }),
    k.body(k.rr(5, 5.6, 19, 19.2, 2.5)),
    k.rose(k.union(k.pill(8.8, 8.6, 10.4, 16.2), k.pill(13.6, 8.6, 15.2, 16.2)), { plate: 'A', ow: 0.45 }),
    k.pearl(8.2, 21, 1.25, { plate: 'K' }),
    k.pearl(15.8, 21, 1.25, { plate: 'K' }),
    k.wire('M14.2 3.8 C16.6 3.6 18.2 4.6 18.6 6.4', 0.75),
    k.heart(19, 7.6, 3.6, 12, { plate: 'A' }),
  ],
  // mail family (see the mail exemplar): cream envelope, blush flap, red badge / heart
  'mail-check': (icon, k) => {
    const badge = k.disc(17.8, 17.4, 4.6)
    return [
      k.cream(k.cut(k.rr(2.5, 4.6, 21.5, 19.4, 2.4), k.grow(badge, 0.8))),
      k.ink(k.cut(k.tube('M4 18 L9.6 12.6', 0.8), k.grow(badge, 0.8))),
      k.body(k.cut(k.poly([[2.9, 5.2], [21.1, 5.2], [12, 12.2]], 1.3), k.grow(badge, 0.8))),
      k.satin(badge, { plate: 'S' }),
      k.fill(k.tube('M15.6 17.5 L17.2 19.1 L20.1 15.9', 1.4), 'edge', { plate: 'S' }),
    ]
  },
  'mail-open': (icon, k) => [
    k.rose(k.poly([[2.5, 10.4], [12, 3.4], [21.5, 10.4], [21.5, 19], [2.5, 19]], 1.4), { plate: 'K' }),
    k.cream(k.rr(5.4, 6.4, 18.6, 15.4, 1.1), { plate: 'A' }),
    k.heart(12, 10.2, 4.2, 0, { plate: 'A' }),
    k.body(k.path('M2.5 10.4 L12 16.6 L21.5 10.4 V19 A2 2 0 0 1 19.5 21 H4.5 A2 2 0 0 1 2.5 19 Z')),
  ],
  // a folded blush map, the middle panel rose, a heart marks the spot
  map: (icon, k) => {
    const m = k.poly([[3, 6], [9, 3.5], [15, 6], [21, 3.5], [21, 18], [15, 20.5], [9, 18], [3, 20.5]], 0.9)
    return [
      k.body(m, { detail: k.tube('M9 3.8 V18 M15 6 V20.2', 0.85) }),
      k.rose(k.inter(m, k.poly([[9, 3.5], [15, 6], [15, 20.5], [9, 18]], 0)), { plate: 'K', ow: 0 }),
      k.heart(18, 10.6, 4, 0, { plate: 'S' }),
    ]
  },
  'map-pin': (icon, k) => [
    k.body(k.path('M19.5 10 C19.5 14.5 15.5 18.5 12 21.5 C8.5 18.5 4.5 14.5 4.5 10 A7.5 7.5 0 0 1 19.5 10 Z')),
    k.heart(12, 10, 5.4, 0, { plate: 'K' }),
    k.sparkle(20.4, 3.4, 1.5),
  ],
  // satin ribbon arrows; a heart where they meet / in the free corner
  maximize: (icon, k) => [
    k.body(k.tube('M20.2 3.8 L14.4 9.6 M14.6 3.6 H20.4 V9.4', 2.6)),
    k.rose(k.tube('M3.8 20.2 L9.6 14.4 M9.4 20.4 H3.6 V14.6', 2.6), { plate: 'A' }),
  ],
  minimize: (icon, k) => [
    k.body(k.tube('M20.4 3.6 L14.4 9.6 M14.2 4.2 V9.8 H19.8', 2.6)),
    k.rose(k.tube('M3.6 20.4 L9.6 14.4 M4.2 14.2 H9.8 V19.8', 2.6), { plate: 'A' }),
  ],
  // a ribbon-red V strap, a gold medal with a blush face and a heart
  medal: (icon, k) => [
    k.satin(k.union(k.poly([[4.4, 2.6], [9.6, 2.6], [13.2, 10.8], [9.2, 12.6]], 0.6), k.poly([[19.6, 2.6], [14.4, 2.6], [10.8, 10.8], [14.8, 12.6]], 0.6)), { plate: 'A' }),
    k.gold(k.disc(12, 16, 5.6), { plate: 'K' }),
    k.body(k.disc(12, 16, 3.8), { ow: 0.45 }),
    k.heart(12, 16.2, 3.8, 0, { plate: 'K' }),
  ],
  // a blush megaphone with a lace bell rim and a rose handle
  megaphone: (icon, k) => [
    k.rose(k.path('M9.55 15 L9.62 19.38 A1.75 1.75 0 0 1 6.12 19.45 L6.06 15.6 Z'), { plate: 'A' }),
    k.lace('M16.9 3.8 L20.7 14.2', 0.72),
    k.body(k.path('M5.35 9.89 L8.64 8.7 C11.53 7.42 13 5.43 14.54 3.21 A1 1 0 0 1 16.3 3.44 L20.11 13.9 A1 1 0 0 1 18.91 15.21 C16.3 14.5 13.89 13.93 10.86 14.8 L7.57 16 A2 2 0 0 1 5.01 14.81 L4.15 12.46 A2 2 0 0 1 5.35 9.89 Z'), { detail: k.tube('M8.7 9 L10.8 14.6', 0.9) }),
  ],
  meh: (icon, k) => [
    face(k)[0],
    k.ink('M9 9.4 V10.6 M15 9.4 V10.6', 1.9),
    k.ink('M8.6 15.6 H15.4', 1.5),
    face(k)[1],
  ],
  menu: (icon, k) => [
    k.body(k.tube('M4 6 H20.4 M3.6 12 H20.4 M3.6 18 H20.4', 2.6)),
    k.bow(4.4, 6, 0.54, 0),
  ],
  // speech bubbles: blush satin, a bow on the shoulder
  'message-circle': (icon, k) => [
    k.body(k.path('M8 19.29 A9 9 0 1 0 4.71 16 L2.5 21.5 Z')),
    k.heart(12.4, 11.4, 5, 0, { plate: 'A' }),
    bubbleBow(k),
  ],
  'message-circle-more': (icon, k) => [
    k.body(k.path('M8 19.29 A9 9 0 1 0 4.71 16 L2.5 21.5 Z')),
    k.pearls([[8, 11.5], [12.5, 11.5], [17, 11.5]], 1.25, { plate: 'A', step: 4.5 }),
    bubbleBow(k),
  ],
  'message-square': (icon, k) => [
    k.body(k.path('M3 21 V5.5 A2 2 0 0 1 5 3.5 H19 A2 2 0 0 1 21 5.5 V15.5 A2 2 0 0 1 19 17.5 H6.5 Z')),
    bubbleBow(k),
  ],
  'message-square-text': (icon, k) => [
    k.body(k.path('M3 21 V5.5 A2 2 0 0 1 5 3.5 H19 A2 2 0 0 1 21 5.5 V15.5 A2 2 0 0 1 19 17.5 H6.5 Z')),
    k.ink('M7.4 8.6 H16.4 M7.4 12.6 H13', 1.4, { plate: 'A' }),
    bubbleBow(k),
  ],
  messages: (icon, k) => [
    k.rose(k.path('M11 8 H19 A2 2 0 0 1 21 10 V21 L17.5 17.5 H11 A2 2 0 0 1 9 15.5 V10 A2 2 0 0 1 11 8 Z'), { plate: 'A' }),
    k.body(k.path('M3 16 V5 A2 2 0 0 1 5 3 H13 A2 2 0 0 1 15 5 V10.5 A2 2 0 0 1 13 12.5 H6.5 Z')),
    k.heart(9, 7.8, 4, 0, { plate: 'K' }),
  ],
  // a blush capsule on a gold stand with a rose foot, a bow on the stem
  microphone: (icon, k) => [
    k.gold(k.union(k.tube('M5.6 11 A6.4 6.4 0 0 0 18.4 11', 1.9), k.tube('M12 17.4 V20.6', 1.9)), { plate: 'A' }),
    k.rose(k.pill(8, 19.8, 16, 22.2), { plate: 'K' }),
    k.body(k.pill(8.8, 2.4, 15.2, 14.4), { detail: k.tube('M10.6 6.6 H13.4 M10.6 9 H13.4', 0.8) }),
    k.bow(17.6, 4.4, 0.52, 20),
  ],
  'microphone-off': (icon, k) => {
    const slash = k.seg(3.4, 3.4, 20.6, 20.6, 2)
    const m = f => k.moat(f, slash, 0.75)
    return [
      k.gold(m(k.union(k.tube('M5.6 11 A6.4 6.4 0 0 0 18.4 11', 1.9), k.tube('M12 17.4 V20.6', 1.9))), { plate: 'A' }),
      k.rose(m(k.pill(8, 19.8, 16, 22.2)), { plate: 'K' }),
      k.body(m(k.pill(8.8, 2.4, 15.2, 14.4))),
      k.satin(slash, { plate: 'S' }),
    ]
  },
  // a rose eyepiece on a blush arm, a gold stage holding a heart sample
  microscope: (icon, k) => [
    k.gold(k.tube('M10.75 10.46 L11.75 12.2', 1.6), { plate: 'A' }),
    k.body(k.union(k.tube('M12 5.5 C16.5 6 19 9.5 19 13.25 C19 16.75 17 19.5 14 21', 2.5), k.tube('M4.5 21 H19.5', 2.5))),
    k.rose(k.path('M5.3 5.53 L8.3 10.72 A1 1 0 0 0 9.67 11.09 L11.83 9.84 A1 1 0 0 0 12.2 8.47 L9.2 3.28 A1 1 0 0 0 7.83 2.91 L5.67 4.16 A1 1 0 0 0 5.3 5.53 Z'), { plate: 'A' }),
    k.gold(k.tube('M8 15.8 H18.8', 1.8), { plate: 'K' }),
    k.heart(11.4, 13.4, 3.2, 0),
  ],
  // a full-width rose satin bar whose right end cap is a heart
  minus: (icon, k) => [
    k.rose(k.tube('M4.2 12 H17', 3), { plate: 'K' }),
    k.heart(18.9, 12, 6.4, 90, { plate: 'K' }),
  ],
  'minus-circle': (icon, k) => [
    k.body(k.disc(12, 12.2, 9.2)),
    k.satin(k.tube('M7.6 12.2 H16.4', 2.4), { plate: 'S' }),
    k.bow(18.4, 5.4, 0.58, 20),
  ],
  // a blush monitor, a cream screen with a heart, a gold neck, a rose foot
  monitor: (icon, k) => [
    k.gold(k.tube('M12 16 V20.4', 2.1), { plate: 'A' }),
    k.body(k.rr(2, 3.4, 22, 16.6, 2.4)),
    k.cream(k.rr(4, 5.4, 20, 14.6, 1.1), { ow: 0.5 }),
    k.heart(12, 10.1, 4.4, 0, { plate: 'A' }),
    k.rose(k.pill(7.4, 19.6, 16.6, 22), { plate: 'K' }),
  ],
  // a blush crescent with a bow at its horn and a gold twinkle in its bay
  moon: (icon, k) => [
    k.body(k.path('M21 13 A9 9 0 1 1 11 3 A7.1 7.1 0 0 0 21 13 Z')),
    k.bow(10.4, 3.8, 0.55, -22),
    k.sparkle(17.4, 6.6, 1.7),
  ],
  // a strand of three pearls
  'more-horizontal': (icon, k) => bullets(k, [[5, 12], [12, 12], [19, 12]], 2.4),
  'more-vertical': (icon, k) => bullets(k, [[12, 5], [12, 12], [12, 19]], 2.4),
  // rose tyres with pearl hubs, a blush body, a gold fork, a bow on the handlebar
  // a vintage scooter: blush cowl and leg shield, rose seat, gold fork, rose tyres with
  // pearl hubs, a bow on the handlebar
  motorcycle: (icon, k) => [
    k.gold(k.union(k.tube('M18.6 17.6 L16.2 8', 1.9), k.tube('M14.2 7.8 H17.4', 1.9)), { plate: 'A' }),
    k.rose(k.union(k.ring(5.4, 17.6, 2.7, 2.1), k.ring(18.6, 17.6, 2.7, 2.1)), { plate: 'K' }),
    k.body(k.union(
      k.path('M2.6 15.6 C2.6 12.2 4.8 10.6 8 10.6 H10.2 C11.6 10.6 12.3 11.6 12.5 12.8 L12.8 15.6 Z'),
      k.tube('M10.6 15.4 H15.4', 2.4),
      k.tube('M16.4 9.6 C17.8 11.8 17.4 14.2 15.4 15.6', 2.6),
    )),
    k.rose(k.pill(4.2, 8.4, 10.8, 10.8), { plate: 'K' }),
    k.pearls([[5.4, 17.6], [18.6, 17.6]], 0.85, { plate: 'K', step: 13.2 }),
    k.bow(14.6, 7.6, 0.5, -12),
  ],
  // a blush peak with a scalloped cream snowcap, a rose peak behind, a twinkle
  mountain: (icon, k) => {
    const main = k.poly([[2, 20.4], [9.5, 5], [17.2, 20.4]], 1.2)
    const snow = k.inter(k.inset(main, 0.1), k.union(k.rect(0, 0, 24, 9.8), k.disc(6.9, 10.2, 1.05), k.disc(9, 10.6, 1.05), k.disc(11.1, 10.2, 1.05)))
    return [
      k.rose(k.poly([[11.4, 20.4], [16.6, 10], [22, 20.4]], 1.1), { plate: 'A' }),
      k.body(main),
      k.cream(snow, { ow: 0.45 }),
      k.wire('M9.5 5.6 V1.6', 0.9),
      k.heart(11.6, 2.9, 3.6, -90, { plate: 'A' }),
    ]
  },
  // a blush mouse with a rose wheel and a bow on its shoulder
  mouse: (icon, k) => [
    k.body(k.rr(5.8, 3, 18.2, 21.4, 6.2), { detail: k.tube('M6 12.6 H18', 0.85) }),
    k.rose(k.pill(10.9, 6.2, 13.1, 9.8), { plate: 'A', ow: 0.45 }),
    k.bow(16.6, 4.8, 0.52, 28),
  ],
  // four satin arrows pinned by a ribbon-red heart
  move: (icon, k) => [
    k.body(k.tube('M12 3.4 V20.6 M3.4 12 H20.6 M9 6 L12 3 L15 6 M18 9 L21 12 L18 15 M15 18 L12 21 L9 18 M6 15 L3 12 L6 9', 2.4)),
    k.heart(12, 12.2, 5, 0, { plate: 'K' }),
  ],
  // a folded blush arrow (its shade side rose) and a gold twinkle
  navigation: (icon, k) => {
    const n = k.poly([[20.6, 3.4], [13.6, 21], [10.6, 13.4], [3, 10.4]], 1.1)
    return [
      k.body(n),
      k.rose(k.inter(n, k.side(10.6, 13.4, 135)), { plate: 'K', ow: 0 }),
      k.sparkle(5, 18.8, 1.8),
    ]
  },
  // a blush hub with a heart, gold wires, three pearl nodes
  network: (icon, k) => [
    k.wire('M12 7.4 V17.4 M4 17.4 V12.4 H20 V17.4', 1.3),
    k.body(k.rr(8.2, 2.2, 15.8, 7.8, 1.8)),
    k.heart(12, 5.1, 3.4, 0, { plate: 'K' }),
    k.pearls([[4, 19.2], [12, 19.2], [20, 19.2]], 2.1, { plate: 'K', step: 8 }),
  ],
  // a cream paper, a rose back fold, a blush headline block, rose lines, a bow
  newspaper: (icon, k) => [
    k.rose(k.rr(2.8, 8.6, 8, 20.2, [1.6, 0, 0, 1.6]), { plate: 'A' }),
    k.cream(k.path('M4.5 20.2 H19 A2 2 0 0 0 21 18.2 V6 A2 2 0 0 0 19 4 H9 A2 2 0 0 0 7 6 V17.6 A2.6 2.6 0 0 1 4.5 20.2 Z')),
    k.body(k.rr(10, 7.2, 18, 11.8, 1), { plate: 'A' }),
    k.fill(k.tube('M10.6 15 H17.4 M10.6 17.8 H15', 1.2), 'c2'),
    k.bow(19.4, 4.6, 0.55, 18),
  ],
  // a blush notebook on gold spiral rings, a cream label, a ribbon bookmark
  notebook: (icon, k) => [
    k.satin(k.poly([[15.6, 20], [17.8, 20], [17.8, 23.4], [16.7, 22.5], [15.6, 23.4]], 0.15), { plate: 'deco' }),
    k.body(k.rr(6, 2.5, 20, 21.5, 2.4)),
    k.cream(k.rr(10.6, 5.6, 17, 9.8, 1), { ow: 0.5, plate: 'A' }),
    k.gold(k.union(k.pill(3.2, 6.2, 8.6, 7.9), k.pill(3.2, 11.2, 8.6, 12.9), k.pill(3.2, 16.2, 8.6, 17.9)), { plate: 'A' }),
  ],
}
