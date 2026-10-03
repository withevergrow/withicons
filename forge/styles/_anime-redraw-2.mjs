// ANIME redraws, chunk 2: hand-drawn icons for this chunk's batch (see forge/styles/ANIME-GUIDE.md).
// Each entry: name -> (icon, k) => ops, built with the frozen kit (k = prim + kit, see _anime-kit.mjs).
// The exemplars in _anime-render.mjs (EXEMPLAR) win over any entry here.
//
// Families drawn here (local helpers below):
//   disc buttons  circle-*: a glossy coloured orb with a raised cream glyph (A plate)
//   clipboards    sky board, cream sheet, gold clip (A)
//   clouds        the exemplar cream cloud lifted up, with weather or a sky arrow badge under it
//   files         the exemplar page; the dog-ear takes the colour of the glyph so each type reads at 16px
//   folders       the exemplar gold folder, with a cream glyph on the front flap

// ---------------------------------------------------------------------------
// local helpers

// a right-pointing arrow (shaft + soft head) centred on (cx, cy); rotate it for the other directions
const arrowR = (k, cx = 12, cy = 12, s = 1) => k.unite(
  k.rr(cx - 4.6 * s, cy - 1.2 * s, cx + 3.4 * s, cy + 1.2 * s, 1.1 * s),
  k.poly([[cx + 0.2 * s, cy - 5 * s], [cx + 5.4 * s, cy], [cx + 0.2 * s, cy + 5 * s]], [0.8 * s, 0.9 * s, 0.8 * s]),
)
const arrowDir = (k, deg, cx = 12, cy = 12, s = 1) => k.rot(arrowR(k, cx, cy, s), deg, cx, cy)

// a glossy orb button with a raised cream glyph
const orb = (k, role, glyph, o = {}) => [
  k.surf(k.circle(12, 12, 9.2), role, { shineSize: 1, ...o.disc }),
  ...(glyph ? [k.surf(glyph, 'tint', { part: 'a', shine: 'none', ol: 0.42, shade: 0.7, ...o.glyph })] : []),
]

// clipboard: sky board, cream sheet, gold clip
const board = (k) => [
  k.surf(k.rr(4.4, 4.4, 19.6, 21.4, 2.2), 'c1', { shineSize: 0.8 }),
  k.surf(k.rr(6.4, 7.2, 17.6, 19.6, 1.1), 'tint', { shine: 'none', ol: 0.35, casts: false }),
  k.surf(k.unite(k.rr(8.4, 3.6, 15.6, 7.6, 1.3), k.circle(12, 3.4, 1.5)), 'c3', { part: 'a', shine: 'dot', shineSize: 0.75, ol: 0.45 }),
  k.paint(k.circle(12, 3.4, 0.55), 'ink', { part: 'a' }),
]

// the cloud lifted to the top half (weather / transfer icons)
const upCloud = (k, cx = 12, cy = 8.9, s = 0.86) => k.surf(k.cloudShape(cx, cy, s), 'tint', { shine: 'none', rim: true, shade: 0.75 })
const cloudGloss = (k, cx = 12, cy = 8.9, s = 0.86) => k.shine(k.lens(cx - 3.4 * s, cy - 3.2 * s, cx - 0.6 * s, cy - 5.3 * s, 0.5 * s))

// file page (exemplar geometry) with the dog-ear in the glyph's colour
const FILE = { x0: 5, y0: 2.6, x1: 19.4, y1: 21.4, fold: 5 }
const sheet = (k, flapRole = 'c1') => {
  const p = k.page(FILE.x0, FILE.y0, FILE.x1, FILE.y1, FILE.fold, 2)
  return [
    k.surf(p.sheet, 'tint', { shine: 'none' }),
    k.surf(p.flap, flapRole, { part: 'a', shine: 'none', ol: 0.4 }),
  ]
}
// a glyph surface on a page (outlined, small shine)
const onPage = (k, shape, role, o = {}) => k.surf(shape, role, { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.4, ...o })

// badge files: a smaller page (two ink lines) with a big ~8u glyph overhanging its lower-right corner, moated
const sheetB = (k, flapRole = 'c1') => {
  const p = k.page(3.6, 2.6, 17.2, 20.4, 4.6, 2)
  return [
    k.surf(p.sheet, 'tint', { shine: 'none' }),
    k.surf(p.flap, flapRole, { part: 'a', shine: 'none', ol: 0.4 }),
    k.ink([[[6.4, 8.6], [11, 8.6]], [[6.4, 11.6], [13.6, 11.6]], [[6.4, 14.6], [9.6, 14.6]]], { w: 0.8 }),
  ]
}
const fileBadge = (k, role, glyph, o = {}) => [...sheetB(k, role), k.moat(glyph, 0.9), onPage(k, glyph, role, { ol: 0.45, shineSize: 0.7, ...o })]

// folder (exemplar geometry) with a closed front, and the front shape for glyph placement
const folderBack = (k) => k.surf(k.unite(k.rr(2.8, 6.4, 21.2, 19.8, 2), k.rr(2.8, 4.4, 10.6, 9, [1.6, 1.6, 0, 0]), k.poly([[9, 4.4], [10.6, 4.4], [12.6, 6.9], [9, 6.9]], [0, 0.8, 0, 0])), 'c3', { shine: 'none' })
const folderFront = (k) => k.surf(k.poly([[2.8, 9.2], [21.2, 9.2], [21.2, 19.8], [2.8, 19.8]], [1.2, 1.2, 2, 2]), 'c3', { shineSize: 0.9 })
const paperPeek = (k) => k.surf(k.rr(5, 7, 19.4, 13, 1.2), 'tint', { part: 'a', shine: 'none', ol: 0.4 })
const glyphOnFolder = (k, shape) => k.surf(shape, 'tint', { part: 's', shine: 'none', ol: 0.42, shade: 0.6 })

export const R = {
  // ---------------------------------------------------------------- disc buttons
  'circle-arrow-left': (icon, k) => orb(k, 'c1', arrowDir(k, 180, 11.8, 12, 0.95)),
  'circle-arrow-right': (icon, k) => orb(k, 'c1', arrowDir(k, 0, 12.2, 12, 0.95)),
  'circle-arrow-up': (icon, k) => orb(k, 'c1', arrowDir(k, -90, 12, 11.8, 0.95)),
  'circle-chevron-down': (icon, k) => orb(k, 'c1', k.stroke([[7.8, 10.2], [12, 14.4], [16.2, 10.2]], 2.7)),
  'circle-chevron-right': (icon, k) => orb(k, 'c1', k.stroke([[10.2, 7.8], [14.4, 12], [10.2, 16.2]], 2.7)),
  // a radio button: sky orb, cream well, sakura pip
  'circle-dot': (icon, k) => [
    k.surf(k.circle(12, 12, 9.2), 'c1', { shineSize: 1 }),
    k.surf(k.circle(12, 12, 5.6), 'tint', { inset: true, shine: 'none', ol: 0.42 }),
    k.surf(k.circle(12, 12, 2.7), 'c2', { part: 'a', shine: 'dot', shineSize: 0.75, ol: 0.4 }),
  ],
  'circle-pause': (icon, k) => orb(k, 'c2', k.join(k.rr(8.3, 7.4, 10.9, 16.6, 1.3), k.rr(13.1, 7.4, 15.7, 16.6, 1.3))),
  'circle-play': (icon, k) => orb(k, 'c2', k.poly([[9.4, 7.4], [16.8, 12], [9.4, 16.6]], [1.1, 1.2, 1.1])),
  'circle-stop': (icon, k) => orb(k, 'accent', k.rr(8.2, 8.2, 15.8, 15.8, 1.8)),
  // a glossy marble (no sparkle: a primitive must not read as "magic")
  circle: (icon, k) => [
    k.surf(k.circle(12, 12, 9), 'c1', { shineSize: 1.15, rim: true }),
  ],

  // ---------------------------------------------------------------- media / boards
  // sky slate, a cream clapper with ink stripes that snaps (A)
  clapperboard: (icon, k) => {
    const body = k.rr(3, 10.6, 21, 21, 2)
    const band = k.clip(body, k.rect(2, 9, 22, 13.4))
    const stripesB = k.clip(k.join(k.poly([[6, 10.4], [8.6, 10.4], [7, 13.6], [4.4, 13.6]]), k.poly([[11, 10.4], [13.6, 10.4], [12, 13.6], [9.4, 13.6]]), k.poly([[16, 10.4], [18.6, 10.4], [17, 13.6], [14.4, 13.6]])), band)
    const slab = k.poly([[3, 10.2], [20.6, 6.2], [19.8, 2.8], [2.3, 6.8]], [0.6, 0.6, 0.6, 0.6])
    const stripesA = k.clip(k.join(k.poly([[6.2, 9.8], [8.6, 5.4], [11.2, 4.8], [8.8, 9.2]]), k.poly([[11.4, 8.6], [13.8, 4.2], [16.4, 3.6], [14, 8]]), k.poly([[16.6, 7.4], [19, 3], [21.6, 2.4], [19.2, 6.8]])), slab)
    return [
      k.surf(body, 'c1', { shine: 'streak', shineSize: 0.8 }),
      k.surf(band, 'tint', { cast: false, shine: 'none', ol: 0 }),
      k.paint(stripesB, 'ink'),
      k.ink([[[6.4, 16.4], [12.6, 16.4]], [[6.4, 18.6], [10, 18.6]]], { w: 0.8, role: 'tint', shift: 0 }),
      k.surf(slab, 'tint', { part: 'a', shine: 'none' }),
      k.paint(stripesA, 'ink', { part: 'a' }),
      k.surf(k.circle(4.4, 9.4, 0.9), 'c3', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
    ]
  },
  clipboard: (icon, k) => [
    ...board(k),
    k.ink([[[8.6, 11], [15.4, 11]], [[8.6, 13.8], [15.4, 13.8]], [[8.6, 16.6], [12.6, 16.6]]], { w: 0.8 }),
  ],
  'clipboard-check': (icon, k) => [
    ...board(k),
    k.surf(k.stroke([[8.4, 13.6], [11, 16.2], [15.8, 10.8]], 2.3), 'c4', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.38 }),
  ],
  'clipboard-list': (icon, k) => [
    ...board(k),
    k.surf(k.join(k.circle(9, 11.3, 1.05), k.circle(9, 15.9, 1.05)), 'c2', { part: 'a', shine: 'none', ol: 0.32, shade: 0 }),
    k.ink([[[11.4, 11.3], [15.6, 11.3]], [[11.4, 15.9], [15.6, 15.9]]], { w: 0.9, part: 'a' }),
  ],
  // a sky alarm-free wall clock: glossy rim, cream face under glass, ink hands, sakura pin
  clock: (icon, k) => [
    k.surf(k.circle(12, 12, 9.3), 'c1', { shineSize: 1 }),
    k.surf(k.circle(12, 12, 7.1), 'tint', { inset: true, ol: 0.4, shine: 'glass', shade: 0.8 }),
    k.paint(k.join(k.circle(12, 6.4, 0.6), k.circle(17.6, 12, 0.6), k.circle(12, 17.6, 0.6), k.circle(6.4, 12, 0.6)), 'c1'),
    k.ink([[12, 7.8], [12, 12], [15.4, 13.8]], { w: 1.25, part: 'a', taper: 0.6 }),
    k.surf(k.circle(12, 12, 1.15), 'c2', { part: 'a', shine: 'none', ol: 0.32, shade: 0 }),
  ],
  // a fat sky cross with a gloss streak
  close: (icon, k) => [
    k.surf(k.stroke(['M6.2 6.2 L17.8 17.8', 'M17.8 6.2 L6.2 17.8'], 3.4), 'c1', { shineSize: 0.85 }),
  ],

  // ---------------------------------------------------------------- clouds
  'cloud-download': (icon, k) => {
    const a = arrowDir(k, 90, 12, 16.4, 0.9)
    return [upCloud(k), cloudGloss(k), k.moat(a, 0.75), k.surf(a, 'c1', { part: 's', shineSize: 0.7 })]
  },
  'cloud-upload': (icon, k) => {
    const a = arrowDir(k, -90, 12, 16.2, 0.9)
    return [upCloud(k), cloudGloss(k), k.moat(a, 0.75), k.surf(a, 'c1', { part: 's', shineSize: 0.7 })]
  },
  'cloud-lightning': (icon, k) => {
    const bolt = k.poly([[13.6, 9.4], [8.6, 16.2], [11.8, 16.2], [10, 21.6], [16.4, 13.6], [13, 13.6], [15.6, 9.4]], [0.5, 0.4, 0.3, 0.5, 0.4, 0.3, 0.5])
    return [upCloud(k), cloudGloss(k), k.moat(bolt, 0.7), k.surf(bolt, 'c3', { part: 'a', shineSize: 0.7 })]
  },
  'cloud-rain': (icon, k) => [
    k.surf(k.join(k.drop(7.4, 19.6, 1.25, 8.8, 15.8), k.drop(12, 20.2, 1.25, 13.4, 16.4), k.drop(16.6, 19.6, 1.25, 18, 15.8)), 'c1', { part: 'a', shine: 'dot', shineSize: 0.55, ol: 0.4 }),
    upCloud(k), cloudGloss(k),
  ],
  'cloud-snow': (icon, k) => [
    k.surf(k.join(k.circle(8, 17.6, 1.05), k.circle(12, 17.6, 1.05), k.circle(16, 17.6, 1.05), k.circle(10, 20.6, 1.05), k.circle(14, 20.6, 1.05)), 'edge', { part: 'a', shine: 'none', ol: 0.38, shade: 0 }),
    upCloud(k), cloudGloss(k),
  ],
  // a gold sun peeking from behind a cream cloud
  'cloud-sun': (icon, k) => [
    k.surf(k.around(k.pill(8.85, 2.5, 10.15, 4.6), 8, 9.5, 9.5), 'c3', { part: 'a', shine: 'none', ol: 0.38, shade: 0 }),
    k.surf(k.circle(9.5, 9.5, 4), 'c3', { shineSize: 0.75 }),
    k.surf(k.cloudShape(14.6, 15.1, 0.66), 'tint', { shine: 'none', rim: true, shade: 0.75 }),
  ],
  'cloud-off': (icon, k) => [
    k.surf(k.cloudShape(12, 12.4, 1.0), 'tint', { shine: 'none', rim: true, shade: 0.75 }),
    k.moat(k.seg(3.6, 3.6, 20.4, 20.4, 1.6), 0.8),
    k.tube('M3.8 3.8 L20.2 20.2', 'accent', { part: 's', w: 1.6 }),
  ],
  // sky brackets with a gold slash
  code: (icon, k) => [
    k.surf(k.stroke([[7.6, 6.8], [2.8, 12], [7.6, 17.2]], 2.6), 'c1', { shineSize: 0.65 }),
    k.surf(k.stroke([[16.4, 6.8], [21.2, 12], [16.4, 17.2]], 2.6), 'c1', { shineSize: 0.65 }),
    k.surf(k.stroke([[13.2, 4.6], [10.8, 19.4]], 2.4), 'c2', { part: 'a', shine: 'dot', shineSize: 0.6 }),
  ],

  // ---------------------------------------------------------------- commerce / objects
  // two gold coin stacks: the back one lifts (A), the front one sits
  coins: (icon, k) => [
    ...coinStack(k, 8.4, 5.4, 9.4, 5.4, 'a'),
    ...coinStack(k, 15.8, 14.6, 18.8, 5.4, 'k'),
    k.sparkleAt(20, 4.4, 1.9, { mx: -1, my: 1 }),
  ],
  // a cream frame with two raised sky columns
  columns: (icon, k) => [
    k.surf(k.rr(3, 3, 21, 21, 2.4), 'tint', { shine: 'none' }),
    k.surf(k.rr(5.3, 5.3, 10.9, 18.7, 1.2), 'c1', { shine: 'streak', shineSize: 0.6, ol: 0.4 }),
    k.surf(k.rr(13.1, 5.3, 18.7, 18.7, 1.2), 'c1', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
  ],
  // brass compass: gold case, cream dial under glass, coral north / sky south needle
  compass: (icon, k) => [
    k.surf(k.circle(12, 12, 9.3), 'c3', { shineSize: 1 }),
    k.surf(k.circle(12, 12, 7), 'tint', { inset: true, ol: 0.4, shine: 'none', shade: 0.8 }),
    k.paint(k.join(k.circle(12, 6.3, 0.55), k.circle(17.7, 12, 0.55), k.circle(12, 17.7, 0.55), k.circle(6.3, 12, 0.55)), 'c3'),
    k.surf(k.poly([[16.4, 7.6], [13.6, 13.6], [10.4, 10.4]], [0.5, 0.2, 0.2]), 'accent', { part: 'a', shine: 'none', ol: 0.38, casts: false }),
    k.surf(k.poly([[7.6, 16.4], [10.4, 10.4], [13.6, 13.6]], [0.5, 0.2, 0.2]), 'c1', { part: 'a', shine: 'none', ol: 0.38, casts: false }),
    k.surf(k.circle(12, 12, 1), 'c3', { part: 'a', shine: 'none', ol: 0.3, shade: 0 }),
    k.shine(k.join(k.lens(7.4, 10.6, 10.6, 7.4, 0.45))),
  ],
  // a golden cookie with a bite, dark chocolate chips and crumbs
  cookie: (icon, k) => [
    k.surf(k.path('M15 3 A9.5 9.5 0 1 0 21 9 A2.25 2.25 0 0 1 18 6 A2.25 2.25 0 0 1 15 3 Z'), 'c3', { shine: 'none' }),
    k.surf(k.join(
      k.poly([[7.6, 8.2], [9.8, 7.9], [10.2, 9.8], [8, 10.3]], 0.6),
      k.poly([[12.8, 10.6], [15, 9.6], [15.4, 11.6], [13.4, 12.2]], 0.6),
      k.poly([[8.2, 14.6], [10.4, 14.8], [10, 16.8], [7.9, 16.4]], 0.6),
      k.poly([[13.8, 15.4], [16.2, 15.6], [15.6, 17.6], [13.6, 17.2]], 0.6),
      k.circle(5.8, 12.4, 0.75), k.circle(18.4, 13.2, 0.7), k.circle(11.6, 19.2, 0.7),
    ), 'ink', { part: 'a', inset: false, ol: 0, shine: 'none', shade: 0 }),
    k.shine(k.join(k.circle(8.2, 8.5, 0.3), k.circle(13.4, 10.7, 0.3), k.circle(8.7, 15.1, 0.3), k.circle(14.4, 16, 0.3))),
    k.deco(k.join(k.circle(20.4, 4.4, 0.75), k.circle(18.6, 2.8, 0.55)), 'c3', { ol: 0.35 }),
  ],
  // a coral stew pot with a cream lid and a gold knob (the lid lifts)
  'cooking-pot': (icon, k) => [
    k.surf(k.join(k.pill(2.4, 12.8, 6, 15.2), k.pill(18, 12.8, 21.6, 15.2)), 'accent', { shine: 'none', ol: 0.4 }),
    k.surf(k.path('M4.6 11 H19.4 V17.6 A3.2 3.2 0 0 1 16.2 20.8 H7.8 A3.2 3.2 0 0 1 4.6 17.6 Z'), 'accent', { shineSize: 0.9 }),
    k.ink([[[7, 14.2], [7, 17.2]]], { w: 0.8, role: 'tint', shift: 0, taper: false }),
    k.surf(k.circle(12, 5.2, 1.5), 'c3', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.38 }),
    k.surf(k.unite(k.path('M5.6 9.8 C6.4 7.2 9 6 12 6 C15 6 17.6 7.2 18.4 9.8 Z'), k.pill(3.2, 9.2, 20.8, 11.4)), 'tint', { part: 'a', shine: 'streak', shineSize: 0.6 }),
  ],
  // a sky sheet stacked on a cream sheet
  copy: (icon, k) => [
    k.surf(k.rr(3, 3, 15, 15, 2.2), 'c1', { part: 'a', shine: 'streak', shineSize: 0.7 }),
    k.surf(k.rr(9, 9, 21, 21, 2.2), 'tint', { shine: 'none' }),
    k.ink([[[11.8, 13.2], [18, 13.2]], [[11.8, 16.2], [18, 16.2]]], { w: 0.8 }),
  ],
  'corner-down-left': (icon, k) => [
    k.surf(k.unite(k.stroke('M19.4 3.6 V10.8 A4.2 4.2 0 0 1 15.2 15 H8', 2.6), k.poly([[10, 9.2], [3.6, 15], [10, 20.8]], [0.8, 0.9, 0.8])), 'c1', { shineSize: 0.75 }),
  ],
  'corner-down-right': (icon, k) => [
    k.surf(k.unite(k.stroke('M4.6 3.6 V10.8 A4.2 4.2 0 0 0 8.8 15 H16', 2.6), k.poly([[14, 9.2], [20.4, 15], [14, 20.8]], [0.8, 0.9, 0.8])), 'c1', { shineSize: 0.75 }),
  ],
  // a sky chip with gold pins and a dark glossy die
  cpu: (icon, k) => {
    const pins = []
    for (const v of [9, 15]) {
      pins.push(k.pill(v - 0.85, 2.4, v + 0.85, 6), k.pill(v - 0.85, 18, v + 0.85, 21.6), k.pill(2.4, v - 0.85, 6, v + 0.85), k.pill(18, v - 0.85, 21.6, v + 0.85))
    }
    return [
      k.surf(k.join(...pins), 'c3', { shine: 'none', ol: 0.38, shade: 0 }),
      k.surf(k.rr(5, 5, 19, 19, 2.2), 'c1', { shineSize: 0.8 }),
      k.surf(k.rr(8.6, 8.6, 15.4, 15.4, 1.3), 'ink', { part: 'a', inset: true, ol: 0.3, shine: 'glass', shineSize: 0.8 }),
      k.paint(k.circle(7, 17, 0.55), 'tint'),
    ]
  },
  // a sky card: dark stripe, gold chip, coral and gold brand rings
  'credit-card': (icon, k) => {
    const body = k.rr(2.4, 5, 21.6, 19, 2.2)
    return [
      k.surf(body, 'c1', { shine: 'streak', shineSize: 0.8 }),
      k.surf(k.clip(body, k.rect(2, 8.4, 22, 10.8)), 'ink', { cast: false, ol: 0, shine: 'none', shade: 0 }),
      k.surf(k.rr(5.2, 12.6, 9, 15.6, 0.8), 'c3', { part: 'a', shine: 'none', ol: 0.35 }),
      k.ink([[7.1, 12.8], [7.1, 15.4]], { w: 0.5, taper: false, shift: 0, part: 'a' }),
      k.surf(k.circle(16.2, 15.2, 1.45), 'accent', { shine: 'none', ol: 0.32, shade: 0 }),
      k.surf(k.circle(18.3, 15.2, 1.45), 'c3', { shine: 'none', ol: 0.32, shade: 0 }),
    ]
  },
  // two crop corners: sky in front, sakura behind
  crop: (icon, k) => [
    k.surf(k.stroke('M2.9 6.5 H15.3 A2.2 2.2 0 0 1 17.5 8.7 V21.1', 2.5), 'c2', { shine: 'none' }),
    k.surf(k.stroke('M6.5 2.9 V15.3 A2.2 2.2 0 0 0 8.7 17.5 H21.1', 2.5), 'c1', { shineSize: 0.7 }),
  ],
  // a scope: pale glass, sky ring with ticks, coral bead
  crosshair: (icon, k) => [
    k.surf(k.circle(12, 12, 7), 'edge', { inset: true, ol: 0, shine: 'glass', shade: 0.6 }),
    k.surf(k.unite(k.ring(12, 12, 8.2, 6.6), k.seg(12, 2.6, 12, 7.4, 2), k.seg(12, 16.6, 12, 21.4, 2), k.seg(2.6, 12, 7.4, 12, 2), k.seg(16.6, 12, 21.4, 12, 2)), 'c1', { shineSize: 0.8 }),
    k.surf(k.circle(12, 12, 1.7), 'accent', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.38 }),
  ],
  // a gold crown with ball tips, a sakura jewel and a band (A)
  crown: (icon, k) => [
    k.surf(k.unite(
      k.poly([[5.4, 15.8], [3.8, 7.8], [8.4, 11], [12, 5], [15.6, 11], [20.2, 7.8], [18.6, 15.8]], [0.6, 0.4, 0.5, 0.4, 0.5, 0.4, 0.6]),
      k.circle(3.8, 7.4, 1.25), k.circle(12, 4.4, 1.35), k.circle(20.2, 7.4, 1.25),
    ), 'c3', { shineSize: 0.9 }),
    k.surf(k.lens(10.2, 12.4, 13.8, 12.4, 1.5), 'c2', { shine: 'dot', shineSize: 0.55, ol: 0.35 }),
    k.surf(k.rr(4.8, 16.8, 19.2, 20.2, 1.4), 'c3', { part: 'a', shine: 'none' }),
    k.paint(k.join(k.circle(8.4, 18.5, 0.65), k.circle(12, 18.5, 0.65), k.circle(15.6, 18.5, 0.65)), 'accent', { part: 'a' }),
    k.sparkleAt(20.4, 3, 1.6, { mx: -1, my: 1 }),
  ],
  // a coral soda cup with a cream band, cream lid and a sakura straw
  'cup-soda': (icon, k) => {
    const cup = k.path('M5.4 9.6 H18.6 L17.3 19.9 A1.7 1.7 0 0 1 15.6 21.4 H8.4 A1.7 1.7 0 0 1 6.7 19.9 Z')
    return [
      k.surf(k.stroke([[12.2, 9], [13.6, 3.4], [17, 3.4]], 1.6), 'c2', { part: 'a', shine: 'none', ol: 0.4, shade: 0.6 }),
      k.surf(cup, 'accent', { shineSize: 0.85 }),
      k.surf(k.clip(cup, k.rect(2, 12.8, 22, 16)), 'tint', { cast: false, ol: 0, shine: 'none' }),
      k.surf(k.heartShape(12, 14.5, 0.13), 'c2', { shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
      k.surf(k.pill(3.6, 7.6, 20.4, 10.2), 'tint', { shine: 'none' }),
    ]
  },
  // a sky pointer with its tail
  cursor: (icon, k) => [
    k.surf(k.stroke([[11.6, 13.4], [15.2, 20.4]], 2.4), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.poly([[5, 2.8], [19, 12.6], [11.6, 13.6], [7.6, 19.6]], [0.8, 0.9, 0.5, 0.9]), 'c1', { shineSize: 0.85 }),
  ],
  // a sky server stack: pale lid, ink seams, gold status lights
  database: (icon, k) => [
    k.surf(k.unite(k.ellipse(12, 18.4, 8, 2.9), k.rect(4, 5.6, 20, 18.4)), 'c1', { shineSize: 0.9 }),
    k.ink(['M4.2 12.2 A7.8 2.9 0 0 0 19.8 12.2'], { w: 0.9, taper: 0.6 }),
    k.surf(k.ellipse(12, 5.6, 8, 2.9), 'edge', { shine: 'none', ol: 0.45 }),
    k.paint(k.join(k.circle(16.6, 15.4, 0.75), k.circle(16.6, 9.4, 0.75)), 'c3', { part: 'a' }),
  ],
  // a pastel CD: pale glassy disc with a rainbow sheen, cream hub
  disc: (icon, k) => [
    k.surf(k.ring(12, 12, 9.2, 1.4), 'edge', { shine: 'none', shade: 0.8 }),
    k.paint(k.clip(k.ring(12, 12, 8, 4.4), k.sector(12, 12, 10, 200, 260)), 'c2', { op: 0.75 }),
    k.paint(k.clip(k.ring(12, 12, 8, 4.4), k.sector(12, 12, 10, 20, 80)), 'c3', { op: 0.75 }),
    k.surf(k.ring(12, 12, 3.4, 1.4), 'tint', { part: 'a', shine: 'none', ol: 0.38, shade: 0.6 }),
    k.shine(k.join(k.arc(12, 12, 6.2, 190, 255, 0.9), k.arc(12, 12, 6.2, 10, 40, 0.7))),
  ],
  // a double helix: sky and sakura strands, gold rungs
  dna: (icon, k) => [
    k.tube(['M9.4 4 H14.6', 'M9.8 9.6 H14.2', 'M9.8 14.4 H14.2', 'M9.4 20 H14.6'], 'c3', { part: 'a', w: 1.1, ol: 0.4, shade: 0 }),
    k.tube('M17 2.8 C17 7.5 7 7 7 12 C7 17 17 16.5 17 21.2', 'c2', { w: 1.7 }),
    k.tube('M7 2.8 C7 7.5 17 7 17 12 C17 17 7 16.5 7 21.2', 'c1', { w: 1.7 }),
  ],

  // ---------------------------------------------------------------- characters
  // a cream puppy with floppy gold ears, sparkly eyes, a glossy nose and blush
  // round head + muzzle lobe; the gold ears flop low and outward behind the cheeks
  dog: (icon, k) => {
    const head = k.unite(k.circle(12, 11, 7.1), k.ellipse(12, 15.6, 4, 3.4))
    return [
      k.surf(k.join(k.ellipse(4.6, 12, 2.3, 4.4, 18), k.ellipse(19.4, 12, 2.3, 4.4, -18)), 'c3', { part: 'a', shine: 'none', ol: 0.45 }),
      k.surf(head, 'tint', { shine: 'none' }),
      k.surf(k.clip(k.ellipse(9.4, 6.2, 3.4, 2.6, -20), k.circle(12, 11, 7.1)), 'c3', { shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
      k.surf(k.ellipse(12, 16, 3.5, 2.7), 'tint', { shine: 'none', ol: 0.3, shade: 0.5, cast: false, casts: false }),
      k.paint(k.join(k.ellipse(9, 11.2, 0.9, 1.2), k.ellipse(15, 11.2, 0.9, 1.2)), 'ink', { part: 'a' }),
      k.shine(k.join(k.circle(8.72, 10.72, 0.38), k.circle(14.72, 10.72, 0.38))),
      k.paint(k.join(k.ellipse(7.2, 14, 1.1, 0.6), k.ellipse(16.8, 14, 1.1, 0.6)), 'c2', { op: 0.75 }),
      k.surf(k.poly([[10.4, 14.2], [13.6, 14.2], [12, 15.9]], [0.7, 0.7, 0.6]), 'ink', { part: 'a', ol: 0.2, shine: 'dot', shineSize: 0.45, shade: 0 }),
      k.ink(['M12 15.9 V16.7 C11.6 17.5 10.6 17.5 10.2 16.9', 'M12 16.7 C12.4 17.5 13.4 17.5 13.8 16.9'], { w: 0.6, part: 'a', taper: 0.5 }),
    ]
  },

  // ---------------------------------------------------------------- money / food
  'dollar-sign': (icon, k) => [
    k.surf(k.seg(12, 2.8, 12, 21.2, 2), 'c3', { part: 'a', shine: 'none' }),
    k.surf(k.stroke('M16.5 7.5 C15.9 5.9 14.2 5 12 5 C9.2 5 7.5 6.4 7.5 8.4 C7.5 10.5 9.4 11.3 12 11.9 C14.6 12.5 16.5 13.3 16.5 15.6 C16.5 17.7 14.6 19 12 19 C9.6 19 7.9 18.1 7.5 16.5', 2.7), 'c3', { shineSize: 0.75 }),
    k.sparkleAt(19.6, 4, 1.8, { mx: -1, my: 1 }),
  ],
  // a gold donut with wavy sakura icing and rainbow sprinkles
  donut: (icon, k) => {
    const icing = []
    for (let i = 0; i < 72; i++) { const a = i / 72 * Math.PI * 2, r = 7.4 + 0.65 * Math.sin(a * 7); icing.push([12 + r * Math.cos(a), 11.6 + r * Math.sin(a)]) }
    const sp = (x, y, deg) => k.rot(k.pill(x - 1.1, y - 0.48, x + 1.1, y + 0.48), deg, x, y)
    return [
      k.surf(k.ring(12, 12, 9.2, 3), 'c3', { shine: 'none' }),
      k.surf(k.cut([icing], k.circle(12, 11.8, 3.6)), 'c2', { shineSize: 0.85, cast: false }),
      k.paint(k.join(sp(11.8, 5.8, 20), sp(17.6, 10.6, 70)), 'c1', { part: 'a' }),
      k.paint(k.join(sp(7, 15.6, 50), sp(6.8, 9.4, -60)), 'c3', { part: 'a' }),
      k.paint(k.join(sp(14.8, 17.4, -20)), 'tint', { part: 'a' }),
      k.paint(k.join(sp(16.4, 14.6, 30)), 'c4', { part: 'a' }),
    ]
  },
  // a cream door frame, warm gold light spilling out, the sky door swung open (A)
  'door-open': (icon, k) => [
    k.surf(k.rr(4.6, 2.8, 15, 21, [2, 2, 0, 0]), 'tint', { shine: 'none' }),
    k.surf(k.rr(6.6, 4.8, 14.6, 21, [1, 1, 0, 0]), 'c3', { inset: true, ol: 0.35, shine: 'none' }),
    k.surf(k.poly([[14, 2.8], [19.6, 4.4], [19.6, 19.6], [14, 21.2]], [0.5, 0.8, 0.8, 0.5]), 'c1', { part: 'a', shineSize: 0.7 }),
    k.surf(k.circle(16.3, 12.4, 0.9), 'c3', { part: 'a', shine: 'none', ol: 0.32, shade: 0 }),
    k.ink([[2.6, 21.3], [21.4, 21.3]], { w: 1 }),
  ],
  // a sky arrow dropping into an open gold tray (the mirror of upload)
  download: (icon, k) => [
    k.surf(k.stroke('M3.6 13.6 V18.2 C3.6 19.5 4.6 20.4 5.8 20.4 H18.2 C19.4 20.4 20.4 19.5 20.4 18.2 V13.6', 2.6), 'c3', { shineSize: 0.6 }),
    k.surf(k.unite(k.rr(10.8, 2.6, 13.2, 10.6, 1.1), k.poly([[6.8, 9.4], [17.2, 9.4], [12, 15.2]], [0.8, 0.8, 0.9])), 'c1', { part: 'a', shineSize: 0.7 }),
  ],
  // six glossy sky beads
  'drag-handle': (icon, k) => [
    k.surf(k.join(...[5, 12, 19].flatMap(y => [k.circle(9, y, 1.7), k.circle(15, y, 1.7)])), 'c1', { shine: 'dot', shineSize: 0.6, ol: 0.42 }),
  ],
  // a sky water drop with a curved inner glint and a sparkle
  droplet: (icon, k) => [
    k.surf(k.path('M12 2.6 C14.5 6 19 10 19 14.5 A7 7 0 0 1 5 14.5 C5 10 9.5 6 12 2.6 Z'), 'c1', { shineSize: 1 }),
    k.shine(k.stroke('M8.6 14.8 A3.4 3.4 0 0 0 11.6 18', 0.9)),
    k.sparkleAt(19.4, 4.6, 1.8, { mx: -1, my: 1 }),
  ],
  // a sakura dumbbell on a gold bar
  dumbbell: (icon, k) => [
    k.surf(k.pill(2.6, 11, 21.4, 13), 'c3', { shine: 'none', ol: 0.42 }),
    k.surf(k.join(k.rr(2.6, 8.4, 5.6, 15.6, 1.2), k.rr(18.4, 8.4, 21.4, 15.6, 1.2)), 'c2', { shine: 'none', ol: 0.42 }),
    k.surf(k.rr(6, 4.4, 9.8, 19.6, 1.7), 'c2', { shine: 'streak', shineSize: 0.7 }),
    k.surf(k.rr(14.2, 4.4, 18, 19.6, 1.7), 'c2', { shine: 'streak', shineSize: 0.7 }),
  ],

  // ---------------------------------------------------------------- actions
  // a gold pencil writing on a cream sheet
  edit: (icon, k) => {
    const P = s => k.move(k.rot(s, -45, 12, 12), 2, -2)
    return [
      k.surf(k.rr(3, 5.2, 18.8, 21, 2.2), 'tint', { shine: 'none', part: 'a' }),
      k.ink(['M5.6 18 C6.6 17 7.4 18.6 8.4 17.6 C9 17 9.6 17.8 10.2 17.6'], { w: 0.8, role: 'c1', part: 'a' }),
      k.surf(P(k.poly([[7.6, 10.2], [4.4, 12], [7.6, 13.8]], [0.3, 0.5, 0.3])), 'tint', { shine: 'none', ol: 0.4 }),
      k.paint(P(k.poly([[5.6, 11.3], [4.4, 12], [5.6, 12.7]], 0.2)), 'ink'),
      k.surf(P(k.rr(7.4, 10.2, 16.8, 13.8, [0, 0, 0, 0])), 'c3', { shineSize: 0.7 }),
      k.surf(P(k.rr(16.6, 10.2, 18, 13.8, 0)), 'c1', { shine: 'none', ol: 0.35 }),
      k.surf(P(k.rr(17.8, 10.2, 20.2, 13.8, [0, 1.2, 1.2, 0])), 'c2', { shine: 'none', ol: 0.4 }),
    ]
  },
  // a golden egg with a sparkle
  egg: (icon, k) => [
    k.surf(k.path('M12 2.6 C16.25 2.6 19 8.75 19 13.75 C19 18.5 16 21.4 12 21.4 C8 21.4 5 18.5 5 13.75 C5 8.75 7.75 2.6 12 2.6 Z'), 'c3', { shineSize: 1.05, rim: true }),
    k.sparkleAt(19.8, 4.2, 1.8, { mx: -1, my: 1 }),
  ],
  // a two-tone eraser (sky sleeve, sakura tip) on the line, crumbs flying
  eraser: (icon, k) => {
    const body = k.path('M9 20.4 L4.41 15.91 A2 2 0 0 1 4.41 13.09 L13.59 3.91 A2 2 0 0 1 16.41 3.91 L19.59 7.09 A2 2 0 0 1 19.59 9.91 Z')
    return [
      k.ink([[9.2, 21], [20.6, 21]], { w: 0.9, part: 'a' }),
      k.surf(body, 'c1', { shineSize: 0.8 }),
      k.surf(k.clip(body, k.poly([[-1, 3.2], [20, 24.2], [-1, 24.2]])), 'c2', { cast: false, shine: 'none' }),
      k.deco(k.join(k.circle(3.6, 20, 0.6), k.circle(5.6, 21.2, 0.45)), 'c2', { ol: 0.3 }),
    ]
  },
  euro: (icon, k) => [
    k.surf(k.unite(k.stroke('M18.4 7.2 A6.8 6.8 0 1 0 18.4 16.8', 2.7), k.stroke(['M3.8 10 H12.4', 'M3.8 14 H12.4'], 2)), 'c3', { shineSize: 0.8 }),
    k.sparkleAt(20, 3.8, 1.7, { mx: -1, my: 1 }),
  ],
  // a cream window with a sky arrow bursting out of its corner
  'external-link': (icon, k) => {
    const a = arrowDir(k, -45, 15.6, 8.4, 1.08)
    return [
      k.surf(k.rr(3.2, 5, 19, 20.8, 2.2), 'tint', { shine: 'none' }),
      k.surf(k.clip(k.rr(3.2, 5, 19, 20.8, 2.2), k.rect(2, 4, 22, 8.4)), 'c2', { cast: false, shine: 'none' }),
      k.moat(a, 0.8),
      k.ink([[[6.2, 12.4], [11.2, 12.4]], [[6.2, 15.4], [14.6, 15.4]], [[6.2, 18.2], [10.6, 18.2]]], { w: 0.8 }),
      k.surf(a, 'c1', { part: 'a', shineSize: 0.7 }),
    ]
  },
  // an anime eye: cream white, sky iris, ink pupil, two catch-lights, an inked upper lid
  eye: (icon, k) => animeEye(k),
  'eye-off': (icon, k) => [
    ...animeEye(k),
    k.moat(k.seg(3.4, 3.4, 20.6, 20.6, 1.6), 0.8),
    k.tube('M3.6 3.6 L20.4 20.4', 'accent', { part: 's', w: 1.6 }),
  ],
  // a sky factory with gold lit windows and a coral striped chimney
  factory: (icon, k) => [
    k.surf(k.rr(16.2, 3.4, 20.6, 21, [1, 1, 1.4, 0]), 'accent', { shine: 'none' }),
    k.surf(k.clip(k.rr(16.2, 3.4, 20.6, 21, [1, 1, 1.4, 0]), k.rect(15, 6, 22, 7.6)), 'tint', { cast: false, ol: 0, shine: 'none' }),
    k.surf(k.poly([[3, 21], [3, 12], [8, 9], [8, 12], [13, 9], [13, 12], [17, 12], [17, 21]], [1.4, 0.6, 0.4, 0.3, 0.4, 0.3, 0.4, 0]), 'c1', { shineSize: 0.7 }),
    k.surf(k.join(k.rr(5.4, 15, 8.2, 17.8, 0.6), k.rr(10.2, 15, 13, 17.8, 0.6)), 'c3', { part: 'a', inset: true, ol: 0.35, shine: 'glint', shineSize: 0.5 }),
  ],
  'fast-forward': (icon, k) => [
    k.surf(k.poly([[2.8, 5.8], [11.4, 12], [2.8, 18.2]], [1.2, 1.2, 1.2]), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.poly([[11.8, 5.8], [20.8, 12], [11.8, 18.2]], [1.2, 1.2, 1.2]), 'c2', { shineSize: 0.75 }),
  ],
  // an ink film strip with cream sprocket holes and a sky glass frame
  film: (icon, k) => {
    const holes = []
    for (const x of [4.5, 9.5, 14.5, 19.5]) holes.push(k.rr(x - 1.2, 5.4, x + 1.2, 7.2, 0.4), k.rr(x - 1.2, 16.8, x + 1.2, 18.6, 0.4))
    return [
      k.surf(k.rr(2.4, 4, 21.6, 20, 2), 'ink', { shine: 'none' }),
      // a sky inner rim so the ink strip survives on dark backgrounds
      k.paint(k.cut(k.rr(2.4, 4, 21.6, 20, 2), k.rr(3, 4.6, 21, 19.4, 1.5)), 'c1'),
      k.paint(k.join(...holes), 'tint', { part: 'a' }),
      k.surf(k.rr(4.6, 9, 19.4, 15, 1), 'c1', { part: 'a', inset: true, ol: 0, shine: 'glass', shineSize: 0.8 }),
    ]
  },
  // a glossy sky funnel with a pale rim
  filter: (icon, k) => {
    const f = k.path('M4.64 3.5 L19.36 3.5 A1 1 0 0 1 20.13 5.14 L14.35 12.08 A1.5 1.5 0 0 0 14 13.04 L14 18.69 A0.5 0.5 0 0 1 13.72 19.14 L10.72 20.64 A0.5 0.5 0 0 1 10 20.19 L10 13.04 A1.5 1.5 0 0 0 9.65 12.08 L3.87 5.14 A1 1 0 0 1 4.64 3.5 Z')
    return [
      k.surf(f, 'c1', { shineSize: 0.8 }),
      k.surf(k.clip(f, k.rect(2, 2, 22, 6.2)), 'edge', { cast: false, shine: 'none' }),
    ]
  },
  // sky fingerprint ridges
  fingerprint: (icon, k) => [
    k.tube(['M4 18 V11.5 A8 9 0 0 1 20 11.5 V14', 'M9 21 C8.5 19.75 8 18.25 8 16.5 V11.5 A4 5 0 0 1 16 11.5 V16', 'M12 11 V15 C12 17.25 12.5 19 13.5 20.5', 'M20 18 C19.5 19.25 19 20.25 18 21'], 'c1', { w: 1.5 }),
  ],
  // a sky fish with a sakura tail, a big eye and two bubbles
  fish: (icon, k) => [
    k.surf(k.path('M7.4 12 L3.5 9 C3 8.5 2.6 8.75 2.6 9.5 V14.5 C2.6 15.25 3 15.5 3.5 15 Z'), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.path('M12.4 7.2 C13 5.4 15 4.6 16.6 5.6 L16.2 7.2 Z'), 'c2', { shine: 'none', ol: 0.38 }),
    k.surf(k.path('M7 12 C9 8.25 12 6.5 15 6.5 C18.5 6.5 21 9 21.5 12 C21 15 18.5 17.5 15 17.5 C12 17.5 9 15.75 7 12 Z'), 'c1', { shineSize: 0.8 }),
    k.ink(['M12.5 9.75 C13.25 11.25 13.25 12.75 12.5 14.25'], { w: 0.8 }),
    k.paint(k.circle(17, 10.9, 1.05), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(16.7, 10.55, 0.38))),
    k.deco(k.join(k.ring(5.2, 4.6, 1.3, 0.75), k.ring(8.4, 2.9, 0.8, 0.4)), 'c1', { ol: 0 }),
  ],
  // a coral pennant waving on a gold pole, a cream star on it
  flag: (icon, k) => [
    k.surf(k.unite(k.rr(4.1, 3.2, 5.9, 21.6, 0.9), k.circle(5, 2.9, 1.3)), 'c3', { shine: 'none' }),
    k.surf(k.path('M5.8 3.6 C8 2.4 10.2 2.4 12.5 3.6 C15 4.85 17.5 4.85 20 3.6 V13.5 C17.5 14.75 15 14.75 12.5 13.5 C10.2 12.4 8 12.4 5.8 13.4 Z'), 'accent', { part: 'a', shine: 'none' }),
    k.surf(k.starShape(12.8, 8.6, 2.8, 1.3, 0.3), 'tint', { part: 'a', shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
  ],
  // a coral flame with a gold heart of fire
  flame: (icon, k) => [
    k.surf(k.path('M12 21.4 C8.25 21.4 5 18.75 5 15 C5 11.75 5.75 9.5 7 7.5 C8 8.75 9.25 9.5 10.5 9.5 C10.25 6.5 11.5 4.25 14 2.6 C17.25 5.5 19 10 19 15 C19 18.75 15.75 21.4 12 21.4 Z'), 'accent', { shine: 'none' }),
    k.surf(k.path('M12.5 18.6 A3 3 0 0 1 9.4 15.4 C9.4 13.4 11.4 12.4 12.9 11 C14.1 12.4 15.6 13.8 15.6 15.4 A3 3 0 0 1 12.5 18.6 Z'), 'c3', { part: 'a', shine: 'none', ol: 0, cast: false }),
    k.paint(k.ellipse(12.4, 16.4, 1.1, 1.4), 'tint', { part: 'a' }),
    k.sparkleAt(20, 4.6, 1.6, { mx: -1, my: 1 }),
  ],
  // a glass flask with sakura potion and bubbles
  'flask-conical': (icon, k) => {
    const flask = k.path('M9.6 3.6 V9 L4.3 18.2 A1.8 1.8 0 0 0 5.8 21 H18.2 A1.8 1.8 0 0 0 19.7 18.2 L14.4 9 V3.6 Z')
    return [
      k.surf(flask, 'edge', { shine: 'glass', shade: 0.6 }),
      k.surf(k.clip(flask, k.rect(0, 13.8, 24, 24)), 'c2', { part: 'a', cast: false, shine: 'none' }),
      k.paint(k.join(k.circle(10.4, 16.6, 0.7), k.circle(13.6, 18.4, 0.5), k.circle(12.4, 11.6, 0.55)), 'tint', { part: 'a' }),
      k.surf(k.pill(7.8, 2.4, 16.2, 4.6), 'edge', { shine: 'none', ol: 0.42 }),
      k.sparkleAt(19.6, 4.6, 1.6, { mx: -1, my: 1 }),
    ]
  },
  // a sakura blossom with notched petals and a gold heart
  flower: (icon, k) => [
    k.surf(k.cut(k.around(k.ellipse(12, 7.4, 3.6, 4.3), 5, 12, 12.2), k.around(k.poly([[11, 2.6], [13, 2.6], [12, 4.6]], 0.2), 5, 12, 12.2)), 'c2', { shineSize: 0.8 }),
    k.surf(k.circle(12, 12.2, 2.7), 'c3', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
    k.paint(k.join(k.circle(11.2, 11.6, 0.4), k.circle(12.9, 11.9, 0.4), k.circle(12, 13.2, 0.4)), 'accent', { part: 'a' }),
  ],

  // ---------------------------------------------------------------- files (the dog-ear wears the glyph's colour)
  'file-archive': (icon, k) => {
    const teeth = []
    for (let i = 0; i < 4; i++) teeth.push(k.rr(i % 2 ? 11 : 9.4, 4.4 + i * 2.2, i % 2 ? 12.6 : 11, 5.6 + i * 2.2, 0.3))
    return [
      ...sheet(k, 'c3'),
      k.paint(k.join(...teeth), 'ink', { part: 'a' }),
      k.surf(k.rr(9, 13.2, 13, 19, 1.2), 'c3', { part: 'a', shine: 'dot', shineSize: 0.55, ol: 0.4 }),
      k.surf(k.rr(10.2, 15.2, 11.8, 17.4, 0.5), 'ink', { part: 'a', inset: true, ol: 0, shine: 'none', shade: 0 }),
    ]
  },
  'file-audio': (icon, k) => fileBadge(k, 'c2', k.unite(k.ellipse(15.2, 19.4, 2.5, 2, -22), k.rr(16.3, 12.4, 18.1, 19.2, 0.6), k.path('M16.8 12.4 C18.4 13.4 21.6 13.8 21.4 17.4 C20.6 15.6 18.8 15.4 16.8 15.4 Z'))),
  'file-check': (icon, k) => fileBadge(k, 'c4', k.stroke([[13.2, 17], [16, 19.8], [21, 13.8]], 2.8)),
  'file-code': (icon, k) => fileBadge(k, 'c1', k.join(k.stroke([[15, 13.4], [12.8, 17], [15, 20.6]], 2.2), k.stroke([[19.2, 13.4], [21.4, 17], [19.2, 20.6]], 2.2)), { shine: 'none' }),
  'file-down': (icon, k) => fileBadge(k, 'c1', k.unite(k.rr(15.9, 12.4, 18.1, 17.4, 1), k.poly([[12.8, 16.4], [21.2, 16.4], [17, 21.6]], [0.7, 0.7, 0.8]))),
  'file-up': (icon, k) => fileBadge(k, 'c1', k.unite(k.rr(15.9, 16.6, 18.1, 21.6, 1), k.poly([[12.8, 17.6], [21.2, 17.6], [17, 12.4]], [0.7, 0.7, 0.8]))),
  'file-image': (icon, k) => {
    const win = k.rr(12.4, 12.6, 21.6, 21.4, 1.4)
    return [
      ...sheetB(k, 'c4'),
      k.moat(win, 0.9),
      k.surf(win, 'c1', { part: 'a', shine: 'none', ol: 0.45 }),
      k.paint(k.clip(k.poly([[11, 22], [15.2, 16.4], [17.6, 18.8], [18.8, 17.6], [23, 21.6], [23, 22]]), k.grow(win, -0.1)), 'c4', { part: 'a' }),
      k.paint(k.circle(19, 15.2, 1.2), 'c3', { part: 'a' }),
    ]
  },
  'file-lock': (icon, k) => [
    ...sheetB(k, 'c3'),
    k.moat(k.unite(k.rr(12.8, 15.6, 21.2, 21.6, 1.4), k.arc(17, 15.6, 2.6, 180, 360, 1.7)), 0.9),
    onPage(k, k.unite(k.arc(17, 15.6, 2.6, 180, 360, 1.7), k.seg(14.4, 15.6, 14.4, 16.4, 1.7), k.seg(19.6, 15.6, 19.6, 16.4, 1.7)), 'c1', { shine: 'none', ol: 0.4 }),
    onPage(k, k.rr(12.8, 15.6, 21.2, 21.6, 1.4), 'c3', { ol: 0.45 }),
    k.paint(k.join(k.circle(17, 18, 0.85), k.rr(16.5, 18.2, 17.5, 20, 0.4)), 'ink', { part: 'a' }),
  ],
  'file-minus': (icon, k) => fileBadge(k, 'accent', k.pill(12.6, 15.6, 21.4, 18.6)),
  'file-plus': (icon, k) => fileBadge(k, 'c4', k.unite(k.pill(12.6, 15.6, 21.4, 18.6), k.pill(15.5, 12.7, 18.5, 21.5))),
  'file-x': (icon, k) => fileBadge(k, 'accent', k.stroke(['M13.8 13.8 L20.2 20.2', 'M20.2 13.8 L13.8 20.2'], 2.6)),
  'file-pdf': (icon, k) => fileBadge(k, 'accent', k.stroke('M14.6 21 V13 H17.6 A2.5 2.5 0 0 1 17.6 18 H14.6', 2.3), { shine: 'none' }),
  'file-search': (icon, k) => [
    ...sheetB(k, 'c3'),
    k.moat(k.unite(k.circle(15.8, 15.8, 3.9), k.stroke([[18.4, 18.4], [21, 21]], 2.2)), 0.9),
    onPage(k, k.stroke([[18.4, 18.4], [21, 21]], 2.2), 'c1', { shine: 'none', ol: 0.4 }),
    onPage(k, k.ring(15.8, 15.8, 3.9, 2.5), 'c3', { shine: 'none', ol: 0.4 }),
    k.surf(k.circle(15.8, 15.8, 2.5), 'edge', { part: 'a', inset: true, ol: 0, shine: 'glass', shineSize: 0.6, shade: 0.5 }),
  ],
  'file-spreadsheet': (icon, k) => {
    const g = k.rr(12.4, 12.6, 21.6, 21.4, 1.4)
    return [
      ...sheetB(k, 'c4'),
      k.moat(g, 0.9),
      onPage(k, g, 'c4', { shine: 'none', ol: 0.45 }),
      k.ink([[[12.8, 15.6], [21.2, 15.6]], [[12.8, 18.5], [21.2, 18.5]], [[15.8, 13], [15.8, 21]]], { w: 0.8, role: 'tint', part: 'a', taper: false, shift: 0 }),
    ]
  },
  'file-text': (icon, k) => [
    ...sheet(k, 'c1'),
    k.paint(k.pill(8, 8, 11.6, 9.8), 'c2', { part: 'a' }),
    k.tube([[[8, 13], [16.2, 13]], [[8, 16], [16.2, 16]], [[8, 19], [13, 19]]], 'c1', { part: 'a', w: 1.3, ol: 0.35, shade: 0 }),
  ],
  'file-video': (icon, k) => fileBadge(k, 'c2', k.poly([[13.4, 12.6], [21.8, 17], [13.4, 21.4]], [0.9, 1, 0.9])),
  // a sky sheet behind a cream page
  files: (icon, k) => {
    const p = k.page(7.4, 6.4, 20.6, 21.4, 4.4, 2)
    return [
      k.surf(k.rr(3.4, 2.6, 15, 17.6, 2), 'c1', { part: 'a', shineSize: 0.7 }),
      k.surf(p.sheet, 'tint', { shine: 'none' }),
      k.surf(p.flap, 'c1', { shine: 'none', ol: 0.4 }),
      k.ink([[[10.4, 14], [17.6, 14]], [[10.4, 17], [15, 17]]], { w: 0.8 }),
    ]
  },

  // ---------------------------------------------------------------- folders
  'folder-minus': (icon, k) => [folderBack(k), folderFront(k), glyphOnFolder(k, k.pill(8.6, 13.4, 15.4, 15.8))],
  'folder-plus': (icon, k) => [folderBack(k), folderFront(k), glyphOnFolder(k, k.unite(k.pill(8.6, 13.4, 15.4, 15.8), k.pill(10.8, 11.2, 13.2, 18)))],
  'folder-search': (icon, k) => [
    folderBack(k), folderFront(k),
    glyphOnFolder(k, k.unite(k.ring(11.4, 13.8, 3.3, 1.9), k.stroke([[13.8, 16.2], [16.2, 18.4]], 1.7))),
    k.surf(k.circle(11.4, 13.8, 1.9), 'edge', { part: 's', inset: true, ol: 0, shine: 'glass', shineSize: 0.5, shade: 0.4 }),
  ],
  // the folder tipped open: paper rising, the front flap falling forward
  'folder-open': (icon, k) => [
    k.surf(k.unite(k.rr(2.8, 6.4, 19.4, 19.8, 2), k.rr(2.8, 4.4, 10.6, 9, [1.6, 1.6, 0, 0]), k.poly([[9, 4.4], [10.6, 4.4], [12.6, 6.9], [9, 6.9]], [0, 0.8, 0, 0])), 'c3', { part: 'a', shine: 'none' }),
    k.surf(k.rot(k.rr(6.4, 7, 18.4, 15, 1.2), 4, 12, 11), 'tint', { shine: 'none', ol: 0.4 }),
    k.surf(k.poly([[2.8, 19.8], [6.6, 11.4], [21.6, 11.4], [18.6, 19.8]], [1.4, 1, 1, 1.6]), 'c3', { shineSize: 0.85 }),
  ],

  // ---------------------------------------------------------------- the rest
  // a classic soccer ball: cream leather, ink panels, gloss
  football: (icon, k) => {
    const ball = k.circle(12, 12, 9.2)
    const pent = (x, y, r, d) => k.ngon(x, y, r, 5, d, 0.5)
    return [
      k.surf(ball, 'tint', { shine: 'streak', shineSize: 0.95 }),
      k.paint(k.clip(k.join(pent(12, 11.6, 3.1, -90), pent(12, 1.6, 3, 90), pent(21.6, 9, 3, 162), pent(18.2, 20.4, 3, -126), pent(5.8, 20.4, 3, -54), pent(2.4, 9, 3, 18)), ball), 'ink', { part: 'a' }),
      k.ink([[[12, 8.5], [12, 4.6]], [[15, 10.7], [18.8, 9.5]], [[13.9, 14.2], [16.2, 17.6]], [[10.1, 14.2], [7.8, 17.6]], [[9, 10.7], [5.2, 9.5]]], { w: 0.7, part: 'a', taper: false, shift: 0 }),
    ]
  },
  forward: (icon, k) => [
    k.surf(k.unite(k.stroke('M18.4 9.5 H11 A7 7 0 0 0 4 16.5 V19.6', 2.6), k.poly([[14.8, 3.8], [20.8, 9.5], [14.8, 15.2]], [0.8, 0.9, 0.8])), 'c1', { shineSize: 0.75 }),
  ],
  // a gloomy gold face: gloom lines, worried brows, a frown and a sweat drop
  frown: (icon, k) => [
    k.surf(k.circle(11.6, 12.4, 8.9), 'c3', { shine: 'none' }),
    k.paint(k.clip(k.join(k.rr(6.6, 3, 7.5, 7.4, 0.4), k.rr(9, 3, 9.9, 6.6, 0.4), k.rr(11.4, 3, 12.3, 7, 0.4)), k.circle(11.6, 12.4, 8.9)), 'c1', { op: 0.55 }),
    k.paint(k.join(k.ellipse(8.8, 11.4, 0.8, 1.15), k.ellipse(14.4, 11.4, 0.8, 1.15)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(8.55, 10.95, 0.32), k.circle(14.15, 10.95, 0.32))),
    k.ink(['M6.8 9.4 L9.6 8.4', 'M16.4 9.4 L13.6 8.4'], { w: 0.75, part: 'a' }),
    k.ink(['M8.4 17.2 C9.8 15.4 13.4 15.4 14.8 17.2'], { w: 0.95, part: 'a' }),
    k.deco(k.drop(19.8, 7.6, 1.3, 19.2, 4.4), 'c1', { ol: 0.38 }),
  ],
  // a coral fuel pump with a cream gauge window and a sky hose
  fuel: (icon, k) => [
    k.tube('M12.6 12 H14.8 A1.5 1.5 0 0 1 16.3 13.5 V17.3 A2 2 0 0 0 20.3 17.3 V8 L18.2 5.8', 'c1', { part: 'a', w: 1.4, ol: 0.45 }),
    k.surf(k.rr(3.6, 3, 12.8, 20.4, [2.2, 2.2, 0.4, 0.4]), 'accent', { shineSize: 0.8 }),
    k.surf(k.rr(5.6, 5.2, 10.8, 9.8, 0.9), 'tint', { inset: true, ol: 0.38, shine: 'glass', shineSize: 0.5 }),
    k.ink([[6.8, 9], [9.4, 6.6]], { w: 0.7, part: 'a', taper: 0.6 }),
    k.surf(k.rr(2.4, 19.6, 14, 21.6, 0.9), 'c1', { shine: 'none', ol: 0.4 }),
  ],
  // a cream photo card between two sakura neighbours
  'gallery-horizontal': (icon, k) => {
    const win = k.rr(8.8, 6, 15.2, 15.6, 1)
    return [
      k.surf(k.join(k.pill(2.4, 7, 4.8, 17), k.pill(19.2, 7, 21.6, 17)), 'c2', { part: 'a', shine: 'none', ol: 0.42 }),
      k.surf(k.rr(7, 4, 17, 20, 2.2), 'tint', { shine: 'none' }),
      k.surf(win, 'c1', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
      k.paint(k.clip(k.poly([[7, 17], [11, 11.4], [13, 13.6], [14, 12.6], [17, 16.6]]), win), 'c4'),
      k.paint(k.circle(13.2, 8.4, 1), 'c3'),
      k.ink([[9.4, 17.8], [13, 17.8]], { w: 0.8 }),
    ]
  },
  // a sky gamepad with a cream d-pad and sakura / gold buttons
  gamepad: (icon, k) => [
    k.surf(k.path('M8 5.6 H16 C19.25 5.6 20.75 7.75 21.4 11 C21.9 13.25 22.2 19.4 19.5 19.4 C17.75 19.4 17 16 15 16 H9 C7 16 6.25 19.4 4.5 19.4 C1.8 19.4 2.1 13.25 2.6 11 C3.25 7.75 4.75 5.6 8 5.6 Z'), 'c1', { shineSize: 0.85 }),
    k.surf(k.unite(k.rr(5.4, 10.6, 9.6, 12.4, 0.5), k.rr(6.6, 9.4, 8.4, 13.6, 0.5)), 'tint', { part: 'a', shine: 'none', ol: 0.35, shade: 0.5 }),
    k.surf(k.circle(15.2, 12.6, 1.25), 'c2', { part: 'a', shine: 'dot', shineSize: 0.45, ol: 0.35 }),
    k.surf(k.circle(17.8, 10, 1.25), 'c3', { part: 'a', shine: 'dot', shineSize: 0.45, ol: 0.35 }),
  ],
  // a speedometer: sky case, cream dial with a green-gold-coral scale, ink needle
  gauge: (icon, k) => [
    k.surf(k.clip(k.circle(12, 13.8, 9.2), k.rect(0, 0, 24, 20.4)), 'c1', { shineSize: 0.9 }),
    k.surf(k.clip(k.circle(12, 13.8, 7.2), k.rect(0, 0, 24, 18.8)), 'tint', { inset: true, ol: 0.38, shine: 'none' }),
    k.paint(k.arc(12, 13.8, 5.4, 185, 235, 1.3), 'c4'),
    k.paint(k.arc(12, 13.8, 5.4, 250, 290, 1.3), 'c3'),
    k.paint(k.arc(12, 13.8, 5.4, 305, 355, 1.3), 'accent'),
    k.ink([[12, 14], [15.6, 10.4]], { w: 1.3, part: 'a', taper: 0.8 }),
    k.surf(k.circle(12, 14, 1.4), 'c3', { part: 'a', shine: 'dot', shineSize: 0.45, ol: 0.35 }),
  ],
  // a sakura gem: bright crown facets, ink facet lines, a glint and a sparkle
  gem: (icon, k) => {
    const g = k.poly([[7, 3.6], [17, 3.6], [21.2, 9], [12, 20.8], [2.8, 9]], [0.8, 0.8, 0.5, 0.8, 0.5])
    return [
      k.surf(g, 'c2', { shine: 'glint', shineSize: 0.9 }),
      k.paint(k.clip(k.poly([[7, 3.6], [10, 3.6], [8.5, 9], [2.8, 9]]), g), 'tint', { op: 0.45 }),
      k.paint(k.clip(k.poly([[10, 3.6], [14, 3.6], [15.5, 9], [8.5, 9]]), g), 'tint', { op: 0.25 }),
      k.ink([[[3, 9], [21, 9]], [[10, 3.8], [8.5, 9], [12, 20.2]], [[14, 3.8], [15.5, 9], [12, 20.2]]], { w: 0.6, taper: false, shift: 0, part: 'a' }),
      k.sparkleAt(20.4, 15.4, 1.7, { mx: -1, my: -1 }),
    ]
  },
}

// the anime eye (eye, eye-off)
function animeEye(k) {
  const white = k.path('M2.6 12 C4.6 7.6 8 5.2 12 5.2 C16 5.2 19.4 7.6 21.4 12 C19.4 16.4 16 18.8 12 18.8 C8 18.8 4.6 16.4 2.6 12 Z')
  return [
    k.surf(white, 'tint', { shine: 'none' }),
    k.surf(k.clip(k.circle(12, 12, 4.6), white), 'c1', { part: 'a', shine: 'none', ol: 0.35, cast: false }),
    k.paint(k.circle(12, 12.2, 2.2), 'ink', { part: 'a' }),
    k.shine(k.join(k.ellipse(10.5, 10.3, 1.25, 1), k.circle(13.7, 13.8, 0.55))),
    k.ink(['M2.4 11.6 C4.6 7.2 8 4.9 12 4.9 C16 4.9 19.4 7.2 21.6 11.6'], { w: 1.4, taper: 1.6 }),
    k.ink(['M19.8 8.4 L21.4 6.8', 'M17.6 6.4 L18.6 4.6'], { w: 0.8, taper: 1 }),
  ]
}

// a coin stack: side band + top face with an engraved ring
function coinStack(k, cx, top, bottom, rx, part) {
  const ry = 2.3
  return [
    k.surf(k.unite(k.ellipse(cx, bottom, rx, ry), k.rect(cx - rx, top, cx + rx, bottom)), 'c3', { part, shine: 'none' }),
    k.ink([`M${cx - rx + 0.2} ${(top + bottom) / 2} A${rx} ${ry} 0 0 0 ${cx + rx - 0.2} ${(top + bottom) / 2}`], { w: 0.7, part, taper: 0.6 }),
    k.surf(k.ellipse(cx, top, rx, ry), 'c3', { part, shine: 'dot', shineSize: 0.6, ol: 0.42 }),
    k.ink([{ pts: k.ellipse(cx, top, rx * 0.62, ry * 0.58)[0], closed: true }], { w: 0.55, part, taper: false, shift: 0, role: 'accent' }),
  ]
}
