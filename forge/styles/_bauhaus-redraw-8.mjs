// BAUHAUS redraws, chunk 8: layout-template … notebook (run 8 redesign: soft, compositional)
// Local helpers (the kit is frozen): bubbles, envelope, and the microphone.
const bubbleRound = (p, role = 'c3') => [[role, p.circle(12.5, 11.25, 9.25), p.poly([[2.25, 21.75], [4, 14.5], [10, 19.25]], [1, 0, 0])]]
const bubbleSquare = (p, role = 'c1') => [[role, p.rr(2.5, 3, 21.5, 17.5, 3.25), p.poly([[3.75, 15], [3.75, 21.75], [10, 16.5]], [0, 1.1, 0])]]
const envelope = (p, body = 'c3', flap = 'c2') => [[body, p.rr(2, 4.5, 22, 19.5, 2.5)], [flap, p.poly([[2.5, 5], [21.5, 5], [12, 13.5]], [1.5, 1.5, 2])]]
// microphone: a capsule split red over yellow (grille over body), ink cradle and stand
const mic = (p) => [
  ['ink', p.arc(12, 11, 6.5, 0, 180, 2.25), p.seg2(12, 17.5, 12, 21, 2.25), p.seg2(8.25, 21, 15.75, 21, 2.25)],
  ...p.halves(p.pill(8.25, 2, 15.75, 15), 'c1', 'c2', 'h', 9.75),
]

export const R = {
  // blue header, red panel with a yellow quarter rising in its corner, text lines beside
  'layout-template': ({ rr, seg2, cornerQuarter }) => {
    const panel = rr(3, 12.25, 10.75, 21, 2.75)
    return [
      ['c3', rr(3, 3, 21, 9.25, 2.75)],
      ['c1', panel],
      ['c2', cornerQuarter(panel, 10.75, 21, 5, 'nw')],
      ['ink', seg2(14.25, 13.375, 20.75, 13.375, 2.25), seg2(14.25, 17, 20.75, 17, 2.25), seg2(14.25, 20.625, 17.75, 20.625, 2.25)],
    ]
  },
  // three books on an ink shelf: blue and red upright, yellow leaning; every spine a
  // full stadium whose foot sinks behind the shelf
  library: ({ rot, pill, circle }) => [
    ['c3', pill(3.25, 3, 8, 21.5)],
    ['c1', pill(9, 6.25, 13.25, 21.5)],
    ['c2', rot(pill(14.5, 6.5, 18.75, 21.25), 15, 16.625, 20.25)],
    ['tint', circle(5.625, 6.5, 1.1)],
    ['ink', pill(2, 19.5, 22, 22)],
  ],
  // yellow globe flowing into its neck, a red arched filament, ink screw base parted by a thread gap
  lightbulb: ({ circle, poly, rr, pill, stroke, unite }) => [
    ['ink', rr(9, 15, 15, 21.75, [0, 0, 3, 3])],
    ['c2', unite(circle(12, 9.25, 7.25), poly([[8.25, 12], [15.75, 12], [15, 16], [9, 16]], 0))],
    ['cut', pill(8, 17.6, 16, 18.85)],
    ['c1', stroke('M9.5 16 V10.25 A2.5 2.5 0 0 1 14.5 10.25 V16', 2.25)],
  ],
  // two oval links, blue and red, locked through each other (blue reprinted over one crossing)
  link: ({ rot, pill, cut, clip, poly }) => {
    const r = (cx, cy) => rot(cut(pill(cx - 6.75, cy - 3.5, cx + 6.75, cy + 3.5), pill(cx - 4.25, cy - 1.15, cx + 4.25, cy + 1.15)), -45, cx, cy)
    const A = r(8.6, 15.4), B = r(15.4, 8.6)
    return [['c3', A], ['c1', B], ['c3', clip(A, poly([[0, 0], [0, 24], [24, 24]], 0))]]
  },
  list: ({ circle, seg2 }) => [['c1', circle(4.25, 6, 1.75)], ['c2', circle(4.25, 12, 1.75)], ['c3', circle(4.25, 18, 1.75)], ['ink', seg2(9.5, 6, 20.75, 6, 2.5), seg2(9.5, 12, 20.75, 12, 2.5), seg2(9.5, 18, 20.75, 18, 2.5)]],
  'list-checks': (p) => [
    ...p.vee([[2.75, 6.25], [5, 8.5], [8.75, 4]], 2.5, 'c1', 'c1'),
    ...p.vee([[2.75, 18.25], [5, 20.5], [8.75, 16]], 2.5, 'c3', 'c3'),
    ['ink', p.seg2(12.25, 6, 20.75, 6, 2.5), p.seg2(12.25, 12, 20.75, 12, 2.5), p.seg2(12.25, 18, 20.75, 18, 2.5)],
  ],
  'list-filter': ({ seg2 }) => [['ink', seg2(3.25, 6, 20.75, 6, 2.75)], ['c3', seg2(6.5, 12, 17.5, 12, 2.75)], ['c1', seg2(9.5, 18, 14.5, 18, 2.75)]],
  // ink lines, a red note head on an ink stem, a blue quarter-disc flag
  'list-music': ({ seg2, circle, quarter }) => [
    ['ink', seg2(3.25, 6, 12.25, 6, 2.5), seg2(3.25, 12, 11.25, 12, 2.5), seg2(3.25, 18, 8.5, 18, 2.5)],
    ['c3', quarter(17.125, 3.125, 5.75, 'se')],
    ['ink', seg2(17.125, 4, 17.125, 17.5, 2.25)],
    ['c1', circle(15.25, 17.75, 3.25)],
  ],
  'list-ordered': ({ seg2, bar, stroke }) => [
    ['ink', seg2(12, 6, 20.75, 6, 2.5), seg2(12, 12, 20.75, 12, 2.5), seg2(12, 18, 20.75, 18, 2.5)],
    ['c1', bar([[3.75, 4.5], [5.5, 3], [5.5, 9]], 2), seg2(3.75, 9, 7.25, 9, 2)],
    ['c3', stroke('M3.75 16.5 C4 15.5 4.6 15 5.5 15 C6.6 15 7.25 15.7 7.25 16.8 C7.25 17.5 6.9 17.9 6.4 18.4 L3.75 20.75 H7.25', 2)],
  ],
  'list-plus': (p) => [['ink', p.seg2(3.25, 6, 20.75, 6, 2.5), p.seg2(3.25, 12, 14.5, 12, 2.5), p.seg2(3.25, 18, 10.5, 18, 2.5)], ['c1', p.glyph('plus', 17.75, 17.75, 3.25, 2.5)]],
  loader: ({ seg2, rot, join }) => [
    ['ink', join(seg2(12, 2.5, 12, 6.5, 2.75), seg2(21.5, 12, 17.5, 12, 2.75), seg2(12, 21.5, 12, 17.5, 2.75), seg2(2.5, 12, 6.5, 12, 2.75))],
    ['c1', rot(seg2(12, 2.5, 12, 6.5, 2.75), 45)],
    ['c2', rot(seg2(12, 2.5, 12, 6.5, 2.75), 135), rot(seg2(12, 2.5, 12, 6.5, 2.75), 315)],
    ['c3', rot(seg2(12, 2.5, 12, 6.5, 2.75), 225)],
  ],
  // (an exemplar in _bauhaus-render.mjs wins over this entry)
  lock: ({ arc, seg2, rr, circle, pill, halves }) => [
    ['ink', arc(12, 8, 4.5, 180, 360, 2.5), seg2(7.5, 8, 7.5, 11.5, 2.5), seg2(16.5, 8, 16.5, 11.5, 2.5)],
    ...halves(rr(4, 10.5, 20, 21.5, 3), 'c2', 'c1', 'h', 16.5),
    ['ink', circle(12, 15, 1.75), pill(11.1, 15, 12.9, 18.75)],
  ],
  // a blue stadium door; the arrow arrives at it, its rounded head stopping a clean gap short
  'log-in': (p) => [
    ['c3', p.rr(14.25, 3, 21.25, 21, 3.5)],
    ...p.arrow(2.75, 12, 12.5, 12, { len: 6.25, half: 5.5 }),
  ],
  // the arrow leaves the blue door: its shaft starts inside, cut free by a moat
  'log-out': (p) => [
    ['c3', p.rr(2.75, 3, 9.75, 21, 3.5)],
    ['cut', p.seg2(6.5, 12, 14, 12, 4.75)],
    ...p.arrow(6.5, 12, 21.25, 12, { len: 6.25, half: 5.5 }),
  ],
  luggage: ({ rr, arc, seg2, circle, pill }) => [
    ['ink', arc(12, 5.5, 2.5, 180, 360, 2.25), seg2(9.5, 5.5, 9.5, 6.5, 2.25), seg2(14.5, 5.5, 14.5, 6.5, 2.25), circle(8.25, 20.75, 1.5), circle(15.75, 20.75, 1.5)],
    ['c1', rr(4.75, 6, 19.25, 19, 3.25)],
    ['c2', pill(8.4, 9, 10.6, 16), pill(13.4, 9, 15.6, 16)],
  ],
  // the envelope with a red check badge on its corner
  'mail-check': (p) => [...envelope(p), ...p.badge('check', 'c1', 17.75, 17.5, 4.5)],
  // an open envelope: red flap lifted, a cream letter standing in the blue pocket
  // the red flap is one rounded triangle whose foot tucks into the pocket
  'mail-open': ({ poly, rr }) => [
    ['c1', poly([[3.75, 12.5], [12, 2.75], [20.25, 12.5]], [0, 1.75, 0])],
    ['tint', rr(6.75, 7, 17.25, 15, 1.5)],
    ['c3', poly([[2.5, 10], [12, 16.5], [21.5, 10], [21.5, 21], [2.5, 21]], [1.5, 2.25, 1.5, 2.75, 2.75])],
  ],
  // one folded sheet, every corner and fold softened, printed in three panels
  map: ({ poly, clip, rect }) => {
    const m = poly([[2.75, 6], [9, 3.5], [15, 6], [21.25, 3.5], [21.25, 18], [15, 20.5], [9, 18], [2.75, 20.5]], [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5])
    return [['c3', clip(m, rect(0, 0, 9, 24))], ['c2', clip(m, rect(9, 0, 15, 24))], ['c1', clip(m, rect(15, 0, 24, 24))]]
  },
  'map-pin': ({ drop, circle }) => [['c1', drop(12, 9.75, 7.5, 12, 22, 1)], ['tint', circle(12, 9.75, 3)]],
  // minimize turned inside out: two ink shafts leave the centre, each ending in a kit head
  maximize: (p) => [...p.arrow(13.25, 10.75, 20.75, 3.25, { len: 5.75, half: 5 }), ...p.arrow(10.75, 13.25, 3.25, 20.75, { len: 5.75, half: 5, tip: 'c3' })],
  // blue and red round-capped ribbons in a V behind a yellow medal with a red star-dot
  medal: ({ seg2, circle }) => [
    ['c3', seg2(6.5, 3.75, 11, 13, 3.75)],
    ['c1', seg2(17.5, 3.75, 13, 13, 3.75)],
    ['c2', circle(12, 16, 5.75)],
    ['c1', circle(12, 16, 2.25)],
  ],
  // an ink mouthpiece and grip, a soft red cone, a blue oval mouth
  megaphone: ({ poly, seg2, ellipse, rot }) => {
    const t = s => rot(s, -20, 11.5, 12)
    return [
      ['ink', t(seg2(3.75, 12, 9, 12, 4)), t(seg2(10.25, 14.75, 9.75, 19.75, 2.5))],
      ['c1', t(poly([[8, 9.25], [17.75, 4.5], [17.75, 19.5], [8, 14.75]], [1.25, 0, 0, 1.25]))],
      ['c3', t(ellipse(17.75, 12, 2.5, 7.75))],
    ]
  },
  meh: (p) => p.face('c2', [['ink', p.seg2(8.5, 15.5, 15.5, 15.5, 2.25)]], { ey: 9.5 }),
  menu: ({ seg2 }) => [['ink', seg2(3.5, 6, 20.5, 6, 2.75), seg2(3.5, 18, 20.5, 18, 2.75)], ['c1', seg2(3.5, 12, 20.5, 12, 2.75)]],
  'message-circle': (p) => bubbleRound(p),
  'message-circle-more': (p) => [...bubbleRound(p), ['tint', p.circle(8.25, 11.25, 1.5), p.circle(16.75, 11.25, 1.5)], ['c2', p.circle(12.5, 11.25, 1.5)]],
  'message-square': (p) => bubbleSquare(p),
  'message-square-text': (p) => [...bubbleSquare(p), ['tint', p.seg2(7.25, 8.25, 16.75, 8.25, 2.25)], ['c2', p.seg2(7.25, 12.25, 13, 12.25, 2.25)]],
  // two bubbles: blue behind, red in front, parted by a moat
  messages: ({ rr, poly }) => [
    ['c3', rr(2, 2.5, 15, 13, 3), poly([[3.5, 11], [3, 16.75], [8.5, 12.5]], [0, 1.1, 0])],
    ['cut', rr(7.75, 7.25, 23.25, 20, 4.25)],
    ['c1', rr(9, 8.5, 22, 18.75, 3), poly([[20.5, 16.75], [21, 22.25], [15.25, 18.25]], [0, 1.1, 0])],
  ],
  microphone: (p) => mic(p),
  'microphone-off': (p) => [...mic(p), ...p.slash()],
  // ink arm and base, yellow stage, blue tube with a red eyepiece leaning on the arm
  microscope: ({ rr, pill, stroke, halves, rot, seg2 }) => {
    const t = s => rot(s, -30, 9, 7.5)
    return [
      ['ink', stroke('M12.5 5.5 C16.75 6.25 19 9.5 19 13.25 C19 16.75 17 19.25 14 20.75', 2.5), pill(3.75, 19.75, 20.25, 22.25), t(seg2(9, 12.5, 9, 14.25, 2.25))],
      ['c2', pill(6.5, 14.5, 15.5, 16.75)],
      ...halves(rr(6.5, 1.5, 11.5, 13, 2.5), 'c1', 'c3', 'h', 5).map(([r, s]) => [r, t(s)]),
    ]
  },
  minimize: (p) => [...p.arrow(20.75, 3.25, 13.75, 10.25, { len: 5.75, half: 5 }), ...p.arrow(3.25, 20.75, 10.25, 13.75, { len: 5.75, half: 5, tip: 'c3' })],
  minus: ({ seg2 }) => [['c1', seg2(4.5, 12, 19.5, 12, 3.25)]],
  'minus-circle': (p) => [...p.disc('c1'), ['tint', p.seg2(7.5, 12, 16.5, 12, 2.75)]],
  monitor: ({ rr, pill, rect, quarter, clip }) => {
    const s = rr(4.5, 6, 19.5, 14, 1.25)
    return [['ink', rect(10.75, 15, 13.25, 20), pill(7, 19.5, 17, 22)], ['c3', rr(2, 3.5, 22, 16.5, 2.5)], ['c2', s], ['c1', clip(quarter(4.5, 14, 6, 'ne'), s)]]
  },
  moon: ({ circle, cut }) => [['c2', cut(circle(11, 13, 8.75), circle(16, 8, 7))], ['c3', circle(17, 7, 4)]],
  'more-horizontal': ({ circle }) => [['c1', circle(5, 12, 2)], ['ink', circle(12, 12, 2)], ['c3', circle(19, 12, 2)]],
  'more-vertical': ({ circle }) => [['c1', circle(12, 5, 2)], ['ink', circle(12, 12, 2)], ['c3', circle(12, 19, 2)]],
  // blue wheels, a red half-oval tank with a yellow seat, ink fork and handlebar
  motorcycle: ({ circle, ehalf, bar, pill }) => [
    ['ink', bar([[18.5, 17], [15.5, 8.5], [13, 7.5]], 2.25)],
    ['c3', circle(5.5, 17, 3.75), circle(18.5, 17, 3.75)],
    ['tint', circle(5.5, 17, 1.25), circle(18.5, 17, 1.25)],
    ['c1', ehalf(10.25, 10.5, 6.5, 5, 's')],
    ['c2', pill(3.75, 8, 10.5, 10.5)],
  ],
  mountain: ({ poly, circle }) => [
    ['c2', circle(18.5, 5.5, 2.75)],
    ['c3', poly([[10.5, 20], [16, 10], [22, 20]], [0, 2.25, 1.25])],
    ['c1', poly([[2, 20], [9.5, 5], [17, 20]], [1.25, 2.5, 1.25])],
  ],
  mouse: ({ rr, clip, rect, pill }) => {
    const m = rr(5.5, 2.5, 18.5, 21.5, 6.5)
    return [['c3', m], ['c1', clip(m, rect(0, 0, 11.25, 12.25))], ['c2', clip(m, rect(12.75, 0, 24, 12.25))], ['ink', pill(11, 5.5, 13, 9.5)]]
  },
  // an ink cross whose four arms sink into swept heads: red north-south, blue east-west
  move: ({ seg2, head }) => [
    ['ink', seg2(12, 5.75, 12, 18.25, 2.5), seg2(5.75, 12, 18.25, 12, 2.5)],
    ['c1', head(12, 2.25, 270, 5.5, 4.75, 1.25), head(12, 21.75, 90, 5.5, 4.75, 1.25)],
    ['c3', head(2.25, 12, 180, 5.5, 4.75, 1.25), head(21.75, 12, 0, 5.5, 4.75, 1.25)],
  ],
  navigation: ({ poly, clip }) => {
    const n = poly([[21, 3], [13.75, 21.5], [10.5, 13.5], [2.5, 10.25]], [2, 1.75, 1, 1.75])
    return [['c1', n], ['c3', clip(n, poly([[21, 3], [10.5, 13.5], [24, 24]], 0))]]
  },
  network: ({ circle, bar, seg2 }) => [
    ['ink', seg2(12, 7.5, 12, 17, 2.25), bar([[4.5, 17], [4.5, 12.5], [19.5, 12.5], [19.5, 17]], 2.25)],
    ['c1', circle(12, 5.5, 3.5)],
    ['c3', circle(4.5, 18.5, 2.75), circle(19.5, 18.5, 2.75)],
    ['c2', circle(12, 18.5, 2.75)],
  ],
  newspaper: ({ rr, quarter, clip, pill }) => {
    const b = rr(3, 3.5, 21, 20.5, 2.75)
    return [
      ['c3', b],
      ['c1', clip(quarter(3, 20.5, 7, 'ne'), b)],
      ['c2', pill(6.5, 6.5, 17.5, 9.5)],
      ['tint', pill(11.5, 12.25, 17.5, 14.25), pill(11.5, 16, 17.5, 18)],
    ]
  },
  notebook: ({ rr, pill, quarter, clip }) => {
    const b = rr(6, 2.5, 20, 21.5, 2.75)
    return [
      ['c1', b],
      ['c3', clip(quarter(20, 21.5, 7, 'nw'), b)],
      ['ink', pill(3, 6, 9, 8), pill(3, 11, 9, 13), pill(3, 16, 9, 18)],
      ['c2', pill(11.5, 6.5, 17, 9)],
    ]
  },
}
