// COQUETTE redraw chunk 4 of 5: hand-composed icons for this chunk's redrawer.
// Each entry maps an icon name to (icon, k) => parts (k = the frozen kit, see
// forge/styles/COQUETTE-GUIDE.md). Entries in the EXEMPLAR map (_coquette-exemplars.mjs) win.
import { parsePath } from '../kernel/geom.mjs'

// ---- local helpers -------------------------------------------------------------------
const D2R = Math.PI / 180
// rotate points about (cx, cy)
const rotP = (pts, deg, cx = 12, cy = 12) => {
  const a = deg * D2R, c = Math.cos(a), s = Math.sin(a)
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c])
}
// every subpath of d, as point lists, rotated
const rotD = (d, deg, cx = 12, cy = 12) => parsePath(d).map(s => ({ pts: rotP(s.pts, deg, cx, cy), closed: s.closed }))
// a filled region of path d rotated
const rpoly = (k, d, deg, r = 0.6, cx = 12, cy = 12) => k.union(rotD(d, deg, cx, cy).map(s => k.poly(s.pts, r)))
// a tube along path d rotated
const rtube = (k, d, w, deg, cx = 12, cy = 12) => k.union(rotD(d, deg, cx, cy).map(s => k.tube(s.pts, w, s.closed)))
const at = (x, y, deg, cx = 12, cy = 12) => rotP([[x, y]], deg, cx, cy)[0]

// window frame family (panels, sidebar): a cream screen, a blush panel trimmed in lace
const frame = k => k.rr(3, 3.6, 21, 20.4, 2.6)
const panel = (k, region, laceD, extra = []) => {
  const page = frame(k)
  return [
    k.cream(page),
    k.lace(laceD, 0.74, { eyelets: false }),
    k.body(k.inter(page, region)),
    ...extra,
  ]
}

// phone handset (shared by the phone family): blush satin receiver
const PHONE = 'M3 5 A2 2 0 0 1 5 3 H8 A1.5 1.5 0 0 1 9.5 4.5 V6 C9.5 7.25 8.5 7.25 8.5 8.5 A7 7 0 0 0 15.5 15.5 C16.75 15.5 16.75 14.5 18 14.5 H19.5 A1.5 1.5 0 0 1 21 16 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 Z'
const phoneShape = k => k.grow(k.path(PHONE), 0.9)
// the handset plus a satin-red signal glyph (arrows, waves) in the free upper-right
const phoneWith = (k, glyph, w = 2.1) => [k.body(phoneShape(k)), k.satin(k.tube(glyph, w), { plate: 'S' })]
// a plane skeleton (closed K outline) filled as a blush satin body
const fillSk = (k, icon, i = 0, g = 0.9) => k.grow(k.path(icon.paths[i].d), g)

export const R = {
  // ---- 301-320 ---------------------------------------------------------------------
  // a cream notepad on gold spiral rings, rose text lines ending in a little heart
  'notepad-text': (icon, k) => [
    k.cream(k.rr(4.4, 4.4, 19.6, 21.4, 2.4)),
    k.fill(k.tube('M8 10.4 H16 M8 13.8 H16 M8 17.2 H11.6', 1.2), 'c2'),
    k.heart(15, 17.3, 3.8, 0),
    k.gold(k.union(k.pill(7, 2.4, 9, 6.6), k.pill(11, 2.4, 13, 6.6), k.pill(15, 2.4, 17, 6.6)), { plate: 'A' }),
  ],
  // the box opened: rose flaps swung out, a ribbon-red heart rising from inside
  'package-open': (icon, k) => [
    k.rose(k.poly([[4.4, 11.4], [2, 6.8], [8.8, 5.6], [11.6, 10.2]], 0.8), { plate: 'A' }),
    k.rose(k.poly([[19.6, 11.4], [22, 6.8], [15.2, 5.6], [12.4, 10.2]], 0.8), { plate: 'A' }),
    k.cream(k.rr(4.8, 8.6, 19.2, 12.4, 1)),
    k.heart(12, 7.4, 6, 0, { plate: 'S' }),
    k.body(k.rr(3.8, 11.2, 20.2, 21, [0.8, 0.8, 2.4, 2.4])),
    k.fill(k.rect(10.8, 11.8, 13.2, 20.4), 'c2'),
  ],
  // an isometric parcel: rose lid face, blush sides, a bow tied on the lid
  package: (icon, k) => {
    const box = k.poly([[12, 2.8], [20.6, 7.2], [20.6, 16.8], [12, 21.4], [3.4, 16.8], [3.4, 7.2]], 1.2)
    return [
      k.body(box),
      k.rose(k.inter(box, k.poly([[12, 2], [21.6, 7.2], [12, 12.2], [2.4, 7.2]], 0)), { plate: 'K', ow: 0 }),
      k.ink('M3.8 7.4 L12 11.8 L20.2 7.4 M12 11.8 V20.8', 0.9),
      k.bow(12, 7.1, 0.6, 0),
    ]
  },
  // a blush brush with a gold ferrule, ribbon-red paint on the bristles, a bow on the handle
  paintbrush: (icon, k) => [
    k.body(k.seg(19.8, 4.2, 14.2, 9.8, 2.6)),
    k.gold(k.seg(14.6, 9.4, 11.8, 12.2, 3.6), { plate: 'K' }),
    k.satin(k.path('M10.4 11.1 L12.9 13.6 C12.6 17.6 8.8 20.6 3.6 20.4 C4.2 16.2 6.4 11.6 10.4 11.1 Z'), { plate: 'K' }),
    k.bow(17.4, 6.6, 0.52, 45, { plate: 'K' }),
  ],
  // a blush palette with a thumb hole and paint dabs: a heart, a pearl, gold and rose
  palette: (icon, k) => {
    const pal = k.cut(k.ellipse(12, 11.8, 9.6, 8.8, -12), k.disc(18.6, 17.4, 3.2))
    return [
      k.body(pal),
      k.cream(k.disc(10.6, 16.4, 1.55), { ow: 0.45 }),
      k.heart(8, 9.4, 4.2, -8, { plate: 'K' }),
      k.pearl(12.8, 6.6, 1.15, { plate: 'K' }),
      k.gold(k.disc(16.6, 9.2, 1.3), { plate: 'K', ow: 0.4 }),
      k.rose(k.disc(6.4, 14, 1.3), { plate: 'K', ow: 0.4 }),
    ]
  },
  // blush fronds, a rose trunk, pearl coconuts, a little cream island
  'palm-tree': (icon, k) => [
    k.cream(k.path('M4.4 22 C7.8 19.4 16.2 19.4 19.6 22 Z'), { plate: 'A' }),
    k.rose(k.tube('M12.2 8 C13.2 12.4 13.2 16.4 11.6 20.6', 2.3), { plate: 'K' }),
    k.body(k.union(
      k.path('M12 7.6 C9 3.4 4 3.6 2 10 C5.2 8.2 8.6 8.4 12 7.6 Z'),
      k.path('M12 7.6 C15 3.4 20 3.6 22 10 C18.8 8.2 15.4 8.4 12 7.6 Z'),
      k.path('M12 7.2 C8.4 7 5.2 9.6 4.6 14.2 C7.4 12 9.6 10.2 12 7.2 Z'),
      k.path('M12 7.2 C15.6 7 18.8 9.6 19.4 14.2 C16.6 12 14.4 10.2 12 7.2 Z'),
      k.disc(12, 7.4, 1.6),
    )),
    k.pearl(11.2, 9.6, 0.95),
    k.pearl(13.3, 9.8, 0.95),
  ],
  'panel-bottom': (icon, k) => panel(k, k.rect(0, 14.6, 24, 24), 'M3.6 14.7 H20.4', [k.bow(19.6, 19.4, 0.5, -16)]),
  'panel-left-close': (icon, k) => panel(k, k.rect(0, 0, 9.4, 24), 'M9.5 4.2 V19.8', [
    k.satin(k.tube('M15.8 9.2 L13 12 L15.8 14.8', 2.1), { plate: 'S' }),
  ]),
  'panel-left-open': (icon, k) => panel(k, k.rect(0, 0, 9.4, 24), 'M9.5 4.2 V19.8', [
    k.satin(k.tube('M13.6 9.2 L16.4 12 L13.6 14.8', 2.1), { plate: 'S' }),
  ]),
  'panel-right': (icon, k) => panel(k, k.rect(14.6, 0, 24, 24), 'M14.5 4.2 V19.8', [k.bow(19.8, 4.8, 0.5, 16)]),
  // a pink paperclip with a tiny heart charm
  paperclip: (icon, k) => [
    k.body(k.tube('M9.25 13.5 L17.25 5.5 A2.12 2.12 0 0 1 20.25 8.5 L10.25 18.5 A4.24 4.24 0 0 1 4.25 12.5 L12.25 4.5', 2.3)),
    k.bow(12.4, 4.4, 0.5, 45, { plate: 'K' }),
  ],
  // a blush parking sign with a ribbon-red P and a bow on its corner
  parking: (icon, k) => [
    k.body(k.rr(3.6, 3.6, 20.4, 20.4, 3.2)),
    k.satin(k.tube('M9.8 17 V7.6 H13 A2.8 2.8 0 0 1 13 13.2 H9.8', 2.4), { plate: 'S' }),
    k.bow(19.2, 4.8, 0.55, 18),
  ],
  // a blush cone at line scale with rose stripes; three confetti: a heart, a ribbon curl, a pearl
  'party-popper': (icon, k) => {
    const cone = k.poly([[2.2, 21.8], [7.2, 8.6], [15.4, 16.8]], 1.3)
    return [
      k.body(cone),
      k.fill(k.inter(cone, k.tube('M4.4 13.6 L10.4 19.6 M6.2 10.2 L13.8 17.8', 1.4)), 'c2'),
      k.satin(k.tube('M11 7 C12.8 5.8 11 3.8 12.8 2.6', 1.7), { plate: 'A' }),
      k.heart(18.2, 5.2, 4.6, 16, { plate: 'A' }),
      k.pearl(19.6, 13.2, 1.3, { plate: 'A' }),
    ]
  },
  // a blush passport with a gold emblem and a ribbon-red bookmark peeking out
  passport: (icon, k) => [
    k.satin(k.poly([[14.6, 19], [17.4, 19], [17.4, 23.4], [16, 22.3], [14.6, 23.4]], 0.3), { plate: 'deco' }),
    k.body(k.rr(5, 2.6, 19, 21.2, [1.4, 2.4, 2.4, 1.4])),
    k.ink('M7 3.2 V20.6', 0.8),
    k.gold(k.ring(12.4, 10, 3.1, 1.3), { plate: 'A' }),
    k.ink('M9.6 10 H15.2 M12.4 7.2 C11.2 8.6 11.2 11.4 12.4 12.8 C13.6 11.4 13.6 8.6 12.4 7.2', 0.6, { plate: 'A' }),
    k.gold(k.tube('M10 16.4 H14.8', 1.3), { plate: 'A', ow: 0.35 }),
  ],
  // a blush clipboard with a gold clip, a cream page laid in front with a heart
  paste: (icon, k) => [
    k.body(k.rr(3.6, 4.2, 15.4, 20.6, 2.4)),
    k.gold(k.rr(6.6, 2.4, 12.4, 6.2, 1.2), { plate: 'A' }),
    k.cream(k.rr(10.2, 9.8, 20.6, 21.4, 1.8)),
    k.fill(k.tube('M12.8 13.4 H18 M12.8 16.4 H16', 1.2), 'c2'),
    k.heart(17.6, 18.6, 3.4, 0),
  ],
  // two satin pills with a bow on the right one
  pause: (icon, k) => [
    k.body(k.union(k.pill(5.6, 4.6, 10, 19.6), k.pill(14, 4.6, 18.4, 19.6))),
    k.bow(16.2, 5, 0.6, 14),
  ],
  // toe beans and a heart-shaped pad, a gold twinkle
  'paw-print': (icon, k) => [
    k.body(k.union(
      k.heartShape(12, 17.6, 11.6, 180),
      k.ellipse(8.5, 5.4, 2.15, 2.75, -8), k.ellipse(15.5, 5.4, 2.15, 2.75, 8),
      k.ellipse(4, 11, 2.1, 2.7, -24), k.ellipse(20, 11, 2.1, 2.7, 24),
    )),
    k.sparkle(20.4, 19.4, 1.5),
  ],
  // a gold nib with a ribbon-red heart breather, blush collar; laid on the diagonal
  'pen-tool': (icon, k) => {
    const A = 45
    return [
      k.body(rpoly(k, 'M8.4 2.4 H15.6 V7.6 H8.4 Z', A, 1.2), { plate: 'A' }),
      k.gold(rpoly(k, 'M8 7.6 H16 L17.8 13.4 L12 21.6 L6.2 13.4 Z', A, 0.8)),
      k.ink(rtube(k, 'M12 14.8 V20.4', 0.8, A)),
      k.heart(...at(12, 12.6, A), 4.2, A, { plate: 'K' }),
    ]
  },
  // a blush pencil on the diagonal: rose eraser, gold ferrule, cream wood, a bow
  pencil: (icon, k) => {
    const A = 45
    return [
      k.rose(rpoly(k, 'M9.4 1.6 H14.6 V5.4 H9.4 Z', A, 1.2), { plate: 'K' }),
      k.cream(rpoly(k, 'M9.4 15.6 H14.6 L12 21.4 Z', A, 0.5)),
      k.ink(rpoly(k, 'M10.9 18.8 H13.1 L12 21.4 Z', A, 0.2)),
      k.body(rpoly(k, 'M9.4 6.6 H14.6 V16 H9.4 Z', A, 0.3)),
      k.fill(rtube(k, 'M12 8.2 V14.4', 1, A), 'c2'),
      k.gold(rpoly(k, 'M9.2 4.6 H14.8 V7.2 H9.2 Z', A, 0.4), { plate: 'K' }),
      k.bow(...at(12, 5.9, A), 0.52, A, { plate: 'K' }),
    ]
  },
  // a satin ribbon slash between two pearls
  percent: (icon, k) => [
    k.body(k.tube('M18.4 5.6 L5.6 18.4', 3)),
    k.pearl(7, 7.2, 2.7, { plate: 'K' }),
    k.pearl(17, 16.8, 2.7, { plate: 'K' }),
  ],

  // ---- 321-340 ---------------------------------------------------------------------
  // a running girl: blush figure, a bow on the back of her head
  'person-running': (icon, k) => [
    k.rose(k.tube('M7 11.5 L9.5 8.5 H13 L15.5 12 L18.5 10.5', 2.4), { plate: 'A' }),
    k.body(k.union(k.tube('M13 8.5 L10.5 14 L14 16.5 L12.5 21 M10.5 14 L8 18 L4 18.5', 2.9), k.disc(15.5, 4.5, 2.5))),
    k.bow(13.4, 3, 0.5, -24),
  ],
  // the handset with a bow on its earpiece
  phone: (icon, k) => [k.body(phoneShape(k)), k.bow(5.2, 3.8, 0.55, -18)],
  'phone-call': (icon, k) => phoneWith(k, 'M13.85 6.52 A4 4 0 0 1 17.48 10.15 M14.2 2.53 A8 8 0 0 1 21.47 9.8', 2),
  'phone-incoming': (icon, k) => phoneWith(k, 'M20 4 L14.5 9.5 M14.5 4.5 V9.5 H19.5'),
  'phone-outgoing': (icon, k) => phoneWith(k, 'M14.5 9.5 L20 4 M15 4 H20 V9'),
  'phone-missed': (icon, k) => phoneWith(k, 'M13.5 7.5 V3.5 H17.5 M13.5 3.5 L17.5 7.5 L21.5 3.5'),
  // the handset parted by a satin slash
  'phone-off': (icon, k) => {
    const slash = k.tube('M21.2 2.8 L2.8 21.2', 2)
    return [k.body(k.moat(phoneShape(k), slash, 0.75)), k.satin(slash, { plate: 'S' })]
  },
  // a blush screen, cream glass, a rose inset picture, a bow on the corner
  'picture-in-picture': (icon, k) => [
    k.body(k.rr(1.8, 4, 22.2, 20, 2.6)),
    k.cream(k.rr(3.6, 5.8, 20.4, 18.2, 1.4), { ow: 0.5 }),
    k.rose(k.rr(11, 11, 18.6, 16.4, 1.2), { plate: 'A' }),
    k.bow(20.6, 4.6, 0.55, 18),
  ],
  // a blush piggy bank with a bow on its ear and a gold coin dropping in
  'piggy-bank': (icon, k) => [
    k.body(k.union(k.pill(6, 15, 8.6, 21.4), k.pill(13.6, 15, 16.2, 21.4))),
    k.rose(k.tube('M3.6 12.4 C2 12 2 10.2 3.4 10.4', 1.1), { plate: 'A' }),
    k.body(k.union(k.ellipse(10.8, 13.4, 7.9, 6), k.poly([[12.6, 8.6], [15.4, 4.2], [17.2, 9.4]], 0.9))),
    k.rose(k.rr(17.4, 11, 21.6, 15.6, 1.4), { plate: 'K' }),
    k.ink('M8.2 9.2 H11.6', 1.1),
    k.fill(k.disc(15, 11.2, 0.75), 'ink'),
    k.gold(k.disc(9.9, 4.4, 2.1), { plate: 'A' }),
    k.bow(15.8, 5.2, 0.48, 22),
  ],
  // a satin pilcrow with a little heart
  pilcrow: (icon, k) => [
    k.body(k.union(k.grow(k.path('M13.5 3.5 H10.5 A4.25 4.25 0 0 0 10.5 12 H13.5 Z'), 1.1), k.tube('M13.5 3.5 V20.5 M13.5 3.5 H18 V20.5', 2.6))),
    k.bow(18.2, 3.8, 0.5, 16, { plate: 'K' }),
  ],
  // a blush and cream capsule with a gold twinkle
  pill: (icon, k) => {
    const cap = k.tube('M7.6 16.4 L16.4 7.6', 7.4)
    return [
      k.cream(k.inter(cap, k.side(12, 12, 225))),
      k.body(k.inter(cap, k.side(12, 12, 45))),
      k.sparkle(5.2, 5.2, 1.7),
    ]
  },
  // a blush pushpin on a gold needle, a heart on its head
  pin: (icon, k) => [
    k.gold(k.tube('M8.99 15.01 L3.42 20.58', 1.8), { plate: 'A' }),
    k.body(fillSk(k, icon, 0, 1)),
    k.heart(13.2, 10.6, 3.8, 45, { plate: 'K' }),
  ],
  // a blush slice with a rose crust, heart pepperoni and a pearl
  pizza: (icon, k) => {
    const slice = k.poly(parsePath('M3 21 L9 3 A13.5 13.5 0 0 1 21 15 Z')[0].pts, 1.2)
    return [
      k.body(slice),
      k.rose(k.inter(slice, k.cut(k.rect(0, 0, 24, 24), k.disc(7.6, 16.4, 10.9))), { plate: 'K', ow: 0.5 }),
      k.heart(9.9, 12.4, 4.6, -12, { plate: 'K' }),
      k.heart(14.4, 15.6, 4, 10, { plate: 'K' }),
      k.pearl(7.4, 17.8, 1.05, { plate: 'K' }),
    ]
  },
  'plane-landing': (icon, k) => [
    k.rose(k.pill(2, 20.2, 22, 22.6), { plate: 'A' }),
    k.body(fillSk(k, icon, 0, 1)),
    k.sparkle(19.4, 4.6, 1.6),
  ],
  'plane-takeoff': (icon, k) => [
    k.rose(k.pill(2, 20.2, 22, 22.6), { plate: 'A' }),
    k.body(fillSk(k, icon, 0, 1)),
    k.sparkle(20, 13.4, 1.6),
  ],
  plane: (icon, k) => [
    k.body(fillSk(k, icon, 0, 1)),
    k.heart(14.6, 9.4, 3.4, 45, { plate: 'K' }),
  ],
  // a soft satin play triangle with a bow on its upper corner
  play: (icon, k) => [
    k.body(k.grow(k.path(icon.paths[0].d), 1.2)),
    k.bow(7.2, 5.2, 0.56, -20),
  ],
  // a blush plug, gold prongs, a rose cord, a red heart
  plug: (icon, k) => [
    k.gold(k.tube('M9 2.4 V7.4 M15 2.4 V7.4', 2), { plate: 'A' }),
    k.rose(k.tube('M12 16 V21.8', 2.4), { plate: 'A' }),
    k.body(k.grow(k.path('M5.5 7 H18.5 A1 1 0 0 1 19.5 8 V11 A5.5 5.5 0 0 1 14 16.5 H10 A5.5 5.5 0 0 1 4.5 11 V8 A1 1 0 0 1 5.5 7 Z'), 0.9)),
    k.heart(12, 11.4, 4.8, 0, { plate: 'K' }),
  ],
  // a blush disc on a light lace doily, a ribbon-red plus
  'plus-circle': (icon, k) => {
    const d = k.disc(12, 12, 8.9)
    return [
      k.lace(k.circlePts(12, 12, 9.1, 0, 360, 48), 0.85, { closed: true, step: 3.1, band: 1, eyelets: false }),
      k.body(d),
      k.satin(k.tube('M12 7.2 V16.8 M7.2 12 H16.8', 2.7), { plate: 'S' }),
    ]
  },
  // a plump satin plus with a little heart
  plus: (icon, k) => [
    k.body(k.tube('M12 6.4 V19.6 M4.4 12 H19.6', 3.1)),
    k.heart(12, 4.9, 5, 0, { plate: 'K' }),
  ],

  // ---- 341-360 ---------------------------------------------------------------------
  // a blush mic, an inner satin wave and an outer wave strung in pearls
  podcast: (icon, k) => [
    k.rose(k.tube('M6.25 19 A9.5 9.5 0 1 1 17.75 19', 2.3), { plate: 'A' }),
    k.body(k.tube('M7.75 15 A5.5 5.5 0 1 1 16.25 15', 2.3), { plate: 'A' }),
    k.body(k.union(k.disc(12, 11.5, 2.5), k.tube('M12 14.6 V21.2', 2.6))),
  ],
  'pound-sterling': (icon, k) => [
    k.body(k.tube('M16.2 5.8 C15.4 5 14.4 4.5 13 4.5 C10.4 4.5 8.5 6.4 8.5 9 V15.5 C8.5 17.3 7.6 18.7 6 19.5 H18 M5.5 12.5 H14', 2.8)),
    k.heart(17.4, 7.2, 4.4, 30, { plate: 'K' }),
  ],
  // a satin power ring with a heart held inside
  power: (icon, k) => [
    k.body(k.union(k.tube('M6.21 5.61 A9 9 0 1 0 17.79 5.61', 2.9), k.tube('M12 3.2 V11.4', 2.9))),
    k.heart(12, 15.8, 4.2, 0),
  ],
  // a cream board in a blush frame on a gold easel; a satin chart line ending in a heart
  presentation: (icon, k) => [
    k.gold(k.tube('M7 21.2 L9 15.5 M17 21.2 L15 15.5 M12 15.5 V18.8', 1.8), { plate: 'A' }),
    k.body(k.rr(2.2, 2.8, 21.8, 16.2, 2.2)),
    k.cream(k.rr(4, 4.6, 20, 14.4, 1.2), { ow: 0.45 }),
    k.satin(k.tube('M6.6 12 L9.8 9 L12.8 11 L15.2 8.8', 1.5), { plate: 'A', ow: 0.4 }),
    k.heart(17, 7.8, 3.6, 15, { plate: 'A' }),
  ],
  // a blush printer with cream paper; the page coming out carries a red heart
  printer: (icon, k) => [
    k.cream(k.rr(6.4, 2.4, 17.6, 9.6, 1), { plate: 'A' }),
    k.body(k.rr(2.2, 7.6, 21.8, 17.6, 2.4)),
    k.pearl(18.6, 10.6, 0.75, { plate: 'K' }),
    k.cream(k.rr(6.4, 13.4, 17.6, 21.8, 1), { plate: 'A' }),
    k.heart(12, 17.8, 4.2, 0, { plate: 'A' }),
  ],
  // a blush puzzle piece with a heart at its centre
  'puzzle-piece': (icon, k) => [
    k.body(fillSk(k, icon, 0, 0.95)),
    k.heart(10, 14.2, 5, -8, { plate: 'K' }),
  ],
  // simplified: three blush finder squares, data pearls around a red heart
  'qr-code': (icon, k) => {
    const fin = (x, y) => k.rr(x - 0.3, y - 0.3, x + 7.7, y + 7.7, 2)
    const sq = [fin(2.6, 2.6), fin(14, 2.6), fin(2.6, 14)]
    return [
      k.body(k.cut(k.union(sq), k.union([[2.6, 2.6], [14, 2.6], [2.6, 14]].map(([x, y]) => k.rr(x + 1.8, y + 1.8, x + 5.6, y + 5.6, 1))))),
      k.rose(k.union([[2.6, 2.6], [14, 2.6], [2.6, 14]].map(([x, y]) => k.rr(x + 2.6, y + 2.6, x + 4.8, y + 4.8, 0.7))), { plate: 'K', ow: 0.4 }),
      k.pearls([[14.9, 20.4], [20.4, 20.4], [20.4, 14.9]], 1.45, { plate: 'A', step: 5.5 }),
      k.heart(15.6, 15.5, 5, 0, { plate: 'A' }),
    ]
  },
  // two plump blush quote marks with a heart between them
  quote: (icon, k) => [
    k.body(k.union(fillSk(k, icon, 0, 0.9), fillSk(k, icon, 1, 0.9))),
    k.heart(17.5, 8.4, 3.6, 0, { plate: 'K' }),
  ],
  // a blush bunny with rose inner ears and a bow between them
  rabbit: (icon, k) => [
    k.body(fillSk(k, icon, 0, 0.9)),
    k.fill(k.tube('M7.4 4.2 C8 6.4 9.2 8.4 10.4 9.8 M16.6 4.2 C16 6.4 14.8 8.4 13.6 9.8', 1.3), 'c2'),
    k.bow(15.4, 9.4, 0.52, 18),
  ],
  // a blush radio, gold antenna tipped with a pearl, a gold-rimmed rose speaker
  radio: (icon, k) => [
    k.gold(k.tube('M7 8.6 L17.6 3.8', 1.5), { plate: 'A' }),
    k.pearl(18.2, 3.6, 1),
    k.body(k.rr(1.8, 8.4, 22.2, 20.6, 2.6)),
    k.gold(k.disc(8, 14.5, 3.6), { plate: 'K' }),
    k.rose(k.disc(8, 14.5, 2.3), { plate: 'K', ow: 0.4 }),
    k.fill(k.tube('M14 12.4 H18.6 M14 16.6 H18.6', 1.3), 'c2'),
  ],
  // rose, blush and cream satin arcs with a gold twinkle
  rainbow: (icon, k) => [
    k.rose(k.tube('M2.4 18.6 A9.6 9.6 0 0 1 21.6 18.6', 2.8), { plate: 'K' }),
    k.body(k.tube('M5.4 18.6 A6.6 6.6 0 0 1 18.6 18.6', 2.8)),
    k.cream(k.tube('M8.4 18.6 A3.6 3.6 0 0 1 15.6 18.6', 2.8)),
    k.sparkle(20.2, 4.8, 1.7),
  ],
  // a cream receipt with rose lines and a heart as the total
  receipt: (icon, k) => [
    k.cream(k.poly(parsePath('M6.5 2.5 H17.5 A2 2 0 0 1 19.5 4.5 V21.5 L17 19.5 L14.5 21.5 L12 19.5 L9.5 21.5 L7 19.5 L4.5 21.5 V4.5 A2 2 0 0 1 6.5 2.5 Z')[0].pts.map(([x, y]) => [12 + (x - 12) * 1.08, 12 + (y - 12) * 1.05]), 0.6)),
    k.fill(k.tube('M8.4 7.4 H15.6 M8.4 11 H15.6 M8.4 14.6 H11.6', 1.2), 'c2'),
    k.heart(15, 14.7, 3.6, 0, { plate: 'A' }),
  ],
  // a satin ribbon arrow, the bow on its tail
  redo: (icon, k) => [
    k.body(k.tube('M20.2 9.5 H9 A5.5 5.5 0 0 0 9 20.5 H14.5 M15.5 4.5 L20.5 9.5 L15.5 14.5', 3)),
    k.bow(14.8, 20.5, 0.6, 0),
  ],
  refresh: (icon, k) => [
    k.body(k.tube('M3.5 11 A8.5 8.5 0 0 1 19 7.5 M19 2.5 L19 7.5 L14 7.5 M20.5 13 A8.5 8.5 0 0 1 5 16.5 M5 21.5 L5 16.5 L10 16.5', 2.9)),
    k.heart(12, 12.2, 4, 0),
  ],
  // a blush fridge, gold handles, a heart magnet on the door
  refrigerator: (icon, k) => [
    k.body(k.rr(4.8, 2.2, 19.2, 21.8, 2.6)),
    k.ink('M5.4 9.5 H18.6', 0.9),
    k.gold(k.tube('M8.6 4.8 V7 M8.6 12.2 V16.8', 1.6), { plate: 'A' }),
    k.heart(14.6, 14.4, 4.6, 8, { plate: 'A' }),
  ],
  // a satin T with a ribbon-red x
  'remove-formatting': (icon, k) => [
    k.body(k.tube('M3.5 6.6 V4 H16.5 V6.6 M10 4 V20.2', 2.8)),
    k.satin(k.tube('M14.6 14.6 L20.6 20.6 M20.6 14.6 L14.6 20.6', 2.4), { plate: 'S' }),
  ],
  'repeat-1': (icon, k) => [
    k.body(k.tube('M4 11 V9 A3.5 3.5 0 0 1 7.5 5.5 H20 M16.5 2 L20 5.5 L16.5 9 M20 13 V15 A3.5 3.5 0 0 1 16.5 18.5 H4 M7.5 15 L4 18.5 L7.5 22', 2.6)),
    k.satin(k.tube('M10.4 10.6 L12.4 9.6 V14.6', 2), { plate: 'S' }),
  ],
  repeat: (icon, k) => [
    k.body(k.tube('M4 11.5 V10 A3.5 3.5 0 0 1 7.5 6.5 H20 M16.5 3 L20 6.5 L16.5 10 M20 12.5 V14 A3.5 3.5 0 0 1 16.5 17.5 H4 M7.5 14 L4 17.5 L7.5 21', 2.8)),
    k.bow(20, 13, 0.5, 0, { plate: 'K' }),
  ],
  'reply-all': (icon, k) => [
    k.rose(k.tube('M7.5 4.5 L2.5 9.5 L7.5 14.5', 2.6), { plate: 'A' }),
    k.body(k.tube('M8.5 9.5 H13.5 A7 7 0 0 1 20.5 16.5 V19.2 M13.5 4.5 L8.5 9.5 L13.5 14.5', 2.9)),
    k.bow(20.5, 19.6, 0.56, 0),
  ],
  reply: (icon, k) => [
    k.body(k.tube('M3.5 9.5 H13 A7 7 0 0 1 20 16.5 V19.2 M8.5 4.5 L3.5 9.5 L8.5 14.5', 3)),
    k.bow(20, 19.6, 0.6, 0),
  ],

  // ---- 361-380 ---------------------------------------------------------------------
  rewind: (icon, k) => [
    k.body(k.union(fillSk(k, icon, 0, 1.1), fillSk(k, icon, 1, 1.1))),
    k.bow(19.6, 7, 0.5, 18),
  ],
  // satin ribbon arcs with the bow on the tail
  'rotate-ccw': (icon, k) => [
    k.body(k.tube('M3.5 13 A8.5 8.5 0 1 0 5 7.5 M5 2.5 L5 7.5 L10 7.5', 2.9)),
    k.bow(3.6, 13.6, 0.55, 0),
  ],
  'rotate-cw': (icon, k) => [
    k.body(k.tube('M20.5 13 A8.5 8.5 0 1 1 19 7.5 M19 2.5 L19 7.5 L14 7.5', 2.9)),
    k.bow(20.4, 13.6, 0.55, 0),
  ],
  // a satin road from a pearl to a ribbon-red heart
  route: (icon, k) => [
    k.body(k.tube('M7.4 18.5 H15.25 A3.25 3.25 0 0 0 15.25 12 H8.75 A3.25 3.25 0 0 1 8.75 5.5 H15.4', 2.4)),
    k.pearl(5.4, 18.5, 2.5, { plate: 'K' }),
    k.heart(18.4, 5.9, 6.4, 0, { plate: 'S' }),
  ],
  // a blush router, gold antennas tipped with pearls, a heart light
  router: (icon, k) => [
    k.gold(k.tube('M6.5 13 L5.2 6.4 M17.5 13 L18.8 6.4', 1.6), { plate: 'A' }),
    k.pearl(5, 5.4, 1),
    k.pearl(19, 5.4, 1),
    k.body(k.rr(1.8, 12.6, 22.2, 21, 2.4)),
    k.heart(6.4, 16.9, 3.4, 0, { plate: 'K' }),
    k.fill(k.tube('M10 16.8 H18.4', 1.3), 'c2'),
  ],
  // satin waves from a ribbon-red heart
  rss: (icon, k) => [
    k.body(k.tube('M5.5 11 A7.5 7.5 0 0 1 13 18.5 M5.5 4.5 A14 14 0 0 1 19.5 18.5', 2.7)),
    k.heart(5.9, 18.4, 5.4, 0, { plate: 'S' }),
  ],
  // a blush ruler with rose ticks and a heart
  ruler: (icon, k) => [
    k.body(fillSk(k, icon, 0, 0.95)),
    k.fill(k.tube('M5 14 L7 16 M8 11 L9 12 M11 8 L13 10 M14 5 L15 6', 1.2), 'c2'),
    k.heart(14.6, 13.6, 4, 45, { plate: 'K' }),
  ],
  // a blush bowl trimmed with lace, a rose leaf and a heart tomato
  salad: (icon, k) => [
    k.rose(k.grow(k.path('M12.5 12 A6.75 6.75 0 0 1 5.5 4 A6.75 6.75 0 0 1 12.5 12 Z'), 0.9), { plate: 'A' }),
    k.heart(16.8, 8, 5.8, 8, { plate: 'A' }),
    k.lace('M3.4 11.5 H20.6', 0.72),
    k.body(k.grow(k.path('M2.5 12 H21.5 A9.5 9 0 0 1 2.5 12 Z'), 0.9)),
  ],
  // a blush floppy, gold shutter, cream label with a heart
  save: (icon, k) => {
    const disk = fillSk(k, icon, 0, 0.9)
    return [
      k.body(disk),
      k.gold(k.inter(disk, k.rr(7, 0, 15, 8.2, 1.4)), { plate: 'A' }),
      k.cream(k.inter(disk, k.rr(6, 13.2, 18, 30, 1.6)), { plate: 'A' }),
      k.heart(12, 17.4, 4.4, 0, { plate: 'A' }),
    ]
  },
  // blush scales on gold chains, a heart finial
  scale: (icon, k) => [
    k.gold(k.tube('M5 6.5 L2.6 13.4 M5 6.5 L7.4 13.4 M19 6.5 L16.6 13.4 M19 6.5 L21.4 13.4', 1), { plate: 'A', ow: 0.3 }),
    k.body(k.union(k.tube('M12 4.6 V21 M7.5 21 H16.5 M5 6.5 H19', 2.4))),
    k.rose(k.union(k.grow(k.path('M2 13.5 H8 A3 3 0 0 1 2 13.5 Z'), 0.8), k.grow(k.path('M16 13.5 H22 A3 3 0 0 1 16 13.5 Z'), 0.8)), { plate: 'A' }),
    k.heart(12, 4, 4.4, 0, { plate: 'K' }),
  ],
  // satin brackets around a simple face, a bow on the corner
  'scan-face': (icon, k) => [
    k.body(k.tube('M3 7.5 V5 A2 2 0 0 1 5 3 H7.5 M16.5 3 H19 A2 2 0 0 1 21 5 V7.5 M21 16.5 V19 A2 2 0 0 1 19 21 H16.5 M7.5 21 H5 A2 2 0 0 1 3 19 V16.5', 2.7)),
    k.fill(k.tube('M9 9 V10.6 M15 9 V10.6 M9 14.4 A3.5 3.5 0 0 0 15 14.4', 1.6), 'c3', { plate: 'A' }),
    k.bow(19.4, 4.6, 0.5, 18),
  ],
  // a blush schoolhouse, a ribbon-red door and pennant on a gold pole, a pearl clock
  school: (icon, k) => [
    k.gold(k.tube('M12 9 V2.4', 1.3), { plate: 'A' }),
    k.satin(k.poly([[12.4, 2], [17, 3.9], [12.4, 5.8]], 0.5), { plate: 'A' }),
    k.body(fillSk(k, icon, 0, 0.9)),
    k.ink('M7 14.6 V20.8 M17 14.6 V20.8', 0.9),
    k.satin(k.arch(10, 16.2, 14, 21.4), { plate: 'A' }),
    k.pearl(12, 12.4, 1.1, { plate: 'K' }),
  ],
  // gold blades, blush finger rings, a pearl pivot
  scissors: (icon, k) => [
    k.gold(k.tube('M8.4 7.8 L20.2 16.6 M8.4 16.2 L20.2 7.4', 1.9), { plate: 'A', ow: 0.42 }),
    k.body(k.union(k.ring(6, 6, 2.9, 2.5), k.ring(6, 18, 2.9, 2.5))),
    k.heart(14, 12.2, 3.6, 0, { plate: 'K' }),
  ],
  // cream parchment between blush rollers, rose text, a heart seal
  'scroll-text': (icon, k) => [
    k.cream(k.rect(5.4, 5, 18.6, 19)),
    k.fill(k.tube('M8.4 9.6 H15.6 M8.4 13.4 H12.6', 1.2), 'c2'),
    k.heart(15.2, 14.4, 4.4, 0, { plate: 'A' }),
    k.body(k.union(k.pill(2.6, 2.4, 21.4, 6.6), k.pill(2.6, 17.4, 21.4, 21.6))),
  ],
  // a blush paper plane with a little heart behind it
  send: (icon, k) => [
    k.body(k.poly([[21.4, 2.6], [2.4, 10], [10.2, 13.8], [14, 21.6]], 1)),
    k.rose(k.poly([[21.4, 2.6], [10.2, 13.8], [14, 21.6]], 1), { plate: 'K', ow: 0.4 }),
    k.ink('M10.6 13.4 L20.6 3.4', 0.8),
    k.heart(5, 18.6, 4, -12),
  ],
  // two blush units, a heart light and a pearl light
  server: (icon, k) => [
    k.body(k.union(k.rr(2.6, 2.2, 21.4, 10.4, 2.2), k.rr(2.6, 13.6, 21.4, 21.8, 2.2))),
    k.heart(7, 6.4, 3.4, 0, { plate: 'A' }),
    k.pearl(7, 17.7, 1),
    k.fill(k.tube('M11 6.3 H17.4 M11 17.7 H17.4', 1.3), 'c2'),
  ],
  // a rose tray, a blush ribbon arrow rising out of it, a bow at the tail
  'share-2': (icon, k) => [
    k.rose(k.tube('M9 10 H7 A2 2 0 0 0 5 12 V19 A2 2 0 0 0 7 21 H17 A2 2 0 0 0 19 19 V12 A2 2 0 0 0 17 10 H15', 2.6), { plate: 'K' }),
    k.body(k.tube('M12 15 V3.4 M8.4 6.8 L12 3.2 L15.6 6.8', 2.8), { plate: 'A' }),
    k.sparkle(19.6, 4.4, 1.6),
  ],

  // ---- 381-400 ---------------------------------------------------------------------
  // pearl nodes on satin links; the source node is a ribbon-red heart
  share: (icon, k) => [
    k.body(k.tube('M8.6 10.6 L15 7 M8.6 13.4 L15 17', 2.3)),
    k.pearl(17.5, 5.5, 3.3, { plate: 'A' }),
    k.pearl(17.5, 18.5, 3.3, { plate: 'A' }),
    k.heart(6.4, 12.2, 7.2, 0, { plate: 'K' }),
  ],
  // the shield family: a blush shield, a ribbon-red mark, a bow on the corner
  shield: (icon, k) => [
    k.body(fillSk(k, icon, 0, 0.95)),
    k.heart(12, 12, 6.4, 0, { plate: 'S' }),
    k.bow(18.4, 4.6, 0.55, 18),
  ],
  'shield-alert': (icon, k) => [
    k.body(fillSk(k, icon, 0, 0.95)),
    k.satin(k.union(k.tube('M12 7.4 V12.2', 2.5), k.disc(12, 16.1, 1.4)), { plate: 'S' }),
    k.bow(18.4, 4.6, 0.55, 18),
  ],
  'shield-check': (icon, k) => [
    k.body(fillSk(k, icon, 0, 0.95)),
    k.satin(k.tube('M8.4 12 L11 14.6 L15.6 9.4', 2.4), { plate: 'S' }),
    k.bow(18.4, 4.6, 0.55, 18),
  ],
  'shield-off': (icon, k) => {
    const sh = k.grow(k.path('M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z'), 0.95)
    const slash = k.tube('M2.8 2.8 L21.2 21.2', 2)
    return [k.body(k.moat(sh, slash, 0.75)), k.satin(slash, { plate: 'S' })]
  },
  'shield-user': (icon, k) => {
    const sh = fillSk(k, icon, 0, 0.95)
    return [
      k.body(sh),
      k.rose(k.union(k.disc(12, 9, 2.7), k.inter(k.path('M6.4 18.6 A5.6 5.4 0 0 1 17.6 18.6 Z'), k.inset(sh, 0.9))), { plate: 'A' }),
      k.bow(18.4, 4.6, 0.55, 18),
    ]
  },
  // a blush hull with pearl portholes, a rose cabin, a gold funnel, rose waves
  ship: (icon, k) => [
    k.gold(k.rr(10, 2.6, 14, 8.4, [1, 1, 0, 0]), { plate: 'A' }),
    k.rose(k.rr(6.2, 7.2, 17.8, 12.6, 1.6), { plate: 'K' }),
    k.body(k.poly([[2, 11.8], [22, 11.8], [19.2, 17], [4.8, 17]], 1)),
    k.pearl(8, 14.3, 0.95, { plate: 'K' }), k.pearl(12, 14.3, 0.95, { plate: 'K' }), k.pearl(16, 14.3, 0.95, { plate: 'K' }),
    k.rose(k.tube('M2.5 20.6 Q4.25 19.1 6 20.6 T9.5 20.6 T13 20.6 T16.5 20.6 T20 20.6', 1.6), { plate: 'A' }),
  ],
  // a blush bag on a pearl handle, a satin bow on the front
  'shopping-bag': (icon, k) => [
    k.pearls('M8.5 9.8 V6.6 A3.5 3.5 0 0 1 15.5 6.6 V9.8', 0.82, { plate: 'A' }),
    k.body(fillSk(k, icon, 0, 0.95)),
    k.bow(12, 12.6, 0.64, 0),
  ],
  // a blush basket, gold handle, rose rim with a lace frill
  'shopping-basket': (icon, k) => [
    k.gold(k.tube('M6.5 10 A5.5 6.5 0 0 1 17.5 10', 1.8), { plate: 'A' }),
    k.body(k.grow(k.path('M3.6 10 H20.4 L18.5 19.32 A2 2 0 0 1 16.52 21 H7.48 A2 2 0 0 1 5.5 19.32 Z'), 0.7)),
    k.fill(k.tube('M8.4 15 V18 M12 15 V18 M15.6 15 V18', 1.3), 'c2'),
    k.lace('M4.6 12 H19.4', 0.7),
    k.rose(k.pill(2, 8.7, 22, 11.5), { plate: 'K' }),
  ],
  'shopping-cart-plus': (icon, k) => [
    k.body(k.union(k.poly([[5.1, 4.8], [20.7, 4.8], [18.3, 14.5], [7.3, 14.6]], 1.2), k.tube('M2.5 2.5 H3.7 A1 1 0 0 1 4.68 3.3 L6.9 14.3 A1 1 0 0 0 7.88 15 H17.3', 2.1))),
    k.satin(k.tube('M12.6 7.6 V12.2 M10.3 9.9 H14.9', 2), { plate: 'S' }),
    k.pearl(8.5, 20, 2, { plate: 'A' }), k.pearl(17, 20, 2, { plate: 'A' }),
  ],
  'shopping-cart': (icon, k) => [
    k.body(k.union(k.poly([[5.3, 6.8], [20.7, 6.8], [18.3, 14], [7.1, 14.6]], 1.2), k.tube('M2.5 3.5 H3.7 A1 1 0 0 1 4.68 4.3 L6.7 13.8 A1 1 0 0 0 7.68 14.5 H17.3', 2.1))),
    k.heart(12.8, 10.6, 4.6, 0, { plate: 'A' }),
    k.pearl(8.5, 19.5, 2, { plate: 'A' }), k.pearl(17, 19.5, 2, { plate: 'A' }),
  ],
  // two satin ribbons crossing, the bow on a tail
  shuffle: (icon, k) => [
    k.body(k.tube('M3 6.5 H5 C6.76 6.5 8.11 7.63 9.31 9.16 M13.19 14.84 C14.39 16.37 15.74 17.5 17.5 17.5 H21 M17.5 14 L21 17.5 L17.5 21', 2.7), { plate: 'A' }),
    k.body(k.tube('M3 17.5 H5 C10.5 17.5 12 6.5 17.5 6.5 H21 M17.5 3 L21 6.5 L17.5 10', 2.7)),
    k.bow(3.4, 17.5, 0.52, 0),
  ],
  sidebar: (icon, k) => panel(k, k.rect(0, 0, 9.4, 24), 'M9.5 4.2 V19.8', [
    k.fill(k.tube('M5.2 8 H7.2 M5.2 11 H7.2 M5.2 14 H7.2', 1.1), 'c2'),
    k.bow(4.2, 4.8, 0.5, -16),
  ]),
  // bars rising from blush to rose, a heart crowning the top bar
  signal: (icon, k) => [
    k.body(k.tube('M4.5 19.5 V16.5 M9.5 19.5 V12.5', 2.7)),
    k.rose(k.tube('M14.5 19.5 V8.5 M19.5 19.5 V7.4', 2.7), { plate: 'K' }),
    k.heart(19.5, 4.6, 4.6, 0, { plate: 'K' }),
  ],
  // a satin signature flourish ending in a heart, on a gold line
  signature: (icon, k) => [
    k.gold(k.tube('M3 20.6 H21', 1.3), { plate: 'A', ow: 0.35 }),
    k.body(k.tube('M3 16.5 C6 15 10 11 10 7 C10 3.5 6 3.5 6 7 C6 10.5 7 16.5 9 16.5 C10.5 16.5 11 13 12.5 13 C14 13 14 16.5 15.5 16.5 C16.6 16.5 17.4 15.2 18.6 14.6', 2.3)),
    k.heart(20.2, 13.4, 4.4, 20),
  ],
  // blush signs on a gold post, a heart on the top sign
  signpost: (icon, k) => [
    k.gold(k.tube('M12 7.6 V21.4', 2), { plate: 'A' }),
    k.rose(k.pill(8.6, 20.4, 15.4, 22.6), { plate: 'A' }),
    k.body(k.union(k.poly([[5.2, 2.4], [17.2, 2.4], [20.2, 5.5], [17.2, 8.6], [5.2, 8.6]], 1), k.poly([[18.8, 11.4], [6.8, 11.4], [3.8, 14.5], [6.8, 17.6], [18.8, 17.6]], 1))),
    k.heart(11.4, 5.6, 3.8, 0, { plate: 'K' }),
  ],
  // a blush dome on a rose base, a heart lamp, ribbon-red rays
  siren: (icon, k) => [
    k.satin(k.tube('M12 2.4 V4.6 M4.4 5.9 L6 7.5 M19.6 5.9 L18 7.5', 1.9), { plate: 'S' }),
    k.body(k.grow(k.path('M7 17.6 V13 A5 5 0 0 1 17 13 V17.6 Z'), 0.9)),
    k.heart(12, 13.8, 4.4, 0, { plate: 'K' }),
    k.rose(k.rr(3.4, 17, 20.6, 22, 1.8), { plate: 'K' }),
  ],
  // a satin triangle and bar, a bow tied on the bar
  'skip-back': (icon, k) => [
    k.body(k.union(fillSk(k, icon, 0, 1.1), k.pill(3.1, 4.4, 6, 19.6))),
    k.bow(4.6, 4.8, 0.5, -16),
  ],
  'skip-forward': (icon, k) => [
    k.body(k.union(fillSk(k, icon, 0, 1.1), k.pill(18, 4.4, 20.9, 19.6))),
    k.bow(19.4, 4.8, 0.5, 16),
  ],
  // rose rails with pearl knobs and a heart knob
  sliders: (icon, k) => [
    k.rose(k.tube('M3 6 H21 M3 12 H21 M3 18 H21', 2), { plate: 'K' }),
    k.pearl(16, 6, 2.6, { plate: 'A' }),
    k.heart(8, 12.3, 6.8, 0, { plate: 'A' }),
    k.pearl(13, 18, 2.6, { plate: 'A' }),
  ],
}
