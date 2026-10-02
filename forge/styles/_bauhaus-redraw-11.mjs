// BAUHAUS redraws, chunk 11: smartphone … tree-pine
// Run 11: every icon individually recomposed against BAUHAUS-GUIDE.md (round, few
// primitives, split bodies, quarter/half-disc details, decorations wholly off the object).

// local helpers (the kit is frozen)
const sq = (p, role = 'c3') => [[role, p.rr(3, 3, 21, 21, 3.5)]]
const star5 = (p) => p.poly(p.star(12, 12.75, 10, 4.6, 5), 1.5)
const sunRays = (p, cx, cy, r0, r1, n = 8, w = 2.25, start = 0) => p.around(p.seg2(cx, cy - r0, cx, cy - r1, w), n, cx, cy, start)
// the classic sparkle: four tips joined by curves pulled toward the centre (k: waist,
// t: how far the controls sit off the axes, which gives each tip a real angle). Flattened
// by a clip so soften can fillet the tips r; the tips start further out to make up for it.
const spark = (p, cx, cy, ro, k = 0.28, t = 0.14, r = 0.6) => {
  const o = ro + r * 1.6, a = o * k, b = o * t, f = (x, y) => `${cx + x} ${cy + y}`
  const d = `M${f(0, -o)}C${f(b, -a)} ${f(a, -b)} ${f(o, 0)}C${f(a, b)} ${f(b, a)} ${f(0, o)}C${f(-b, a)} ${f(-a, b)} ${f(-o, 0)}C${f(-a, -b)} ${f(-b, -a)} ${f(0, -o)}Z`
  return p.soften(p.clip(p.path(d), p.rect(cx - o - 1, cy - o - 1, cx + o + 1, cy + o + 1)), r, { tmax: 3 })
}
// thumb: blue cuff pill, red hand with a round thumb and soft fingertips
const thumb = (p) => [
  ['c3', p.rr(2.5, 9.5, 7, 21, 2.25)],
  ['c1', p.soften(p.path('M8.25 10 L10.6 4.6 A2.4 2.4 0 0 1 15.1 5.9 L14.6 9 H18.4 C20 9 21.1 10.45 20.7 12 L19.1 19.1 C18.85 20.2 17.95 21 16.8 21 H8.25 Z'), 1.25)],
]
// sunrise / sunset: yellow half sun on an ink horizon, two short rays, an arrow above
const horizonSun = (p, up, role) => [
  ['c2', p.half(12, 17.25, 5, 'n')],
  ['ink', p.pill(2, 16, 22, 18.5)],
  ['c1', p.seg2(6.7, 11.95, 5.3, 10.55, 2.25), p.seg2(17.3, 11.95, 18.7, 10.55, 2.25)],
  ...(up ? p.arrow(12, 10.75, 12, 1.5, { len: 5.75, half: 5 }) : p.arrow(12, 1.5, 12, 11, { len: 5.75, half: 5 })).map(([r, s]) => [r === 'c1' ? role : r, s]),
]

export const R = {
  // blue phone, yellow screen with a red sun rising from its foot, cream home pill
  smartphone: ({ rr, pill, half, clip }) => {
    const s = rr(8, 4.5, 16, 16, 1.75)
    return [['c3', rr(5.5, 1.75, 18.5, 22.25, 3.5)], ['c2', s], ['c1', clip(half(12, 16, 4, 'n'), s)], ['tint', pill(10.25, 17.9, 13.75, 19.9)]]
  },
  // yellow face, ink eyes and a round-capped ink smile
  smile: (p) => p.face('c2', [['ink', p.arc(12, 12.25, 5, 25, 155, 2.5)]], { ey: 9.25, er: 1.5 }),
  // six round-capped arms with forked tips, blue and red alternating, a yellow hub
  snowflake: ({ seg2, rot, bar, join, circle }) => {
    const arm = join(seg2(12, 12, 12, 2.75, 2.25), bar([[9.6, 3.9], [12, 5.9], [14.4, 3.9]], 2))
    return [['c3', arm, rot(arm, 120), rot(arm, 240)], ['c1', rot(arm, 60), rot(arm, 180), rot(arm, 300)], ['c2', circle(12, 12, 2.75)]]
  },
  // red back cushion, yellow seat, blue pill arms, ink feet
  sofa: ({ rr, pill }) => [
    ['ink', pill(4.75, 17, 6.75, 21), pill(17.25, 17, 19.25, 21)],
    ['c1', rr(5.25, 5, 18.75, 13.5, 3)],
    ['c2', rr(5, 12.25, 19, 18.75, 1.5)],
    ['c3', pill(1.75, 9.75, 7, 19), pill(17, 9.75, 22.25, 19)],
  ],
  // ink rows shortening, ink shaft sinking into a red swept head
  sort: ({ seg2, arrow }) => [
    ['ink', seg2(13.5, 5, 20.75, 5, 2.5), seg2(13.5, 12, 18.25, 12, 2.5), seg2(13.5, 19, 15.75, 19, 2.5)],
    ...arrow(6, 3.25, 6, 21, { len: 6.75, half: 5.25 }),
  ],
  // blue half-disc bowl under a yellow rim, three steam curls (the middle one red)
  soup: ({ half, stroke, pill }) => [
    ['ink', stroke('M8 8.5 C6.25 7.5 9.75 5.5 8 4', 2), stroke('M16 8.5 C14.25 7.5 17.75 5.5 16 4', 2)],
    ['c1', stroke('M12 8.5 C10.25 7.5 13.75 5.5 12 4', 2)],
    ['c3', half(12, 12, 9.25, 's')],
    ['c2', pill(2, 10.5, 22, 13.25)],
  ],
  // the big sparkle split red | yellow, a small blue and a small yellow one
  sparkles: (p) => [
    ...p.split(spark(p, 9.5, 13, 9.75, 0.28, 0.14, 0.7), 'c2', 'c1', 9.5, 13, 90),
    ['c3', spark(p, 18.25, 5.75, 4.4, 0.3, 0.16, 0.5)],
    ['c2', spark(p, 18.75, 18, 3.9, 0.3, 0.16, 0.5)],
  ],
  // blue cabinet, yellow tweeter, red woofer with an ink dust cap
  speaker: ({ rr, circle }) => [['c3', rr(4.75, 2, 19.25, 22, 3.5)], ['c2', circle(12, 6.75, 2)], ['c1', circle(12, 15, 4.75)], ['ink', circle(12, 15, 1.75)]],
  // ink stem rising from a red half-disc mound (soft feet), green and yellow lens leaves
  sprout: ({ lens, seg2, half, soften }) => [
    ['ink', seg2(12, 20, 12, 10.5, 2.25)],
    ['accent', lens(12, 12.75, 3.25, 6.25, 2.75)],
    ['c2', lens(12, 10.5, 20.75, 3.25, 2.75)],
    ['c1', soften(half(12, 22, 5.5, 'n'), 1)],
  ],
  // red square, blue quarter disc rising from its lower-right corner
  square: ({ rr, quarter, clip }) => {
    const s = rr(3, 3, 21, 21, 3.5)
    return [['c1', s], ['c3', clip(quarter(21, 21, 10.5, 'nw'), s)]]
  },
  'square-minus': (p) => [...sq(p, 'c1'), ['tint', p.seg2(7.5, 12, 16.5, 12, 2.75)]],
  'square-plus': (p) => [...sq(p, 'c3'), ['tint', p.glyph('plus', 12, 12, 4.5, 2.75)]],
  'square-x': (p) => [...sq(p, 'c1'), ['tint', p.glyph('x', 12, 12, 5, 2.75)]],
  // exemplar wins (render EXEMPLAR.star); kept for reference only
  star: (p) => p.split(star5(p), 'c1', 'c2', 12, 12, 90),
  // left half yellow and solid, right half a blue outline of the same star
  'star-half': (p) => [
    ['c2', p.clip(star5(p), p.rect(0, 0, 12, 24))],
    ['c3', p.clip(p.cut(star5(p), p.poly(p.star(12, 12.9, 6.6, 3, 5), 0.9)), p.rect(12, 0, 24, 24))],
  ],
  // ink headset ending in yellow ear tips, blue tube, red chest piece with a cream centre
  stethoscope: ({ stroke, circle }) => [
    ['ink', stroke('M5.5 3.75 V8.5 A3.5 3.5 0 0 0 12.5 8.5 V3.75', 2.25)],
    ['c2', circle(5.5, 3.25, 1.6), circle(12.5, 3.25, 1.6)],
    ['c3', stroke('M9 12 V15.5 A5 5 0 0 0 19 15.5 V13.5', 2.25)],
    ['c1', circle(19, 10.75, 3.25)],
    ['tint', circle(19, 10.75, 1.25)],
  ],
  // yellow note, its lower-right corner bitten away in one round arc, a red quarter
  // lifting from that corner on the same centre (the peel), two ink lines
  'sticky-note': ({ rr, quarter, cut, circle, soften, seg2 }) => [
    ['c2', soften(cut(rr(3, 3, 21, 21, 3), circle(21, 21, 8.25)), 1.25)],
    ['c1', soften(quarter(21, 21, 6.5, 'nw'), v => Math.hypot(v[0] - 21, v[1] - 21) < 0.1 ? 3 : 1, { tmax: 3 })],
    ['ink', seg2(7.5, 8, 16.5, 8, 2.25), seg2(7.5, 12, 12.5, 12, 2.25)],
  ],
  // the stop button: one red rounded square, pure
  stop: ({ rr }) => [['c1', rr(4.5, 4.5, 19.5, 19.5, 3.25)]],
  // scalloped awning striped red | yellow | red over a blue shop with a yellow arched door
  store: ({ rr, arch, half, rect, clip, unite }) => {
    const awn = unite(rr(3, 2.5, 21, 8.5, [2.25, 2.25, 0, 0]), half(6, 8.5, 3, 's'), half(12, 8.5, 3, 's'), half(18, 8.5, 3, 's'))
    return [
      ['c3', rr(4.5, 9, 19.5, 21.5, [0, 0, 2.75, 2.75])],
      ['c2', arch(9.5, 14.5, 14.5, 21.5)],
      ['c1', clip(awn, rect(0, 0, 9, 24)), clip(awn, rect(15, 0, 24, 24))],
      ['c2', clip(awn, rect(9, 0, 15, 24))],
    ]
  },
  // ink S cut clean by a red strike with a hairline moat
  strikethrough: ({ stroke, seg2 }) => [
    ['ink', stroke('M17 6 C16 4.75 14.25 4 12 4 C8.75 4 6.5 5.75 6.5 8 C6.5 10.25 8.5 12 11 12 M13 12 C15.5 12 17.5 13.75 17.5 16 C17.5 18.25 15.25 20 12 20 C9.75 20 8 19.25 7 18', 2.5)],
    ['c1', seg2(3.25, 12, 20.75, 12, 2.75)],
  ],
  subscript: ({ seg2, stroke }) => [['ink', seg2(3.5, 4.5, 12.5, 15, 2.75), seg2(12.5, 4.5, 3.5, 15, 2.75)], ['c1', stroke('M16.5 15.25 A2.25 2.25 0 0 1 21 15.25 C21 16.75 19.75 17.75 16.5 20.5 H21', 2.25)]],
  superscript: ({ seg2, stroke }) => [['ink', seg2(3.5, 9, 12.5, 19.5, 2.75), seg2(12.5, 9, 3.5, 19.5, 2.75)], ['c1', stroke('M16.5 5.75 A2.25 2.25 0 0 1 21 5.75 C21 7.25 19.75 8.25 16.5 11 H21', 2.25)]],
  // yellow disc, eight round-capped red rays
  sun: (p) => [['c1', sunRays(p, 12, 12, 7.5, 9.75, 8, 2.5)], ['c2', p.circle(12, 12, 5)]],
  // red rays on the day side, a disc split yellow (day) | blue (night) with a cream star
  'sun-moon': ({ circle, seg2, split }) => [
    ['c1', seg2(8.75, 4.64, 7.75, 2.91, 2.25), seg2(5.64, 7.75, 3.91, 6.75, 2.25), seg2(4.5, 12, 2.5, 12, 2.25), seg2(5.64, 16.25, 3.91, 17.25, 2.25), seg2(8.75, 19.36, 7.75, 21.09, 2.25)],
    ...split(circle(13, 12, 6.25), 'c3', 'c2', 13, 12, 90),
    ['tint', circle(16.25, 9.75, 1.25)],
  ],
  sunrise: (p) => horizonSun(p, true, 'c1'),
  sunset: (p) => horizonSun(p, false, 'c3'),
  // two ink shafts with swept heads, red going right, blue coming back
  swap: ({ arrow }) => [
    ...arrow(3.25, 7, 21, 7, { len: 7, half: 5.5 }),
    ...arrow(20.75, 17, 3, 17, { len: 7, half: 5.5, tip: 'c3' }),
  ],
  // syringe at 45 degrees: ink needle and plunger, blue barrel half filled red, cream mark
  syringe: ({ rot, rr, pill, seg2, clip, rect }) => {
    const r = s => rot(s, 45, 12, 12)
    const barrel = rr(9, 6, 15, 17, 2)
    return [
      ['ink', r(seg2(12, 17, 12, 22.75, 1.75)), r(pill(7.75, 0.75, 16.25, 3)), r(seg2(12, 1.5, 12, 6.5, 2))],
      ['c3', r(barrel)],
      ['c1', r(clip(barrel, rect(0, 11.5, 24, 24)))],
      ['tint', r(pill(10.25, 8, 13.75, 9.5))],
    ]
  },
  // red header, a grid of soft blue cells, one yellow cell
  table: ({ rr }) => [
    ['c1', rr(3, 3, 21, 8.5, [3.25, 3.25, 1.25, 1.25])],
    ['c3', rr(3, 10, 11.25, 14.75, 1.25), rr(12.75, 10, 21, 14.75, 1.25), rr(3, 16.25, 11.25, 21, [1.25, 1.25, 1.25, 3.25])],
    ['c2', rr(12.75, 16.25, 21, 21, [1.25, 1.25, 3.25, 1.25])],
  ],
  // red tablet, blue screen with a yellow quarter rising from its corner, cream home pill
  tablet: ({ rr, pill, quarter, clip }) => {
    const s = rr(6.25, 4.75, 17.75, 16, 1.75)
    return [['c1', rr(4, 2.25, 20, 21.75, 3.5)], ['c3', s], ['c2', clip(quarter(17.75, 16, 7.5, 'nw'), s)], ['tint', pill(10.25, 17.75, 13.75, 19.75)]]
  },
  // tag split on its diagonal, red | yellow, the hole punched through the red half
  tag: ({ poly, circle, cut, halves }) => [
    ...halves(cut(poly([[3, 3], [13, 3], [21.25, 11.25], [11.25, 21.25], [3, 13]], [2.75, 1.75, 2.75, 2.75, 1.75]), circle(8, 8, 1.75)), 'c1', 'c2', 'd', 12),
  ],
  // concentric target: red, cream, blue, yellow bull
  target: ({ circle }) => [['c1', circle(12, 12, 9.75)], ['tint', circle(12, 12, 6.9)], ['c3', circle(12, 12, 4.4)], ['c2', circle(12, 12, 1.9)]],
  // yellow cab body, blue domed cabin, red roof sign pill, ink wheels in moats
  taxi: ({ rr, pill, circle }) => [
    ['c1', pill(9, 2.25, 15, 5.25)],
    ['c3', rr(5.5, 6.5, 18.5, 13, [4.25, 4.25, 0, 0])],
    ['c2', rr(2.5, 11.75, 21.5, 18.75, [3, 3, 2, 2])],
    ['cut', circle(7.25, 18.5, 3.75), circle(16.75, 18.5, 3.75)],
    ['ink', circle(7.25, 18.5, 2.75), circle(16.75, 18.5, 2.75)],
  ],
  // ink tripod, blue tube widening into a red objective, both soft
  telescope: ({ rot, rr, pill, seg2 }) => [
    ['ink', seg2(12, 11.5, 8, 21, 2.25), seg2(12, 11.5, 16, 21, 2.25)],
    ['c3', rot(pill(3, 8.75, 15, 13.25), -30, 12, 11)],
    ['c1', rot(rr(14, 7.25, 19.5, 14.75, 2.25), -30, 12, 11)],
  ],
  // red racket rim around a blue string bed, ink handle, yellow ball
  tennis: ({ rot, seg2, circle, ellipse }) => [
    ['ink', seg2(13.25, 13.25, 20.5, 20.5, 2.75)],
    ['c1', rot(ellipse(9, 9, 7, 5.25), 45, 9, 9)],
    ['c3', rot(ellipse(9, 9, 4.75, 3), 45, 9, 9)],
    ['c2', circle(19, 5, 2.75)],
  ],
  // tent split blue | red, a yellow arched door, ink pole tips and ground line
  tent: ({ poly, half, seg2, pill, split }) => [
    ['ink', seg2(14.25, 2.25, 12, 6, 2), seg2(9.75, 2.25, 12, 6, 2)],
    ...split(poly([[3.5, 20.5], [12, 4.5], [20.5, 20.5]], [1.25, 2.25, 1.25]), 'c1', 'c3', 12, 12, 90),
    ['c2', half(12, 20.5, 4.25, 'n')],
    ['ink', pill(2, 19.5, 22, 21.75)],
  ],
  // blue window, red title bar, cream prompt chevron, yellow cursor
  terminal: ({ rr, chevron, seg2, clip, rect }) => {
    const w = rr(2, 3.75, 22, 20.25, 3)
    return [
      ['c3', w],
      ['c1', clip(w, rect(0, 0, 24, 7.75))],
      ['tint', chevron(9.75, 13.5, 0, 3.75, 2.5)],
      ['c2', seg2(12.75, 16.75, 17.5, 16.75, 2.5)],
    ]
  },
  // blue pill field with a cream text line, a red I-beam standing in its own moat
  'text-cursor-input': ({ pill, seg2 }) => [
    ['c3', pill(2, 7, 18.5, 17)],
    ['tint', seg2(6, 12, 10, 12, 2.25)],
    ['cut', seg2(17.5, 2.5, 17.5, 21.5, 5.25)],
    ['c1', seg2(17.5, 4, 17.5, 20, 2.5), seg2(15, 4, 20, 4, 2.25), seg2(15, 20, 20, 20, 2.25)],
  ],
  // blue tube and bulb, red mercury column, ink scale marks
  thermometer: ({ pill, circle, seg2 }) => [
    ['c3', pill(6.25, 2.25, 11.75, 16), circle(9, 17.25, 4.5)],
    ['c1', circle(9, 17.25, 2.5), pill(8, 8.5, 10, 16)],
    ['ink', seg2(15.5, 5, 19.5, 5, 2.25), seg2(15.5, 9, 18, 9, 2.25), seg2(15.5, 13, 19.5, 13, 2.25)],
  ],
  'thumbs-up': (p) => thumb(p),
  'thumbs-down': (p) => thumb(p).map(([r, s]) => [r, p.flipY(s, 12)]),
  // ticket split at its perforation: red body, blue stub, cream perforation dots
  ticket: ({ rr, circle, cut, halves, soften }) => [
    ...halves(soften(cut(rr(2, 5, 22, 19, 2.75), circle(2, 12, 2.5), circle(22, 12, 2.5)), 0.9), 'c1', 'c3', 'v', 15.5),
    ['tint', circle(15.5, 8.5, 1.1), circle(15.5, 12, 1.1), circle(15.5, 15.5, 1.1)],
  ],
  // ink crown and side button, blue case, cream face, red hand
  timer: ({ circle, pill, seg2 }) => [
    ['ink', pill(9.5, 1.25, 14.5, 3.5), seg2(12, 3, 12, 5.25, 2), seg2(18.25, 7.25, 20, 5.5, 2.25)],
    ['c3', circle(12, 13.5, 8.25)],
    ['tint', circle(12, 13.5, 5.75)],
    ['c1', seg2(12, 13.5, 15, 10.5, 2.25), circle(12, 13.5, 1.6)],
  ],
  // blue track, yellow knob with a red core
  toggle: ({ pill, circle }) => [['c3', pill(2, 5.5, 22, 18.5)], ['c2', circle(15.5, 12, 4.75)], ['c1', circle(15.5, 12, 1.75)]],
  // blue tank, yellow seat, red bowl, ink foot
  toilet: ({ rr, half, pill }) => [
    ['c3', rr(4, 2.5, 10.75, 11, [3.25, 3.25, 0, 0])],
    ['ink', pill(8.5, 19.25, 15.5, 21.75)],
    ['c1', half(12, 11.5, 8.5, 's')],
    ['c2', pill(3, 9.75, 21, 12.75)],
  ],
  tooth: ({ path, lens }) => [['c3', path('M12 5.5 C10.5 4 8.5 3 6.5 3.5 C4 4 3 6.5 3.5 9.5 C4 12 5.5 13.5 6 16 C6.5 19 7 21 8.5 21 C10 21 10 18.5 10.5 16.5 C10.75 15.25 11.25 14.5 12 14.5 C12.75 14.5 13.25 15.25 13.5 16.5 C14 18.5 14 21 15.5 21 C17 21 17.5 19 18 16 C18.5 13.5 20 12 20.5 9.5 C21 6.5 20 4 17.5 3.5 C15.5 3 13.5 4 12 5.5 Z')], ['tint', lens(6, 10, 8.5, 6, 0.9)]],
  // red cone with a soft tip, two cream reflective bands, ink base
  'traffic-cone': ({ poly, clip, rect, pill }) => {
    const c = poly([[5.25, 20.5], [10.75, 2.5], [13.25, 2.5], [18.75, 20.5]], [0, 2.25, 2.25, 0])
    return [['c1', c], ['tint', clip(c, rect(0, 8, 24, 10.5)), clip(c, rect(0, 13.5, 24, 16))], ['ink', pill(2, 19.25, 22, 22)]]
  },
  // red domed train, two yellow windows, cream lamps, ink legs
  train: ({ rr, circle, seg2 }) => [
    ['ink', seg2(8, 17.5, 5.5, 21.5, 2.25), seg2(16, 17.5, 18.5, 21.5, 2.25)],
    ['c1', rr(4, 2.25, 20, 18.25, [6, 6, 3, 3])],
    ['c2', rr(6.5, 5.25, 11.25, 10.25, [2.5, 1.25, 1.25, 1.25]), rr(12.75, 5.25, 17.5, 10.25, [1.25, 2.5, 1.25, 1.25])],
    ['tint', circle(8.25, 14, 1.4), circle(15.75, 14, 1.4)],
  ],
  // ink handle arc, red lid pill, blue tapered bin with cream slots
  trash: ({ poly, pill, arc }) => [
    ['ink', arc(12, 6.25, 3, 180, 360, 2.25)],
    ['c3', poly([[5, 7], [19, 7], [17.9, 21.25], [6.1, 21.25]], [0, 0, 2.75, 2.75])],
    ['c1', pill(2.5, 5, 21.5, 8.25)],
    ['tint', pill(9, 11, 11, 17.5), pill(13, 11, 15, 17.5)],
  ],
  // three stacked tiers, each its own soft shape (no clipped corners), split down the
  // trunk line blue | red like the tent, on an ink trunk
  'tree-pine': ({ poly, pill, split }) => {
    const top = poly([[12, 1], [17.75, 8.5], [6.25, 8.5]], [1.75, 1.25, 1.25])
    const mid = poly([[9.25, 9.75], [14.75, 9.75], [20, 15], [4, 15]], 1.25)
    const bot = poly([[8, 16.25], [16, 16.25], [21.75, 20.25], [2.25, 20.25]], 1.25)
    return [
      ['ink', pill(10.6, 18, 13.4, 23)],
      ...[top, mid, bot].flatMap(t => split(t, 'c1', 'c3', 12, 12, 90)),
    ]
  },
}
