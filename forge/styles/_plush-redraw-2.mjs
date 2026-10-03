// PLUSH redraws, chunk 2: hand-composed stuffed-toy icons (see forge/styles/PLUSH-GUIDE.md).
// Each entry: name -> (icon, P) => pieces, built with the frozen kit (P = prim + kit + P.auto()).
// The art director's exemplars (EXEMPLAR in _plush-render.mjs) win over any entry here.
//
// Icons 101-200 (circle-arrow-left .. gem). Local helpers below build the families so each
// family reads as one set of toys: round cushion buttons with a cream appliqué glyph, sky
// clipboards with cream paper and a sunflower clip, file sheets (page('c3','tint')) with
// their badge, folders with their badge, clouds as cream (or sky storm) cushions.

// ---------------------------------------------------------------------------
// local helpers

// a round cushion button with a cream appliqué glyph on top
const cushion = (P, role, ...glyph) => [
  P.felt(role, P.circle(12, 12, 9.25), { part: 'K', inset: 1.0 }),
  ...glyph.flat(),
]
const app = { part: 'A', stitch: false, out: 0.5 }       // appliqué options (small sewn-on felt)

// a sky clipboard: board, cream paper, sunflower clip
const clipboard = P => [
  P.felt('c3', P.rr(4, 4.25, 20, 21.5, 2.5), { part: 'K', stitch: false }),
  P.felt('tint', P.rr(6.25, 7.25, 17.75, 19.5, 1.25), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
  P.felt('c2', P.unite(P.pill(8.25, 3.75, 15.75, 7.75), P.rr(10.25, 2, 13.75, 5, 1.5)), { part: 'A', stitch: false, out: 0.5 }),
  P.knot(12, 3.6, 0.55, 'ink', { part: 'A' }),
]

// a cloud cushion lifted to make room for a badge below
const cloudHi = (P, role = 'tint', k = 0.92, cy = 10.25) => P.felt(role, P.cloud(12, cy, k), { part: 'K' })

// a file page with a sky sheet and cream dog-ear (exemplar family)
const page = P => P.page('c3', 'tint')
const pageBadge = (P, kind, role) => [...page(P), ...P.badge(kind, role, 17.25, 17.75, 4.25)]
// a folder (tomato back, sunflower pocket) with a badge
const folderBadge = (P, kind, role) => [...P.folder('c1', 'c2'), ...P.badge(kind, role, 17.5, 17.5, 4.25).map(asA)]
const asA = p => (p.part === 'S' ? { ...p, part: 'A' } : p)

export const R = {
  // ---- round cushion buttons ------------------------------------------------
  'circle-arrow-left': (icon, P) => cushion(P, 'c1', P.arrow(16.75, 12, 6.75, 12, { len: 4.75, half: 4.4, w: 2.6, r: 1, role: 'tint', ...app })),
  'circle-arrow-right': (icon, P) => cushion(P, 'c1', P.arrow(7.25, 12, 17.25, 12, { len: 4.75, half: 4.4, w: 2.6, r: 1, role: 'tint', ...app })),
  'circle-arrow-up': (icon, P) => cushion(P, 'c1', P.arrow(12, 16.75, 12, 6.75, { len: 4.75, half: 4.4, w: 2.6, r: 1, role: 'tint', ...app })),
  'circle-chevron-down': (icon, P) => cushion(P, 'c3', P.chevron(12, 14.6, 90, 6, { role: 'tint', w: 2.7, ...app })),
  'circle-chevron-right': (icon, P) => cushion(P, 'c3', P.chevron(14.6, 12, 0, 6, { role: 'tint', w: 2.7, ...app })),
  'circle-dot': (icon, P) => cushion(P, 'c3', P.button(12, 12, 3.6, 'c2', { part: 'A' })),
  'circle-pause': (icon, P) => cushion(P, 'c2',
    P.felt('c1', P.rr(8.5, 7.5, 11, 16.5, 1.25), app),
    P.felt('c1', P.rr(13, 7.5, 15.5, 16.5, 1.25), app)),
  'circle-play': (icon, P) => cushion(P, 'c4', P.felt('tint', P.poly([[9.5, 7], [17, 12], [9.5, 17]], 1.3), app)),
  'circle-stop': (icon, P) => cushion(P, 'c1', P.felt('tint', P.rr(8.25, 8.25, 15.75, 15.75, 1.6), { ...app, stitch: 'auto', stitchMin: 1.2, inset: 0.7 })),
  circle: (icon, P) => [P.felt('c3', P.circle(12, 12, 9.25), { part: 'K', inset: 1.0 })],

  // ---- media ----------------------------------------------------------------
  // a sky slate, its cream clapper stick raised with tomato stripes, a sunflower hinge button
  clapperboard: (icon, P) => {
    const stick = P.rot(P.rr(2.75, 4.25, 21, 8.25, 1.4), -12, 3, 8.25)
    const stripes = P.rot(P.unite(
      P.poly([[6, 4], [8.75, 4], [7.25, 8.5], [4.5, 8.5]]),
      P.poly([[11.25, 4], [14, 4], [12.5, 8.5], [9.75, 8.5]]),
      P.poly([[16.5, 4], [19.25, 4], [17.75, 8.5], [15, 8.5]])), -12, 3, 8.25)
    return [
      P.felt('c3', P.rr(3, 10.25, 21, 21, [1, 1, 2.5, 2.5]), { part: 'K' }),
      P.thread([[[6.5, 14.5], [17.5, 14.5]], [[6.5, 17.5], [13.5, 17.5]]], { w: 1.1, role: 'edge', op: 0.9, part: 'K' }),
      P.felt('tint', stick, { part: 'A', stitch: false }),
      P.flat('c1', P.clip(P.shrink(stick, 0.05), stripes), { part: 'A' }),
      ...P.button(4.1, 9.2, 1.25, 'c2', { part: 'A' }),
    ]
  },

  // ---- clipboards -------------------------------------------------------------
  clipboard: (icon, P) => [...clipboard(P), P.felt('accent', P.heart(12, 13.6, 0.33), { part: 'K', stitch: false, out: 0.45 })],
  'clipboard-check': (icon, P) => [...clipboard(P), P.tube('c4', [[8.6, 13.4], [11, 15.9], [15.5, 10.75]], 2.5, { part: 'A', stitch: false, out: 0.5 })],
  'clipboard-list': (icon, P) => [
    ...clipboard(P),
    P.knot(8.75, 11, 0.7, 'c1', { part: 'K' }), P.knot(8.75, 14, 0.7, 'c1', { part: 'K' }), P.knot(8.75, 17, 0.7, 'c1', { part: 'K' }),
    P.thread([[[10.75, 11], [15.5, 11]], [[10.75, 14], [15.5, 14]], [[10.75, 17], [14, 17]]], { w: 1.1, op: 0.75, part: 'K' }),
  ],

  // a sky alarm-clock cushion: cream face, French-knot hours, embroidered hands, tomato hub
  clock: (icon, P) => [
    P.felt('c3', P.circle(12, 12, 9.25), { part: 'K', stitch: false }),
    P.felt('tint', P.circle(12, 12, 6.6), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    P.knot(12, 7.1, 0.5), P.knot(16.9, 12, 0.5), P.knot(12, 16.9, 0.5), P.knot(7.1, 12, 0.5),
    P.thread([[12, 8.6], [12, 12], [14.9, 13.6]], { w: 1.25, part: 'A' }),
    P.knot(12, 12, 1.05, 'c1', { part: 'A' }),
  ],
  // two crossed tomato tubes sewn as one
  close: (icon, P) => [P.felt('c1', P.unite(P.seg(5.5, 5.5, 18.5, 18.5, 3.4), P.seg(18.5, 5.5, 5.5, 18.5, 3.4)), { part: 'K', seam: [[[5.5, 5.5], [18.5, 18.5]], [[18.5, 5.5], [5.5, 18.5]]] })],

  // ---- clouds -------------------------------------------------------------------
  'cloud-download': (icon, P) => {
    const ar = P.arrow(12, 11.75, 12, 21.75, { len: 5, half: 4.6, w: 2.9, r: 1.1, role: 'c1', part: 'S' })
    return [cloudHi(P, 'tint', 0.94, 9.5), P.moat(ar.F, 0.4), ar]
  },
  'cloud-upload': (icon, P) => {
    const ar = P.arrow(12, 21.75, 12, 11, { len: 5, half: 4.6, w: 2.9, r: 1.1, role: 'c3', part: 'S' })
    return [cloudHi(P, 'tint', 0.94, 9.5), P.moat(ar.F, 0.4), ar]
  },
  'cloud-lightning': (icon, P) => {
    const bolt = P.poly([[13.25, 10], [8.75, 16.25], [11.75, 16.25], [10.25, 22], [16, 14.5], [12.75, 14.5], [14.75, 10]], [0.6, 0.7, 0.4, 0.7, 0.7, 0.4, 0.6])
    return [cloudHi(P, 'tint', 0.92, 9.75), P.moat(bolt, 0.85), P.felt('c2', bolt, { part: 'A', stitch: false, out: 0.55 })]
  },
  // the whole cream cloud, a moat along the tomato slash (S) so both stay readable
  'cloud-off': (icon, P) => [P.felt('tint', P.flipX(P.cloud(12, 12.75, 1)), { part: 'K' }), ...P.slash({ from: [5, 4.5], to: [19.5, 20], w: 2.5, gap: 0.75, role: 'c1' })],
  'cloud-rain': (icon, P) => [
    cloudHi(P, 'tint', 0.92, 9.5),
    P.moat(P.unite(P.seg(8, 17, 6.75, 20.25, 2), P.seg(12.5, 17, 11.25, 20.25, 2), P.seg(17, 17, 15.75, 20.25, 2)), 0.6),
    P.tube('c3', [[8, 17], [6.75, 20.25]], 2, { part: 'A', stitch: false, out: 0.5 }),
    P.tube('c3', [[12.5, 17], [11.25, 20.25]], 2, { part: 'A', stitch: false, out: 0.5 }),
    P.tube('c3', [[17, 17], [15.75, 20.25]], 2, { part: 'A', stitch: false, out: 0.5 }),
  ],
  'cloud-snow': (icon, P) => [
    cloudHi(P, 'tint', 0.92, 9.5),
    ...[[7.5, 18], [12, 17.5], [16.5, 18], [9.75, 21], [14.25, 21]].map(([x, y]) => P.felt('c3', P.circle(x, y, 1.15), { part: 'A', stitch: false, out: 0.5, shade: false })),
  ],
  'cloud-sun': (icon, P) => {
    const rays = [0, 45, 90, 135, 180, 225, 270, 315].filter(a => a !== 45 && a !== 90 && a !== 0).map(a => P.tube('c2', [P.pt(8.5, 8.5, 5.4, a), P.pt(8.5, 8.5, 6.6, a)], 1.7, { part: 'deco', stitch: false, out: 0.5 }))
    const cl = P.cloud(14, 15, 0.78)
    return [
      ...rays,
      P.felt('c2', P.circle(8.5, 8.5, 4), { part: 'A', stitch: false }),
      P.moat(cl, 0.8),
      P.felt('tint', cl, { part: 'K' }),
    ]
  },

  // ---- code --------------------------------------------------------------------
  code: (icon, P) => [
    P.chevron(3.75, 12, 180, 7.25, { role: 'c3', w: 3, part: 'K' }),
    P.chevron(20.25, 12, 0, 7.25, { role: 'c3', w: 3, part: 'K' }),
    P.tube('c1', [[14, 4.75], [10, 19.25]], 2.6, { part: 'A', stitch: false }),
  ],

  // ---- money ---------------------------------------------------------------------
  // two stuffed sunflower coins, each a drum with its own top face sewn on
  coins: (icon, P) => {
    const drum = (cx, cy, rx, ry, h) => P.unite(P.ellipse(cx, cy, rx, ry), P.rect(cx - rx, cy, cx + rx, cy + h), P.ellipse(cx, cy + h, rx, ry))
    return [
      P.felt('c2', drum(8.25, 5.75, 5.9, 2.6, 4), { part: 'A', stitch: false }),
      P.felt('c2', P.ellipse(8.25, 5.75, 5.9, 2.6), { part: 'A', stitch: false, out: 0.5, hiOp: 0.5 }),
      P.moat(drum(15.75, 14.25, 6.25, 2.75, 4.5), 0.7),
      P.felt('c2', drum(15.75, 14.25, 6.25, 2.75, 4.5), { part: 'K', stitch: false }),
      P.felt('c2', P.ellipse(15.75, 14.25, 6.25, 2.75), { part: 'K', stitch: false, out: 0.5, hiOp: 0.5 }),
      P.thread([[[11, 19.4], [11, 19.4]], [[13.6, 20.6], [13.6, 20.6]], [[17.9, 20.6], [17.9, 20.6]], [[20.5, 19.4], [20.5, 19.4]]], { w: 0.9, op: 0.6, part: 'K' }),
      P.thread(P.arcPts(15.75, 14.25, 3.4, 200, 340, 10).map(([x, y]) => [x, 14.25 + (y - 14.25) * 0.45]), { w: 0.9, op: 0.55, part: 'K' }),
    ]
  },
  // two side-by-side cushions: sky and sunflower
  columns: (icon, P) => [
    P.felt('c3', P.rr(3, 3.5, 11.4, 20.5, [2.5, 1, 1, 2.5]), { part: 'K' }),
    P.felt('c2', P.rr(12.6, 3.5, 21, 20.5, [1, 2.5, 2.5, 1]), { part: 'A' }),
  ],
  // mint rim, cream face, a tomato needle on a sunflower hub
  compass: (icon, P) => [
    P.felt('c4', P.circle(12, 12, 9.25), { part: 'K', stitch: false }),
    P.felt('tint', P.circle(12, 12, 7.1), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c1', P.rot(P.poly([[12, 5.5], [14.6, 12], [12, 18.5], [9.4, 12]], [0.2, 0.5, 0.2, 0.5]), 45, 12, 12), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.rot(P.poly([[9.4, 12], [14.6, 12], [12, 18.5]], [0, 0, 0.2]), 45, 12, 12), { part: 'A', stitch: false, line: false, hi: false }),
    ...P.button(12, 12, 1.6, 'c2', { part: 'A' }),
  ],

  // ---- food -----------------------------------------------------------------------
  // a sunflower biscuit with a bite out of it and French-knot chocolate chips
  cookie: (icon, P) => [
    P.felt('c2', P.cut(P.circle(12, 12.25, 9.25), P.circle(20, 4.25, 3.6)), { part: 'K' }),
    P.knot(8.5, 9, 1.05), P.knot(13.5, 10.25, 1.05), P.knot(9, 15.5, 1.05), P.knot(14.75, 16, 1.05), P.knot(16.75, 12, 0.7),
  ],
  // a tomato pot, sky lid with a sunflower knob, sky side handles
  'cooking-pot': (icon, P) => [
    P.tube('c3', [[1.75, 12.75], [5, 12.75]], 2.2, { part: 'A', stitch: false, out: 0.5 }),
    P.tube('c3', [[19, 12.75], [22.25, 12.75]], 2.2, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.rr(4, 10, 20, 20.75, [1, 1, 4, 4]), { part: 'K' }),
    P.felt('accent', P.heart(12, 15.6, 0.3), { part: 'K', stitch: false, out: 0.45 }),
    P.felt('c3', P.unite(P.clip(P.ellipse(12, 10, 7.5, 4.25), P.rect(0, 0, 24, 10)), P.pill(3, 8.75, 21, 11.25)), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
    P.felt('c2', P.circle(12, 5.1, 1.5), { part: 'A', stitch: false, out: 0.5, hi: false }),
  ],

  // ---- edit -------------------------------------------------------------------------
  // a tomato sheet behind a stitched sky sheet
  copy: (icon, P) => [
    P.felt('c1', P.rr(3, 3, 15, 15, 2.25), { part: 'A', stitch: false }),
    P.moat(P.rr(8.5, 8.5, 21, 21, 2.5), 0.5),
    P.felt('c3', P.rr(8.5, 8.5, 21, 21, 2.5), { part: 'K' }),
    P.thread([[[11.75, 13.5], [17.75, 13.5]], [[11.75, 16.5], [15.75, 16.5]]], { w: 1.1, role: 'edge', op: 0.9, part: 'K' }),
  ],
  'corner-down-left': (icon, P) => cornerArrow(P, false),
  'corner-down-right': (icon, P) => cornerArrow(P, true),

  // ---- devices ----------------------------------------------------------------------
  // a sky chip on sunflower legs, a cream die with a cross-stitch
  cpu: (icon, P) => {
    const legs = []
    for (const t of [8.5, 12, 15.5]) {
      legs.push([[t, 2.5], [t, 6]], [[t, 18], [t, 21.5]], [[2.5, t], [6, t]], [[18, t], [21.5, t]])
    }
    return [
      P.felt('c2', P.unite(legs.map(([a, b]) => P.seg(a[0], a[1], b[0], b[1], 1.7))), { part: 'A', stitch: false, out: 0.5, shade: false }),
      P.felt('c3', P.rr(5, 5, 19, 19, 2.5), { part: 'K' }),
      P.felt('tint', P.rr(9, 9, 15, 15, 1.4), { part: 'K', stitch: false, out: 0.5 }),
      P.knot(12, 12, 1.15, 'c1', { part: 'K' }),
    ]
  },
  // a sky card, a tomato magstripe, a sunflower chip, embroidered digits
  'credit-card': (icon, P) => {
    const card = P.rr(2.5, 5, 21.5, 19, 2.5)
    return [
      P.felt('c3', card, { part: 'K', stitch: false }),
      P.felt('c1', P.clip(card, P.rect(0, 8.25, 24, 11.25)), { part: 'K', stitch: false, out: 0.45, hi: false }),
      P.felt('c2', P.rr(5.25, 13.25, 9.25, 16.25, 0.8), { part: 'A', stitch: false, out: 0.45 }),
      P.thread([[[12, 15.5], [13.5, 15.5]], [[15, 15.5], [16.5, 15.5]], [[18, 15.5], [18.75, 15.5]]], { w: 1.1, role: 'edge', op: 0.9, part: 'K' }),
    ]
  },
  // two stuffed L tubes
  crop: (icon, P) => [
    P.tube('c3', [[2.75, 6.5], [15.5, 6.5], ...P.arcPts(15.5, 8.5, 2, -90, 0).slice(1), [17.5, 21.25]], 3, { part: 'A' }),
    P.tube('c1', [[6.5, 2.75], [6.5, 15.5], ...P.arcPts(8.5, 15.5, 2, 180, 90).slice(1), [21.25, 17.5]], 3, { part: 'K' }),
  ],
  // a tomato ring with four ticks sewn as one, a sunflower bead in the centre
  crosshair: (icon, P) => [
    P.felt('c1', P.fillet(P.unite(P.ring(12, 12, 7.9, 5.2), P.seg(12, 2.5, 12, 6.5, 2.6), P.seg(12, 17.5, 12, 21.5, 2.6), P.seg(2.5, 12, 6.5, 12, 2.6), P.seg(17.5, 12, 21.5, 12, 2.6)), 0.7), { part: 'K', seam: [P.arcPts(12, 12, 6.55, 0, 360, 6)] }),
    P.felt('c3', P.circle(12, 12, 2), { part: 'A', stitch: false, out: 0.5, hi: false }),
  ],
  // a sunflower crown with tomato pom-poms and a sky jewel on a tomato band
  crown: (icon, P) => [
    P.felt('c2', P.poly([[3.5, 7.5], [8.25, 12], [12, 5.25], [15.75, 12], [20.5, 7.5], [19, 18.5], [5, 18.5]], [1.3, 0.8, 1.3, 0.8, 1.3, 1, 1]), { part: 'K' }),
    P.felt('c1', P.pill(4.5, 16.25, 19.5, 20.5), { part: 'K', stitch: false, out: 0.55 }),
    P.felt('c3', P.circle(12, 18.4, 1.25), { part: 'A', stitch: false, out: 0.4, shade: false }),
    P.felt('c1', P.circle(3.5, 6.75, 1.45), { part: 'deco', stitch: false, out: 0.5, hi: false }),
    P.felt('c1', P.circle(12, 4.4, 1.45), { part: 'deco', stitch: false, out: 0.5, hi: false }),
    P.felt('c1', P.circle(20.5, 6.75, 1.45), { part: 'deco', stitch: false, out: 0.5, hi: false }),
  ],
  // a tomato cup, cream lid, a sky straw
  'cup-soda': (icon, P) => [
    P.tube('c3', [[12.5, 8], [13.75, 3], [17.25, 2.25]], 1.9, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.poly([[5.25, 8.5], [18.75, 8.5], [17, 21.25], [7, 21.25]], [1, 1, 1.75, 1.75]), { part: 'K' }),
    P.felt('accent', P.heart(12, 15.25, 0.3), { part: 'K', stitch: false, out: 0.45 }),
    P.felt('tint', P.pill(4, 6.5, 20, 9.75), { part: 'A', stitch: false, out: 0.55 }),
  ],
  // a sky pointer with a sunflower tail
  cursor: (icon, P) => [
    P.tube('c2', [[11.5, 13], [15.5, 20.75]], 2.7, { part: 'A', stitch: false }),
    P.felt('c3', P.poly([[5, 2.5], [19.25, 12.5], [11.75, 13.75], [7.5, 20]], [1.3, 1.2, 0.6, 1.2]), { part: 'K', inset: 1.0, stitchMin: 1.3 }),
  ],
  // three stacked sky pillows with a cream top
  database: (icon, P) => {
    const layer = y => P.unite(P.ellipse(12, y, 7.75, 2.5), P.rect(4.25, y, 19.75, y + 4), P.ellipse(12, y + 4, 7.75, 2.5))
    return [
      P.felt('c3', layer(14.25), { part: 'K', stitch: false }),
      P.felt('c3', layer(9.5), { part: 'K', stitch: false }),
      P.felt('c3', layer(4.75), { part: 'K', stitch: false }),
      P.felt('tint', P.ellipse(12, 4.75, 7.75, 2.5), { part: 'A', stitch: false, out: 0.5 }),
      P.knot(16, 12, 0.7, 'c2', { part: 'K' }), P.knot(16, 16.75, 0.7, 'c2', { part: 'K' }),
    ]
  },
  // a sky disc with a sunflower label, a real hole, two shine arcs
  disc: (icon, P) => [
    P.felt('c3', P.cut(P.circle(12, 12, 9.25), P.circle(12, 12, 1.4)), { part: 'K', seam: [P.arcPts(12, 12, 8.3, 0, 360, 6)] }),
    P.felt('c2', P.ring(12, 12, 3.9, 1.4), { part: 'A', stitch: false, out: 0.5 }),
    P.thread(P.arcPts(12, 12, 6, 200, 250, 8), { w: 1.0, role: 'shine', op: 0.85, part: 'K' }),
    P.thread(P.arcPts(12, 12, 6, 20, 70, 8), { w: 1.0, role: 'shine', op: 0.55, part: 'K' }),
  ],
  // two twisted strands (tomato over sky) with cream rungs
  dna: (icon, P) => {
    const N = 28, A = [], B = []
    for (let i = 0; i <= N; i++) { const y = 2.75 + 18.5 * i / N, s = Math.cos(Math.PI * (y - 2.75) / 9.25); A.push([12 - 5 * s, y]); B.push([12 + 5 * s, y]) }
    return [
      ...[4.4, 10.2, 13.8, 19.6].map(y => P.tube('tint', [[8.75, y], [15.25, y]], 1.6, { part: 'A', stitch: false, out: 0.45 })),
      P.tube('c3', B, 2.6, { part: 'K', stitch: false }),
      P.tube('c1', A, 2.6, { part: 'K', stitch: false }),
    ]
  },
  // a sunflower pup with tomato floppy ears, a cream snout and an embroidered smile
  dog: (icon, P) => [
    P.felt('c2', P.unite(P.circle(12, 12, 7.5), P.ellipse(12, 15, 6.25, 5.5)), { part: 'K' }),
    P.felt('c1', P.rot(P.ellipse(4.75, 11.5, 2.6, 5.25), 18, 4.75, 11.5), { part: 'A', stitch: false }),
    P.felt('c1', P.rot(P.ellipse(19.25, 11.5, 2.6, 5.25), -18, 19.25, 11.5), { part: 'A', stitch: false }),
    P.felt('tint', P.ellipse(12, 16.25, 3.75, 2.9), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('ink', P.ellipse(12, 14.75, 1.35, 0.95), { part: 'K', stitch: false, line: false, hi: false, shade: false, pinch: false }),
    P.thread([[[12, 15.5], [12, 16.6]], [[10.4, 17], [11.2, 17.5], [12, 16.6], [12.8, 17.5], [13.6, 17]]], { w: 0.75, part: 'K' }),
    P.knot(9.25, 11.25, 0.85), P.knot(14.75, 11.25, 0.85),
  ],
  // a stuffed mint S with a sunflower bar threaded behind
  'dollar-sign': (icon, P) => [
    P.tube('c2', [[12, 2.5], [12, 21.5]], 2.3, { part: 'A', stitch: false, out: 0.5 }),
    P.tube('c4', P.linesOf('M16.5 7.5 C15.9 5.9 14.2 5 12 5 C9.2 5 7.5 6.4 7.5 8.4 C7.5 10.5 9.4 11.3 12 11.9 C14.6 12.5 16.5 13.3 16.5 15.6 C16.5 17.7 14.6 19 12 19 C9.6 19 7.9 18.1 7.5 16.5')[0], 3.1, { part: 'K' }),
  ],
  // a sunflower ring donut, bubblegum icing with a scalloped edge, thread sprinkles
  donut: (icon, P) => {
    const icing = P.cut(P.fillet(P.unite(P.circle(12, 12, 6.5), P.around(P.circle(12, 18.35, 1.45), 9)), 0.5), P.circle(12, 12, 3.9))
    const sp = (x, y, a, role) => [[x - 0.6 * Math.cos(a), y - 0.6 * Math.sin(a)], [x + 0.6 * Math.cos(a), y + 0.6 * Math.sin(a)]]
    return [
      P.felt('c2', P.cut(P.circle(12, 12, 9.25), P.circle(12, 12, 2.6)), { part: 'K', stitch: false }),
      P.felt('accent', icing, { part: 'K', stitch: false, out: 0.5, shade: false }),
      P.thread([sp(8, 9, 0.6), sp(15.5, 8, -0.4), sp(16.5, 14.5, 1.2)], { w: 0.85, role: 'c3', part: 'A' }),
      P.thread([sp(12, 7, 0.1), sp(7.5, 14.5, -0.9), sp(13, 17, 0.5)], { w: 0.85, role: 'tint', part: 'A' }),
      P.thread([sp(17.25, 11, -1.2), sp(10, 17, 1.4)], { w: 0.85, role: 'c4', part: 'A' }),
    ]
  },
  // a sky door frame round a cream doorway, the tomato door swung open, a sunflower knob
  'door-open': (icon, P) => [
    P.felt('c3', P.rr(4, 2.5, 15.5, 21.5, [2.5, 0, 0, 1]), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(6.5, 5, 15.5, 21.5, [1.2, 0, 0, 0]), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c1', P.poly([[13.5, 2.75], [20, 4.5], [20, 19.75], [13.5, 21.75]], [0.8, 1.2, 1.2, 0.8]), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
    P.knot(17.4, 12.25, 0.8, 'c2', { part: 'A' }),
  ],
  // a tomato arrow dropping into a sky tray
  download: (icon, P) => {
    const ar = P.arrow(12, 2.75, 12, 15.25, { len: 6, half: 5.5, w: 3.1, r: 1.2, role: 'c1', part: 'A' })
    return [P.felt('c3', P.rr(3, 13, 21, 21.25, [2, 2, 3, 3]), { part: 'K' }), P.moat(ar.F, 0.8), ar]
  },
  // six sewn-on sky buttons
  'drag-handle': (icon, P) => {
    const at = [8.75, 15.25].flatMap(x => [5.5, 12, 18.5].map(y => [x, y]))
    return [
      P.felt('c3', P.unite(at.map(([x, y]) => P.circle(x, y, 2.15))), { part: 'K', stitch: false, out: 0.5, hiOp: 0.5 }),
      P.flat('ink', P.unite(at.flatMap(([x, y]) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([u, v]) => P.circle(x + u * 0.58, y + v * 0.58, 0.3)))), { part: 'K', op: 0.85 }),
    ]
  },

  // ---- nature, objects -------------------------------------------------------------------
  // a sky raindrop pillow with an embroidered glint
  droplet: (icon, P) => [
    P.felt('c3', P.path('M12 2.25 C14.5 5.75 19.25 10 19.25 14.5 A7.25 7.25 0 0 1 4.75 14.5 C4.75 10 9.5 5.75 12 2.25 Z'), { part: 'K' }),
    P.thread(P.arcPts(12, 14.5, 4, 115, 165, 8), { w: 1.15, role: 'shine', op: 0.9, part: 'K' }),
  ],
  // tomato plates and caps on a sunflower bar
  dumbbell: (icon, P) => [
    P.tube('c2', [[2.75, 12], [21.25, 12]], 2.4, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.rr(1.5, 8.25, 4.5, 15.75, 1.4), { part: 'K', stitch: false, out: 0.55 }),
    P.felt('c1', P.rr(19.5, 8.25, 22.5, 15.75, 1.4), { part: 'K', stitch: false, out: 0.55 }),
    P.felt('c1', P.rr(5.5, 4.25, 10, 19.75, 2), { part: 'K', stitchMin: 1.2, inset: 0.8 }),
    P.felt('c1', P.rr(14, 4.25, 18.5, 19.75, 2), { part: 'K', stitchMin: 1.2, inset: 0.8 }),
  ],
  // a sky pad with a sunflower pencil (tomato eraser, cream tip) laid across it
  edit: (icon, P) => {
    const r = f => P.rot(f, 45, 14, 10.5)
    const tip = P.poly([[12.1, 14.5], [15.9, 14.5], [14, 18.75]], [0, 0, 0.6])
    const pencil = r(P.unite(P.rr(12.1, 2.25, 15.9, 14.75, [1.6, 1.6, 0, 0]), tip))
    return [
      P.felt('c3', P.rr(3, 5, 18.5, 20.75, 2.5), { part: 'A' }),
      P.moat(pencil, 0.8),
      P.felt('c2', pencil, { part: 'K', stitch: false }),
      P.felt('c1', r(P.rr(12.1, 2.25, 15.9, 5.5, [1.6, 1.6, 0, 0])), { part: 'K', stitch: false, line: false }),
      P.felt('tint', r(P.cut(tip, P.rect(0, 0, 24, 14.75))), { part: 'K', stitch: false, line: false, hi: false }),
      P.flat('ink', r(P.clip(tip, P.rect(0, 17.1, 24, 24))), { part: 'K', op: 0.9 }),
      P.thread([rp(14, 6.5), rp(14, 13.5)], { w: 0.7, role: 'shadow', op: 0.3, part: 'K' }),
      P.thread([rp(12.1, 5.5), rp(15.9, 5.5)], { w: 0.6, op: 0.8, part: 'K' }),
      P.thread([rp(12.1, 14.6), rp(15.9, 14.6)], { w: 0.6, op: 0.8, part: 'K' }),
    ]
  },
  // a cream Easter egg with a tomato band and bubblegum dots
  egg: (icon, P) => {
    const egg = P.path('M12 2.25 C16.4 2.25 19.25 8.75 19.25 13.75 C19.25 18.6 16.1 21.75 12 21.75 C7.9 21.75 4.75 18.6 4.75 13.75 C4.75 8.75 7.6 2.25 12 2.25 Z')
    return [
      P.felt('tint', egg, { part: 'K' }),
      P.felt('c1', P.clip(egg, P.path('M0 11.5 L4 10.75 L8 12 L12 10.75 L16 12 L20 10.75 L24 11.5 V15.75 L20 15 L16 16.25 L12 15 L8 16.25 L4 15 L0 15.75 Z')), { part: 'K', stitch: false, out: 0.45, hi: false }),
      P.knot(9.5, 7.75, 0.75, 'accent'), P.knot(14.25, 7, 0.75, 'c3'), P.knot(12, 18.75, 0.75, 'accent'), P.knot(8.25, 18, 0.6, 'c3'), P.knot(15.75, 18, 0.6, 'c3'),
    ]
  },
  // a bubblegum eraser in a sky sleeve, tilted
  eraser: (icon, P) => {
    const r = f => P.rot(f, -45, 12, 11.75)
    return [
      P.tube('c4', [[11.5, 21], [21.25, 21]], 1.8, { part: 'deco', stitch: false, out: 0.5 }),
      P.felt('accent', r(P.rr(4, 7.25, 20, 16.25, 1.6)), { part: 'K' }),
      P.felt('c3', r(P.rr(11.75, 7.25, 20, 16.25, [0, 1.6, 1.6, 0])), { part: 'A', stitch: false, line: false }),
      P.thread([rp(11.75, 7.6, -45, 12, 11.75), rp(11.75, 15.9, -45, 12, 11.75)], { w: 0.9, op: 0.75, part: 'K' }),
    ]
  },
  // a stuffed mint euro with two sunflower bars
  euro: (icon, P) => [
    P.tube('c2', [[2.6, 9.75], [12.75, 9.75]], 2.4, { part: 'A', stitch: 'seam', out: 0.5 }),
    P.tube('c2', [[2.6, 14.25], [12.75, 14.25]], 2.4, { part: 'A', stitch: 'seam', out: 0.5 }),
    P.tube('c4', P.arcPts(13.25, 12, 7, 45, 315), 3.1, { part: 'K' }),
  ],
  // a sky box with a tomato arrow springing out of its corner
  'external-link': (icon, P) => {
    const ar = P.arrow(9.5, 14.5, 20.75, 3.25, { len: 6.25, half: 5.25, w: 3, r: 1.2, role: 'c1', part: 'A' })
    return [P.felt('c3', P.rr(3.25, 5.5, 18.5, 20.75, 2.75), { part: 'K' }), P.moat(ar.F, 0.85), ar]
  },
  eye: (icon, P) => eyeParts(P),
  'eye-off': (icon, P) => [...eyeParts(P), ...P.slash({ from: [4, 4], to: [20, 20] })],
  // sunflower sawtooth works, a tomato chimney puffing a cream cloud, sky windows
  factory: (icon, P) => [
    P.felt('tint', P.unite(P.circle(17.75, 4, 1.9), P.circle(20.5, 3.25, 1.5)), { part: 'deco', stitch: false, out: 0.5, shade: false }),
    P.felt('c1', P.rr(16.25, 6, 20.75, 21, [1.2, 1.2, 1.8, 0]), { part: 'A', stitch: false }),
    P.felt('c2', P.poly([[3, 21], [3, 12], [8, 9], [8, 12], [13, 9], [13, 12], [17, 12], [17, 21]], [1.5, 1, 1, 0.5, 1, 0.5, 0.6, 0.6]), { part: 'K' }),
    P.felt('c3', P.rr(5.5, 15, 8.5, 18, 0.8), { part: 'K', stitch: false, out: 0.45 }),
    P.felt('c3', P.rr(10.75, 15, 13.75, 18, 0.8), { part: 'K', stitch: false, out: 0.45 }),
  ],
  'fast-forward': (icon, P) => [
    P.felt('c2', P.poly([[2.5, 5.5], [11.75, 12], [2.5, 18.5]], 1.4), { part: 'A' }),
    P.felt('c1', P.poly([[12, 5.5], [21.75, 12], [12, 18.5]], 1.4), { part: 'K' }),
  ],

  // ---- files (page('c3','tint') family) --------------------------------------------------
  // a sunflower zip pull hanging off an embroidered zip track
  'file-archive': (icon, P) => [
    ...page(P),
    P.thread([4.6, 6.5, 8.4, 10.3, 12.2].map((y, i) => i % 2 ? [[11.75, y], [13.6, y]] : [[9.9, y], [11.75, y]]), { w: 1.25, role: 'edge', op: 0.95, part: 'K' }),
    P.felt('c2', P.fillet(P.unite(P.poly([[9.9, 13.1], [13.6, 13.1], [12.9, 15.6], [10.6, 15.6]], 0.6), P.pill(10.75, 15, 12.75, 20.25)), 0.4), { part: 'A', stitch: false, out: 0.5 }),
  ],
  // a sunflower quaver sewn on
  'file-audio': (icon, P) => [
    ...page(P),
    P.felt('c2', P.fillet(P.unite(P.circle(10.25, 16.25, 2.4), P.seg(12, 16, 12, 9.25, 1.8), P.poly([[11.25, 8.75], [15.5, 11], [15.75, 14], [12, 12.25]], 0.8)), 0.6), { part: 'A', stitch: false, out: 0.5 }),
  ],
  'file-check': (icon, P) => [...page(P), P.textLines(8.25, [13, 11], [8.5, 11.5], { part: 'K' }), ...P.badge('check', 'c4', 17.25, 17.75, 4.25)],
  // two cream chevrons appliquéd
  'file-code': (icon, P) => [
    ...page(P),
    P.chevron(6.75, 14, 180, 3.6, { role: 'tint', w: 2, part: 'A', stitch: false, out: 0.45 }),
    P.chevron(17.25, 14, 0, 3.6, { role: 'tint', w: 2, part: 'A', stitch: false, out: 0.45 }),
    P.tube('c2', [[12.9, 11], [11.1, 17]], 1.6, { part: 'A', stitch: false, out: 0.45 }),
  ],
  'file-down': (icon, P) => [...page(P), P.textLines(8.25, [13, 11], [8.5, 11.5], { part: 'K' }), ...P.badge('down', 'c1', 17.25, 17.75, 4.25)],
  'file-up': (icon, P) => [...page(P), P.textLines(8.25, [13, 11], [8.5, 11.5], { part: 'K' }), ...P.badge('up', 'c4', 17.25, 17.75, 4.25)],
  'file-minus': (icon, P) => [...page(P), P.textLines(8.25, [13, 11], [8.5, 11.5], { part: 'K' }), ...P.badge('minus', 'c1', 17.25, 17.75, 4.25)],
  'file-plus': (icon, P) => [...page(P), P.textLines(8.25, [13, 11], [8.5, 11.5], { part: 'K' }), ...P.badge('plus', 'c4', 17.25, 17.75, 4.25)],
  'file-x': (icon, P) => [...page(P), P.textLines(8.25, [13, 11], [8.5, 11.5], { part: 'K' }), ...P.badge('x', 'c1', 17.25, 17.75, 4.25)],
  // a cream picture patch: mint hills, a sunflower sun
  'file-image': (icon, P) => {
    const pic = P.rr(7.25, 10, 16.75, 18.5, 1.2)
    return [
      ...page(P),
      P.felt('tint', pic, { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c4', P.clip(pic, P.poly([[6, 19], [6, 16.5], [10, 13], [12.5, 15.25], [14, 14], [18, 17.5], [18, 19]], [0, 0, 0.8, 0.5, 0.8, 0, 0])), { part: 'A', stitch: false, line: false, hi: false }),
      P.knot(14.25, 12.25, 1.05, 'c2', { part: 'A' }),
    ]
  },
  // a little sunflower padlock sewn on
  'file-lock': (icon, P) => [
    ...page(P),
    P.arcTube('c2', 12, 12.75, 2.4, 180, 360, 1.6, { part: 'A', stitch: false, out: 0.5 }),
    P.tube('c2', [[9.6, 12.75], [9.6, 14]], 1.6, { part: 'A', stitch: false, out: 0.5 }),
    P.tube('c2', [[14.4, 12.75], [14.4, 14]], 1.6, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c2', P.rr(8, 13.5, 16, 19, 1.5), { part: 'A', stitch: false, out: 0.5 }),
    P.flat('ink', P.unite(P.circle(12, 15.6, 0.7), P.pill(11.6, 15.6, 12.4, 17.4)), { part: 'A', op: 0.9 }),
  ],
  // a tomato label with an embroidered PDF
  'file-pdf': (icon, P) => [
    ...page(P),
    P.felt('c1', P.rr(6.75, 11, 17.25, 17.25, 1.3), { part: 'A', stitch: false, out: 0.5 }),
    P.thread([
      [[8.25, 16], [8.25, 12.25], [9.5, 12.25], [10.25, 12.8], [10.25, 13.6], [9.5, 14.15], [8.25, 14.15]],
      [[11.4, 12.25], [11.4, 16], [12.2, 16], [13.05, 15.3], [13.05, 12.95], [12.2, 12.25], [11.4, 12.25]],
      [[14.4, 16], [14.4, 12.25], [15.9, 12.25]], [[14.4, 14.1], [15.6, 14.1]],
    ], { w: 0.8, role: 'edge', part: 'A' }),
  ],
  // a sunflower magnifier over the sheet
  'file-search': (icon, P) => [
    ...page(P),
    P.tube('c2', [[13.25, 16.25], [16.25, 19.25]], 2.1, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('tint', P.circle(11, 14, 2.5), { part: 'A', stitch: false, out: 0.3, hi: false }),
    P.felt('c2', P.ring(11, 14, 3.9, 2.4), { part: 'A', stitch: false, out: 0.5 }),
  ],
  // a cream grid patch with a mint header row
  'file-spreadsheet': (icon, P) => {
    const g = P.rr(7.25, 10, 16.75, 18.75, 1.2)
    return [
      ...page(P),
      P.felt('tint', g, { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c4', P.clip(g, P.rect(0, 0, 24, 12.75)), { part: 'A', stitch: false, line: false, hi: false }),
      P.thread([[[7.5, 12.75], [16.5, 12.75]], [[7.5, 15.75], [16.5, 15.75]], [[10.4, 10.25], [10.4, 18.5]], [[13.6, 10.25], [13.6, 18.5]]], { w: 0.55, op: 0.75, part: 'A' }),
    ]
  },
  // embroidered lines with sunflower French-knot bullets
  'file-text': (icon, P) => [
    ...page(P),
    P.knot(8.4, 10.25, 0.7, 'c2'), P.knot(8.4, 13.75, 0.7, 'c2'), P.knot(8.4, 17.25, 0.7, 'c2'),
    P.textLines(10.5, [12.5, 15.75, 14], [10.25, 13.75, 17.25], { part: 'K' }),
  ],
  // a cream play triangle appliquéd
  'file-video': (icon, P) => [
    ...page(P),
    P.felt('tint', P.poly([[9.25, 10.5], [16, 14.5], [9.25, 18.5]], 1.1), { part: 'A', stitch: false, out: 0.5 }),
  ],
  // a tomato sheet behind a sky file
  files: (icon, P) => [
    P.felt('c1', P.rr(3.25, 2.5, 14.5, 17.75, 2.25), { part: 'A', stitch: false }),
    P.moat(P.rr(7.5, 6.25, 20.75, 21.5, 2.25), 0.5),
    ...P.page('c3', 'tint', 7.5, 6.25, 20.75, 21.5, 4.5),
    P.textLines(10.5, [17.75, 15.5], [14.75, 17.75], { part: 'K' }),
  ],
  // a tomato film strip with cream sprocket holes and a cream frame
  film: (icon, P) => [
    P.felt('c1', P.rr(2, 4, 22, 20, 2.5), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(5.5, 8.25, 18.5, 15.75, 1.2), { part: 'A', stitchMin: 1.2, inset: 0.7 }),
    ...[4.75, 9.5, 14.5, 19.25].flatMap(x => [P.flat('tint', P.rr(x - 1, 5.4, x + 1, 6.9, 0.45), { part: 'A', op: 0.95 }), P.flat('tint', P.rr(x - 1, 17.1, x + 1, 18.6, 0.45), { part: 'A', op: 0.95 })]),
  ],
  // a tomato funnel
  filter: (icon, P) => [
    P.felt('c1', P.poly([[3.25, 3.75], [20.75, 3.75], [14.25, 12.25], [14.25, 19.25], [9.75, 21], [9.75, 12.25]], [1.4, 1.4, 0.8, 0.8, 0.8, 0.8]), { part: 'K', inset: 1.0 }),
  ],

  // ---- fingerprint .. gem ------------------------------------------------------------------
  // a bubblegum thumb pad with the ridges embroidered in plum thread
  fingerprint: (icon, P) => {
    const k = 0.78, sc = d => P.linesOf(d).map(l => l.map(([x, y]) => [12 + (x - 12) * k, 12.6 + (y - 12) * k]))
    return [
      P.felt('accent', P.ellipse(12, 12.4, 8.25, 9.6), { part: 'K', stitch: false }),
      P.thread([...sc('M4 18 V11.5 A8 9 0 0 1 20 11.5 V14'), ...sc('M20 17.5 C19.5 18.75 19 19.75 18 20.5')], { w: 1.2, op: 0.85, part: 'K' }),
      P.thread([...sc('M9 21 C8.5 19.75 8 18.25 8 16.5 V11.5 A4 5 0 0 1 16 11.5 V16'), ...sc('M12 11 V15 C12 17.25 12.5 19 13.5 20.5')], { w: 1.2, op: 0.85, part: 'A' }),
    ]
  },
  // a sky fish with a tomato tail and fin, a knot eye with a glint
  fish: (icon, P) => [
    P.felt('c1', P.poly([[9, 12], [3.25, 7.75], [2, 9], [2, 15], [3.25, 16.25]], [0.6, 1, 0.8, 0.8, 1]), { part: 'A', stitch: false }),
    P.felt('c1', P.poly([[11.5, 8], [14, 4.25], [17.5, 6.75]], 0.9), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.path('M6.5 12 C8.75 8 12 6.25 15 6.25 C18.75 6.25 21.5 9 22 12 C21.5 15 18.75 17.75 15 17.75 C12 17.75 8.75 16 6.5 12 Z'), { part: 'K' }),
    P.thread(P.linesOf('M12.5 9.25 C13.4 11 13.4 13 12.5 14.75')[0], { w: 1.05, role: 'edge', op: 0.9, part: 'K' }),
    P.knot(17.5, 10.75, 0.95), P.knot(17.8, 10.45, 0.35, 'shine', { op: 0.95 }),
  ],
  // a tomato pennant on a sunflower pole with a pom-pom, a sunflower star appliqué
  flag: (icon, P) => [
    P.tube('c2', [[5, 21.5], [5, 3.5]], 2.2, { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c1', P.path('M5.5 3.75 C8 2.4 10.25 2.4 12.75 3.65 C15.25 4.9 17.75 4.9 20.5 3.6 V13.6 C17.75 14.9 15.25 14.9 12.75 13.65 C10.25 12.4 8 12.4 5.5 13.75 Z'), { part: 'A' }),
    P.felt('c2', P.poly(P.starPts(13, 8.5, 2.9, 1.45, 5), [0.5, 0.3]), { part: 'A', stitch: false, out: 0.45 }),
    P.felt('c1', P.circle(5, 2.9, 1.5), { part: 'K', stitch: false, out: 0.5 }),
  ],
  // a tomato flame with a sunflower heart of fire
  flame: (icon, P) => [
    P.felt('c1', P.path('M12 21.75 C8.1 21.75 4.75 18.9 4.75 15 C4.75 11.75 5.5 9.4 6.9 7.25 C7.9 8.5 9.1 9.25 10.25 9.25 C10 6.25 11.4 4 14 2.25 C17.4 5.4 19.25 10 19.25 15 C19.25 18.9 15.9 21.75 12 21.75 Z'), { part: 'K', stitchMin: 1.2 }),
    P.felt('c2', P.path('M12.25 19.25 A3.25 3.25 0 0 1 9 16 C9 13.75 11.25 12.6 12.9 11.25 C14.2 12.9 15.5 14.25 15.5 16 A3.25 3.25 0 0 1 12.25 19.25 Z'), { part: 'A', stitch: false, out: 0.5 }),
  ],
  // a cream glass flask, mint potion with bubbles, a tomato stopper
  'flask-conical': (icon, P) => {
    const glass = P.poly([[9.25, 4], [14.75, 4], [14.75, 9], [20.25, 18.25], [18.5, 21.25], [5.5, 21.25], [3.75, 18.25], [9.25, 9]], [0.4, 0.4, 0.9, 1.5, 1.2, 1.2, 1.5, 0.9])
    return [
      P.felt('tint', glass, { part: 'K', stitch: false }),
      P.felt('c4', P.clip(P.shrink(glass, 0.05), P.path('M0 14.5 C4 13.5 8 15.5 12 14.5 C16 13.5 20 15.5 24 14.5 V24 H0 Z')), { part: 'A', stitch: false, line: false }),
      P.felt('tint', P.circle(10.25, 18, 0.95), { part: 'A', stitch: false, out: 0.35, shade: false, hi: false }),
      P.felt('tint', P.circle(13.75, 16.75, 0.7), { part: 'A', stitch: false, out: 0.35, shade: false, hi: false }),
      P.thread([[10.6, 10.5], [10.6, 6.5]], { w: 1.0, role: 'shine', op: 0.9, part: 'K' }),
      P.felt('c1', P.pill(7.75, 2.25, 16.25, 5.25), { part: 'A', stitch: false, out: 0.55 }),
    ]
  },
  // five bubblegum petals round a sunflower button
  flower: (icon, P) => [
    P.felt('accent', P.fillet(P.around(P.circle(12, 6.9, 4.25), 5, 12, 12.25), 0.8), { part: 'K', inset: 1.05 }),
    ...P.button(12, 12.25, 3.25, 'c2', { part: 'A' }),
  ],
  'folder-minus': (icon, P) => folderBadge(P, 'minus', 'c3'),
  'folder-plus': (icon, P) => folderBadge(P, 'plus', 'c4'),
  // a folder with the exemplar magnifier (tomato ring, sky glass) on its pocket
  'folder-search': (icon, P) => [
    ...P.folder('c1', 'c2'),
    P.moat(P.unite(P.circle(12.5, 14.25, 4.4), P.seg(15.5, 17.25, 18.75, 20.5, 2.4)), 0.6),
    P.tube('c3', [[15.5, 17.25], [18.75, 20.5]], 2.4, { part: 'A', stitch: false, out: 0.5, hi: false }),
    P.felt('c3', P.circle(12.5, 14.25, 2.6), { part: 'A', stitch: false, pinch: false, out: 0.3, shade: false }),
    P.felt('c1', P.ring(12.5, 14.25, 4.2, 2.5), { part: 'A', stitch: false, out: 0.5 }),
  ],
  // the tomato back with its tab, the sunflower pocket swung forward
  'folder-open': (icon, P) => [
    P.felt('c1', P.unite(P.rr(2.75, 5.5, 19.25, 19.5, 2.25), P.rr(2.75, 4, 10.5, 9, 2)), { part: 'K', stitch: false }),
    P.felt('c2', P.poly([[7.25, 10.75], [22, 10.75], [19.25, 20.75], [2.75, 20.75]], [1.4, 1.4, 1.6, 1.6]), { part: 'A' }),
    ...P.button(13.5, 15.75, 1.35, 'c3', { part: 'A' }),
  ],
  // a cream ball with tomato pentagon patches joined by stitched seams
  football: (icon, P) => {
    const ball = P.circle(12, 12, 9.5)
    const pent = (cx, cy, r, rot) => P.poly(P.ngon(cx, cy, r, 5, rot), 0.6)
    const outer = [-90, -18, 54, 126, 198].map(a => P.pt(12, 12, 9.8, a))
    return [
      P.felt('tint', ball, { part: 'K', stitch: false }),
      P.thread(P.ngon(12, 12, 3.4, 5, -90).map((p, i) => [p, P.pt(12, 12, 7.1, -90 + i * 72)]), { w: 0.8, op: 0.75, part: 'K' }),
      P.felt('c1', P.clip(P.shrink(ball, 0.05), P.unite(outer.map(([x, y], i) => pent(x, y, 3.4, 90 + i * 72)))), { part: 'K', stitch: false, line: false, hi: false }),
      P.felt('c1', pent(12, 12, 3.6, -90), { part: 'A', stitch: false, out: 0.5 }),
    ]
  },
  // one stuffed tomato arrow rising out of a curve
  // the shaft (K) curving up, the head (A) sewn on over its end so it can nudge
  forward: (icon, P) => {
    const bend = [[4.25, 20], [4.25, 16.5], ...P.arcPts(11, 16.5, 6.75, 180, 270).slice(1), [16.25, 9.75]]
    return [P.tube('c1', bend, 3.2, { part: 'K' }), arrowHead(P, 15, 9.75, 21.25, 9.75)]
  },
  // a sunflower face with an embroidered frown
  frown: (icon, P) => [
    P.felt('c2', P.circle(12, 12, 9.25), { part: 'K' }),
    P.knot(8.75, 9.75, 1.0), P.knot(15.25, 9.75, 1.0),
    P.thread(Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [8.75 + 6.5 * t, 17 - 2 * Math.sin(Math.PI * t)] }), { w: 1.1, part: 'A' }),
  ],
  // a tomato pump with a cream window, a sky hose and a sunflower nozzle
  fuel: (icon, P) => [
    P.tube('c3', P.linesOf('M12 12 H15 A1.5 1.5 0 0 1 16.5 13.5 V17.5 A2 2 0 0 0 20.5 17.5 V8.5')[0], 2, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c2', P.rr(19, 5, 22, 9.5, 1.1), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.rr(3.5, 3, 13, 20, [2.25, 2.25, 0, 0]), { part: 'K' }),
    P.felt('tint', P.rr(5.75, 5.5, 10.75, 10.25, 1.1), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c3', P.pill(2.25, 18.75, 14.25, 21.75), { part: 'K', stitch: false, out: 0.55 }),
  ],
  // a sky photo card between two sunflower peeks
  'gallery-horizontal': (icon, P) => {
    const pic = P.rr(8.75, 6.25, 15.25, 17.75, 1)
    return [
      P.felt('c2', P.rr(1.75, 6.75, 5.25, 17.25, 1.5), { part: 'A', stitch: false }),
      P.felt('c2', P.rr(18.75, 6.75, 22.25, 17.25, 1.5), { part: 'A', stitch: false }),
      P.felt('c3', P.rr(6.75, 3.75, 17.25, 20.25, 2.25), { part: 'K', stitch: false }),
      P.felt('tint', pic, { part: 'K', stitch: false, out: 0.5 }),
      P.felt('c4', P.clip(pic, P.poly([[8, 19], [8, 15.5], [11, 12.5], [13, 14.5], [14, 13.5], [16, 15.5], [16, 19]], [0, 0, 0.8, 0.4, 0.6, 0, 0])), { part: 'K', stitch: false, line: false, hi: false }),
      P.knot(13.25, 9.25, 1.0, 'c2'),
    ]
  },
  // a sky controller, a sunflower cross pad, tomato and mint buttons
  gamepad: (icon, P) => [
    P.felt('c3', P.path('M8 5.25 H16 C19.4 5.25 21 7.6 21.75 11 C22.25 13.4 22.75 19.75 19.5 19.75 C17.6 19.75 17 16.25 15 16.25 H9 C7 16.25 6.4 19.75 4.5 19.75 C1.25 19.75 1.75 13.4 2.25 11 C3 7.6 4.6 5.25 8 5.25 Z'), { part: 'K' }),
    P.felt('c2', P.fillet(P.unite(P.rr(5.4, 10.25, 9.6, 12.75, 0.6), P.rr(6.25, 9.4, 8.75, 13.6, 0.6)), 0.35), { part: 'A', stitch: false, out: 0.45 }),
    P.felt('c1', P.circle(17.75, 10.25, 1.3), { part: 'A', stitch: false, out: 0.45 }),
    P.felt('c4', P.circle(15.25, 12.9, 1.3), { part: 'A', stitch: false, out: 0.45 }),
  ],
  // a sky dial, a cream face with three felt zones, a tomato needle on a sunflower hub
  gauge: (icon, P) => {
    const face = P.clip(P.circle(12, 13, 6.75), P.rect(0, 0, 24, 18.75))
    const zone = (a0, a1) => P.clip(P.ring(12, 13, 6.75, 4.6), P.sector(12, 13, 9, a0, a1))
    return [
      P.felt('c3', P.round(P.clip(P.circle(12, 13, 9.5), P.rect(0, 0, 24, 20.75)), 1.4), { part: 'K', stitch: false }),
      P.felt('tint', face, { part: 'K', stitch: false, out: 0.5 }),
      P.felt('c4', zone(150, 225), { part: 'K', stitch: false, line: false, hi: false }),
      P.felt('c2', zone(225, 315), { part: 'K', stitch: false, line: false, hi: false }),
      P.felt('c1', zone(315, 390), { part: 'K', stitch: false, line: false, hi: false }),
      P.tube('c1', [[12, 13], [15.75, 9.25]], 1.9, { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c2', P.circle(12, 13, 1.75), { part: 'A', stitch: false, out: 0.5 }),
    ]
  },
  // a sky gem with embroidered facets and a glint
  gem: (icon, P) => [
    P.felt('c3', P.poly([[6.75, 3.5], [17.25, 3.5], [21.75, 9], [12, 21.25], [2.25, 9]], [1.1, 1.1, 1.1, 1.3, 1.1]), { part: 'K', stitch: false }),
    P.felt('tint', P.poly([[7.6, 4.6], [10, 4.6], [8.9, 8.4], [4.1, 8.4]], 0.5), { part: 'K', stitch: false, line: false, hi: false, shade: false, pinch: false }),
    P.thread([[[3.5, 9], [20.5, 9]], [[10, 3.75], [8.75, 9], [12, 20]], [[14, 3.75], [15.25, 9], [12, 20]]], { w: 0.95, role: 'edge', op: 0.9, part: 'A' }),
  ],
}

// a cream eye with a sky iris, a plum pupil and a glint
function eyeParts(P) {
  return [
    P.felt('tint', P.path('M2 12 C4.25 7.25 8 4.75 12 4.75 C16 4.75 19.75 7.25 22 12 C19.75 16.75 16 19.25 12 19.25 C8 19.25 4.25 16.75 2 12 Z'), { part: 'K' }),
    P.felt('c3', P.circle(12, 12, 4), { part: 'A', stitch: false, out: 0.5 }),
    P.flat('ink', P.circle(12, 12, 1.75), { part: 'A' }),
    P.knot(13.2, 10.8, 0.75, 'shine', { part: 'A', op: 0.95 }),
  ]
}

// a stuffed corner arrow: down from the top, round the bend, head out to the side
function cornerArrow(P, right) {
  const fx = pts => right ? pts.map(([x, y]) => [24 - x, y]) : pts
  const bend = fx([[19, 3.75], [19, 11.25], ...P.arcPts(15.25, 11.25, 3.75, 0, 90).slice(1), [8.75, 15]])
  const [h0, h1] = fx([[10, 15], [3.75, 15]])
  return [P.tube('c1', bend, 3.2, { part: 'K' }), arrowHead(P, h0[0], h0[1], h1[0], h1[1])]
}

// a stuffed arrowhead alone (the A part): base at (x0, y0), tip at (x1, y1), sewn over the shaft end
function arrowHead(P, x0, y0, x1, y1) {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, half = 5.5
  const bx = x1 - ux * 6.25, by = y1 - uy * 6.25
  const head = P.poly([[x1, y1], [bx - uy * half, by + ux * half], [bx + ux * 1.1, by + uy * 1.1], [bx + uy * half, by - ux * half]], [1.3, 0.8, 0.7, 0.8])
  return P.felt('c1', head, { part: 'A', stitch: false })
}

// a point rotated like P.rot(f, deg, cx, cy) rotates its field (positive = clockwise on screen)
function rp(x, y, deg = 45, cx = 14, cy = 10.5) {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), dx = x - cx, dy = y - cy
  return [cx + dx * c - dy * s, cy + dx * s + dy * c]
}
