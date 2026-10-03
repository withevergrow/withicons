// PASTEL redraw chunk 1 of 5 — hand-composed Pastel icons for the names assigned to chunk 1.
// Each entry: 'icon-name': (icon, p) => layers. See forge/styles/PASTEL-GUIDE.md (API, kit, rules).
// Exemplars in _pastel-render.mjs win over entries here. Only this chunk's owner edits this file.
//
// Chunk 1 = icons 1-100 of `ls forge/icons` (accessibility .. circle-arrow-down).
// Pure line glyphs (chevron*, braces, at-sign, audio-lines, bluetooth) stay automatic; align-* and bold are redrawn.

// ---------------------------------------------------------------------------------
// local helpers (built only from the frozen vocabulary p)
const AW = { w: 3.25, head: 7 } // arrow weight of the arrow-right exemplar

// the bell exemplar's dome and clapper (bell family)
const bellDome = p => [p.path('M5.5 16.25 V11.25 A6.5 6.5 0 0 1 18.5 11.25 V16.25 L20 17.25 A0.9 0.9 0 0 1 19.5 18.75 H4.5 A0.9 0.9 0 0 1 4 17.25 Z'), p.circle(12, 4, 1.6)]
// the camera exemplar's body (media family)
const cameraLayers = p => [
  ['lavender', p.unite(p.rr(2, 7, 22, 20.5, 3.25), p.rr(8, 4, 16, 9, 1.75))],
  ['paper@A', p.circle(12, 13.75, 5)],
  ['sky.well@A', p.circle(12, 13.75, 3.25)],
  ['butter.flat', p.circle(18.4, 10, 1.1)],
]
// the calendar exemplar's page, header and rings
const calendarBase = p => {
  const c = p.calendar(3, 4.5, 21, 21.25, 10)
  return [['lavender', c.body], ['blush', c.head], ['butter@A', c.rings]]
}
// battery: lavender shell with a paper well and a terminal nub
const batteryBase = p => [
  ['lavender', p.rr(2, 6.25, 19.25, 17.75, 3.25)],
  ['lavender.flat', p.rr(19.75, 9.75, 22.25, 14.25, [0, 1.1, 1.1, 0])],
  ['paper.well', p.rr(4.25, 8.5, 17, 15.5, 1.6)],
]
// briefcase: peach body, lavender handle (A)
const briefcaseBase = p => [
  ['peach@K', p.rr(2, 7.25, 22, 20.75, 3.25)],
  ['lavender@A', p.cut(p.rr(7.75, 3, 16.25, 9.5, 2.25), p.rr(9.75, 5, 14.25, 9.5, 1), p.rr(1.4, 6.65, 22.6, 21.35, 3.85))],
]
// scalloped badge (rosette)
const rosette = p => p.join(p.circle(12, 12, 8), p.around(p.circle(12, 3.9, 2.6), 8, 12, 12, 22.5))
// a chart's L-shaped axis
const axis = (p, w = 2.5) => p.bar([[3.5, 3], [3.5, 20.5], [21, 20.5]], w)

export const R = {
  // a sky disc with a paper figure, arms open
  accessibility: (icon, p) => [
    ['sky', p.circle(12, 12, 10)],
    ['paper.flat', p.circle(12, 6.5, 1.9),
      p.unite(p.seg2(6.75, 9.75, 17.25, 9.75, 2.1), p.seg2(12, 9.75, 12, 14, 2.4), p.bar([[8.75, 18.25], [12, 13.5], [15.25, 18.25]], 2.2))],
  ],
  // a blush heartbeat trace
  activity: (icon, p) => [
    ['blush', p.bar([[2.5, 12.5], [6.25, 12.5], [9, 5], [15, 19.25], [17.75, 12.5], [21.5, 12.5]], 3)],
  ],
  // a mint book with ink binding tabs, a peach person (two hues)
  'address-book': (icon, p) => [
    ['mint@K', p.rr(4, 2.25, 20.25, 21.75, 3)],
    ['ink', p.seg2(5.75, 7.25, 7.25, 7.25, 1.6), p.seg2(5.75, 12, 7.25, 12, 1.6), p.seg2(5.75, 16.75, 7.25, 16.75, 1.6)],
    ['peach@A', p.rr(8.75, 13.25, 17.75, 18.25, [4, 4, 1.25, 1.25]), p.circle(13.25, 8.75, 2.9)],
  ],
  // blush clock in a paper face, butter bells (A), blush legs; body first so it is c1
  'alarm-clock': (icon, p) => {
    const body = p.circle(12, 13, 8.75)
    return [
      ['blush@K', body],
      ['blush.flat@K', p.cut(p.join(p.seg2(7, 18.75, 5, 21.25, 2.4), p.seg2(17, 18.75, 19, 21.25, 2.4)), p.circle(12, 13, 9.4))],
      ['paper', p.circle(12, 13, 6.25)],
      ['ink', p.bar([[12, 9.25], [12, 13], [14.75, 14.75]], 1.75)],
      ['butter@A', p.cut(p.join(p.rot(p.half(12, 3.5, 3.75, 'n'), -42, 12, 13), p.rot(p.half(12, 3.5, 3.75, 'n'), 42, 12, 13)), p.circle(12, 13, 9.5))],
    ]
  },
  // blush disc, ink exclamation
  'alert-circle': (icon, p) => [
    ['blush', p.circle(12, 12, 10)],
    ['ink', p.seg2(12, 6.75, 12, 12.75, 2.5), p.circle(12, 16.75, 1.5)],
  ],
  // butter warning triangle, ink exclamation
  'alert-triangle': (icon, p) => [
    ['butter', p.poly([[12, 2.25], [22.25, 20.5], [1.75, 20.5]], [2.5, 2.75, 2.75])],
    ['ink', p.seg2(12, 9, 12, 13.75, 2.4), p.circle(12, 17.25, 1.45)],
  ],
  // a peach van (K) with a blush cross, a paper windshield well, lavender wheels in a moat
  ambulance: (icon, p) => [
    ['peach@K', p.unite(p.rr(1.75, 5.5, 15.75, 18, [2.75, 1.5, 0, 2.75]), p.poly([[14.5, 8.75], [18.75, 8.75], [22.25, 13], [22.25, 18], [14.5, 18]], [0, 1.5, 1.5, 2.25, 0]))],
    ['paper.well@K', p.poly([[16.25, 10.5], [18.25, 10.5], [20.25, 13.25], [16.25, 13.25]], [1, 1, 0.9, 1])],
    ['blush.flat@K', p.glyph('plus', 8.5, 11.5, 3.25, 3)],
    ['cut', p.circle(7, 18, 3.6), p.circle(17.5, 18, 3.6)],
    ['lavender@A', p.circle(7, 18, 2.6), p.circle(17.5, 18, 2.6)],
  ],
  // align: four flat 2.25u bars with 2u gaps (no top plane), one lavender field
  'align-center': (icon, p) => [['lavender.flat', p.seg2(3.5, 5.6, 20.5, 5.6, 2.25), p.seg2(7, 9.85, 17, 9.85, 2.25), p.seg2(3.5, 14.1, 20.5, 14.1, 2.25), p.seg2(7, 18.35, 17, 18.35, 2.25)]],
  'align-justify': (icon, p) => [['lavender.flat', ...[5.6, 9.85, 14.1, 18.35].map(y => p.seg2(3.5, y, 20.5, y, 2.25))]],
  'align-left': (icon, p) => [['lavender.flat', p.seg2(3.5, 5.6, 20.5, 5.6, 2.25), p.seg2(3.5, 9.85, 14, 9.85, 2.25), p.seg2(3.5, 14.1, 20.5, 14.1, 2.25), p.seg2(3.5, 18.35, 14, 18.35, 2.25)]],
  'align-right': (icon, p) => [['lavender.flat', p.seg2(3.5, 5.6, 20.5, 5.6, 2.25), p.seg2(10, 9.85, 20.5, 9.85, 2.25), p.seg2(3.5, 14.1, 20.5, 14.1, 2.25), p.seg2(10, 18.35, 20.5, 18.35, 2.25)]],
  // a sky anchor with a butter stock
  anchor: (icon, p) => [
    ['sky', p.unite(
      p.ring(12, 4.75, 2.6, 1.1),
      p.seg2(12, 7, 12, 20.25, 2.75),
      p.arc(12, 11.5, 8.75, 22, 158, 2.75),
      p.bar([[1.75, 12.5], [3.75, 15.25], [6.75, 14.25]], 2.4),
      p.bar([[22.25, 12.5], [20.25, 15.25], [17.25, 14.25]], 2.4))],
    ['butter.flat', p.pill(7.5, 8.75, 16.5, 11.25)],
  ],
  // a blush face with ink brows, eyes and a frown
  angry: (icon, p) => [
    ['blush', p.circle(12, 12, 10)],
    ['ink', p.seg2(6.75, 7.75, 10, 9.5, 1.75), p.seg2(17.25, 7.75, 14, 9.5, 1.75),
      p.circle(8.75, 12.25, 1.35), p.circle(15.25, 12.25, 1.35),
      p.arc(12, 19.75, 3.75, 220, 320, 1.75)],
  ],
  // a lavender window, ink title dots, a sky content well
  'app-window': (icon, p) => [
    ['lavender', p.rr(2, 3.25, 22, 20.75, 3.25)],
    ['ink', p.circle(5.6, 6.5, 1.05), p.circle(8.6, 6.5, 1.05), p.circle(11.6, 6.5, 1.05)],
    ['sky.well', p.rr(4, 9.25, 20, 18.75, 1.75)],
  ],
  // a blush apple, peach stem, mint leaf (A)
  apple: (icon, p) => [
    ['blush', p.path('M12 8 C10.25 6.6 3.75 6 3.75 13 C3.75 18 7.25 21.75 9.4 21.75 C10.6 21.75 11 21.2 12 21.2 C13 21.2 13.4 21.75 14.6 21.75 C16.75 21.75 20.25 18 20.25 13 C20.25 6 13.75 6.6 12 8 Z')],
    ['peach.flat', p.stroke('M12 8.25 C12 6.5 11.5 4.75 10.5 3.5', 2)],
    ['mint@A', p.lens(12.75, 6.25, 18.25, 2.75, 1.75)],
  ],
  // a lavender crate under a sky lid (A), an ink slot bar
  archive: (icon, p) => [
    ['lavender@K', p.rr(3.5, 8.5, 20.5, 21.25, [0, 0, 3, 3])],
    ['ink', p.seg2(9.5, 13, 14.5, 13, 2)],
    ['sky@A', p.rr(2, 3, 22, 9, 2.5)],
  ],
  // arrows: the arrow-right exemplar's weight and head in every direction
  'arrow-down-left': (icon, p) => [['lavender', p.arrow(18, 6, 6.25, 17.75, { w: 3.25, head: 8 })]],
  'arrow-down-right': (icon, p) => [['lavender', p.arrow(6, 6, 17.75, 17.75, { w: 3.25, head: 8 })]],
  'arrow-up-left': (icon, p) => [['lavender', p.arrow(18, 18, 6.25, 6.25, { w: 3.25, head: 8 })]],
  'arrow-up-right': (icon, p) => [['lavender', p.arrow(6, 18, 17.75, 6.25, { w: 3.25, head: 8 })]],
  'arrow-down': (icon, p) => [['lavender', p.arrow(12, 3.5, 12, 20.25, AW)]],
  'arrow-up': (icon, p) => [['lavender', p.arrow(12, 20.5, 12, 3.75, AW)]],
  'arrow-left': (icon, p) => [['lavender', p.arrow(20.5, 12, 3.75, 12, AW)]],
  'arrow-left-right': (icon, p) => [['lavender', p.unite(p.arrow(12, 12, 21, 12, { w: 3, head: 5.5 }), p.arrow(12, 12, 3, 12, { w: 3, head: 5.5 }))]],
  'arrow-up-down': (icon, p) => [['lavender', p.unite(p.arrow(12, 12, 12, 21, { w: 3, head: 5.5 }), p.arrow(12, 12, 12, 3, { w: 3, head: 5.5 }))]],
  // three lavender orbits around a blush nucleus
  atom: (icon, p) => {
    const orbit = p.cut(p.ellipse(12, 12, 10.25, 4.25), p.ellipse(12, 12, 8.25, 2.4))
    return [
      // three separate entries: each orbit stays an exact path and overlaps the last (no costly union)
      ['lavender.flat', orbit], ['lavender', p.rot(orbit, 60, 12, 12)], ['lavender.flat', p.rot(orbit, -60, 12, 12)],
      ['blush@A', p.circle(12, 12, 2.5)],
    ]
  },
  // a butter medal with a recessed centre on a blush ribbon
  award: (icon, p) => [
    ['butter@K', p.circle(12, 9.25, 7)],
    ['blush@A', p.cut(p.poly([[7.25, 12], [16.75, 12], [17.5, 21.75], [14.75, 20], [12, 21.75], [9.25, 20], [6.5, 21.75]], [1, 1, 1, 1, 0.9, 1, 1]), p.circle(12, 9.25, 7.6))],
    ['butter.well', p.circle(12, 9.25, 3.9)],
  ],
  // a peach pack, a butter pocket, a lavender carry loop (A)
  backpack: (icon, p) => {
    const body = p.rr(4.25, 5.5, 19.75, 21.75, [6, 6, 3, 3])
    return [
      ['peach@K', body],
      ['lavender@A', p.cut(p.arc(12, 6.25, 3.25, 180, 360, 2.25), p.rr(3.65, 4.9, 20.35, 22.35, [6.6, 6.6, 3.6, 3.6]))],
      ['butter', p.rr(7.5, 13.25, 16.5, 21.75, [2.25, 2.25, 3, 3])],
      ['ink', p.seg2(10, 16.25, 14, 16.25, 1.6)],
    ]
  },
  // a mint rosette with an ink check
  'badge-check': (icon, p) => [
    ['mint', rosette(p)],
    ['ink', p.check([[8.25, 12.25], [10.9, 14.9], [15.75, 9.5]], 2)],
  ],
  // a butter rosette with an ink percent sign
  'badge-percent': (icon, p) => [
    ['butter', rosette(p)],
    ['ink', p.seg2(9, 15, 15, 9, 1.8), p.circle(9, 9, 1.4), p.circle(15, 15, 1.4)],
  ],
  // a blush balloon, peach knot, lavender string (A)
  balloon: (icon, p) => [
    ['blush@K', p.drop(12, 9.5, 7.25, 12, 17.75, 2)],
    ['lavender.flat@A', p.stroke('M12 19 C10.75 19.75 13.25 20.5 12 22.25', 1.5)],
    ['peach.flat', p.poly([[12, 16.75], [13.6, 19], [10.4, 19]], 0.9)],
  ],
  // one blush prohibition sign
  ban: (icon, p) => [
    ['blush', p.unite(p.ring(12, 12, 10, 6.75), p.seg2(6.5, 6.5, 17.5, 17.5, 3.25))],
  ],
  // a peach plaster with a butter pad and ink pores
  bandage: (icon, p) => {
    const R = s => p.rot(s, -45, 12, 12)
    return [
      ['peach', R(p.pill(1, 7.75, 23, 16.25))],
      ['butter.flat', R(p.rr(8.25, 8.25, 15.75, 15.75, 1.5))],
      ['ink', R(p.join(p.circle(10.5, 10.5, 0.85), p.circle(13.5, 10.5, 0.85), p.circle(10.5, 13.5, 0.85), p.circle(13.5, 13.5, 0.85)))],
    ]
  },
  // a mint note with a paper medallion and ink spots
  banknote: (icon, p) => [
    ['mint', p.rr(1.75, 5.25, 22.25, 18.75, 2.75)],
    ['paper.flat', p.circle(12, 12, 3.4)],
    ['ink', p.circle(5.5, 12, 1.25), p.circle(18.5, 12, 1.25), p.circle(12, 12, 1.2)],
  ],
  // lavender bars in a soft rhythm
  barcode: (icon, p) => [
    ['lavender', p.seg2(4, 5, 4, 19, 2.75), p.seg2(11, 5, 11, 19, 2.75), p.seg2(19.75, 5, 19.75, 19, 2.75)],
    ['lavender.flat', p.seg2(7.5, 5, 7.5, 19, 1.6), p.seg2(14.4, 5, 14.4, 19, 1.6), p.seg2(16.75, 5, 16.75, 19, 1.6)],
  ],
  // a peach ball with ink seams
  basketball: (icon, p) => [
    ['peach@K', p.circle(12, 12, 10)],
    ['ink@K', p.clip(p.join(
      p.seg2(12, 1, 12, 23, 1.6), p.seg2(1, 12, 23, 12, 1.6),
      p.arc(1.5, 12, 8, -62, 62, 1.6), p.arc(22.5, 12, 8, 118, 242, 1.6)), p.circle(12, 12, 9.4))],
  ],
  // a sky tub on a paper rim, a lavender tap (A), lavender feet
  bath: (icon, p) => {
    const tub = p.rr(2.75, 11.25, 21.25, 19.5, [0, 0, 5, 5])
    return [
      ['sky@K', tub],
      ['lavender.flat@K', p.cut(p.join(p.seg2(6.5, 18.5, 5.5, 21.25, 2.25), p.seg2(17.5, 18.5, 18.5, 21.25, 2.25)), p.rr(2.15, 10.65, 21.85, 20.1, [0, 0, 5.6, 5.6]))],
      ['paper', p.pill(1.5, 9.75, 22.5, 12.75)],
      ['lavender@A', p.cut(p.bar([[5.5, 10], [5.5, 5.25], [6.75, 3.5], [8.75, 3.5], [10, 5.25]], 2.4), p.pill(0.9, 9.15, 23.1, 13.35))],
    ]
  },
  // battery: lavender shell, paper well, a mint charge
  battery: (icon, p) => [...batteryBase(p), ['mint.flat', p.rr(5.5, 9.75, 15.75, 14.25, 1.1)]],
  // battery-low: a short blush charge
  'battery-low': (icon, p) => [...batteryBase(p), ['blush.flat', p.rr(5.5, 9.75, 8.75, 14.25, 1.1)]],
  // battery-charging: a butter bolt centred in the paper well, with a moat where it crosses the shell
  'battery-charging': (icon, p) => {
    const bolt = [[12.6, 3.75], [7, 12.75], [10.4, 12.75], [9.6, 20.25], [15.25, 11.25], [11.85, 11.25]]
    return [
      ...batteryBase(p),
      ['cut', p.unite(p.poly(bolt, 0.8), p.bar(bolt, 2.4, true))],
      ['butter@S', p.poly(bolt, 0.8)],
    ]
  },
  // a lavender frame, a paper pillow, a peach blanket
  bed: (icon, p) => [
    ['lavender', p.unite(p.rr(2, 4.5, 5.25, 21, 1.6), p.rr(2, 13.5, 22, 18, 1.6), p.rr(19, 16, 22, 21, 1.4))],
    ['paper', p.rr(6.25, 9.25, 10.5, 13.75, 1.75)],
    ['peach@A', p.rr(11, 9.5, 22, 14, [3, 2, 0, 0])],
  ],
  // a butter glass under a paper head, a peach handle (A), ink ribs
  beer: (icon, p) => [
    ['butter@K', p.rr(4, 7, 16.5, 21.75, [1.5, 1.5, 3, 3])],
    ['peach@K', p.cut(p.arc(16, 13.75, 3.25, -90, 90, 2.6), p.rr(3.4, 6.4, 17.1, 22.35, [2.1, 2.1, 3.6, 3.6]))],
    ['ink@K', p.seg2(8.25, 12, 8.25, 18.25, 1.6), p.seg2(12.25, 12, 12.25, 18.25, 1.6)],
    ['paper@A', p.unite(p.circle(6.25, 6.75, 2.75), p.circle(10.25, 5.25, 3.1), p.circle(14.25, 6.75, 2.75), p.rr(3.5, 6.5, 17, 9.75, 1.75))],
  ],
  // the bell exemplar crossed by the blush slash
  'bell-off': (icon, p) => [
    ['butter@K', ...bellDome(p)],
    ['peach@A', p.cut(p.circle(12, 19, 2.6), p.rr(3, 10, 21, 19.35, 1))],
    ...p.slashLayers('blush', [3.5, 3.25], [20.5, 20.75]),
  ],
  // the bell exemplar with two lavender ring waves (dome first: c1 and the glint stay on the dome)
  'bell-ring': (icon, p) => [
    ['butter@K', ...bellDome(p)],
    ['peach@A', p.cut(p.circle(12, 19, 2.6), p.rr(3, 10, 21, 19.35, 1))],
    ['lavender.flat@deco', p.arc(12, 11, 9.75, 198, 232, 2.1), p.arc(12, 11, 9.75, 308, 342, 2.1)],
  ],
  // a slim peach frame behind lavender wheel rings with hubs, a butter saddle
  bike: (icon, p) => [
    // two frame entries so the frame triangle stays open (one traced field would fill it)
    ['peach.flat@K', p.bar([[6.25, 16.25], [12, 16.25], [9.25, 8.25], [16.75, 8.25]], 1.9), p.seg2(9.25, 8.25, 9, 7, 1.9)],
    ['peach@K', p.bar([[12, 16.25], [16.75, 8.25]], 1.9), p.bar([[17.75, 16.25], [16.25, 8.25], [15.5, 5.75], [18, 5.25]], 1.9)],
    ['lavender@A', p.ring(6.25, 16.25, 4.5, 2.6), p.ring(17.75, 16.25, 4.5, 2.6)],
    ['lavender.flat@A', p.circle(6.25, 16.25, 1.2), p.circle(17.75, 16.25, 1.2)],
    ['butter.flat@A', p.pill(7, 5.5, 11.5, 7.5)],
  ],
  // lavender barrels on a peach bridge, sky lenses
  binoculars: (icon, p) => [
    ['peach', p.rr(8.5, 9.5, 15.5, 14.75, 1.5)],
    ['lavender', p.rr(1.75, 9, 10.25, 21, 3.5), p.rr(13.75, 9, 22.25, 21, 3.5), p.rr(3.5, 3.25, 9, 10, 1.75), p.rr(15, 3.25, 20.5, 10, 1.75)],
    ['sky.well', p.circle(6, 16.25, 2.5), p.circle(18, 16.25, 2.5)],
  ],
  // a sky bird with a peach wing (A), a butter beak and an ink eye
  bird: (icon, p) => {
    const body = p.unite(
      p.rot(p.ellipse(11, 14, 8.25, 5.75), -12, 11, 14),
      p.circle(16.25, 8.5, 4.25),
      p.poly([[1.5, 9.5], [7.5, 11.5], [4.5, 16.5]], 1.2))
    return [
    ['sky@K', body],
    ['butter.flat', p.cut(p.join(p.seg2(10, 18.5, 9.25, 21.5, 1.6), p.seg2(13, 18.25, 13, 21.5, 1.6)), p.rot(p.ellipse(11, 14, 8.85, 6.35), -12, 11, 14)),
      p.poly([[19.75, 6.75], [23, 8.75], [19.75, 10.25]], 0.9)],
    ['peach@A', p.lens(6, 12.25, 14.5, 15.5, 2.75, 1.1)],
    ['ink', p.circle(17.25, 7.75, 1.15)],
    ]
  },
  // one solid lavender B with real counters
  bold: (icon, p) => [
    ['lavender', p.cut(
      p.unite(p.rr(5, 2.5, 15.25, 12.75, [2, 5, 5, 0]), p.rr(5, 11.5, 17.75, 21.5, [0, 5, 5, 2])),
      p.rr(8.75, 5.5, 12.25, 9.75, 1.5), p.rr(8.75, 14.5, 14.25, 18.5, 1.75))],
  ],
  // a lavender book, a paper page edge, a butter label
  book: (icon, p) => [
    ['lavender', p.rr(4.25, 2.25, 19.75, 21.75, [2, 3.25, 3.25, 2])],
    ['paper', p.rr(6.5, 17, 19.75, 21.75, [1.5, 0, 3.25, 1.5])],
    ['butter.flat', p.rr(9.5, 6, 16, 9.75, 1.25)],
  ],
  // an open book: lavender cover, two paper pages with ink lines
  'book-open': (icon, p) => [
    ['lavender', p.rr(1.75, 6.5, 22.25, 21, 2.5)],
    ['paper@A', p.poly([[3.5, 4.25], [8, 4.25], [11.25, 6.25], [11.25, 19.75], [8, 18], [3.5, 18]], [1.5, 1.5, 1, 1, 1.5, 1.5])],
    ['paper', p.poly([[20.5, 4.25], [20.5, 18], [16, 18], [12.75, 19.75], [12.75, 6.25], [16, 4.25]], [1.5, 1.5, 1.5, 1, 1, 1.5])],
    ['ink', p.seg2(5.75, 8.75, 9, 9.5, 1.35), p.seg2(5.75, 12, 9, 12.75, 1.35), p.seg2(18.25, 8.75, 15, 9.5, 1.35), p.seg2(18.25, 12, 15, 12.75, 1.35)],
  ],
  // a blush ribbon bookmark
  bookmark: (icon, p) => [
    ['blush', p.poly([[5.25, 2.25], [18.75, 2.25], [18.75, 21.75], [12, 16.75], [5.25, 21.75]], [2.75, 2.75, 1.4, 1.6, 1.4])],
  ],
  // the bookmark with an ink plus
  'bookmark-plus': (icon, p) => [
    ['blush', p.poly([[5.25, 2.25], [18.75, 2.25], [18.75, 21.75], [12, 16.75], [5.25, 21.75]], [2.75, 2.75, 1.4, 1.6, 1.4])],
    ['ink', p.glyph('plus', 12, 9.25, 3, 2)],
  ],
  // a lavender robot head, sky visor with ink eyes, peach antenna (A)
  bot: (icon, p) => [
    ['lavender@K', p.rr(3.5, 7, 20.5, 20.75, 4)],
    ['lavender.flat@K', p.rr(1.5, 11.5, 2.9, 16, [1.25, 0, 0, 1.25]), p.rr(21.1, 11.5, 22.5, 16, [0, 1.25, 1.25, 0])],
    ['peach@A', p.seg2(12, 3.5, 12, 6.4, 2), p.circle(12, 3, 1.85)],
    ['sky.well', p.rr(6, 10.25, 18, 16.75, 2.5)],
    ['ink', p.circle(9.5, 13.5, 1.35), p.circle(14.5, 13.5, 1.35)],
  ],
  // a blush brain: two hemispheres, ink folds
  brain: (icon, p) => [
    ['blush', p.join(p.circle(8.5, 8, 5), p.circle(15.5, 8, 5), p.circle(6.75, 13.75, 5), p.circle(17.25, 13.75, 5), p.rr(6.5, 9, 17.5, 20.5, 4.5))],
    ['ink', p.seg2(12, 5, 12, 19.25, 1.6),
      p.stroke('M5.5 11 C7.5 10.75 8.75 12 8.75 14', 1.4), p.stroke('M18.5 11 C16.5 10.75 15.25 12 15.25 14', 1.4),
      p.stroke('M8.25 5.75 C8.25 7 9 8 10 8.25', 1.4), p.stroke('M15.75 5.75 C15.75 7 15 8 14 8.25', 1.4)],
  ],
  // the briefcase: peach case, ink seam, butter clasp
  briefcase: (icon, p) => [
    ...briefcaseBase(p),
    ['ink', p.seg2(3, 13, 21, 13, 1.4)],
    ['butter.flat', p.rr(9.75, 11.25, 14.25, 14.75, 1.25)],
  ],
  // the briefcase with a blush cross
  'briefcase-medical': (icon, p) => [
    ...briefcaseBase(p),
    ['blush.flat', p.unite(p.rr(10.5, 9.75, 13.5, 18.25, 1), p.rr(7.75, 12.5, 16.25, 15.5, 1))],
  ],
  // a mint beetle with a lavender head and legs, an ink wing seam
  bug: (icon, p) => [
    ['mint@K', p.ellipse(12, 14.5, 6.5, 7)],
    ['lavender@K', p.cut(p.half(12, 8.25, 4, 'n'), p.ellipse(12, 14.5, 7.1, 7.6))],
    ['lavender.flat@A', p.cut(p.join(p.bar([[6.25, 10.5], [3.25, 9], [2.5, 7.25]], 1.6), p.bar([[17.75, 10.5], [20.75, 9], [21.5, 7.25]], 1.6),
      p.seg2(6, 14.5, 2.5, 14.5, 1.6), p.seg2(18, 14.5, 21.5, 14.5, 1.6),
      p.bar([[6.5, 18], [3.5, 19.5], [2.75, 21.25]], 1.6), p.bar([[17.5, 18], [20.5, 19.5], [21.25, 21.25]], 1.6),
      p.bar([[10.5, 4.5], [9, 2.25]], 1.6), p.bar([[13.5, 4.5], [15, 2.25]], 1.6)),
      p.ellipse(12, 14.5, 7.1, 7.6), p.circle(12, 8.25, 4.6))],
    ['ink', p.seg2(12, 9, 12, 20.5, 1.6)],
  ],
  // a lavender tower, sky windows, a butter door
  building: (icon, p) => [
    ['lavender', p.rr(4.5, 2.25, 19.5, 21.75, [2.75, 2.75, 1.25, 1.25])],
    ['sky.well', ...[6.5, 10.25].flatMap(y => [p.rr(7.25, y, 10.25, y + 2.5, 0.9), p.rr(13.75, y, 16.75, y + 2.5, 0.9)])],
    ['butter.well@A', p.arch(9.75, 15, 14.25, 21.75)],
  ],
  // butter buns, mint lettuce, a peach patty, ink seeds
  burger: (icon, p) => [
    ['butter', p.rr(3, 16.25, 21, 21, [1.5, 1.5, 3.25, 3.25])],
    ['peach', p.pill(2.25, 12.75, 21.75, 16.75)],
    ['mint.flat', p.pill(2.5, 10.5, 21.5, 13.25)],
    ['butter', p.rr(3, 3, 21, 11, [8, 8, 1.75, 1.75])],
    ['ink', p.circle(9, 6.5, 0.9), p.circle(12.5, 5.5, 0.9), p.circle(15.5, 7, 0.9)],
  ],
  // a sky bus, a paper windshield, butter lamps, lavender wheels
  bus: (icon, p) => [
    ['lavender', p.rr(5.75, 17, 9.25, 21.75, 1.4), p.rr(14.75, 17, 18.25, 21.75, 1.4)],
    ['sky', p.rr(3.75, 2.25, 20.25, 19.25, 3.5)],
    ['ink', p.seg2(8.5, 4.5, 15.5, 4.5, 1.4)],
    ['paper.well', p.rr(6, 6.75, 18, 12.25, 1.5)],
    ['butter.flat', p.circle(7.75, 15.5, 1.3), p.circle(16.25, 15.5, 1.3)],
  ],
  // blush upper wings, peach lower wings (A), a lavender body
  butterfly: (icon, p) => {
    const moat = p.pill(10.1, 4.85, 13.9, 21.15)
    return [
      ['lavender@K', p.pill(10.75, 5.5, 13.25, 20.5)],
      ['lavender.flat@K', p.stroke('M11.5 6 C11 4 10 3 8.75 2.5', 1.35), p.stroke('M12.5 6 C13 4 14 3 15.25 2.5', 1.35)],
      ['peach@A', p.cut(p.join(p.rot(p.ellipse(7.5, 16, 3.75, 4.5), 25, 7.5, 16), p.rot(p.ellipse(16.5, 16, 3.75, 4.5), -25, 16.5, 16)), moat)],
      ['blush@A', p.cut(p.join(p.rot(p.ellipse(6.75, 8.75, 4.75, 5.5), -25, 6.75, 8.75), p.rot(p.ellipse(17.25, 8.75, 4.75, 5.5), 25, 17.25, 8.75)), moat)],
    ]
  },
  // a butter sponge under blush icing, a lavender candle, a butter flame (A): three hues
  cake: (icon, p) => [
    ['butter@K', p.rr(3, 10.25, 21, 21.25, [2.5, 2.5, 2.75, 2.75])],
    ['blush@K', p.unite(p.rr(3, 10.25, 21, 14, [2.5, 2.5, 0, 0]), p.circle(5.25, 14.25, 2.25), p.circle(9.5, 14.75, 2), p.circle(14, 14.25, 2.25), p.circle(18.5, 14.75, 2.25))],
    ['lavender.flat', p.rr(10.75, 5.75, 13.25, 10.6, [1, 1, 0, 0])],
    ['butter@A', p.drop(12, 3.4, 1.6, 12, 0, 0.45)],
  ],
  // a lavender calculator, a sky screen, paper keys
  calculator: (icon, p) => [
    ['lavender', p.rr(4, 1.75, 20, 22.25, 3.25)],
    ['sky.well', p.rr(6.5, 4.25, 17.5, 9, 1.5)],
    ['paper.flat', ...[11.5, 15, 18.5].flatMap(y => [7.75, 12, 16.25].map(x => p.rr(x - 1.4, y - 1.15, x + 1.4, y + 1.15, 0.9)))],
  ],
  // the calendar with an ink check
  'calendar-check': (icon, p) => [...calendarBase(p), ['ink', p.check([[8, 15.5], [10.75, 18.25], [16, 12.75]], 1.9)]],
  // the calendar with a grid of ink days and a butter today
  'calendar-days': (icon, p) => [
    ...calendarBase(p),
    ['ink', ...[[7.5, 13.5], [12, 13.5], [16.5, 13.5], [7.5, 17.5], [12, 17.5]].map(([x, y]) => p.circle(x, y, 1.1))],
    ['butter.flat', p.rr(15, 16, 18, 19, 1.1)],
  ],
  // the calendar with an ink plus
  'calendar-plus': (icon, p) => [...calendarBase(p), ['ink', p.glyph('plus', 12, 15.5, 3, 1.9)]],
  // the camera exemplar crossed by the blush slash
  'camera-off': (icon, p) => [...cameraLayers(p).slice(0, 3), ...p.slashLayers('blush', [3.25, 3.25], [20.75, 20.75])],
  // a lavender card with ink caption dashes
  captions: (icon, p) => [
    ['lavender', p.rr(1.75, 4.25, 22.25, 19.75, 3.5)],
    ['ink', p.seg2(6, 12.25, 8.75, 12.25, 1.75), p.seg2(11.75, 12.25, 18, 12.25, 1.75), p.seg2(6, 15.75, 13.5, 15.75, 1.75), p.seg2(16.5, 15.75, 18, 15.75, 1.75)],
  ],
  // a peach car, sky windows, butter lamp, lavender wheels in a moat
  car: (icon, p) => [
    ['peach', p.unite(p.rr(1.75, 10.75, 22.25, 18, 3), p.poly([[5.5, 11.5], [7.75, 5.5], [16.25, 5.5], [18.5, 11.5]], [0, 1.75, 1.75, 0]))],
    ['sky.well', p.poly([[7.6, 10.75], [9, 7.25], [11.25, 7.25], [11.25, 10.75]], 0.9), p.poly([[12.75, 10.75], [12.75, 7.25], [15, 7.25], [16.4, 10.75]], 0.9)],
    ['paper.flat', p.pill(18.25, 12.5, 21, 14.25)],
    ['cut', p.circle(7, 18, 3.6), p.circle(17, 18, 3.6)],
    ['lavender@A', p.circle(7, 18, 2.6), p.circle(17, 18, 2.6)],
  ],
  // a sky screen with a lavender broadcast in its open corner
  cast: (icon, p) => {
    const open = p.circle(2.5, 20.5, 11)
    return [
      ['sky@K', p.cut(p.rr(2, 3.5, 22, 19.5, 3), open)],
      ['sky.well@K', p.cut(p.rr(4.5, 6, 19.5, 17, 1.5), p.circle(2.5, 20.5, 13.25))],
      ['lavender@A', p.circle(3.5, 19.5, 1.9), p.arc(3, 20, 5.25, 270, 360, 2.3), p.arc(3, 20, 8.75, 270, 360, 2.3)],
    ]
  },
  // a peach cat head, ink eyes, a blush nose
  cat: (icon, p) => [
    ['peach', p.unite(p.ellipse(12, 14, 9, 7.25), p.poly([[3.5, 13], [4.25, 2.75], [10.5, 7.5]], [1, 1.5, 1]), p.poly([[13.5, 7.5], [19.75, 2.75], [20.5, 13]], [1, 1.5, 1]))],
    ['ink', p.circle(8.75, 13, 1.25), p.circle(15.25, 13, 1.25)],
    ['blush.flat', p.poly([[10.75, 15.75], [13.25, 15.75], [12, 17.25]], 0.9)],
  ],
  // a lavender axis, a sky area under a soft ridge
  'chart-area': (icon, p) => [
    ['lavender@K', axis(p)],
    ['sky@A', p.poly([[6.75, 18.25], [6.75, 12.5], [10.5, 8.25], [14, 11.75], [20.25, 5], [20.25, 18.25]], [1.25, 1.25, 1.25, 1.25, 1.25, 1.25])],
  ],
  // a lavender axis, three bars: sky, blush, sky (three hues in all)
  'chart-bar': (icon, p) => [
    ['lavender@K', axis(p)],
    ['sky@A', p.rr(7, 11, 10.5, 18, [1.5, 1.5, 0.9, 0.9])],
    ['blush@A', p.rr(12, 4.5, 15.5, 18, [1.5, 1.5, 0.9, 0.9])],
    ['sky@A', p.rr(17, 8.5, 20.5, 18, [1.5, 1.5, 0.9, 0.9])],
  ],
  // a lavender axis, a blush trend line
  'chart-line': (icon, p) => [
    ['lavender@K', axis(p)],
    ['blush@A', p.bar([[7.5, 15.5], [11, 10.75], [14, 13.5], [20, 6.25]], 2.75)],
  ],
  // a lavender pie with a butter slice pulled out (A)
  'chart-pie': (icon, p) => [
    ['lavender', p.sector(11, 13, 9.25, 0, 270)],
    ['butter@A', p.sector(13.25, 10.75, 8.75, 270, 360)],
  ],
  // two mint checks
  'check-check': (icon, p) => [
    ['mint', p.check([[1.75, 13], [6, 17.25], [14.75, 7.25]], 3), p.check([[11.75, 16.25], [12.75, 17.25], [22, 7.25]], 3)],
  ],
  // a mint disc with an ink check
  'check-circle': (icon, p) => [
    ['mint', p.circle(12, 12, 10)],
    ['ink', p.check([[7.5, 12.25], [10.75, 15.5], [16.5, 9]], 2.4)],
  ],
  // a mint tile with an ink check
  'check-square': (icon, p) => [
    ['mint', p.rr(2.25, 2.25, 21.75, 21.75, 3.5)],
    ['ink', p.check([[7.5, 12.25], [10.75, 15.5], [16.5, 9]], 2.4)],
  ],
  // a lavender puff over a peach band with ink pleats
  'chef-hat': (icon, p) => [
    ['lavender@K', p.unite(p.circle(7, 9.5, 4.5), p.circle(12, 7, 5), p.circle(17, 9.5, 4.5), p.rr(6, 9, 18, 16.5, 1))],
    ['peach@K', p.rr(6, 15.5, 18, 21.5, [1, 1, 2.75, 2.75])],
    ['ink', p.seg2(9.5, 17.5, 9.5, 19.5, 1.5), p.seg2(12, 17.5, 12, 19.5, 1.5), p.seg2(14.5, 17.5, 14.5, 19.5, 1.5)],
  ],
  // the circle-control family: a lavender disc with an ink arrow down
  'circle-arrow-down': (icon, p) => [
    ['lavender', p.circle(12, 12, 10)],
    ['ink@A', p.arrow(12, 7.25, 12, 17, { w: 2.5, head: 4.5 })],
  ],
}
