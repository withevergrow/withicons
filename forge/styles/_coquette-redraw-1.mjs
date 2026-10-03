// COQUETTE redraw chunk 1 of 5: hand-composed icons for this chunk's redrawer.
// Each entry maps an icon name to (icon, k) => parts (k = the frozen kit, see
// forge/styles/COQUETTE-GUIDE.md). Entries in the EXEMPLAR map (_coquette-exemplars.mjs) win.
//
// Chunk 1 = icons 1-100 alphabetically (accessibility .. circle-arrow-down).
// Families used here: round badges are blush discs on a lace doily; arrows and chevrons are
// satin ribbons (bow on the tail, or a heart in the free corner); paper is cream; metal gold.

// ---------------------------------------------------------------------------
// local helpers
const D2R = Math.PI / 180
// rotate points about (cx, cy)
const rotP = (pts, deg, cx = 12, cy = 12) => {
  const a = deg * D2R, c = Math.cos(a), s = Math.sin(a)
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c])
}
const at = (x, y, deg, cx = 12, cy = 12) => rotP([[x, y]], deg, cx, cy)[0]

// the arrow-right exemplar's satin ribbon, turned by deg (0 = right), bow on the tail
function ribbonArrow(k, deg, o = {}) {
  const shaft = rotP([[o.x0 ?? 5.5, 12], [19.6, 12]], deg)
  const head = rotP([[14, 6.4], [19.6, 12], [14, 17.6]], deg)
  const tail = at(o.bx ?? 5.4, 12, deg)
  return [
    k.body(k.union(k.tube(shaft, 3), k.tube(head, 3))),
    o.bow === false ? null : k.bow(tail[0] + (o.bdx || 0), tail[1] + (o.bdy || 0), o.s || 0.7, o.rot || 0),
  ]
}
// a diagonal arrow (tail at t, tip at p, head arms along the axes)
function diagArrow(k, t, p, bowAt, o = {}) {
  const sx = Math.sign(p[0] - t[0]), sy = Math.sign(p[1] - t[1]), L = o.arm || 9.2
  return [
    k.body(k.union(k.tube([t, p], 3), k.tube([[p[0] - sx * L, p[1]], p, [p[0], p[1] - sy * L]], 3))),
    k.bow(bowAt[0], bowAt[1], o.s || 0.66, o.rot || 0),
  ]
}
// a round blush badge on a slim scalloped lace doily (a thin band: light at 16px, small file)
const doily = (k, r = 8.4, cx = 12, cy = 12, lr = 0.79) => [
  k.laceRing(k.disc(cx, cy, r), lr, 0.3),
  k.body(k.disc(cx, cy, r)),
]
// a heart as a stroke's END CAP: its point tucked into the end, lobes outward. end = the
// stroke's last point, from = a point before it on the stroke (gives the direction).
function capHeart(k, end, from, w = 4, o = {}) {
  const dx = end[0] - from[0], dy = end[1] - from[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L
  const off = 0.46 * w - (o.tuck ?? 0.5)
  return k.heart(end[0] + ux * off, end[1] + uy * off, w, Math.atan2(ux, -uy) / D2R, { plate: o.plate || 'K', ...o })
}
// a heart riding a chevron's vertex, its point aimed the way the chevron points
const vHeart = (k, x, y, deg, w = 4.6, plate = 'K') => k.heart(x, y, w, deg, { plate })
// scale points about (12, 12)
const sc = (pts, f = 1.1, cx = 12, cy = 12) => pts.map(([x, y]) => [cx + (x - cx) * f, cy + (y - cy) * f])
// a four-line text block (align icons): satin ribbons y = 5, 9.7, 14.4, 19.1
function alignLines(k, spans, bowX) {
  const ys = [5.2, 9.8, 14.4, 19]
  return [
    k.body(k.union(spans.map(([a, b], i) => k.tube(`M${a} ${ys[i]} H${b}`, 2.5)))),
    k.bow(bowX, 5.2, 0.56, 0),
  ]
}
// a chevron ribbon (points, 3u satin)
const chev = (k, pts, o = {}) => (o.rose ? k.rose : k.body)(k.tube(pts, o.w || 3), { plate: o.plate || 'K' })

// the scalloped badge outline of badge-check / badge-percent
const BADGE = 'M9.48 3.65 A2.75 2.75 0 0 1 14.52 3.65 A1.25 1.25 0 0 0 16.12 4.31 A2.75 2.75 0 0 1 19.69 7.88 A1.25 1.25 0 0 0 20.35 9.48 A2.75 2.75 0 0 1 20.35 14.52 A1.25 1.25 0 0 0 19.69 16.12 A2.75 2.75 0 0 1 16.12 19.69 A1.25 1.25 0 0 0 14.52 20.35 A2.75 2.75 0 0 1 9.48 20.35 A1.25 1.25 0 0 0 7.88 19.69 A2.75 2.75 0 0 1 4.31 16.12 A1.25 1.25 0 0 0 3.65 14.52 A2.75 2.75 0 0 1 3.65 9.48 A1.25 1.25 0 0 0 4.31 7.88 A2.75 2.75 0 0 1 7.88 4.31 A1.25 1.25 0 0 0 9.48 3.65 Z'

export const R = {
  // ---- round badges ---------------------------------------------------------
  // the access figure in ribbon red (2u limbs, a round head) on a blush doily badge
  accessibility: (icon, k) => [
    doily(k),
    k.satin(k.union(k.tube('M7.3 10.1 H16.7 M12 10.1 V14 M9 17.9 L12 14 L15 17.9', 2), k.disc(12, 6.6, 1.65)), { plate: 'S', ow: 0.45 }),
  ],
  // a ribbon-red exclamation on a blush doily badge
  'alert-circle': (icon, k) => [
    doily(k),
    k.satin(k.union(k.tube('M12 6.7 V12.7', 2.7), k.disc(12, 16.8, 1.5)), { plate: 'S' }),
  ],
  // the cross face of an angry little emoji, a hair bow on its crown
  angry: (icon, k) => [
    k.body(k.disc(12, 12.6, 9)),
    k.ink('M7.4 8.6 L10.4 10.1 M16.6 8.6 L13.6 10.1 M9 17.9 A3.4 3.4 0 0 1 15 17.9', 1.1),
    k.fill(k.union(k.disc(9.1, 12.8, 0.95), k.disc(14.9, 12.8, 0.95)), 'ink'),
    k.bow(17.6, 4.8, 0.6, 22),
  ],
  // a blush basketball with rose seams on a doily? no: a plain ball, rose seams, gold twinkle
  basketball: (icon, k) => [
    k.body(k.disc(12, 12.4, 9), {
      detail: k.inter(k.tube('M12 3.4 V21.4 M3 12.4 H21 M5.7 5.6 C8.5 8.9 8.5 15.9 5.7 19.2 M18.3 5.6 C15.5 8.9 15.5 15.9 18.3 19.2', 0.95), k.disc(12, 12.4, 8.7)),
    }),
    k.bow(18.1, 4.6, 0.56, 22),
  ],
  // a blush badge with a ribbon-red slash
  ban: (icon, k) => {
    const ring = k.ring(12, 12, 7.9, 3)
    return [
      k.laceRing(k.disc(12, 12, 9.4), 0.72, 0.2),
      k.body(ring),
      k.satin(k.inter(k.seg(6.6, 6.6, 17.4, 17.4, 2.8), k.disc(12, 12, 8)), { plate: 'S' }),
    ]
  },
  // a cream check on a blush doily badge
  'check-circle': (icon, k) => [
    doily(k),
    k.satin(k.tube(sc([[7.9, 12.4], [10.7, 15.2], [16.1, 9.3]]), 2.7), { plate: 'S' }),
  ],
  // a ribbon-red arrow on a blush doily badge
  'circle-arrow-down': (icon, k) => [
    doily(k),
    k.satin(k.union(k.tube(sc([[12, 7.4], [12, 15.6]]), 2.6), k.tube(sc([[8.2, 12], [12, 15.8], [15.8, 12]]), 2.6)), { plate: 'S' }),
  ],

  // ---- glyph ribbons --------------------------------------------------------
  // a satin heartbeat ribbon with a little heart where it begins
  activity: (icon, k) => [
    k.body(k.tube('M2.6 12.6 H6 L9.4 5.2 L14.4 19.6 L17.8 12.6 H19.2', 2.9)),
    capHeart(k, [19.2, 12.6], [17.8, 12.6], 4.4),
  ],
  'align-center': (icon, k) => alignLines(k, [[3.4, 20.6], [6.4, 17.6], [3.4, 20.6], [6.4, 17.6]], 12),
  'align-justify': (icon, k) => alignLines(k, [[3.4, 20.6], [3.4, 20.6], [3.4, 20.6], [3.4, 20.6]], 12),
  'align-left': (icon, k) => alignLines(k, [[3.4, 20.6], [3.4, 14.6], [3.4, 20.6], [3.4, 14.6]], 12),
  'align-right': (icon, k) => alignLines(k, [[3.4, 20.6], [9.4, 20.6], [3.4, 20.6], [9.4, 20.6]], 12),
  // a satin @ with a little bow on the end of its tail
  'at-sign': (icon, k) => [
    k.body(k.union(k.ring(12, 12, 3.9, 2.5), k.tube('M15.9 8 V13.4 A2.7 2.7 0 0 0 21.3 13.4 V12 A9.3 9.3 0 1 0 16.4 20.2', 2.5))),
    capHeart(k, [16.4, 20.2], [14, 21.5], 4),
  ],

  // ---- arrows: satin ribbons, bow on the tail ---------------------------------
  'arrow-left': (icon, k) => ribbonArrow(k, 180),
  'arrow-up': (icon, k) => ribbonArrow(k, -90, { bdy: -0.4 }),
  'arrow-down': (icon, k) => ribbonArrow(k, 90),
  'arrow-left-right': (icon, k) => [
    k.body(k.union(k.tube('M3.6 12 H20.4', 3), k.tube('M8.8 6.6 L3.4 12 L8.8 17.4 M15.2 6.6 L20.6 12 L15.2 17.4', 3))),
    k.bow(8.9, 6.5, 0.54, -16),
  ],
  'arrow-up-down': (icon, k) => [
    k.body(k.union(k.tube('M12 3.6 V20.4', 3), k.tube('M6.6 8.8 L12 3.4 L17.4 8.8 M6.6 15.2 L12 20.6 L17.4 15.2', 3))),
    k.bow(17.5, 8.9, 0.54, 16),
  ],
  'arrow-down-right': (icon, k) => diagArrow(k, [6.6, 6.6], [17.8, 17.8], [6.4, 6.4]),
  'arrow-down-left': (icon, k) => diagArrow(k, [17.4, 6.6], [6.2, 17.8], [17.6, 6.4]),
  'arrow-up-right': (icon, k) => diagArrow(k, [6.6, 17.4], [17.8, 6.2], [6.4, 17.6]),
  'arrow-up-left': (icon, k) => diagArrow(k, [17.4, 17.4], [6.2, 6.2], [17.6, 17.6]),

  // ---- objects --------------------------------------------------------------
  // a blush address book with gold index tabs and a cream cameo portrait; bow on its corner
  'address-book': (icon, k) => [
    k.gold(k.tube('M18.4 7 H20.4 M18.4 12 H20.4 M18.4 17 H20.4', 1.7), { plate: 'A' }),
    k.body(k.rr(3.6, 2.6, 18.6, 21.4, 2.2)),
    k.gold(k.ellipse(11.1, 12.3, 4.7, 5.8), { plate: 'K' }),
    k.cream(k.ellipse(11.1, 12.3, 3.7, 4.8), { ow: 0 }),
    k.rose(k.inter(k.union(k.disc(11.1, 10.6, 1.75), k.path('M7.9 16.4 C8.2 14.2 9.5 13.3 11.1 13.3 C12.7 13.3 14 14.2 14.3 16.4 Z')), k.ellipse(11.1, 12.3, 3.7, 4.8)), { plate: 'A', ow: 0 }),
    k.bow(5.2, 4.2, 0.56, -20),
  ],
  // a blush clock face in cream, gold bells and feet, the bow tied between the bells
  'alarm-clock': (icon, k) => [
    k.gold(k.tube('M7.4 17.6 L5 20.6 M16.6 17.6 L19 20.6', 2), { plate: 'A' }),
    k.gold(k.union(k.path('M2.9 7.6 A3 3 0 0 1 7.6 2.9 Z'), k.path('M16.4 2.9 A3 3 0 0 1 21.1 7.6 Z')), { plate: 'A' }),
    k.body(k.disc(12, 12.8, 7.6)),
    k.cream(k.disc(12, 12.8, 5.4), { ow: 0.5 }),
    k.ink('M12 9.4 V12.8 L14.6 14.3', 1.1, { plate: 'A' }),
    k.pearl(12, 12.8, 0.7, { plate: 'A' }),
    k.bow(12, 4.4, 0.56, 0),
  ],
  // a blush warning sign with a ribbon-red exclamation and lace along its base
  'alert-triangle': (icon, k) => [
    k.lace('M4.6 20.6 H19.4', 0.72),
    k.body(k.poly([[12, 2.8], [21.9, 19.8], [2.1, 19.8]], 2)),
    k.satin(k.union(k.tube('M12 8.8 V13.2', 2.4), k.disc(12, 16.6, 1.3)), { plate: 'S' }),
  ],
  // an ambulance: blush van, cream window, a ribbon-red cross, rose wheels with pearl hubs
  ambulance: (icon, k) => [
    k.body(k.path('M2 6.2 A2 2 0 0 1 4 4.2 H13.9 L18.6 10 H20 A2 2 0 0 1 22 12 V16.4 A1.6 1.6 0 0 1 20.4 18 H3.6 A1.6 1.6 0 0 1 2 16.4 Z')),
    k.cream(k.poly([[13.7, 5.5], [13.7, 10.3], [18, 10.3]], 0.7)),
    k.satin(k.union(k.tube('M7.5 7.9 V12.9 M5 10.4 H10', 2)), { plate: 'S' }),
    k.rose(k.union(k.disc(6.5, 18, 2.4), k.disc(18, 18, 2.4)), { plate: 'A' }),
    k.pearl(6.5, 18, 0.85, { plate: 'A' }), k.pearl(18, 18, 0.85, { plate: 'A' }),
  ],
  // a blush anchor with a gold ring, a bow tied under the ring
  anchor: (icon, k) => [
    k.gold(k.ring(12, 4.9, 2.2, 1.7), { plate: 'A' }),
    k.body(k.union(k.tube('M12 7.4 V21.2', 2.4), k.tube('M8 11.6 H16', 2.2), k.tube('M5 14.6 A7 7 0 0 0 19 14.6', 2.4), k.tube('M3.2 17 L5 14.4 L7 17 M17 17 L19 14.4 L20.8 17', 2.2))),
    k.bow(12, 8.9, 0.5, 0),
  ],
  // a cream app window with a blush title bar holding three pearls
  'app-window': (icon, k) => {
    const win = k.rr(2.2, 4, 21.8, 20, 2.4)
    return [
      k.cream(win),
      k.body(k.inter(win, k.rect(1, 3, 23, 9.6))),
      k.fill(k.tube('M5.6 13.4 H14 M5.6 16.6 H11', 1.2), 'c2'),
      k.pearl(5.7, 6.8, 0.85), k.pearl(8.5, 6.8, 0.85), k.pearl(11.3, 6.8, 0.85),
    ]
  },
  // a blush apple, gold stem, rose leaf, a little bow at the stem
  apple: (icon, k) => [
    k.gold(k.tube('M12 10 C12 8 11.6 5.8 10.6 3.8', 1.5), { plate: 'A' }),
    k.rose(k.path('M12.6 6 C13 3.8 15 2.6 17.8 2.6 C17.3 4.8 15.2 6.4 12.6 6 Z'), { plate: 'A' }),
    k.body(k.path('M12 10 C14.5 7.5 20 8 20 13.5 C20 18 17 21.5 14.5 21.5 C13.5 21.5 13 21 12 21 C11 21 10.5 21.5 9.5 21.5 C7 21.5 4 18 4 13.5 C4 8 9.5 7.5 12 10 Z')),
    k.sparkle(4.6, 5, 1.6),
  ],
  // a blush box under a rose lid trimmed with lace, a heart for its label
  archive: (icon, k) => [
    k.body(k.rr(4.4, 7.4, 19.6, 20.6, [0, 0, 2.2, 2.2])),
    k.lace('M4.8 9.4 H19.2', 0.72),
    k.rose(k.rr(2.8, 3.4, 21.2, 8.8, 1.7), { plate: 'A' }),
    k.heart(12, 14.4, 4.4, 0, { plate: 'K' }),
  ],
  // three gold orbits round a ribbon-red heart nucleus, pearl electrons
  atom: (icon, k) => {
    const orb = d => k.ellipse(12, 12, 9.6, 3.7, d)
    const band = d => k.cut(orb(d), k.inset(orb(d), 1.4))
    return [
      // three separate orbit bands, laid one over the other (simpler contours than one union)
      [0, 60, 120].map(d => k.gold(band(d), { plate: 'K', ow: 0.38, noShadow: d !== 0 })),
      k.heart(12, 12.2, 5, 0, { plate: 'K' }),
      k.pearl(...at(21.6, 12, 60), 0.95), k.pearl(...at(2.4, 12, 0), 0.95),
    ]
  },
  // five satin bars, rose at the ends, a gold twinkle
  'audio-lines': (icon, k) => [
    k.rose(k.tube('M4 10 V14 M20 10 V14', 2.6), { plate: 'A' }),
    k.body(k.tube('M8 6.5 V17.5 M12 5.6 V20.8 M16 7.5 V16.5', 2.6)),
    capHeart(k, [12, 5.6], [12, 10], 4),
  ],
  // a rosette: blush medal on a lace doily, ribbon-red tails, a heart at its heart
  award: (icon, k) => [
    k.satin(k.union(k.poly([[8.6, 13.4], [10.9, 14.6], [9.4, 21.8], [7.8, 20], [6.1, 20.6]], 0.5), k.poly([[15.4, 13.4], [13.1, 14.6], [14.6, 21.8], [16.2, 20], [17.9, 20.6]], 0.5)), { plate: 'A' }),
    k.laceRing(k.disc(12, 9, 5.9), 0.75, 0.3),
    k.body(k.disc(12, 9, 5.9)),
    k.heart(12, 9.2, 5, 0, { plate: 'K' }),
  ],
  // a rounded blush pack: blush grab loop, rose side straps, a front pocket under a rose
  // flap trimmed with lace, a red heart clasp
  backpack: (icon, k) => [
    k.body(k.tube('M9.4 6.6 V5 A2.2 2.2 0 0 1 11.6 2.8 H12.4 A2.2 2.2 0 0 1 14.6 5 V6.6', 1.9), { plate: 'A' }),
    k.rose(k.union(k.pill(3, 10.6, 5.8, 19.6), k.pill(18.2, 10.6, 21, 19.6)), { plate: 'A' }),
    k.body(k.path('M7.4 21.5 H16.6 A2.6 2.6 0 0 0 19.2 18.9 V11.6 A5.6 5.6 0 0 0 13.6 6 H10.4 A5.6 5.6 0 0 0 4.8 11.6 V18.9 A2.6 2.6 0 0 0 7.4 21.5 Z')),
    k.body(k.rr(7.4, 13.4, 16.6, 20, 2)),
    k.lace('M8.2 15.9 H15.8', 0.66, { eyelets: false }),
    k.rose(k.rr(7, 12, 17, 15.8, [2.2, 2.2, 1.4, 1.4]), { plate: 'A' }),
    k.heart(12, 15.6, 3.6, 0, { plate: 'A' }),
  ],
  // a blush rosette badge with a ribbon-red check and a gold twinkle
  'badge-check': (icon, k) => [
    k.body(k.path(BADGE)),
    k.satin(k.tube('M8 12.4 L10.8 15.2 L16 9.5', 2.5), { plate: 'S' }),
    k.sparkle(20.4, 3.6, 1.6),
  ],
  // a blush rosette badge, a ribbon-red slash between two pearls
  'badge-percent': (icon, k) => [
    k.body(k.path(BADGE)),
    k.satin(k.seg(15, 9, 9, 15, 2.2), { plate: 'S' }),
    k.pearl(9.2, 9.2, 1.4, { plate: 'S' }), k.pearl(14.8, 14.8, 1.4, { plate: 'S' }),
  ],

  // ---- batch 2 ----------------------------------------------------------------
  // a blush balloon on a gold string, a bow tied at its knot
  balloon: (icon, k) => [
    k.wire('M12 17 C12 18.8 13.3 19.3 12.8 21.6', 0.95),
    k.rose(k.poly([[12, 15.2], [10.8, 17.2], [13.2, 17.2]], 0.4), { plate: 'K' }),
    k.body(k.path('M12 15.6 C8.2 15.6 5.4 11.8 5.4 8.7 C5.4 5 8.4 2.4 12 2.4 C15.6 2.4 18.6 5 18.6 8.7 C18.6 11.8 15.8 15.6 12 15.6 Z')),
    k.bow(12, 16.6, 0.5, 0),
  ],
  // a blush bandage with a cream pad holding a little rose heart
  bandage: (icon, k) => [
    k.body(k.path('M10 20 L20 10 A4.25 4.25 0 0 0 14 4 L4 14 A4.25 4.25 0 0 0 10 20 Z')),
    k.cream(k.poly([[7.6, 11.4], [12.6, 16.4], [16.4, 12.6], [11.4, 7.6]], 0.8), { ow: 0.45 }),
    k.heart(12, 12.2, 3.6, 0, { mat: 'rose', plate: 'K' }),
  ],
  // a blush note with a cream medallion holding a red heart, pearls for the corner dots
  banknote: (icon, k) => [
    k.body(k.rr(2, 5.5, 22, 18.5, 2.2)),
    k.cream(k.disc(12, 12, 3.6), { ow: 0.5 }),
    k.heart(12, 12.2, 4.2, 0, { plate: 'K' }),
    k.pearl(5.9, 12, 0.85), k.pearl(18.1, 12, 0.85),
  ],
  // blush bars, the wide ones rose, a gold twinkle
  barcode: (icon, k) => [
    k.body(k.tube('M4.6 5.6 V18.4 M13.9 5.6 V18.4', 2.2)),
    k.rose(k.union(k.rr(7.9, 5, 10.6, 19, 0.8), k.rr(17.4, 5, 20.1, 19, 0.8)), { plate: 'K' }),
    k.lace('M3.6 20.2 H20.4', 0.62, { eyelets: false }),
  ],
  // a blush clawfoot tub, a gold tap, pearl bubbles
  bath: (icon, k) => [
    k.gold(k.tube('M5 11 V6.4 A2.5 2.5 0 0 1 10 6.4 V7.4', 1.6), { plate: 'A' }),
    k.gold(k.tube('M6.6 18.4 L5.6 20.6 M17.4 18.4 L18.4 20.6', 1.6), { plate: 'A' }),
    k.body(k.path('M3.4 11.8 H20.6 V14 A5 5 0 0 1 15.6 19 H8.4 A5 5 0 0 1 3.4 14 Z')),
    k.rose(k.pill(2, 10.2, 22, 12.8), { plate: 'K' }),
    k.pearl(13.4, 8.4, 0.95), k.pearl(16, 7.6, 1.15), k.pearl(18.4, 8.8, 0.8),
  ],
  // blush battery, cream inside, two rose cells, bow on its corner
  battery: (icon, k) => [
    k.gold(k.rr(18.6, 10, 22.2, 14, 1), { plate: 'A' }),
    k.body(k.rr(2, 6.8, 19.4, 17.2, 2.4)),
    k.cream(k.rr(4, 8.8, 17.4, 15.2, 1.1), { ow: 0.45 }),
    k.rose(k.union(k.rr(5.4, 10.2, 8.2, 13.8, 0.7), k.rr(9.4, 10.2, 12.2, 13.8, 0.7)), { plate: 'A', ow: 0.4 }),
    k.bow(4, 7.2, 0.52, -18),
  ],
  // one ribbon-red cell left
  'battery-low': (icon, k) => [
    k.gold(k.rr(18.6, 10, 22.2, 14, 1), { plate: 'A' }),
    k.body(k.rr(2, 6.8, 19.4, 17.2, 2.4)),
    k.cream(k.rr(4, 8.8, 17.4, 15.2, 1.1), { ow: 0.45 }),
    k.satin(k.rr(5.4, 10.2, 8.2, 13.8, 0.7), { plate: 'S', ow: 0.4 }),
    k.bow(4, 7.2, 0.52, -18),
  ],
  // a gold bolt across the blush battery
  'battery-charging': (icon, k) => {
    const bolt = k.poly([[13.8, 2.8], [7.4, 13.2], [11.6, 13.2], [9.8, 21.2], [16.6, 10.8], [12.4, 10.8]], 0.5)
    return [
      k.gold(k.rr(18.6, 10, 22.2, 14, 1), { plate: 'A' }),
      k.body(k.moat(k.rr(2, 6.8, 19.4, 17.2, 2.4), bolt, 0.8)),
      k.cream(k.moat(k.rr(4, 8.8, 17.4, 15.2, 1.1), bolt, 0.8), { ow: 0.45 }),
      k.gold(bolt, { plate: 'S' }),
    ]
  },
  // a blush bed: rose frame, cream pillow, a lace-edged coverlet, a bow on the headboard
  bed: (icon, k) => [
    k.rose(k.union(k.tube('M3.2 5 V19.6', 2.4), k.tube('M3.2 16.6 H20.8 V19.6', 2.4)), { plate: 'K' }),
    k.lace('M4.6 16.4 H20', 0.72, { eyelets: false, step: 1.6 }),
    k.body(k.rr(3.6, 11.4, 21, 16, [0, 2.2, 0.6, 0])),
    k.cream(k.rr(5.4, 8.2, 11.6, 11.8, 1.6), { plate: 'A' }),
    k.bow(3.2, 4.4, 0.5, -10),
  ],
  // a blush mug under cream foam, a gold handle, a red heart
  beer: (icon, k) => [
    k.gold(k.tube('M16 11.6 H17.8 A2 2 0 0 1 19.8 13.6 V15.8 A2 2 0 0 1 17.8 17.8 H16', 1.9), { plate: 'A' }),
    k.body(k.rr(4, 8.6, 16, 21.5, [0, 0, 2, 2])),
    k.cream(k.union(k.disc(5.8, 8.4, 2.2), k.disc(9.2, 6.4, 2.8), k.disc(12.8, 6.6, 2.4), k.disc(15, 8.4, 1.9), k.pill(3.6, 8, 16.4, 10.4)), { plate: 'A' }),
    k.heart(10, 15.4, 4.4, 0, { plate: 'K' }),
  ],
  // the exemplar bell with a ribbon-red slash, hanging from its bow
  'bell-off': (icon, k) => {
    const slash = k.seg(3.6, 3.6, 20.4, 20.4, 2)
    return [
      k.gold(k.moat(k.disc(12, 19.6, 1.9), slash, 0.7), { plate: 'A' }),
      k.body(k.moat(k.path('M4.5 17.6 C5.6 16.4 6.2 15.2 6.2 13 V11.2 A5.8 5.8 0 0 1 17.8 11.2 V13 C17.8 15.2 18.4 16.4 19.5 17.6 Z'), slash, 0.8)),
      k.rose(k.moat(k.pill(3.6, 16.2, 20.4, 18.8), slash, 0.8), { plate: 'K' }),
      k.bow(12, 4.4, 0.72, 0, { plate: 'K' }),
      k.satin(slash, { plate: 'S' }),
    ]
  },
  // the exemplar bell ringing: rose chime arcs either side
  'bell-ring': (icon, k) => [
    k.rose(k.tube('M2.4 10.4 A10 10 0 0 1 4.6 5 M21.6 10.4 A10 10 0 0 0 19.4 5', 1.8), { plate: 'S' }),
    k.gold(k.disc(12, 19.6, 1.9), { plate: 'A' }),
    k.body(k.path('M5 17.6 C6 16.4 6.6 15.2 6.6 13 V11.4 A5.4 5.4 0 0 1 17.4 11.4 V13 C17.4 15.2 18 16.4 19 17.6 Z')),
    k.rose(k.pill(4.2, 16.2, 19.8, 18.8), { plate: 'K' }),
    k.bow(12, 4.6, 0.72, 0, { plate: 'K' }),
  ],
  // a blush bicycle: rose wheels, gold saddle and bars, a bow on the bars
  bike: (icon, k) => [
    k.rose(k.union(k.ring(5.5, 16.5, 3.4, 1.8), k.ring(18.5, 16.5, 3.4, 1.8)), { plate: 'A' }),
    k.body(k.tube('M5.5 16.5 L9 10 H15 L18.5 16.5 M9 10 L12 16.5 L15 10 M15 10 L13.6 5.8 M9 10 L8.6 7.2', 2)),
    k.gold(k.tube('M13.4 5.6 H16.2 M7 7 H10.2', 1.5), { plate: 'A' }),
    k.bow(15.4, 4.4, 0.5, 18),
  ],
  // opera glasses: blush barrels, rose lenses, a pearl strap
  binoculars: (icon, k) => [
    k.pearls('M5.8 5.2 C7 1.6 17 1.6 18.2 5.2', 0.72, { step: 2.3 }),
    k.gold(k.rr(8.6, 9.8, 15.4, 12.2, 0.8), { plate: 'K' }),
    k.body(k.union(k.path('M2.5 17 L4 6.5 A1 1 0 0 1 5 5.5 H7 A1 1 0 0 1 8 6.5 L9.5 17 Z'), k.disc(6, 17, 3.6), k.path('M14.5 17 L16 6.5 A1 1 0 0 1 17 5.5 H19 A1 1 0 0 1 20 6.5 L21.5 17 Z'), k.disc(18, 17, 3.6))),
    k.rose(k.union(k.disc(6, 17, 2.1), k.disc(18, 17, 2.1)), { plate: 'K', ow: 0.45 }),
  ],
  // a blush songbird: gold beak and legs, a rose wing, a bow on its head
  bird: (icon, k) => [
    k.gold(k.tube('M10 17.6 V21 M13.5 17 V21', 1.4), { plate: 'A' }),
    k.gold(k.poly([[18.6, 6.6], [21.8, 8], [18.6, 9.4]], 0.4), { plate: 'K' }),
    k.body(k.path('M19 8 C19 13.5 15.5 18 10.5 18 C7.75 18 5.75 16.75 4.75 14.5 L2.5 9.5 L7.25 11.25 C8.75 10.25 10.25 9.5 12 9 C12 6.5 13.5 4.5 15.5 4.5 C17.4 4.5 19 6 19 8 Z')),
    k.rose(k.path('M14.8 11 C14.8 14 12 15.6 8.2 14 C10 12.2 12.2 11.2 14.8 11 Z'), { plate: 'A' }),
    k.fill(k.disc(15.8, 7.6, 0.8), 'ink'),
    k.bow(13.2, 4.8, 0.5, -20),
  ],
  // a satin bluetooth rune and a little heart
  bluetooth: (icon, k) => [
    k.body(k.tube('M6.6 7.6 L17.4 16.4 L12 20.8 V3.2 L17.4 7.6 L6.6 16.4', 2.6)),
    capHeart(k, [6.6, 7.6], [17.4, 16.4], 4.4),
  ],
  // a satin ribbon B with a bow on its top corner
  bold: (icon, k) => [
    k.body(k.tube('M6.6 4.2 H12.4 A3.4 3.4 0 0 1 12.4 11 H13 A4.4 4.4 0 0 1 13 19.8 H6.6 Z M6.6 11 H12.4', 2.8)),
    k.bow(6.4, 4.2, 0.55, -18),
  ],
  // a blush book with cream pages, a red ribbon bookmark and a heart on its cover
  book: (icon, k) => [
    k.cream(k.rr(4.6, 15.6, 19.4, 21.4, [0, 0, 1.4, 2.6]), { plate: 'K' }),
    k.body(k.union(k.rr(4.6, 2.6, 19.4, 16.6, [2.4, 1.4, 0, 0]), k.tube('M5.8 19 V5', 2.4))),
    k.ink('M7.4 18.8 H19', 0.8),
    k.satin(k.poly([[15, 2.4], [17.2, 2.4], [17.2, 10.6], [16.1, 9.4], [15, 10.6]], 0.3), { plate: 'A' }),
    k.heart(10.6, 9.4, 4.6, 0, { plate: 'K' }),
  ],
  // cream pages on a blush cover, a red bookmark falling from the spine
  'book-open': (icon, k) => [
    k.satin(k.poly([[11, 18.6], [13, 18.6], [13, 22.6], [12, 21.6], [11, 22.6]], 0.3), { plate: 'A' }),
    k.body(k.path('M12 6.2 C10.4 4.6 7.8 3.6 4.2 3.6 A1.8 1.8 0 0 0 2.2 5.4 V17.4 A1.8 1.8 0 0 0 4.2 19.2 C7.8 19.2 10.4 20 12 21.2 C13.6 20 16.2 19.2 19.8 19.2 A1.8 1.8 0 0 0 21.8 17.4 V5.4 A1.8 1.8 0 0 0 19.8 3.6 C16.2 3.6 13.6 4.6 12 6.2 Z')),
    k.cream(k.path('M11.4 7.4 C10 6.2 8 5.4 4.6 5.4 V17 C8 17 10 17.8 11.4 18.8 Z M12.6 7.4 C14 6.2 16 5.4 19.4 5.4 V17 C16 17 14 17.8 12.6 18.8 Z'), { ow: 0.45 }),
    k.fill(k.tube('M6.4 9 C8 9 9 9.4 9.8 9.9 M6.4 12 C8 12 9 12.4 9.8 12.9 M14.2 9.9 C15 9.4 16 9 17.6 9 M14.2 12.9 C15 12.4 16 12 17.6 12', 1), 'c2'),
  ],
  // a blush bookmark with a red heart
  bookmark: (icon, k) => [
    k.lace('M7.2 3.4 H16.8', 0.66, { eyelets: false }),
    k.body(k.path('M7.5 3.6 H16.5 A2 2 0 0 1 18.5 5.6 V20.5 L12 16.5 L5.5 20.5 V5.6 A2 2 0 0 1 7.5 3.6 Z')),
    k.heart(12, 10, 5, 0, { plate: 'K' }),
  ],
  // a blush bookmark with a ribbon-red plus and lace along its top
  'bookmark-plus': (icon, k) => [
    k.lace('M7.2 3.4 H16.8', 0.66, { eyelets: false }),
    k.body(k.path('M7.5 3.6 H16.5 A2 2 0 0 1 18.5 5.6 V20.5 L12 16.5 L5.5 20.5 V5.6 A2 2 0 0 1 7.5 3.6 Z')),
    k.satin(k.tube('M12 7 V12.6 M9.2 9.8 H14.8', 2.3), { plate: 'S' }),
  ],
  // a blush robot: cream visor, gold ears, a heart on its antenna
  bot: (icon, k) => [
    k.gold(k.union(k.tube('M12 8.2 V5.4', 1.5), k.tube('M2.6 12.4 V16.2 M21.4 12.4 V16.2', 2)), { plate: 'A' }),
    k.body(k.rr(4.6, 8, 19.4, 20.8, 3)),
    k.cream(k.rr(6.8, 10.4, 17.2, 17.4, 2), { ow: 0.45 }),
    k.fill(k.tube('M9.6 12.8 V15 M14.4 12.8 V15', 1.8), 'ink'),
    k.heart(12, 3.8, 4.4, 0, { plate: 'A' }),
  ],
  // satin braces with a pearl between them
  braces: (icon, k) => [
    k.body(k.tube('M9 3.6 H8.6 A2.5 2.5 0 0 0 6.1 6.1 V9.5 C6.1 11 5.1 12 3.6 12 C5.1 12 6.1 13 6.1 14.5 V17.9 A2.5 2.5 0 0 0 8.6 20.4 H9 M15 3.6 H15.4 A2.5 2.5 0 0 1 17.9 6.1 V9.5 C17.9 11 18.9 12 20.4 12 C18.9 12 17.9 13 17.9 14.5 V17.9 A2.5 2.5 0 0 1 15.4 20.4 H15', 2.6)),
    k.heart(12, 12.2, 4.2, 0),
  ],
  // a blush brain with rose folds, a bow tied in its cleft
  brain: (icon, k) => [
    k.body(k.path('M12 5.6 A3 3 0 0 0 6.5 6 A3.5 3.5 0 0 0 3.4 12 A3.5 3.5 0 0 0 6 18.1 A3.3 3.3 0 0 0 12 19.2 A3.3 3.3 0 0 0 18 18.1 A3.5 3.5 0 0 0 20.6 12 A3.5 3.5 0 0 0 17.5 6 A3 3 0 0 0 12 5.6 Z'), {
      detail: k.tube('M12 7.6 V18.6 M6.8 6.6 C7.6 7.2 8 8 8 9.2 M4.6 12.2 C6 12.3 7 13 7.5 14.4 M17.2 6.6 C16.4 7.2 16 8 16 9.2 M19.4 12.2 C18 12.3 17 13 16.5 14.4', 0.9),
    }),
    k.bow(12, 5.4, 0.62, 0),
  ],
  // a blush briefcase: gold handle, a lace band, a heart clasp
  briefcase: (icon, k) => [
    k.gold(k.tube('M8.6 7.6 V5.6 A2 2 0 0 1 10.6 3.6 H13.4 A2 2 0 0 1 15.4 5.6 V7.6', 1.7), { plate: 'A' }),
    k.body(k.rr(2.5, 7.5, 21.5, 20.5, 2.2)),
    k.lace('M3.5 12.8 H20.5', 0.74, { eyelets: false }),
    k.heart(12, 13.4, 4.4, 0, { plate: 'S' }),
  ],
  // a blush case with a ribbon-red cross and a bow on its handle
  'briefcase-medical': (icon, k) => [
    k.gold(k.tube('M8.6 7.6 V5.6 A2 2 0 0 1 10.6 3.6 H13.4 A2 2 0 0 1 15.4 5.6 V7.6', 1.7), { plate: 'A' }),
    k.body(k.rr(2.5, 7.5, 21.5, 20.5, 2.2)),
    k.satin(k.tube('M12 11 V17 M9 14 H15', 2.4), { plate: 'S' }),
    k.bow(14.6, 4, 0.5, 18),
  ],
  // a ladybird in blush satin: a rose head, two red heart spots
  bug: (icon, k) => [
    k.ink('M7 11.6 L3.6 10.2 M7 15.4 H3.2 M9 19 L5.6 21 M17 11.6 L20.4 10.2 M17 15.4 H20.8 M15 19 L18.4 21 M10.6 6.6 L8.8 3.8 M13.4 6.6 L15.2 3.8', 1.15),
    k.pearl(8.7, 3.6, 0.65), k.pearl(15.3, 3.6, 0.65),
    k.rose(k.path('M8.8 9.2 A3.2 3.2 0 0 1 15.2 9.2 Z'), { plate: 'K' }),
    k.body(k.path('M7 11 A2 2 0 0 1 9 9 H15 A2 2 0 0 1 17 11 V15 A5 5 0 0 1 7 15 Z'), { detail: k.tube('M12 9.4 V19.6', 0.9) }),
    k.heart(9.6, 13.6, 3, -10, { plate: 'K' }), k.heart(14.4, 16.2, 3, 10, { plate: 'K' }),
  ],
  // a blush tower: rose windows, a red arched door, a bow on its corner
  building: (icon, k) => [
    k.rose(k.tube('M3 21.4 H21', 1.8), { plate: 'K' }),
    k.body(k.rr(5, 2.6, 19, 21.4, [2, 2, 0, 0])),
    k.rose(k.union([6.6, 10.6, 14.6].flatMap(y => [k.rr(8.2, y - 1, 10.6, y + 1.2, 0.6), k.rr(13.4, y - 1, 15.8, y + 1.2, 0.6)])), { plate: 'K', ow: 0.38 }),
    k.satin(k.arch(10, 17.4, 14, 21.4), { plate: 'A' }),
    k.bow(17.6, 3.8, 0.54, 20),
  ],
  // a blush burger: rose patty, a lace frill of lettuce, pearl sesame
  burger: (icon, k) => [
    k.body(k.rr(3.5, 17, 20.5, 21.5, [0.8, 0.8, 2.4, 2.4])),
    k.lace('M3.4 16 H20.6', 0.7, { eyelets: false }),
    k.rose(k.pill(2.4, 12.4, 21.6, 15.6), { plate: 'K' }),
    k.body(k.path('M3.4 10.8 A8.6 7 0 0 1 20.6 10.8 Q20.6 11.4 20 11.4 H4 Q3.4 11.4 3.4 10.8 Z')),
    k.pearl(9.2, 6.8, 0.55), k.pearl(12.4, 5.8, 0.55), k.pearl(15, 7.6, 0.55),
  ],
  // a blush bus: cream windscreen, pearl headlamps, rose wheels, a bow on its roof
  bus: (icon, k) => [
    k.rose(k.tube('M7 19.6 V21.4 M17 19.6 V21.4', 2.2), { plate: 'K' }),
    k.body(k.rr(4, 2.6, 20, 20, 2.2)),
    k.cream(k.rr(5.6, 6.4, 18.4, 12.6, 1)),
    k.ink('M5 6.4 H19', 0.8),
    k.pearl(7.8, 16.2, 0.95), k.pearl(16.2, 16.2, 0.95),
    k.bow(17.4, 3, 0.52, 18),
  ],
  // a butterfly of hearts: blush upper wings, rose lower wings, pearl-tipped antennae
  butterfly: (icon, k) => {
    const L = k.path('M11.4 10 C9.8 8.2 8.2 3.8 4.9 3.4 C2.9 3.4 2.3 5.2 2.3 7.5 C2.6 10 5.1 12 8.3 12.5 C5.6 13.5 4.3 15.5 4.3 17.6 C4.3 19.6 6.4 20.7 8.5 20.2 C10.2 19.4 11.1 16.8 11.4 14.5 Z')
    const wings = k.union(L, k.mirrorX(L, 12))
    const upper = k.inter(wings, k.rect(0, 0, 24, 12.4)), lower = k.cut(wings, k.rect(0, 0, 24, 12.4))
    return [
      k.ink('M12 8 L10.6 4.4 M12 8 L13.4 4.4', 0.9),
      k.pearl(10.5, 4.2, 0.65), k.pearl(13.5, 4.2, 0.65),
      k.rose(lower, { plate: 'K' }),
      k.body(upper),
      k.gold(k.pill(11.1, 7.4, 12.9, 19.4), { plate: 'K' }),
      k.heart(6.6, 7.6, 3.4, -14, { plate: 'K' }), k.heart(17.4, 7.6, 3.4, 14, { plate: 'K' }),
    ]
  },
  // a blush cake under cream frosting, a gold flame on a rose candle, a red heart
  cake: (icon, k) => [
    k.gold(k.path('M12 2.6 C13 3.6 13.5 4.3 13.5 4.8 A1.5 1.5 0 0 1 10.5 4.8 C10.5 4.3 11 3.6 12 2.6 Z'), { plate: 'A' }),
    k.rose(k.rr(11.2, 7, 12.8, 11.4, 0.6), { plate: 'A' }),
    k.rose(k.tube('M2.6 21 H21.4', 1.8), { plate: 'K' }),
    k.body(k.rr(4, 11, 20, 21, [2, 2, 0, 0])),
    k.cream(k.union(k.rr(4, 11, 20, 14.4, [2, 2, 0, 0]), [6, 10, 14, 18].map(x => k.disc(x, 14.4, 1.95))), { plate: 'K' }),
    k.heart(12, 17.8, 4, 0, { plate: 'K' }),
  ],

  // ---- batch 3 ----------------------------------------------------------------
  // a blush calculator, a cream display, pearl keys
  calculator: (icon, k) => [
    k.body(k.rr(4.4, 2.5, 19.6, 21.5, 2.4)),
    k.cream(k.rr(7.6, 5.4, 16.4, 10.4, 1.2), { ow: 0.5 }),
    k.fill(k.tube('M12.2 7.9 H14.6', 1.1), 'c2'),
    [8.4, 12, 15.6].flatMap(x => [k.pearl(x, 14, 1.22), k.pearl(x, 17.8, 1.22)]),
  ],
  'calendar-check': (icon, k) => calPage(k, k.satin(k.tube('M8.8 15.2 L11 17.4 L15.6 12.8', 2.3), { plate: 'S' })),
  'calendar-days': (icon, k) => calPage(k, [7.6, 12, 16.4].flatMap(x => [k.pearl(x, 13.4, 0.95), k.pearl(x, 17.4, 0.95)])),
  'calendar-plus': (icon, k) => calPage(k, k.satin(k.tube('M12 12.4 V18.4 M9 15.4 H15', 2.3), { plate: 'S' })),
  // the exemplar camera with a ribbon-red slash
  'camera-off': (icon, k) => {
    const slash = k.seg(3.2, 3.2, 20.8, 20.8, 2)
    return [
      k.rose(k.moat(k.pill(7.4, 4.4, 13.6, 9.4), slash, 0.8), { plate: 'K' }),
      k.body(k.moat(k.rr(2.4, 7, 21.6, 20, 2.8), slash, 0.8)),
      k.gold(k.moat(k.disc(12, 13.4, 4.7), slash, 0.8), { plate: 'A' }),
      k.rose(k.moat(k.disc(12, 13.4, 3.1), slash, 0.8), { plate: 'A' }),
      k.satin(slash, { plate: 'S' }),
    ]
  },
  // a blush screen, a cream caption panel with rose lines, a bow on its corner
  captions: (icon, k) => [
    k.body(k.rr(2, 4, 22, 20, 2.4)),
    k.cream(k.rr(3.8, 9.4, 20.2, 18.2, 1.3), { ow: 0.45 }),
    k.fill(k.tube('M6.2 12.4 H8.2 M11.6 12.4 H17.8 M6.2 15.4 H12.8 M16.2 15.4 H17.8', 1.5), 'c2'),
    k.bow(4.4, 5.2, 0.55, -18),
  ],
  // a blush coupe: cream windows, rose wheels with pearl hubs, a bow on the roof
  car: (icon, k) => [
    k.body(k.path('M2.4 12 A2 2 0 0 1 4.4 10 H5.5 L8 5 H13.5 L17.5 10 H19.5 A2 2 0 0 1 21.5 12 V15 A1.6 1.6 0 0 1 19.9 16.6 H4 A1.6 1.6 0 0 1 2.4 15 Z')),
    k.cream(k.union(k.poly([[8.8, 6.6], [10.6, 6.6], [10.6, 10], [7.3, 10]], 0.5), k.poly([[12.2, 6.6], [13, 6.6], [15.8, 10], [12.2, 10]], 0.5)), { ow: 0.45 }),
    k.rose(k.union(k.disc(7.2, 16.6, 2.4), k.disc(16.8, 16.6, 2.4)), { plate: 'A' }),
    k.pearl(7.2, 16.6, 0.85, { plate: 'A' }), k.pearl(16.8, 16.6, 0.85, { plate: 'A' }),
    k.bow(10.8, 4.6, 0.5, 0),
  ],
  // a blush screen frame, rose waves, a pearl at the source
  cast: (icon, k) => [
    k.body(k.tube('M2.2 7.6 V6.2 A2.2 2.2 0 0 1 4.4 4 H19.6 A2.2 2.2 0 0 1 21.8 6.2 V17.8 A2.2 2.2 0 0 1 19.6 20 H14.6', 2.4)),
    k.rose(k.tube('M2.2 15 A5 5 0 0 1 7.2 20 M2.2 11 A9 9 0 0 1 11.2 20', 2), { plate: 'A' }),
    k.pearl(3.3, 18.9, 1.45),
    k.bow(19.8, 4.2, 0.5, 18),
  ],
  // a blush kitten with the line style's face in ink (dot eyes, a little nose), a bow on one ear
  cat: (icon, k) => [
    k.body(k.path('M12 20.5 C7 20.5 3.5 18 3.5 13.75 C3.5 11.75 3.9 10.25 4.5 9 V4 L9.5 6.5 C10.25 6.25 11.25 6 12 6 C12.75 6 13.75 6.25 14.5 6.5 L19.5 4 V9 C20.1 10.25 20.5 11.75 20.5 13.75 C20.5 18 17 20.5 12 20.5 Z')),
    k.rose(k.union(k.poly([[5.8, 6.4], [5.8, 9.2], [8.2, 7.6]], 0.4), k.poly([[18.2, 6.4], [18.2, 9.2], [15.8, 7.6]], 0.4)), { plate: 'K', ow: 0 }),
    k.ink('M8.5 12 V13 M15.5 12 V13', 1.7),
    k.fill(k.poly([[10.9, 15.8], [13.1, 15.8], [12, 17.1]], 0.35), 'ink'),
    k.bow(17.6, 4.6, 0.55, 20),
  ],
  // a blush area chart on rose axes, pearls along its ridge
  'chart-area': (icon, k) => [
    k.rose(k.tube('M3.5 3.6 V18.5 A2 2 0 0 0 5.5 20.5 H20.4', 1.9), { plate: 'K' }),
    k.body(k.poly([[7.4, 16.8], [7.4, 12], [11.5, 8], [15, 11.5], [20.6, 5.8], [20.6, 16.8]], 1)),
    k.pearl(11.5, 8.2, 0.9), k.pearl(15, 11.6, 0.9), k.pearl(20.4, 6.2, 0.9),
  ],
  // blush bars on a rose baseline, the tallest ribbon red, a bow on top
  'chart-bar': (icon, k) => [
    k.body(k.union(k.rr(4.4, 12, 9.2, 20.6, [1.5, 1.5, 0, 0]), k.rr(14.8, 8.6, 19.6, 20.6, [1.5, 1.5, 0, 0]))),
    k.rose(k.rr(9.6, 5.4, 14.4, 20.6, [1.5, 1.5, 0, 0]), { plate: 'K' }),
    k.rose(k.tube('M2.6 20.6 H21.4', 1.9), { plate: 'K' }),
    k.bow(12, 4.6, 0.52, 0),
  ],
  // a satin line chart with pearl joints and a heart at its peak
  'chart-line': (icon, k) => [
    k.rose(k.tube('M3.5 3.6 V18.5 A2 2 0 0 0 5.5 20.5 H20.4', 1.9), { plate: 'K' }),
    k.body(k.tube('M7.5 15.6 L11.5 10 L15 13.5 L18.4 9', 2.6)),
    k.pearl(11.5, 10, 0.95), k.pearl(15, 13.5, 0.95),
    capHeart(k, [18.4, 9], [15, 13.5], 4.4),
  ],
  // a blush pie, its rose slice lifted out, a gold twinkle
  'chart-pie': (icon, k) => [
    k.body(k.path('M10 14 V6.5 A7.5 7.5 0 1 0 17.5 14 Z')),
    k.rose(k.path('M13.6 10.4 V2.6 A7.8 7.8 0 0 1 21.4 10.4 Z'), { plate: 'A' }),
    k.heart(8.8, 15.4, 4.2, 0, { plate: 'K' }),
  ],
  // two satin checks, blush and rose, a little heart
  'check-check': (icon, k) => [
    k.rose(k.tube('M11.6 16.6 L12.6 17.6 L21.8 7.2', 2.8), { plate: 'A' }),
    k.body(k.tube('M3 13.8 L6.6 17.6 L16 7.2', 2.8)),
    capHeart(k, [3, 13.8], [6.6, 17.6], 4.4),
  ],
  // a blush tile, a ribbon-red check, a bow on its corner
  'check-square': (icon, k) => [
    k.body(k.rr(3, 3.4, 21, 21, 2.6)),
    k.satin(k.tube('M7.8 12.6 L10.8 15.6 L16.2 9.6', 2.5), { plate: 'S' }),
    k.bow(18.8, 4.6, 0.55, 18),
  ],
  // a cream toque on a blush band with a little heart
  'chef-hat': (icon, k) => [
    k.cream(k.union(k.disc(8.6, 10.4, 3.9), k.disc(12, 7.2, 4), k.disc(15.4, 10.4, 3.9), k.rr(6.4, 10, 17.6, 17.4, 0)), {
      detail: k.tube('M10 13.8 V16.8 M14 13.8 V16.8', 0.9),
    }),
    k.body(k.rr(6.2, 16.8, 17.8, 21.2, [0.4, 0.4, 2, 2])),
    k.heart(12, 19, 3.4, 0, { plate: 'K' }),
  ],

  // ---- chevrons: satin ribbons with a little heart in the free corner -----------
  'chevron-down': (icon, k) => [chev(k, [[5.6, 8.6], [12, 15], [18.4, 8.6]]), vHeart(k, 12, 14, 0)],
  'chevron-up': (icon, k) => [chev(k, [[5.6, 15.4], [12, 9], [18.4, 15.4]]), vHeart(k, 12, 10, 180)],
  'chevron-left': (icon, k) => [chev(k, [[15.4, 5.6], [9, 12], [15.4, 18.4]]), vHeart(k, 10, 12, 90)],
  'chevron-right': (icon, k) => [chev(k, [[8.6, 5.6], [15, 12], [8.6, 18.4]]), vHeart(k, 14, 12, -90)],
  'chevron-first': (icon, k) => [
    k.rose(k.tube('M6.6 5.8 V18.2', 2.8), { plate: 'A' }),
    chev(k, [[17.6, 5.8], [11.4, 12], [17.6, 18.2]]),
    vHeart(k, 12.4, 12, 90),
  ],
  'chevron-last': (icon, k) => [
    k.rose(k.tube('M17.4 5.8 V18.2', 2.8), { plate: 'A' }),
    chev(k, [[6.4, 5.8], [12.6, 12], [6.4, 18.2]]),
    vHeart(k, 11.6, 12, -90),
  ],
  'chevrons-down': (icon, k) => [
    chev(k, [[6, 5.4], [12, 11.4], [18, 5.4]]),
    chev(k, [[6, 12.2], [12, 18.2], [18, 12.2]], { rose: true, plate: 'A' }),
    vHeart(k, 12, 17.2, 0, 4.6, 'A'),
  ],
  'chevrons-up': (icon, k) => [
    chev(k, [[6, 18.6], [12, 12.6], [18, 18.6]], { rose: true, plate: 'A' }),
    chev(k, [[6, 11.8], [12, 5.8], [18, 11.8]]),
    vHeart(k, 12, 6.8, 180),
  ],
  'chevrons-left': (icon, k) => [
    chev(k, [[18.2, 6], [12.2, 12], [18.2, 18]], { rose: true, plate: 'A' }),
    chev(k, [[11.6, 6], [5.6, 12], [11.6, 18]]),
    vHeart(k, 6.6, 12, 90),
  ],
  'chevrons-right': (icon, k) => [
    chev(k, [[5.8, 6], [11.8, 12], [5.8, 18]], { rose: true, plate: 'A' }),
    chev(k, [[12.4, 6], [18.4, 12], [12.4, 18]]),
    vHeart(k, 17.4, 12, -90),
  ],
  'chevrons-up-down': (icon, k) => [
    chev(k, [[6.8, 9], [12, 3.8], [17.2, 9]]),
    chev(k, [[6.8, 15], [12, 20.2], [17.2, 15]]),
    vHeart(k, 12, 5, 180),
  ],
}

// the calendar exemplar's page: cream sheet, blush header, gold binder rings, plus the day mark
function calPage(k, mark) {
  const page = k.rr(3, 5, 21, 21, 2.6)
  return [
    k.cream(page),
    k.body(k.inter(page, k.rect(2, 4, 22, 9.6))),
    mark,
    k.gold(k.union(k.pill(7, 2.6, 9.2, 7.2), k.pill(14.8, 2.6, 17, 7.2)), { plate: 'A' }),
  ]
}
