// COQUETTE redraw chunk 5 of 5: hand-composed icons for this chunk's redrawer.
// Each entry maps an icon name to (icon, k) => parts (k = the frozen kit, see
// forge/styles/COQUETTE-GUIDE.md). Entries in the EXEMPLAR map (_coquette-exemplars.mjs) win.
//
// Chunk 5 = icons 401..500 alphabetically (smartphone .. zoom-out). Exemplar names in this
// range (star, trash, user) are left to the exemplar map.

const D2R = Math.PI / 180
// rotate points about (cx, cy)
const rot = (pts, deg, cx = 12, cy = 12) => {
  const a = deg * D2R, c = Math.cos(a), s = Math.sin(a)
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c])
}
const at = (x, y, deg, cx = 12, cy = 12) => rot([[x, y]], deg, cx, cy)[0]

// a plump four-point twinkle: concave sides, softened tips (q = waist, as a fraction of R)
const twinkle = (k, cx, cy, R, q = 0.24, soft = 0.35) => {
  const w = R * q
  const d = `M${cx} ${cy - R} Q${cx + w} ${cy - w} ${cx + R} ${cy} Q${cx + w} ${cy + w} ${cx} ${cy + R} Q${cx - w} ${cy + w} ${cx - R} ${cy} Q${cx - w} ${cy - w} ${cx} ${cy - R} Z`
  return k.grow(k.inset(k.path(d), soft), soft)
}
// a rotated rectangle (rounded polygon)
const box4 = (k, x0, y0, x1, y1, r, deg, cx = 12, cy = 12) => k.poly(rot([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], deg, cx, cy), r)
// mirror every part of a redraw (thumbs-down from thumbs-up)
const flipY = (k, parts, ay = 12) => parts.flat(Infinity).filter(Boolean).map(p => ({ ...p, f: k.mirrorY(p.f, ay), detail: p.detail ? k.mirrorY(p.detail, ay) : p.detail }))

export const R = {
  // ---------------------------------------------------------------- batch 1
  // a blush phone with a cream screen holding a heart wallpaper; a pearl phone charm
  smartphone: (icon, k) => [
    k.body(k.rr(6, 2.5, 18, 21.5, 2.8)),
    k.cream(k.rr(7.7, 5.2, 16.3, 17.4, 1.1), { ow: 0.5 }),
    k.fill(k.pill(10.4, 3.4, 13.6, 4.3), 'c2'),
    k.heart(12, 11.4, 4.6, 0, { mat: 'rose', plate: 'K' }),
    k.pearl(12, 19.5, 0.8, { plate: 'K' }),
    k.pearls('M17.4 4.2 Q20.8 4.2 20.6 7.6', 0.78, { step: 1.75 }),
    k.heart(20.6, 9.9, 4.4, 0),
  ],
  // a blush face with fine wine features, a hair bow on its crown
  smile: (icon, k) => [
    k.body(k.disc(12, 12.6, 9.1)),
    k.fill(k.union(k.ellipse(8.9, 10.6, 0.95, 1.2), k.ellipse(15.1, 10.6, 0.95, 1.2)), 'ink'),
    k.ink('M8.3 14.6 Q12 18.4 15.7 14.6', 1.15),
    k.bow(17.4, 4.9, 0.62, 22),
  ],
  // six plump satin arms with V branches and a heart at the centre
  snowflake: (icon, k) => {
    const arms = []
    for (let i = 0; i < 6; i++) {
      const a = i * 60
      const [x1, y1] = at(12, 3.3, a), [bx, by] = at(12, 7.2, a)
      const [l1x, l1y] = at(9.9, 5.2, a), [r1x, r1y] = at(14.1, 5.2, a)
      arms.push(k.seg(12, 12, x1, y1, 2.4), k.tube([[l1x, l1y], [bx, by], [r1x, r1y]], 2))
    }
    return [
      k.body(k.union(arms)),
      k.heart(12, 12.2, 4.4, 0, { plate: 'K' }),
    ]
  },
  // a blush sofa with a rose back, a heart cushion and a lace skirt; gold feet
  sofa: (icon, k) => [
    k.gold(k.union(k.seg(5.2, 18, 5.2, 20.4, 1.5), k.seg(18.8, 18, 18.8, 20.4, 1.5)), { plate: 'K' }),
    k.rose(k.rr(4.6, 5.4, 19.4, 13.6, 2.6), { plate: 'K' }),
    k.lace('M6.6 17.4 H17.4', 0.72),
    k.body(k.union(k.rr(5.4, 12.2, 18.6, 17.4, 1.6), k.rr(2.4, 9.8, 6.6, 18.4, 2), k.rr(17.4, 9.8, 21.6, 18.4, 2))),
    k.heart(12, 9.6, 4.4, 0),
  ],
  // a satin ribbon arrow (bow on its tail) beside three rose ribbons, longest first
  sort: (icon, k) => [
    k.body(k.union(k.tube('M7 5.6 V19.6', 2.8), k.tube('M3.6 16.2 L7 19.6 L10.4 16.2', 2.8))),
    k.rose(k.union(k.tube('M13.6 6 H20.6', 2.4), k.tube('M13.6 11.4 H18.6', 2.4), k.tube('M13.6 16.8 H16.6', 2.4)), { plate: 'A' }),
    k.bow(7, 4.6, 0.56, 0),
  ],
  // a blush bowl on a rose foot with a rose rim, a heart on its side, rose steam
  soup: (icon, k) => [
    k.rose(k.rr(8.8, 18.4, 15.2, 21.2, 1), { plate: 'K' }),
    k.body(k.path('M3.2 11.8 H20.8 C20.8 16.6 17 19.8 12 19.8 C7 19.8 3.2 16.6 3.2 11.8 Z')),
    k.rose(k.pill(2.4, 10.4, 21.6, 13), { plate: 'K' }),
    k.heart(12, 16.1, 4.4, 0, { plate: 'K' }),
    k.fill(k.tube('M8.4 8.4 C7.2 7.2 9.6 6 8.4 4.4 M12 8.4 C10.8 7.2 13.2 6 12 4.4 M15.6 8.4 C14.4 7.2 16.8 6 15.6 4.4', 1.25), 'c2', { plate: 'A' }),
  ],
  // a blush twinkle, a rose one and a pearl
  sparkles: (icon, k) => [
    k.body(twinkle(k, 10, 13.4, 8.6, 0.32, 0.45)),
    k.rose(twinkle(k, 18.4, 5.6, 4.2, 0.34, 0.3), { plate: 'A' }),
    k.pearl(18.6, 18.6, 1.15),
  ],
  // a blush cabinet, a gold-rimmed rose woofer with a pearl cap, a heart tweeter
  speaker: (icon, k) => [
    k.body(k.rr(5, 2.5, 19, 21.5, 2.8)),
    k.gold(k.disc(12, 14.6, 4.3), { plate: 'K' }),
    k.rose(k.disc(12, 14.6, 2.9), { plate: 'A' }),
    k.pearl(12, 14.6, 1, { plate: 'A' }),
    k.heart(12, 7.4, 4, 0, { plate: 'K' }),
  ],
  // a blush stem with two satin leaves, a bow tied round the stem, a rose mound
  sprout: (icon, k) => [
    k.rose(k.path('M6.4 21.4 C7 19 9.2 18.2 12 18.2 C14.8 18.2 17 19 17.6 21.4 Z'), { plate: 'K' }),
    k.body(k.union(
      k.tube('M12 19 V11.4', 2.2),
      k.path('M12 13.2 C9.4 13.8 5.4 12.9 4.2 8.2 C8.6 7.4 11.4 9.4 12 13.2 Z'),
      k.path('M12 11.2 C12.2 7 15 4.2 20 4.2 C20 8.6 16.8 11.4 12 11.2 Z'),
    )),
    k.ink('M11.2 12.4 Q8.6 10.4 6.4 9.4 M12.8 10.4 Q15.4 8 17.8 6.2', 0.65),
    k.bow(12, 15.8, 0.6, 0),
  ],
  // a blush tile with a ribbon-red minus, a bow on the corner
  'square-minus': (icon, k) => [
    k.body(k.rr(3.4, 3.4, 20.6, 20.6, 3.2)),
    k.satin(k.tube('M8 12 H16', 2.6), { plate: 'S' }),
    k.bow(19, 5, 0.62, 18),
  ],
  'square-plus': (icon, k) => [
    k.body(k.rr(3.4, 3.4, 20.6, 20.6, 3.2)),
    k.satin(k.tube('M8 12 H16 M12 8 V16', 2.6), { plate: 'S' }),
    k.bow(19, 5, 0.62, 18),
  ],
  'square-x': (icon, k) => [
    k.body(k.rr(3.4, 3.4, 20.6, 20.6, 3.2)),
    k.satin(k.tube('M8.8 8.8 L15.2 15.2 M15.2 8.8 L8.8 15.2', 2.6), { plate: 'S' }),
    k.bow(19, 5, 0.62, 18),
  ],
  // a blush tile on a lace doily
  square: (icon, k) => {
    const sq = k.rr(4, 4, 20, 20, 3)
    return [k.body(sq), k.bow(18.8, 5.2, 0.66, 18)]
  },
  // half blush, half cream: the satin star, a gold twinkle
  'star-half': (icon, k) => {
    const st = k.star(12, 12.9, 10.6, 5, 1.1)
    return [
      k.cream(k.inter(st, k.rect(11.95, 0, 24, 24))),
      k.body(k.inter(st, k.rect(0, 0, 12.05, 24))),
      k.sparkle(19.4, 4.2, 1.6),
    ]
  },
  // gold binaurals with pearl ear tips, a blush tube and a heart chest piece
  stethoscope: (icon, k) => [
    k.gold(k.tube('M5.4 3.8 V8.6 A4.1 4.1 0 0 0 13.6 8.6 V3.8', 1.8), { plate: 'K' }),
    k.body(k.tube('M9.5 12.6 V15.4 A4.3 4.3 0 0 0 18.1 15.4 V13.8', 2.3)),
    k.gold(k.disc(18.1, 11.4, 3.1), { plate: 'A' }),
    k.heart(18.1, 11.5, 4.1, 0, { plate: 'A' }),
    k.pearl(5.4, 3.4, 1, { plate: 'K' }),
    k.pearl(13.6, 3.4, 1, { plate: 'K' }),
  ],
  // a blush note with a rose folded corner and rose lines, pinned with a red heart
  'sticky-note': (icon, k) => [
    k.body(k.poly([[3.5, 3.6], [20.5, 3.6], [20.5, 14.6], [14.6, 20.5], [3.5, 20.5]], 2.2)),
    k.rose(k.poly([[14.6, 20.4], [14.6, 14.6], [20.4, 14.6]], 0.6), { plate: 'A' }),
    k.fill(k.tube('M7.6 9.8 H16.4 M7.6 13.4 H14.6 M7.6 17 H11', 1.2), 'c2'),
    k.heart(12, 4.4, 4.2, 0),
  ],
  // the stop square, a satin tile on a lace doily
  stop: (icon, k) => {
    const sq = k.rr(5, 5, 19, 19, 2.6)
    return [k.rose(sq, { plate: 'K' }), k.heart(12, 12.4, 6.4, 0, { plate: 'S' })]
  },
  // a boutique: a scalloped striped awning, blush walls, a cream window and a red door
  store: (icon, k) => {
    const awn = k.union(k.rr(3, 3.4, 21, 8.6, [1.6, 1.6, 0, 0]), [5.25, 9.75, 14.25, 18.75].map(x => k.disc(x, 8.4, 2.25)))
    const stripes = k.union(k.rect(7.5, 0, 12, 12), k.rect(16.5, 0, 21, 12))
    return [
      k.body(k.rr(4.6, 9, 19.4, 21, [0, 0, 2, 2])),
      k.cream(k.rr(6.6, 13, 11, 17.4, 1), { plate: 'A', ow: 0.5 }),
      k.satin(k.arch(13.2, 13.4, 17.4, 21), { plate: 'A' }),
      k.rose(awn, { plate: 'K' }),
      k.cream(k.inter(awn, stripes), { plate: 'K', ow: 0 }),
      k.pearl(16.4, 17.6, 0.55, { plate: 'A' }),
    ]
  },
  // a satin ribbon S struck through with a red band
  strikethrough: (icon, k) => [
    k.body(k.tube('M16.6 6.4 C15.6 4.8 14 4 12 4 C9.2 4 7.2 5.6 7.2 7.9 C7.2 10.4 9.6 11.2 12 12 C14.6 12.8 17 13.8 17 16.4 C17 18.8 14.8 20.2 12 20.2 C9.8 20.2 8 19.3 6.9 17.6', 2.7)),
    k.satin(k.tube('M3.4 12 H18.6', 2.1), { plate: 'S' }),
    k.heart(19.6, 12.2, 5, 0, { plate: 'S' }),
  ],
  // a satin X with a red 2 below
  subscript: (icon, k) => [
    k.body(k.tube('M3.8 5 L12.2 15.4 M12.2 5 L3.8 15.4', 2.8)),
    k.satin(k.tube('M15.4 15.6 C15.5 14.4 16.4 13.6 17.7 13.6 C19 13.6 19.9 14.4 19.9 15.5 C19.9 17.2 17.4 18.4 15.5 20.6 H20.3', 1.7), { plate: 'S' }),
  ],

  // ---------------------------------------------------------------- batch 2
  // half sun, half moon: a blush disc with a rose crescent, gold rays on the sun side, a twinkle
  'sun-moon': (icon, k) => {
    const rays = [120, 150, 180, 210, 240].map(a => { const c = Math.cos(a * D2R), s = Math.sin(a * D2R); return k.seg(12 + 7.4 * c, 12 + 7.4 * s, 12 + 9.4 * c, 12 + 9.4 * s, 1.9) })
    const d = k.disc(12, 12, 5.6)
    return [
      k.gold(k.union(rays), { plate: 'A' }),
      k.body(d),
      k.rose(k.cut(d, k.disc(9.4, 11.4, 5)), { plate: 'K', ow: 0.5 }),
      k.sparkle(19.2, 4.6, 1.8),
    ]
  },
  // a blush sun with gold rays and a ribbon-red heart at its heart
  sun: (icon, k) => {
    const rays = []
    for (let i = 0; i < 8; i++) { const a = i * 45 * D2R, c = Math.cos(a), s = Math.sin(a); rays.push(k.seg(12 + 7.4 * c, 12 + 7.4 * s, 12 + 9.5 * c, 12 + 9.5 * s, 2)) }
    return [k.gold(k.union(rays), { plate: 'A' }), k.body(k.disc(12, 12, 5.4)), k.heart(12, 12.2, 4, 0, { plate: 'K' })]
  },
  // a half sun on a rose horizon edged in lace, gold rays, a red ribbon arrow rising
  sunrise: (icon, k) => sunHalf(k, 'M12 10.4 V3.6', 'M9.6 6 L12 3.6 L14.4 6'),
  sunset: (icon, k) => sunHalf(k, 'M12 3.6 V10.2', 'M9.6 7.8 L12 10.2 L14.4 7.8'),
  // a satin X with a red 2 above
  superscript: (icon, k) => [
    k.body(k.tube('M3.8 9 L12.2 19.4 M12.2 9 L3.8 19.4', 2.8)),
    k.satin(k.tube('M15.4 5.6 C15.5 4.4 16.4 3.6 17.7 3.6 C19 3.6 19.9 4.4 19.9 5.5 C19.9 7.2 17.4 8.4 15.5 10.6 H20.3', 1.7), { plate: 'S' }),
  ],
  // two satin ribbons passing each other, the bow on the upper tail
  swap: (icon, k) => [
    k.rose(k.union(k.tube('M19.6 16.4 H5', 2.7), k.tube('M8.6 12.8 L5 16.4 L8.6 20', 2.7)), { plate: 'A' }),
    k.body(k.union(k.tube('M5 7.6 H19', 2.7), k.tube('M15.4 4 L19 7.6 L15.4 11.2', 2.7))),
    k.bow(4.6, 7.6, 0.58, 0),
  ],
  // a glass syringe filled with blush, a heart on the barrel, gold plunger and needle
  syringe: (icon, k) => {
    const A = 45
    return [
      k.gold(k.union(k.tube(rot([[12, 18], [12, 22.2]], A), 0.9), box4(k, 11.2, 2.8, 12.8, 6.4, 0.2, A), box4(k, 9.2, 2, 14.8, 3.6, 0.7, A)), { plate: 'A' }),
      k.rose(box4(k, 10.6, 16, 13.4, 18.6, 0.6, A), { plate: 'K' }),
      k.cream(box4(k, 8.8, 6.4, 15.2, 16.8, 1.3, A)),
      k.body(box4(k, 9.6, 10.4, 14.4, 16, 0.7, A), { ow: 0 }),
      k.fill(k.tube(rot([[8.8, 8.8], [10.6, 8.8], [8.8, 8.8]], A), 0.8), 'c2'),
      k.gold(box4(k, 7, 5.6, 17, 7.4, 0.8, A), { plate: 'K' }),
      k.heart(...at(12, 13.2, A), 3.6, 0, { plate: 'K' }),
    ]
  },
  // a cream sheet with a blush header row, rose grid lines, a bow on the corner
  table: (icon, k) => {
    const page = k.rr(3, 3.6, 21, 20.6, 2.6)
    return [
      k.cream(page),
      k.body(k.inter(page, k.rect(2, 2, 22, 8.8)), { ow: 0.5 }),
      k.fill(k.tube('M9 9.2 V19.8 M15 9.2 V19.8 M3.6 13.6 H20.4 M3.6 17 H20.4', 1.05), 'c2'),
      k.bow(19.4, 4.8, 0.62, 18),
    ]
  },
  // a blush tablet with a cream screen, a rose home bar, a bow on the corner
  tablet: (icon, k) => [
    k.body(k.rr(4.2, 2.5, 19.8, 21.5, 2.8)),
    k.cream(k.rr(6, 4.4, 18, 17.6, 1.1), { ow: 0.5 }),
    k.fill(k.pill(10.2, 18.9, 13.8, 20), 'c2'),
    k.heart(12, 10.8, 4.2, 0, { mat: 'rose', plate: 'K' }),
    k.bow(18.6, 4, 0.6, 18),
  ],
  // a blush price tag with a gold grommet, a gold string and a heart
  tag: (icon, k) => [
    k.body(k.cut(k.poly([[3, 3.2], [11.6, 3.2], [20.8, 12.4], [12.4, 20.8], [3.2, 11.6]], 1.8), k.disc(7.6, 7.6, 1.1))),
    k.gold(k.ring(7.6, 7.6, 1.5, 0.9), { plate: 'K' }),
    k.heart(13.2, 13.4, 5, -45, { plate: 'K' }),
    k.wire('M6.9 6.9 C5.4 5.2 3.4 4.4 2 5.2', 0.8, { plate: 'deco' }),
  ],
  // a blush target with a cream ring, a rose ring and a ribbon-red heart bullseye
  target: (icon, k) => [
    k.body(k.disc(12, 12, 9.4)),
    k.cream(k.disc(12, 12, 6.7), { ow: 0.5 }),
    k.rose(k.disc(12, 12, 4.2), { plate: 'K', ow: 0.5 }),
    k.heart(12, 12.3, 4, 0, { plate: 'S' }),
  ],
  // a blush cab with a rose cabin, cream windows, a red roof sign and pearl hubcaps
  taxi: (icon, k) => [
    k.satin(k.rr(9.6, 3.4, 14.4, 6.6, 1), { plate: 'A' }),
    k.rose(k.poly([[5.8, 11.6], [7.8, 6.2], [16.2, 6.2], [18.2, 11.6]], 1.2), { plate: 'K' }),
    k.cream(k.union(k.poly([[7.6, 11], [8.8, 7.6], [11.4, 7.6], [11.4, 11]], 0.5), k.poly([[12.6, 11], [12.6, 7.6], [15.2, 7.6], [16.4, 11]], 0.5)), { plate: 'K', ow: 0.45 }),
    k.body(k.rr(2.6, 10.6, 21.4, 17.8, 2.4)),
    k.fill(k.union(k.pill(3.6, 12.6, 5.6, 14), k.pill(18.4, 12.6, 20.4, 14)), 'c4'),
    k.rose(k.union(k.disc(7, 17.8, 2.5), k.disc(17, 17.8, 2.5)), { plate: 'A' }),
    k.pearl(7, 17.8, 0.95, { plate: 'A' }),
    k.pearl(17, 17.8, 0.95, { plate: 'A' }),
  ],
  // a blush telescope on a gold tripod, gazing at a twinkle
  telescope: (icon, k) => [
    k.gold(k.tube('M11.6 11 L7.4 20.8 M11.6 11 L15.8 20.8', 1.6), { plate: 'K' }),
    k.rose(k.tube('M3.8 14.6 L6.6 13.2', 2.4), { plate: 'A' }),
    k.body(k.tube('M6.4 13.2 L16 8', 4)),
    k.rose(k.tube('M15.8 8.2 L18.8 6.6', 5.2), { plate: 'K' }),
    k.gold(k.disc(11.6, 10.8, 1.3), { plate: 'K' }),
    k.sparkle(5, 4.6, 2.1),
  ],
  // a blush racket with cream strings, a rose grip, a pearl ball
  tennis: (icon, k) => {
    const head = k.ellipse(9.4, 9.4, 6.9, 5.9, -45), inner = k.ellipse(9.4, 9.4, 4.6, 3.6, -45)
    return [
      k.rose(k.seg(15.6, 15.6, 20.6, 20.6, 2.9), { plate: 'K' }),
      k.body(k.union(k.cut(head, inner), k.seg(13.4, 13.4, 16, 16, 2.4))),
      k.cream(inner, { ow: 0 }),
      k.fill(k.inter(k.tube('M3 9.4 L9.4 3 M5 11.4 L11.4 5 M7 13.4 L13.4 7 M5.4 5.4 L13.4 13.4 M3.4 7.4 L11.4 15.4 M7.4 3.4 L15.4 11.4', 0.8), inner), 'c2'),
      k.pearl(18.8, 5.2, 2.1, { plate: 'A' }),
    ]
  },
  // a blush tent with a cream doorway, a bow at the peak
  tent: (icon, k) => [
    k.rose(k.pill(1.8, 19.6, 22.2, 21.6), { plate: 'K' }),
    k.body(k.poly([[12, 3.6], [21.2, 20.2], [2.8, 20.2]], 1.3)),
    k.cream(k.poly([[12, 10.6], [15.8, 20.2], [8.2, 20.2]], 0.5), { plate: 'A', ow: 0.5 }),
    k.bow(12, 4.4, 0.66, 0),
  ],
  // a blush window with a rose title bar of three pearls, a red prompt and a rose cursor
  terminal: (icon, k) => {
    const w = k.rr(2.5, 3.8, 21.5, 20.2, 2.6)
    return [
      k.body(w),
      k.rose(k.inter(w, k.rect(0, 0, 24, 8.2)), { plate: 'K', ow: 0.5 }),
      [5.6, 8, 10.4].map(x => k.pearl(x, 6, 0.72, { plate: 'K' })),
      k.satin(k.tube('M6.6 11.2 L9.8 13.9 L6.6 16.6', 2.2), { plate: 'S' }),
      k.fill(k.tube('M12.4 16.8 H16.8', 1.9), 'c2', { plate: 'A' }),
    ]
  },
  // a cream input field open around a wine I-beam cursor, rose text, a little bow
  'text-cursor-input': (icon, k) => {
    const field = k.cut(k.rr(1.6, 6.4, 22.4, 17.6, 2.6), k.rect(11.8, 0, 17.6, 24))
    return [
      k.cream(field),
      k.fill(k.tube('M5.2 12 H9.2', 2.2), 'c2'),
      k.ink('M14.7 3.8 V20.2 M12.4 3.8 H17 M12.4 20.2 H17', 1.7, { plate: 'A' }),
      k.bow(3.6, 6.8, 0.46, -18),
    ]
  },
  // a blush thermometer with a ribbon-red column, rose ticks, a bow at its cap
  thermometer: (icon, k) => [
    k.body(k.union(k.pill(8.4, 2.6, 13.6, 16), k.disc(11, 17.6, 3.9))),
    k.satin(k.union(k.tube('M11 15.6 V8', 1.8), k.disc(11, 17.6, 2.4)), { plate: 'A' }),
    k.fill(k.tube('M16.2 5.4 H19.2 M16.2 9 H18.2 M16.2 12.6 H19.2', 1.3), 'c2'),
    k.bow(11, 2.8, 0.55, 0),
  ],
  'thumbs-up': (icon, k) => thumb(k),
  'thumbs-down': (icon, k) => flipY(k, thumb(k), 12),

  // ---------------------------------------------------------------- batch 3
  // a blush ticket with notched sides, a rose perforation and a heart on the stub
  ticket: (icon, k) => [
    k.body(k.cut(k.rr(2.4, 5.6, 21.6, 18.4, 2.2), k.disc(2.4, 12, 2.1), k.disc(21.6, 12, 2.1))),
    k.fill(k.union([7.6, 10, 12.4, 14.8, 17.2].map(y => k.disc(15.6, y - 0.4, 0.62))), 'c2'),
    k.heart(9, 12.2, 5, -8, { plate: 'S' }),
  ],
  // a blush stopwatch with a gold crown, a cream face, a red hand and a pearl hub
  timer: (icon, k) => [
    k.gold(k.union(k.rr(9.8, 2.2, 14.2, 4.2, 1), k.rect(11.2, 3.6, 12.8, 6)), { plate: 'A' }),
    k.gold(k.seg(17.6, 6.8, 18.8, 5.6, 2), { plate: 'A' }),
    k.body(k.disc(12, 13.6, 8)),
    k.cream(k.disc(12, 13.6, 5.9), { ow: 0.5 }),
    k.fill(k.union(k.disc(12, 9.2, 0.6), k.disc(16.4, 13.6, 0.6), k.disc(12, 18, 0.6), k.disc(7.6, 13.6, 0.6)), 'c2'),
    k.satin(k.tube('M12 13.6 L14.8 10.8', 1.6), { plate: 'A' }),
    k.pearl(12, 13.6, 1, { plate: 'A' }),
  ],
  // a blush track with a pearl knob and a rose heart
  toggle: (icon, k) => [
    k.body(k.pill(2.2, 6, 21.8, 18)),
    k.heart(7.8, 12.2, 4, 0, { mat: 'rose', plate: 'K' }),
    k.pearl(15.8, 12, 4.3, { plate: 'A' }),
  ],
  // a blush toilet with a rose seat, a gold flush lever and a heart on the tank
  toilet: (icon, k) => [
    k.body(k.rr(4.6, 2.6, 11.2, 11.6, 1.6)),
    k.body(k.path('M4 11.4 H20 C20 15.2 17.4 17.4 14.2 17.8 L14.8 21.2 H8.2 L8.8 17.6 C5.8 16.8 4 14.6 4 11.4 Z')),
    k.rose(k.pill(3.2, 10.2, 20.8, 12.8), { plate: 'A' }),
    k.gold(k.pill(6.4, 4.4, 9.2, 5.6), { plate: 'A' }),
    k.heart(7.9, 8, 3.6, 0, { plate: 'K' }),
  ],
  // a cream tooth with satin light and a gold twinkle of clean
  tooth: (icon, k) => [
    k.cream(k.path('M7.4 3.2 C5 3.2 3.6 5 3.6 7.6 C3.6 10.4 5 12.2 5.6 14.6 C6.2 17 6.4 20.8 8.4 20.8 C10 20.8 10.2 15.6 12 15.6 C13.8 15.6 14 20.8 15.6 20.8 C17.6 20.8 17.8 17 18.4 14.6 C19 12.2 20.4 10.4 20.4 7.6 C20.4 5 19 3.2 16.6 3.2 C14.8 3.2 13.8 4.2 12 4.2 C10.2 4.2 9.2 3.2 7.4 3.2 Z')),
    k.heart(12, 9.4, 4.4, 0, { mat: 'rose', plate: 'K' }),
    k.sparkle(20.6, 18.4, 1.9),
  ],
  // a blush cone with cream stripes on a rose base, a bow on the tip
  'traffic-cone': (icon, k) => {
    const cone = k.poly([[10.4, 3], [13.6, 3], [18, 18.8], [6, 18.8]], 1)
    return [
      k.body(cone),
      k.cream(k.inter(cone, k.union(k.rect(0, 7.6, 24, 10.2), k.rect(0, 13, 24, 15.6))), { ow: 0 }),
      k.rose(k.rr(3, 18, 21, 21, 1.2), { plate: 'K' }),
      k.bow(12, 3.6, 0.6, 0),
    ]
  },
  // a blush tram front, a cream window, pearl headlights, a heart emblem, gold rails
  train: (icon, k) => [
    k.gold(k.tube('M8.4 18 L5.8 21.4 M15.6 18 L18.2 21.4', 1.6), { plate: 'A' }),
    k.body(k.rr(5, 2.6, 19, 18.2, 3.4)),
    k.cream(k.rr(7, 5, 17, 10.8, 1.3), { plate: 'A', ow: 0.5 }),
    k.ink('M12 5.4 V10.4', 0.8),
    k.pearl(8.4, 14.6, 1.1, { plate: 'K' }),
    k.pearl(15.6, 14.6, 1.1, { plate: 'K' }),
    k.heart(12, 14.8, 3.4, 0, { plate: 'S' }),
  ],
  // a three-tier blush pine on a rose trunk, swagged with pearls
  'tree-pine': (icon, k) => [
    k.rose(k.rr(10.4, 16.6, 13.6, 21.4, 0.8), { plate: 'K' }),
    k.body(k.union(
      k.poly([[12, 2.4], [16.6, 8.8], [7.4, 8.8]], 1),
      k.poly([[12, 5.6], [18.6, 13.6], [5.4, 13.6]], 1.1),
      k.poly([[12, 9.4], [20.4, 18], [3.6, 18]], 1.2),
    )),
    k.pearls('M8.2 12.2 Q12.4 15.4 16 11.6', 0.62),
  ],
  // satin ribbon trend lines with the bow on the tail
  'trending-up': (icon, k) => [
    k.body(k.union(k.tube('M3.6 17 L9.2 11.2 L13.2 15.2 L20.2 8', 2.7), k.tube('M15.2 7.6 H20.4 V12.8', 2.7))),
    k.bow(3.8, 16.8, 0.56, -45),
  ],
  'trending-down': (icon, k) => [
    k.body(k.union(k.tube('M3.6 7 L9.2 12.8 L13.2 8.8 L20.2 16', 2.7), k.tube('M15.2 16.4 H20.4 V11.2', 2.7))),
    k.bow(3.8, 7.2, 0.56, 45),
  ],
  // a plain blush rounded triangle with a single pearl at its apex
  triangle: (icon, k) => [
    k.body(k.poly([[12, 2.6], [21.8, 20], [2.2, 20]], 2.2)),
    k.pearl(12, 5.2, 1.2, { plate: 'K' }),
  ],
  // a blush cup with gold handles on a rose stem and base, a heart on the cup
  trophy: (icon, k) => [
    k.gold(k.tube('M6.6 5.4 H4.6 A2.6 2.6 0 0 0 7.2 10.8 M17.4 5.4 H19.4 A2.6 2.6 0 0 1 16.8 10.8', 1.7), { plate: 'A' }),
    k.rose(k.union(k.rect(10.7, 14, 13.3, 17.6), k.rr(7, 17, 17, 21, 1.3)), { plate: 'K' }),
    k.body(k.path('M6.2 3.2 H17.8 V8.6 A5.8 5.8 0 0 1 6.2 8.6 Z')),
    k.heart(12, 8.4, 4.6, 0, { plate: 'K' }),
    k.sparkle(20.2, 16.6, 1.6),
  ],
  // a gift delivery: a blush box wrapped in red ribbon and bow, a rose cab, pearl hubs
  truck: (icon, k) => [
    k.rose(k.poly([[13.6, 8.6], [18.2, 8.6], [21.6, 12.6], [21.6, 17.2], [13.6, 17.2]], 1.2), { plate: 'K' }),
    k.cream(k.poly([[15.4, 10.2], [17.6, 10.2], [19.6, 12.6], [15.4, 12.6]], 0.4), { plate: 'K', ow: 0.45 }),
    k.body(k.rr(2.2, 5.6, 14.4, 17.2, 1.8)),
    k.ribbon('M8.3 5.8 V17', 1.9, { plate: 'K' }),
    k.rose(k.union(k.disc(6.4, 17.6, 2.4), k.disc(17.4, 17.6, 2.4)), { plate: 'A' }),
    k.pearl(6.4, 17.6, 0.9, { plate: 'A' }),
    k.pearl(17.4, 17.6, 0.9, { plate: 'A' }),
    k.bow(8.3, 5.4, 0.62, 0, { plate: 'K' }),
  ],
  // a turtle in a blush shell hemmed with lace, a rose head and feet, a heart on the shell
  turtle: (icon, k) => [
    k.rose(k.union(k.pill(5.4, 14, 8.8, 19.4), k.pill(14.2, 14, 17.6, 19.4), k.disc(19.8, 12.4, 2.4), k.seg(17.6, 13.4, 19.2, 12.8, 2)), { plate: 'A' }),
    k.lace('M4.6 15.6 H18.4', 0.68),
    k.body(k.path('M3.4 15.2 C3.4 9.4 7.2 5.6 11.5 5.6 C15.8 5.6 19.6 9.4 19.6 15.2 Z')),
    k.heart(11.5, 11.2, 4.6, 0, { mat: 'rose', plate: 'K' }),
    k.fill(k.disc(20.6, 11.8, 0.45), 'ink', { plate: 'A' }),
  ],
  // a blush television, a cream screen with a heart, a gold antenna tipped with pearls
  tv: (icon, k) => [
    k.gold(k.tube('M8.2 3.4 L12 7.2 L15.8 3.4', 1.4), { plate: 'A' }),
    k.body(k.rr(2.4, 7, 21.6, 20.6, 2.8)),
    k.cream(k.rr(4.4, 9, 19.6, 18.6, 1.4), { ow: 0.5 }),
    k.heart(12, 14, 4.6, 0, { mat: 'rose', plate: 'K' }),
    k.pearl(8, 3.2, 0.95, { plate: 'A' }),
    k.pearl(16, 3.2, 0.95, { plate: 'A' }),
  ],
  // a serif satin T with a red heart beside it
  type: (icon, k) => [
    k.body(k.tube('M5 7.2 V4.8 H19 V7.2 M12 4.8 V19.6 M9.2 19.6 H14.8', 2.7)),
    k.bow(12, 8.4, 0.5, 0, { plate: 'K' }),
  ],
  // a blush parasol with a lace hem, a rose middle panel, a gold crook handle, a pearl tip
  umbrella: (icon, k) => {
    const can = k.path('M2.4 12.6 C2.4 7.2 6.6 3.4 12 3.4 C17.4 3.4 21.6 7.2 21.6 12.6 Z')
    return [
      k.gold(k.tube('M12 12 V18.6 A1.9 1.9 0 0 1 8.2 18.6', 1.8), { plate: 'A' }),
      k.lace('M3.2 12.8 H20.8', 0.78, { step: 1.85 }),
      k.body(can),
      k.rose(k.inter(can, k.ellipse(12, 12.6, 3.2, 9.4)), { plate: 'K', ow: 0.5 }),
      k.pearl(12, 2.8, 0.85, { plate: 'K' }),
    ]
  },
  // a satin U above a ribbon-red underline
  underline: (icon, k) => [
    k.body(k.tube('M7 3.6 V10.4 A5 5 0 0 0 17 10.4 V3.6', 2.7)),
    k.satin(k.tube('M4.6 20.2 H17.6', 2.3), { plate: 'S' }),
    k.heart(18.6, 20.1, 4.8, 0, { plate: 'S' }),
  ],
  // a satin ribbon turning back, the bow on its tail
  undo: (icon, k) => [
    k.body(k.union(k.tube('M8.4 4.4 L4.2 8.6 L8.4 12.8', 2.8), k.tube('M4.6 8.6 H14 A5.6 5.6 0 0 1 14 19.8 H11', 2.8))),
    k.bow(10.4, 19.8, 0.56, 0),
  ],
  // two blush link halves parted, rose break marks, a little heart in the gap
  unlink: (icon, k) => [
    k.body(k.union(k.tube('M13.8 6 L15.4 4.4 A3 3 0 0 1 19.6 8.6 L18 10.2', 2.5), k.tube('M10.2 18 L8.6 19.6 A3 3 0 0 1 4.4 15.4 L6 13.8', 2.5))),
    k.fill(k.tube('M8.6 3.4 V5.6 M3.4 8.6 H5.6 M15.4 18.4 V20.6 M18.4 15.4 H20.6', 1.3), 'c2'),
    k.heart(12, 12.2, 4.4, -10),
  ],

  // ---------------------------------------------------------------- batch 4
  // the locket, opened: the gold shackle lifted free, a red heart keyhole, a little bow
  unlock: (icon, k) => [
    k.gold(k.tube('M7.8 11 V7 A4.2 4.2 0 0 1 16 5.6', 2.4), { plate: 'A' }),
    k.body(k.rr(4.4, 10.2, 19.6, 21.2, 3)),
    k.heart(12, 15.6, 5.6, 0, { plate: 'K' }),
    k.bow(7.8, 7.8, 0.55, -20),
  ],
  // a ribbon arrow rising out of a rose tray, the bow on its tail
  upload: (icon, k) => [
    k.rose(k.tube('M3.6 14.4 V18 A2.4 2.4 0 0 0 6 20.4 H18 A2.4 2.4 0 0 0 20.4 18 V14.4', 2.6), { plate: 'K' }),
    k.body(k.union(k.tube('M12 15.6 V4.4', 2.8), k.tube('M7.2 9 L12 4.2 L16.8 9', 2.8)), { plate: 'A' }),
    k.bow(12, 15.4, 0.55, 0),
  ],
  // the USB trident in rose satin: a gold plug head, pearl nodes and a gold square
  usb: (icon, k) => [
    k.rose(k.union(
      k.tube('M12 18 V5.6', 2.3),
      k.tube('M12 15.6 L5.6 12.2 V10.6', 2.1),
      k.tube('M12 13.8 L18.4 11.4 V10.2', 2.1),
    ), { plate: 'K' }),
    k.gold(k.poly([[12, 1.6], [15.4, 6.6], [8.6, 6.6]], 0.7), { plate: 'K' }),
    k.gold(k.rr(16.2, 6.2, 20.6, 10.6, 0.8), { plate: 'A' }),
    k.pearl(5.6, 9, 2.1, { plate: 'A' }),
    k.pearl(12, 19.6, 2.5, { plate: 'K' }),
  ],
  'user-check': (icon, k) => person(k, k.tube('M15.8 16.6 L17.6 18.4 L20.6 15', 1.5)),
  'user-minus': (icon, k) => person(k, k.tube('M15.6 16.8 H20.8', 1.5)),
  'user-plus': (icon, k) => person(k, k.tube('M15.6 16.8 H20.8 M18.2 14.2 V19.4', 1.5)),
  'user-x': (icon, k) => person(k, k.tube('M16.4 15 L20 18.6 M20 15 L16.4 18.6', 1.5)),
  // the person with a ribbon-red badge carrying a lace-white gear
  'user-cog': (icon, k) => {
    const spokes = [0, 60, 120, 180, 240, 300].map(a => { const [x0, y0] = at(18.2, 14.6, a, 18.2, 16.8), [x1, y1] = at(18.2, 13.9, a, 18.2, 16.8); return k.seg(x0, y0, x1, y1, 1.2) })
    return person(k, k.union(k.ring(18.2, 16.8, 1.55, 1.2), spokes))
  },
  // the person with a gold pencil
  'user-pen': (icon, k) => {
    const A = 45, c = [18, 16.6]
    const pen = box4(k, 16.8, 11.4, 19.2, 20.4, 0.5, A, ...c)
    return [
      personBase(k, k.grow(pen, 0.4)),
      k.satin(box4(k, 16.8, 11.2, 19.2, 13.2, 0.6, A, ...c), { plate: 'S' }),
      k.gold(box4(k, 16.8, 13, 19.2, 19, 0.3, A, ...c), { plate: 'S' }),
      k.cream(k.poly(rot([[16.8, 19], [19.2, 19], [18, 21.8]], A, ...c), 0.3), { plate: 'S' }),
    ]
  },
  // the person with a gold-rimmed lens
  'user-search': (icon, k) => [
    personBase(k, k.disc(17.4, 16, 4.6)),
    k.rose(k.seg(19.4, 18, 21.4, 20, 2.2), { plate: 'S' }),
    k.gold(k.ring(17.4, 16, 3, 1.6), { plate: 'S' }),
    k.cream(k.disc(17.4, 16, 2.25), { plate: 'S', ow: 0 }),
  ],
  // a cream portrait medallion holding the person
  'user-circle': (icon, k) => {
    const c = k.disc(12, 12, 9.6), inner = k.inset(c, 0.3)
    return [
      k.cream(c),
      k.body(k.inter(k.path('M5 22 C5 17.4 8.2 14.6 12 14.6 C15.8 14.6 19 17.4 19 22 Z'), inner), { ow: 0.55 }),
      k.pearls('M8.8 16 Q12 19 15.2 16', 0.66),
      k.body(k.disc(12, 9.4, 3.6)),
      k.bow(15.2, 6.2, 0.52, 22),
    ]
  },
  // two people: a rose friend behind, the blush one in front with her bow and pearls
  users: (icon, k) => [
    k.rose(k.union(k.path('M12.6 19.6 C13 15.8 15.2 13.6 17.8 13.6 C20.6 13.6 22.2 16 22.2 19.6 Z'), k.disc(16.8, 8.4, 3.4)), { plate: 'A' }),
    k.body(k.path('M2 21 C2 16.8 5.2 14.2 9 14.2 C12.8 14.2 16 16.8 16 21 Z')),
    k.pearls('M5.8 16.4 Q9 19.4 12.2 16.4', 0.7),
    k.body(k.disc(9, 8.8, 4)),
    k.bow(5.6, 5.2, 0.56, -22),
  ],
  // a blush-handled fork and knife with gold heads, a bow tied on the fork
  utensils: (icon, k) => [
    k.gold(k.union(k.tube('M5.2 3 V8.2 M8 3 V11.6 M10.8 3 V8.2', 1.5), k.tube('M5.2 8 A2.8 2.8 0 0 0 10.8 8', 1.5)), { plate: 'K' }),
    k.gold(k.path('M15 13.4 V3.6 C17.8 4.4 19.6 7.4 19.6 11 V13.4 Z'), { plate: 'K' }),
    k.body(k.union(k.pill(6.6, 11, 9.4, 21.4), k.pill(15, 12.4, 18.2, 21.4))),
    k.bow(8, 11.6, 0.55, 0),
  ],
  // a blush video camera, a rose hood, a heart on its side, a pearl recording light
  'video-camera': (icon, k) => videoCam(k, [k.heart(9, 12.4, 5, 0, { plate: 'K' }), k.pearl(4.6, 8.2, 0.75, { plate: 'K' })]),
  // the video camera, its screen showing the person
  'video-call': (icon, k) => videoCam(k, [
    k.cream(k.rr(4.2, 7.8, 13.8, 16.2, 1.2), { ow: 0.5 }),
    k.body(k.inter(k.union(k.path('M5.6 16.4 C5.6 13.8 7 12.4 9 12.4 C11 12.4 12.4 13.8 12.4 16.4 Z'), k.disc(9, 10.2, 1.8)), k.rr(4.4, 8, 13.6, 16, 1.2)), { ow: 0.45 }),
    k.bow(10.6, 8.6, 0.38, 22),
  ]),
  // the video camera struck through with a red satin slash
  'video-off': (icon, k) => {
    const sl = k.seg(3.4, 3.4, 20.6, 20.6, 2)
    return [videoCam(k, [], k.grow(sl, 0.7)), k.satin(sl, { plate: 'S' })]
  },
  // a blush volleyball with fine wine seams and a bow on top
  volleyball: (icon, k) => [
    k.body(k.disc(12, 12, 9.4)),
    k.ink(k.inter(k.tube('M12 12 A9.5 9.5 0 0 0 20.23 7.25 M12 12 A9.5 9.5 0 0 0 12 21.5 M12 12 A9.5 9.5 0 0 0 3.77 7.25 M21.5 12.09 A13.5 13.5 0 0 1 10.76 15.94 M7.17 20.18 A13.5 13.5 0 0 1 9.2 8.96 M7.33 3.73 A13.5 13.5 0 0 1 16.03 11.1', 0.9), k.inset(k.disc(12, 12, 9.4), 0.3))),
    k.bow(18.4, 4.6, 0.58, 22),
  ],
  // a blush loudspeaker with a lace-frilled mouth and rose sound waves
  volume: (icon, k) => speaker(k, k.rose(k.tube('M15.4 9.4 A3.6 3.6 0 0 1 15.4 14.6 M18.2 6.6 A7.4 7.4 0 0 1 18.2 17.4', 2.1), { plate: 'A' })),
  'volume-1': (icon, k) => speaker(k, k.rose(k.tube('M15.4 9.2 A3.8 3.8 0 0 1 15.4 14.8', 2.1), { plate: 'A' })),
  'volume-off': (icon, k) => speaker(k, k.satin(k.tube('M15.4 9.6 L20.2 14.4 M20.2 9.6 L15.4 14.4', 2.1), { plate: 'S' })),

  // ---------------------------------------------------------------- batch 5
  // a blush wallet over a rose back, a ribbon-red clasp with a pearl snap
  wallet: (icon, k) => [
    k.rose(k.rr(3.4, 3.6, 17.4, 10, 1.8), { plate: 'K' }),
    k.body(k.rr(2.6, 7.4, 21.4, 20.6, 2.4)),
    k.satin(k.rr(15.6, 11.4, 21.8, 16.8, [2.4, 0.8, 0.8, 2.4]), { plate: 'A' }),
    k.pearl(18.2, 14.1, 1, { plate: 'A' }),
  ],
  // a fairy wand: a blush stick with a ribbon-red heart topper, a bow at its neck, a twinkle
  wand: (icon, k) => [
    k.body(k.seg(3.6, 20.4, 12.4, 11.6, 2.8)),
    k.satin(k.heartShape(15.2, 8.8, 9, 45), { plate: 'K' }),
    k.bow(10, 14, 0.52, 45),
    k.sparkle(5.6, 5.6, 2.1),
    k.sparkle(19.6, 17.4, 1.4),
  ],
  // a blush warehouse with a rose roller door and a heart on the gable
  warehouse: (icon, k) => [
    k.body(k.poly([[2.8, 21], [2.8, 9], [12, 3.8], [21.2, 9], [21.2, 21]], 1.2)),
    k.rose(k.rr(6.8, 12.4, 17.2, 21, [1.2, 1.2, 0, 0]), { plate: 'A' }),
    k.ink('M7.4 15.4 H16.6 M7.4 18.2 H16.6', 0.8),
    k.heart(12, 8.8, 3.6, 0, { plate: 'K' }),
  ],
  // a blush machine, a rose control panel with pearl knobs, a gold porthole with a heart
  'washing-machine': (icon, k) => {
    const b = k.rr(4, 2.5, 20, 21.5, 2.4)
    return [
      k.body(b),
      k.rose(k.inter(b, k.rect(0, 0, 24, 6.6)), { plate: 'K', ow: 0.5 }),
      k.pearl(7.2, 4.6, 0.8, { plate: 'K' }),
      k.pearl(9.9, 4.6, 0.8, { plate: 'K' }),
      k.gold(k.disc(12, 14.4, 4.7), { plate: 'K' }),
      k.cream(k.disc(12, 14.4, 3.4), { plate: 'A', ow: 0 }),
      k.heart(12, 14.6, 3.8, 0, { mat: 'rose', plate: 'A' }),
    ]
  },
  // a blush watch on rose straps, its cream face ringed in pearls, red hands
  watch: (icon, k) => [
    k.rose(k.union(k.rr(8.2, 2.2, 15.8, 7, 1.4), k.rr(8.2, 17, 15.8, 21.8, 1.4)), { plate: 'K' }),
    k.gold(k.rr(18.4, 10.6, 20.2, 13.4, 0.6), { plate: 'K' }),
    k.body(k.disc(12, 12, 7.2)),
    k.cream(k.disc(12, 12, 4.9), { ow: 0.5 }),
    k.gold(k.ring(12, 12, 6.05, 1.05), { plate: 'K' }),
    [0, 90, 180, 270].map(a => k.pearl(...at(12, 5.95, a), 0.72, { plate: 'K' })),
    k.satin(k.tube('M12 9.2 V12 L13.8 13.2', 1.3), { plate: 'A' }),
  ],
  // a blush webcam with a gold-rimmed rose lens, a rose stand, a bow on top
  webcam: (icon, k) => [
    k.rose(k.union(k.tube('M12 16.6 V20.4', 2), k.pill(7.4, 19.4, 16.6, 21.8)), { plate: 'K' }),
    k.body(k.disc(12, 10, 7.4)),
    k.gold(k.disc(12, 10, 3.7), { plate: 'A' }),
    k.rose(k.disc(12, 10, 2.4), { plate: 'A', ow: 0 }),
    k.pearl(12, 10, 0.7, { plate: 'A' }),
    k.bow(16.8, 4.4, 0.56, 22),
  ],
  // three blush satin curls joined by pearls
  webhook: (icon, k) => [
    k.body(k.tube('M12 7.5 L13.95 10.88 A3.75 3.75 0 0 0 17.2 12.75 A3.75 3.75 0 0 1 20.95 16.5 A3.75 3.75 0 0 1 17.2 20.25 M17.2 16.5 L13.3 16.5 A3.75 3.75 0 0 0 10.05 18.38 A3.75 3.75 0 0 1 4.93 19.75 A3.75 3.75 0 0 1 3.56 14.63 M6.8 16.5 L8.75 13.13 A3.75 3.75 0 0 0 8.75 9.38 A3.75 3.75 0 0 1 10.13 4.25 A3.75 3.75 0 0 1 15.25 5.63', 2.4)),
    k.pearl(12, 7.5, 1.5, { plate: 'A' }),
    k.pearl(17.2, 16.5, 1.5, { plate: 'A' }),
    k.pearl(6.8, 16.5, 1.5, { plate: 'A' }),
  ],
  // satin arcs radiating from a ribbon-red heart
  wifi: (icon, k) => wifiParts(k),
  'wifi-off': (icon, k) => {
    const sl = k.seg(3.4, 3.4, 20.6, 20.6, 2)
    return [wifiParts(k, k.grow(sl, 0.7)), k.satin(sl, { plate: 'S' })]
  },
  // blush and rose wind curls, a heart carried on the breeze
  wind: (icon, k) => [
    k.rose(k.tube('M3 8 H9 A2.75 2.75 0 1 0 6.62 3.87 M3 16 H13.5 A2.75 2.75 0 1 1 11.12 20.13', 2.3), { plate: 'A' }),
    k.body(k.tube('M4 12 H18 A3 3 0 1 0 15.4 7.5', 2.5)),
    k.heart(3.4, 12.1, 4.8, 0, { plate: 'K' }),
  ],
  // a cream crystal glass of blush wine, a bow tied round the stem
  wine: (icon, k) => {
    const bowl = k.path('M6.5 2.5 H17.5 C18.5 6 18.5 8.5 17 11 C15.75 13 14 14 12 14 C10 14 8.25 13 7 11 C5.5 8.5 5.5 6 6.5 2.5 Z')
    return [
      k.cream(k.union(k.tube('M12 13.6 V21', 1.9), k.pill(7.4, 20, 16.6, 22.2))),
      k.cream(bowl),
      k.body(k.inter(k.inset(bowl, 0.45), k.rect(0, 7, 24, 24)), { ow: 0 }),
      k.bow(12, 16.8, 0.58, 0),
    ]
  },
  // blush text lines, a rose ribbon wrapping round with a little bow on its tail
  'wrap-text': (icon, k) => [
    k.body(k.tube('M3.4 5 H18 M3.4 19 H8', 2.4)),
    k.rose(k.union(k.tube('M3.4 12 H17.4 A3.5 3.5 0 0 1 17.4 19 H12.4', 2.4), k.tube('M14.8 16.4 L12.2 19 L14.8 21.6', 2.4)), { plate: 'A' }),
    k.heart(19.2, 5.1, 4.8, 0, { plate: 'K' }),
  ],
  // a blush wrench with a bow tied on the handle
  wrench: (icon, k) => [
    k.body(k.path('M6.87 20.32 L11.55 15.64 A1.5 1.5 0 0 1 13.02 15.26 A6.25 6.25 0 0 0 20.88 8.02 L15.75 10.98 A2 2 0 0 1 13.75 7.52 L18.88 4.56 A6.25 6.25 0 0 0 8.74 10.98 A1.5 1.5 0 0 1 8.36 12.45 L3.68 17.13 A2.25 2.25 0 0 0 6.87 20.32 Z')),
    k.pearl(5.3, 18.7, 0.75, { plate: 'K' }),
    k.bow(9.4, 14.6, 0.55, 45),
  ],
  // a blush disc with a ribbon-red X, a bow on the rim
  'x-circle': (icon, k) => [
    k.body(k.disc(12, 12, 9.4)),
    k.satin(k.tube('M8.8 8.8 L15.2 15.2 M15.2 8.8 L8.8 15.2', 2.6), { plate: 'S' }),
    k.bow(18.4, 5, 0.62, 22),
  ],
  // a full-size blush satin bolt shaded ribbon-red on its lower blade, a twinkle on its tip
  zap: (icon, k) => {
    const bolt = k.poly([[13.9, 1.4], [3.6, 14.6], [10.5, 14.6], [9.9, 22.6], [20.4, 9.4], [13.6, 9.4]], 1)
    return [
      k.body(bolt),
      k.satin(k.inter(k.inset(bolt, 0.9), k.poly([[11.4, 13.2], [20.4, 9.4], [9.9, 22.6], [9.9, 14.6]], 0)), { plate: 'K', ow: 0 }),
      k.sparkle(14.6, 2.6, 2.2),
    ]
  },
  'zoom-in': (icon, k) => lens(k, k.tube('M7.6 10.2 H12.8 M10.2 7.6 V12.8', 1.9)),
  'zoom-out': (icon, k) => lens(k, k.tube('M7.6 10.2 H12.8', 1.9)),
  // @@END@@
}

// wifi arcs around a heart; `hole` (a slash moat) is cut from the arcs
function wifiParts(k, hole = null) {
  const c = f => (hole ? k.cut(f, hole) : f)
  const arc = r => { const a0 = -135 * D2R, a1 = -45 * D2R; return `M${12 + r * Math.cos(a0)} ${18.4 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${12 + r * Math.cos(a1)} ${18.4 + r * Math.sin(a1)}` }
  return [
    k.body(c(k.tube(`${arc(4.9)} ${arc(9.1)} ${arc(13.3)}`, 2.5))),
    k.heart(12, 18.6, 4.4, 0, { plate: 'K' }),
  ]
}
// the search family (exemplar build): rose handle, gold ring, blush glass, a bow at the neck, a red glyph
function lens(k, glyph) {
  return [
    k.rose(k.seg(15.2, 15.2, 20, 20, 3.1), { plate: 'A' }),
    k.gold(k.ring(10.2, 10.2, 6.3, 2.3), { plate: 'K' }),
    k.body(k.disc(10.2, 10.2, 5.25), { plate: 'K', ow: 0 }),
    k.satin(glyph, { plate: 'S' }),
    k.bow(15.4, 15.4, 0.56, -45),
  ]
}

// sunrise / sunset: half sun on a lace-edged horizon, gold rays, a red ribbon arrow
function sunHalf(k, shaft, head) {
  const rays = [195, 230, 310, 345].map(a => { const c = Math.cos(a * D2R), s = Math.sin(a * D2R); return k.seg(12 + 7.2 * c, 17.2 + 7.2 * s, 12 + 9.2 * c, 17.2 + 9.2 * s, 1.9) })
  return [
    k.gold(k.union(rays), { plate: 'A' }),
    k.body(k.inter(k.disc(12, 17.4, 5.4), k.rect(0, 0, 24, 17.4))),
    k.lace('M4.2 19.6 H19.8', 0.72, { step: 1.75 }),
    k.rose(k.pill(2.4, 16.6, 21.6, 19.2), { plate: 'K' }),
    k.satin(k.union(k.tube(shaft, 2.1), k.tube(head, 2.1)), { plate: 'S' }),
  ]
}
// a blush thumbs-up hand with a lace frill at a rose cuff
const THUMB = k => k.path('M7.4 10.8 L11 4.4 C11.6 3.2 13.6 3.3 14 4.8 C14.3 6 13.9 8 13.5 9.8 H18.6 C20 9.8 21 11.1 20.7 12.5 L19.3 18.6 C19 19.9 17.9 20.8 16.6 20.8 H7.4 Z')
function thumb(k) {
  return [
    k.body(THUMB(k)),
    k.ink(k.inter(k.tube('M15.2 13.4 H21 M14.8 16.8 H21', 0.8), k.inset(THUMB(k), 0.5))),
    k.lace('M7.6 10.4 V21', 0.72, { eyelets: false, plate: 'A' }),
    k.rose(k.rr(2.8, 9.8, 7.4, 21.2, 1.4), { plate: 'A' }),
  ]
}

// the people family, shifted left to make room for a badge: blush shoulders, a pearl
// necklace, a blush head and a hair bow (on the left, away from the badge). `hole` is
// cut from the person (the badge's moat).
function personBase(k, hole) {
  const H = hole ? k.grow(hole, 0.75) : null
  const c = f => (H ? k.cut(f, H) : f)
  return [
    k.body(c(k.path('M2.6 21 C2.6 16.6 5.8 14 9.6 14 C13.4 14 16.6 16.6 16.6 21 Z'))),
    k.pearls('M6.4 16.2 Q9.6 19.2 12.8 16.2', 0.74, { step: 1.9 }),
    k.body(c(k.disc(9.6, 8.4, 4.1))),
    k.bow(6, 4.9, 0.56, -22),
  ]
}
// the person with a ribbon-red badge carrying a lace-white glyph
function person(k, glyph) {
  const b = k.disc(18.2, 16.8, 4.3)
  return [personBase(k, b), k.satin(b, { plate: 'S' }), k.fill(glyph, 'edge', { plate: 'S' })]
}
// the video camera: a blush body and a rose hood, extras on top; `hole` cut from it
function videoCam(k, extra = [], hole = null) {
  const c = f => (hole ? k.cut(f, hole) : f)
  return [
    k.rose(c(k.poly([[15, 10.4], [21.6, 6.8], [21.6, 17.2], [15, 13.6]], 1)), { plate: 'A' }),
    k.body(c(k.rr(2.4, 6, 15.8, 18, 2.4))),
    ...extra,
  ]
}
// the loudspeaker with a bow on its rim, plus whatever sound it makes
function speaker(k, sound) {
  return [
    k.body(k.poly([[2.2, 8], [7, 8], [12.2, 3.6], [12.2, 20.4], [7, 16], [2.2, 16]], 1.4)),
    k.ink('M7 8.8 V15.2', 0.85),
    sound,
    k.bow(4.4, 8.2, 0.5, -10),
  ]
}
