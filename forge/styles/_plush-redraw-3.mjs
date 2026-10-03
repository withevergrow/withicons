// PLUSH redraws, chunk 3: hand-composed stuffed-toy icons (see forge/styles/PLUSH-GUIDE.md).
// Each entry: name -> (icon, P) => pieces, built with the frozen kit (P = prim + kit + P.auto()).
// The art director's exemplars (EXEMPLAR in _plush-render.mjs) win over any entry here.
//
// Chunk 3 = icons 201-300 (gift .. notebook). Families kept as one set of toys:
//   git-*        sky yarn tubes with big sewn-on buttons for the nodes
//   *-circle     a felt disc with a fat cream glyph tube (info sky, help mint, minus tomato)
//   faces        a sunflower smiley cushion (laugh, meh)
//   hands        a bubblegum mitten with a sky cuff (hand-coins, hand-heart, handshake)
//   pictures     a tomato frame, sky sky, mint hills, sunflower sun (image, image-plus, images)
//   lists        sky bar tubes; markers in toy colours
//   messages     sky round bubbles, tomato square bubbles

// ---------------------------------------------------------------------------
// local helpers

const NS = { stitch: false, out: 0.5 }

// the cupped bubblegum mitten: a palm panel curling up into the fingertips, a raised thumb
// lobe on the left (its own panel, so the piping shows where it meets the palm), a sky cuff.
// Returns { back, front } so a load (coins) can sit in the palm between them.
function hand(P, o = {}) {
  const role = o.role || 'accent'
  const palm = P.fillet(P.unite(
    P.rr(4.25, 15.5, 15.5, 21.5, [1.2, 2.6, 2.6, 1.2]),
    P.seg(13.5, 19, 19.9, 13.6, 3.6),
  ), 1.3)
  return {
    back: [
      P.felt(role, palm, { part: 'K', stitch: false }),
      P.thread([[[15.6, 17.4], [17, 18.9]], [[17.7, 15.5], [19, 16.9]]], { w: 0.75, op: 0.55, part: 'K' }),
    ],
    front: [
      P.felt(role, P.fillet(P.unite(P.circle(7.6, 14.9, 2.35), P.seg(7.4, 16.6, 9.6, 12.4, 3.2)), 0.6), { part: 'K', stitch: false, out: 0.55 }),
      P.felt('c3', P.rr(1.5, 14, 4.75, 22.25, 1.2), { part: 'K', stitch: false, out: 0.55 }),
    ],
  }
}

// a git node: a big sewn-on button
// (no moulded rim: three of them push the icon past the size target)
const node = (P, x, y, role, r = 3.1, part = 'K') => P.button(x, y, r, role, { part }).filter(p => !(p.kind === 'flat' && p.role === 'shadow'))

// a felt disc with a fat cream glyph tube
function discGlyph(P, role, glyph) {
  return [P.felt(role, P.circle(12, 12, 9.4), { part: 'K' }), ...glyph]
}

// the framed picture: tomato frame, sky inner, mint hills, sunflower sun
function picture(P, x0, y0, x1, y1, o = {}) {
  const frame = P.rr(x0, y0, x1, y1, 2.25)
  const inner = P.rr(x0 + 2.1, y0 + 2.1, x1 - 2.1, y1 - 2.1, 1)
  const w = x1 - x0, h = y1 - y0
  const hills = P.clip(P.unite(
    P.circle(x0 + w * 0.3, y1 - 0.6, h * 0.42),
    P.circle(x0 + w * 0.72, y1 + 0.8, h * 0.4),
  ), inner)
  const sunR = Math.max(1.35, Math.min(w, h) * 0.12)
  return [
    P.felt(o.frame || 'c1', frame, { part: 'K' }),
    P.felt('c3', inner, { part: 'K', stitch: false, line: true, out: 0.45, pinch: false }),
    P.felt('c4', hills, { part: 'A', stitch: false, out: 0.45 }),
    P.felt('c2', P.circle(x0 + w * 0.7, y0 + h * 0.36, sunR), { part: 'A', stitch: false, out: 0.45, shade: false }),
  ]
}

// a speech bubble with a tail (round = circle family, else square family)
function bubbleRound(P) {
  return P.fillet(P.unite(P.circle(12.4, 11.4, 8.9), P.poly([[2.6, 21.3], [4.9, 13.6], [10.4, 18.9]], [0.9, 0.4, 0.4])), 1.2)
}
function bubbleSquare(P) {
  return P.fillet(P.unite(P.rr(2.75, 3.25, 21.25, 17.5, 2.6), P.poly([[3, 21.25], [3, 14], [9.5, 16.5]], [1, 0.3, 0.3])), 1)
}

// rounded loop points (a chain link), centred, rotated deg
function loopPts(P, cx, cy, hl, hw, deg) {
  const pts = P.roundPts([[-hl, -hw], [hl, -hw], [hl, hw], [-hl, hw]], hw * 0.98)
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
  return pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c])
}

// a smiley cushion
const face = (P, role = 'c2') => P.felt(role, P.circle(12, 12, 9.4), { part: 'K' })

export const R = {
  // ---- 201-220 ------------------------------------------------------------
  // a tomato box and lid, a sunflower ribbon band, a sunflower bow sewn with a tomato button
  gift: (icon, P) => [
    P.felt('c1', P.rr(4.5, 11.25, 19.5, 21, [0, 0, 2.5, 2.5]), { part: 'K' }),
    P.felt('c1', P.rr(2.75, 7.75, 21.25, 12.5, 2), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    P.felt('c2', P.unite(P.rr(10.4, 7.75, 13.6, 21, 0.5)), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c2', P.fillet(P.unite(
      P.rot(P.ellipse(8.75, 5.4, 3.3, 2.05), 22, 8.75, 5.4),
      P.rot(P.ellipse(15.25, 5.4, 3.3, 2.05), -22, 15.25, 5.4),
    ), 0.6), { part: 'A', stitch: false }),
    ...P.button(12, 6.9, 1.45, 'c1', { part: 'A' }),
  ],
  'git-branch': (icon, P) => [
    P.felt('c3', P.unite(P.seg(6.5, 6, 6.5, 18, 2.5), P.stroke('M17.5 6 V10 A8 8 0 0 1 9.5 18 H6.5', 2.5)), { part: 'K', stitch: false }),
    ...node(P, 6.5, 6, 'c1'),
    ...node(P, 6.5, 18, 'c2'),
    ...node(P, 17.5, 6, 'c4', 3.1, 'A'),
  ],
  'git-commit': (icon, P) => [
    P.tube('c3', [[2.25, 12], [21.75, 12]], 2.6, { part: 'K' }),
    ...node(P, 12, 12, 'c1', 4.25),
  ],
  'git-merge': (icon, P) => [
    P.felt('c3', P.unite(P.seg(6.5, 6, 6.5, 18, 2.5), P.stroke('M6.5 6 C7.75 10.5 11 12 17.5 12', 2.5)), { part: 'K', stitch: false }),
    ...node(P, 6.5, 6, 'c1'),
    ...node(P, 6.5, 18, 'c2'),
    ...node(P, 17.5, 12, 'c4', 3.1, 'A'),
  ],
  'git-pull-request': (icon, P) => [
    P.felt('c3', P.unite(
      P.seg(5, 6, 5, 18, 2.5),
      P.stroke('M12 6 H17 A2 2 0 0 1 19 8 V18', 2.5),
      P.bar([[14.75, 3.25], [11.75, 6], [14.75, 8.75]], 2.5),
    ), { part: 'K', stitch: false, pinch: false }),
    ...node(P, 5, 6, 'c1', 2.9),
    ...node(P, 5, 18, 'c2', 2.9),
    ...node(P, 19, 18, 'c4', 2.9, 'A'),
  ],
  // a sky felt ball with mint continent patches and two embroidered meridians
  globe: (icon, P) => {
    const ball = P.circle(12, 12, 9.4)
    const land = P.clip(P.puff(P.unite(
      P.ellipse(8, 8, 3.6, 2.6), P.ellipse(7.6, 11.5, 2, 3.1),
      P.ellipse(16.2, 14.6, 3.1, 3.4), P.ellipse(15.4, 6, 2.2, 1.5),
    ), 0.6), P.shrink(ball, 0.9))
    return [
      P.felt('c3', ball, { part: 'K' }),
      P.felt('c4', land, { part: 'A', stitch: false, out: 0.45, shade: false }),
      P.thread(P.linesOf('M12 2.9 C9.6 5.5 8.5 8.6 8.5 12 C8.5 15.4 9.6 18.5 12 21.1 C14.4 18.5 15.5 15.4 15.5 12 C15.5 8.6 14.4 5.5 12 2.9'), { w: 0.75, role: 'edge', op: 0.75, part: 'A' }),
      P.thread([[[2.9, 12], [21.1, 12]]], { w: 0.75, role: 'edge', op: 0.75, part: 'A' }),
    ]
  },
  // a tomato skull cap under a sky mortarboard, a sunflower tassel with a pompom
  'graduation-cap': (icon, P) => [
    P.felt('c1', P.rr(6.75, 9.5, 17.25, 18.75, [0, 0, 5, 5]), { part: 'K' }),
    P.felt('c3', P.poly([[12, 3.75], [21.75, 9], [12, 14.25], [2.25, 9]], [1.6, 1.4, 1.6, 1.4]), { part: 'K' }),
    P.tube('c2', [[12, 9], [20.25, 9.75], [20.25, 14.5]], 1.4, { part: 'A', stitch: false, out: 0.45 }),
    P.felt('c2', P.circle(20.25, 15.9, 1.75), { part: 'A', stitch: false, out: 0.5 }),
    ...P.button(12, 9, 1.35, 'c2', { part: 'K' }),
  ],
  // a sunflower handle tube under a tomato head with a soft claw
  // a tomato head turned square to a sunflower handle, a sky striking face, a notched claw
  hammer: (icon, P) => {
    const t = f => P.move(P.rot(f, 45, 12, 12), 2.5, -2)
    const head = P.cut(P.rr(6.5, 9.4, 18.5, 14.6, [1.4, 2.6, 2.6, 1.4]), P.poly([[19.5, 10.6], [16.6, 12], [19.5, 13.4]], 0.5))
    return [
      P.tube('c2', [[4.75, 19.75], [14.5, 10]], 3.3, { part: 'A' }),
      P.felt('c1', t(head), { part: 'K' }),
      P.felt('c3', t(P.rr(4.6, 8.75, 7.9, 15.25, 1.3)), { part: 'K', stitch: false, out: 0.55 }),
    ]
  },
  // the cupped mitten holding a sunflower coin stack in its palm
  'hand-coins': (icon, P) => {
    const h = hand(P)
    return [
      ...h.back,
      P.felt('c2', P.unite(P.ellipse(13.75, 13.6, 4.8, 2.2), P.rr(8.95, 8.6, 18.55, 13.6, 0)), { part: 'A', stitch: false }),
      P.thread([[[9.1, 11.1], [18.4, 11.1]]], { w: 0.65, op: 0.5, part: 'A' }),
      P.felt('c2', P.ellipse(13.75, 8.6, 4.8, 2.2), { part: 'A', stitch: false }),
      P.felt('c1', P.ellipse(13.75, 8.6, 2, 0.9), { part: 'A', line: false, stitch: false, shade: false, hi: false, pinch: false }),
      ...h.front,
    ]
  },
  // the same cupped mitten offering a tomato heart that floats above it
  'hand-heart': (icon, P) => {
    const h = hand(P)
    return [...h.back, ...h.front, P.felt('c1', P.heart(13.5, 8, 0.55), { part: 'A', stitch: false })]
  },
  // two mittens clasped: a sunflower hand from the left cuff underneath, a bubblegum hand from
  // the right cuff whose curled fingers wrap down over it, the sunflower thumb lying on top; sky cuffs
  handshake: (icon, P) => [
    P.felt('c2', P.rr(4, 11, 16.5, 17.75, [1, 3.2, 3.2, 1]), { part: 'K' }),
    P.felt('accent', P.fillet(P.unite(P.rr(10.5, 6.75, 20, 12.25, [2.6, 1, 1, 1.4]), P.rr(7.25, 8.5, 13, 16.25, [2.6, 1, 2.6, 2.6])), 0.8), { part: 'K', stitch: false }),
    P.thread([[[9.2, 12.4], [9.2, 15.4]], [[11.1, 12.4], [11.1, 15.4]]], { w: 0.75, op: 0.55, part: 'K' }),
    P.felt('c2', P.seg(12.75, 10.4, 17, 9.1, 2.9), { part: 'A', stitch: false, out: 0.55 }),
    P.felt('c3', P.rr(1.5, 9.75, 4.75, 19, 1.2), { part: 'K', stitch: false, out: 0.55 }),
    P.felt('c3', P.rr(19.25, 5.25, 22.5, 14.5, 1.2), { part: 'K', stitch: false, out: 0.55 }),
  ],
  // a sky drive case, a cream platter with a tomato hub, a tomato read arm
  'hard-drive': (icon, P) => [
    P.felt('c3', P.rr(4, 2.5, 20, 21.5, 2.75), { part: 'K' }),
    P.felt('tint', P.circle(12, 13.75, 5.25), { part: 'A', stitch: false }),
    P.thread(P.arcPts(12, 13.75, 3.5, 200, 290), { w: 0.6, op: 0.4, part: 'A' }),
    ...P.button(12, 13.75, 1.5, 'c1', { part: 'A' }),
    P.tube('c1', [[16.75, 5], [14.75, 10.25]], 1.9, { part: 'A', stitch: false, out: 0.5 }),
    P.knot(16.75, 5, 1.05, 'c1', { part: 'A' }),
  ],
  hash: (icon, P) => [
    P.tube('c3', [[10, 3.5], [8, 20.5]], 2.9, { part: 'K' }),
    P.tube('c3', [[16, 3.5], [14, 20.5]], 2.9, { part: 'K' }),
    P.tube('c1', [[3.75, 9], [20.25, 9]], 2.9, { part: 'A' }),
    P.tube('c1', [[3.75, 15], [20.25, 15]], 2.9, { part: 'A' }),
  ],
  heading: (icon, P) => [
    P.tube('c2', [[6, 12], [18, 12]], 3, { part: 'A' }),
    P.tube('c1', [[6, 3.75], [6, 20.25]], 3.4, { part: 'K' }),
    P.tube('c1', [[18, 3.75], [18, 20.25]], 3.4, { part: 'K' }),
  ],
  // a sky headband, tomato cups with bubblegum cushions
  headphones: (icon, P) => [
    P.tube('c3', [[4.5, 15], ...P.arcPts(12, 12, 7.5, 180, 360), [19.5, 15]], 2.6, { part: 'A', pinch: false }),
    P.felt('accent', P.unite(P.rr(7, 14.25, 9.75, 20.25, 1.2), P.rr(14.25, 14.25, 17, 20.25, 1.2)), { part: 'K', ...NS }),
    P.felt('c1', P.unite(P.rr(2.75, 13.25, 8, 21.25, [2.6, 1.4, 1.4, 2.6]), P.rr(16, 13.25, 21.25, 21.25, [1.4, 2.6, 2.6, 1.4])), { part: 'K', stitchMin: 1.2 }),
  ],
  headset: (icon, P) => [
    P.tube('c3', [[4.5, 13], ...P.arcPts(12, 11.5, 7.5, 180, 360), [19.5, 13]], 2.6, { part: 'A', pinch: false }),
    P.tube('c3', P.linesOf('M18.25 17.5 V18.5 A3 3 0 0 1 15.25 21.25 H13')[0], 1.8, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c2', P.pill(9.75, 19.6, 14.25, 22.4), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.unite(P.rr(2.75, 10.75, 8, 18.5, [2.6, 1.4, 1.4, 2.6]), P.rr(16, 10.75, 21.25, 18.5, [1.4, 2.6, 2.6, 1.4])), { part: 'K', stitchMin: 1.2 }),
  ],
  // the heart pillow torn in two, its halves tipped apart
  'heart-crack': (icon, P) => {
    const h = P.heart(12, 12.6, 1)
    const zig = [[12, 3], [12.2, 6.6], [10.2, 10.4], [13.6, 13.4], [11.2, 17], [12, 22]]
    const crack = P.bar(zig, 1.3)
    const L = P.clip(P.cut(h, crack), P.poly([[0, 0], ...zig, [0, 24]]))
    const Rr = P.clip(P.cut(h, crack), P.poly([[24, 0], ...zig, [24, 24]]))
    return [
      P.felt('c1', P.rot(L, -5, 12, 21), { part: 'K' }),
      P.felt('c1', P.rot(Rr, 5, 12, 21), { part: 'A' }),
    ]
  },
  // the heart pillow with an embroidered pulse in light thread
  'heart-pulse': (icon, P) => [
    P.felt('c1', P.heart(12, 12.6, 1), { part: 'K', stitch: false }),
    P.thread([[[4.25, 11.5], [7.6, 11.5], [9.1, 8.9], [12, 14.9], [13.75, 11.5], [19.75, 11.5]]], { w: 1.3, role: 'edge', part: 'A' }),
  ],
  'help-circle': (icon, P) => discGlyph(P, 'c4', [
    P.tube('tint', P.linesOf('M9.25 9.4 A2.75 2.75 0 1 1 13.6 11.6 C12.6 12.2 12 12.7 12 13.6 V14.1')[0], 2.5, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('tint', P.circle(12, 17.4, 1.5), { part: 'A', stitch: false, out: 0.5 }),
  ]),

  // ---- 221-240 ------------------------------------------------------------
  hexagon: (icon, P) => [
    P.felt('c3', P.poly(P.ngon(12, 12, 9.75, 6), 2.2), { part: 'K' }),
    ...P.button(12, 12, 1.6, 'c2', { part: 'K' }),
  ],
  // a sky highlighter with a tomato collar and sunflower nib, laying down a sunflower stripe
  highlighter: (icon, P) => {
    const t = f => P.move(P.rot(f, 45, 12, 12), 1.1, -1.3)
    return [
      P.felt('c2', P.pill(2.75, 19.25, 12.75, 22), { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c2', t(P.poly([[9.4, 15], [14.6, 15], [13.3, 20.4], [10.7, 20.4]], [0.5, 0.5, 0.9, 0.9])), { part: 'A', stitch: false }),
      P.felt('c3', t(P.rr(8.75, 2, 15.25, 13.5, [2.6, 2.6, 1, 1])), { part: 'K' }),
      P.felt('c1', t(P.rr(9, 12.75, 15, 15.75, 0.9)), { part: 'K', stitch: false, out: 0.5 }),
    ]
  },
  // a cream clock face inside a tomato tube that loops back with an arrowhead
  history: (icon, P) => [
    P.felt('c1', P.fillet(P.unite(
      P.stroke('M3.6 13 A8.5 8.5 0 1 0 6.2 6', 2.6),
      P.poly([[2.25, 3.75], [8.75, 9.75], [2.25, 9.75]], [0.9, 0.9, 0.9]),
    ), 0.6), { part: 'K', stitch: false }),
    P.felt('tint', P.circle(12, 12.5, 5.6), { part: 'K', stitch: false }),
    P.thread([[[12, 9.5], [12, 12.5], [14.4, 14]]], { w: 1.15, part: 'A' }),
    P.knot(12, 12.5, 0.85, 'c1', { part: 'A' }),
  ],
  // a cream tower with a tomato cross on sky wings, a sky door
  hospital: (icon, P) => [
    P.felt('c3', P.rr(2.5, 10.5, 21.5, 21, [2, 2, 1, 1]), { part: 'K' }),
    P.felt('tint', P.rr(6.75, 3, 17.25, 21, [2.25, 2.25, 0, 0]), { part: 'K' }),
    P.felt('c1', P.fillet(P.unite(P.rr(10.6, 5, 13.4, 12, 0.7), P.rr(8.5, 7.1, 15.5, 9.9, 0.7)), 0.4), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.rr(10, 15.5, 14, 21, [2, 2, 0, 0]), { part: 'A', stitch: false, out: 0.5 }),
    P.cross(4.75, 15, 0.75, { role: 'edge', w: 0.55, part: 'K' }),
    P.cross(19.25, 15, 0.75, { role: 'edge', w: 0.55, part: 'K' }),
  ],
  // the building family (sky tower, cream window grid) with a tomato H sign on the roof,
  // a tomato scalloped awning over a sunflower door
  hotel: (icon, P) => {
    const win = []
    for (const y of [9.75, 13.25]) for (const x of [8.25, 12, 15.75]) win.push(P.rr(x - 0.95, y - 0.95, x + 0.95, y + 0.95, 0.5))
    return [
      P.felt('c3', P.rr(4.25, 4.75, 19.75, 21.25, [2.25, 2.25, 0.75, 0.75]), { part: 'K' }),
      P.flat('tint', P.unite(win), { part: 'K', op: 0.95 }),
      P.felt('c2', P.rr(9.75, 17.25, 14.25, 21.25, [1.2, 1.2, 0, 0]), { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c1', P.fillet(P.unite(P.pill(8.25, 15.25, 15.75, 17.5), ...[9.5, 12, 14.5].map(x => P.circle(x, 17.4, 1.25))), 0.4), { part: 'A', stitch: false, out: 0.5, shade: false }),
      P.felt('c1', P.rr(8.25, 1.25, 15.75, 6.75, 1.5), { part: 'S', stitch: false, out: 0.55 }),
      P.thread([[[10.5, 2.6], [10.5, 5.4]], [[13.5, 2.6], [13.5, 5.4]], [[10.5, 4], [13.5, 4]]], { w: 1, role: 'edge', part: 'S' }),
    ]
  },
  // tomato caps, a cream glass, sunflower sand running down
  hourglass: (icon, P) => {
    const up = P.poly([[6.75, 3.5], [17.25, 3.5], [17.25, 6.75], [12.9, 12], [11.1, 12], [6.75, 6.75]], [0.6, 0.6, 3, 0.6, 0.6, 3])
    const glass = P.fillet(P.unite(up, P.flipY(up, 12)), 0.9)
    return [
      P.felt('tint', glass, { part: 'K', stitch: false }),
      P.felt('c2', P.poly([[9.2, 7.5], [14.8, 7.5], [12, 10.8]], 0.9), { part: 'A', ...NS, shade: false }),
      P.thread([[[12, 10.8], [12, 16]]], { w: 0.7, role: 'c2', part: 'A' }),
      P.felt('c2', P.poly([[7.6, 19.75], [16.4, 19.75], [12, 15.4]], [0.8, 0.8, 1.6]), { part: 'A', ...NS }),
      P.felt('c1', P.pill(4.5, 1.75, 19.5, 4.9), { part: 'K', stitch: false }),
      P.felt('c1', P.pill(4.5, 19.1, 19.5, 22.25), { part: 'K', stitch: false }),
    ]
  },
  // a sunflower waffle cone, a bubblegum scoop with a drippy edge, a tomato cherry
  'ice-cream': (icon, P) => {
    const cone = P.poly([[6.9, 12], [17.1, 12], [12, 22.1]], [1, 1, 1.6])
    return [
      P.felt('c2', cone, { part: 'A', stitch: false }),
      P.thread([[[9.6, 13.6], [13.4, 19]], [[13.4, 13.6], [15.4, 16.4]], [[14.4, 13.6], [10.6, 19]], [[10.6, 13.6], [8.6, 16.4]]], { w: 0.6, op: 0.5, part: 'A' }),
      P.felt('accent', P.fillet(P.unite(P.circle(12, 8.9, 5.8), P.circle(8, 11.9, 2), P.circle(12, 12.7, 2), P.circle(16, 11.9, 2)), 0.8), { part: 'K' }),
      P.felt('c1', P.circle(12, 3.1, 1.6), { part: 'K', stitch: false, out: 0.5 }),
      P.thread([[[8.6, 8.8], [9.6, 8.2]], [[14.2, 7.4], [15.2, 8]], [[11.5, 11], [12.6, 10.8]]], { w: 0.7, role: 'edge', part: 'K' }),
    ]
  },
  // a sky card, a cream photo patch with a little person, two embroidered lines
  'id-card': (icon, P) => [
    P.felt('c3', P.rr(2.25, 4, 21.75, 20, 2.5), { part: 'K' }),
    P.felt('tint', P.rr(4.75, 6.75, 11.25, 17.25, 1.3), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.round(P.clip(P.ellipse(8, 17.4, 3.1, 3.4), P.rect(0, 0, 24, 17.25)), 0.5), { part: 'A', stitch: false, out: 0.45, ground: false }),
    P.felt('c2', P.circle(8, 10.6, 2), { part: 'A', stitch: false, out: 0.45 }),
    P.textLines(14, [18.75, 16.5], [10, 14], { part: 'A' }),
  ],
  'image-plus': (icon, P) => [
    ...picture(P, 2, 4, 22, 20),
    ...P.badge('plus', 'c4', 17.5, 17.5, 4.4),
  ],
  image: (icon, P) => picture(P, 2, 4, 22, 20),
  // a sunflower card behind the framed picture
  images: (icon, P) => [
    P.felt('c2', P.rr(6.25, 3, 22, 16.75, 2.25), { part: 'K' }),
    ...picture(P, 2, 7.75, 18.25, 21.25),
  ],
  // a sky tray, a cream letter inside, a tomato front lip with a soft notch
  inbox: (icon, P) => [
    P.felt('c3', P.poly([[2.5, 13.5], [5.6, 4.75], [18.4, 4.75], [21.5, 13.5], [21.5, 15], [2.5, 15]], [0.6, 1.4, 1.4, 0.6, 0.4, 0.4]), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(7.25, 7.25, 16.75, 15, 1), { part: 'A', stitch: false, out: 0.45 }),
    P.thread([[[9.25, 9.75], [14.75, 9.75]]], { w: 0.85, op: 0.6, part: 'A' }),
    P.felt('c1', P.cut(P.rr(2.5, 12.25, 21.5, 20.25, [0.8, 0.8, 2.5, 2.5]), P.poly([[7, 10], [9, 15.25], [15, 15.25], [17, 10]], [0, 1.2, 1.2, 0])), { part: 'K' }),
  ],
  'indent-decrease': (icon, P) => [
    P.tube('c3', [[3, 4.5], [21, 4.5]], 2.5, { part: 'K' }),
    P.tube('c3', [[13, 9.5], [21, 9.5]], 2.5, { part: 'K' }),
    P.tube('c3', [[13, 14.5], [21, 14.5]], 2.5, { part: 'K' }),
    P.tube('c3', [[3, 19.5], [21, 19.5]], 2.5, { part: 'K' }),
    P.arrow(9.75, 12, 2.5, 12, { len: 4.4, half: 3.6, w: 2.4, r: 1, rb: 0.6, role: 'c1', part: 'A', stitch: false }),
  ],
  'indent-increase': (icon, P) => [
    P.tube('c3', [[3, 4.5], [21, 4.5]], 2.5, { part: 'K' }),
    P.tube('c3', [[13, 9.5], [21, 9.5]], 2.5, { part: 'K' }),
    P.tube('c3', [[13, 14.5], [21, 14.5]], 2.5, { part: 'K' }),
    P.tube('c3', [[3, 19.5], [21, 19.5]], 2.5, { part: 'K' }),
    P.arrow(2.5, 12, 9.75, 12, { len: 4.4, half: 3.6, w: 2.4, r: 1, rb: 0.6, role: 'c1', part: 'A', stitch: false }),
  ],
  'indian-rupee': (icon, P) => [
    P.felt('c4', P.unite(P.seg(6.25, 4.25, 17.75, 4.25, 2.8), P.stroke('M8.5 4.25 C12.8 4.25 14.5 6.2 14.5 8.6 C14.5 11.3 12.5 13 9.5 13 H6.6 L15.5 20.5', 2.8)), { part: 'K', seam: [P.linesOf('M6.25 4.25 H9.5 C12.8 4.25 14.5 6.2 14.5 8.6 C14.5 11.3 12.5 13 9.5 13 H6.6 L15.5 20.5')[0]] }),
    P.tube('c1', [[6.25, 8.6], [17.75, 8.6]], 2.4, { part: 'A', stitch: false }),
  ],
  'info-circle': (icon, P) => discGlyph(P, 'c3', [
    P.tube('tint', [[10.4, 11], [12, 11], [12, 16.6]], 2.5, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('tint', P.circle(12, 7.4, 1.55), { part: 'A', stitch: false, out: 0.5 }),
  ]),
  italic: (icon, P) => [
    P.tube('c3', [[15, 4.25], [9, 19.75]], 3.2, { part: 'K' }),
    P.tube('c1', [[11, 4], [19, 4]], 2.7, { part: 'A', stitch: false }),
    P.tube('c1', [[5, 20], [13, 20]], 2.7, { part: 'A', stitch: false }),
  ],
  // a sky board with three felt cards pinned in toy colours
  kanban: (icon, P) => [
    P.felt('c3', P.rr(2.75, 2.75, 21.25, 21.25, 2.75), { part: 'K' }),
    P.felt('c2', P.rr(5.6, 5.75, 9.4, 17.75, 1.2), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('accent', P.rr(10.1, 5.75, 13.9, 12.75, 1.2), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c4', P.rr(14.6, 5.75, 18.4, 15.25, 1.2), { part: 'A', stitch: false, out: 0.5 }),
  ],
  // a sunflower blade and teeth, a tomato bow with a hole to hang it by
  key: (icon, P) => [
    P.felt('c2', P.unite(P.seg(11, 13, 20.25, 3.75, 2.9), P.seg(18.4, 5.6, 20.9, 8.1, 2.5), P.seg(15.4, 8.6, 17.9, 11.1, 2.5)), { part: 'K', stitch: false }),
    P.felt('c1', P.cut(P.circle(8, 16, 5.25), P.circle(6.75, 17.25, 1.5)), { part: 'K' }),
  ],

  // ---- 241-260 ------------------------------------------------------------
  // a sky keyboard with cream key patches and a cream space bar
  keyboard: (icon, P) => {
    const keys = []
    for (const x of [5.6, 9.6, 13.6, 17.6]) keys.push(P.rr(x - 0.05, 7.6, x + 1.85, 9.4, 0.55))
    for (const x of [7.6, 11.6, 15.6]) keys.push(P.rr(x - 0.05, 11.1, x + 1.85, 12.9, 0.55))
    return [
      P.felt('c3', P.rr(2, 4.5, 22, 19.5, 2.75), { part: 'K' }),
      P.flat('tint', P.unite(keys), { part: 'A' }),
      P.felt('tint', P.pill(7.75, 14.6, 16.25, 16.9), { part: 'A', stitch: false, out: 0.45, shade: false }),
    ]
  },
  // a tomato shade, a sunflower stem, a sky base; a pull cord with a knot
  lamp: (icon, P) => [
    P.tube('c2', [[12, 11], [12, 19]], 2.3, { part: 'K', stitch: false }),
    P.thread([[[16.25, 11.5], [16.25, 15]]], { w: 0.6, part: 'A' }),
    P.knot(16.25, 15.4, 0.95, 'c2', { part: 'A' }),
    P.felt('c3', P.rr(6.5, 18, 17.5, 21.5, [3, 3, 1.2, 1.2]), { part: 'K', stitch: false }),
    P.felt('c1', P.poly([[8.4, 2.75], [15.6, 2.75], [19.9, 12.25], [4.1, 12.25]], [1.3, 1.3, 1.3, 1.3]), { part: 'K' }),
  ],
  // a tomato pediment, a sunflower beam, cream columns, a sky step
  landmark: (icon, P) => [
    P.felt('tint', P.unite([6, 10, 14, 18].map(x => P.rr(x - 1.25, 10.5, x + 1.25, 19.5, 0.6))), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.poly([[2.5, 9.5], [12, 2.75], [21.5, 9.5]], [1, 1.6, 1]), { part: 'K' }),
    P.felt('c2', P.pill(3.75, 9.25, 20.25, 11.75), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c3', P.rr(2.5, 18.75, 21.5, 21.75, 1.3), { part: 'K', stitch: false }),
  ],
  // two felt tiles: a tomato one with a stitched glyph, a sky one with a stitched A
  language: (icon, P) => [
    P.felt('c1', P.rr(2, 2.5, 13.25, 13.75, 2.6), { part: 'K', stitch: false }),
    P.thread(P.linesOf('M4.6 5.9 H10.6 M7.6 4.4 V5.9 M9.9 5.9 C9.4 9 7.7 10.6 4.9 11.3 M5.5 5.9 C6.2 8.7 7.9 10.3 10.3 11'), { w: 1.05, role: 'edge', part: 'K' }),
    P.felt('c3', P.rr(10.75, 10.25, 22, 21.5, 2.6), { part: 'A', stitch: false }),
    P.thread([[[13.75, 19.2], [16.4, 12.7], [19, 19.2]], [[14.75, 17], [18, 17]]], { w: 1.2, role: 'edge', part: 'A' }),
  ],
  // a sky lid with a cream screen, a sunflower base with a trackpad notch
  laptop: (icon, P) => [
    P.felt('c3', P.rr(4, 3.5, 20, 16, 2.25), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(6.1, 5.6, 17.9, 13.9, 1.1), { part: 'K', stitch: false, out: 0.45, shade: false }),
    P.thread(P.arcPts(12, 9.75, 2.6, 200, 250, 10), { w: 0.85, role: 'c3', op: 0.7, part: 'K' }),
    P.felt('c2', P.rr(1.75, 16.25, 22.25, 20.5, [1, 1, 2, 2]), { part: 'A' }),
  ],
  // a sunflower smiley cushion, laughing: squinting eyes, an open tomato mouth, bubblegum cheeks
  laugh: (icon, P) => [
    face(P),
    P.thread([P.arcPts(8.9, 10.1, 1.5, 200, 340, 20), P.arcPts(15.1, 10.1, 1.5, 200, 340, 20)], { w: 1.05, part: 'A' }),
    P.felt('c1', P.round(P.clip(P.circle(12, 13.2, 4.6), P.rect(0, 13.2, 24, 24)), 0.6), { part: 'A', stitch: false, out: 0.5, ground: false }),
    P.felt('accent', P.clip(P.circle(12, 18.6, 2.6), P.circle(12, 13.2, 4)), { part: 'A', line: false, stitch: false, shade: false, hi: false, pinch: false }),
    P.flat('accent', P.unite(P.ellipse(6.4, 13.5, 1.4, 0.95), P.ellipse(17.6, 13.5, 1.4, 0.95)), { part: 'A', op: 0.8 }),
  ],
  // three felt sheets stacked: sky, mint, sunflower on top
  layers: (icon, P) => {
    const sheet = y => P.poly([[12, y - 4.75], [21.5, y], [12, y + 4.75], [2.5, y]], [1.3, 1.6, 1.3, 1.6])
    return [
      P.felt('c3', sheet(16.25), { part: 'A', stitch: false }),
      P.felt('c4', sheet(11.75), { part: 'A', stitch: false }),
      P.felt('c2', sheet(7.25), { part: 'K' }),
    ]
  },
  'layout-dashboard': (icon, P) => [
    P.felt('c3', P.rr(3, 3, 10, 12.5, 2), { part: 'K', stitchMin: 1.2 }),
    P.felt('c2', P.rr(14, 3, 21, 7.5, 1.8), { part: 'K', stitch: false }),
    P.felt('c1', P.rr(14, 11.5, 21, 21, 2), { part: 'K', stitchMin: 1.2 }),
    P.felt('c4', P.rr(3, 16.5, 10, 21, 1.8), { part: 'K', stitch: false }),
  ],
  'layout-grid': (icon, P) => [
    P.felt('c1', P.rr(3, 3, 10.25, 10.25, 2), { part: 'K', stitchMin: 1.2 }),
    P.felt('c2', P.rr(13.75, 3, 21, 10.25, 2), { part: 'K', stitchMin: 1.2 }),
    P.felt('c4', P.rr(3, 13.75, 10.25, 21, 2), { part: 'K', stitchMin: 1.2 }),
    P.felt('c3', P.rr(13.75, 13.75, 21, 21, 2), { part: 'K', stitchMin: 1.2 }),
  ],
  'layout-list': (icon, P) => [
    P.felt('c1', P.rr(3, 3.25, 9.5, 9.75, 1.9), { part: 'K', stitchMin: 1.2 }),
    P.felt('c4', P.rr(3, 14.25, 9.5, 20.75, 1.9), { part: 'K', stitchMin: 1.2 }),
    P.tube('c3', [[13, 4.5], [21, 4.5]], 2.4, { part: 'A' }),
    P.tube('c3', [[13, 8.5], [17.5, 8.5]], 2.4, { part: 'A', stitch: false }),
    P.tube('c3', [[13, 15.5], [21, 15.5]], 2.4, { part: 'A' }),
    P.tube('c3', [[13, 19.5], [17.5, 19.5]], 2.4, { part: 'A', stitch: false }),
  ],
  'layout-template': (icon, P) => [
    P.felt('c3', P.rr(3, 3, 21, 8.75, 2), { part: 'K', stitchMin: 1.2 }),
    P.felt('c1', P.rr(3, 12.25, 10.25, 21, 2), { part: 'K', stitchMin: 1.2 }),
    P.tube('c4', [[14, 13.25], [21, 13.25]], 2.4, { part: 'A' }),
    P.tube('c4', [[14, 16.75], [21, 16.75]], 2.4, { part: 'A' }),
    P.tube('c4', [[14, 20.25], [18, 20.25]], 2.4, { part: 'A', stitch: false }),
  ],
  // a mint leaf with a stitched centre vein and two side veins, a mint stem
  leaf: (icon, P) => [
    P.tube('c4', [[2.75, 21.25], [8, 16]], 2.2, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c4', P.round(P.path('M5.25 18.75 C3.25 10.25 9.5 3 21 3 C21 14.5 13.75 20.75 5.25 18.75 Z'), 0.6), { part: 'K', stitch: false }),
    P.thread([[[7.5, 16.5], [16.75, 7.25]], [[10.6, 13.4], [10.4, 9.4]], [[13.6, 10.4], [17.6, 10.6]]], { w: 1, role: 'edge', op: 0.9, part: 'K' }),
  ],
  // two upright books and one leaning, on a mint shelf
  library: (icon, P) => [
    P.felt('c1', P.rr(3.25, 3.25, 8.25, 20, 1.3), { part: 'K', stitch: false }),
    P.felt('c3', P.rr(8.75, 6.25, 12.75, 20, 1.3), { part: 'K', stitch: false }),
    P.felt('c2', P.rot(P.rr(14, 7.25, 18, 20.25, 1.3), -15, 16, 20.25), { part: 'A', stitch: false }),
    P.thread([[[4.6, 6.4], [6.9, 6.4]], [[4.6, 16.6], [6.9, 16.6]], [[10, 9.2], [11.5, 9.2]], [[10, 16.6], [11.5, 16.6]]], { w: 0.85, role: 'edge', part: 'K' }),
    P.felt('c4', P.pill(2, 19.4, 22, 22.1), { part: 'K', stitch: false, out: 0.5 }),
  ],
  // a sunflower bulb glowing, an embroidered filament, a sky screw base with thread ribs
  lightbulb: (icon, P) => [
    P.felt('c3', P.rr(8.6, 14.75, 15.4, 21.5, [0.6, 0.6, 2.6, 2.6]), { part: 'K', stitch: false }),
    P.thread([[[9.6, 17.5], [14.4, 17.5]], [[9.8, 19.6], [14.2, 19.6]]], { w: 0.8, role: 'edge', op: 0.85, part: 'K' }),
    P.felt('c2', P.fillet(P.unite(P.circle(12, 9, 6.9), P.poly([[8.3, 12], [15.7, 12], [15.1, 15.75], [8.9, 15.75]], 0.8)), 1.1), { part: 'K' }),
    P.thread([[[12, 15.5], [12, 12.4]], [[9.9, 10.3], [12, 12.4], [14.1, 10.3]]], { w: 0.95, op: 0.85, part: 'A' }),
  ],
  // two chain links: a sky one under a tomato one
  link: (icon, P) => {
    const a = loopPts(P, 8.6, 15.4, 4.9, 2.6, -45), b = loopPts(P, 15.4, 8.6, 4.9, 2.6, -45)
    return [
      P.tube('c3', a, 2.3, { closed: true, part: 'K', stitch: false }),
      P.tube('c1', b, 2.3, { closed: true, part: 'A', stitch: false }),
    ]
  },
  'list-checks': (icon, P) => [
    P.tube('c3', [[12, 6], [21, 6]], 2.4, { part: 'K' }),
    P.tube('c3', [[12, 12], [21, 12]], 2.4, { part: 'K' }),
    P.tube('c3', [[12, 18], [21, 18]], 2.4, { part: 'K' }),
    P.tube('c4', [[2.5, 6], [4.6, 8.1], [8.4, 3.9]], 2.3, { part: 'A', stitch: false }),
    P.tube('c4', [[2.5, 18], [4.6, 20.1], [8.4, 15.9]], 2.3, { part: 'A', stitch: false }),
  ],
  'list-filter': (icon, P) => [
    P.tube('c1', [[3, 6], [21, 6]], 3, { part: 'K' }),
    P.tube('c2', [[6.5, 12], [17.5, 12]], 3, { part: 'K' }),
    P.tube('c3', [[9.5, 18], [14.5, 18]], 3, { part: 'K' }),
  ],
  'list-music': (icon, P) => [
    P.tube('c3', [[3, 6], [12.75, 6]], 2.4, { part: 'K' }),
    P.tube('c3', [[3, 12], [12.25, 12]], 2.4, { part: 'K' }),
    P.tube('c3', [[3, 18], [8.75, 18]], 2.4, { part: 'K', stitch: false }),
    P.felt('c4', P.fillet(P.unite(P.seg(17.75, 4, 17.75, 17, 2.2), P.poly([[17, 3], [21.5, 5.5], [21.75, 9.75], [17.5, 7.75]], 1.2)), 0.7), { part: 'A', stitch: false }),
    P.felt('c1', P.rot(P.ellipse(15, 17.6, 3.3, 2.65), -20, 15, 17.6), { part: 'A', stitch: false }),
  ],
  'list-ordered': (icon, P) => [
    P.tube('c3', [[12, 6], [21, 6]], 2.4, { part: 'K' }),
    P.tube('c3', [[12, 12], [21, 12]], 2.4, { part: 'K' }),
    P.tube('c3', [[12, 18], [21, 18]], 2.4, { part: 'K' }),
    P.felt('c1', P.stroke('M3.5 4.6 L5.5 3.1 V9 M3.25 9.1 H7.75', 1.9), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c2', P.stroke('M3.5 16.3 C3.75 15.3 4.5 14.8 5.5 14.8 C6.75 14.8 7.5 15.6 7.5 16.8 C7.5 17.6 7.1 17.9 6.5 18.4 L3.5 20.9 H7.75', 1.9), { part: 'A', stitch: false, out: 0.5 }),
  ],
  'list-plus': (icon, P) => [
    P.tube('c3', [[3, 6], [21, 6]], 2.4, { part: 'K' }),
    P.tube('c3', [[3, 12], [15, 12]], 2.4, { part: 'K' }),
    P.tube('c3', [[3, 18], [11, 18]], 2.4, { part: 'K' }),
    P.felt('c4', P.unite(P.seg(18, 14.6, 18, 21.4, 2.6), P.seg(14.6, 18, 21.4, 18, 2.6)), { part: 'S', stitch: false }),
  ],

  // ---- 261-280 ------------------------------------------------------------
  // sky bar tubes with toy-colour bead bullets
  list: (icon, P) => [
    P.tube('c3', [[9, 6], [21, 6]], 2.4, { part: 'K' }),
    P.tube('c3', [[9, 12], [21, 12]], 2.4, { part: 'K' }),
    P.tube('c3', [[9, 18], [21, 18]], 2.4, { part: 'K' }),
    P.felt('c1', P.circle(4.25, 6, 1.7), { part: 'A', ...NS }),
    P.felt('c2', P.circle(4.25, 12, 1.7), { part: 'A', ...NS }),
    P.felt('c4', P.circle(4.25, 18, 1.7), { part: 'A', ...NS }),
  ],
  // eight stuffed spokes in toy colours
  loader: (icon, P) => {
    const sp = deg => { const a = P.pt(12, 12, 5.6, deg), b = P.pt(12, 12, 8.9, deg); return P.seg(a[0], a[1], b[0], b[1], 2.7) }
    return [
      P.felt('c1', P.unite(sp(-90), sp(90)), { part: 'K', stitch: false }),
      P.felt('c4', P.unite(sp(0), sp(180)), { part: 'K', stitch: false }),
      P.felt('c2', P.unite(sp(-45), sp(135)), { part: 'A', stitch: false }),
      P.felt('c3', P.unite(sp(45), sp(-135)), { part: 'A', stitch: false }),
    ]
  },
  // a sky door-frame tube, a tomato arrow going in
  'log-in': (icon, P) => [
    P.tube('c3', P.linesOf('M14.5 3.5 H18.25 A2.25 2.25 0 0 1 20.5 5.75 V18.25 A2.25 2.25 0 0 1 18.25 20.5 H14.5')[0], 2.7, { part: 'K' }),
    P.arrow(2.75, 12, 16.75, 12, { len: 6, half: 5.25, w: 3, r: 1.3, role: 'c1', part: 'A' }),
  ],
  'log-out': (icon, P) => [
    P.tube('c3', P.linesOf('M9.5 3.5 H5.75 A2.25 2.25 0 0 0 3.5 5.75 V18.25 A2.25 2.25 0 0 0 5.75 20.5 H9.5')[0], 2.7, { part: 'K' }),
    P.arrow(7.5, 12, 21.25, 12, { len: 6, half: 5.25, w: 3, r: 1.3, role: 'c1', part: 'A' }),
  ],
  // a tomato suitcase with sunflower straps, a sky handle and two sky wheels
  luggage: (icon, P) => {
    const body = P.rr(4.75, 5.5, 19.25, 19, 2.75)
    return [
      P.tube('c3', [[9.75, 6], [9.75, 3], [14.25, 3], [14.25, 6]], 1.9, { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c3', P.circle(8, 20.9, 1.35), { part: 'K', ...NS }),
      P.felt('c3', P.circle(16, 20.9, 1.35), { part: 'K', ...NS }),
      P.felt('c1', body, { part: 'K' }),
      P.felt('c2', P.clip(body, P.unite(P.rect(8.75, 0, 10.75, 24), P.rect(13.25, 0, 15.25, 24))), { part: 'K', stitch: false, out: 0.45, shade: false }),
    ]
  },
  // the envelope (cream body, tomato flap) with a mint check badge
  'mail-check': (icon, P) => [
    P.felt('tint', P.rr(2.75, 5.25, 21.25, 19.25, 2.5), { part: 'K' }),
    P.felt('c1', P.poly([[3.5, 5.5], [20.5, 5.5], [12, 13]], 1.75), { part: 'A', stitchMin: 1.3, inset: 0.75 }),
    ...P.badge('check', 'c4', 17.75, 17.5, 4.3),
  ],
  // the open envelope: tomato inside and flap, a sky letter peeking out, the cream pocket in front
  'mail-open': (icon, P) => [
    P.felt('c1', P.poly([[2.75, 10], [12, 3], [21.25, 10], [21.25, 18], [2.75, 18]], [1.2, 1.8, 1.2, 0, 0]), { part: 'A', stitch: false }),
    P.felt('c3', P.rr(5.75, 6.75, 18.25, 16, 1.2), { part: 'A', stitch: false, out: 0.5 }),
    P.textLines(8.25, [15.75, 13.5], [9.5, 12], { part: 'A', w: 1 }),
    P.felt('tint', P.poly([[2.75, 10.25], [12, 16.5], [21.25, 10.25], [21.25, 21], [2.75, 21]], [0.9, 1.4, 0.9, 2.2, 2.2]), { part: 'K' }),
  ],
  // a tomato pin pillow with a cream button
  'map-pin': (icon, P) => [
    P.felt('c1', P.drop(12, 9.75, 7.5, 12, 21.75, 0.9), { part: 'K' }),
    ...P.button(12, 9.75, 2.7, 'tint', { part: 'A' }),
  ],
  // a three-fold felt map: mint, cream, mint; a running route and a cross-stitch X
  map: (icon, P) => [
    P.felt('c4', P.poly([[3, 6], [9, 3.5], [9, 18], [3, 20.5]], [1.2, 0.3, 0.3, 1.2]), { part: 'K', stitch: false }),
    P.felt('tint', P.poly([[9, 3.5], [15, 6], [15, 20.5], [9, 18]], [0.3, 0.3, 0.3, 0.3]), { part: 'A', stitch: false }),
    P.felt('c4', P.poly([[15, 6], [21, 3.5], [21, 18], [15, 20.5]], [0.3, 1.2, 1.2, 0.3]), { part: 'A', stitch: false }),
    P.thread([[[5, 16.5], [5.9, 15.4]], [[7.2, 13.9], [8.4, 12.9]], [[9.8, 12.1], [11.2, 11.6]], [[12.6, 10.8], [13.6, 9.8]]], { w: 0.85, role: 'edge', op: 0.9, part: 'A' }),
    P.cross(17.75, 9, 1.25, { role: 'c1', w: 1.05, part: 'A' }),
  ],
  maximize: (icon, P) => [
    P.arrow(13.5, 10.5, 20.75, 3.25, { len: 5.6, half: 4.4, w: 2.8, r: 1.1, role: 'c3', part: 'K' }),
    P.arrow(10.5, 13.5, 3.25, 20.75, { len: 5.6, half: 4.4, w: 2.8, r: 1.1, role: 'c1', part: 'A' }),
  ],
  // a sunflower medal with a tomato felt star, on a sky and a tomato ribbon
  medal: (icon, P) => [
    P.felt('c3', P.poly([[4, 2.5], [9.5, 2.5], [13.5, 10.5], [10, 12.75]], [0.6, 0.6, 0.8, 0.8]), { part: 'A', stitch: false }),
    P.felt('c1', P.poly([[20, 2.5], [14.5, 2.5], [10.5, 10.5], [14, 12.75]], [0.6, 0.6, 0.8, 0.8]), { part: 'A', stitch: false }),
    P.felt('c2', P.circle(12, 15.75, 5.6), { part: 'K' }),
    P.felt('c1', P.poly(P.starPts(12, 16, 3, 1.45, 5), [0.5, 0.35]), { part: 'K', stitch: false, out: 0.45, shade: false }),
  ],
  // a tomato horn with a sunflower rim and a sky cap, a sky handle
  megaphone: (icon, P) => {
    const t = f => P.rot(f, -18, 12, 12)
    return [
      P.tube('c3', [[9.4, 15.2], [9, 20.4]], 2.5, { part: 'A', stitch: false }),
      P.felt('c3', t(P.rr(2.75, 9, 7.5, 15, 1.6)), { part: 'K', stitch: false }),
      P.felt('c1', t(P.poly([[6.5, 9.4], [17, 5], [17, 19], [6.5, 14.6]], [1, 1.4, 1.4, 1])), { part: 'K' }),
      P.felt('c2', t(P.rr(15.9, 4.4, 19.4, 19.6, 1.7)), { part: 'K', stitch: false }),
    ]
  },
  meh: (icon, P) => [
    face(P),
    P.knot(9, 9.75, 0.95, 'ink', { part: 'A' }),
    P.knot(15, 9.75, 0.95, 'ink', { part: 'A' }),
    P.thread([[[8.5, 15.25], [15.5, 15.25]]], { w: 1.15, part: 'A' }),
  ],
  menu: (icon, P) => [
    P.tube('c1', [[3.75, 6], [20.25, 6]], 3.1, { part: 'K' }),
    P.tube('c2', [[3.75, 12], [20.25, 12]], 3.1, { part: 'K' }),
    P.tube('c3', [[3.75, 18], [20.25, 18]], 3.1, { part: 'K' }),
  ],
  'message-circle-more': (icon, P) => [
    P.felt('c3', bubbleRound(P), { part: 'K' }),
    P.felt('tint', P.unite(P.circle(8.4, 11.6, 1.3), P.circle(12.6, 11.6, 1.3), P.circle(16.8, 11.6, 1.3)), { part: 'A', ...NS, shade: false }),
  ],
  'message-circle': (icon, P) => [
    P.felt('c3', bubbleRound(P), { part: 'K' }),
    P.thread(P.arcPts(12.4, 11.4, 5.4, 200, 250, 10), { w: 1.1, role: 'shine', op: 0.85, part: 'K' }),
  ],
  'message-square-text': (icon, P) => [
    P.felt('c1', bubbleSquare(P), { part: 'K' }),
    P.textLines(7.5, [16.5, 13], [8.5, 12.5], { part: 'A' }),
  ],
  'message-square': (icon, P) => [
    P.felt('c1', bubbleSquare(P), { part: 'K' }),
    P.felt('accent', P.heart(12, 10.6, 0.33), { part: 'K', ...NS }),
  ],

  // ---- 281-300 ------------------------------------------------------------
  // a sky square bubble behind, a tomato one in front
  messages: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.rr(2.5, 2.75, 15.25, 12.75, 2.4), P.poly([[2.75, 16.5], [2.75, 10], [8, 12.5]], [0.9, 0.3, 0.3])), 0.9), { part: 'K' }),
    P.felt('c1', P.fillet(P.unite(P.rr(8.75, 7.75, 21.5, 17.75, 2.4), P.poly([[21.25, 21.5], [21.25, 15], [16, 17.5]], [0.9, 0.3, 0.3])), 0.9), { part: 'A' }),
    P.felt('tint', P.unite(P.circle(12.2, 12.75, 0.95), P.circle(15.1, 12.75, 0.95), P.circle(18, 12.75, 0.95)), { part: 'A', line: false, stitch: false, shade: false, hi: false, pinch: false }),
  ],
  'microphone-off': (icon, P) => [
    ...mic(P),
    ...P.slash({ part: 'S' }),
  ],
  microphone: (icon, P) => mic(P),
  // one sky body (arm and foot fused), a fat tomato eyepiece tube on the arm, a mint stage
  microscope: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(
      P.stroke('M11.25 6 C16.5 6.5 19.25 9.75 19.25 13.25 C19.25 16.75 17.5 19 14.25 20.25', 3),
      P.pill(4, 18.75, 20, 22),
    ), 1.3), { part: 'K', stitch: false }),
    P.tube('c4', [[7.25, 15.25], [17.75, 15.25]], 2.6, { part: 'A', stitch: false }),
    P.felt('c1', P.fillet(P.unite(P.seg(7.4, 3.6, 11, 9.9, 4.4), P.seg(10.6, 10.2, 12.1, 12.8, 2.3)), 0.5), { part: 'A', stitch: false }),
    P.thread([[[6.3, 5.6], [9.7, 3.6]]], { w: 0.8, role: 'edge', op: 0.85, part: 'A' }),
  ],
  minimize: (icon, P) => [
    P.arrow(20.75, 3.25, 13.25, 10.75, { len: 5.6, half: 4.4, w: 2.8, r: 1.1, role: 'c3', part: 'K' }),
    P.arrow(3.25, 20.75, 10.75, 13.25, { len: 5.6, half: 4.4, w: 2.8, r: 1.1, role: 'c1', part: 'A' }),
  ],
  'minus-circle': (icon, P) => discGlyph(P, 'c1', [
    P.tube('tint', [[7.75, 12], [16.25, 12]], 2.6, { part: 'A', stitch: false, out: 0.5 }),
  ]),
  minus: (icon, P) => [P.tube('c1', [[4.5, 12], [19.5, 12]], 3.4, { part: 'K' })],
  // a sky screen with a cream glass, a sunflower neck and foot
  monitor: (icon, P) => [
    P.tube('c2', [[12, 16], [12, 20]], 2.4, { part: 'A', stitch: false }),
    P.felt('c2', P.pill(7.25, 19.1, 16.75, 21.9), { part: 'A', stitch: false }),
    P.felt('c3', P.rr(2, 3.25, 22, 16.75, 2.4), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(4.25, 5.5, 19.75, 14.5, 1.1), { part: 'K', stitch: false, out: 0.45, shade: false }),
    P.thread(P.arcPts(12, 10, 3.2, 200, 245, 10), { w: 0.85, role: 'c3', op: 0.7, part: 'K' }),
  ],
  // a sunflower crescent pillow with two French-knot craters and a little star
  moon: (icon, P) => [
    P.felt('c2', P.round(P.cut(P.circle(11.25, 12.75, 8.75), P.circle(17, 7.25, 6.9)), 0.9), { part: 'K' }),
    P.knot(7.25, 15.25, 0.8, 'ink', { part: 'K', op: 0.45 }),
    P.knot(10.5, 18, 0.6, 'ink', { part: 'K', op: 0.45 }),
    P.felt('c3', P.poly(P.starPts(18.25, 5.75, 3, 1.45, 5), [0.6, 0.35]), { part: 'deco', stitch: false, out: 0.45, shade: false }),
  ],
  'more-horizontal': (icon, P) => [
    ...P.button(4.6, 12, 2.7, 'c1', { part: 'K' }),
    ...P.button(12, 12, 2.7, 'c2', { part: 'K' }),
    ...P.button(19.4, 12, 2.7, 'c3', { part: 'K' }),
  ],
  'more-vertical': (icon, P) => [
    ...P.button(12, 4.6, 2.7, 'c1', { part: 'K' }),
    ...P.button(12, 12, 2.7, 'c2', { part: 'K' }),
    ...P.button(12, 19.4, 2.7, 'c3', { part: 'K' }),
  ],
  // a chunky tomato tank-and-seat spanning sky wheels, a sunflower fork and handlebar, a cream headlight
  motorcycle: (icon, P) => [
    P.felt('c3', P.circle(5.5, 17.25, 3.7), { part: 'K', stitch: false }),
    P.felt('c3', P.circle(18.5, 17.25, 3.7), { part: 'K', stitch: false }),
    P.knot(5.5, 17.25, 1.2, 'tint', { part: 'K' }),
    P.knot(18.5, 17.25, 1.2, 'tint', { part: 'K' }),
    P.tube('c2', [[18.5, 17.25], [16, 8.75], [13.25, 7.5]], 2.2, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.poly([[2.75, 11.5], [9.25, 10.75], [11.75, 8.5], [16.25, 9.25], [16.75, 13], [13.75, 15.75], [7, 15.75]], [1.4, 0.8, 1.6, 1.6, 1.4, 1.4, 1.4]), { part: 'K', stitch: false, seam: [[[10, 11.25], [10.75, 15.4]]] }),
    P.felt('tint', P.circle(18.4, 10.6, 1.55), { part: 'A', ...NS }),
  ],
  // a mint mountain in front of a sky one, a cream snowcap
  mountain: (icon, P) => {
    const front = P.poly([[2, 20.5], [9.5, 4.75], [17, 20.5]], [0.9, 1.6, 0.9])
    return [
      P.felt('c3', P.poly([[10.5, 20.5], [16.5, 9.25], [22.25, 20.5]], [0.9, 1.4, 0.9]), { part: 'A', stitch: false }),
      P.felt('c4', front, { part: 'K' }),
      P.felt('tint', P.clip(front, P.unite(P.rect(0, 0, 24, 9.4), P.circle(7.75, 9.5, 1.05), P.circle(10.75, 9.7, 1.1))), { part: 'K', stitch: false, out: 0.45, shade: false, ground: false }),
    ]
  },
  // a sky mouse with a sunflower scroll wheel and an embroidered button seam
  mouse: (icon, P) => [
    P.felt('c3', P.rr(5.25, 2.5, 18.75, 21.5, 6.75), { part: 'K' }),
    P.thread([[[5.9, 12.25], [18.1, 12.25]], [[12, 3.1], [12, 5.6]], [[12, 10.2], [12, 12.25]]], { w: 0.85, role: 'edge', op: 0.85, part: 'K' }),
    P.felt('c2', P.pill(10.75, 5.4, 13.25, 10.4), { part: 'A', ...NS }),
  ],
  // a sky cross with four tomato arrowheads and a sunflower centre button
  move: (icon, P) => [
    P.felt('c3', P.unite(P.seg(12, 5, 12, 19, 2.6), P.seg(5, 12, 19, 12, 2.6)), { part: 'K', stitch: false }),
    P.felt('c1', P.around(P.poly([[12, 2], [16.4, 6.9], [7.6, 6.9]], [1.1, 0.8, 0.8]), 4), { part: 'A', stitch: false }),
    ...P.button(12, 12, 2.3, 'c2', { part: 'K' }),
  ],
  // the pointer as a folded felt dart: a tomato half and a sunflower half
  navigation: (icon, P) => [
    P.felt('c1', P.poly([[20.75, 3.25], [10.75, 13.25], [2.75, 10.25]], [1.3, 0.3, 1.3]), { part: 'K', stitch: false }),
    P.felt('c2', P.poly([[20.75, 3.25], [13.75, 21.25], [10.75, 13.25]], [1.3, 1.3, 0.3]), { part: 'K', stitch: false }),
  ],
  // a sky hub box, sunflower tubes, three child boxes in toy colours
  network: (icon, P) => [
    P.felt('c2', P.unite(P.seg(12, 7, 12, 17.5, 2), P.bar([[4, 17.5], [4, 12.25], [20, 12.25], [20, 17.5]], 2)), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.rr(8.25, 2.25, 15.75, 7.75, 1.7), { part: 'K', stitch: false }),
    P.felt('c1', P.rr(1.75, 16.5, 6.25, 21.25, 1.3), { part: 'K', ...NS }),
    P.felt('c4', P.rr(9.75, 16.5, 14.25, 21.25, 1.3), { part: 'K', ...NS }),
    P.felt('accent', P.rr(17.75, 16.5, 22.25, 21.25, 1.3), { part: 'K', ...NS }),
  ],
  // a cream paper with a sky rolled spine, a tomato headline box, embroidered text
  newspaper: (icon, P) => [
    P.felt('c3', P.rr(2.5, 8.75, 7.5, 20.5, [1.6, 0, 0, 2.2]), { part: 'K', stitch: false }),
    P.felt('tint', P.round(P.path('M4.5 20.5 H19 A2.25 2.25 0 0 0 21.25 18.25 V6 A2.25 2.25 0 0 0 19 3.75 H9.25 A2.25 2.25 0 0 0 7 6 V17.5 A3 3 0 0 1 4.5 20.5 Z'), 0.3), { part: 'K' }),
    P.felt('c1', P.rr(10, 7, 18.25, 11.75, 1.1), { part: 'A', ...NS }),
    P.textLines(10.5, [17.75, 15.5], [14.75, 17.5], { part: 'A', role: 'ink', w: 1, op: 0.7 }),
  ],
  // a sky notebook with a cream label, a tomato elastic band, sunflower binder rings
  notebook: (icon, P) => {
    const cover = P.rr(6, 2.5, 20.25, 21.5, 2.4)
    return [
      P.felt('c3', cover, { part: 'K' }),
      P.felt('c1', P.clip(cover, P.rect(16.5, 0, 18.25, 24)), { part: 'K', stitch: false, out: 0.45, shade: false }),
      P.felt('tint', P.rr(9.25, 6, 14.75, 9.75, 0.9), { part: 'A', ...NS, shade: false }),
      P.tube('c2', [[3.25, 7], [8.5, 7]], 2, { part: 'A', stitch: false, out: 0.5 }),
      P.tube('c2', [[3.25, 12], [8.5, 12]], 2, { part: 'A', stitch: false, out: 0.5 }),
      P.tube('c2', [[3.25, 17], [8.5, 17]], 2, { part: 'A', stitch: false, out: 0.5 }),
    ]
  },
}

// a sunflower microphone head with embroidered mesh, a sky cradle, stand and foot
function mic(P) {
  return [
    P.tube('c3', [[5.5, 10.75], ...P.arcPts(12, 10.75, 6.5, 180, 0), [18.5, 10.75]], 2.2, { part: 'A', stitch: false }),
    P.tube('c3', [[12, 17.25], [12, 20.25]], 2.2, { part: 'A', stitch: false }),
    P.felt('c3', P.pill(7.75, 19.25, 16.25, 21.9), { part: 'A', stitch: false }),
    P.felt('c2', P.pill(8.6, 2.25, 15.4, 15), { part: 'K' }),
    P.thread([[[9.7, 6.9], [14.3, 6.9]], [[9.5, 9.6], [14.5, 9.6]]], { w: 0.7, op: 0.5, part: 'K' }),
  ]
}
