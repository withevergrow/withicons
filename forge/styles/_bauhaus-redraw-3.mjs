// BAUHAUS redraws, chunk 3: arrow-left-right … brain
// (arrow-right is an art-director exemplar in _bauhaus-render.mjs; the entry here is a
// fallback that matches it.)

// rosette badge: eight lobes round a disc
const scallop = ({ around, circle }, n = 8, R = 7.25, r = 3) => [around(circle(12, 12 - R, r), n), circle(12, 12, R + 0.25)]
// a closed ellipse outline, as a path for stroke()
const ellD = (cx, cy, rx, ry) => `M${cx + rx} ${cy} A${rx} ${ry} 0 1 1 ${cx - rx} ${cy} A${rx} ${ry} 0 1 1 ${cx + rx} ${cy} Z`
// the family arrowhead: an isosceles triangle with one even corner radius, its back edge
// straight and square to the shaft (no notch, no bulge); the rounded tip lands on (tx, ty)
const AH = (p, tx, ty, deg, len = 7.5, half = 6.25) => p.head(tx, ty, deg, len, half, 1.6, { notch: 0, rb: 1.5 })
// straight arrow: a round-capped ink shaft whose cap ends well inside the head (no seam)
const arrowK = (p, x0, y0, x1, y1, o = {}) => {
  const { len = 7.5, half = 6.25, w = 2.5, shaft = 'ink', tip = 'c1' } = o
  const d = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / d, uy = (y1 - y0) / d
  const e = len - 1.25 - w / 2
  return [[shaft, p.seg2(x0, y0, x1 - ux * e, y1 - uy * e, w)], [tip, AH(p, x1, y1, Math.atan2(uy, ux) * 180 / Math.PI, len, half)]]
}
// a double-headed straight arrow along an axis: an ink shaft, clearly visible between two
// smaller family heads (red at the start, blue at the end)
const twoWay = (p, vertical) => {
  const L = 6, H = 5.25, a = 2.75, b = 21.25, e = L * 0.6
  const v = (x, y) => vertical ? [y, x] : [x, y]
  return [
    ['ink', p.seg2(...v(a + e, 12), ...v(b - e, 12), 2.5)],
    ['c1', AH(p, ...v(a, 12), vertical ? -90 : 180, L, H)],
    ['c3', AH(p, ...v(b, 12), vertical ? 90 : 0, L, H)],
  ]
}
// the exemplar bell (art director): yellow dome, red rim, ink clapper and finial
const bellBody = ({ arch, pill, circle }) => [
  ['c2', arch(6, 5, 18, 16.5, 'n')],
  ['c1', pill(3.5, 15.5, 20.5, 18.5)],
  ['ink', circle(12, 20.75, 1.75), circle(12, 3.75, 1.25)],
]
// battery case (blue, rounded) with its ink terminal cap
const cell = ({ rr, half }) => [['ink', half(20.25, 12, 2.25, 'e')], ['c3', rr(2, 6, 20.25, 18, 3)]]

export const R = {
  'arrow-left-right': p => twoWay(p, false),
  'arrow-right': p => arrowK(p, 3.75, 12, 20.75, 12),
  'arrow-up': p => arrowK(p, 12, 20.75, 12, 3.25),
  'arrow-up-down': p => twoWay(p, true),
  'arrow-up-left': p => arrowK(p, 18.5, 18.5, 4.5, 4.5, { len: 7, half: 6 }),
  'arrow-up-right': p => arrowK(p, 5.5, 18.5, 19.5, 4.5, { len: 7, half: 6 }),
  // red 'a' disc, the blue swash wrapping it and ending in a round cap
  'at-sign': ({ circle, stroke }) => [
    ['c1', circle(12, 12, 4.25)],
    ['c3', stroke('M16 7.75 V13.5 A2.75 2.75 0 0 0 21.5 13.5 V12 A9.5 9.5 0 1 0 16.5 20.25', 2.5)],
  ],
  // three orbits (blue, red, blue) woven over and under, ink nucleus in a moat
  atom: ({ ellipse, rot, cut, circle }) => {
    const o = d => rot(cut(ellipse(12, 12, 10, 4.25), ellipse(12, 12, 8, 2.25)), d)
    return [
      ['c3', o(0)],
      ['c1', o(60)],
      ['c2', o(120)],
      ['cut', circle(12, 12, 3.75)],
      ['ink', circle(12, 12, 2.25)],
    ]
  },
  'audio-lines': ({ seg2 }) => [
    ['c1', seg2(4, 10, 4, 14, 2.5), seg2(20, 10, 20, 14, 2.5)],
    ['ink', seg2(8, 6.5, 8, 17.5, 2.5), seg2(16, 7.5, 16, 16.5, 2.5)],
    ['c3', seg2(12, 3, 12, 21, 2.5)],
  ],
  // red medal with a yellow core over a blue ribbon with a soft swallowtail
  award: ({ circle, poly }) => [
    ['c3', poly([[8, 11.5], [6.25, 21.25], [12, 18.75], [17.75, 21.25], [16, 11.5]], [0, 1.25, 1.5, 1.25, 0])],
    ['c1', circle(12, 9, 7)],
    ['c2', circle(12, 9, 3.75)],
  ],
  // domed pack split at the flap: blue top, red body, yellow arched pocket, ink loop
  backpack: ({ rr, arch, arc, seg2, halves }) => [
    ['ink', arc(12, 5, 2.5, 180, 360, 2.25), seg2(9.5, 5, 9.5, 7, 2.25), seg2(14.5, 5, 14.5, 7, 2.25)],
    ...halves(rr(4.5, 6, 19.5, 21.5, [6.5, 6.5, 2.75, 2.75]), 'c3', 'c1', 'h', 11.5),
    ['c2', arch(8.75, 14.75, 15.25, 21.5, 'n')],
  ],
  'badge-check': (p) => [
    ['c3', ...scallop(p)],
    ...p.vee([[8, 12.25], [10.75, 15], [16.25, 9.25]], 2.75, 'tint', 'tint'),
  ],
  'badge-percent': (p) => [
    ['c1', ...scallop(p)],
    ['tint', p.seg2(15, 9, 9, 15, 2.25), p.circle(9, 9, 1.6), p.circle(15, 15, 1.6)],
  ],
  // red balloon with a cream highlight, a soft red knot, an ink string
  balloon: ({ drop, poly, lens, stroke }) => [
    ['ink', stroke('M12 17.5 C12 19 13.25 19.75 12.5 21.5', 1.5)],
    ['c1', drop(12, 8.75, 6.5, 12, 16.25, 1.75), poly([[12, 14.75], [14, 18], [10, 18]], [0, 1, 1])],
    ['tint', lens(7.75, 10.5, 9.75, 5.5, 0.9)],
  ],
  ban: ({ ring, seg2, clip, circle }) => [
    ['c1', ring(12, 12, 9.75, 6.75)],
    ['c1', clip(seg2(5, 5, 19, 19, 3), circle(12, 12, 7))],
  ],
  // yellow strip, red pad cut flush across it, cream perforations
  bandage: ({ rot, pill, rect, circle, clip }) => {
    const r = s => rot(s, -45)
    const strip = pill(2.5, 7.5, 21.5, 16.5)
    return [
      ['c2', r(strip)],
      ['c1', r(clip(strip, rect(8.5, 0, 15.5, 24)))],
      ['tint', r(circle(10.5, 10.25, 0.9)), r(circle(13.5, 10.25, 0.9)), r(circle(10.5, 13.75, 0.9)), r(circle(13.5, 13.75, 0.9))],
    ]
  },
  // green note, yellow coin, cream pips
  banknote: ({ rr, circle }) => [
    ['accent', rr(2, 5.5, 22, 18.5, 2.5)],
    ['c2', circle(12, 12, 3.75)],
    ['tint', circle(5.75, 12, 1.25), circle(18.25, 12, 1.25)],
  ],
  barcode: ({ pill }) => [
    ['ink', pill(3.25, 5, 5.75, 19), pill(13, 5, 15, 19), pill(20.25, 5, 21.75, 19)],
    ['c1', pill(7.5, 5, 11, 19)],
    ['c3', pill(16.25, 5, 18.75, 19)],
  ],
  basketball: ({ circle, seg2, arc, clip, join }) => {
    const ball = circle(12, 12, 9.75)
    return [
      ['c4', ball],
      ['ink', clip(join(seg2(12, 1, 12, 23, 1.75), seg2(1, 12, 23, 12, 1.75), arc(-1.5, 12, 11, -50, 50, 1.75), arc(25.5, 12, 11, 130, 230, 1.75)), ball)],
    ]
  },
  // blue tub under a yellow rim, ink tap and feet, one red drop
  bath: ({ rr, stroke, seg2, pill, drop }) => [
    ['ink', stroke('M5.25 11 V6.5 A2.5 2.5 0 0 1 10.25 6.5 V7.5', 2), seg2(7, 18.75, 6, 20.75, 2), seg2(17, 18.75, 18, 20.75, 2)],
    ['c3', rr(3.5, 11.5, 20.5, 19.5, [0, 0, 5.5, 5.5])],
    ['c2', pill(2, 10.25, 22, 13)],
  ],
  battery: (p) => [
    ...cell(p),
    ['c2', p.pill(4.75, 8.75, 12.5, 15.25)],
    ['tint', p.pill(13.75, 8.75, 17.5, 15.25)],
  ],
  'battery-charging': (p) => [
    ...cell(p),
    ['c2', p.poly([[12.75, 3.5], [6.5, 13], [11, 13], [9.5, 20.5], [15.75, 11], [11.25, 11]], 1)],
  ],
  'battery-low': (p) => [
    ...cell(p),
    ['c1', p.pill(4.75, 8.75, 8.75, 15.25)],
  ],
  // ink headboard and foot post (round caps), blue mattress slab, yellow pillow disc,
  // one red blanket dome with soft feet
  bed: ({ rr, pill, half, seg2, circle, soften }) => [
    ['ink', pill(2, 5, 4.75, 20.75), seg2(20, 17, 20, 19.75, 2.5)],
    ['c1', soften(half(15.25, 13.75, 5.75, 'n'), 1.25)],
    ['c3', rr(3.5, 13, 21.75, 18.5, 2.75)],
    ['c2', circle(8.25, 10.5, 2.75)],
  ],
  // red glass, yellow foam of three bubbles over a soft lip, blue handle, cream glint
  beer: ({ rr, arc, circle, unite }) => [
    ['c3', arc(17, 14.5, 3.25, -80, 80, 2.5)],
    ['c1', rr(4.5, 9, 17.5, 21.5, [1.5, 1.5, 3, 3])],
    ['c2', unite(circle(7.75, 7.75, 3), circle(12, 6.5, 3.5), circle(15.25, 8, 2.75), rr(4, 7.5, 18, 11, [0, 0, 1.75, 1.75]))],
    ['tint', rr(7.75, 13.25, 9.75, 18.75, 1)],
  ],
  // the whole bell, crossed by the round-capped slash in its own page-coloured halo
  'bell-off': (p) => {
    const halo = p.seg2(3.5, 3.5, 20.5, 20.5, 4.75)
    // every piece the halo leaves is softened; slivers too small to read are dropped
    const piece = sh => p.soften(({ subs: p.cut(sh, halo).subs.filter(q => {
      const b = p.ringsOf({ subs: [q] })[0] || [], xs = b.map(v => v[0]), ys = b.map(v => v[1])
      return Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) > 2.5
    }) }), 0.9)
    return [
      ['c2', piece(p.arch(6, 5, 18, 16.5, 'n'))],
      ['c1', piece(p.pill(3.5, 15.5, 20.5, 18.5))],
      ['ink', piece(p.join(p.circle(12, 20.75, 1.75), p.circle(12, 3.75, 1.25)))],
      ['ink', p.seg2(3.5, 3.5, 20.5, 20.5, 2.5)],
    ]
  },
  // the bell with two blue sound arcs, round-capped
  'bell-ring': (p) => [
    ...bellBody(p),
    ['c3', p.arc(12, 11, 9.75, 197, 237, 2.25), p.arc(12, 11, 9.75, 303, 343, 2.25)],
  ],
  // two blue wheel rings, one round-joined red frame triangle with its top tube, ink fork,
  // bars and saddle, every end a round cap
  bike: ({ ring, bar, seg2 }) => [
    ['c3', ring(5.5, 16.75, 4.5, 2.5), ring(18.5, 16.75, 4.5, 2.5)],
    ['ink', seg2(18.5, 16.75, 15.25, 7, 2), seg2(13.5, 6.25, 16.75, 6.25, 2), seg2(9.25, 10.25, 8.5, 7.25, 2), seg2(7, 7, 10.25, 7, 2)],
    ['c1', bar([[5.5, 16.75], [12, 16.75], [16, 10.25], [9.25, 10.25], [12, 16.75]], 2.25)],
  ],
  // two tapered blue barrels on red lenses, ink bridge
  binoculars: ({ poly, circle, pill }) => [
    ['ink', pill(8, 9.25, 16, 12.75)],
    ['c3', poly([[4.25, 4.5], [7.75, 4.5], [9.75, 16.5], [2.25, 16.5]], [1.5, 1.5, 0, 0]), poly([[16.25, 4.5], [19.75, 4.5], [21.75, 16.5], [14.25, 16.5]], [1.5, 1.5, 0, 0])],
    ['c1', circle(6, 16.75, 4), circle(18, 16.75, 4)],
    ['tint', circle(6, 16.75, 1.5), circle(18, 16.75, 1.5)],
  ],
  // red half-disc body with soft corners, a yellow leaf tail, the blue head disc lifted off
  // the body by a page-coloured halo, a yellow rounded beak, a cream eye
  bird: ({ circle, half, lens, poly, soften }) => [
    ['c2', soften(lens(7.5, 14.5, 1.75, 6.25, 2.25), 1)],
    ['c1', soften(half(10.75, 12.5, 7.25, 's'), 1.25)],
    ['cut', circle(15.75, 9.25, 5)],
    ['c2', poly([[18, 6.5], [23, 9.25], [18, 12]], [0.9, 1.1, 0.9])],
    ['c3', circle(15.75, 9.25, 3.75)],
    ['tint', circle(16.5, 8.5, 1.1)],
  ],
  bluetooth: ({ bar, pill }) => [
    ['c3', pill(5, 2, 19, 22)],
    ['tint', bar([[8.25, 8.25], [15.75, 15.25], [12, 18.5], [12, 5.5], [15.75, 8.75], [8.25, 15.75]], 2)],
  ],
  bold: ({ rr, half }) => [
    ['c3', half(8.5, 16, 5, 'e')],
    ['c1', half(8.5, 7.5, 4.5, 'e')],
    ['ink', rr(4.5, 3, 8.75, 21, [1.75, 0, 0, 1.75])],
  ],
  book: ({ rr, pill }) => [
    ['c2', rr(5.5, 15.5, 19.5, 21.5, [0, 0, 1.5, 2.5])],
    ['c3', rr(4.5, 2.5, 19.5, 16.75, [2.5, 1.5, 0, 2.5])],
    ['c1', rr(4.5, 2.5, 8, 21.5, [2.5, 0, 0, 2.5])],
    ['tint', pill(10.5, 6.25, 16.5, 8.25)],
  ],
  // the open book's own curved outline, split at the gutter: blue and red leaves, cream lines
  'book-open': ({ path, halves, stroke }) => [
    ...halves(path('M12 6.75 C10.5 5.25 8 4.25 4.5 4.25 A1.75 1.75 0 0 0 2.75 6 V16.75 A1.75 1.75 0 0 0 4.5 18.5 C8 18.5 10.5 19.25 12 20.75 C13.5 19.25 16 18.5 19.5 18.5 A1.75 1.75 0 0 0 21.25 16.75 V6 A1.75 1.75 0 0 0 19.5 4.25 C16 4.25 13.5 5.25 12 6.75 Z'), 'c3', 'c1', 'v', 12),
    ['tint', stroke('M5.75 8.25 C7 8.25 8.25 8.5 9.25 9 M5.75 11.75 C7 11.75 8.25 12 9.25 12.5', 1.5), stroke('M18.25 8.25 C17 8.25 15.75 8.5 14.75 9 M18.25 11.75 C17 11.75 15.75 12 14.75 12.5', 1.5)],
  ],
  bookmark: ({ poly, circle }) => [
    ['c1', poly([[5.5, 3], [18.5, 3], [18.5, 21], [12, 16.5], [5.5, 21]], [2.25, 2.25, 1, 1.25, 1])],
    ['c2', circle(12, 9, 2.75)],
  ],
  'bookmark-plus': ({ poly, glyph }) => [
    ['c3', poly([[5.5, 3], [18.5, 3], [18.5, 21], [12, 16.5], [5.5, 21]], [2.25, 2.25, 1, 1.25, 1])],
    ['c2', glyph('plus', 12, 9.5, 3, 2.25)],
  ],
  bot: ({ rr, seg2, circle, pill }) => [
    ['ink', seg2(12, 8, 12, 4.75, 2), pill(2, 12, 4.5, 16.5), pill(19.5, 12, 22, 16.5)],
    ['c1', circle(12, 3.5, 1.75)],
    ['c3', rr(4.5, 7.5, 19.5, 20.5, 3.5)],
    ['c2', circle(9, 13.5, 2), circle(15, 13.5, 2)],
    ['tint', pill(9.5, 17, 14.5, 18.5)],
  ],
  braces: ({ stroke }) => [
    ['c3', stroke('M10 3.5 C7.25 3.5 7.5 5.5 7.5 8 C7.5 10.5 7 12 4.25 12 C7 12 7.5 13.5 7.5 16 C7.5 18.5 7.25 20.5 10 20.5', 2.5)],
    ['c1', stroke('M14 3.5 C16.75 3.5 16.5 5.5 16.5 8 C16.5 10.5 17 12 19.75 12 C17 12 16.5 13.5 16.5 16 C16.5 18.5 16.75 20.5 14 20.5', 2.5)],
  ],
  // a lobed brain split down its fissure: red and blue hemispheres, cream folds
  brain: ({ circle, unite, halves, stroke }) => [
    ...halves(unite(
      circle(8.25, 7.5, 3.5), circle(6.25, 12.25, 3.75), circle(8.25, 16.75, 3.5),
      circle(15.75, 7.5, 3.5), circle(17.75, 12.25, 3.75), circle(15.75, 16.75, 3.5),
      circle(12, 12.25, 6.25),
    ), 'c1', 'c3', 'v', 12),
    ['tint', stroke('M6.75 7 C7.75 7.75 8.5 8.75 8.5 10.25 M4.5 12.25 C6.25 12.25 7.75 13 8.25 14.75', 1.75), stroke('M17.25 7 C16.25 7.75 15.5 8.75 15.5 10.25 M19.5 12.25 C17.75 12.25 16.25 13 15.75 14.75', 1.75)],
  ],
}
