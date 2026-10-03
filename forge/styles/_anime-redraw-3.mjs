// ANIME redraws, chunk 3: hand-drawn icons for this chunk's batch (see forge/styles/ANIME-GUIDE.md).
// Each entry: name -> (icon, k) => ops, built with the frozen kit (k = prim + kit, see _anime-kit.mjs).
// The exemplars in _anime-render.mjs (EXEMPLAR) win over any entry here.

// ---------------------------------------------------------------------------
// local helpers (built from prim + kit only)

// white glyph lines on a disc / badge
const glyph = (k, lines, o = {}) => k.ink(lines, { role: 'tint', w: o.w ?? 1.6, taper: false, shift: 0, part: o.part || 'a' })
// a glossy orb (disc button)
const orb = (k, role, o = {}) => k.surf(k.circle(12, 12, o.r ?? 9.3), role, { shineSize: 1, ...o })
// round badge with a glyph (S plate), lower right by default
const badge = (k, cx, cy, r, role, lines, o = {}) => [
  k.moat(k.circle(cx, cy, r), 0.75),
  k.surf(k.circle(cx, cy, r), role, { part: 's', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
  k.ink(lines, { role: 'tint', w: o.w ?? 1.25, taper: false, shift: 0, part: 's' }),
]
// slash for -off icons: moat + coral bar
const slash = k => [
  k.moat(k.seg(3.6, 3.6, 20.4, 20.4, 2.2), 0.9),
  k.surf(k.seg(3.6, 3.6, 20.4, 20.4, 2.1), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
]
// git node: a glossy bead with a cream core
const gnode = (k, x, y, role = 'c4', r = 2.75) => [
  k.surf(k.circle(x, y, r), role, { shine: 'dot', shineSize: 0.7, ol: 0.45 }),
  k.paint(k.circle(x + 0.15, y + 0.15, r * 0.36), 'tint', { op: 0.95 }),
]
const gtube = (k, lines, o = {}) => k.tube(lines, o.role || 'c1', { w: 1.5, ol: 0.45, ...o })
// a cream hand (the open palm used by hand-coins / hand-heart) with a sky cuff
const sleeve = (k, x0, y0, x1, y1, role = 'c1') => k.surf(k.rr(x0, y0, x1, y1, 0.9), role, { shine: 'none', ol: 0.45 })
// the exemplar heart path
// a cupped palm from the left: sky cuff, cream hand with curled fingertips and a thumb lobe
const cupHand = k => [
  k.surf(k.unite(k.path('M5.4 13.8 H8.8 C10.6 13.8 11.8 15.2 13.2 15.8 H17.4 C18.4 15.8 18.9 14.8 19.1 13.6 C19.3 12.4 21.2 12.3 21.3 13.7 C21.5 17.6 18.8 21.2 14.4 21.2 H5.4 Z'), k.rot(k.pill(9.4, 11.6, 12, 17.2), 42, 10.7, 14.4)), 'tint', { shine: 'none' }),
  k.ink('M9.2 16.9 C10.3 17.3 11.6 17.2 12.6 16.6', { w: 0.7 }),
  k.ink(['M16.2 19.6 C17.3 19.1 18.1 18.4 18.6 17.5', 'M18.6 17.8 C19.4 17.2 19.9 16.3 20.2 15.4'], { w: 0.7 }),
  sleeve(k, 2.6, 12.4, 5.4, 21.6),
]
const HEART = 'M12 20.5 C12 20.5 3 15.2 3 8.9 C3 6.2 5.1 4 7.8 4 C9.6 4 11.1 5 12 6.5 C12.9 5 14.4 4 16.2 4 C18.9 4 21 6.2 21 8.9 C21 15.2 12 20.5 12 20.5 Z'

// ---------------------------------------------------------------------------
const A = {
  // ---------------------------------------------------------------- gifts / commerce
  // sakura box, gold ribbon band (A) and a gold bow with two loops
  gift: (icon, k) => {
    const body = k.rr(4.6, 11.4, 19.4, 21, [0, 0, 2, 2])
    const lid = k.rr(3, 7.6, 21, 11.9, 1.4)
    return [
      k.surf(body, 'c2', { shine: 'none' }),
      k.surf(k.clip(body, k.rect(10.8, 10, 13.2, 22)), 'c3', { part: 'a', shine: 'none', cast: false, ol: 0.35 }),
      k.surf(lid, 'c2', { shineSize: 0.85 }),
      k.surf(k.clip(lid, k.rect(10.7, 7, 13.3, 12.5)), 'c3', { part: 'a', shine: 'none', cast: false, ol: 0.35 }),
      k.surf(k.path('M12 7.7 C9.8 3.6 5.4 3 5.9 5.7 C6.3 7.5 9.4 7.9 12 7.7 Z'), 'c3', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.45 }),
      k.surf(k.path('M12 7.7 C14.2 3.6 18.6 3 18.1 5.7 C17.7 7.5 14.6 7.9 12 7.7 Z'), 'c3', { part: 'a', shine: 'none', ol: 0.45 }),
      k.surf(k.pill(10.7, 6.3, 13.3, 8.9), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
      k.sparkleAt(20.6, 3.2, 1.5, { mx: -1, my: 1 }),
    ]
  },
  // a cupped cream palm (curled fingertips, thumb lobe up) holding a gold coin stack
  'hand-coins': (icon, k) => [
    k.surf(k.unite(k.ellipse(15, 8, 5, 2.5), k.rect(10, 4.5, 20, 8)), 'c3', { part: 'a', shine: 'none' }),
    k.surf(k.ellipse(15, 4.5, 5, 2.5), 'c3', { part: 'a', shine: 'streak', shineSize: 0.7, ol: 0.45, cast: false }),
    k.ink('M10.8 6.4 C12.4 7.2 17.6 7.2 19.2 6.4', { part: 'a', w: 0.6 }),
    ...cupHand(k),
  ],
  'hand-heart': (icon, k) => [
    ...cupHand(k),
    k.surf(k.heartShape(13.4, 6.2, 0.5), 'c2', { part: 'a', shineSize: 0.75 }),
  ],
  // two mitten hands gripping: a cream back hand from the right (sakura cuff),
  // a cream front hand from the left (sky cuff) wrapping under it, its thumb laid over the top
  handshake: (icon, k) => [
    k.surf(k.rr(18.8, 6.6, 21.6, 14.2, 0.9), 'c2', { shine: 'none', ol: 0.45 }),
    k.surf(k.path('M18.8 7.6 V13.2 H13.4 C10.8 13.2 8.6 12.2 8.6 10.4 C8.6 8.6 10.8 7.6 13.4 7.6 Z'), 'tint', { shine: 'none' }),
    k.surf(k.rr(7.6, 13.2, 13, 18.6, 2.4), 'tint', { shine: 'none', ol: 0.45 }),
    k.surf(k.rr(2.4, 9.8, 5.2, 17.4, 0.9), 'c1', { shine: 'none', ol: 0.45 }),
    k.surf(k.path('M5.2 10.8 H11 C14.4 10.8 16.6 12.2 16.6 14 C16.6 15.8 14.4 16.6 11.6 16.6 H5.2 Z'), 'tint', { shine: 'none' }),
    k.surf(k.rot(k.pill(9.2, 9.2, 15, 11.6), -12, 12.1, 10.4), 'tint', { part: 'a', shine: 'none', ol: 0.45 }),
    k.ink('M9.4 13.9 C11.4 14.3 13.6 14.1 15.4 13.5', { w: 0.75 }),
  ],

  // ---------------------------------------------------------------- git
  'git-branch': (icon, k) => [
    gtube(k, ['M6.5 8 V16', 'M17.5 8.6 V10 C17.5 14.4 14 17.6 9.4 18']),
    ...gnode(k, 6.5, 5.8),
    ...gnode(k, 6.5, 18.2),
    ...gnode(k, 17.5, 5.8, 'c2'),
  ],
  'git-commit': (icon, k) => [
    gtube(k, ['M3 12 H8', 'M16 12 H21'], { w: 1.7 }),
    ...gnode(k, 12, 12, 'c4', 4.2),
  ],
  'git-merge': (icon, k) => [
    gtube(k, ['M6.5 8 V16', 'M7.8 8.2 C9.2 11 11.4 12 15.2 12']),
    ...gnode(k, 6.5, 5.8),
    ...gnode(k, 6.5, 18.2),
    ...gnode(k, 17.6, 12, 'c2'),
  ],
  'git-pull-request': (icon, k) => [
    gtube(k, ['M5 8 V16', 'M13 6 H16.8 C18.1 6 19 6.9 19 8.2 V15.4']),
    k.surf(k.poly([[15.2, 2.6], [10.6, 6], [15.2, 9.4]], [0.7, 0.8, 0.7]), 'c1', { part: 'a', shine: 'none', ol: 0.45 }),
    ...gnode(k, 5, 5.8),
    ...gnode(k, 5, 18.2),
    ...gnode(k, 19, 18.2, 'c2'),
  ],

  // ---------------------------------------------------------------- world / education
  // a sky planet with leaf-green continents and pale meridians
  globe: (icon, k) => {
    const ball = k.circle(12, 12, 9.2)
    const land = k.clip(k.join(
      k.path('M5.6 5.6 C8 4.2 10.8 5 10.8 7.4 C10.8 9.6 8.4 10 8.6 12.2 C8.8 14.2 6.8 15 5.2 13.6 C3.4 12 3.6 7.2 5.6 5.6 Z'),
      k.path('M14 12.8 C15.9 11.7 19.4 12.2 20 14.4 C20.4 16.4 17.4 19.4 15 19.6 C13.4 19.7 13.4 17.8 14 16.4 C14.6 15 12.6 13.8 14 12.8 Z'),
      k.path('M14.6 3.6 C17 3.4 19.4 5.6 19.4 7.6 C17.8 8.4 15.2 7 14.6 3.6 Z'),
    ), ball)
    return [
      k.surf(ball, 'c1', { shineSize: 1 }),
      k.surf(land, 'c4', { shine: 'none', cast: false, ol: 0.3, shade: 0.8 }),
      k.ink(['M12 2.9 C9.4 5.6 8.2 8.6 8.2 12 C8.2 15.4 9.4 18.4 12 21.1', 'M12 2.9 C14.6 5.6 15.8 8.6 15.8 12 C15.8 15.4 14.6 18.4 12 21.1', 'M2.9 12 H21.1'], { part: 'a', role: 'edge', w: 0.6, taper: false, shift: 0 }),
    ]
  },
  'graduation-cap': (icon, k) => [
    k.surf(k.path('M7 10.4 V15.8 C7 17.8 9.3 19.3 12 19.3 C14.7 19.3 17 17.8 17 15.8 V10.4 Z'), 'c1', { shine: 'none' }),
    k.surf(k.poly([[12, 4.2], [21.4, 9], [12, 13.8], [2.6, 9]], [0.9, 0.9, 0.9, 0.9]), 'c1', { shineSize: 0.9 }),
    k.tube('M12 9 L19.6 11.2 V14.6', 'c3', { part: 'a', w: 0.9, ol: 0.4, shade: 0 }),
    k.surf(k.circle(12, 9, 1.05), 'c3', { shine: 'none', ol: 0.35, shade: 0 }),
    k.surf(k.poly([[19.6, 14], [20.8, 18.4], [18.4, 18.4]], [0.4, 0.5, 0.5]), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.sparkleAt(4.4, 15.4, 1.5, { mx: 1, my: -1 }),
  ],

  // ---------------------------------------------------------------- tools
  hammer: (icon, k) => [
    k.surf(k.seg(5.4, 19.2, 13.4, 11.2, 3), 'c3', { part: 'a', shine: 'none' }),
    k.surf(k.path('M12.68 2.82 L18.34 8.47 C20.82 10.95 21.35 14.31 19.22 17.49 C19.75 15.19 18.87 13.25 17.28 11.66 L16.57 10.95 L14.81 12.72 L8.79 6.71 C8.4 6.32 8.4 5.68 8.79 5.29 L11.27 2.82 C11.66 2.43 12.29 2.43 12.68 2.82 Z'), 'c1', { shineSize: 0.85 }),
  ],
  highlighter: (icon, k) => [
    k.surf(k.rr(3, 19.4, 12.6, 21.4, 1), 'c3', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.poly([[10.4, 9.6], [7.2, 13.6], [10.4, 16.8], [14.4, 13.6]], [0.4, 0.6, 0.6, 0.4]), 'c3', { part: 'a', shine: 'none', ol: 0.45 }),
    k.surf(k.path('M10 10 L15.94 4.06 C16.5 3.5 17.5 3.5 18.06 4.06 L19.94 5.94 C20.5 6.5 20.5 7.5 19.94 8.06 L14 14 Z'), 'c2', { shineSize: 0.8 }),
    k.ink([[[11.2, 11.2], [12.8, 12.8]]], { w: 0.8, taper: false }),
  ],

  // ---------------------------------------------------------------- devices / media
  'hard-drive': (icon, k) => [
    k.surf(k.rr(4.2, 2.6, 19.8, 21.4, 2.3), 'c1', { shineSize: 0.9 }),
    k.surf(k.circle(12, 13.6, 5.3), 'edge', { part: 'a', inset: true, shine: 'glass', ol: 0.45 }),
    k.surf(k.circle(12, 13.6, 1.25), 'c3', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
    k.tube('M16.6 5 L14.4 10.2', 'c3', { part: 'a', w: 1.2, ol: 0.4, shade: 0 }),
  ],
  headphones: (icon, k) => [
    k.tube('M4.6 15 V12 C4.6 7.2 7.8 3.9 12 3.9 C16.2 3.9 19.4 7.2 19.4 12 V15', 'c1', { part: 'a', w: 1.9 }),
    k.surf(k.rr(3, 13, 8.8, 21.2, [2.2, 1.4, 1.4, 2.2]), 'c2', { shineSize: 0.7 }),
    k.surf(k.rr(15.2, 13, 21, 21.2, [1.4, 2.2, 2.2, 1.4]), 'c2', { shine: 'dot', shineSize: 0.6 }),
  ],
  headset: (icon, k) => [
    k.tube('M4.6 13 V11.6 C4.6 6.9 7.8 3.6 12 3.6 C16.2 3.6 19.4 6.9 19.4 11.6 V13', 'c1', { part: 'a', w: 1.9 }),
    k.tube('M18.2 18.2 C18.2 20 16.8 20.9 15 20.9 H13.6', 'c1', { part: 'a', w: 1.1, ol: 0.4 }),
    k.surf(k.rr(3, 11, 8.8, 18.8, [2.2, 1.4, 1.4, 2.2]), 'c2', { shineSize: 0.7 }),
    k.surf(k.rr(15.2, 11, 21, 18.8, [1.4, 2.2, 2.2, 1.4]), 'c2', { shine: 'dot', shineSize: 0.6 }),
    k.surf(k.pill(10.2, 19.6, 13.8, 21.6), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
  ],

  // ---------------------------------------------------------------- glyphs
  hash: (icon, k) => [
    k.surf(k.unite(k.seg(10.1, 3.6, 8.1, 20.4, 2.5), k.seg(16, 3.6, 14, 20.4, 2.5)), 'c1', { shine: 'none' }),
    k.surf(k.unite(k.seg(4.2, 9, 19.8, 9, 2.5), k.seg(4.2, 15, 19.8, 15, 2.5)), 'c2', { part: 'a', shineSize: 0.7 }),
  ],
  heading: (icon, k) => [
    k.surf(k.rr(6, 10.7, 18, 13.3, 0.4), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.pill(4.6, 3.6, 7.6, 20.4), 'c1', { shineSize: 0.75 }),
    k.surf(k.pill(16.4, 3.6, 19.4, 20.4), 'c1', { shine: 'dot', shineSize: 0.6 }),
  ],

  // ---------------------------------------------------------------- hearts
  'heart-crack': (icon, k) => {
    const heart = k.path(HEART)
    const crack = [[12, 4.6], [10, 10.5], [13.5, 13.5], [11, 17], [12, 21.4]]
    const leftP = k.poly([[0, 0], [12, 0], ...crack, [12, 24], [0, 24]])
    const gap = k.stroke(crack, 1.1)
    return [
      k.surf(k.cut(k.clip(heart, leftP), gap), 'c2', { shineSize: 0.95 }),
      k.surf(k.rot(k.cut(heart, leftP, gap), 7, 12.5, 20), 'c2', { part: 'a', shine: 'none' }),
    ]
  },
  'heart-pulse': (icon, k) => [
    k.surf(k.path(HEART), 'c2', { shineSize: 1 }),
    glyph(k, [[[4.6, 12.2], [7.5, 12.2], [9.1, 9.4], [12, 15.4], [13.8, 12.2], [19.4, 12.2]]], { w: 1.5 }),
  ],

  // ---------------------------------------------------------------- disc buttons
  'help-circle': (icon, k) => [
    orb(k, 'c2'),
    glyph(k, ['M9.4 9.6 C9.4 8 10.6 6.9 12 6.9 C13.5 6.9 14.6 8 14.6 9.3 C14.6 10.6 13.6 11.2 12.8 11.8 C12.2 12.2 12 12.7 12 13.6 V14'], { w: 2.1 }),
    k.paint(k.circle(12, 17.1, 1.3), 'tint', { part: 'a' }),
  ],
  hexagon: (icon, k) => [
    k.surf(k.ngon(12, 12, 9.5, 6, -90, 2), 'c1', { shineSize: 1 }),
  ],

  // ---------------------------------------------------------------- time
  // cream clock face inside a sky rewind arrow
  history: (icon, k) => [
    k.surf(k.circle(12, 12, 6.1), 'tint', { shine: 'none', shade: 0.8 }),
    k.tube('M4.2 13 C4.6 17.2 8 20.4 12 20.4 C16.6 20.4 20.4 16.6 20.4 12 C20.4 7.4 16.6 3.6 12 3.6 C9.7 3.6 7.8 4.5 6.3 5.9', 'c1', { w: 1.7 }),
    k.surf(k.poly([[2.6, 4.6], [2.6, 9.8], [7.8, 9.8]], [0.6, 0.8, 0.6]), 'c1', { shine: 'none', ol: 0.45 }),
    k.ink([[[12, 8.4], [12, 12], [14.8, 13.8]]], { part: 'a', w: 1.1, taper: false }),
    k.paint(k.circle(12, 12, 0.7), 'accent', { part: 'a' }),
  ],

  // ---------------------------------------------------------------- buildings
  hospital: (icon, k) => [
    k.surf(k.rr(2.6, 11, 21.4, 21, [2, 2, 0.6, 0.6]), 'tint', { shine: 'none' }),
    k.surf(k.rr(6.6, 3, 17.4, 21, [2, 2, 0, 0]), 'tint', { shine: 'none' }),
    k.surf(k.unite(k.rr(11, 5.6, 13, 11.6, 0.45), k.rr(9, 7.6, 15, 9.6, 0.45)), 'accent', { part: 'a', shine: 'dot', shineSize: 0.55, ol: 0.4 }),
    k.surf(k.rr(3.9, 14, 5.4, 16, 0.4), 'c1', { inset: true, ol: 0.3, shine: 'none' }),
    k.surf(k.rr(18.6, 14, 20.1, 16, 0.4), 'c1', { inset: true, ol: 0.3, shine: 'none' }),
    k.surf(k.arch(10.2, 16.4, 13.8, 21), 'c1', { part: 'a', shine: 'glass', shineSize: 0.6 }),
  ],
}

// ---------------------------------------------------------------------------
// a framed picture: cream photo border, sky inset, green hills and a gold sun
function picture(k, x0, y0, x1, y1, o = {}) {
  const m = 1.7
  const panel = k.rr(x0 + m, y0 + m, x1 - m, y1 - m, 1)
  const w = x1 - x0, h = y1 - y0
  const X = f => x0 + w * f, Y = f => y0 + h * f
  return [
    k.surf(k.rr(x0, y0, x1, y1, o.r ?? 2.2), 'tint', { shine: 'none', ...o.frame }),
    k.surf(panel, 'c1', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
    k.surf(k.clip(k.poly([[X(0.02), Y(0.98)], [X(0.32), Y(0.48)], [X(0.55), Y(0.8)], [X(0.7), Y(0.6)], [X(1.02), Y(0.98)]], [0, 0.8, 0.6, 0.8, 0]), panel), 'c4', { part: 'a', shine: 'none', cast: false, ol: 0.35, shade: 0.7 }),
    k.surf(k.circle(X(o.sx ?? 0.68), Y(0.33), o.sr ?? 1.55), 'c3', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
  ]
}
// tile used by layout-* icons
const tile = (k, x0, y0, x1, y1, role, o = {}) => k.surf(k.rr(x0, y0, x1, y1, o.r ?? 1.6), role, { shine: o.shine ?? 'dot', shineSize: o.shineSize ?? 0.6, ol: 0.45, ...o })

const B = {
  // ---------------------------------------------------------------- buildings
  // a sakura hotel front with a gold sign, a lit room and a little bed
  // a sakura facade: a cream sign plate with an ink H, a grid of lit gold windows and a sky glass door
  hotel: (icon, k) => [
    k.surf(k.rr(3.6, 3, 20.4, 21.2, [2, 2, 0.6, 0.6]), 'c2', { shine: 'none' }),
    k.surf(k.rr(8.6, 4.6, 15.4, 9.2, 1.2), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.ink([[[10.6, 5.7], [10.6, 8.1]], [[13.4, 5.7], [13.4, 8.1]], [[10.6, 6.9], [13.4, 6.9]]], { part: 'a', w: 0.95, taper: false, shift: 0 }),
    k.surf(k.join(k.rr(5.8, 11, 8.6, 13.4, 0.5), k.rr(15.4, 11, 18.2, 13.4, 0.5), k.rr(5.8, 15.2, 8.6, 17.6, 0.5), k.rr(15.4, 15.2, 18.2, 17.6, 0.5)), 'c3', { inset: true, ol: 0.35, shine: 'none' }),
    k.surf(k.arch(10.2, 12.4, 13.8, 21.2), 'c1', { part: 'a', inset: true, ol: 0.4, shine: 'glass', shineSize: 0.6 }),
  ],
  // ---------------------------------------------------------------- time
  // sky glass hourglass with sakura caps and falling gold sand
  hourglass: (icon, k) => {
    const glass = k.path('M7 4 H17 V6 C17 9 14.5 10.2 12.6 12 C14.5 13.8 17 15 17 18 V20 H7 V18 C7 15 9.5 13.8 11.4 12 C9.5 10.2 7 9 7 6 Z')
    return [
      k.surf(glass, 'edge', { shine: 'glass', shineSize: 0.8 }),
      k.surf(k.clip(glass, k.path('M6 7.4 H18 V12 H6 Z')), 'c3', { part: 'a', shine: 'none', cast: false, ol: 0, shade: 0.7 }),
      k.surf(k.clip(glass, k.path('M6.6 20.4 C7.6 17.2 10.8 15.8 12 15.8 C13.2 15.8 16.4 17.2 17.4 20.4 Z')), 'c3', { part: 'a', shine: 'none', cast: false, ol: 0, shade: 0.7 }),
      k.paint(k.rr(11.7, 11.4, 12.3, 16.2, 0.3), 'c3', { part: 'a' }),
      k.surf(k.pill(4.6, 2.6, 19.4, 4.9), 'c2', { shine: 'dot', shineSize: 0.6, ol: 0.45 }),
      k.surf(k.pill(4.6, 19.1, 19.4, 21.4), 'c2', { shine: 'none', ol: 0.45 }),
      k.sparkleAt(20.8, 9.6, 1.4, { mx: -1, my: 1 }),
    ]
  },
  // ---------------------------------------------------------------- food
  // a sakura scoop with sprinkles and a cherry on a waffle cone
  'ice-cream': (icon, k) => [
    k.surf(k.poly([[7.4, 13.2], [16.6, 13.2], [12, 21.6]], [0.6, 0.6, 1.1]), 'c3', { part: 'a', shine: 'none' }),
    k.ink([[[9.2, 14.6], [12.6, 18.4]], [[11.6, 14.2], [14.1, 16.7]], [[14.8, 14.6], [11.4, 18.4]], [[12.4, 14.2], [9.9, 16.7]]], { part: 'a', w: 0.55, taper: false, shift: 0 }),
    k.surf(k.path('M5.6 11.6 C5.6 7.6 8.4 4.8 12 4.8 C15.6 4.8 18.4 7.6 18.4 11.6 C18.4 12.9 17.3 13.7 16.2 13.4 C15.6 14.6 13.8 14.6 13.2 13.4 C12.6 14.4 11.2 14.4 10.6 13.4 C9.9 14.6 8.1 14.5 7.7 13.3 C6.6 13.6 5.6 12.8 5.6 11.6 Z'), 'c2', { shineSize: 0.85 }),
    k.paint(k.join(k.rot(k.pill(9.1, 9.8, 10.9, 10.6), -30, 10, 10.2), k.rot(k.pill(13.6, 10.6, 15.4, 11.4), 25, 14.5, 11)), 'c1'),
    k.paint(k.rot(k.pill(11.3, 7.6, 13.1, 8.4), 60, 12.2, 8), 'c3'),
    k.ink('M13.2 4.4 C13.6 3.2 14.4 2.7 15.4 2.6', { w: 0.6, taper: false }),
    k.surf(k.circle(13, 4.6, 1.35), 'accent', { shine: 'dot', shineSize: 0.55, ol: 0.4 }),
  ],
  // ---------------------------------------------------------------- cards
  'id-card': (icon, k) => {
    const card = k.rr(2.4, 4.4, 21.6, 19.6, 2.2)
    const photo = k.rr(4.6, 8.8, 11.2, 17.4, 1.2)
    return [
      k.surf(card, 'tint', { shine: 'none' }),
      k.surf(k.clip(card, k.rect(2, 4, 22, 7.2)), 'c1', { cast: false, shine: 'none' }),
      k.surf(photo, 'c2', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
      k.surf(k.clip(k.unite(k.circle(7.9, 11.6, 1.6), k.rr(5.2, 14, 10.6, 18, [2.4, 2.4, 0, 0])), photo), 'tint', { part: 'a', shine: 'none', cast: false, ol: 0.3, shade: 0 }),
      k.ink([[[13.8, 10.6], [18.8, 10.6]], [[13.8, 13.4], [17.2, 13.4]], [[13.8, 16.2], [18, 16.2]]], { part: 'a', w: 0.85 }),
    ]
  },
  // ---------------------------------------------------------------- images
  image: (icon, k) => picture(k, 2.4, 4.2, 21.6, 19.8),
  'image-plus': (icon, k) => [
    ...picture(k, 2.4, 4.2, 20.6, 18.8, { sx: 0.4 }),
    ...badge(k, 17.6, 17.6, 3.9, 'c4', [[[17.6, 15.6], [17.6, 19.6]], [[15.6, 17.6], [19.6, 17.6]]], { w: 1.3 }),
  ],
  images: (icon, k) => [
    k.surf(k.rr(6.4, 3, 21.6, 16.4, 2), 'c2', { shine: 'none' }),
    ...picture(k, 2.4, 7.6, 17.6, 21, { r: 2 }),
  ],
  // ---------------------------------------------------------------- inbox
  inbox: (icon, k) => [
    k.surf(k.path('M2.6 12.5 L5.6 5.2 C5.8 4.8 6.2 4.6 6.6 4.6 H17.4 C17.8 4.6 18.2 4.8 18.4 5.2 L21.4 12.5 V17.5 C21.4 18.6 20.5 19.5 19.4 19.5 H4.6 C3.5 19.5 2.6 18.6 2.6 17.5 Z'), 'c1', { shine: 'none' }),
    k.surf(k.poly([[6.6, 6.4], [17.4, 6.4], [19.6, 12.6], [4.4, 12.6]], [0.5, 0.5, 0, 0]), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0, tone: ['ink', 0.3] }),
    k.surf(k.rr(8, 7.4, 16, 13, 0.6), 'tint', { part: 'a', shine: 'none', ol: 0.35 }),
    k.ink([[[9.6, 9.4], [14.4, 9.4]]], { part: 'a', w: 0.6 }),
    k.surf(k.path('M2.6 12.5 H7.6 L9 15 H15 L16.4 12.5 H21.4 V17.5 C21.4 18.6 20.5 19.5 19.4 19.5 H4.6 C3.5 19.5 2.6 18.6 2.6 17.5 Z'), 'c1', { shineSize: 0.7 }),
  ],
  // ---------------------------------------------------------------- disc buttons
  'info-circle': (icon, k) => [
    orb(k, 'c1'),
    glyph(k, [[[10.4, 11], [12.1, 11], [12.1, 16.6]]], { w: 2.1 }),
    k.paint(k.circle(12, 7.6, 1.3), 'tint', { part: 'a' }),
  ],
  // ---------------------------------------------------------------- boards
  kanban: (icon, k) => [
    k.surf(k.rr(3, 3, 21, 21, 2.6), 'c1', { shineSize: 0.8 }),
    k.surf(k.rr(6.2, 6.6, 8.8, 17, 1.1), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(10.7, 6.6, 13.3, 12.4, 1.1), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(15.2, 6.6, 17.8, 14.8, 1.1), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
  ],
  // ---------------------------------------------------------------- keys / devices
  // a gold key with a sakura gem in its bow
  key: (icon, k) => [
    k.surf(k.cut(k.unite(k.circle(8, 16, 5), k.seg(11.2, 12.8, 20.2, 3.8, 2.4), k.seg(18.2, 5.6, 20.4, 7.8, 2.3), k.seg(15.3, 8.5, 17.4, 10.6, 2.3)), k.circle(8, 16, 1.9)), 'c3', { shineSize: 0.85 }),
    k.surf(k.circle(8, 16, 1.9), 'c2', { inset: true, ol: 0.35, shine: 'glint', shineSize: 0.6 }),
    k.sparkleAt(5, 5.4, 1.6, { mx: 1, my: 1 }),
  ],
  keyboard: (icon, k) => {
    const keys = k.join(
      ...[6, 10, 14, 18].map(x => k.rr(x - 1, 7.6, x + 1, 9.6, 0.45)),
      ...[8, 12, 16].map(x => k.rr(x - 1, 11, x + 1, 13, 0.45)),
      k.rr(7.6, 14.4, 16.4, 16.4, 0.7),
    )
    return [
      k.surf(k.rr(2.4, 5, 21.6, 19, 2.2), 'c1', { shine: 'none' }),
      k.surf(keys, 'tint', { part: 'a', shine: 'none', ol: 0.32, shade: 0.5 }),
      k.shine(k.lens(3.4, 7.6, 4.4, 6, 0.3)),
    ]
  },
  lamp: (icon, k) => [
    k.surf(k.rr(11.3, 10.6, 12.7, 18.6, 0.5), 'c3', { shine: 'none', ol: 0.4 }),
    k.surf(k.path('M6.4 21.2 C6.4 18.8 9 17.6 12 17.6 C15 17.6 17.6 18.8 17.6 21.2 Z'), 'c1', { shine: 'dot', shineSize: 0.6 }),
    k.surf(k.poly([[8.6, 3], [15.4, 3], [19.6, 12], [4.4, 12]], [0.9, 0.9, 1, 1]), 'c2', { shineSize: 0.85 }),
    k.tube('M16.6 12.4 V15', 'c3', { part: 'a', w: 0.6, ol: 0.35, shade: 0 }),
    k.surf(k.circle(16.6, 15.6, 0.75), 'c3', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
  ],
  // ---------------------------------------------------------------- buildings
  landmark: (icon, k) => [
    k.surf(k.join(...[6, 10, 14, 18].map(x => k.rr(x - 1.15, 10.6, x + 1.15, 19.2, 0.4))), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.poly([[2.6, 10.4], [2.6, 9], [12, 3.2], [21.4, 9], [21.4, 10.4]], [0.5, 0.6, 1, 0.6, 0.5]), 'c1', { shineSize: 0.8 }),
    k.surf(k.circle(12, 7.4, 1.05), 'c3', { inset: true, shine: 'glint', shineSize: 0.5, ol: 0.35 }),
    k.surf(k.rr(2.6, 18.8, 21.4, 21.4, 0.8), 'c3', { shine: 'none' }),
  ],
  laptop: (icon, k) => [
    k.surf(k.rr(4, 3.8, 20, 15.6, 2), 'c1', { shine: 'none' }),
    k.surf(k.rr(6, 5.8, 18, 13.6, 0.9), 'ink', { inset: true, ol: 0, shine: 'glass', shade: 0 }),
    k.surf(k.poly([[3.8, 16.2], [20.2, 16.2], [21.6, 19.8], [2.4, 19.8]], [0.6, 0.6, 1.2, 1.2]), 'c1', { part: 'a', shineSize: 0.6 }),
    k.paint(k.rr(10.4, 16.8, 13.6, 17.6, 0.4), 'ink', { part: 'a', op: 0.5 }),
  ],
  // ---------------------------------------------------------------- faces
  // a golden laughing face: happy closed eyes, open mouth with a sakura tongue, blush
  laugh: (icon, k) => {
    const mouth = k.path('M7.8 13.2 H16.2 C16.2 16 14.4 18 12 18 C9.6 18 7.8 16 7.8 13.2 Z')
    return [
      k.surf(k.circle(12, 12, 9.2), 'c3', { shine: 'none' }),
      k.paint(k.join(k.ellipse(6.6, 13.2, 1.5, 0.8), k.ellipse(17.4, 13.2, 1.5, 0.8)), 'c2', { op: 0.85 }),
      k.ink(['M7.4 10.2 C8 8.6 9.9 8.6 10.5 10.2', 'M13.5 10.2 C14.1 8.6 16 8.6 16.6 10.2'], { part: 'a', w: 1.1 }),
      k.surf(mouth, 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.3 }),
      k.paint(k.clip(k.ellipse(12, 18, 3, 1.9), mouth), 'c2', { part: 'a' }),
      k.shine(k.lens(5.8, 9.4, 8.6, 5.6, 0.7)),
    ]
  },
  // ---------------------------------------------------------------- layers / layout
  layers: (icon, k) => {
    const dia = cy => k.poly([[12, cy - 4.6], [20.6, cy], [12, cy + 4.6], [3.4, cy]], [1, 1.2, 1, 1.2])
    return [
      k.surf(dia(16.4), 'c2', { part: 'a', shine: 'none' }),
      k.surf(dia(11.8), 'c3', { part: 'a', shine: 'none' }),
      k.surf(dia(7.2), 'c1', { shineSize: 0.8 }),
    ]
  },
  'layout-dashboard': (icon, k) => [
    tile(k, 3, 3, 10, 12.5, 'c1', { shine: 'streak', shineSize: 0.6 }),
    tile(k, 14, 3, 21, 7.5, 'c2'),
    tile(k, 14, 11.5, 21, 21, 'c1', { shine: 'streak', shineSize: 0.6 }),
    tile(k, 3, 16.5, 10, 21, 'c3'),
  ],
  'layout-grid': (icon, k) => [
    tile(k, 3, 3, 10, 10, 'c1'),
    tile(k, 14, 3, 21, 10, 'c2'),
    tile(k, 3, 14, 10, 21, 'c1'),
    tile(k, 14, 14, 21, 21, 'c1'),
  ],
  'layout-list': (icon, k) => [
    tile(k, 3, 3.5, 9, 9.5, 'c2'),
    tile(k, 3, 14.5, 9, 20.5, 'c1'),
    k.tube(['M13 4.8 H20.6', 'M13 8.4 H17.4'], 'c3', { part: 'a', w: 1.4, ol: 0.42 }),
    k.tube(['M13 15.8 H20.6', 'M13 19.4 H17.4'], 'c3', { part: 'a', w: 1.4, ol: 0.42 }),
  ],
}

// ---------------------------------------------------------------------------
// list rows: sky tubes
const rows = (k, lines, o = {}) => k.tube(lines, o.role || 'c1', { w: o.w ?? 1.6, ol: 0.45, part: o.part || 'k' })
// a united arrow shaft + head pointing east from x0 to x1 at y (head length hl, half height hh)
const arrowE = (k, x0, x1, y, o = {}) => {
  const hl = o.hl ?? 5.6, hh = o.hh ?? 5.4, sw = o.sw ?? 1.6
  return k.unite(k.rr(x0, y - sw, x1 - hl + 1, y + sw, sw * 0.9), k.poly([[x1 - hl, y - hh], [x1, y], [x1 - hl, y + hh]], [0.9, 1, 0.9]))
}
// corner arrow (maximize / minimize): an L head at (hx, hy) opening toward dir (1/-1, 1/-1) with a shaft
const cornerArrow = (k, hx, hy, dx, dy, tail, inward) => {
  const L = 6
  const head = inward
    ? k.poly([[hx, hy - dy * L], [hx, hy], [hx - dx * L, hy]], [0.7, 0.9, 0.7])
    : k.poly([[hx - dx * L, hy], [hx, hy], [hx, hy - dy * L]], [0.7, 0.9, 0.7])
  return k.unite(k.stroke([[hx, hy - dy * L], [hx, hy], [hx - dx * L, hy]], 2.4), head, k.seg(hx - dx * 1, hy - dy * 1, tail[0], tail[1], 2.4))
}

const C = {
  'layout-template': (icon, k) => [
    tile(k, 3, 3, 21, 8.5, 'c1', { shine: 'streak', shineSize: 0.7 }),
    tile(k, 3, 12.5, 10, 21, 'c2'),
    rows(k, ['M14 13.6 H20.4', 'M14 17 H20.4', 'M14 20.2 H17.6'], { role: 'c3', w: 1.4, part: 'a' }),
  ],
  // ---------------------------------------------------------------- nature
  leaf: (icon, k) => [
    k.tube('M3.4 20.6 C4.6 19.4 5.6 18.4 6.6 17.4', 'c4', { part: 'a', w: 1.3, ol: 0.45 }),
    k.surf(k.path('M5.5 18.5 C3.5 10.5 9.5 3.5 20.5 3.5 C20.5 14.5 13.5 20.5 5.5 18.5 Z'), 'c4', { shineSize: 0.9 }),
    k.ink(['M6.6 17.4 C9.8 14 12.6 11.2 16.4 7.8', 'M10.4 13.6 L10.2 10.4', 'M13.2 10.8 L13.4 7.8', 'M10.6 13.4 L13.8 13.6', 'M13.4 10.6 L16.6 10.8'], { part: 'a', role: 'tint', w: 0.65, shift: 0 }),
    k.sparkleAt(5, 5, 1.6, { mx: 1, my: 1 }),
  ],
  // ---------------------------------------------------------------- books
  library: (icon, k) => [
    k.surf(k.rr(3.5, 3.5, 8.3, 19.8, 1), 'c1', { shine: 'none' }),
    k.ink([[[3.9, 6.6], [7.9, 6.6]], [[3.9, 16.8], [7.9, 16.8]]], { w: 0.8, taper: false }),
    k.surf(k.rr(8.7, 6.5, 12.5, 19.8, 1), 'c2', { shine: 'none' }),
    k.ink([[[9.1, 9.4], [12.1, 9.4]], [[9.1, 16.8], [12.1, 16.8]]], { w: 0.8, taper: false }),
    k.surf(k.path('M16.97 20.04 L19.38 19.39 C19.91 19.25 20.23 18.7 20.09 18.17 L17.11 7.26 C16.97 6.73 16.42 6.41 15.89 6.55 L13.47 7.2 C12.94 7.34 12.62 7.89 12.76 8.43 L15.74 19.33 C15.88 19.86 16.43 20.18 16.97 20.04 Z'), 'c3', { part: 'a', shine: 'dot', shineSize: 0.6 }),
    k.surf(k.rr(2.6, 19.6, 21.4, 21.4, 0.8), 'tint', { shine: 'none', ol: 0.45 }),
  ],
  // ---------------------------------------------------------------- light
  lightbulb: (icon, k) => [
    k.ink([[[3.2, 4.4], [4.8, 5.4]], [[20.8, 4.4], [19.2, 5.4]], [[2.6, 10.2], [4.2, 10.2]], [[21.4, 10.2], [19.8, 10.2]]], { part: 'deco', role: 'c3', w: 1, taper: false, shift: 0 }),
    k.surf(k.path('M9 15.8 C9 14.05 5.2 12.55 5.2 9.3 C5.2 5.54 8.24 2.6 12 2.6 C15.76 2.6 18.8 5.54 18.8 9.3 C18.8 12.55 15 14.05 15 15.8 Z'), 'c3', { shine: 'glint', shineSize: 0.9 }),
    k.ink(['M12 15.6 V12.8', 'M9.8 10.6 L12 12.8 L14.2 10.6'], { part: 'a', role: 'accent', w: 0.8, taper: false, shift: 0 }),
    k.surf(k.rr(8.8, 15.4, 15.2, 19.4, [0.4, 0.4, 1.2, 1.2]), 'c1', { shine: 'none', ol: 0.45 }),
    k.ink([[[9.3, 17.4], [14.7, 17.4]]], { w: 0.7, taper: false }),
    k.surf(k.rr(10.4, 19.2, 13.6, 21.2, [0.2, 0.2, 1.2, 1.2]), 'c1', { shine: 'none', ol: 0.4 }),
  ],
  // ---------------------------------------------------------------- link
  link: (icon, k) => {
    const loop = (cx, cy) => k.rot(k.cut(k.pill(cx - 5.4, cy - 2.9, cx + 5.4, cy + 2.9), k.pill(cx - 3.5, cy - 1.05, cx + 3.5, cy + 1.05)), -45, cx, cy)
    const a = loop(9.3, 14.7), b = loop(14.7, 9.3)
    return [
      k.surf(a, 'c1', { shineSize: 0.7 }),
      k.surf(b, 'c2', { part: 'a', shineSize: 0.7 }),
      k.surf(k.clip(a, k.circle(13.3, 13.4, 1.6)), 'c1', { shine: 'none', ol: 0.4, cast: false }),
    ]
  },
  // ---------------------------------------------------------------- lists
  'list-checks': (icon, k) => [
    rows(k, ['M12.4 6 H20.6', 'M12.4 12 H20.6', 'M12.4 18 H20.6']),
    k.surf(k.stroke([[3, 6], [4.8, 7.8], [8.2, 4]], 2), 'c4', { part: 'a', shine: 'none', ol: 0.45 }),
    k.surf(k.stroke([[3, 18], [4.8, 19.8], [8.2, 16]], 2), 'c4', { part: 'a', shine: 'none', ol: 0.45 }),
  ],
  'indent-decrease': (icon, k) => [
    rows(k, ['M3.6 4.6 H20.4', 'M13 9.6 H20.4', 'M13 14.4 H20.4', 'M3.6 19.4 H20.4']),
    k.surf(k.unite(k.rr(5.4, 10.9, 10, 13.1, 1), k.poly([[7, 7.8], [2.8, 12], [7, 16.2]], [0.6, 0.7, 0.6])), 'c2', { part: 'a', shine: 'none', ol: 0.45 }),
  ],
  'indent-increase': (icon, k) => [
    rows(k, ['M3.6 4.6 H20.4', 'M13 9.6 H20.4', 'M13 14.4 H20.4', 'M3.6 19.4 H20.4']),
    k.surf(k.unite(k.rr(2.8, 10.9, 7.4, 13.1, 1), k.poly([[6, 7.8], [10.2, 12], [6, 16.2]], [0.6, 0.7, 0.6])), 'c2', { part: 'a', shine: 'none', ol: 0.45 }),
  ],
  'list-filter': (icon, k) => [
    k.surf(k.pill(3, 4.8, 21, 7.4), 'c1', { shineSize: 0.7 }),
    k.surf(k.pill(6.4, 10.7, 17.6, 13.3), 'c2', { shine: 'dot', shineSize: 0.55 }),
    k.surf(k.pill(9.4, 16.6, 14.6, 19.2), 'c3', { shine: 'none' }),
  ],
  'list-music': (icon, k) => [
    rows(k, ['M3.6 6 H12.6', 'M3.6 12 H11.6', 'M3.6 18 H8.4']),
    k.surf(k.unite(k.ellipse(14.8, 17.6, 2.8, 2.3, -20), k.rr(16.5, 4, 18.5, 17.6, 0.9), k.path('M17.4 3.8 C18.6 6 21.4 6.6 21.4 9.6 C21.4 10.4 21.1 11 20.6 11.5 C20.6 9.2 18.6 8.6 17.4 8.2 Z')), 'c2', { part: 'a', shineSize: 0.7 }),
  ],
  'list-ordered': (icon, k) => [
    rows(k, ['M12 6.2 H20.6', 'M12 12 H20.6', 'M12 18 H20.6']),
    k.tube(['M3.8 5 L5.6 3.6 V9.2', 'M3.8 9.4 H7.4'], 'c2', { part: 'a', w: 1.2, ol: 0.4 }),
    k.tube(['M3.8 16.4 C4 15.4 4.7 14.9 5.6 14.9 C6.8 14.9 7.5 15.7 7.5 16.8 C7.5 17.6 7.1 17.9 6.5 18.4 L3.8 20.6 H7.6'], 'c2', { part: 'a', w: 1.2, ol: 0.4 }),
  ],
  'list-plus': (icon, k) => [
    rows(k, ['M3.6 6 H20.4', 'M3.6 12 H14.4', 'M3.6 18 H10.6']),
    ...badge(k, 17.8, 17.6, 3.7, 'c4', [[[17.8, 15.7], [17.8, 19.5]], [[15.9, 17.6], [19.7, 17.6]]], { w: 1.3 }),
  ],
  list: (icon, k) => [
    rows(k, ['M9.4 6 H20.6', 'M9.4 12 H20.6', 'M9.4 18 H20.6']),
    ...[6, 12, 18].map(y => k.surf(k.circle(4.6, y, 1.6), 'c2', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.42 })),
  ],
  // eight soft spokes, sky on the axes and sakura on the diagonals
  loader: (icon, k) => [
    ...[0, 90, 180, 270].map(a => k.surf(k.rot(k.pill(10.8, 2.6, 13.2, 7.6), a, 12, 12), 'c1', { shine: 'none', ol: 0.45 })),
    ...[45, 135, 225, 315].map(a => k.surf(k.rot(k.pill(11, 3.6, 13, 7.6), a, 12, 12), 'c2', { part: 'a', shine: 'none', ol: 0.42 })),
  ],
  // ---------------------------------------------------------------- doors
  'log-in': (icon, k) => [
    k.surf(k.stroke('M14.4 3.8 H18 C19.4 3.8 20.2 4.6 20.2 6 V18 C20.2 19.4 19.4 20.2 18 20.2 H14.4', 2.6), 'c1', { shineSize: 0.6 }),
    k.speed(3.2, 12, 180, { n: 2, len: 2, gap: 4.6, w: 0.6 }),
    k.surf(arrowE(k, 3.6, 16.6, 12, { hl: 5.4, hh: 5.2, sw: 1.5 }), 'c2', { part: 'a', shineSize: 0.7 }),
  ],
  'log-out': (icon, k) => [
    k.surf(k.stroke('M9.6 3.8 H6 C4.6 3.8 3.8 4.6 3.8 6 V18 C3.8 19.4 4.6 20.2 6 20.2 H9.6', 2.6), 'c1', { shineSize: 0.6 }),
    k.surf(arrowE(k, 8.2, 21.2, 12, { hl: 5.4, hh: 5.2, sw: 1.5 }), 'c2', { part: 'a', shineSize: 0.7 }),
  ],
  // ---------------------------------------------------------------- travel
  luggage: (icon, k) => {
    const body = k.rr(5, 5.6, 19, 18.8, 2.2)
    return [
      k.tube('M9.6 5.6 V4 C9.6 3.4 10 3 10.6 3 H13.4 C14 3 14.4 3.4 14.4 4 V5.6', 'c1', { part: 'a', w: 1.2, ol: 0.42 }),
      k.surf(k.join(k.circle(8, 20.4, 1.1), k.circle(16, 20.4, 1.1)), 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.3 }),
      k.surf(body, 'c2', { shineSize: 0.8 }),
      k.surf(k.clip(body, k.join(k.rect(8.9, 4, 10.3, 20), k.rect(13.7, 4, 15.1, 20))), 'c3', { part: 'a', shine: 'none', cast: false, ol: 0.3, shade: 0.6 }),
      k.sparkleAt(20.8, 4, 1.4, { mx: -1, my: 1 }),
    ]
  },
  // ---------------------------------------------------------------- mail
  'mail-check': (icon, k) => [
    k.surf(k.rr(2.6, 4.6, 21.4, 19.2, 2), 'tint', { shine: 'none' }),
    k.ink([[3.6, 18.2], [9.6, 12.6]], { part: 'a' }),
    k.surf(k.poly([[2.9, 5.2], [21.1, 5.2], [12, 13]], [0.9, 0.9, 1.4]), 'tint', { part: 'a', shine: 'none' }),
    ...badge(k, 17.6, 17.4, 4, 'c4', [[[15.8, 17.5], [17.1, 18.8], [19.6, 16.1]]], { w: 1.35 }),
  ],
  // the flap folded up into a tall sakura-lined peak, a cream letter rising out with a sakura edge
  'mail-open': (icon, k) => [
    k.surf(k.path('M2.6 11.2 L11 3 C11.6 2.4 12.4 2.4 13 3 L21.4 11.2 V19 C21.4 20.1 20.5 21 19.4 21 H4.6 C3.5 21 2.6 20.1 2.6 19 Z'), 'tint', { shine: 'none' }),
    k.surf(k.poly([[3.8, 11], [12, 3.6], [20.2, 11]], [0.4, 0.9, 0.4]), 'c2', { inset: true, ol: 0, shine: 'none', shade: 0.6 }),
    k.surf(k.rr(6.4, 8.4, 17.6, 16, 1), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.clip(k.rr(6.4, 8.4, 17.6, 16, 1), k.rect(6, 8, 18, 9.8)), 'c2', { part: 'a', shine: 'none', cast: false, ol: 0.3, shade: 0 }),
    k.surf(k.heartShape(12, 12.4, 0.2), 'accent', { part: 'a', shine: 'dot', shineSize: 0.55, ol: 0.38 }),
    k.surf(k.path('M2.6 11.4 L12 17.2 L21.4 11.4 V19 C21.4 20.1 20.5 21 19.4 21 H4.6 C3.5 21 2.6 20.1 2.6 19 Z'), 'tint', { shine: 'none' }),
    k.ink([[[3.6, 20], [9.4, 15.4]], [[20.4, 20], [14.6, 15.4]]], { w: 0.75 }),
  ],
  // ---------------------------------------------------------------- navigation
  'map-pin': (icon, k) => [
    k.ground(12, 20.7, 4.2, 0.9),
    k.surf(k.path('M18.8 9.6 C18.8 13.8 15.2 17.4 12 20.2 C8.8 17.4 5.2 13.8 5.2 9.6 C5.2 5.8 8.2 2.8 12 2.8 C15.8 2.8 18.8 5.8 18.8 9.6 Z'), 'accent', { shineSize: 0.9 }),
    k.surf(k.circle(12, 9.6, 2.7), 'tint', { part: 'a', inset: true, ol: 0.4, shine: 'none', shade: 0.6 }),
  ],
  map: (icon, k) => [
    k.surf(k.poly([[3, 6], [9, 3.6], [9, 18], [3, 20.4]], [0.8, 0.4, 0.4, 0.8]), 'c4', { shine: 'none' }),
    k.surf(k.poly([[9, 3.6], [15, 6], [15, 20.4], [9, 18]], [0.4, 0.4, 0.4, 0.4]), 'c1', { part: 'a', shine: 'none', shade: 1.3 }),
    k.surf(k.poly([[15, 6], [21, 3.6], [21, 18], [15, 20.4]], [0.4, 0.8, 0.8, 0.4]), 'c4', { shine: 'none' }),
    k.surf(k.drop(17.9, 11.2, 1.4, 17.9, 14.4), 'accent', { part: 'a', shine: 'dot', shineSize: 0.45, ol: 0.38 }),
    k.paint(k.join(k.circle(5.6, 15, 0.45), k.circle(7.4, 13.2, 0.45), k.circle(10.2, 12.8, 0.45), k.circle(12.6, 12.2, 0.45), k.circle(14.8, 11.6, 0.45)), 'tint', { part: 'a' }),
  ],
  maximize: (icon, k) => [
    k.surf(cornerArrow(k, 20.2, 3.8, 1, -1, [14.4, 9.6], false), 'c1', { shineSize: 0.6 }),
    k.surf(cornerArrow(k, 3.8, 20.2, -1, 1, [9.6, 14.4], false), 'c1', { part: 'a', shine: 'none' }),
  ],
  minimize: (icon, k) => [
    k.surf(k.unite(k.stroke([[14.2, 4.4], [14.2, 9.8], [19.6, 9.8]], 2.4), k.seg(15.2, 8.8, 20.2, 3.8, 2.4)), 'c1', { shineSize: 0.6 }),
    k.surf(k.unite(k.stroke([[4.4, 14.2], [9.8, 14.2], [9.8, 19.6]], 2.4), k.seg(8.8, 15.2, 3.8, 20.2, 2.4)), 'c1', { part: 'a', shine: 'none' }),
  ],
  // ---------------------------------------------------------------- awards
  medal: (icon, k) => [
    k.surf(k.poly([[4.6, 2.6], [9.4, 2.6], [13.2, 10.6], [9.4, 12.8]], [0.5, 0.5, 0.5, 0.5]), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.poly([[19.4, 2.6], [14.6, 2.6], [10.8, 10.6], [14.6, 12.8]], [0.5, 0.5, 0.5, 0.5]), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.circle(12, 15.8, 5.2), 'c3', { shineSize: 0.85 }),
    k.surf(k.starShape(12, 16.1, 2.7, 1.25, 0.3), 'accent', { shine: 'none', ol: 0.35, shade: 0 }),
    k.sparkleAt(19.6, 15.6, 1.4, { mx: -1, my: -1 }),
  ],
  // ---------------------------------------------------------------- media
  megaphone: (icon, k) => {
    const horn = k.path('M5.35 9.89 L8.64 8.7 C11.53 7.42 13 5.43 14.54 3.21 C14.95 2.6 16.05 2.75 16.3 3.44 L20.11 13.9 C20.36 14.6 19.65 15.4 18.91 15.21 C16.3 14.5 13.89 13.93 10.86 14.8 L7.57 16 C6.53 16.38 5.39 15.85 5.01 14.81 L4.15 12.46 C3.77 11.42 4.31 10.27 5.35 9.89 Z')
    return [
      k.surf(k.path('M9.55 15.28 L9.62 19.38 C9.64 20.35 8.86 21.13 7.89 21.15 C6.92 21.17 6.14 20.4 6.12 19.45 L6.06 15.94 Z'), 'c3', { part: 'a', shine: 'none', ol: 0.45 }),
      k.surf(horn, 'c1', { shineSize: 0.8 }),
      k.surf(k.clip(horn, k.poly([[-1, -1], [5.31, -0.45], [13.08, 20.9], [-1, 24]])), 'c2', { part: 'a', shine: 'none', cast: false, ol: 0.35 }),
    ]
  },
  // ---------------------------------------------------------------- faces
  // a sky "meh" face: flat mouth, half-lidded eyes and the anime sweat drop
  meh: (icon, k) => [
    k.surf(k.circle(11.6, 12.4, 8.9), 'c1', { shine: 'none' }),
    k.paint(k.join(k.ellipse(8.6, 11.2, 0.7, 1.05), k.ellipse(14.6, 11.2, 0.7, 1.05)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(8.4, 10.8, 0.27), k.circle(14.4, 10.8, 0.27))),
    k.ink([[[7.4, 9.1], [9.8, 9.1]], [[13.4, 9.1], [15.8, 9.1]]], { part: 'a', w: 0.8, taper: false }),
    k.ink([[[8.6, 16], [14.6, 16]]], { part: 'a', w: 1.1 }),
    k.shine(k.lens(5.2, 10.2, 7.6, 6, 0.7)),
    k.deco(k.drop(19.6, 6.2, 1.25, 19.6, 3), 'edge', { ol: 0.35 }),
  ],
}

// ---------------------------------------------------------------------------
// round speech balloon with a tail at the lower left
const balloon = k => k.unite(k.circle(12.6, 11.2, 8.6), k.poly([[4.4, 13.6], [9.6, 18.6], [2.8, 21.2]], [0.4, 0.4, 0.6]))
// square speech balloon
const squareBalloon = k => k.unite(k.rr(3, 3.6, 21, 17.4, 2.2), k.poly([[3, 14], [8.6, 17.2], [3, 21]], [0, 0.4, 0.8]))
// microphone parts
const micOps = (k, cap = 'c2') => [
  k.tube('M5.8 11 C5.8 14.6 8.6 17.2 12 17.2 C15.4 17.2 18.2 14.6 18.2 11', 'c1', { part: 'a', w: 1.6, ol: 0.45 }),
  k.surf(k.rr(11.1, 16.8, 12.9, 20.2, 0.4), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
  k.surf(k.pill(8, 19.6, 16, 21.6), 'c1', { part: 'a', shine: 'none', ol: 0.45 }),
  k.surf(k.pill(8.8, 2.6, 15.2, 14.4), cap, { shineSize: 0.75 }),
  k.ink([[[10.8, 7.2], [13.2, 7.2]], [[10.8, 9.6], [13.2, 9.6]]], { w: 0.7, taper: false, shift: 0 }),
]

const D = {
  'minus-circle': (icon, k) => [
    orb(k, 'accent'),
    glyph(k, [[[7.8, 12], [16.2, 12]]], { w: 2.3 }),
  ],
  minus: (icon, k) => [k.surf(k.pill(4.4, 10.6, 19.6, 13.4), 'c1', { shineSize: 0.7 })],
  menu: (icon, k) => [
    k.surf(k.pill(3.4, 4.8, 20.6, 7.4), 'c1', { shineSize: 0.7 }),
    k.surf(k.pill(3.4, 10.7, 20.6, 13.3), 'c1', { shine: 'none' }),
    k.surf(k.pill(3.4, 16.6, 20.6, 19.2), 'c1', { shine: 'none' }),
  ],
  // ---------------------------------------------------------------- chat
  'message-circle': (icon, k) => [
    k.surf(balloon(k), 'c1', { shineSize: 1 }),
  ],
  'message-circle-more': (icon, k) => [
    k.surf(balloon(k), 'c1', { shineSize: 1 }),
    k.paint(k.join(k.circle(8.6, 11.4, 1.25), k.circle(12.6, 11.4, 1.25), k.circle(16.6, 11.4, 1.25)), 'tint', { part: 'a' }),
  ],
  'message-square': (icon, k) => [
    k.surf(squareBalloon(k), 'c2', { shineSize: 1 }),
  ],
  'message-square-text': (icon, k) => [
    k.surf(squareBalloon(k), 'c2', { shineSize: 0.9 }),
    glyph(k, [[[7.4, 8.6], [16.6, 8.6]], [[7.4, 12.4], [13, 12.4]]], { w: 1.5 }),
  ],
  messages: (icon, k) => [
    k.surf(k.unite(k.rr(9, 8, 21, 17.6, 2), k.poly([[21, 13], [21, 21], [16.4, 17]], [0, 0.8, 0.4])), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.unite(k.rr(3, 3, 15, 12.6, 2), k.poly([[3, 9], [7.6, 12.4], [3, 16]], [0, 0.4, 0.8])), 'c1', { shineSize: 0.8 }),
    k.paint(k.join(k.circle(6.6, 7.8, 0.85), k.circle(9, 7.8, 0.85), k.circle(11.4, 7.8, 0.85)), 'tint'),
  ],
  // ---------------------------------------------------------------- audio
  microphone: (icon, k) => micOps(k),
  'microphone-off': (icon, k) => [...micOps(k, 'tint'), ...slash(k)],
  // ---------------------------------------------------------------- science
  microscope: (icon, k) => [
    k.tube('M12 5.6 C16.5 6 19 9.5 19 13.25 C19 16.75 17 19.2 14.2 20.4', 'c1', { w: 1.9, ol: 0.45 }),
    k.surf(k.rr(7.2, 15.4, 18.4, 17.4, 0.7), 'c3', { part: 'a', shine: 'none', ol: 0.42 }),
    k.surf(k.rr(8.8, 14.2, 14, 15.4, 0.3), 'edge', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
    k.surf(k.rot(k.poly([[9.6, 9.6], [12, 9.6], [11.5, 13.1], [10.1, 13.1]], 0.4), -30, 10.8, 11.4), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rot(k.rr(7.1, 3.6, 10.7, 11.4, 1), -30, 8.9, 7), 'c2', { part: 'a', shineSize: 0.6 }),
    k.surf(k.rot(k.rr(7.5, 1.9, 10.3, 3.9, 0.6), -30, 8.9, 7), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.pill(4.4, 19.6, 19.6, 21.6), 'c1', { shine: 'none', ol: 0.45 }),
  ],
  // ---------------------------------------------------------------- devices
  monitor: (icon, k) => [
    k.surf(k.rr(11, 15.6, 13, 20, 0.4), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.pill(7.4, 19.4, 16.6, 21.4), 'c1', { part: 'a', shine: 'none', ol: 0.45 }),
    k.surf(k.rr(2.4, 3.6, 21.6, 16.4, 2.2), 'c1', { shine: 'none' }),
    k.surf(k.rr(4.4, 5.6, 19.6, 14.2, 1), 'ink', { inset: true, ol: 0, shine: 'glass', shade: 0 }),
  ],
  // ---------------------------------------------------------------- sky
  moon: (icon, k) => [
    k.surf(k.cut(k.circle(11.4, 12.8, 8.6), k.circle(17.4, 7.2, 7.1)), 'c3', { shineSize: 0.9 }),
    k.sparkleAt(16.6, 9.2, 1.9, { mx: 1, my: -1 }),
  ],
  'more-horizontal': (icon, k) => [
    k.surf(k.circle(5, 12, 2), 'c1', { shine: 'dot', shineSize: 0.55, ol: 0.45 }),
    k.surf(k.circle(12, 12, 2), 'c2', { shine: 'dot', shineSize: 0.55, ol: 0.45 }),
    k.surf(k.circle(19, 12, 2), 'c3', { shine: 'dot', shineSize: 0.55, ol: 0.45 }),
  ],
  'more-vertical': (icon, k) => [
    k.surf(k.circle(12, 5, 2), 'c1', { shine: 'dot', shineSize: 0.55, ol: 0.45 }),
    k.surf(k.circle(12, 12, 2), 'c2', { shine: 'dot', shineSize: 0.55, ol: 0.45 }),
    k.surf(k.circle(12, 19, 2), 'c3', { shine: 'dot', shineSize: 0.55, ol: 0.45 }),
  ],
  // ---------------------------------------------------------------- vehicles
  // sakura tank, sky seat and fork, gold engine and headlight, ink tyres with sky hubs (they hold in dark mode)
  motorcycle: (icon, k) => [
    k.speed(4.4, 10.4, 180, { n: 2, len: 1.8, gap: 1.6, w: 0.6 }),
    k.tube(['M5.6 17 L9.4 13.6 H12', 'M18.4 17 L16 8.8 L14.6 8.2'], 'c1', { w: 1.2, ol: 0.42 }),
    k.surf(k.circle(5.6, 17, 3.1), 'ink', { shine: 'none', shade: 0, ol: 0.35 }),
    k.surf(k.circle(5.6, 17, 1.55), 'c1', { shine: 'none', shade: 0, ol: 0, cast: false, casts: false }),
    k.surf(k.circle(18.4, 17, 3.1), 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.35 }),
    k.surf(k.circle(18.4, 17, 1.55), 'c1', { part: 'a', shine: 'none', shade: 0, ol: 0, cast: false, casts: false }),
    k.surf(k.rr(10, 13, 14, 16.2, 1), 'c3', { shine: 'none', ol: 0.4 }),
    k.surf(k.pill(5.2, 10.4, 10.6, 12.4), 'c1', { shine: 'none', ol: 0.42 }),
    k.surf(k.path('M9.6 11.8 C9.8 10.2 11 9.4 12.6 9.4 H14.6 C15.7 9.4 16.3 10.3 15.9 11.3 L15.1 13.4 H10.6 C9.9 13.4 9.5 12.7 9.6 11.8 Z'), 'c2', { shineSize: 0.7 }),
    k.surf(k.circle(17.6, 10.8, 1.1), 'c3', { shine: 'none', ol: 0.38, shade: 0 }),
  ],
  // ---------------------------------------------------------------- nature
  mountain: (icon, k) => {
    const big = k.poly([[2.4, 20.2], [9.5, 5.2], [16.6, 20.2]], [0.8, 1, 0.8])
    const small = k.poly([[11.4, 20.2], [16.6, 10.2], [21.6, 20.2]], [0.6, 0.9, 0.8])
    return [
      k.surf(small, 'c4', { part: 'a', shine: 'none' }),
      k.surf(k.clip(small, k.poly([[12, 6], [22, 6], [22, 13.4], [18.2, 13.4], [17.4, 14.6], [16.6, 13.6], [15.6, 14.8], [14.8, 13.4], [12, 13.4]])), 'tint', { part: 'a', shine: 'none', cast: false, ol: 0.3, shade: 0.6 }),
      k.surf(big, 'c1', { shine: 'none' }),
      k.surf(k.clip(big, k.poly([[2, 2], [17, 2], [17, 10.2], [12.4, 10.2], [11.4, 12], [10.2, 10.4], [8.8, 12.2], [7.6, 10.2], [2, 10.2]])), 'tint', { shine: 'none', cast: false, ol: 0.35, shade: 0.6 }),
      k.sparkleAt(19.8, 4.6, 1.6, { mx: -1, my: 1 }),
    ]
  },
  mouse: (icon, k) => [
    k.surf(k.rr(5.6, 2.6, 18.4, 21.4, 6.4), 'c1', { shineSize: 0.85 }),
    k.ink([[[6.2, 12.6], [17.8, 12.6]], [[12, 3.2], [12, 5.2]]], { part: 'a', w: 0.8, taper: false }),
    k.surf(k.pill(10.9, 5.6, 13.1, 9.8), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
  ],
  move: (icon, k) => {
    const head = deg => k.rot(k.poly([[12, 2.6], [16.4, 7], [7.6, 7]], [0.6, 0.8, 0.8]), deg, 12, 12)
    return [
      k.surf(k.unite(k.rr(10.7, 5, 13.3, 19, 0.6), k.rr(5, 10.7, 19, 13.3, 0.6), head(0), head(90), head(180), head(270)), 'c1', { shineSize: 0.7 }),
      k.surf(k.circle(12, 12, 1.5), 'c2', { part: 'a', shine: 'none', ol: 0.38, shade: 0 }),
    ]
  },
  navigation: (icon, k) => [
    k.speed(7.6, 16.6, 135, { n: 3, len: 3.2, gap: 1.7, w: 0.6 }),
    k.surf(k.poly([[20.4, 3.6], [13.5, 20.6], [10.6, 13.4], [3.4, 10.5]], [0.8, 0.9, 0.5, 0.9]), 'c1', { shineSize: 0.85 }),
  ],
  network: (icon, k) => [
    k.tube(['M12 7.6 V16.8', 'M4.2 16.8 V12.4 H19.8 V16.8'], 'c3', { part: 'a', w: 1.1, ol: 0.4 }),
    k.surf(k.rr(8.4, 2.6, 15.6, 7.8, 1.6), 'c1', { shineSize: 0.6 }),
    k.surf(k.rr(2.4, 16.6, 6.2, 21.2, 1.1), 'c2', { shine: 'dot', shineSize: 0.45, ol: 0.42 }),
    k.surf(k.rr(10.1, 16.6, 13.9, 21.2, 1.1), 'c2', { shine: 'dot', shineSize: 0.45, ol: 0.42 }),
    k.surf(k.rr(17.8, 16.6, 21.6, 21.2, 1.1), 'c2', { shine: 'dot', shineSize: 0.45, ol: 0.42 }),
  ],
  // ---------------------------------------------------------------- paper
  newspaper: (icon, k) => [
    k.surf(k.path('M7 9 H4.5 C3.67 9 3 9.67 3 10.5 V18.5 C3 19.33 3.67 20 4.5 20 C5.88 20 7 18.88 7 17.5 Z'), 'c2', { shine: 'none', ol: 0.45 }),
    k.surf(k.path('M4.5 20 H19 C20.1 20 21 19.1 21 18 V6 C21 4.9 20.1 4 19 4 H9 C7.9 4 7 4.9 7 6 V17.5 C7 18.88 5.88 20 4.5 20 Z'), 'tint', { shine: 'none' }),
    k.surf(k.rr(10, 7, 18, 11.6, 0.9), 'c1', { part: 'a', inset: true, ol: 0.35, shine: 'glass', shineSize: 0.5 }),
    k.ink([[[10.4, 14.6], [17.6, 14.6]], [[10.4, 17.2], [15.4, 17.2]]], { part: 'a', w: 0.85 }),
  ],
  notebook: (icon, k) => [
    k.surf(k.rr(6, 2.6, 20, 21.4, 2.2), 'c2', { shineSize: 0.8 }),
    k.surf(k.rr(6, 2.6, 8.4, 21.4, [2.2, 0, 0, 2.2]), 'c2', { shine: 'none', cast: false, ol: 0.35, shade: 1.6 }),
    k.surf(k.rr(11, 5.8, 17.4, 9.6, 0.8), 'tint', { part: 'a', shine: 'none', ol: 0.35 }),
    k.ink([[[12.2, 7.7], [16.2, 7.7]]], { part: 'a', w: 0.7, taper: false }),
    ...[7, 12, 17].map(y => k.surf(k.pill(3.4, y - 0.9, 8.4, y + 0.9), 'c3', { part: 'a', shine: 'none', ol: 0.4 })),
  ],
}
export const R = { ...A, ...B, ...C, ...D }
