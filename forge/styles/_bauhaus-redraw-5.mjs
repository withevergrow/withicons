// BAUHAUS redraws, chunk 5: circle-arrow-down … drag-handle
// Run 5: every icon recomposed against BAUHAUS-GUIDE.md (soft corners, swept heads,
// deliberate splits and overprints, moats where parts cross).

// local helper (the kit is frozen): a shape grown by g on every side, for moats that
// follow an outline exactly (a head, a bolt, a coin)
const grow = (p, sh, g = 1) => p.unite(sh, p.stroke(p.shapeD(sh), 2 * g))
// rotate every shape of a layer list about the centre
const turn = (p, L, deg) => deg ? L.map(([role, ...ss]) => [role, ...ss.map(s => p.rot(s, deg, 12, 12))]) : L

// the straight-backed arrowhead: an isosceles triangle with an even corner radius, its
// back edge square to the shaft, the shaft (round cap) ending 1u inside it, no seam
const hd = (p, tx, ty, deg, len = 6.25, half = 5.5) => p.head(tx, ty, deg, len, half, 1.6, { notch: 0, rb: 1.35 })
// a chevron bar whose joint is a real bend (inner radius ~0.75u, never a notch), split
// on the bisector of its apex so each arm prints in its own primary
const softChev = (p, x, y, deg, arm, w, ra, rb) => {
  const [a, m, b] = p.chev(x, y, deg, arm), rj = w / 2 + 0.75
  const at = (q, t) => { const l = Math.hypot(q[0] - m[0], q[1] - m[1]); return [m[0] + (q[0] - m[0]) / l * t, m[1] + (q[1] - m[1]) / l * t] }
  const p1 = at(a, rj), p2 = at(b, rj), cr = (m[0] - a[0]) * (b[1] - m[1]) - (m[1] - a[1]) * (b[0] - m[0])
  const sh = p.stroke(`M${a[0]} ${a[1]}L${p1[0]} ${p1[1]}A${rj} ${rj} 0 0 ${cr > 0 ? 1 : 0} ${p2[0]} ${p2[1]}L${b[0]} ${b[1]}`, w)
  // the tip moved back by the bend: keep the seam on the axis through the apex
  return p.split(sh, ra, rb, x, y, deg)
}

// circle arrow: the circle-arrow-right exemplar (red disc, cream shaft sunk into a
// swept cream head), turned to each direction
const circArrow = (p, deg) => turn(p, [...p.disc('c1'), ['tint', p.seg2(6.25, 12, 13.5, 12, 2.5), hd(p, 17.75, 12, 0, 5.5, 4.75)]], deg)
// circle chevron: blue disc, one bent bar split along its axis (cream, yellow)
const circChev = (p, deg) => turn(p, [...p.disc('c3'), ...softChev(p, 14.75, 12, 0, 6, 2.75, 'tint', 'c2')], deg)

// clipboard: a rounded board with a yellow arched clip straddling its top edge
const board = (p, role = 'c3') => p.rr(4.5, 4.5, 19.5, 21.5, 3)
const clipTab = p => ['c2', p.arch(8.5, 2, 15.5, 7.5, 'n', 1.25)]

// cloud for weather/transfer glyphs: the kit cloud scaled to 0.8 and lifted, so the
// lower third is free for rain, snow, a bolt or an arrow
const cloudTop = (p, dy = -5) => p.cloud(dy, 'c3', 'c1', 0.8)

export const R = {
  'circle-arrow-down': p => circArrow(p, 90),
  'circle-arrow-left': p => circArrow(p, 180),
  'circle-arrow-right': p => circArrow(p, 0), // exemplar wins; kept identical
  'circle-arrow-up': p => circArrow(p, 270),
  'circle-chevron-down': p => circChev(p, 90),
  'circle-chevron-right': p => circChev(p, 0),
  // blue ring around a red core: the target in two primaries
  'circle-dot': ({ ring, circle }) => [['c3', ring(12, 12, 9.75, 6.5)], ['c1', circle(12, 12, 4.25)]],
  'circle-pause': p => [...p.disc('c1'), ['tint', p.pill(8, 7.25, 10.75, 16.75), p.pill(13.25, 7.25, 16, 16.75)]],
  // cream play triangle, optically centred (its centroid on the disc centre)
  'circle-play': p => [...p.disc('c3'), ['tint', p.poly([[9.25, 6.75], [17.5, 12], [9.25, 17.25]], [1.75, 1.5, 1.75])]],
  'circle-stop': p => [...p.disc('c1'), ['tint', p.rr(8, 8, 16, 16, 2.25)]],
  // blue slate with a red half sun rising, an ink clapper lifted on its hinge with two
  // yellow diagonal stripes, a red hinge pin
  clapperboard: ({ rr, half, clip, rot, seg2, join }) => {
    const b = rr(3, 10.5, 21, 21, 2.75)
    const t = s => rot(s, -14, 4.5, 9.5)
    const arm = t(rr(3, 5, 21, 9.5, 2))
    // stripes: round-capped slanted pills, clipped inside the clapper
    const stripe = x => seg2(x + 1.5, 4.25, x - 1.25, 10.25, 2.25)
    return [
      ['c3', b],
      ['c1', clip(half(12, 21, 6.25, 'n'), b)],
      ['ink', arm],
      ['c2', clip(t(join(stripe(10.25), stripe(15.75))), arm)],
    ]
  },
  // blue board, yellow clip, cream text lines, a red quarter rising in the corner (the
  // file family's corner detail)
  clipboard: p => {
    const b = board(p)
    return [['c3', b], ['c1', p.cornerQuarter(b, 19.5, 21.5, 6.5, 'nw')], clipTab(p), ['tint', p.lines(8, [16, 12.5], [11.25, 14.75], 2)]]
  },
  'clipboard-check': p => [['c1', board(p)], clipTab(p), ...p.vee([[8.25, 14.25], [10.75, 16.75], [15.75, 11.5]], 2.5, 'tint', 'tint')],
  'clipboard-list': p => [['c3', board(p)], clipTab(p), ['c1', p.circle(8.75, 11.5, 1.35), p.circle(8.75, 16.5, 1.35)], ['tint', p.lines(12, 16, [11.5, 16.5], 2)]],
  // rim split red over blue, cream face, ink hands (their own moving part), a red pin
  clock: ({ circle, bar, splitDisc }) => [
    ...splitDisc(12, 12, 9.75, 'c1', 'c3', 'h'),
    ['tint', circle(12, 12, 7)],
    ['ink', bar([[12, 6.5], [12, 12], [16, 14.5]], 2.25)],
    ['c1', circle(12, 12, 1.1)],
  ],
  // two bars crossing: red under, blue over
  close: p => [['c1', p.seg2(5.5, 5.5, 18.5, 18.5, 3.25)], ['c3', p.seg2(18.5, 5.5, 5.5, 18.5, 3.25)]],
  // one clean blue cloud up top; an ink shaft drops out of its belly into a red head
  'cloud-download': p => [
    ...p.cloud(-5, 'c3', 'c3', 0.8),
    ['ink', p.seg2(12, 11, 12, 18.5, 2.5)],
    ['c1', hd(p, 12, 22.25, 90, 5.75, 5)],
  ],
  // the cloud sits low; the shaft rises through it and the red head pokes out of its top
  'cloud-upload': p => [
    ...p.cloud(2.25, 'c3', 'c3', 0.8),
    ['ink', p.seg2(12, 17, 12, 7.5, 2.5)],
    ['c1', hd(p, 12, 2.5, 270, 5.75, 5)],
  ],
  // a yellow bolt striking through the cloud, cleared by a moat along its outline
  'cloud-lightning': p => {
    const bolt = p.poly([[12.75, 10.25], [7, 17], [11.25, 17], [9.75, 22.75], [17, 14.5], [12.75, 14.5], [15.75, 10.25]], [1, 0.9, 0.9, 1, 0.9, 0.9, 1])
    return [...cloudTop(p), ['c2', bolt]]
  },
  // the cloud stays whole in its shape: the slash's page-coloured moat is cut out and every
  // corner the moat leaves is rounded, so no sharp shards remain
  'cloud-off': p => {
    const moat = p.seg2(3.25, 3.25, 20.75, 20.75, 4.75)
    const soft = sh => p.soften(p.cut(sh, moat), 1, { tmax: 2 })
    const [[lr, lobe], [br, ...body]] = p.cloud(0.5)
    return [[lr, soft(lobe)], [br, soft(p.join(...body))], ['ink', p.seg2(3.25, 3.25, 20.75, 20.75, 2.5)]]
  },
  // three slanted drops, red, ink, red
  'cloud-rain': p => [
    ...cloudTop(p),
    ['c1', p.seg2(8.25, 17, 6.75, 20.75, 2.5), p.seg2(16.75, 17, 15.25, 20.75, 2.5)],
    ['ink', p.seg2(12.5, 17, 11, 20.75, 2.5)],
  ],
  'cloud-snow': p => [
    ...cloudTop(p),
    ['c1', p.circle(7.5, 19, 1.6), p.circle(16.5, 19, 1.6)],
    ['ink', p.circle(12, 19, 1.6)],
  ],
  // a yellow sun with a red halo band, the blue cloud in front, cleared by a moat
  'cloud-sun': ({ circle, pill, arc }) => [
    ['c1', arc(8.75, 8.75, 6.75, 165, 285, 2.25)],
    ['c2', circle(8.75, 8.75, 4.25)],
    ['cut', pill(5.25, 13.75, 23, 22), circle(16, 13, 6.25), circle(10.75, 15.5, 4.5)],
    ['c3', pill(6.5, 15, 21.75, 20.75), circle(16, 13, 5), circle(10.75, 15.5, 3.25)],
  ],
  code: p => [...p.vee(p.chev(3.25, 12, 180, 7), 2.75, 'c3', 'c3'), ...p.vee(p.chev(20.75, 12, 0, 7), 2.75, 'c3', 'c3'), ['c1', p.seg2(13.5, 4.5, 10.5, 19.5, 2.75)]],
  // two coins: a blue one behind, a red one in front with a yellow rim, cleared by a moat
  coins: ({ circle, ring }) => [
    ['c3', circle(16, 8, 6)],
    ['tint', ring(16, 8, 3.25, 2)],
    ['cut', circle(8.75, 15.25, 6.75)],
    ['c1', circle(8.75, 15.25, 5.75)],
    ['c2', ring(8.75, 15.25, 3.75, 2.5)],
  ],
  // two panels: a blue arch and a red inverted arch, standing side by side
  columns: ({ arch }) => [['c3', arch(3, 3, 11.25, 21, 'n', 1.5)], ['c1', arch(12.75, 3, 21, 21, 's', 1.5)]],
  // blue face, a lens needle split across its middle: red to the north-east, cream
  // to the south-west, a pivot dot
  compass: p => [
    ['c3', p.circle(12, 12, 9.75)],
    ['c1', p.poly([[18.25, 5.75], [13.9, 13.9], [10.1, 10.1]], [1, 0, 0])],
    ['tint', p.poly([[5.75, 18.25], [10.1, 10.1], [13.9, 13.9]], [1, 0, 0])],
    ['ink', p.circle(12, 12, 1.25)],
  ],
  // yellow cookie with a round bite out of it, ink chips and one red
  cookie: ({ circle, cut }) => [
    ['c2', cut(circle(12, 12, 9.75), circle(20.25, 4.75, 4.5))],
    ['ink', circle(8.25, 9, 1.4), circle(9.25, 15.75, 1.3), circle(15, 16, 1.4)],
    ['c1', circle(13.5, 10.75, 1.4)],
  ],
  // red dome lid on rounded feet with an ink knob, an ink rim sitting on the blue pot,
  // ink handles
  'cooking-pot': ({ rr, pill, half, soften, circle }) => [
    ['ink', pill(2, 13.5, 5.5, 16), pill(18.5, 13.5, 22, 16), circle(12, 4.25, 1.6)],
    ['c1', soften(half(12, 10.5, 6.25, 'n'), 1.25)],
    ['c3', rr(4.5, 11, 19.5, 21, [1.25, 1.25, 4.5, 4.5])],
    ['ink', pill(3.5, 10, 20.5, 12.5)],
  ],
  copy: ({ rr, quarter, clip }) => {
    const f = rr(9, 9, 21, 21, 3)
    return [['c3', rr(3, 3, 15, 15, 3)], ['cut', rr(7.75, 7.75, 22.25, 22.25, 4.25)], ['c1', f], ['c2', clip(quarter(21, 21, 6.5, 'nw'), f)]]
  },
  // ink leg and quarter turn, the shaft sunk into a red swept head
  'corner-down-left': p => [
    ['ink', p.stroke('M19.5 3.5V10A5 5 0 0 1 14.5 15H8.5', 2.5)],
    ['c1', hd(p, 3, 15, 180, 6.25, 5.5)],
  ],
  'corner-down-right': p => [
    ['ink', p.stroke('M4.5 3.5V10A5 5 0 0 0 9.5 15H15.5', 2.5)],
    ['c1', hd(p, 21, 15, 0, 6.25, 5.5)],
  ],
  // blue chip with ink pins, a yellow die and a red core disc
  cpu: ({ rr, pill, circle }) => [
    ['ink', pill(8, 2, 10.25, 6), pill(13.75, 2, 16, 6), pill(8, 18, 10.25, 22), pill(13.75, 18, 16, 22), pill(2, 8, 6, 10.25), pill(2, 13.75, 6, 16), pill(18, 8, 22, 10.25), pill(18, 13.75, 22, 16)],
    ['c3', rr(4.5, 4.5, 19.5, 19.5, 3.25)],
    ['c2', rr(8.25, 8.25, 15.75, 15.75, 2)],
    ['c1', circle(12, 12, 1.75)],
  ],
  // blue card, ink stripe, two overlapping discs with their orange overprint
  'credit-card': ({ rr, clip, circle }) => {
    const card = rr(2, 4.5, 22, 19.5, 2.75)
    return [
      ['c3', card],
      ['ink', clip(rr(0, 8, 24, 11, 0), card)],
      ['c1', circle(7, 15.25, 2.4)],
      ['c2', circle(10.5, 15.25, 2.4)],
      ['c4', clip(circle(7, 15.25, 2.4), circle(10.5, 15.25, 2.4))],
    ]
  },
  crop: ({ bar, circle }) => [
    ['c3', bar([[6.5, 2.5], [6.5, 17.5], [21.5, 17.5]], 2.75)],
    ['c1', bar([[2.5, 6.5], [17.5, 6.5], [17.5, 21.5]], 2.75)],
    ['c2', circle(12, 12, 3.25)],
  ],
  crosshair: ({ ring, seg2, circle }) => [
    ['c3', ring(12, 12, 8.5, 6)],
    ['ink', seg2(12, 2, 12, 7.5, 2.5), seg2(12, 16.5, 12, 22, 2.5), seg2(2, 12, 7.5, 12, 2.5), seg2(16.5, 12, 22, 12, 2.5)],
    ['c1', circle(12, 12, 2.25)],
  ],
  // one crown silhouette: three rounded peaks, each crowned by a red ball sitting on its
  // tip, the red band the crown's own lower part, a blue jewel on the band
  crown: ({ poly, rect, clip, circle }) => {
    const c = poly([[4.5, 20], [3.25, 8.25], [8.5, 12.25], [12, 5.75], [15.5, 12.25], [20.75, 8.25], [19.5, 20]], [1.75, 1.25, 1.25, 1.25, 1.25, 1.25, 1.75])
    return [
      ['c2', c],
      ['c1', clip(c, rect(0, 16.5, 24, 24)), circle(3.9, 8.75, 1.9), circle(12, 5.9, 1.9), circle(20.1, 8.75, 1.9)],
      ['c3', circle(12, 12.75, 1.5)],
    ]
  },
  'cup-soda': ({ poly, pill, bar, clip }) => {
    const cup = poly([[5, 8], [19, 8], [17.5, 21.5], [6.5, 21.5]], [0, 0, 2, 2])
    return [
      ['ink', bar([[12, 8], [13.5, 2.75], [16.75, 2.75]], 2)],
      ['c1', cup],
      ['c2', clip(pill(0, 12.5, 24, 17), cup)],
      ['c3', pill(3.5, 6.75, 20.5, 9.5)],
    ]
  },
  // a full, solid pointer (rounded tip and wings) split along its axis: red on the light
  // side, blue in its shadow; the ink tail tucks under its notch at the shared weight
  cursor: p => {
    const T = [4.75, 2.75], N = [11, 14.5]
    const sh = p.poly([T, [19.25, 12.75], N, [6.5, 20]], [1.25, 1.6, 1, 1.6])
    const deg = Math.atan2(N[1] - T[1], N[0] - T[0]) * 180 / Math.PI
    return [['ink', p.seg2(10, 12.5, 14.75, 20.75, 2.75)], ...p.split(sh, 'c1', 'c3', T[0], T[1], deg)]
  },
  database: ({ ellipse, ehalf, rect }) => [
    ['c3', rect(4, 12, 20, 18.5), ehalf(12, 18.5, 8, 3, 's')],
    ['c1', rect(4, 5.5, 20, 12), ehalf(12, 12, 8, 3, 's')],
    ['c2', ellipse(12, 5.5, 8, 3)],
  ],
  disc: ({ ring, arc }) => [
    ['c3', ring(12, 12, 9.75, 2.25)],
    ['c2', ring(12, 12, 4.5, 2.25)],
    ['tint', arc(12, 12, 6.75, 190, 250, 1.5)],
  ],
  dna: ({ stroke, pill }) => [
    ['ink', pill(8.5, 3, 15.5, 5), pill(9, 9, 15, 11), pill(9, 13, 15, 15), pill(8.5, 19, 15.5, 21)],
    ['c1', stroke('M7 2.5 C7 7.5 17 7 17 12 C17 17 7 16.5 7 21.5', 2.5)],
    ['c3', stroke('M17 2.5 C17 7.5 7 7 7 12 C7 17 17 16.5 17 21.5', 2.5)],
  ],
  // yellow muzzle-long head, red drop ears, ink eyes and a half-disc nose
  dog: ({ circle, rr, lens, half }) => [
    ['c1', lens(8, 6.5, 4.5, 15, 2.5), lens(16, 6.5, 19.5, 15, 2.5, 2.5)],
    ['c2', rr(6.75, 4.5, 17.25, 20.5, 5.25)],
    ['ink', circle(9.75, 10.75, 1.3), circle(14.25, 10.75, 1.3), half(12, 15, 1.9, 's')],
  ],
  'dollar-sign': ({ arc, seg2 }) => [
    ['c3', seg2(12, 2.5, 12, 21.5, 2.5)],
    ['ink', arc(12, 8.5, 3.5, 90, 330, 2.5), arc(12, 15.5, 3.5, 270, 510, 2.5)],
  ],
  donut: ({ ring, rot, pill }) => [
    ['c2', ring(12, 12, 9.75, 3)],
    ['c1', ring(12, 12, 8, 3)],
    ['tint', rot(pill(11, 5.25, 13.5, 6.75), 20, 12.25, 6), rot(pill(17, 10.5, 18.5, 13), -15, 17.75, 11.75), rot(pill(6.25, 14.75, 7.75, 17.25), 35, 7, 16), rot(pill(14, 16.75, 16.5, 18.25), -20, 15.25, 17.5), rot(pill(6, 8.5, 7.5, 11), 15, 6.75, 9.75)],
  ],
  // blue frame bending round a radiused corner, the red leaf swung open as a soft
  // quadrilateral, a yellow knob, an ink sill
  'door-open': ({ pill, poly, circle, stroke }) => [
    ['ink', pill(2.5, 19.75, 21.5, 22.25)],
    ['c3', stroke('M5.25 20.5V8A3.5 3.5 0 0 1 8.75 4.5H14', 2.5)],
    ['c1', poly([[13.25, 2.75], [19.75, 4.75], [19.75, 19.25], [13.25, 21.25]], [1.25, 1.5, 1.5, 1.25])],
    ['c2', circle(16.25, 12.25, 1.3)],
  ],
  // blue tray with soft top corners, the red head overprinting it cleanly, ink shaft
  download: p => [
    ['c3', p.rr(3, 14.5, 21, 21.5, [2, 2, 5, 5])],
    ['ink', p.seg2(12, 2.75, 12, 11.5, 2.5)],
    ['c1', hd(p, 12, 17.75, 90, 6.75, 5.75)],
  ],
  'drag-handle': ({ circle }) => [
    ['c1', circle(9, 5, 1.6), circle(15, 12, 1.6), circle(9, 19, 1.6)],
    ['ink', circle(15, 5, 1.6), circle(9, 12, 1.6), circle(15, 19, 1.6)],
  ],
}
