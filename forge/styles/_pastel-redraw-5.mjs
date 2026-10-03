// PASTEL redraw chunk 5 of 5 — hand-composed Pastel icons for the names assigned to chunk 5.
// Each entry: 'icon-name': (icon, p) => layers. See forge/styles/PASTEL-GUIDE.md (API, kit, rules).
// Exemplars in _pastel-render.mjs win over entries here. Only this chunk's owner edits this file.

// ---- local helpers -----------------------------------------------------------------
const RAD = Math.PI / 180
const pt = (cx, cy, r, a) => [cx + r * Math.cos(a * RAD), cy + r * Math.sin(a * RAD)]
// a soft rounded square container with an ink glyph (square-*)
const sq = (hue, kind) => (icon, p) => {
  const L = [[hue, p.rr(3, 3, 21, 21, 4)]]
  if (kind) L.push(['ink', p.glyph(kind, 12, 12, 4.25, 2.25)])
  return L
}
// sun rays: n short bars around (cx, cy) between radii r0..r1, angles a0..a1
const rays = (p, cx, cy, r0, r1, angles, w = 2.25) => angles.map(a => { const [x0, y0] = pt(cx, cy, r0, a), [x1, y1] = pt(cx, cy, r1, a); return p.seg2(x0, y0, x1, y1, w) })
// a horizon sun (sunrise / sunset): butter half disc, butter rays and horizon line, lavender arrow
const horizonSun = dir => (icon, p) => [
  ['butter', p.segment(12, 17, 5.75, 180, 360)],
  ['butter.flat', ...rays(p, 12, 17, 8.5, 10.5, [195, 240, 300, 345]), p.pill(2.25, 18.5, 21.75, 20.75)],
  ['lavender@A', dir === 'up'
    ? p.arrow(12, 8.75, 12, 1.75, { w: 2.5, head: 3.5 })
    : p.arrow(12, 1.75, 12, 8.75, { w: 2.5, head: 3.5 })],
]
// person (user-* family): lavender shoulders, peach head; slightly smaller and left to leave
// room for a badge
const who = (p, cx = 10, top = 3, s = 0.86) => { const u = p.person(cx, top, s); return [['lavender', u.body], ['peach', u.head]] }

export const R = {
  // sky handset, lavender screen well, ink home pill and speaker slot
  smartphone: (icon, p) => [
    ['sky', p.rr(5.25, 1.75, 18.75, 22.25, 3.25)],
    ['lavender.well', p.rr(7.25, 4.5, 16.75, 17, 1.5)],
    ['ink', p.pill(10, 19, 14, 20.5)],
  ],
  // butter face, ink eyes and smile
  smile: (icon, p) => [
    ['butter', p.circle(12, 12, 10)],
    ['ink', p.ellipse(8.75, 9.75, 1.3, 1.6), p.ellipse(15.25, 9.75, 1.3, 1.6), p.arc(12, 12.25, 4.75, 30, 150, 2)],
  ],
  // sky six-arm flake with little branches, a paper heart hexagon
  snowflake: (icon, p) => {
    const arm = p.join(p.seg2(12, 12, 12, 1.75, 2.5), p.bar([[8.75, 2.75], [12, 6], [15.25, 2.75]], 2.25))
    return [
      ['sky', p.unite(p.around(arm, 6, 12, 12))],
      ['paper', p.poly(p.ngon(12, 12, 3.4, 6), 0.9)],
    ]
  },
  // peach back, butter seat cushion, peach arms, lavender feet
  sofa: (icon, p) => [
    ['peach', p.rr(5, 4.5, 19, 13.5, 3)],
    ['lavender.flat', p.rr(4.5, 18, 6.75, 21.25, 1), p.rr(17.25, 18, 19.5, 21.25, 1)],
    ['butter', p.rr(6, 12, 18, 18, 1.75)],
    ['peach', p.rr(2, 9.5, 7, 19.25, 2.5), p.rr(17, 9.5, 22, 19.25, 2.5)],
  ],
  // peach bowl with a butter surface and soft steam
  soup: (icon, p) => [
    ['peach', p.path('M2.25 11.5 H21.75 A9.75 8.75 0 0 1 2.25 11.5 Z'), p.rr(8.5, 18, 15.5, 21.5, 1.25)],
    ['butter.flat', p.pill(3.75, 11, 20.25, 13.25)],
    ['lavender.flat@A', p.steam(8, 8.5, 5, 1.85), p.steam(12, 8.5, 5, 1.85), p.steam(16, 8.5, 5, 1.85)],
  ],
  // butter big sparkle, blush and lavender small ones
  sparkles: (icon, p) => [
    ['butter', p.poly(p.star(10, 13.5, 9.75, 3.4, 4), 1)],
    ['blush', p.poly(p.star(18.5, 5.25, 4.25, 1.6, 4), 0.9)],
    ['lavender.flat', p.circle(19.25, 17.75, 1.75)],
  ],
  // sky cabinet, paper cone ring, lavender driver (A), ink tweeter
  speaker: (icon, p) => [
    ['sky', p.rr(4.75, 1.75, 19.25, 22.25, 3.25)],
    ['paper', p.circle(12, 14.75, 5)],
    ['lavender.well@A', p.circle(12, 14.75, 2.75)],
    ['ink', p.circle(12, 6.5, 1.6)],
  ],
  // mint leaves on a mint stem, peach soil mound
  sprout: (icon, p) => [
    ['mint.flat@K', p.seg2(12, 19.5, 12, 10, 2.5)],
    ['peach@K', p.cap(5, 21.5, 19, 21.5, 3.5)],
    ['mint@A', p.lens(12, 11.75, 2.5, 5.5, 3.6), p.lens(12, 10, 21.5, 3.25, 3.6)],
  ],
  square: sq('lavender'),
  'square-minus': sq('blush', 'minus'),
  'square-plus': sq('mint', 'plus'),
  'square-x': sq('blush', 'x'),
  // a butter left half, the right half kept as a soft lavender outline
  'star-half': (icon, p) => {
    const s = p.star5(12, 12.75, 10.75, 5.1, 1.1)
    const P = p.star(12, 12.85, 9.6, 4.6, 5)
    const edge = p.unite(p.stroke('M' + P.map(q => q[0].toFixed(2) + ' ' + q[1].toFixed(2)).join(' L') + ' Z', 2.25))
    return [
      ['butter', p.clip(s, p.rect(0, 0, 12, 24))],
      ['lavender.flat', p.clip(edge, p.rect(12, 0, 24, 24))],
    ]
  },
  // mint tubing, peach ear tips, lavender chest piece with a paper well
  stethoscope: (icon, p) => [
    ['mint', p.stroke('M5.5 3.25 V8.5 A4.25 4.25 0 0 0 14 8.5 V3.25', 2.5), p.stroke('M9.75 12.75 V15.25 A4.25 4.25 0 0 0 18.25 15.25 V13.5', 2.5)],
    ['peach.flat', p.circle(5.5, 3, 1.6), p.circle(14, 3, 1.6)],
    ['lavender@A', p.circle(18.25, 10.75, 3.25)],
    ['paper.well@A', p.circle(18.25, 10.75, 1.4)],
  ],
  // butter note, paper curl at the bottom-right, ink lines
  'sticky-note': (icon, p) => {
    const f = p.page(3, 3, 21, 21, 6, 3)
    return [
      ['butter', p.flipY(f.sheet, 12)],
      ['paper@A', p.flipY(f.fold, 12)],
      ['ink', p.lines(7, [16.5, 12.5], [8.25, 12.25])],
    ]
  },
  // one soft blush stop block
  stop: (icon, p) => [
    ['blush', p.rr(4, 4, 20, 20, 4)],
  ],
  // peach walls, blush awning with paper stripes, sky door well and window
  store: (icon, p) => {
    const aw = p.unite(p.rr(2.25, 2.75, 21.75, 8, [2.5, 2.5, 0, 0]), ...[4.69, 9.56, 14.44, 19.31].map(x => p.circle(x, 8, 2.44)))
    return [
      ['peach', p.rr(4, 7, 20, 21.25, [0, 0, 2.75, 2.75])],
      ['blush@A', aw],
      ['paper', p.clip(aw, p.join(p.rect(7.13, 0, 12, 24), p.rect(16.88, 0, 22, 24)))],
      ['sky.well@A', p.arch(7, 13.75, 12, 21.25)],
      ['sky.well', p.rr(14, 13.75, 17.5, 17.25, 1.25)],
    ]
  },
  // sun-moon: butter half sun with rays, lavender crescent half
  'sun-moon': (icon, p) => [
    ['butter', p.segment(12, 12, 5.75, 90, 270)],
    ['peach.flat', ...rays(p, 12, 12, 8.25, 10.25, [135, 180, 225, 270, 90])],
    ['lavender', p.cut(p.segment(12, 12, 5.75, -90, 90), p.circle(9.25, 12, 4.5))],
  ],
  sunrise: horizonSun('up'),
  // text formatting family: one lavender field each, a peach or blush mark where the glyph has one
  type: (icon, p) => [
    ['lavender', p.unite(p.seg2(5, 4.75, 19, 4.75, 3.25), p.seg2(12, 4.75, 12, 20, 3.5), p.seg2(9.25, 20, 14.75, 20, 2.75))],
  ],
  underline: (icon, p) => [
    ['lavender', p.unite(p.stroke('M6.75 3.5 V10.25 A5.25 5.25 0 0 0 17.25 10.25 V3.5', 3.25))],
    ['peach.flat', p.seg2(4.5, 20.5, 19.5, 20.5, 2.5)],
  ],
  strikethrough: (icon, p) => [
    ['lavender', p.unite(p.stroke('M17 6.75 C16.25 4.75 14.25 3.75 12 3.75 C9.25 3.75 7 5.25 7 7.75 C7 10.5 9.75 11.25 12 12 C14.5 12.75 17.25 13.75 17.25 16.5 C17.25 18.75 15 20.25 12 20.25 C9.5 20.25 7.5 19.25 6.75 17.25', 3.25))],
    ['cut', p.seg2(2.5, 12, 21.5, 12, 2.5 + 2 * 1.2)],
    ['blush.flat', p.seg2(3.5, 12, 20.5, 12, 2.5)],
  ],
  subscript: (icon, p) => [
    ['lavender', xMark(p, 3.25, 4.5, 13.25, 16.25)],
    ['peach.flat', two(p, 15.25, 13.75)],
  ],
  superscript: (icon, p) => [
    ['lavender', xMark(p, 3.25, 8, 13.25, 19.75)],
    ['peach.flat', two(p, 15.25, 2.5)],
  ],
  // a soft blush tooth with two roots, a sky sparkle off its shoulder
  tooth: (icon, p) => [
    ['blush', p.path('M7.5 2.75 C9.25 2.75 10.25 3.75 12 3.75 C13.75 3.75 14.75 2.75 16.5 2.75 C19.5 2.75 20.75 5.25 20.25 8.5 C19.75 11.5 18.5 12.75 18 15.75 L17.25 19.75 C16.9 21.6 14.6 21.9 14.25 20 L13.4 15.4 C13.1 14 10.9 14 10.6 15.4 L9.75 20 C9.4 21.9 7.1 21.6 6.75 19.75 L6 15.75 C5.5 12.75 4.25 11.5 3.75 8.5 C3.25 5.25 4.5 2.75 7.5 2.75 Z')],
    ['sky@deco', p.sparkle(20.5, 18.75, 3.25)],
  ],
  // three lavender node discs with ink centres, joined by soft curved bars that stop short of them
  webhook: (icon, p) => {
    const N = [[12, 5.5], [5, 17.5], [19, 17.5]]
    const links = p.join(
      p.stroke('M12 5.5 Q5.25 8.25 5 17.5', 2.25),
      p.stroke('M5 17.5 Q12 22.75 19 17.5', 2.25),
      p.stroke('M19 17.5 Q18.75 8.25 12 5.5', 2.25),
    )
    return [
      ['lavender.flat', p.cut(p.unite(links), ...N.map(([x, y]) => p.circle(x, y, 4.1)))],
      ['lavender', ...N.map(([x, y]) => p.circle(x, y, 3.2))],
      ['ink', ...N.map(([x, y]) => p.circle(x, y, 1.25))],
    ]
  },
  sunset: horizonSun('down'),

  // ---- batch 2 ----------------------------------------------------------------------
  // drawn upright, then turned 45°: sky barrel, blush dose, lavender plunger (A), needle
  syringe: (icon, p) => {
    const T = s => p.scale(p.rot(s, 45, 12, 12), 1.08, 12, 12)
    return [
      ['sky', T(p.rr(8.5, 5.5, 15.5, 17.25, 2))],
      ['lavender.flat', T(p.seg2(12, 17, 12, 22.75, 1.6))],
      ['blush.flat', T(p.rr(9.75, 10.5, 14.25, 16, 1))],
      ['lavender@A', T(p.seg2(12, 6, 12, 2.25, 2.25)), T(p.pill(8.25, 0.75, 15.75, 3))],
      ['ink', T(p.seg2(9.75, 8.25, 11.25, 8.25, 1.2))],
    ]
  },
  // lavender sheet, blush header row, ink grid
  table: (icon, p) => [
    ['lavender', p.rr(2.75, 3.5, 21.25, 20.5, 3)],
    ['blush', p.rr(2.75, 3.5, 21.25, 8.75, [3, 3, 0, 0])],
    ['ink', p.seg2(4.5, 14.5, 19.5, 14.5, 1.5), p.seg2(9, 10.5, 9, 18.75, 1.5), p.seg2(15, 10.5, 15, 18.75, 1.5)],
  ],
  // sky slate, lavender screen well, ink home dot
  tablet: (icon, p) => [
    ['sky', p.rr(3.5, 1.75, 20.5, 22.25, 3.25)],
    ['lavender.well', p.rr(5.75, 4.25, 18.25, 17.25, 1.5)],
    ['ink', p.circle(12, 19.75, 1.3)],
  ],
  // blush outer ring, paper ring, blush bull's-eye
  target: (icon, p) => [
    ['blush', p.circle(12, 12, 10)],
    ['paper', p.circle(12, 12, 6.75)],
    ['blush@A', p.circle(12, 12, 3.6)],
  ],
  // butter cab with a butter roof sign, sky windows, lavender wheels with paper hubs
  taxi: (icon, p) => [
    ['butter', p.unite(p.rr(1.75, 10.75, 22.25, 18, 3), p.poly([[5.5, 11.5], [7.75, 6.25], [16.25, 6.25], [18.5, 11.5]], [0, 1.5, 1.5, 0]))],
    ['butter.flat@A', p.rr(9.5, 2.5, 14.5, 5.25, 1.25)],
    ['sky.well', p.poly([[7.75, 11], [9, 8], [11.4, 8], [11.4, 11]], 0.9), p.poly([[12.6, 11], [12.6, 8], [15, 8], [16.25, 11]], 0.9)],
    ['ink', p.seg2(3.75, 14.25, 5.25, 14.25, 1.5), p.seg2(18.75, 14.25, 20.25, 14.25, 1.5)],
    ['lavender@A', p.circle(7, 18.25, 2.75), p.circle(17, 18.25, 2.75)],
    ['paper.flat@A', p.circle(7, 18.25, 1.1), p.circle(17, 18.25, 1.1)],
  ],
  // sky tube tilted up, peach front ring, lavender eyepiece and tripod
  telescope: (icon, p) => {
    const T = s => p.rot(s, -28, 12, 11.5)
    const tube = T(p.rr(5.5, 8.75, 18.25, 14.25, 2))
    return [
      ['sky@K', tube],
      ['lavender.flat@K', p.cut(p.join(p.seg2(12, 13, 7, 21.5, 2.25), p.seg2(12, 13, 17, 21.5, 2.25)), tube)],
      ['peach', T(p.rr(17, 7.75, 21, 15.25, 1.75))],
      ['lavender.flat', T(p.rr(2.25, 9.75, 6.25, 13.25, 1.1))],
      ['ink', p.circle(12, 11.5, 1.2)],
    ]
  },
  // lavender racket frame, paper strings with ink weave, peach grip, butter ball
  tennis: (icon, p) => {
    const bed = p.circle(9.25, 9.25, 4.6)
    const head = p.circle(9.25, 9.25, 7)
    return [
      ['lavender@K', head],
      ['peach@A', p.cut(p.seg2(13.75, 13.75, 20.5, 20.5, 3), head)],
      ['paper.well', bed],
      ['ink', p.clip(p.join(p.seg2(7.6, 3, 7.6, 16, 1.2), p.seg2(10.9, 3, 10.9, 16, 1.2), p.seg2(3, 7.6, 16, 7.6, 1.2), p.seg2(3, 10.9, 16, 10.9, 1.2)), bed)],
      ['butter', p.circle(19.25, 4.75, 2.9)],
    ]
  },
  // lavender poles, mint canvas, butter doorway well
  tent: (icon, p) => [
    ['mint', p.poly([[12, 4.75], [2, 20.75], [22, 20.75]], [1.5, 1.75, 1.75])],
    ['lavender.flat', p.seg2(9.75, 2, 13, 6.75, 2), p.seg2(14.25, 2, 11, 6.75, 2)],
    ['butter.well@A', p.poly([[12, 11], [7.5, 20.75], [16.5, 20.75]], [1.25, 0.9, 0.9])],
  ],
  // sky glass tube with a blush mercury column and bulb, lavender ticks
  thermometer: (icon, p) => [
    ['sky', p.unite(p.pill(7.5, 1.75, 14.5, 16), p.circle(11, 17.25, 4.75))],
    ['blush', p.pill(9.75, 7.5, 12.25, 17), p.circle(11, 17.25, 3)],
    ['lavender.flat', p.seg2(17, 4.5, 20.5, 4.5, 2), p.seg2(17, 8.25, 19.5, 8.25, 2), p.seg2(17, 12, 20.5, 12, 2)],
  ],
  'thumbs-up': (icon, p) => thumb(p, false),
  'thumbs-down': (icon, p) => thumb(p, true),
  // blush ticket with side notches, butter stub, ink perforation
  ticket: (icon, p) => {
    const body = p.cut(p.rr(1.75, 5, 22.25, 19, 2.5), p.circle(1.75, 12, 2.4), p.circle(22.25, 12, 2.4))
    return [
      ['blush', p.clip(body, p.rect(0, 0, 15.5, 24))],
      ['butter', p.clip(body, p.rect(15.5, 0, 24, 24))],
      ['ink', p.circle(15.5, 8.25, 0.95), p.circle(15.5, 12, 0.95), p.circle(15.5, 15.75, 0.95)],
    ]
  },
  // lavender case, paper dial, ink hand (A), peach crown button
  timer: (icon, p) => [
    ['lavender', p.circle(12, 13.5, 8.75)],
    ['peach@A', p.rr(9.25, 1.5, 14.75, 4.25, 1.25)],
    ['lavender.flat', p.rr(11, 3.5, 13, 5.5, 0.9)],
    ['paper.well', p.circle(12, 13.5, 6.25)],
    ['ink@A', p.seg2(12, 13.5, 14.75, 10.25, 1.75), p.circle(12, 13.5, 1.4)],
  ],
  // mint track, paper knob (A)
  toggle: (icon, p) => [
    ['mint', p.pill(1.5, 5.5, 22.5, 18.5)],
    ['paper@A', p.circle(16, 12, 4.75)],
  ],
  // sky tank and bowl, paper seat, lavender flush lever
  toilet: (icon, p) => [
    ['sky', p.rr(3.25, 2.25, 10.25, 12.5, 2), p.path('M3.25 12 H20.5 A1.25 1.25 0 0 1 21.75 13.25 C21.5 16.5 19.25 18.25 16 18.75 L16.75 21.75 H6.25 L7 17.75 C4.75 16.75 3.25 14.75 3.25 12 Z')],
    ['paper@A', p.pill(9, 10.5, 22, 13.75)],
    ['lavender.flat', p.pill(5, 5, 8.5, 6.75)],
  ],
  // peach cone with paper reflective bands, lavender base
  'traffic-cone': (icon, p) => {
    const cone = p.poly([[10, 2], [14, 2], [18.75, 19.5], [5.25, 19.5]], [1.25, 1.25, 0, 0])
    return [
      ['peach', cone],
      ['paper', p.clip(cone, p.rect(0, 7.5, 24, 10.25)), p.clip(cone, p.rect(0, 13, 24, 15.75))],
      ['lavender', p.rr(2.25, 18.5, 21.75, 21.75, 1.5)],
    ]
  },
  // lavender carriage, sky windows, butter lamps, legs (A)
  train: (icon, p) => [
    ['lavender@K', p.rr(4.25, 1.75, 19.75, 18.75, 4.25)],
    ['lavender.flat@A', p.cut(p.join(p.seg2(8.5, 18, 6, 21.75, 2.25), p.seg2(15.5, 18, 18, 21.75, 2.25)), p.rr(4.25, 1.75, 19.75, 18.75, 4.25))],
    ['sky.well', p.rr(6.75, 5, 11.25, 10.75, 1.4), p.rr(12.75, 5, 17.25, 10.75, 1.4)],
    ['butter.flat', p.circle(8.25, 14.75, 1.5), p.circle(15.75, 14.75, 1.5)],
  ],
  // three mint tiers on a peach trunk
  'tree-pine': (icon, p) => [
    ['peach', p.rr(10.25, 16.5, 13.75, 22, 1)],
    ['mint', p.unite(
      p.poly([[12, 1.5], [6.5, 8.75], [17.5, 8.75]], [1.25, 1.25, 1.25]),
      p.poly([[12, 5], [4.5, 13.5], [19.5, 13.5]], [1.25, 1.25, 1.25]),
      p.poly([[12, 9], [3, 18.25], [21, 18.25]], [1.25, 1.5, 1.5]),
    )],
  ],

  // ---- batch 3 ----------------------------------------------------------------------
  // mint rising line (success), blush falling line
  'trending-up': (icon, p) => [['mint', trend(p)]],
  'trending-down': (icon, p) => [['blush', p.flipY(trend(p), 12)]],
  // butter cup with handles and an ink star, butter stem, lavender plinth
  trophy: (icon, p) => [
    ['butter', p.path('M5.75 2.75 H18.25 V8.75 A6.25 6.25 0 0 1 5.75 8.75 Z')],
    ['butter.flat', p.arc(5.75, 7.5, 2.9, 90, 270, 2.25), p.arc(18.25, 7.5, 2.9, -90, 90, 2.25), p.rr(10.75, 14, 13.25, 18.5, 0.9)],
    ['lavender', p.rr(6.5, 17.75, 17.5, 21.75, 1.6)],
    ['ink', p.star5(12, 8.5, 3, 1.4, 0.9)],
  ],
  // peach cargo box, lavender cab with a sky window, lavender wheels with paper hubs
  truck: (icon, p) => [
    ['peach', p.rr(1.75, 3.75, 14.5, 17.25, 2.25)],
    ['lavender', p.poly([[13.75, 7], [18.25, 7], [22.25, 11.5], [22.25, 17.25], [13.75, 17.25]], [1.25, 1.5, 1.5, 2, 1])],
    ['sky.well', p.poly([[16, 9.25], [17.5, 9.25], [20, 12], [16, 12]], 0.9)],
    ['cut', p.circle(6.5, 18, 3.6), p.circle(17.25, 18, 3.6)],
    ['lavender@A', p.circle(6.5, 18, 2.75), p.circle(17.25, 18, 2.75)],
    ['paper.flat@A', p.circle(6.5, 18, 1.1), p.circle(17.25, 18, 1.1)],
  ],
  // mint shell with a butter rim and ink plates, peach head and feet
  turtle: (icon, p) => [
    ['mint@K', p.cap(2.25, 15.25, 19, 15.25, 8.75)],
    ['butter.flat@K', p.pill(1.75, 14.25, 19.5, 17.25)],
    ['peach@A', p.cut(p.join(p.rr(4.5, 14, 7.5, 19.75, 1.5), p.rr(13.5, 14, 16.5, 19.75, 1.5), p.circle(20, 12.25, 2.75)), p.cap(2.25, 15.25, 19, 15.25, 8.75), p.pill(1.75, 14.25, 19.5, 17.25))],
    ['ink', p.bar(p.ngon(10.6, 10.75, 2.6, 6, 0), 1.35, true)],
  ],
  // sky set, lavender screen well, lavender antenna (A)
  tv: (icon, p) => [
    ['sky', p.rr(2, 6.5, 22, 20.75, 3.25)],
    ['lavender.flat@A', p.bar([[7.75, 2], [12, 6.25], [16.25, 2]], 2.25)],
    ['lavender.well', p.rr(4.5, 9, 19.5, 18.25, 1.6)],
  ],
  // blush scalloped canopy, lavender hook handle (A)
  umbrella: (icon, p) => {
    const canopy = p.cut(p.segment(12, 12.75, 10, 180, 360), p.circle(7, 14.25, 2.65), p.circle(12, 14.25, 2.65), p.circle(17, 14.25, 2.65))
    return [
    ['blush@K', canopy],
    ['lavender.flat@A', p.cut(p.stroke('M12 11.5 V18.75 A2.25 2.25 0 0 1 7.5 18.75', 2.25), canopy)],
    ['lavender.flat', p.circle(12, 2.5, 1.2)],
  ]
  },
  // lock family, opened: peach shackle lifted off its left post (A), lavender body, ink keyhole
  unlock: (icon, p) => [
    ['lavender@K', p.rr(3.75, 10.5, 20.25, 21.5, 3.25)],
    ['peach@A', p.cut(p.unite(p.arc(12, 6.25, 4.5, 180, 360, 2.75), p.seg2(7.5, 6.25, 7.5, 7.75, 2.75), p.seg2(16.5, 6.25, 16.5, 12, 2.75)), p.rr(3.75, 10.5, 20.25, 21.5, 3.25))],
    ['ink@A', p.circle(12, 15.25, 1.6), p.pill(11.15, 15.25, 12.85, 18.5)],
  ],
  // user family: lavender shoulders, peach head, then the modifier badge
  'user-check': (icon, p) => [...who(p), ...p.badgeLayers('check', 'mint')],
  'user-minus': (icon, p) => [...who(p), ...p.badgeLayers('minus', 'blush')],
  'user-plus': (icon, p) => [...who(p), ...p.badgeLayers('plus', 'mint')],
  'user-x': (icon, p) => [...who(p), ...p.badgeLayers('x', 'blush')],
  'user-cog': (icon, p) => [
    ...who(p),
    ['cut', p.circle(17.5, 17.5, 6.1)],
    ['butter@S', p.gear(17.5, 17.5, 5.1, 3.6, 6, 2.4)],
    ['cut', p.circle(17.5, 17.5, 1.35)],
  ],
  'user-pen': (icon, p) => {
    const P = s => p.rot(s, 45, 17.5, 16.5)
    return [
      ...who(p),
      ['cut', P(p.rr(15.25, 8.75, 19.75, 24, 2.25))],
      ['butter@S', P(p.rr(16, 9.75, 19, 19.25, [1.25, 1.25, 0, 0]))],
      ['peach.flat@S', P(p.poly([[16, 19], [19, 19], [17.5, 22.75]], [0.5, 0.5, 0.9]))],
    ]
  },
  'user-search': (icon, p) => [
    ...who(p),
    ['cut', p.circle(16.75, 16.75, 5.4), p.seg2(19, 19, 21.5, 21.5, 4.75)],
    ['peach.flat@S', p.seg2(19, 19, 21.25, 21.25, 2.5)],
    ['lavender@S', p.ring(16.75, 16.75, 4.25, 2.6)],
    ['sky.well@S', p.circle(16.75, 16.75, 2.6)],
  ],
  // sky disc framing a person: peach head, lavender shoulders clipped to the disc
  'user-circle': (icon, p) => {
    const d = p.circle(12, 12, 10)
    return [
      ['sky', d],
      ['lavender', p.clip(p.rr(4.5, 15, 19.5, 26, [6, 6, 0, 0]), p.circle(12, 12, 9.25))],
      ['peach', p.circle(12, 9.25, 3.75)],
    ]
  },
  // the lavender user in front, a peach person behind, a moat between them
  users: (icon, p) => {
    const b = p.person(16.5, 2.25, 0.74), f = p.person(9, 4, 0.84)
    const s = 0.84, r = 4.25 * s, y0 = 4 + 2 * r + 1.4 * s, M = 1.2
    const moat = p.join(p.circle(9, 4 + r, r + M), p.rr(9 - 8.25 * s - M, y0 - M, 9 + 8.25 * s + M, y0 + 8.85 * s + M, 6.25 * s + M))
    return [
      ['lavender@K', f.body],
      ['peach@K', f.head],
      ['peach@K', p.cut(b.body, moat), p.cut(b.head, moat)],
    ]
  },

  // ---- batch 4 ----------------------------------------------------------------------
  // peach fork, sky knife blade on a lavender handle
  utensils: (icon, p) => [
    ['peach', p.unite(p.rr(3.75, 2, 5.75, 9.5, 1), p.rr(6.75, 2, 8.75, 9.5, 1), p.rr(9.75, 2, 11.75, 9.5, 1), p.rr(3.75, 7.25, 11.75, 11.5, [0, 0, 3, 3]), p.pill(6.5, 10, 9, 22))],
    ['sky@A', p.path('M15 14.25 V2.5 C18.75 3.25 20.5 7.75 20.5 12.25 C20.5 13.4 19.75 14.25 18.6 14.25 Z')],
    ['lavender.flat@A', p.pill(15, 13.25, 17.75, 22)],
  ],
  // sky camera body, lavender lens (A), blush rec light
  'video-camera': (icon, p) => camcorder(p),
  // the camera with a person on a paper screen
  'video-call': (icon, p) => {
    const scr = p.rr(4.25, 7.5, 13.75, 16.5, 1.5)
    return [
      ...camcorder(p, false),
      ['paper.well', scr],
      ['lavender.flat', p.clip(p.rr(5.5, 13.25, 12.5, 20, [3, 3, 0, 0]), scr)],
      ['peach.flat', p.circle(9, 10.75, 2.1)],
    ]
  },
  'video-off': (icon, p) => [...camcorder(p), ...p.slashLayers('blush', [3, 3], [21, 21])],
  // sky speaker, lavender sound waves (A); off gets a blush x
  volume: (icon, p) => [...cone(p), ['lavender.flat@A', p.arc(13.5, 12, 3.75, -50, 50, 2.25), p.arc(13.5, 12, 7.5, -55, 55, 2.25)]],
  'volume-1': (icon, p) => [...cone(p), ['lavender.flat@A', p.arc(13.5, 12, 4, -50, 50, 2.25)]],
  'volume-off': (icon, p) => [...cone(p), ['blush.flat@S', p.glyph('x', 19, 12, 3.6, 2.25)]],
  // mint wallet, a paper card peeking out, butter clasp tab with an ink snap
  wallet: (icon, p) => [
    ['mint', p.rr(2.25, 5.25, 21.25, 20.5, 3.25)],
    ['paper@A', p.rr(5.5, 2.5, 17.5, 7.25, [1.5, 1.5, 0, 0])],
    ['cut', p.rr(1, 6.25, 23, 8.5, 0)],
    ['mint', p.rr(2.25, 6.25, 21.25, 20.5, [2.5, 2.5, 3.25, 3.25])],
    ['butter@A', p.rr(14.25, 10.25, 22.5, 16, [2, 0, 0, 2]), ],
    ['ink', p.circle(17.25, 13.1, 1.2)],
  ],
  // lavender wand with a paper tip, butter star, a blush sparkle
  wand: (icon, p) => [
    ['lavender', p.seg2(3.25, 20.75, 12.75, 11.25, 3)],
    ['paper.flat', p.seg2(10.5, 13.5, 12.75, 11.25, 3)],
    ['butter@A', p.star5(16, 8, 6.25, 2.9, 0.9)],
    ['blush@deco', p.sparkle(20.25, 17.25, 3)],
  ],
  // gabled peach walls under a wide, low lavender roof that overhangs them, butter roll-up door
  warehouse: (icon, p) => [
    ['peach@K', p.poly([[3.75, 10.25], [12, 5.75], [20.25, 10.25], [20.25, 21.25], [3.75, 21.25]], [1, 1.5, 1, 2.5, 2.5])],
    ['lavender@K', p.bar([[1.75, 11.25], [12, 5.5], [22.25, 11.25]], 3.25)],
    ['butter.well@A', p.rr(7.25, 12.75, 16.75, 21.25, [1.25, 1.25, 0, 0])],
    ['ink', p.seg2(8.75, 15.25, 15.25, 15.25, 1.35), p.seg2(8.75, 17.5, 15.25, 17.5, 1.35), p.seg2(8.75, 19.75, 15.25, 19.75, 1.35)],
  ],
  // mint machine, ink dials, paper porthole with a sky glass (A)
  'washing-machine': (icon, p) => [
    ['mint', p.rr(3.25, 1.75, 20.75, 22.25, 3.25)],
    ['ink', p.circle(6.6, 5.25, 1), p.circle(9.6, 5.25, 1)],
    ['butter.flat', p.pill(13, 4.25, 17.5, 6.25)],
    ['paper', p.circle(12, 14, 5.75)],
    ['sky.well@A', p.circle(12, 14, 3.9)],
    ['shine', p.arc(12, 14, 2.6, 200, 250, 1.1)],
  ],
  // peach straps, lavender case, paper dial with ink hands
  watch: (icon, p) => [
    ['peach', p.rr(8, 1.75, 16, 7, [1.75, 1.75, 0, 0]), p.rr(8, 17, 16, 22.25, [0, 0, 1.75, 1.75])],
    ['lavender', p.circle(12, 12, 7.25)],
    ['lavender.flat', p.rr(18.5, 10.75, 20.5, 13.25, 0.9)],
    ['paper.well', p.circle(12, 12, 5.1)],
    ['ink@A', p.bar([[12, 8.75], [12, 12], [14.25, 13.25]], 1.6)],
  ],
  // lavender ball camera, paper bezel, sky lens with a glint, peach stand
  webcam: (icon, p) => [
    ['lavender@K', p.circle(12, 10, 8)],
    ['peach@K', p.cut(p.unite(p.pill(5.5, 19.5, 18.5, 22.25), p.rr(10.75, 16, 13.25, 20.5, 0.9)), p.circle(12, 10, 8))],
    ['paper', p.circle(12, 10, 4.9)],
    ['sky.well@A', p.circle(12, 10, 3.1)],
    ['shine', p.arc(12, 10, 2, 200, 250, 1)],
  ],
  // sky signal arcs, lavender dot
  wifi: (icon, p) => wifi(p),
  'wifi-off': (icon, p) => [...wifi(p), ...p.slashLayers('blush', [3, 3], [21, 21])],
  // blush wine in a paper glass, paper stem and foot
  wine: (icon, p) => {
    const bowl = p.path('M5.75 2.25 H18.25 L18.5 7.5 A6.5 6.5 0 0 1 5.5 7.5 Z')
    return [
      ['sky', bowl],
      ['blush', p.clip(bowl, p.rect(0, 7.25, 24, 24))],
      ['sky.flat', p.rr(11, 13.5, 13, 20.5, 0.9), p.pill(7, 19.5, 17, 22)],
    ]
  },
  // lavender usb trident, sky end caps and base
  usb: (icon, p) => [
    ['lavender', p.arrow(12, 19, 12, 2, { w: 2.5, head: 3.75 }), p.bar([[12, 16.25], [6.5, 12.5], [6.5, 10]], 2.25), p.bar([[12, 14], [17.5, 10.5], [17.5, 8]], 2.25)],
    ['sky', p.circle(6.5, 8.75, 2.4), p.rr(15.25, 5, 19.75, 9.5, 1.1), p.circle(12, 19.75, 2.75)],
  ],
  // blush disc, ink x
  'x-circle': (icon, p) => [
    ['blush', p.circle(12, 12, 10)],
    ['ink', p.glyph('x', 12, 12, 4.4, 2.25)],
  ],
  // search family: lavender ring, sky glass, peach handle, ink plus / minus on the glass
  'zoom-in': (icon, p) => [...lens(p), ['ink', p.glyph('plus', 10.5, 10.5, 2.6, 1.9)]],
  'zoom-out': (icon, p) => [...lens(p), ['ink', p.glyph('minus', 10.5, 10.5, 2.6, 1.9)]],
}

// text formatting: a soft X in the box (x0, y0)-(x1, y1), and a small "2" whose top-left is (x, y)
function xMark(p, x0, y0, x1, y1) {
  return p.unite(p.seg2(x0 + 1.5, y0 + 1.5, x1 - 1.5, y1 - 1.5, 3.25), p.seg2(x1 - 1.5, y0 + 1.5, x0 + 1.5, y1 - 1.5, 3.25))
}
function two(p, x, y) {
  const f = n => +n.toFixed(2)
  return p.unite(p.stroke(`M${f(x + 0.5)} ${f(y + 2.25)} C${f(x + 0.75)} ${f(y + 0.75)} ${f(x + 1.9)} ${f(y)} ${f(x + 3.1)} ${f(y)} C${f(x + 4.5)} ${f(y)} ${f(x + 5.5)} ${f(y + 0.9)} ${f(x + 5.5)} ${f(y + 2.25)} C${f(x + 5.5)} ${f(y + 3.9)} ${f(x + 3.5)} ${f(y + 5)} ${f(x + 0.5)} ${f(y + 7.5)} H${f(x + 6)}`, 2.25))
}

function camcorder(p, rec = true) {
  const L = [
    ['sky', p.rr(1.75, 5, 16, 19, 3.25)],
    ['lavender@A', p.poly([[15, 10], [22.25, 6.25], [22.25, 17.75], [15, 14]], [1, 1.5, 1.5, 1])],
  ]
  if (rec) L.push(['blush.flat', p.circle(5.5, 8.75, 1.4)])
  return L
}
function cone(p) {
  return [['sky', p.poly([[2, 8.75], [6.5, 8.75], [12, 3.75], [12, 20.25], [6.5, 15.25], [2, 15.25]], [1.5, 0.9, 1.5, 1.5, 0.9, 1.5])]]
}
function wifi(p) {
  return [
    ['sky', p.arc(12, 19.5, 14, 228, 312, 2.75), p.arc(12, 19.5, 9.25, 225, 315, 2.75), p.arc(12, 19.5, 4.6, 222, 318, 2.75)],
    ['lavender', p.circle(12, 19.5, 2)],
  ]
}
function lens(p) {
  return [
    ['lavender@K', p.ring(10.5, 10.5, 8.25, 5)],
    ['peach@A', p.cut(p.seg2(15.75, 15.75, 20.25, 20.25, 3.5), p.circle(10.5, 10.5, 8.25))],
    ['sky.well', p.circle(10.5, 10.5, 5)],
  ]
}

// trending line: a soft polyline with an arrow head at the top-right
function trend(p) {
  return p.join(p.bar([[2.5, 17.75], [8.75, 11.5], [12.75, 15.5], [20.75, 7.5]], 3), p.bar([[14.75, 7], [21, 7], [21, 13.25]], 3))
}

// thumbs: peach hand over a lavender cuff; down is the same hand flipped
function thumb(p, down) {
  const F = s => down ? p.flipY(s, 12) : s
  return [
    ['peach', F(p.path('M7.75 10.25 L11.25 3.25 C12.75 2.25 15.25 3 14.9 5.6 L14.25 9.25 H19 A2.6 2.6 0 0 1 21.5 12.6 L19.85 18.9 A2.75 2.75 0 0 1 17.2 21 H7.75 Z'))],
    ['lavender@A', F(p.rr(2.25, 9.5, 7, 21.25, 1.75))],
    ['ink', F(p.seg2(15.5, 13.5, 20, 13.5, 1.35)), F(p.seg2(15.5, 17, 19.25, 17, 1.35))],
  ]
}
