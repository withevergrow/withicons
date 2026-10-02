// BAUHAUS redraws, chunk 6: droplet … gem (run 8 redesign: soft, split, compositional)
// 'file' and 'folder' are art-director exemplars (_bauhaus-render.mjs EXEMPLAR) and win
// over the entries here; the rest of both families copies their construction.

// file family: blue page, yellow dog-ear lifted off by a 1u gap. Same measures as the kit
// page (the exemplar), but the notch's inner corner is radiused (2u) and the dog-ear's
// corner follows it concentrically (1u), so no 90-degree step sits beside the fold. q adds
// the exemplar's red quarter rising from the lower-left, kept small (r 6) so every glyph
// stands clear of it on blue.
const X0 = 4.5, Y0 = 2, X1 = 19.5, Y1 = 22, F = 5.5, NR = 2
const pg = (p, role = 'c3', q = null, qr = 6) => {
  const cx = X1 - F, cy = Y0 + F, nx = cx - 1, ny = cy + 1, R = F + 3
  const notch = p.path(`M${nx} ${ny - R}V${ny - NR}A${NR} ${NR} 0 0 0 ${nx + NR} ${ny}H${nx + R}A${R} ${R} 0 0 0 ${nx} ${ny - R}Z`)
  const body = p.cut(p.rr(X0, Y0, X1, Y1, 2.5), notch)
  const fr = NR - 1
  const fold = p.path(`M${cx} ${cy - F}V${cy - fr}A${fr} ${fr} 0 0 0 ${cx + fr} ${cy}H${cx + F}A${F} ${F} 0 0 0 ${cx} ${cy - F}Z`)
  const L = [[role, body]]
  if (q) L.push([q, p.clip(p.quarter(X0, Y1, qr, 'ne'), body)])
  L.push(['c2', fold])
  return L
}
const file = (p, role, ...extra) => [...pg(p, role), ...extra]
const fileq = (p, ...extra) => [...pg(p, 'c3', 'c1'), ...extra]
// the glyph's centre on the page: below the dog-ear, clear of the red quarter
const GX = 12.25, GY = 13.75
const folder = (p, ...extra) => [...p.folder('c1', 'c3'), ...extra]

const EGG = 'M12 2.5 C16.25 2.5 19 8.75 19 13.75 C19 18.5 16 21.5 12 21.5 C8 21.5 5 18.5 5 13.75 C5 8.75 7.75 2.5 12 2.5 Z'
const FLAME = 'M12 21.5 C8.25 21.5 5 18.75 5 15 C5 11.75 5.75 9.5 7 7.5 C8 8.75 9.25 9.5 10.5 9.5 C10.25 6.5 11.5 4.25 14 2.5 C17.25 5.5 19 10 19 15 C19 18.75 15.75 21.5 12 21.5 Z'
const FLAG = 'M5 4 C8 2 11 2 13.25 3.5 C15.5 5 18 5 21 3.5 V13.75 C18 15.25 15.5 15.25 13.25 13.75 C11 12.25 8 12.25 5 14.25 Z'
const PAD = 'M8 5.5 H16 C19.25 5.5 20.75 7.75 21.5 11 C22 13.25 22.5 19.5 19.5 19.5 C17.75 19.5 17 16 15 16 H9 C7 16 6.25 19.5 4.5 19.5 C1.5 19.5 2 13.25 2.5 11 C3.25 7.75 4.75 5.5 8 5.5 Z'
// eye: a lens split along its axis, blue lid over red, cream iris, yellow pupil ring
const lid = p => p.soften(p.lens(1.75, 12, 22.25, 12, 7.5), 1.5, { tmax: 3 })
const eye = p => [
  ...p.split(lid(p), 'c3', 'c1', 12, 12, 0),
  ['tint', p.circle(12, 12, 5)],
  ['c2', p.circle(12, 12, 3.5)],
]

export const R = {
  // blue drop, a yellow meniscus filling its round belly, a cream glint
  droplet: (p) => {
    const d = p.drop(12, 14.5, 7.25, 12, 2, 0.6)
    return [['c3', d], ['c2', p.clip(d, p.circle(12, 24.5, 9.5))], ['tint', p.lens(7.75, 13.5, 9.5, 9.5, 0.8)]]
  },
  // ink grip, tall red plates, short blue collars: every part a stadium
  dumbbell: ({ pill }) => [
    ['ink', pill(3, 10.75, 21, 13.25)],
    ['c1', pill(5.5, 4, 10, 20), pill(14, 4, 18.5, 20)],
    ['c3', pill(1.75, 7.5, 4.75, 16.5), pill(19.25, 7.5, 22.25, 16.5)],
  ],
  // a blue sheet and one diagonal pencil laid over its corner: yellow body, red round
  // eraser, a cream cone with a rounded ink point. No moat, no hook.
  edit: (p) => {
    const R = s => p.rot(s, -45, 12, 12)
    return [
      ['c3', p.rr(3, 5, 19, 21, 3.5)],
      ['tint', R(p.softTri([2.75, 12], [8.75, 9.25], [8.75, 14.75], 0, 1.1, 0.9))],
      ['ink', R(p.softTri([2.75, 12], [5.25, 10.85], [5.25, 13.15], 0, 1, 0.9))],
      ['c2', R(p.rect(8.75, 9.25, 17, 14.75))],
      ['c1', R(p.rr(17, 9.25, 21.75, 14.75, [0, 2.75, 2.75, 0]))],
    ]
  },
  // the egg split across its waist: yellow crown, red base, a cream glint
  egg: (p) => [...p.split(p.path(EGG), 'c2', 'c1', 12, 13.5, 0), ['tint', p.lens(8.25, 11, 10, 6.5, 0.8)]],
  // a soft block split red | blue on the diagonal, standing on an ink floor line
  eraser: ({ rot, rr, pill }) => [
    ['ink', pill(10, 19.5, 21.5, 21.75)],
    ['c1', rot(rr(4.5, 7, 13, 16.5, [3.25, 0, 0, 3.25]), 45, 12, 12)],
    ['c3', rot(rr(13, 7, 20.5, 16.5, [0, 3.25, 3.25, 0]), 45, 12, 12)],
  ],
  // blue C with round caps, two red bars of the same weight crossing it
  euro: ({ arc, seg2 }) => [
    ['c3', arc(13, 12, 7.25, 45, 315, 2.5)],
    ['c1', seg2(3.75, 10, 13.25, 10, 2.25), seg2(3.75, 14, 13.25, 14, 2.25)],
  ],
  // a blue box with one yellow corner accent; a single 45-degree kit arrow leaves it from
  // the centre, its soft red head fully clear of the box
  'external-link': (p) => {
    const box = p.rr(3, 8, 16, 21, 3.5)
    return [
      ['c3', box],
      ['c2', p.cornerQuarter(box, 3, 21, 6.5, 'ne')],
      ...p.arrow(9.5, 14.5, 21, 3, { len: 6.5, half: 5.25 }),
    ]
  },
  eye: (p) => [...eye(p), ['ink', p.circle(12, 12, 1.75)]],
  // the eye stays whole in form: the slash's page-coloured halo parts it, and every cut
  // end is softened, so no knife-edged shards; the iris is reduced to cream + ink
  'eye-off': (p) => {
    const halo = p.seg2(4, 4, 20, 20, 4.75)
    const off = sh => p.soften(p.cut(sh, halo), 0.9, { tmax: 2 })
    return [
      ...p.split(lid(p), 'c3', 'c1', 12, 12, 0).map(([r, sh]) => [r, off(sh)]),
      ['tint', off(p.circle(12, 12, 4.75))],
      ['ink', p.seg2(4, 4, 20, 20, 2.5)],
    ]
  },
  // blue sawtooth hall (quarter-disc roofs), red chimney, yellow window dots
  factory: ({ rr, quarter, pill, circle }) => [
    ['c1', pill(16, 2.5, 20.5, 14)],
    ['c3', rr(3, 12, 21, 21, [0, 0, 3, 3]), quarter(9, 12.01, 6, 'nw'), quarter(15, 12.01, 6, 'nw')],
    ['c2', circle(7, 16.5, 1.5), circle(12, 16.5, 1.5), circle(17, 16.5, 1.5)],
  ],
  // two soft triangles, blue then red, rounded like the play exemplar
  'fast-forward': ({ poly }) => [
    ['c3', poly([[2.5, 5], [12, 12], [2.5, 19]], [2.5, 2, 2.5])],
    ['c1', poly([[12, 5], [21.5, 12], [12, 19]], [2.5, 2, 2.5])],
  ],
  file: (p) => fileq(p),
  // one zipper column: three cream teeth pills, then a single yellow pull with an ink eye
  'file-archive': (p) => file(p, 'c3',
    ['tint', p.pill(8, 4.5, 11.5, 6.25), p.pill(8, 7.5, 11.5, 9.25), p.pill(8, 10.5, 11.5, 12.25)],
    ['c2', p.pill(7.75, 13.5, 11.75, 20)],
    ['ink', p.circle(9.75, 17.75, 1.1)]),
  // one yellow note: round head, stem and a soft flag
  'file-audio': (p) => file(p, 'c3', ['c2', p.circle(10, 16.75, 2.6), p.seg2(11.6, 16.5, 11.6, 9.5, 2.2), p.stroke('M11.6 9.5 C12.75 11.5 15.5 11.75 15.5 14.5', 2.2)]),
  'file-check': (p) => fileq(p, ...p.vee([[GX - 3.5, GY + 0.25], [GX - 0.75, GY + 3], [GX + 3.75, GY - 2.5]], 2.5, 'tint', 'tint')),
  // a pair of chevrons, yellow and cream
  'file-code': (p) => file(p, 'c3', ['c2', p.chevron(8.25, 14.5, 180, 3.5, 2.25)], ['tint', p.chevron(15.75, 14.5, 0, 3.5, 2.25)]),
  // the kit arrow in cream: round-capped shaft running into the soft head, clear of the quarter
  'file-down': (p) => fileq(p, ...p.arrow(GX, 9, GX, 19, { w: 2.25, len: 5.5, half: 5, shaft: 'tint', tip: 'tint' })),
  'file-up': (p) => fileq(p, ...p.arrow(GX, 19, GX, 9, { w: 2.25, len: 5.5, half: 5, shaft: 'tint', tip: 'tint' })),
  // a yellow sun over a red hill that rises from a circle, clipped to the sheet
  'file-image': (p) => {
    const b = pg(p)
    return [...b, ['c2', p.circle(9.5, 10.75, 2)], ['c1', p.clip(p.circle(15, 25.5, 9.5), b[0][1])]]
  },
  // a small yellow padlock with a cream shackle on the page
  'file-lock': (p) => file(p, 'c3',
    ['tint', p.arc(12, 12, 2.5, 180, 360, 2), p.seg2(9.5, 12, 9.5, 14, 2), p.seg2(14.5, 12, 14.5, 14, 2)],
    ['c2', p.rr(8, 13, 16, 19.25, 2)],
    ['ink', p.circle(12, 16.1, 1.1)]),
  'file-minus': (p) => fileq(p, ['tint', p.glyph('minus', GX, GY, 3.25, 2.5)]),
  // red sheet (the PDF convention), a cream P in one round-capped stroke
  'file-pdf': (p) => file(p, 'c1', ['tint', p.seg2(10, 10.75, 10, 18.5, 2.4), p.seg2(10, 10.75, 12.25, 10.75, 2.4), p.seg2(10, 15.5, 12.25, 15.5, 2.4), p.arcEnds(12.25, 13.125, 2.375, 270, 450, 2.4, 'flat', 'flat')]),
  'file-plus': (p) => fileq(p, ['tint', p.glyph('plus', GX, GY, 3.25, 2.5)]),
  // the search exemplar in small: cream ring, yellow lens, cream handle
  'file-search': (p) => file(p, 'c3',
    ['tint', p.seg2(13.75, 16, 16, 18.25, 2.25), p.ring(11.25, 13.5, 3.9, 2.2)],
    ['c2', p.circle(11.25, 13.5, 2.2)]),
  'file-spreadsheet': (p) => file(p, 'accent', ['tint', p.pill(7, 11.25, 17, 13.25), p.pill(7, 15.75, 17, 17.75), p.pill(10.75, 9, 12.75, 19.5)]),
  // three text lines; the last starts clear of the red quarter
  'file-text': (p) => fileq(p, ['tint', p.seg2(8.25, 8.25, 10.75, 8.25, 2), p.seg2(8.25, 12, 16, 12, 2), p.seg2(9.5, 15.75, 16, 15.75, 2)]),
  'file-video': (p) => fileq(p, ['tint', p.poly([[GX - 2.75, GY - 4], [GX + 4.25, GY], [GX - 2.75, GY + 4]], 1.25)]),
  'file-x': (p) => fileq(p, ['tint', p.glyph('x', GX, GY, 3.5, 2.5)]),
  // a full red sheet behind, offset up-left and moated off the blue page in front; the
  // visible rim is softened at both ends, so it reads as a sheet, never an L sliver
  files: (p) => {
    const back = p.soften(p.cut(p.rr(2.5, 2, 16, 17, 2.5), p.rr(6, 5.5, 22, 23.5, 3.5)), 1.1, { tmax: 2 })
    const cx = 15.5, cy = 11.5, F = 4.5, R = F + 3, nx = cx - 1, ny = cy + 1
    const body = p.cut(p.rr(7.5, 7, 20.5, 22, 2.5), p.path(`M${nx} ${ny - R}V${ny - 2}A2 2 0 0 0 ${nx + 2} ${ny}H${nx + R}A${R} ${R} 0 0 0 ${nx} ${ny - R}Z`))
    const fold = p.path(`M${cx} ${cy - F}V${cy - 1}A1 1 0 0 0 ${cx + 1} ${cy}H${cx + F}A${F} ${F} 0 0 0 ${cx} ${cy - F}Z`)
    return [['c1', back], ['c3', body], ['c2', fold]]
  },
  // blue strip with punched sprocket holes, two soft frames red | yellow
  film: ({ rr, circle }) => [
    ['c3', rr(2, 4, 22, 20, 3)],
    ['cut', ...[5.5, 9.75, 14.25, 18.5].flatMap(x => [circle(x, 6.25, 1), circle(x, 17.75, 1)])],
    ['c1', rr(4.5, 8.75, 11.5, 15.25, 1.75)],
    ['c2', rr(12.5, 8.75, 19.5, 15.25, 1.75)],
  ],
  // a half-disc funnel split into a yellow rim and a blue bowl, red stem
  // a yellow pill rim over a soft blue half-disc bowl, the red stem dropping from it
  filter: (p) => [
    ['c1', p.pill(10, 10, 14, 21.75)],
    ['c3', p.soften(p.half(12, 7.5, 8.75, 's'), 1.25, { tmax: 2 })],
    ['c2', p.pill(2.25, 2.25, 21.75, 6.25)],
  ],
  // nested arches: blue outer, red inner, a yellow core dot and an ink centre ridge
  fingerprint: ({ arcEnds, seg2, circle }) => [
    ['c3', arcEnds(12, 11.5, 8.25, 180, 360, 2.5, 'flat', 'flat'), seg2(3.75, 11.5, 3.75, 17, 2.5), seg2(20.25, 11.5, 20.25, 15, 2.5)],
    ['c1', arcEnds(12, 11.5, 4.75, 180, 360, 2.5, 'flat', 'flat'), seg2(7.25, 11.5, 7.25, 20.5, 2.5), seg2(16.75, 11.5, 16.75, 21, 2.5)],
    ['c2', circle(12, 11.5, 1.6)],
    ['ink', seg2(12, 15, 12, 21, 2.5)],
  ],
  // red tail, blue body, a yellow head cut by the gill's arc, ink eye
  fish: (p) => {
    const body = p.lens(5.5, 12, 22, 12, 6.25)
    return [
      ['c1', p.poly([[8, 12], [2, 6.75], [2, 17.25]], [0.5, 1.5, 1.5])],
      ['c3', body],
      ['c2', p.cut(body, p.circle(4.5, 12, 9))],
      ['ink', p.circle(17.25, 10.75, 1.25)],
    ]
  },
  // ink pole, a waving banner split red | blue with a yellow sun disc
  flag: (p) => [['ink', p.pill(3.5, 2, 6, 22)], ...p.split(p.path(FLAG), 'c3', 'c1', 13.25, 8, 90), ['c2', p.circle(9, 8.25, 2.25)]],
  // red flame, an orange glow pooled in its base, a yellow core drop
  flame: (p) => {
    const f = p.path(FLAME)
    return [['c1', f], ['c4', p.clip(f, p.circle(12, 23, 8.5))], ['c2', p.drop(12.25, 17, 3, 12.5, 11, 0.5)]]
  },
  // blue flask, yellow liquid with a curved surface, two red bubbles, ink lip
  'flask-conical': (p) => {
    const body = p.poly([[9.5, 3], [14.5, 3], [14.5, 9], [20.5, 21], [3.5, 21], [9.5, 9]], [0, 0, 1.25, 2.25, 2.25, 1.25])
    return [
      ['c3', body],
      ['c2', p.clip(body, p.circle(12, 30, 15.5))],
      ['c1', p.circle(10, 17.5, 1.25), p.circle(14, 16, 0.9)],
      ['ink', p.pill(7.5, 2, 16.5, 4.5)],
    ]
  },
  // six lens petals alternating red | blue round a yellow heart
  flower: (p) => [...p.petals(12, 12, 6, 2.5, 10, 3.25, ['c1', 'c3']), ['c2', p.circle(12, 12, 3.75)], ['ink', p.circle(12, 12, 1.5)]],
  folder: (p) => folder(p),
  'folder-minus': (p) => folder(p, ['tint', p.seg2(9, 14.75, 15, 14.75, 2.5)]),
  'folder-plus': (p) => folder(p, ['tint', p.glyph('plus', 12, 14.75, 3.25, 2.5)]),
  'folder-search': (p) => folder(p, ['tint', p.seg2(13.75, 16.75, 16, 19, 2.25), p.ring(11.25, 14.25, 3.9, 2.2)], ['c2', p.circle(11.25, 14.25, 2.2)]),
  // red back with the half-disc tab, a yellow sheet, the blue front swung open
  'folder-open': (p) => [
    ['c1', p.rr(2, 5.5, 19, 20, 2.5), p.half(7, 6.75, 4.5, 'n')],
    ['c2', p.rr(5, 8, 17.5, 15, 1.5)],
    ['c3', p.poly([[6.25, 10.75], [22.25, 10.75], [19.5, 20], [2, 20]], [2.25, 2.25, 2.5, 2.5])],
  ],
  // blue ball: a soft red pentagon at the centre and five soft patches round the rim,
  // each opposite a pentagon edge (the real panel layout), no spokes
  football: (p) => {
    const b = p.circle(12, 12, 9.75)
    const patch = a => p.soften(p.clip(p.poly(p.ngon(12 + 10.25 * Math.cos(a * Math.PI / 180), 12 + 10.25 * Math.sin(a * Math.PI / 180), 4, 5, a + 180), 1), b), 0.9, { tmax: 1.5 })
    return [
      ['c3', b],
      ['c1', p.poly(p.ngon(12, 12, 4.25, 5), 1.1), ...[90, 162, 234, 306, 378].map(patch)],
    ]
  },
  // one round-capped ink stroke turning into the red head (the arrow family)
  // one quarter arc flowing straight into the kit head; the shaft ends inside the head
  forward: ({ stroke, head }) => [['ink', stroke('M4.5 20 V17.5 A8 8 0 0 1 12.5 9.5 H15', 2.5)], ['c1', head(21, 9.5, 0, 7, 6.25)]],
  // faces are yellow (smile, meh, laugh); the frown is the ink arc
  frown: (p) => p.face('c2', [['ink', p.arc(12, 20, 4.75, 225, 315, 2.25)]], { ey: 9.5 }),
  // red pump with a yellow window, smooth ink hose, blue plinth
  fuel: (p) => [
    ['ink', p.stroke('M12 11 H13.5 A2.25 2.25 0 0 1 15.75 13.25 V16.75 A2.25 2.25 0 0 0 20.25 16.75 V9.5 A2.5 2.5 0 0 0 19.5 7.75 L17.75 6', 2.25)],
    ['c1', p.rr(3.5, 2.5, 13, 20.5, [3.25, 3.25, 0, 0])],
    ['c2', p.rr(5.75, 5, 10.75, 10, 1.75)],
    ['c3', p.pill(2, 19.5, 14.5, 22)],
  ],
  // blue card between two red edge pills: a yellow hill and a cream sun on it
  'gallery-horizontal': (p) => {
    const c = p.rr(6.5, 3.5, 17.5, 20.5, 3)
    return [['c1', p.pill(2, 7, 4.5, 17), p.pill(19.5, 7, 22, 17)], ['c3', c], ['c2', p.clip(p.circle(12, 23.5, 7), c)], ['tint', p.circle(12, 9, 1.9)]]
  },
  // the pad split blue | red: cream d-pad left, two yellow buttons right
  gamepad: (p) => {
    const g = p.path(PAD)
    return [...p.split(g, 'c1', 'c3', 12, 12, 90), ['tint', p.glyph('plus', 7.5, 11, 2.5, 2)], ['c2', p.circle(15, 12.75, 1.5), p.circle(18, 9.75, 1.5)]]
  },
  // the dial in three flush segments yellow | blue | red, ink needle and hub
  gauge: ({ arcEnds, seg2, circle }) => [
    ['c2', arcEnds(12, 14, 8, 135, 225, 3, 'round', 'flat')],
    ['c3', arcEnds(12, 14, 8, 225, 315, 3, 'flat', 'flat')],
    ['c1', arcEnds(12, 14, 8, 315, 405, 3, 'flat', 'round')],
    ['ink', seg2(12, 14, 15.75, 10.25, 2.25), circle(12, 14, 2.25)],
  ],
  // blue gem, red crown with a yellow table facet; every corner soft
  gem: (p) => {
    const g = p.poly([[7, 3.5], [17, 3.5], [21.75, 9.25], [12, 21], [2.25, 9.25]], [1.75, 1.75, 1.5, 2.25, 1.5])
    const crown = p.clip(g, p.rect(0, 0, 24, 9.25))
    return [
      ['c3', g],
      ['c1', crown],
      ['c2', p.clip(crown, p.poly([[9.25, 0], [14.75, 0], [16, 9.25], [8, 9.25]], [0, 0, 1, 1]))],
    ]
  },
}
