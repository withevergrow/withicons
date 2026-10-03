// COQUETTE redraw chunk 2 of 5: hand-composed icons for this chunk's redrawer.
// Each entry maps an icon name to (icon, k) => parts (k = the frozen kit, see
// forge/styles/COQUETTE-GUIDE.md). Entries in the EXEMPLAR map (_coquette-exemplars.mjs) win.
//
// Chunk 2 = icons 101-200 (circle-arrow-left .. gem). Exemplars in this range (cloud,
// coffee, file, folder) are skipped; their families are built the exemplar way here.

// ---------------------------------------------------------------------------
// local family builders

// round buttons: a blush satin disc on a lace doily, the glyph in ribbon-red satin
// (a light doily: fewer, larger scallops on a thin band, so the glyph keeps its room and the
// markup stays small)
const doily = k => k.lace(k.circlePts(12, 12, 8.55), 1, { closed: true, step: 2.6, band: 0.6, eyelets: false })
const button = (k, ...glyph) => [doily(k), k.body(k.disc(12, 12, 8.4)), ...glyph]
const red = (k, d, w = 2.5, plate = 'A') => k.satin(k.tube(d, w), { plate })
// scale absolute path data (M L H V) or points about (12, 12): the button glyphs at 1.1x
const sc = (d, f = 1.1) => {
  const S = v => +(12 + (v - 12) * f).toFixed(2)
  if (Array.isArray(d)) return d.map(([x, y]) => [S(x), S(y)])
  // every number in these M/L/H/V paths is a coordinate, so each one scales about 12
  return d.replace(/-?[\d.]+/g, n => String(S(+n)))
}

// files: a cream page with a blush dog-ear (the exemplar build) and its bow
const PAGE = [[5, 3], [13.6, 3], [19, 8.4], [19, 21], [5, 21]]
const page = k => k.poly(PAGE, 2)
const filePage = k => [
  k.cream(page(k)),
  k.body(k.poly([[13.4, 3.4], [13.4, 8.6], [18.6, 8.6]], 0.7), { plate: 'A' }),
]
const fileBow = k => k.bow(6.3, 4.8, 0.62, -18)
const fileGlyph = (k, d, w = 2.2) => red(k, d, w, 'A')

// folders: rose back with its tab, a cream sheet, the blush front
const folderBack = k => [
  k.rose(k.union(k.rr(2.5, 5, 21.5, 19.5, 2.2), k.rr(2.5, 3.6, 10.4, 8, 1.8)), { plate: 'K' }),
  k.cream(k.rr(4.6, 7, 19.4, 14, 1), { plate: 'A' }),
]
const folderFront = k => k.body(k.rr(2.5, 9.4, 21.5, 20.5, 2.2))

// clouds: the exemplar cloud, scaled about (12, 13) and moved
const cloudF = (k, s = 1, dx = 0, dy = 0) => {
  const X = x => 12 + (x - 12) * s + dx, Y = y => 13 + (y - 13) * s + dy
  return k.union(
    k.disc(X(8.2), Y(14.2), 4 * s), k.disc(X(13), Y(11.6), 5.3 * s), k.disc(X(17.4), Y(14.6), 3.6 * s),
    k.pill(X(3.6), Y(13.6), X(21), Y(19.6)),
  )
}

// clipboard: blush board, cream paper, gold clip, bow on the board's corner
const clipboard = k => [
  k.body(k.rr(4.5, 4.5, 19.5, 21.5, 2.4)),
  k.cream(k.rr(6.7, 7.8, 17.3, 19.5, 1)),
  k.gold(k.rr(8.4, 2.4, 15.6, 6.7, 1.4), { plate: 'A' }),
  k.fill(k.pill(10.4, 3.7, 13.6, 4.9), 'c2', { plate: 'A' }),
]
const clipBow = k => k.bow(5.4, 5.6, 0.55, -18)

// the eye: a cream almond with lashes, a rose iris, a ribbon-red heart pupil
const ALMOND = 'M2.5 12.8 C4.5 8.3 8 5.8 12 5.8 C16 5.8 19.5 8.3 21.5 12.8 C19.5 17.3 16 19.8 12 19.8 C8 19.8 4.5 17.3 2.5 12.8 Z'
const LASHES = 'M6.6 7.9 L5.2 5.6 M12 5.8 V3 M17.4 7.9 L18.8 5.6'

// ---------------------------------------------------------------------------
export const R = {
  // ---- round buttons -------------------------------------------------------
  'circle-arrow-left': (icon, k) => button(k, red(k, sc('M16.2 12 H8 M11.8 8 L7.8 12 L11.8 16'), 2.7)),
  'circle-arrow-right': (icon, k) => button(k, red(k, sc('M7.8 12 H16 M12.2 8 L16.2 12 L12.2 16'), 2.7)),
  'circle-arrow-up': (icon, k) => button(k, red(k, sc('M12 16.2 V8 M8 11.8 L12 7.8 L16 11.8'), 2.7)),
  'circle-chevron-down': (icon, k) => button(k, red(k, sc('M7.6 10 L12 14.4 L16.4 10'), 2.9)),
  'circle-chevron-right': (icon, k) => button(k, red(k, sc('M10 7.6 L14.4 12 L10 16.4'), 2.9)),
  'circle-pause': (icon, k) => button(k, red(k, sc('M9.5 8.5 V15.5 M14.5 8.5 V15.5'), 2.8)),
  'circle-play': (icon, k) => button(k, k.satin(k.poly(sc([[9.6, 7.9], [9.6, 16.1], [16.4, 12]]), 1.1), { plate: 'A' })),
  'circle-stop': (icon, k) => button(k, k.satin(k.rr(8.25, 8.25, 15.75, 15.75, 1.7), { plate: 'A' })),
  // a pearl button: one big pearl set in a ribbon-red bezel
  'circle-dot': (icon, k) => button(k, k.satin(k.ring(12, 12, 4.6, 1.7), { plate: 'A' }), k.pearl(12, 12, 2.85, { plate: 'A' })),
  // the plain circle: a satin disc on its doily, a bow on top (structural: it moves with the disc)
  circle: (icon, k) => [...button(k), k.bow(12, 4.5, 0.59, 0)],

  // ---- time, direction, faces -----------------------------------------------
  // a gold-rimmed cream clock face, ribbon-red hands, pearl hub, a bow on the rim
  clock: (icon, k) => [
    k.gold(k.disc(12, 12.4, 9.4), { plate: 'K' }),
    k.cream(k.disc(12, 12.4, 7.5), { ow: 0.5 }),
    k.fill(k.union(k.disc(12, 6.6, 0.75), k.disc(17.8, 12.4, 0.75), k.disc(12, 18.2, 0.75), k.disc(6.2, 12.4, 0.75)), 'c2'),
    k.satin(k.tube('M12 7.9 V12.4 L15.4 14.3', 1.7), { plate: 'A' }),
    k.pearl(12, 12.4, 1, { plate: 'A' }),
    k.bow(18.2, 5.4, 0.58, 24),
  ],
  // gold bezel, blush face, a ribbon-red and cream needle on a pearl pivot
  compass: (icon, k) => [
    k.gold(k.disc(12, 12.4, 9.4), { plate: 'K' }),
    k.body(k.disc(12, 12.4, 7.5), { ow: 0.5 }),
    k.satin(k.poly([[10.2, 10.6], [16.2, 6.2], [13.8, 14.2]], 0.5), { plate: 'A' }),
    k.cream(k.poly([[10.2, 10.6], [13.8, 14.2], [7.8, 18.6]], 0.5), { plate: 'A' }),
    k.pearl(12, 12.4, 0.95, { plate: 'A' }),
    k.sparkle(3.5, 3.6, 1.6),
  ],
  // a blush face with a sad mouth and a hair bow
  frown: (icon, k) => [
    k.body(k.disc(12, 12.6, 9.2)),
    k.ink(k.union(k.pill(8.2, 8.8, 9.8, 11.4), k.pill(14.2, 8.8, 15.8, 11.4))),
    k.ink('M8.2 17.4 A4.6 4.6 0 0 1 15.8 17.4', 1.35),
    k.bow(17.4, 4.6, 0.62, 22),
  ],
  // a blush ball: ribbon-red centre patch, fine seams, a bow on the crown
  football: (icon, k) => [
    k.body(k.disc(12, 12.4, 9.3)),
    k.ink('M12 8.4 V3.4 M16 11.4 L20.6 9.6 M14.5 15.4 L17.4 19.8 M9.5 15.4 L6.6 19.8 M8 11.4 L3.4 9.6', 0.9),
    k.satin(k.poly([[12, 8.1], [16.3, 11.2], [14.7, 15.6], [9.3, 15.6], [7.7, 11.2]], 0.7), { plate: 'K' }),
    k.bow(18.4, 4.6, 0.58, 22),
  ],
  // a blush disc with a rose label, a cream hub and a gold twinkle
  disc: (icon, k) => [
    k.body(k.disc(12, 12.4, 9.3)),
    k.rose(k.disc(12, 12.4, 4.6), { plate: 'A' }),
    k.cream(k.cut(k.disc(12, 12.4, 2.2), k.disc(12, 12.4, 0.85)), { plate: 'A', ow: 0.5 }),
    k.fill(k.tube('M6.3 12 A5.8 5.8 0 0 1 11.6 6.6', 1.1), 'edge'),
    k.sparkle(20.2, 3.8, 1.6),
  ],
  // a cream dough ring dipped in blush icing with a soft, uneven drip edge, a few sprinkles
  donut: (icon, k) => {
    const icing = []
    for (let i = 0; i < 72; i++) {
      const a = i * 5 * Math.PI / 180
      // soft drips of different lengths (no regular teeth): gaussian bumps on a round edge
      let r = 6.3
      for (const [c, h, w] of [[40, 1.1, 16], [100, 1.4, 14], [150, 0.8, 13], [215, 1.0, 15], [300, 0.6, 18]]) {
        const dd = ((i * 5 - c + 540) % 360) - 180
        r += h * Math.exp(-(dd * dd) / (2 * w * w))
      }
      icing.push([12 + r * Math.cos(a), 12.4 + r * Math.sin(a)])
    }
    // sprinkles at radius ~5.1 from the centre, each a short tilted dash
    const dash = (deg, tilt) => {
      const a = deg * Math.PI / 180, x = 12 + 5.1 * Math.cos(a), y = 12.4 + 5.1 * Math.sin(a), t = (deg + tilt) * Math.PI / 180
      return k.seg(x - 0.8 * Math.cos(t), y - 0.8 * Math.sin(t), x + 0.8 * Math.cos(t), y + 0.8 * Math.sin(t), 1.15)
    }
    return [
      k.cream(k.cut(k.disc(12, 12.4, 9.4), k.disc(12, 12.4, 2.6))),
      k.body(k.cut(k.poly(icing, 0.3), k.disc(12, 12.4, 3.6)), { plate: 'A' }),
      k.fill(k.union(dash(-100, 70), dash(140, 60), dash(30, 100)), 'c3', { plate: 'A' }),
      k.fill(k.union(dash(-30, 40), dash(80, 50)), 'edge', { plate: 'A' }),
    ]
  },
  // a blush cookie with a bite, rose chips and one red heart chip
  cookie: (icon, k) => [
    k.body(k.path('M15 3 A9.5 9.5 0 1 0 21 9 A2.25 2.25 0 0 1 18 6 A2.25 2.25 0 0 1 15 3 Z')),
    k.fill(k.union(k.disc(8.6, 9.2, 1.05), k.disc(9.2, 15.6, 1.05), k.disc(14.8, 16.1, 1.05)), 'c2'),
    k.heart(13.9, 10.6, 3.6, 10, { plate: 'K' }),
  ],

  // ---- glyphs and arrows (satin ribbons) --------------------------------------
  // the x as a satin ribbon, one end finished with a ribbon-red heart (the heart is the end cap)
  close: (icon, k) => [
    k.body(k.tube('M6 6.4 L18 18.4 M16.4 8 L6 18.4', 3.1)),
    k.heart(18.1, 6.3, 5.6, 45, { plate: 'K' }),
  ],
  // satin brackets, the slash in ribbon red (the red is the accent: no extra crumb)
  code: (icon, k) => [
    k.body(k.tube('M7.4 7 L2.8 12 L7.4 17 M16.6 7 L21.2 12 L16.6 17', 2.8)),
    k.satin(k.seg(13.1, 4.8, 10.9, 19.2, 2.4), { plate: 'A' }),
    k.pearl(13.2, 4.4, 1.15, { plate: 'A' }),
  ],
  'corner-down-left': (icon, k) => [
    k.body(k.union(k.tube('M18.8 5 V11 A4 4 0 0 1 14.8 15 H4.6', 3), k.tube('M9.6 9.8 L4.6 15 L9.6 20.2', 3))),
    k.bow(18.8, 4.6, 0.66, 0),
  ],
  'corner-down-right': (icon, k) => [
    k.body(k.union(k.tube('M5.2 5 V11 A4 4 0 0 0 9.2 15 H19.4', 3), k.tube('M14.4 9.8 L19.4 15 L14.4 20.2', 3))),
    k.bow(5.2, 4.6, 0.66, 0),
  ],
  forward: (icon, k) => [
    k.body(k.union(k.tube('M20.4 9.2 H11 A7 7 0 0 0 4 16.2 V18.8', 3), k.tube('M15.4 4.1 L20.5 9.2 L15.4 14.3', 3))),
    k.bow(4, 18.6, 0.7, 0),
  ],
  // two satin crop handles (blush and rose) framing a red heart
  crop: (icon, k) => [
    k.rose(k.tube('M2.6 6.5 H15.5 A2 2 0 0 1 17.5 8.5 V21.4', 2.6), { plate: 'A' }),
    k.body(k.tube('M6.5 2.6 V15.5 A2 2 0 0 0 8.5 17.5 H21.4', 2.6)),
    k.heart(12, 12.3, 4.6),
  ],
  // a satin ring with four ticks and a heart at the centre of the aim
  crosshair: (icon, k) => [
    k.body(k.union(k.ring(12, 12, 7.3, 2.4), k.tube('M12 2.2 V6.6 M12 17.4 V21.8 M2.2 12 H6.6 M17.4 12 H21.8', 2.4))),
    k.heart(12, 12.2, 4.2, 0, { plate: 'A' }),
  ],
  // a blush pointer and a gold twinkle by its tip
  cursor: (icon, k) => [
    k.body(k.union(k.poly([[5, 2.6], [18.8, 12.4], [11.6, 13.4], [7.6, 19.2]], 0.9), k.seg(11.8, 13.6, 15.2, 20.4, 2.6))),
    k.sparkle(17.6, 4.4, 1.8),
  ],
  // six rose satin beads with a firm wine line (they must hold at 24px)
  'drag-handle': (icon, k) => [
    k.rose(k.union([5, 12, 19].flatMap(y => [k.disc(8.8, y, 1.9), k.disc(15.2, y, 1.9)])), { plate: 'K', ow: 0.72 }),
  ],
  // a rose tray, the blush satin arrow dropping into it with the bow on its tail (arrow family)
  download: (icon, k) => [
    k.rose(k.tube('M3.6 14.2 V18.4 A2 2 0 0 0 5.6 20.4 H18.4 A2 2 0 0 0 20.4 18.4 V14.2', 2.8), { plate: 'K' }),
    k.body(k.union(k.tube('M12 4.6 V14.4', 2.9), k.tube('M7.4 9.8 L12 14.4 L16.6 9.8', 2.9)), { plate: 'A' }),
    k.bow(12, 4.2, 0.64, 0, { plate: 'A' }),
  ],
  // a blush box open at its top-right corner (as in line), the ribbon-red arrow leaving
  // through the opening on its own, a bow tied on the box's lower-left corner
  'external-link': (icon, k) => {
    const arrow = k.union(k.tube('M12.2 11.8 L20.2 3.8', 2.6), k.tube('M14.6 3.6 H20.4 V9.4', 2.6))
    const box = k.cut(k.rr(3.4, 5, 19, 20.6, 2.4), k.rr(11.2, -4, 28, 13.6, [0, 0, 0, 2.2]))
    return [
      k.body(k.moat(box, arrow, 0.7)),
      k.satin(arrow, { plate: 'A' }),
      k.bow(4.6, 19.2, 0.56, -18),
    ]
  },
  // two satin triangles, a bow tied on the back one's upper corner
  'fast-forward': (icon, k) => [
    k.rose(k.poly([[2.5, 5.6], [2.5, 18.4], [11, 12]], 1.1), { plate: 'A' }),
    k.body(k.poly([[12.6, 5.6], [12.6, 18.4], [21.4, 12]], 1.1)),
    k.bow(3.4, 6.2, 0.56, -18),
  ],
  // money glyphs: blush satin ribbons, gold bars, a twinkle
  'dollar-sign': (icon, k) => [
    k.gold(k.tube('M12 2.4 V5.4 M12 18.6 V21.6', 2.2), { plate: 'A' }),
    k.body(k.tube('M16.5 7.5 C15.9 5.9 14.2 5 12 5 C9.2 5 7.5 6.4 7.5 8.4 C7.5 10.5 9.4 11.3 12 11.9 C14.6 12.5 16.5 13.3 16.5 15.6 C16.5 17.7 14.6 19 12 19 C9.6 19 7.9 18.1 7.5 16.5', 2.8)),
    k.sparkle(19.2, 3.8, 1.6),
  ],
  euro: (icon, k) => [
    k.body(k.tube('M18.5 7 A7 7 0 1 0 18.5 17', 2.8)),
    k.satin(k.tube('M3.8 10 H12.6 M3.8 14 H12.6', 2), { plate: 'A' }),
    k.sparkle(20.4, 3.4, 1.6),
  ],

  // ---- clouds ------------------------------------------------------------------
  // a full-size cloud, the ribbon-red arrow cut free of it by a clean moat and dropping out
  // below its base, the bow off-centre on the crown
  'cloud-download': (icon, k) => {
    const arrow = k.union(k.tube('M12 11.4 V21', 2.5), k.tube('M8.7 17.7 L12 21 L15.3 17.7', 2.5))
    return [
      k.body(k.moat(cloudF(k, 0.98, 0, -3.8), arrow, 0.75)),
      k.satin(arrow, { plate: 'S' }),
      k.bow(15.7, 3.6, 0.56, 16),
    ]
  },
  'cloud-upload': (icon, k) => {
    const arrow = k.union(k.tube('M12 21.2 V11.2', 2.5), k.tube('M8.7 14.5 L12 11.2 L15.3 14.5', 2.5))
    return [
      k.body(k.moat(cloudF(k, 0.98, 0, -3.8), arrow, 0.75)),
      k.satin(arrow, { plate: 'S' }),
      k.bow(15.7, 3.6, 0.56, 16),
    ]
  },
  'cloud-lightning': (icon, k) => {
    const bolt = k.poly([[13.8, 9.2], [9.4, 16.4], [12.6, 16.4], [11.2, 22.2], [16.2, 13.8], [13, 13.8], [14.8, 9.2]], 0.45)
    return [
      k.body(k.moat(cloudF(k, 0.9, 0, -3.4), bolt, 0.8)),
      k.gold(bolt, { plate: 'A' }),
      k.bow(14.9, 4.4, 0.54, 14),
    ]
  },
  'cloud-off': (icon, k) => {
    const slash = k.seg(3.4, 3.6, 20.6, 20.8, 2)
    return [
      k.body(k.moat(cloudF(k), slash, 0.8)),
      k.satin(slash, { plate: 'S' }),
    ]
  },
  // rose satin rain under the cloud
  'cloud-rain': (icon, k) => [
    k.rose(k.tube('M8.4 17.6 L7 20.8 M12.6 17.6 L11.2 20.8 M16.8 17.6 L15.4 20.8', 2), { plate: 'A' }),
    k.body(cloudF(k, 0.9, 0, -3.4)),
    k.bow(14.9, 4.4, 0.54, 14),
  ],
  // pearls falling as snow
  'cloud-snow': (icon, k) => [
    k.body(cloudF(k, 0.9, 0, -3.4)),
    k.pearl(8, 17.6, 0.95, { plate: 'A' }), k.pearl(12, 17.6, 0.95, { plate: 'A' }), k.pearl(16, 17.6, 0.95, { plate: 'A' }),
    k.pearl(10, 20.8, 0.95, { plate: 'A' }), k.pearl(14, 20.8, 0.95, { plate: 'A' }),
    k.bow(14.9, 4.4, 0.54, 14),
  ],
  // a gold sun peeking over a small blush cloud
  'cloud-sun': (icon, k) => [
    k.gold(k.tube('M9 1.8 V3.2 M3.9 3.9 L4.9 4.9 M1.8 9 H3.2 M14.1 3.9 L13.1 4.9 M3.9 14.1 L4.9 13.1', 1.6), { plate: 'A' }),
    k.gold(k.disc(9, 9, 4.1), { plate: 'A' }),
    k.body(cloudF(k, 0.74, 2.8, 2.6)),
  ],

  // ---- clipboards -------------------------------------------------------------
  clipboard: (icon, k) => [...clipboard(k), k.fill(k.tube('M9 11.4 H15 M9 14.4 H15 M9 17.2 H12.6', 1.2), 'c2'), clipBow(k)],
  'clipboard-check': (icon, k) => [...clipboard(k), red(k, 'M8.6 13.6 L11 16 L15.6 11.2', 2.3), clipBow(k)],
  'clipboard-list': (icon, k) => [
    ...clipboard(k),
    k.fill(k.tube('M12 11.6 H15.2 M12 16 H15.2', 1.3), 'c2'),
    k.pearl(9.3, 11.6, 0.95, { plate: 'A' }), k.pearl(9.3, 16, 0.95, { plate: 'A' }),
    clipBow(k),
  ],

  // ---- files --------------------------------------------------------------------
  'file-check': (icon, k) => [...filePage(k), fileGlyph(k, 'M8.6 14.6 L11 17 L15.4 12.2'), fileBow(k)],
  'file-down': (icon, k) => [...filePage(k), fileGlyph(k, 'M12 11.4 V17.8 M9.1 15 L12 17.9 L14.9 15'), fileBow(k)],
  'file-up': (icon, k) => [...filePage(k), fileGlyph(k, 'M12 18 V11.6 M9.1 14.5 L12 11.6 L14.9 14.5'), fileBow(k)],
  'file-plus': (icon, k) => [...filePage(k), fileGlyph(k, 'M12 11.6 V17.6 M9 14.6 H15'), fileBow(k)],
  'file-minus': (icon, k) => [...filePage(k), fileGlyph(k, 'M9 14.6 H15'), fileBow(k)],
  'file-x': (icon, k) => [...filePage(k), fileGlyph(k, 'M9.7 12.2 L14.3 16.8 M14.3 12.2 L9.7 16.8'), fileBow(k)],
  'file-code': (icon, k) => [...filePage(k), fileGlyph(k, 'M10 11.6 L8 14.6 L10 17.6 M14 11.6 L16 14.6 L14 17.6', 2), fileBow(k)],
  'file-pdf': (icon, k) => [...filePage(k), fileGlyph(k, 'M10 18 V11 H12.5 A2.25 2.25 0 0 1 12.5 15.5 H10', 2), fileBow(k)],
  'file-video': (icon, k) => [...filePage(k), k.satin(k.poly([[9.6, 10.8], [9.6, 18.2], [16, 14.5]], 0.9), { plate: 'A' }), fileBow(k)],
  'file-text': (icon, k) => [...filePage(k), k.fill(k.tube('M8.5 10 H11 M8.5 13.4 H15.5 M8.5 16.8 H15.5', 1.25), 'c2'), fileBow(k)],
  'file-spreadsheet': (icon, k) => [
    ...filePage(k),
    k.rose(k.rr(7, 11.2, 17, 20, 1), { plate: 'A' }),
    k.fill(k.tube('M7.4 14 H16.6 M7.4 17 H16.6 M10.8 11.6 V19.6', 1), 'edge', { plate: 'A' }),
    fileBow(k),
  ],
  'file-image': (icon, k) => [
    ...filePage(k),
    k.rose(k.inter(k.inset(page(k), 0.3), k.poly([[7.6, 22], [15.6, 13.4], [21, 18.8], [21, 22]], 0.6)), { plate: 'A' }),
    k.gold(k.disc(9.8, 11.4, 1.6), { plate: 'A' }),
    fileBow(k),
  ],
  'file-audio': (icon, k) => [
    ...filePage(k),
    k.rose(k.tube('M12.6 16 V10.6 C13.1 12.1 16 12.6 16 15', 1.5), { plate: 'A' }),
    k.satin(k.heartShape(10.9, 16.4, 4.8, -12), { plate: 'A' }),
    fileBow(k),
  ],
  'file-lock': (icon, k) => [
    ...filePage(k),
    k.gold(k.tube('M10 13.8 V12.2 A2 2 0 0 1 14 12.2 V13.8', 1.4), { plate: 'A' }),
    k.body(k.rr(8.4, 13.4, 15.6, 18.8, 1.4), { plate: 'A' }),
    k.heart(12, 16.1, 3.2, 0, { plate: 'A' }),
    fileBow(k),
  ],
  'file-search': (icon, k) => [
    ...filePage(k),
    k.rose(k.seg(13.6, 16.3, 16.2, 18.9, 1.9), { plate: 'A' }),
    k.gold(k.ring(11.2, 13.8, 3.1, 1.5), { plate: 'A' }),
    k.body(k.disc(11.2, 13.8, 2.4), { plate: 'A', ow: 0 }),
    fileBow(k),
  ],
  // a zip folded into the page, its pull a ribbon-red heart
  'file-archive': (icon, k) => [
    ...filePage(k),
    k.gold(k.tube('M9.5 5 H11 M11 7.5 H12.5 M9.5 10 H11', 1.5), { plate: 'A' }),
    k.gold(k.tube('M11 11 V13.2', 1.3), { plate: 'A' }),
    k.heart(11, 16, 5, 0, { plate: 'A' }),
  ],
  // two pages: a rose one behind, the cream one in front with the bow
  files: (icon, k) => [
    k.rose(k.rr(3.4, 2.4, 14.6, 17.6, 2), { plate: 'A' }),
    k.cream(k.poly([[7.6, 6.5], [15.4, 6.5], [20.5, 11.6], [20.5, 21.5], [7.6, 21.5]], 2)),
    k.body(k.poly([[15.2, 6.9], [15.2, 11.8], [20.1, 11.8]], 0.7), { plate: 'A' }),
    k.fill(k.tube('M10.6 15 H17.4 M10.6 18 H15.2', 1.2), 'c2'),
    k.bow(8.8, 8.2, 0.55, -18),
  ],

  // ---- folders ------------------------------------------------------------------
  'folder-plus': (icon, k) => [...folderBack(k), folderFront(k), red(k, 'M12 11.9 V18 M8.95 14.95 H15.05', 2.4, 'S')],
  'folder-minus': (icon, k) => [...folderBack(k), folderFront(k), red(k, 'M8.95 14.95 H15.05', 2.4, 'S')],
  'folder-search': (icon, k) => [
    ...folderBack(k), folderFront(k),
    k.rose(k.seg(13.6, 16.6, 15.8, 18.8, 1.9), { plate: 'S' }),
    k.gold(k.ring(11.6, 14.6, 2.7, 1.5), { plate: 'S' }),
    k.cream(k.disc(11.6, 14.6, 2), { plate: 'S', ow: 0 }),
  ],
  'folder-open': (icon, k) => [
    k.rose(k.union(k.rr(2.5, 5, 18.6, 19.5, 2.2), k.rr(2.5, 3.6, 10.4, 8, 1.8)), { plate: 'K' }),
    k.cream(k.rr(4.6, 7, 16.8, 13.4, 1), { plate: 'A' }),
    k.body(k.poly([[3.6, 20.6], [6.9, 11.2], [21.8, 11.2], [18.6, 20.6]], 1.4), { plate: 'A' }),
    k.heart(12.8, 15.9, 4.6, 0, { plate: 'S' }),
  ],

  // ---- objects --------------------------------------------------------------------
  // a blush slate under a ribbon-red striped clapper, a heart on the slate
  clapperboard: (icon, k) => {
    const clap = k.poly([[3, 11], [20.6, 7], [19.8, 3.4], [2.2, 7.4]], 0.6)
    return [
      k.body(k.rr(3, 10.4, 21, 21, [0.6, 0.6, 2.4, 2.4])),
      k.satin(clap, { plate: 'A' }),
      k.fill(k.inter(k.inset(clap, 0.3), k.tube('M6.6 10.6 L8.8 5.6 M11.6 9.4 L13.8 4.4 M16.6 8.2 L18.8 3.2', 1.7)), 'edge', { plate: 'A' }),
      k.heart(12, 15.9, 4.6, 0, { plate: 'K' }),
    ]
  },
  // two stacks of gold coins, the front one stamped with a heart
  coins: (icon, k) => [
    k.gold(k.union(k.ellipse(8, 9, 6, 2.5), k.rect(2, 5, 14, 9)), { plate: 'A' }),
    k.gold(k.ellipse(8, 5, 6, 2.5), { plate: 'A' }),
    k.gold(k.union(k.ellipse(16, 19, 6, 2.5), k.rect(10, 15, 22, 19))),
    k.ink('M10.2 17 A6 2.5 0 0 0 21.8 17', 0.7),
    k.gold(k.ellipse(16, 15, 6, 2.5)),
    k.heart(16, 15.1, 3, 0, { plate: 'K' }),
    k.sparkle(20.4, 5.4, 1.6),
  ],
  // two panels, blush and cream, a bow on the corner
  columns: (icon, k) => [
    k.cream(k.rr(12, 3, 21, 21, [0, 2.4, 2.4, 0]), { plate: 'A' }),
    k.body(k.rr(3, 3, 12, 21, [2.4, 0, 0, 2.4])),
    k.bow(4.6, 4.4, 0.58, -18),
  ],
  // a blush pot with gold handles, a rose lid trimmed with lace, a heart
  'cooking-pot': (icon, k) => [
    k.gold(k.tube('M5 14 H2.4 M19 14 H21.6', 2), { plate: 'A' }),
    k.gold(k.pill(10.8, 2.6, 13.2, 6.4), { plate: 'A' }),
    k.body(k.rr(4.5, 10.4, 19.5, 21, [0, 0, 3, 3])),
    k.lace('M5.2 11.6 H18.8', 0.7),
    k.rose(k.union(k.path('M5.6 10 A6.4 4.2 0 0 1 18.4 10 Z'), k.pill(2.6, 8.8, 21.4, 11.2)), { plate: 'A' }),
    k.heart(12, 16.4, 4.4, 0, { plate: 'K' }),
  ],
  // a rose sheet behind a cream sheet with a bow
  copy: (icon, k) => [
    k.rose(k.rr(3, 3, 15, 15, 2.2), { plate: 'A' }),
    k.cream(k.rr(9, 9, 21, 21, 2.2)),
    k.fill(k.tube('M12.2 14.2 H17.8 M12.2 17.4 H16', 1.2), 'c2'),
    k.bow(19.6, 9.6, 0.55, 20),
  ],
  // a blush chip on gold pins, a rose die holding a heart
  cpu: (icon, k) => [
    k.gold(k.tube('M9 2.4 V5 M15 2.4 V5 M9 19 V21.6 M15 19 V21.6 M2.4 9 H5 M2.4 15 H5 M19 9 H21.6 M19 15 H21.6', 1.8), { plate: 'A' }),
    k.body(k.rr(5, 5, 19, 19, 2.6)),
    k.rose(k.rr(8.6, 8.6, 15.4, 15.4, 1.5), { plate: 'A' }),
    k.heart(12, 12.2, 3.8, 0, { plate: 'A' }),
  ],
  // a blush card with a rose stripe, a gold chip and a little heart logo
  'credit-card': (icon, k) => {
    const card = k.rr(2, 5, 22, 19, 2.4)
    return [
      k.body(card),
      k.rose(k.inter(card, k.rect(0, 8.2, 24, 10.8)), { plate: 'A', ow: 0.45 }),
      k.gold(k.rr(4.6, 12.2, 8.6, 15, 0.8), { plate: 'A' }),
      k.fill(k.tube('M4.8 16.8 H10.4', 1.1), 'c2'),
      k.heart(18.2, 15.2, 3.8, 0, { plate: 'A' }),
    ]
  },
  // a blush crown on a gold band, pearls on its points, a heart jewel
  crown: (icon, k) => [
    k.gold(k.rr(4.6, 17.4, 19.4, 20.8, 1.5), { plate: 'A' }),
    k.body(k.poly([[5, 16.4], [3, 7], [8, 10.5], [12, 4], [16, 10.5], [21, 7], [19, 16.4]], 0.9)),
    k.heart(12, 12.6, 4, 0, { plate: 'K' }),
    k.pearl(3.2, 6.4, 1.3, { plate: 'K' }), k.pearl(12, 3.4, 1.35, { plate: 'K' }), k.pearl(20.8, 6.4, 1.3, { plate: 'K' }),
  ],
  // a blush cup, a rose lid, a cream straw and a heart
  'cup-soda': (icon, k) => [
    k.cream(k.tube('M12.2 8 L13.6 2.6 H17', 1.7), { plate: 'A' }),
    k.body(k.path('M5.4 8.6 L6.6 20 A1.5 1.5 0 0 0 8.1 21.5 H15.9 A1.5 1.5 0 0 0 17.4 20 L18.6 8.6 Z')),
    k.rose(k.pill(3.4, 7, 20.6, 9.8), { plate: 'A' }),
    k.heart(12, 15, 4.6, 0, { plate: 'K' }),
  ],
  // a blush cylinder, a pearl string round its middle
  database: (icon, k) => [
    k.body(k.union(k.ellipse(12, 18.5, 8, 3), k.rect(4, 5.5, 20, 18.5))),
    k.body(k.ellipse(12, 5.5, 8, 3)),
    k.pearls('M4.6 12.3 A7.4 2.8 0 0 0 19.4 12.3', 0.88),
  ],
  // two satin strands, blush and rose, with pearl rungs
  dna: (icon, k) => [
    k.wire('M9 4 H15 M9.5 10 H14.5 M9.5 14 H14.5 M9 20 H15', 1.2),
    k.rose(k.tube('M17 2.5 C17 7.5 7 7 7 12 C7 17 17 16.5 17 21.5', 2.3), { plate: 'A' }),
    k.body(k.tube('M7 2.5 C7 7.5 17 7 17 12 C17 17 7 16.5 7 21.5', 2.3)),
  ],
  // a blush pup: a wide head, rose ears tucked against it, ink dot eyes and nose, a bow on one ear
  dog: (icon, k) => [
    k.rose(k.union(
      k.path('M9.4 5 C6.8 3.6 3.5 4.5 2.8 7.8 C2.2 10.6 2.5 13.8 3.9 14.8 C5.1 15.6 6.6 14.4 7.4 12.2 Z'),
      k.path('M14.6 5 C17.2 3.6 20.5 4.5 21.2 7.8 C21.8 10.6 21.5 13.8 20.1 14.8 C18.9 15.6 17.4 14.4 16.6 12.2 Z'),
    ), { plate: 'A' }),
    k.body(k.path('M12 4.4 C15.7 4.4 17.9 6.7 17.9 9.9 V14 C17.9 18.2 15.4 20.7 12 20.7 C8.6 20.7 6.1 18.2 6.1 14 V9.9 C6.1 6.7 8.3 4.4 12 4.4 Z')),
    k.ink(k.union(k.disc(9.9, 11, 1.05), k.disc(14.1, 11, 1.05), k.poly([[10.2, 14.5], [13.8, 14.5], [12, 16.8]], 0.65))),
    k.bow(4.4, 5.6, 0.6, -22, { plate: 'A' }), // tied on the ear: it moves with it
  ],
  // an open blush door in a rose frame, a pearl knob and a heart
  'door-open': (icon, k) => [
    k.rose(k.union(k.tube('M14 3 H7 A2 2 0 0 0 5 5 V21', 2.2), k.tube('M2.6 21 H21.4', 2)), { plate: 'K' }),
    k.cream(k.rect(6.2, 4.2, 14, 19.9), { ow: 0 }),
    k.body(k.poly([[14, 2.8], [19.6, 4.4], [19.6, 19.6], [14, 21.2]], 0.6), { plate: 'A' }),
    k.pearl(16.4, 12.3, 0.8, { plate: 'A' }),
    k.heart(16.8, 8, 2.9, 0, { plate: 'A' }),
  ],
  // a blush droplet and a gold twinkle
  droplet: (icon, k) => [
    k.body(k.path('M12 2.5 C14.5 6 19 10 19 14.5 A7 7 0 0 1 5 14.5 C5 10 9.5 6 12 2.5 Z')),
    k.heart(12, 15.2, 4, 0, { mat: 'rose' }),
    k.sparkle(18.6, 4.6, 1.6),
  ],
  // blush weights on a gold bar, a bow tied on the grip
  dumbbell: (icon, k) => [
    k.gold(k.tube('M2.4 12 H21.6', 2.2), { plate: 'A' }),
    k.rose(k.union(k.pill(1.4, 8.2, 3.6, 15.8), k.pill(20.4, 8.2, 22.6, 15.8)), { plate: 'K' }),
    k.body(k.union(k.rr(5.8, 4.4, 9.6, 19.6, 1.6), k.rr(14.4, 4.4, 18.2, 19.6, 1.6))),
    k.bow(12, 11.6, 0.62, 0),
  ],
  // a cream sheet, a blush pencil with a red cap, a heart doodle
  edit: (icon, k) => {
    const pencil = k.poly([[9, 15], [10.06, 10.4], [17.13, 3.33], [18.9, 2.6], [20.67, 6.87], [13.6, 13.94]], 0.6)
    return [
      k.cream(k.moat(k.rr(3, 5, 19, 21, 2.4), pencil, 0.9)),
      k.heart(7.4, 17.4, 3.6, -8),
      k.body(pencil, { plate: 'A' }),
      k.satin(k.inter(pencil, k.side(17.3, 6.7, 45)), { plate: 'A', ow: 0.4 }),
      k.cream(k.inter(pencil, k.side(11.5, 12.5, 225)), { plate: 'A', ow: 0.4 }),
    ]
  },
  // a blush egg with a bow
  egg: (icon, k) => [
    k.body(k.path('M12 2.6 C16.25 2.6 19 8.75 19 13.75 C19 18.5 16 21.5 12 21.5 C8 21.5 5 18.5 5 13.75 C5 8.75 7.75 2.6 12 2.6 Z')),
    k.bow(15.8, 5.2, 0.58, 22),
  ],
  // a blush eraser with a rose tip, a twinkle where it rubbed
  eraser: (icon, k) => {
    const E = k.path('M9 20.5 L4.41 15.91 A2 2 0 0 1 4.41 13.09 L13.59 3.91 A2 2 0 0 1 16.41 3.91 L19.59 7.09 A2 2 0 0 1 19.59 9.91 Z')
    return [
      k.body(E),
      k.rose(k.inter(E, k.side(9.5, 14, 225)), { plate: 'A', ow: 0.45 }),
      k.fill(k.tube('M9.4 20.6 H20.6', 1.2), 'c2'),
      k.sparkle(19.4, 15.8, 1.6),
    ]
  },
  // a cream eye with lashes, a rose iris and a ribbon-red heart pupil
  eye: (icon, k) => [
    k.ink(LASHES, 1.15, { plate: 'deco' }),
    k.cream(k.path(ALMOND)),
    k.rose(k.disc(12, 12.8, 3.7), { plate: 'A' }),
    k.heart(12, 13, 3.4, 0, { plate: 'A' }),
  ],
  'eye-off': (icon, k) => {
    const slash = k.seg(3.6, 3.6, 20.4, 20.4, 2)
    return [
      k.cream(k.moat(k.path(ALMOND), slash, 0.8)),
      k.rose(k.moat(k.disc(12, 12.8, 3.7), slash, 0.8), { plate: 'A' }),
      k.satin(slash, { plate: 'S' }),
    ]
  },
  // a blush factory, a rose chimney with a heart, cream windows
  factory: (icon, k) => [
    k.rose(k.rr(16.4, 3.4, 20.6, 13, [1.2, 1.2, 0, 0]), { plate: 'A' }),
    k.body(k.poly([[3, 21], [3, 12], [8.2, 8.8], [8.2, 12], [13.4, 8.8], [13.4, 12], [20.6, 12], [20.6, 21]], 1)),
    k.cream(k.union(k.rr(5.4, 15.2, 8.4, 18.2, 0.7), k.rr(10.2, 15.2, 13.2, 18.2, 0.7)), { ow: 0.5 }),
    k.heart(18.5, 7.6, 3, 0, { plate: 'A' }),
  ],
  // a blush film frame on rose strips with cream holes, a heart in the picture
  film: (icon, k) => {
    const F = k.rr(2, 4, 22, 20, 2.4)
    const holes = []
    for (const x of [4.6, 9.5, 14.5, 19.4]) holes.push(k.rr(x - 1.1, 5.2, x + 1.1, 6.8, 0.5), k.rr(x - 1.1, 17.2, x + 1.1, 18.8, 0.5))
    return [
      k.rose(F, { plate: 'K' }),
      k.fill(k.union(holes), 'c4'),
      k.cream(k.rr(3.4, 8.8, 20.6, 15.2, 1)),
      k.heart(12, 12.2, 4.2, 0, { plate: 'A' }),
    ]
  },
  // a blush funnel with lace along its rim
  filter: (icon, k) => [
    k.lace('M5.2 3.5 H18.8', 0.78),
    k.body(k.path('M4.64 4.3 L19.36 4.3 A1 1 0 0 1 20.13 5.94 L14.35 12.58 A1.5 1.5 0 0 0 14 13.54 L14 18.69 A0.5 0.5 0 0 1 13.72 19.14 L10.72 20.64 A0.5 0.5 0 0 1 10 20.19 L10 13.54 A1.5 1.5 0 0 0 9.65 12.58 L3.87 5.94 A1 1 0 0 1 4.64 4.3 Z')),
  ],
  // satin ridges, blush outside and rose within, the core whorl a ribbon-red heart
  fingerprint: (icon, k) => [
    k.body(k.tube('M4 18 V11.5 A8 9 0 0 1 20 11.5 V14 M20 18 C19.5 19.25 19 20.25 18 21', 2.2)),
    k.rose(k.tube('M9 21 C8.5 19.75 8 18.25 8 16.5 V11.5 A4 5 0 0 1 16 11.5 V16 M12 12.4 V15 C12 17.25 12.5 19 13.5 20.5', 2), { plate: 'A' }),
    k.heart(12, 11.2, 3.5, 0, { plate: 'A' }),
  ],
  // a blush fish with a rose tail, a bow tied where the tail meets
  fish: (icon, k) => [
    k.rose(k.path('M7.6 12 L3.5 9 C3 8.5 2.5 8.75 2.5 9.5 V14.5 C2.5 15.25 3 15.5 3.5 15 Z'), { plate: 'A' }),
    k.body(k.path('M7 12 C9 8.25 12 6.5 15 6.5 C18.5 6.5 21 9 21.5 12 C21 15 18.5 17.5 15 17.5 C12 17.5 9 15.75 7 12 Z')),
    k.ink('M12.5 9.75 C13.25 11.25 13.25 12.75 12.5 14.25', 0.9),
    k.ink(k.disc(17.2, 10.8, 0.9)),
    k.bow(7.2, 11.8, 0.5, 0),
  ],
  // a blush pennant with lace on its hem, a gold pole with a pearl finial
  flag: (icon, k) => [
    k.lace('M6.4 13.4 C8.2 12.5 10.2 12.5 12.5 13.5 C15 14.75 17.5 14.75 19.6 13.6', 0.7),
    k.body(k.path('M5.4 3.5 C7.5 2.25 10 2.25 12.5 3.5 C15 4.75 17.5 4.75 20 3.5 V13.5 C17.5 14.75 15 14.75 12.5 13.5 C10 12.25 7.5 12.25 5.4 13.5 Z')),
    k.gold(k.tube('M5 21.6 V3.4', 2), { plate: 'A' }),
    k.pearl(5, 2.4, 1.1, { plate: 'A' }),
  ],
  // a blush flame with a ribbon-red heart burning at its core
  flame: (icon, k) => [
    k.body(k.path('M12 21.5 C8.25 21.5 5 18.75 5 15 C5 11.75 5.75 9.5 7 7.5 C8 8.75 9.25 9.5 10.5 9.5 C10.25 6.5 11.5 4.25 14 2.5 C17.25 5.5 19 10 19 15 C19 18.75 15.75 21.5 12 21.5 Z')),
    k.heart(12.2, 16.1, 5.6, 0, { plate: 'A' }),
  ],
  // a cream glass flask half full of blush, a bow on its neck
  'flask-conical': (icon, k) => {
    const glass = k.poly([[9.6, 3.2], [9.6, 9], [4.2, 18.6], [5.4, 21], [18.6, 21], [19.8, 18.6], [14.4, 9], [14.4, 3.2]], 1.1)
    return [
      k.cream(glass),
      k.body(k.inter(k.inset(glass, 0.75), k.rect(0, 14.2, 24, 24)), { plate: 'A', ow: 0.4 }),
      k.pearl(14.2, 17.4, 0.7, { plate: 'A' }), k.pearl(10.4, 18.6, 0.55, { plate: 'A' }),
      k.gold(k.pill(8, 2, 16, 4.4), { plate: 'K' }),
      k.bow(12, 7.4, 0.52, 0),
    ]
  },
  // five blush petals around a pearl
  flower: (icon, k) => {
    const petals = []
    for (let i = 0; i < 5; i++) { const a = (-90 + 72 * i) * Math.PI / 180; petals.push(k.disc(12 + 5.4 * Math.cos(a), 12.4 + 5.4 * Math.sin(a), 4.1)) }
    return [
      k.body(k.union(petals, k.disc(12, 12.4, 5))),
      k.ink(k.union([0, 1, 2, 3, 4].map(i => { const a = (-54 + 72 * i) * Math.PI / 180; return k.seg(12 + 4 * Math.cos(a), 12.4 + 4 * Math.sin(a), 12 + 6.4 * Math.cos(a), 12.4 + 6.4 * Math.sin(a), 0.8) }))),
      k.rose(k.disc(12, 12.4, 3.4), { plate: 'A' }),
      k.pearl(12, 12.4, 2.1, { plate: 'A' }),
    ]
  },
  // a blush pump with a cream window, gold hose, rose base and a heart
  fuel: (icon, k) => [
    k.gold(k.tube('M12.5 12 H15 A1.5 1.5 0 0 1 16.5 13.5 V17.5 A2 2 0 0 0 20.5 17.5 V8 L18 5.5', 1.7), { plate: 'A' }),
    k.body(k.rr(3.5, 3, 12.5, 21, [2.2, 2.2, 0, 0])),
    k.rose(k.rr(2.2, 19.6, 13.8, 22, 1.1), { plate: 'K' }),
    k.cream(k.rr(5.4, 5, 10.6, 10.2, 1.2), { ow: 0.5 }),
    k.heart(8, 14.6, 4, 0, { plate: 'K' }),
  ],
  // a blush card between rose side cards, a heart for the picture
  'gallery-horizontal': (icon, k) => [
    k.rose(k.tube('M3 7 V17 M21 7 V17', 2.3), { plate: 'A' }),
    k.body(k.rr(6.8, 4, 17.2, 20, 2.4)),
    k.heart(12, 12.2, 5, 0, { plate: 'K' }),
  ],
  // a blush pad, a rose d-pad, a heart button and a pearl button
  gamepad: (icon, k) => [
    k.body(k.path('M8 5.5 H16 C19.25 5.5 20.75 7.75 21.5 11 C22 13.25 22.5 19.5 19.5 19.5 C17.75 19.5 17 16 15 16 H9 C7 16 6.25 19.5 4.5 19.5 C1.5 19.5 2 13.25 2.5 11 C3.25 7.75 4.75 5.5 8 5.5 Z')),
    k.rose(k.tube('M5.4 11.4 H9.6 M7.5 9.3 V13.5', 1.9), { plate: 'A' }),
    k.heart(17.8, 10.3, 3.3, 0, { plate: 'A' }),
    k.pearl(15.2, 13, 1, { plate: 'A' }),
  ],
  // a blush dial arc round a cream face, a ribbon-red needle, a pearl pivot
  gauge: (icon, k) => [
    k.cream(k.cut(k.disc(12, 14, 7.2), k.rect(0, 18.4, 24, 24)), { ow: 0.5 }),
    k.body(k.tube('M4.5 19 A9 9 0 1 1 19.5 19', 2.8)),
    k.fill(k.union(k.disc(7.6, 14, 0.6), k.disc(8.9, 10.9, 0.6), k.disc(12, 9.6, 0.6), k.disc(16.4, 14, 0.6)), 'c2'),
    k.satin(k.tube('M12 14 L15.6 10.4', 1.9), { plate: 'A' }),
    k.pearl(12, 14, 1.3, { plate: 'A' }),
  ],
  // a faceted blush gem with a cream crown and a gold twinkle
  gem: (icon, k) => {
    const G = k.poly([[7, 3.5], [17, 3.5], [21.5, 9], [12, 21], [2.5, 9]], 0.8)
    return [
      k.body(G),
      k.cream(k.inter(G, k.rect(0, 0, 24, 9)), { ow: 0.45 }),
      k.ink('M10 3.8 L8.5 9 L12 20.4 M14 3.8 L15.5 9 L12 20.4', 0.8),
      k.sparkle(20.4, 3.4, 1.7),
    ]
  },
}
