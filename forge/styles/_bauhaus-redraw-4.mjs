// BAUHAUS redraws, chunk 4: briefcase … circle
// Run 8 (r4): every icon recomposed against BAUHAUS-GUIDE.md: soft corners only, crisp
// seams only where two fields share an edge, chevrons/checks as split bent bars at the
// chevron-right exemplar's weight, family parts (calendar, camera) as in the exemplars.

// local: the briefcase family's handle (ink arch with legs sunk into the body) and body
const handle = ({ arc, seg2 }) => ['ink', arc(12, 6.75, 3, 180, 360, 2.25), seg2(9, 6.75, 9, 9, 2.25), seg2(15, 6.75, 15, 9, 2.25)]
const caseShape = ({ rr }) => rr(2.5, 8, 21.5, 20.5, 3)
// local: a chevron at the exemplar's build (one bent bar split along its axis)
const CW = 3.25, CA = 8.5
const chv = (p, x, y, deg, arm = CA, w = CW, ra = 'c3', rb = 'c1') => p.chevSplit(x, y, deg, arm, w, ra, rb)

export const R = {
  // ink handle, body split red over blue at the lid seam, yellow clasp disc on the seam
  briefcase: (p) => [
    handle(p),
    ...p.halves(caseShape(p), 'c1', 'c3', 'h', 13),
    ['c2', p.circle(12, 13, 2.25)],
  ],
  // blue case, a red medical disc with a cream cross
  'briefcase-medical': (p) => [
    handle(p),
    ['c3', caseShape(p)],
    ['c1', p.circle(12, 14.25, 4.5)],
    ['tint', p.glyph('plus', 12, 14.25, 2.4, 1.9)],
  ],
  // ink head dome, four thick round-capped legs, shell split red | yellow down the wing seam, ink spots
  bug: ({ half, arch, seg2, circle, split }) => {
    const shell = arch(6.5, 9, 17.5, 21, 's', 3)
    return [
      ['ink', seg2(7.5, 12.75, 3.75, 11.25, 2.5), seg2(8, 18, 4.5, 20.25, 2.5),
        seg2(16.5, 12.75, 20.25, 11.25, 2.5), seg2(16, 18, 19.5, 20.25, 2.5),
        seg2(10.75, 6.5, 9.25, 3.75, 2), seg2(13.25, 6.5, 14.75, 3.75, 2)],
      ['ink', half(12, 9.5, 3.75, 'n')],
      ...split(shell, 'c2', 'c1', 12, 12, 90),
      ['ink', circle(9.5, 15.5, 1.5), circle(14.5, 15.5, 1.5)],
    ]
  },
  // blue tower with a red quarter sun in its corner, yellow windows, yellow arched door
  building: ({ rr, arch, circle, pill, cornerQuarter }) => {
    const t = rr(5, 2.5, 19, 21.5, [2.5, 2.5, 0, 0])
    return [
      ['c3', t],
      ['c1', cornerQuarter(t, 19, 2.5, 6, 'sw')],
      ['c2', circle(9.25, 6.75, 1.35), circle(9.25, 10.75, 1.35), circle(14.75, 10.75, 1.35), circle(9.25, 14.75, 1.35), circle(14.75, 14.75, 1.35)],
      ['c2', arch(10, 16.75, 14, 21.5)],
      ['ink', pill(2.5, 20.5, 21.5, 22.5)],
    ]
  },
  // yellow bun dome, red patty, yellow bun base, ink sesame seeds
  burger: ({ half, pill, rr, lens }) => [
    ['c2', half(12, 11, 9, 'n')],
    ['c1', pill(2.25, 12.5, 21.75, 15.75)],
    ['c2', rr(3.5, 17, 20.5, 21.5, [1.5, 1.5, 2.25, 2.25])],
    ['ink', lens(7.75, 7.5, 8.75, 6.25, 0.55), lens(11.5, 5.5, 12.5, 5.5, 0.55), lens(15.25, 6.25, 16.25, 7.5, 0.55)],
  ],
  // yellow body, blue windscreen, red lamps, ink wheels
  bus: ({ rr, pill, circle }) => [
    ['ink', pill(6, 17, 9, 22), pill(15, 17, 18, 22)],
    ['c2', rr(4, 2.5, 20, 19.5, 3.5)],
    ['c3', rr(6.25, 5.5, 17.75, 12.25, [2.25, 2.25, 1.25, 1.25])],
    ['c1', circle(8, 15.75, 1.5), circle(16, 15.75, 1.5)],
  ],
  // four discs: red fore wings over yellow hind wings, a moat clears them for the ink
  // body (so it stays on the page and follows currentColor in dark mode)
  butterfly: ({ circle, flipX, seg2, pill, cut, soften }) => {
    // each wing is cut clear of the body's moat by hand and every cut corner rounded (r1.5),
    // so no wing ends in a flat slice with square corners
    const moat = pill(9.9, 5, 14.1, 22)
    const wing = s => soften(cut(s, moat), 1.5, { tmax: 3 })
    const fore = wing(circle(6.75, 9, 4.75)), hind = wing(circle(7.75, 16.75, 3.5))
    return [
      ['c2', hind, flipX(hind)],
      ['c1', fore, flipX(fore)],
      ['ink', pill(11, 7, 13, 20), seg2(11.6, 7.5, 9.5, 3.75, 1.6), seg2(12.4, 7.5, 14.5, 3.75, 1.6)],
    ]
  },
  // red flame on an ink wick, blue cake with yellow scalloped icing, red plate
  cake: ({ rr, pill, drop, circle, seg2, join, clip }) => {
    const body = rr(4, 11, 20, 21, [2.5, 2.5, 0, 0])
    return [
      ['ink', seg2(12, 7.75, 12, 11, 2)],
      ['c1', drop(12, 5.5, 1.75, 12, 1.75, 0.5)],
      ['c3', body],
      ['c2', clip(join(rr(4, 11, 20, 14.5, 0), circle(6, 14.5, 2), circle(10, 14.5, 2), circle(14, 14.5, 2), circle(18, 14.5, 2)), body)],
      ['c1', pill(2.5, 19.75, 21.5, 22)],
    ]
  },
  // blue body, yellow display, cream keys and a tall red equals key
  calculator: ({ rr, circle, pill }) => [
    ['c3', rr(4.5, 2.5, 19.5, 21.5, 3)],
    ['c2', rr(7.5, 5.5, 16.5, 10, 1.5)],
    ['tint', circle(8.75, 13.75, 1.3), circle(12, 13.75, 1.3), circle(8.75, 17.75, 1.3), circle(12, 17.75, 1.3)],
    ['c1', pill(14, 12.45, 16.6, 19.05)],
  ],
  // the calendar with a bold yellow check
  'calendar-check': (p) => [...p.calendar('c3', 'c1'), ...p.vee([[8.25, 15.25], [11, 18], [16, 12.75]], 2.75, 'c2', 'c2')],
  // the calendar with cream day dots, one yellow (today)
  'calendar-days': (p) => [...p.calendar('c3', 'c1'),
    ['tint', p.circle(7.75, 13.75, 1.25), p.circle(12, 13.75, 1.25), p.circle(16.25, 13.75, 1.25), p.circle(7.75, 17.75, 1.25), p.circle(12, 17.75, 1.25)],
    ['c2', p.circle(16.25, 17.75, 1.6)]],
  // the calendar with a yellow plus
  'calendar-plus': (p) => [...p.calendar('c3', 'c1'), ['c2', p.glyph('plus', 12, 15.5, 3.25, 2.5)]],
  // the camera exemplar, struck through by the "-off" slash
  // the moat is cut by hand and every cut corner rounded (r1.25), so the body breaks into
  // soft-ended pieces, never sharp wedges; the slash prints round-capped in the gap
  'camera-off': ({ rr, pill, circle, seg2, cut, soften }) => {
    const gap = seg2(3.25, 3.25, 20.75, 20.75, 4.75)
    const k = s => soften(cut(s, gap), 1.25, { tmax: 2.5 })
    return [
      ['c1', k(pill(8, 3.5, 16, 9))],
      ['c3', k(rr(2, 6.5, 22, 20.5, 3))],
      ['ink', cut(circle(12, 13.5, 5), gap)],
      ['c2', cut(circle(12, 13.5, 3.25), gap)],
      ['ink', seg2(3.25, 3.25, 20.75, 20.75, 2.5)],
    ]
  },
  // blue screen, two caption lines in cream with yellow speaker marks
  captions: ({ rr, seg2 }) => [
    ['c3', rr(2, 4, 22, 20, 3)],
    ['c2', seg2(6.25, 12, 7.75, 12, 2.5), seg2(16.25, 16, 17.75, 16, 2.5)],
    ['tint', seg2(11.25, 12, 17.75, 12, 2.5), seg2(6.25, 16, 12.75, 16, 2.5)],
  ],
  // blue dome cabin with a yellow quarter window, red body, ink wheels cut free
  car: ({ cap, rr, circle, quarter, clip }) => {
    const cabin = cap(5.25, 10.5, 18.75, 10.5, 5.5)
    return [
      ['c3', cabin],
      ['c2', clip(quarter(12.75, 10.5, 4, 'ne'), cabin)],
      ['c1', rr(2.25, 10, 21.75, 17, [3, 3, 2, 2])],
      ['cut', circle(7.25, 16.75, 3.75), circle(16.75, 16.75, 3.75)],
      ['ink', circle(7.25, 16.75, 2.75), circle(16.75, 16.75, 2.75)],
      ['tint', circle(7.25, 16.75, 1), circle(16.75, 16.75, 1)],
    ]
  },
  // blue screen opened at its corner, then a red source dot and ink, yellow waves around it
  cast: ({ rr, arc, circle, cut }) => [
    ['c3', cut(rr(4, 4, 22, 20, 3), circle(3.5, 20.5, 12.5))],
    ['c1', circle(4.75, 19.25, 2.1)],
    ['ink', arc(3.5, 20.5, 6.5, 270, 360, 2.5)],
    ['c2', arc(3.5, 20.5, 10.25, 270, 360, 2.5)],
  ],
  // ink axes, overlapping domes rising to the right: blue, red, yellow
  'chart-area': ({ bar, poly, halves }) => [
    ['ink', bar([[3.5, 3.5], [3.5, 20.5], [20.5, 20.5]], 2.25)],
    ...halves(poly([[7.25, 18], [7.25, 12.25], [11.5, 8], [15, 11.5], [20.75, 5.75], [20.75, 18]], [1, 2.25, 1.75, 1.75, 2.25, 1]), 'c3', 'c1', 'h', 13.75),
  ],
  // three round-topped bars in the primaries on an ink base
  'chart-bar': ({ arch, pill }) => [
    ['c2', arch(4, 12, 9, 21)],
    ['c1', arch(9.5, 3.5, 14.5, 21)],
    ['c3', arch(15, 8, 20, 21)],
    ['ink', pill(2.5, 20, 21.5, 22.25)],
  ],
  // ink axes, a blue line rising to a red point
  'chart-line': ({ bar, circle }) => [
    ['ink', bar([[3.5, 3.5], [3.5, 20.5], [20.5, 20.5]], 2.25)],
    ['c3', bar([[7.5, 15.5], [11.5, 10], [15, 13.5], [19, 8]], 2.5)],
    ['c1', circle(19.25, 7.25, 2.5)],
  ],
  // a blue three-quarter disc, a yellow core, the red quarter pulled out; every slice
  // corner rounded (r1.1, the notch's inner corner too) and an even 2.75u gap
  'chart-pie': ({ sector, circle, cut, rr, soften }) => {
    const notch = rr(10.25, 2, 22, 13.75, [0, 0, 0, 1.1])
    const sm = s => soften(s, 1.1, { tmax: 2.5 })
    return [
      ['c3', sm(cut(circle(10.25, 13.75, 8.25), notch))],
      ['c2', cut(circle(10.25, 13.75, 3.5), notch)],
      ['c1', sm(sector(13, 11, 8.25, 270, 360))],
    ]
  },
  // one bent bar split along its joint: red short arm, blue long arm
  check: (p) => p.vee([[4.5, 12.75], [9.5, 17.75], [19.75, 6.75]], 3.25, 'c1', 'c3'),
  // two whole checks: red behind, blue in front, lifted off the red by a page-coloured
  // halo, so the red's short arm slips under the blue's long arm
  'check-check': (p) => {
    const front = [[2.5, 12.75], [6.75, 17], [15.25, 7.5]]
    return [
      ...p.vee([[8.75, 12.75], [13, 17], [21.5, 7.5]], 2.75, 'c1', 'c1'),
      ['cut', p.bar(front, 5)],
      ...p.vee(front, 2.75, 'c3', 'c3'),
    ]
  },
  // blue disc, cream check
  'check-circle': (p) => [...p.disc('c3'), ['tint', p.glyph('check', 12, 12, 4.75, 2.75)]],
  // red rounded square, cream check
  'check-square': (p) => [...p.square('c1'), ['tint', p.glyph('check', 12, 12, 4.75, 2.75)]],
  // three blue puffs over a red band, cream pleats
  'chef-hat': ({ circle, rr, join, unite }) => [
    ['c3', unite(circle(8, 10.5, 3.75), circle(12, 7.25, 4.5), circle(16, 10.5, 3.75), rr(6.5, 10.5, 17.5, 17, 0))],
    ['c1', rr(6.5, 16.25, 17.5, 21, [0, 0, 2.5, 2.5])],
    ['tint', join(rr(9.1, 12, 10.9, 16.5, 0.9), rr(13.1, 12, 14.9, 16.5, 0.9))],
  ],
  'chevron-down': (p) => chv(p, 12, 16, 90),
  'chevron-up': (p) => chv(p, 12, 8, 270),
  'chevron-left': (p) => chv(p, 8, 12, 180),
  'chevron-right': (p) => chv(p, 16, 12, 0),
  'chevron-first': (p) => [...chv(p, 11.75, 12, 180), ['ink', p.seg2(6.25, 6, 6.25, 18, CW)]],
  'chevron-last': (p) => [...chv(p, 12.25, 12, 0), ['ink', p.seg2(17.75, 6, 17.75, 18, CW)]],
  'chevrons-down': (p) => [...chv(p, 12, 10.75, 90, 7, 3), ...chv(p, 12, 18.25, 90, 7, 3)],
  'chevrons-up': (p) => [...chv(p, 12, 5.75, 270, 7, 3), ...chv(p, 12, 13.25, 270, 7, 3)],
  'chevrons-left': (p) => [...chv(p, 5.75, 12, 180, 7, 3), ...chv(p, 13.25, 12, 180, 7, 3)],
  'chevrons-right': (p) => [...chv(p, 10.75, 12, 0, 7, 3), ...chv(p, 18.25, 12, 0, 7, 3)],
  'chevrons-up-down': (p) => [...chv(p, 12, 3.75, 270, 7, 3), ...chv(p, 12, 20.25, 90, 7, 3, 'c1', 'c3')],
  // a disc split down the middle: red | blue
  circle: (p) => p.splitDisc(12, 12, 9.75, 'c3', 'c1', 'v'),
}
