// ANIME redraws, chunk 5: hand-drawn icons for this chunk's batch (see forge/styles/ANIME-GUIDE.md).
// Each entry: name -> (icon, k) => ops, built with the frozen kit (k = prim + kit, see _anime-kit.mjs).
// The exemplars in _anime-render.mjs (EXEMPLAR) win over any entry here (star, trash, user).
//
// Families drawn here (local helpers below):
//   squares       glossy rounded tiles with a white raised glyph (square-*, stop, x-circle)
//   devices       sky bodies with dark glass screens (smartphone, tablet, tv, speaker, webcam, terminal)
//   people        the exemplar anime bust, scaled to the left, with an S badge on the right (user-*)
//   sun family    gold disc + gold rays, horizon in sky (sun, sunrise, sunset, sun-moon)
//   text glyphs   one glossy sky stroke surface + a coral/sakura modifier (strikethrough, sub/superscript, type...)

// ---------------------------------------------------------------------------
// local helpers (built from prim + kit only)

const rotPt = (x, y, deg, cx = 12, cy = 12) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), dx = x - cx, dy = y - cy
  return [cx + dx * c - dy * s, cy + dx * s + dy * c]
}
// a 4-point anime glint shape (concave sides)
const glintShape = (k, cx, cy, r, w = 0.22) => k.path(`M${cx} ${cy - r} C${cx + r * w} ${cy - r * w} ${cx + r * w} ${cy - r * w} ${cx + r} ${cy} C${cx + r * w} ${cy + r * w} ${cx + r * w} ${cy + r * w} ${cx} ${cy + r} C${cx - r * w} ${cy + r * w} ${cx - r * w} ${cy + r * w} ${cx - r} ${cy} C${cx - r * w} ${cy - r * w} ${cx - r * w} ${cy - r * w} ${cx} ${cy - r} Z`)
// white raised glyph (badge/tile style)
const glyph = (k, lines, o = {}) => k.ink(lines, { role: 'tint', w: o.w ?? 2.2, taper: false, shift: 0, part: o.part || 'a' })
// glossy tile
const tile = (k, role, o = {}) => k.surf(k.rr(3, 3, 21, 21, 4), role, { shineSize: 1, ...o })
// arrow shape pointing up, tip at (cx, top), total length len
const arrowUp = (k, cx, top, len, s = 1) => k.unite(
  k.rr(cx - 1.15 * s, top + 2.6 * s, cx + 1.15 * s, top + len, 1 * s),
  k.poly([[cx, top], [cx + 3.6 * s, top + 3.9 * s], [cx - 3.6 * s, top + 3.9 * s]], [0.7 * s, 0.8 * s, 0.8 * s]),
)
const arrowAt = (k, cx, cy, len, deg, s = 1) => k.rot(arrowUp(k, cx, cy - len / 2, len, s), deg, cx, cy)
// round badge on the S plate with a white glyph
function badge(k, cx, cy, r, role, lines, o = {}) {
  return [
    k.moat(k.circle(cx, cy, r), 0.75),
    k.surf(k.circle(cx, cy, r), role, { part: 's', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
    ...(lines ? [k.ink(lines, { role: 'tint', w: o.w ?? 1.3, taper: false, shift: 0, part: 's' })] : []),
  ]
}
// slash for -off icons: moat + coral bar
const slash = (k, x0 = 4, y0 = 4, x1 = 20, y1 = 20) => [
  k.moat(k.seg(x0, y0, x1, y1, 2.2), 0.9),
  k.surf(k.seg(x0, y0, x1, y1, 2.1), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
]
// gold sun rays: n rounded tapered rays around (cx, cy)
const rays = (k, cx, cy, r0, r1, angles, w = 1.7) => k.join(...angles.map(a => {
  const [x0, y0] = rotPt(cx + r0, cy, a, cx, cy), [x1, y1] = rotPt(cx + r1, cy, a, cx, cy)
  return k.seg(x0, y0, x1, y1, w)
}))
// the anime bust (exemplar user), placed at (cx, cy) scale s; head centre = (cx, cy)
// a smooth two-lobe fringe (no zigzag: it read as a crown and as noise at 16 px).
// o.lite: the friend behind in users (no collar, no fringe shine) to stay inside the time budget
function bust(k, cx = 12, cy = 10, s = 1, hair = 'c1', shirt = 'tint', collar = 'c2', clipTo = null, o = {}) {
  const T0 = sh => k.move(k.scale(sh, s, s, 12, 10), cx - 12, cy - 10)
  const T = sh => clipTo ? k.clip(T0(sh), clipTo) : T0(sh)
  const fringe = k.unite(
    k.clip(k.circle(12, 10, 5.1), k.rect(5, 3, 19, 8.8)),
    k.ellipse(9.7, 9.1, 3.2, 1.75, 14),
    k.ellipse(14.6, 8.9, 2.7, 1.55, -16),
  )
  const ol = Math.max(0.3, 0.35 * s)
  return [
    k.surf(T(k.poly([[3.8, 21.4], [5, 17.6], [9, 15.8], [15, 15.8], [19, 17.6], [20.2, 21.4]], [1, 2.4, 1, 1, 2.4, 1])), shirt, { shine: 'none' }),
    ...(o.lite ? [] : [k.surf(T(k.poly([[9.4, 15.9], [14.6, 15.9], [12, 19.4]], [0.5, 0.5, 0.7])), collar, { shine: 'none', ol })]),
    k.surf(T(k.unite(k.circle(12, 10, 5.3), k.rr(6.7, 9.5, 17.3, 15, [0, 0, 2.2, 2.2]))), hair, { shine: 'none', shade: 1.3 }),
    k.surf(T(k.circle(12, 10.7, 4.2)), 'tint', { shine: 'none', ol }),
    k.paint(T(k.join(k.ellipse(10.35, 12.1, 0.62, 0.9), k.ellipse(13.65, 12.1, 0.62, 0.9))), 'ink'),
    // eye glints only on the larger busts: below that they turn to noise at 16-24 px
    ...(s >= 0.85 ? [k.shine(T(k.join(k.circle(10.17, 11.75, 0.26), k.circle(13.47, 11.75, 0.26))))] : []),
    k.surf(T(fringe), hair, { shine: 'none', casts: true }),
    ...(o.lite ? [] : [k.shine(T(k.clip(k.arc(12, 10, 4, 206, 250, 0.8), fringe)))]),
  ]
}
// a person for user-* icons: bust shifted left and smaller
const userL = (k, hair = 'c1', shirt = 'tint', collar = 'c2') => bust(k, 9.2, 9.4, 0.86, hair, shirt, collar)
// sky device body with dark glass
const device = (k, body, screen, o = {}) => [
  k.surf(body, o.role || 'c1', { shineSize: o.shineSize ?? 0.85 }),
  k.surf(screen, 'ink', { inset: true, ol: 0.35, shine: 'glass', shade: 0 }),
]

// a cream anime hand with a sky cuff: palm, a raised thumb and four stacked fingers (flip for down)
function thumb(k, down) {
  const F = sh => down ? k.flipY(sh) : sh
  const fingers = [[12.2, 17.2, 19.4, 21.2], [12.2, 13.1, 20.4, 17.3], [11.6, 9, 20.4, 13.2]]
  return [
    k.surf(F(k.rr(6.6, 9.6, 14, 21.2, 2)), 'tint', { shine: 'none' }),
    k.surf(F(k.unite(k.seg(9.8, 10.4, 11.4, 5, 3.6), k.rr(7.4, 9.4, 13.4, 12.4, 1.4))), 'tint', { shine: 'none' }),
    ...fingers.map(([x0, y0, x1, y1]) => k.surf(F(k.pill(x0, y0, x1, y1)), 'tint', { shine: 'none', ol: 0.45 })),
    k.surf(F(k.rr(2.6, 9.2, 7.4, 21.4, 1.4)), 'c1', { part: 'a', shineSize: 0.6 }),
  ]
}
// a tyre that survives dark mode: ink tread, an edge-tinted rim light, a sky hub cap with a cream nut
const tyre = (k, cx, cy, r = 2.2, part = 'k') => [
  k.surf(k.circle(cx, cy, r), 'ink', { part, shine: 'none', shade: 0, ol: 0.35 }),
  k.paint(k.arc(cx, cy, r - 0.42, 10, 150, 0.5), 'edge', { part, op: 0.9 }),
  k.surf(k.circle(cx, cy, r * 0.55), 'c1', { part, shine: 'none', shade: 0, ol: 0, cast: false, casts: false }),
  k.paint(k.circle(cx - 0.15, cy - 0.15, r * 0.2), 'tint', { part }),
]
// the rising trend line + arrowhead (flipY for falling)
const trend = k => k.unite(k.stroke([[2.6, 17.4], [8.5, 11.5], [12.5, 15.5], [18.6, 9.4]], 2.4), k.poly([[21.4, 6.6], [21.4, 13.4], [14.6, 6.6]], [0.6, 0.9, 0.9]))

// the sky speaker cone (volume family)
const speakerCone = k => k.surf(k.path('M10 5.8 C10.7 5.2 11.8 5.7 11.8 6.6 V17.4 C11.8 18.3 10.7 18.8 10 18.2 L7 15.6 H4.5 C3.7 15.6 3 14.9 3 14 V10 C3 9.1 3.7 8.4 4.5 8.4 H7 Z'), 'c1', { shineSize: 0.7 })
// wifi arcs + dot around (12, 18.6)
const wifiShape = k => k.unite(k.circle(12, 18.6, 1.5), k.arc(12, 18.6, 5, 225, 315, 2.2), k.arc(12, 18.6, 9, 225, 315, 2.2), k.arc(12, 18.6, 13, 228, 312, 2.2))
// the exemplar search magnifier (sky grip, brass rim, pale glass)
const lens = k => [
  k.surf(k.poly([[14.6, 16.6], [16.6, 14.6], [21.4, 19.4], [19.4, 21.4]], 1), 'c1', { part: 'k' }),
  k.surf(k.ring(10.2, 10.2, 7.4, 5.1), 'c3', { shine: 'streak', shineSize: 0.9 }),
  k.surf(k.circle(10.2, 10.2, 5.1), 'edge', { inset: true, ol: 0, shine: 'glass', shade: 0.6 }),
]

// ---------------------------------------------------------------------------
export const R = {
  // ---- batch 1: smartphone .. superscript

  // sky phone, dark glass screen with the diagonal glass shine, cream home bar, speaker slot
  smartphone: (icon, k) => [
    ...device(k, k.rr(6, 2.6, 18, 21.4, 2.6), k.rr(8, 4.8, 16, 15.2, 1)),
    k.surf(k.pill(10.2, 17.3, 13.8, 18.9), 'tint', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
  ],

  // a gold smiley: sparkling anime eyes, rosy cheeks, a happy open smile
  smile: (icon, k) => [
    k.surf(k.circle(12, 12, 9.3), 'c3', { shineSize: 1 }),
    k.paint(k.join(k.ellipse(6.6, 14, 1.5, 0.85), k.ellipse(17.4, 14, 1.5, 0.85)), 'c2', { op: 0.85, part: 'a' }),
    k.paint(k.join(k.ellipse(9, 10.2, 1.05, 1.5), k.ellipse(15, 10.2, 1.05, 1.5)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(8.65, 9.55, 0.42), k.circle(14.65, 9.55, 0.42), k.circle(9.3, 10.95, 0.2), k.circle(15.3, 10.95, 0.2))),
    k.surf(k.path('M8.2 14 C9.2 17.6 14.8 17.6 15.8 14 Z'), 'ink', { part: 'a', ol: 0, shine: 'none', shade: 0, cast: false, casts: false }),
    k.paint(k.ellipse(12, 16.3, 1.6, 0.7), 'accent', { part: 'a' }),
  ],

  // an ice-blue snowflake: three crossed spokes with branches, a cream crystal heart
  snowflake: (icon, k) => {
    const spokes = [90, 30, 150].map(a => { const [x0, y0] = rotPt(21.2, 12, a), [x1, y1] = rotPt(2.8, 12, a); return k.seg(x0, y0, x1, y1, 2) })
    const tw = []
    for (let i = 0; i < 6; i++) {
      const a = -90 + i * 60, [bx, by] = rotPt(12 + 6.3, 12, a)
      for (const d of [-48, 48]) { const [tx, ty] = rotPt(bx + 2.9, by, a + d, bx, by); tw.push(k.seg(bx, by, tx, ty, 1.6)) }
    }
    return [
      k.surf(k.unite(...spokes, ...tw), 'c1', { shineSize: 0.75 }),
      k.surf(k.ngon(12, 12, 2.5, 6, -90, 0.5), 'tint', { part: 'a', shine: 'none', ol: 0.4, shade: 0.6 }),
      k.sparkleAt(19.6, 20, 1.5, { mx: -1, my: -1 }),
    ]
  },

  // a plump sakura sofa: back cushion, seat, rolled arms, little ink legs
  sofa: (icon, k) => [
    k.ink([[[5.4, 18], [5.2, 20.4]], [[18.6, 18], [18.8, 20.4]]], { w: 1.4, taper: false }),
    k.surf(k.rr(5.4, 5.6, 18.6, 13.6, 2.4), 'c2', { shine: 'none' }),
    k.surf(k.rr(4.6, 12.4, 19.4, 18.6, 1.4), 'c2', { shine: 'none' }),
    k.ink([[12, 13.6], [12, 16.6]], { w: 0.8 }),
    k.surf(k.rr(2.4, 10.4, 6.6, 18.8, 2.1), 'c2', { shineSize: 0.6 }),
    k.surf(k.rr(17.4, 10.4, 21.6, 18.8, 2.1), 'c2', { shineSize: 0.6 }),
  ],

  // a sky down-arrow beside three sakura bars, longest first
  sort: (icon, k) => [
    k.surf(k.rot(arrowUp(k, 6, 3.4, 17), 180, 6, 12), 'c1', { part: 'a', shineSize: 0.7 }),
    k.surf(k.pill(12.6, 3.9, 21.4, 6.5), 'c2', { shine: 'dot', shineSize: 0.55 }),
    k.surf(k.pill(12.6, 10.7, 18.6, 13.3), 'c2', { shine: 'dot', shineSize: 0.55 }),
    k.surf(k.pill(12.6, 17.5, 15.8, 20.1), 'c2', { shine: 'dot', shineSize: 0.55 }),
  ],

  // a sakura bowl of golden soup, herbs floating, three wisps of steam
  soup: (icon, k) => [
    k.tube(['M8 9.4 C6.4 8.3 9.6 6.4 8 4.6', 'M12 9.4 C10.4 8.3 13.6 6.4 12 4.6', 'M16 9.4 C14.4 8.3 17.6 6.4 16 4.6'], 'tint', { part: 'a', w: 0.95, ol: 0.42, shade: 0 }),
    k.surf(k.rr(8.6, 19, 15.4, 21.4, [0, 0, 1, 1]), 'c2', { shine: 'none', ol: 0.4 }),
    k.surf(k.path('M2.4 11.4 H21.6 C21.6 16.6 17.4 20.4 12 20.4 C6.6 20.4 2.4 16.6 2.4 11.4 Z'), 'c2', { shineSize: 0.9 }),
    k.surf(k.ellipse(12, 11.4, 8.6, 1.5), 'c3', { inset: true, ol: 0.35, shine: 'none', shade: 0.5 }),
    k.paint(k.join(k.circle(9, 11.3, 0.55), k.circle(14.6, 11.6, 0.55)), 'c4'),
  ],

  // three anime sparkles: a big gold star-glint, a sakura and a sky twin
  sparkles: (icon, k) => [
    k.surf(glintShape(k, 9.4, 13, 7.6), 'c3', { shineSize: 0.8 }),
    k.surf(glintShape(k, 18, 6, 3, 0.26), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(glintShape(k, 18.5, 17.2, 2.6, 0.28), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
  ],

  // a sky speaker cabinet with a dark woofer, glinting tweeter
  speaker: (icon, k) => [
    k.surf(k.rr(5, 2.6, 19, 21.4, 2.4), 'c1', { shineSize: 0.85 }),
    k.surf(k.circle(12, 14.6, 4.6), 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.35 }),
    k.surf(k.circle(12, 14.6, 2.7), 'c1', { part: 'a', inset: true, ol: 0, shine: 'glint', shineSize: 0.8, tone: ['ink', 0.35] }),
    k.surf(k.circle(12, 6.9, 1.7), 'ink', { part: 'a', inset: true, ol: 0.35, shine: 'glint', shineSize: 0.55, shade: 0 }),
  ],

  // a fresh green sprout, two glossy leaves on a stem in a little mound of earth
  sprout: (icon, k) => [
    k.surf(k.seg(12, 20, 12, 10.6, 1.7), 'c4', { shine: 'none', ol: 0.4 }),
    k.surf(k.lens(12.2, 12.9, 3.2, 5.8, 2.7), 'c4', { part: 'a', shine: 'none' }),
    k.ink('M11 11.8 C9 10.6 7.2 9.2 5.6 7.4', { w: 0.7, part: 'a' }),
    k.surf(k.lens(12, 10.6, 20.8, 2.9, 2.9), 'c4', { part: 'a', shineSize: 0.75 }),
    k.surf(k.path('M5.6 21.4 C6.2 18.6 8.8 17.8 12 17.8 C15.2 17.8 17.8 18.6 18.4 21.4 Z'), 'c3', { shine: 'none' }),
    k.sparkleAt(5.2, 15.4, 1.6, { mx: 1, my: 1 }),
  ],

  // glossy tiles
  square: (icon, k) => [tile(k, 'c1')],
  'square-minus': (icon, k) => [tile(k, 'c1'), glyph(k, [[[7.8, 12], [16.2, 12]]])],
  'square-plus': (icon, k) => [tile(k, 'c4'), glyph(k, [[[12, 7.8], [12, 16.2]], [[7.8, 12], [16.2, 12]]])],
  'square-x': (icon, k) => [tile(k, 'accent'), glyph(k, [[[8.6, 8.6], [15.4, 15.4]], [[15.4, 8.6], [8.6, 15.4]]])],
  stop: (icon, k) => [k.surf(k.rr(4.6, 4.6, 19.4, 19.4, 3.2), 'accent', { shineSize: 0.95 })],

  // half a gold star, the other half empty cream
  'star-half': (icon, k) => {
    const st = k.starShape(12, 12.9, 9.6, 4.5, 1.1)
    return [
      k.surf(st, 'tint', { shine: 'none', shade: 0.6 }),
      k.surf(k.clip(st, k.rect(0, 0, 12, 24)), 'c3', { part: 'a', cast: false, ol: 0, shineSize: 0.9 }),
      k.ink([[12, 4.6], [12, 17.6]], { w: 0.8, taper: false, part: 'a' }),
    ]
  },

  // sky tubing, gold ear tips and a gold chest piece with a pale glass face
  stethoscope: (icon, k) => [
    k.tube('M4.6 3 H5.6 V8.5 C5.6 10.4 7.2 12 9 12 C10.8 12 12.4 10.4 12.4 8.5 V3 H13.4', 'c1', { w: 1.5 }),
    k.tube('M9 12 V16 C9 18.8 11.2 20.6 14 20.6 C16.8 20.6 19 18.8 19 16 V14', 'c1', { part: 'a', w: 1.5 }),
    k.surf(k.join(k.circle(4.2, 3.3, 1.2), k.circle(13.8, 3.3, 1.2)), 'c3', { shine: 'none', ol: 0.35 }),
    k.surf(k.circle(19, 11.2, 3), 'c3', { part: 'a', shineSize: 0.7 }),
    k.surf(k.circle(19, 11.2, 1.5), 'edge', { part: 'a', inset: true, ol: 0.3, shine: 'none', shade: 0.6 }),
  ],

  // a gold sticky note with a peeling corner, ink lines and a sakura washi tape
  'sticky-note': (icon, k) => [
    k.surf(k.poly([[3.2, 3.6], [20.8, 3.6], [20.8, 15], [15, 20.8], [3.2, 20.8]], [1.8, 1.8, 0.4, 0.4, 1.8]), 'c3', { shine: 'none' }),
    k.ink([[[6.8, 9], [16.8, 9]], [[6.8, 12.6], [13, 12.6]]], { w: 0.85 }),
    k.surf(k.poly([[20.8, 15], [16.4, 15.4], [15.4, 16.4], [15, 20.8]], [0.2, 1, 1, 0.2]), 'c3', { part: 'a', shine: 'none', ol: 0.4, shade: 1.3 }),
    k.surf(k.rot(k.rr(8.2, 2, 15.8, 4.8, 0.3), -5, 12, 3.4), 'c2', { shine: 'none', ol: 0.35, shade: 0.5 }),
  ],

  // a little shop: sakura and cream striped awning, cream walls, gold door, a lit window
  store: (icon, k) => {
    const awn = k.path('M6 3 H18 L21.2 8.6 C21.2 10 19.9 11 18.1 11 C16.3 11 15 10 15 8.6 C15 10 13.7 11 12 11 C10.3 11 9 10 9 8.6 C9 10 7.7 11 5.9 11 C4.1 11 2.8 10 2.8 8.6 Z')
    return [
      k.surf(k.rr(4.4, 9, 19.6, 21.2, [0, 0, 2, 2]), 'tint', { shine: 'none' }),
      k.surf(k.arch(9.6, 14.4, 14.4, 21.2), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
      k.surf(k.rr(15.6, 13.4, 18.2, 16.4, 0.6), 'edge', { inset: true, ol: 0.35, shine: 'glass', shineSize: 0.6, shade: 0.5 }),
      k.surf(awn, 'c2', { shineSize: 0.7 }),
      k.surf(k.clip(awn, k.poly([[10, 2], [14, 2], [15.2, 12], [8.8, 12]])), 'tint', { shine: 'none', cast: false, ol: 0, shade: 0.5 }),
    ]
  },

  // a glossy sky S with a coral strike bar
  strikethrough: (icon, k) => [
    k.surf(k.stroke(['M16.8 6.2 C15.8 4.9 14.1 4.2 12 4.2 C8.8 4.2 6.7 5.9 6.7 8 C6.7 10.2 8.6 11.6 12 12 C15.4 12.4 17.4 13.8 17.4 16 C17.4 18.2 15.2 19.8 12 19.8 C9.8 19.8 8.1 19.1 7.1 17.8'], 2.6), 'c1', { shineSize: 0.7 }),
    k.moat(k.seg(3.4, 12, 20.6, 12, 2), 0.6),
    k.surf(k.seg(3.4, 12, 20.6, 12, 2), 'accent', { part: 'a', shine: 'none', ol: 0.4 }),
  ],

  // sky X with a small sakura 2 below / above
  subscript: (icon, k) => [
    k.surf(k.unite(k.seg(4, 4.4, 12.2, 14.6, 2.7), k.seg(12.2, 4.4, 4, 14.6, 2.7)), 'c1', { shineSize: 0.7 }),
    k.surf(k.stroke('M16.4 15.4 C16.4 14 17.4 13.2 18.7 13.2 C20 13.2 21 14 21 15.3 C21 16.8 19.6 17.8 16.6 20.6 H21.2', 1.7), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
  ],
  superscript: (icon, k) => [
    k.surf(k.unite(k.seg(4, 9.4, 12.2, 19.6, 2.7), k.seg(12.2, 9.4, 4, 19.6, 2.7)), 'c1', { shineSize: 0.7 }),
    k.surf(k.stroke('M16.4 5.4 C16.4 4 17.4 3.2 18.7 3.2 C20 3.2 21 4 21 5.3 C21 6.8 19.6 7.8 16.6 10.6 H21.2', 1.7), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
  ],

  // the gold sun with eight soft rays
  sun: (icon, k) => [
    k.surf(rays(k, 12, 12, 7.3, 9.3, [0, 45, 90, 135, 180, 225, 270, 315], 1.9), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.circle(12, 12, 4.9), 'c3', { shineSize: 0.85 }),
  ],

  // half gold sun, half sky moon, rays on the day side
  'sun-moon': (icon, k) => {
    const disc = k.circle(13, 12, 5.8)
    return [
      k.surf(rays(k, 13, 12, 7.7, 9.6, [120, 150, 180, 210, 240], 1.8), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
      k.surf(disc, 'c3', { shineSize: 0.75 }),
      k.surf(k.cut(disc, k.circle(4.6, 12, 9.6)), 'c1', { cast: false, shine: 'none', ol: 0 }),
      k.paint(k.join(k.circle(16.6, 10, 0.7), k.circle(17.4, 14, 0.5)), 'shadow', { op: 0.35 }),
      k.sparkleAt(20.2, 4.2, 1.6, { mx: -1, my: 1 }),
    ]
  },

  // half sun on a sky horizon with a coral arrow rising / a sakura arrow setting
  sunrise: (icon, k) => [
    k.surf(rays(k, 12, 16.6, 7.6, 9.3, [195, 235, 305, 345], 1.7), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.clip(k.circle(12, 16.8, 5.8), k.rect(0, 0, 24, 17)), 'c3', { shineSize: 0.75 }),
    k.surf(k.pill(2.4, 16.2, 21.6, 18.2), 'c1', { shine: 'none' }),
    k.surf(k.pill(7.6, 19.8, 16.4, 21.6), 'c1', { shine: 'none', ol: 0.4 }),
    k.surf(arrowUp(k, 12, 2.4, 7.4, 0.8), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
  ],
  sunset: (icon, k) => [
    k.surf(rays(k, 12, 16.6, 7.6, 9.3, [195, 235, 305, 345], 1.7), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.clip(k.circle(12, 16.8, 5.8), k.rect(0, 0, 24, 17)), 'c3', { shineSize: 0.75 }),
    k.surf(k.pill(2.4, 16.2, 21.6, 18.2), 'c1', { shine: 'none' }),
    k.surf(k.pill(7.6, 19.8, 16.4, 21.6), 'c1', { shine: 'none', ol: 0.4 }),
    k.surf(k.rot(arrowUp(k, 12, 2.4, 7.4, 0.8), 180, 12, 6.1), 'c2', { part: 's', shine: 'none', ol: 0.4 }),
  ],

  // ---- batch 2: swap .. trending-up

  // a sky arrow going right over a sakura arrow coming back
  swap: (icon, k) => [
    k.surf(arrowAt(k, 12, 7, 17.6, 90, 1.2), 'c1', { shineSize: 0.7 }),
    k.surf(arrowAt(k, 12, 17, 17.6, 270, 1.2), 'c2', { part: 'a', shineSize: 0.7 }),
  ],

  // a glass syringe with sakura serum, sky plunger and fittings, a fine needle
  syringe: (icon, k) => {
    const R = s => k.rot(s, 45, 12, 12)
    const barrel = k.rr(9, 8.4, 15, 17.4, 1)
    return [
      k.surf(R(k.seg(12, 18.6, 12, 23.2, 0.75)), 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.25 }),
      k.surf(R(k.rr(11.1, 2.6, 12.9, 8.8, 0.4)), 'c1', { part: 'a', shine: 'none', ol: 0.35 }),
      k.surf(R(k.pill(8.8, 1.2, 15.2, 3.2)), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
      k.surf(R(barrel), 'edge', { shine: 'none', shade: 0.6 }),
      k.surf(R(k.clip(barrel, k.rect(0, 11.6, 24, 24))), 'c2', { cast: false, ol: 0, shine: 'none' }),
      k.shine(R(k.rr(9.9, 9.2, 10.7, 16.4, 0.4)), { op: 0.85 }),
      k.ink([[[13.2, 10.6], [15, 10.6]], [[13.2, 13], [15, 13]], [[13.2, 15.4], [15, 15.4]]].map(l => l.map(([x, y]) => rotPt(x, y, 45))), { w: 0.6, taper: false, shift: 0 }),
      k.surf(R(k.rr(7.6, 7.6, 16.4, 9.2, 0.6)), 'c1', { shine: 'none', ol: 0.4 }),
      k.surf(R(k.rr(10.6, 17, 13.4, 18.8, 0.4)), 'c1', { shine: 'none', ol: 0.35 }),
    ]
  },

  // a cream data table with a sky header row and ink rules
  table: (icon, k) => {
    const body = k.rr(3, 3.2, 21, 20.8, 2.4)
    return [
      k.surf(body, 'tint', { shine: 'none' }),
      k.surf(k.clip(body, k.rect(2, 2, 22, 8.8)), 'c1', { cast: false, shineSize: 0.6 }),
      k.ink([[[3.8, 14.8], [20.2, 14.8]], [[9, 9.6], [9, 20]], [[15, 9.6], [15, 20]]], { w: 0.8, taper: false, shift: 0 }),
    ]
  },

  // a sky tablet with dark glass and a cream home bar
  tablet: (icon, k) => [
    ...device(k, k.rr(4, 2.6, 20, 21.4, 2.4), k.rr(6, 4.6, 18, 16, 1)),
    k.surf(k.pill(10.2, 17.5, 13.8, 19.1), 'tint', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
  ],

  // a sakura price tag with a punched hole and a sparkle
  tag: (icon, k) => [
    k.surf(k.path('M3 5 C3 3.9 3.9 3 5 3 H13 L20.5 10.5 C21.6 11.6 21.6 13.4 20.5 14.5 L14.5 20.5 C13.4 21.6 11.6 21.6 10.5 20.5 L3 13 Z'), 'c2', { shineSize: 0.85 }),
    k.surf(k.circle(8, 8, 1.5), 'tint', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
    k.ink([[11.2, 13.4], [14.6, 16.8]], { w: 0.9, role: 'tint', shift: 0, taper: false }),
    k.sparkleAt(19.6, 4.2, 1.7, { mx: -1, my: 1 }),
  ],

  // a coral and cream archery target with a gold bullseye
  target: (icon, k) => [
    k.surf(k.circle(12, 12, 9.3), 'accent', { shineSize: 0.95 }),
    k.surf(k.ring(12, 12, 7.1, 5), 'tint', { cast: false, ol: 0, shine: 'none', shade: 0.6 }),
    k.surf(k.circle(12, 12, 2.6), 'c3', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
  ],

  // a gold taxi with a coral roof sign, dark windows and a checker band
  taxi: (icon, k) => {
    const body = k.path('M2.6 17 V14 C2.6 12.9 3.5 12 4.6 12 H5.6 L8 7 H13.6 L17.6 12 H19.4 C20.5 12 21.4 12.9 21.4 14 V17 C21.4 17.8 20.8 18.4 20 18.4 H4 C3.2 18.4 2.6 17.8 2.6 17 Z')
    const checks = k.join(...[4.4, 7.6, 10.8, 14, 17.2].map(x => k.rect(x, 13.6, x + 1.6, 14.8)), ...[6, 9.2, 12.4, 15.6, 18.8].map(x => k.rect(x, 14.8, x + 1.6, 16)))
    return [
      k.surf(k.rr(9, 4, 12.6, 7.4, [0.8, 0.8, 0, 0]), 'accent', { part: 'a', shine: 'none', ol: 0.4 }),
      k.surf(body, 'c3', { shineSize: 0.8 }),
      k.paint(k.clip(checks, body), 'ink', { op: 0.85 }),
      k.surf(k.poly([[8.6, 8.3], [10.4, 8.3], [10.4, 11.6], [6.9, 11.6]], 0.4), 'ink', { inset: true, ol: 0, shine: 'glass', shade: 0, shineSize: 0.5 }),
      k.surf(k.poly([[11.6, 8.3], [13, 8.3], [15.6, 11.6], [11.6, 11.6]], 0.4), 'ink', { inset: true, ol: 0, shine: 'glass', shade: 0, shineSize: 0.5 }),
      ...tyre(k, 7.2, 18.4),
      ...tyre(k, 16.8, 18.4),
    ]
  },

  // a sky telescope on an ink tripod, gold lens cap, a star to look at
  telescope: (icon, k) => [
    k.tube([[[12, 11], [8.2, 20.6]], [[12, 11], [15.8, 20.6]], [[12, 11], [12, 20.6]]], 'c3', { part: 'a', w: 1.3, ol: 0.42 }),
    k.surf(k.path('M6.23 13.32 L16.02 8.2 L13.77 4.3 L4.44 10.22 C3.99 10.51 3.84 11.11 4.11 11.57 L4.9 12.93 C5.18 13.4 5.77 13.56 6.23 13.32 Z'), 'c1', { shineSize: 0.75 }),
    k.surf(k.path('M17.26 8.35 L18.13 7.85 C18.61 7.57 18.78 6.96 18.5 6.48 L16.5 3.02 C16.22 2.54 15.61 2.37 15.13 2.65 L14.26 3.15 C13.78 3.43 13.61 4.04 13.9 4.52 L15.9 7.98 C16.18 8.46 16.79 8.63 17.26 8.35 Z'), 'c3', { shine: 'dot', shineSize: 0.6, ol: 0.45 }),
    k.surf(k.circle(12, 11, 1.2), 'c3', { shine: 'none', ol: 0.35 }),
    k.sparkleAt(5.4, 4.6, 1.8, { mx: 1, my: 1 }),
  ],

  // a coral racket with a pale string bed, sky grip, a gold ball
  tennis: (icon, k) => {
    const head = k.ellipse(9, 9, 7, 5.4, 45), bed = k.ellipse(9, 9, 5.3, 3.8, 45)
    const strings = k.clip(k.join(...[-3, 0, 3].map(o => k.rot(k.seg(9 + o, 2, 9 + o, 16, 0.55), 45, 9, 9)), ...[-2.2, 0, 2.2].map(o => k.rot(k.seg(2, 9 + o, 16, 9 + o, 0.55), 45, 9, 9))), bed)
    return [
      k.surf(k.seg(13.6, 13.6, 20.4, 20.4, 2.3), 'c1', { part: 'a', shine: 'none' }),
      k.surf(k.cut(head, bed), 'accent', { part: 'a', shineSize: 0.75 }),
      k.surf(bed, 'tint', { part: 'a', inset: true, ol: 0, shine: 'none', shade: 0.5 }),
      k.paint(strings, 'ink', { op: 0.45, part: 'a' }),
      k.surf(k.circle(19, 5, 2.6), 'c3', { shine: 'dot', shineSize: 0.6, ol: 0.45 }),
      k.ink('M17.2 3.4 C18.6 4.4 18.6 5.8 17.4 7', { w: 0.6, role: 'tint', shift: 0, taper: false }),
    ]
  },

  // a coral tent on green grass, dark doorway with a cream flap, crossed poles
  tent: (icon, k) => [
    k.tube([[12, 4.4], [12, 1.4]], 'c3', { part: 'a', w: 0.9, ol: 0.4 }),
    k.deco(k.poly([[12.3, 1.2], [16, 2.1], [12.3, 3.1]], [0.2, 0.4, 0.2]), 'c3', { ol: 0.4 }),
    k.surf(k.pill(2.4, 19.2, 21.6, 21.4), 'c4', { shine: 'none', ol: 0.4 }),
    k.surf(k.poly([[12, 3.4], [21.2, 19.8], [2.8, 19.8]], [1.4, 1, 1]), 'accent', { shineSize: 0.8 }),
    k.surf(k.poly([[12, 9.4], [16.6, 19.8], [7.4, 19.8]], [0.6, 0.3, 0.3]), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
    k.surf(k.poly([[12, 9.4], [10.4, 19.8], [7.4, 19.8]], [0.5, 0.3, 0.3]), 'tint', { part: 'a', shine: 'none', ol: 0.35, cast: false }),
    k.surf(k.poly([[12, 9.4], [16.6, 19.8], [14.6, 19.8]], [0.5, 0.3, 0.3]), 'tint', { part: 'a', shine: 'none', ol: 0.35, cast: false }),
  ],

  // a sky terminal window with a dark console, green prompt and a cream cursor
  terminal: (icon, k) => [
    k.surf(k.rr(2.4, 3.6, 21.6, 20.4, 2.4), 'c1', { shineSize: 0.75 }),
    k.paint(k.join(k.circle(5, 5.7, 0.6), k.circle(7, 5.7, 0.6)), 'tint'),
    k.surf(k.rr(4, 7.4, 20, 18.8, 1.2), 'ink', { inset: true, ol: 0.35, shine: 'none', shade: 0 }),
    k.ink([[6.8, 10], [9.6, 12.8], [6.8, 15.6]], { role: 'c4', w: 1.5, taper: false, shift: 0, part: 'a' }),
    k.ink([[11.8, 15.6], [16.4, 15.6]], { role: 'tint', w: 1.5, taper: false, shift: 0, part: 'a' }),
  ],

  // a cream input field with a sky placeholder and a sakura text cursor
  'text-cursor-input': (icon, k) => {
    const beam = k.unite(k.seg(14.6, 3.4, 14.6, 20.6, 1.8), k.seg(12.6, 3.4, 16.6, 3.4, 1.8), k.seg(12.6, 20.6, 16.6, 20.6, 1.8))
    return [
      k.surf(k.rr(2.4, 7, 21.6, 17, 2.2), 'tint', { shine: 'none' }),
      k.surf(k.pill(5, 10.8, 10.4, 13.2), 'c1', { part: 'a', shine: 'none', ol: 0.35 }),
      k.moat(beam, 0.6),
      k.surf(beam, 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
    ]
  },

  // a glass thermometer with a coral column and ink scale
  thermometer: (icon, k) => [
    k.surf(k.unite(k.rr(6.6, 2.6, 11.4, 15, 2.4), k.circle(9, 16.9, 4.1)), 'tint', { shine: 'glass', shineSize: 0.7 }),
    k.surf(k.unite(k.rr(8.1, 7.6, 9.9, 16, 0.9), k.circle(9, 16.9, 2.5)), 'accent', { part: 'a', cast: false, ol: 0.3, shine: 'dot', shineSize: 0.55 }),
    k.tube([[[15.2, 5], [19.4, 5]], [[15.2, 9], [17.8, 9]], [[15.2, 13], [19.4, 13]]], 'c1', { w: 1.5, ol: 0.42, part: 'a' }),
  ],

  // a cream anime hand giving a thumbs up / down, sky cuff
  'thumbs-up': (icon, k) => thumb(k, false),
  'thumbs-down': (icon, k) => thumb(k, true),

  // a sakura admission ticket, notched sides, perforation and a gold star
  ticket: (icon, k) => [
    k.surf(k.path('M4 5 H20 C21.1 5 22 5.9 22 7 V9.5 C20.6 9.5 19.5 10.6 19.5 12 C19.5 13.4 20.6 14.5 22 14.5 V17 C22 18.1 21.1 19 20 19 H4 C2.9 19 2 18.1 2 17 V14.5 C3.4 14.5 4.5 13.4 4.5 12 C4.5 10.6 3.4 9.5 2 9.5 V7 C2 5.9 2.9 5 4 5 Z'), 'c2', { shineSize: 0.8 }),
    k.paint(k.join(k.circle(15.5, 7.6, 0.65), k.circle(15.5, 10.5, 0.65), k.circle(15.5, 13.5, 0.65), k.circle(15.5, 16.4, 0.65)), 'tint', { part: 'a' }),
    k.surf(k.starShape(9.8, 12.3, 3.6, 1.7, 0.4), 'c3', { shine: 'none', ol: 0.4 }),
  ],

  // a sky stopwatch with gold buttons, a cream face and a sakura sweep
  timer: (icon, k) => [
    k.surf(k.rr(11.1, 3.6, 12.9, 6.6, 0.3), 'c3', { shine: 'none', ol: 0.35 }),
    k.surf(k.rr(9.6, 2.2, 14.4, 4.2, 1), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rot(k.rr(18, 5.2, 21, 7.2, 0.8), 45, 19.5, 6.2), 'c3', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.circle(12, 13.6, 7.8), 'c1', { shineSize: 0.85 }),
    k.surf(k.circle(12, 13.6, 5.6), 'tint', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
    k.paint(k.sector(12, 13.6, 5.2, -90, -40), 'c2', { op: 0.75 }),
    k.ink([[12, 13.6], [14.8, 10.8]], { w: 1.1, part: 'a', taper: 0.6 }),
    k.paint(k.circle(12, 13.6, 0.8), 'accent'),
  ],

  // a green switch, on, with a glossy cream knob
  toggle: (icon, k) => [
    k.surf(k.pill(2.4, 5.6, 21.6, 18.4), 'c4', { shineSize: 0.8 }),
    k.surf(k.circle(15.2, 12, 4.6), 'tint', { part: 'a', shine: 'dot', shineSize: 0.7, ol: 0.45 }),
  ],

  // a cream toilet: tank with a gold flush lever, sakura seat, porcelain bowl
  toilet: (icon, k) => [
    k.surf(k.rr(4, 2.6, 10.2, 11.4, 1.6), 'tint', { shine: 'none' }),
    k.surf(k.rr(5.2, 4.4, 7.6, 5.6, 0.5), 'c3', { part: 'a', shine: 'none', ol: 0.3 }),
    k.surf(k.poly([[9.4, 15.6], [14.6, 15.6], [15.6, 21.2], [8.4, 21.2]], [0.3, 0.3, 0.8, 0.8]), 'tint', { part: 'a', shine: 'none' }),
    k.surf(k.path('M3.6 11.6 H20.4 C20.4 14.4 18.2 16.6 15 16.6 H9 C5.8 16.6 3.6 14.4 3.6 11.6 Z'), 'tint', { shineSize: 0.75 }),
    k.surf(k.pill(3, 10, 21, 12.4), 'c2', { shine: 'none', ol: 0.45 }),
  ],

  // a gleaming white tooth with a sparkle
  tooth: (icon, k) => [
    k.surf(k.path('M12 5.5 C10.5 4 8.5 3 6.5 3.5 C4 4 3 6.5 3.5 9.5 C4 12 5.5 13.5 6 16 C6.5 19 7 21 8.5 21 C10 21 10 18.5 10.5 16.5 C10.75 15.25 11.25 14.5 12 14.5 C12.75 14.5 13.25 15.25 13.5 16.5 C14 18.5 14 21 15.5 21 C17 21 17.5 19 18 16 C18.5 13.5 20 12 20.5 9.5 C21 6.5 20 4 17.5 3.5 C15.5 3 13.5 4 12 5.5 Z'), 'tint', { rim: true, shineSize: 0.9 }),
    k.sparkleAt(20.6, 18.4, 1.8, { mx: -1, my: -1 }),
  ],

  // a coral traffic cone with cream reflective bands on a coral base
  'traffic-cone': (icon, k) => {
    const cone = k.poly([[10.4, 3], [13.6, 3], [18.2, 20], [5.8, 20]], [1, 1, 0.4, 0.4])
    return [
      k.surf(k.rr(2.6, 18.8, 21.4, 21.4, 1.1), 'accent', { shine: 'none' }),
      k.surf(cone, 'accent', { shineSize: 0.8 }),
      k.surf(k.clip(cone, k.join(k.rect(0, 7.8, 24, 10.2), k.rect(0, 13.4, 24, 16))), 'tint', { part: 'a', cast: false, ol: 0, shine: 'none', shade: 0.6 }),
    ]
  },

  // a sky bullet train front: dark windscreen, coral stripe, gold lamps, ink rails
  train: (icon, k) => {
    const body = k.rr(4, 2.6, 20, 17.6, [4.4, 4.4, 2.2, 2.2])
    return [
      k.ink([[[8, 17.6], [5.6, 21.4]], [[16, 17.6], [18.4, 21.4]]], { w: 1.3, part: 'a' }),
      k.surf(body, 'c1', { shineSize: 0.8 }),
      k.surf(k.clip(body, k.rect(0, 11.2, 24, 12.6)), 'accent', { cast: false, ol: 0, shine: 'none' }),
      k.surf(k.rr(6.2, 4.8, 17.8, 9.8, [2.6, 2.6, 0.8, 0.8]), 'ink', { inset: true, ol: 0.35, shine: 'glass', shade: 0 }),
      k.surf(k.join(k.circle(8.2, 14.8, 1.25), k.circle(15.8, 14.8, 1.25)), 'c3', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.35 }),
    ]
  },

  // a green pine in three stacked tiers, gold trunk
  'tree-pine': (icon, k) => [
    k.surf(k.rr(10.8, 17.6, 13.2, 21.6, 0.5), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.poly([[12, 8.6], [20, 18.6], [4, 18.6]], [1, 1.2, 1.2]), 'c4', { shine: 'none' }),
    k.surf(k.poly([[12, 5.4], [17.8, 13.4], [6.2, 13.4]], [1, 1, 1]), 'c4', { shine: 'none' }),
    k.surf(k.poly([[12, 2.4], [16, 8.6], [8, 8.6]], [0.9, 0.8, 0.8]), 'c4', { shineSize: 0.6 }),
    k.sparkleAt(19.4, 4.6, 1.7, { mx: -1, my: 1 }),
  ],

  // a glossy green rising trend with its arrowhead, and the coral falling one
  'trending-up': (icon, k) => [
    k.surf(trend(k), 'c4', { shineSize: 0.75 }),
  ],
  'trending-down': (icon, k) => [k.surf(k.flipY(trend(k)), 'accent', { shineSize: 0.75 })],

  // ---- batch 3: triangle .. video-camera

  // a glossy sakura triangle with a sparkle
  triangle: (icon, k) => [
    k.surf(k.poly([[12, 3.4], [21.4, 20.2], [2.6, 20.2]], [2.2, 1.8, 1.8]), 'c2', { shineSize: 0.95 }),
  ],

  // a gold trophy cup with handles, a cream star, on a sakura plinth
  trophy: (icon, k) => [
    k.surf(k.join(k.arc(5.6, 7.8, 2.5, 90, 270, 1.6), k.arc(18.4, 7.8, 2.5, -90, 90, 1.6)), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(10.8, 13.4, 13.2, 17.6, 0.4), 'c3', { shine: 'none', ol: 0.4 }),
    k.surf(k.path('M6.6 3 H17.4 V8.6 C17.4 11.6 15 14 12 14 C9 14 6.6 11.6 6.6 8.6 Z'), 'c3', { shineSize: 0.9 }),
    k.surf(k.starShape(12, 8.2, 2.9, 1.3, 0.3), 'tint', { inset: true, ol: 0, shine: 'none', shade: 0, tone: ['accent', 0.3] }),
    k.surf(k.rr(7.4, 17, 16.6, 21.2, 1.3), 'c2', { shine: 'none' }),
    k.sparkleAt(20.4, 15.4, 1.6, { mx: -1, my: -1 }),
  ],

  // a delivery truck: cream cargo box with a sky stripe, sky cab, dark glass, sky-hub wheels
  truck: (icon, k) => [
    k.surf(k.path('M14 9.2 H17.6 C18.1 9.2 18.5 9.4 18.8 9.8 L21.4 13.4 V16.4 C21.4 17.1 20.9 17.6 20.2 17.6 H14 Z'), 'c1', { shineSize: 0.6 }),
    k.surf(k.poly([[15.4, 10.6], [17.5, 10.6], [19.5, 13.3], [15.4, 13.3]], 0.4), 'ink', { inset: true, ol: 0, shine: 'glass', shade: 0, shineSize: 0.5 }),
    k.surf(k.rr(2.4, 4.6, 14.6, 17.6, 1.8), 'tint', { shine: 'none' }),
    k.paint(k.rect(2.4, 12.4, 14.6, 14.2), 'c1', { op: 1 }),
    ...tyre(k, 6.8, 18.2, 2.2, 'a'),
    ...tyre(k, 17.6, 18.2, 2.2, 'a'),
  ],

  // a cute green turtle: domed shell with a gold rim, head with a shiny eye and a blush
  turtle: (icon, k) => [
    k.surf(k.join(k.pill(4.6, 14, 7.6, 19), k.pill(12.4, 14, 15.4, 19)), 'c4', { shine: 'none', ol: 0.4 }),
    k.surf(k.unite(k.circle(19, 12.4, 2.6), k.rr(15.4, 11, 19, 15.2, 1.4)), 'c4', { part: 'a', shine: 'none' }),
    k.paint(k.ellipse(19.5, 11.8, 0.55, 0.8), 'ink', { part: 'a' }),
    k.shine(k.circle(19.35, 11.5, 0.22)),
    k.paint(k.ellipse(20.2, 13.7, 0.8, 0.45), 'c2', { part: 'a', op: 0.85 }),
    k.surf(k.path('M2.8 14.6 C2.8 9.4 6.4 5.4 10 5.4 C13.6 5.4 17.2 9.4 17.2 14.6 Z'), 'c4', { shineSize: 0.85 }),
    k.ink([{ pts: k.ngon(10, 10.4, 2.4, 6, 0, 0)[0], closed: true }, [[7.6, 10.4], [5, 10.4]], [[12.4, 10.4], [15, 10.4]], [[8.8, 12.5], [7.8, 14]], [[11.2, 12.5], [12.2, 14]], [[8.8, 8.3], [8, 6.6]], [[11.2, 8.3], [12, 6.6]]], { w: 0.7, taper: false, shift: 0 }),
    k.surf(k.pill(2, 13.8, 18, 16.2), 'c3', { shine: 'none', ol: 0.4 }),
  ],

  // a sky retro TV with dark glass, gold knobs and rabbit-ear antennae
  tv: (icon, k) => [
    k.ink([[[8.2, 2.8], [12, 6.8]], [[15.8, 2.8], [12, 6.8]]], { w: 1.1, part: 'a' }),
    k.surf(k.join(k.circle(7.9, 2.7, 0.9), k.circle(16.1, 2.7, 0.9)), 'c2', { part: 'a', shine: 'none', ol: 0.3 }),
    k.surf(k.rr(2.4, 6.8, 21.6, 20.4, 2.4), 'c1', { shineSize: 0.8 }),
    k.surf(k.rr(4.4, 8.8, 16.6, 18.4, 1.4), 'ink', { inset: true, ol: 0.35, shine: 'glass', shade: 0 }),
    k.surf(k.join(k.circle(19.1, 11.2, 0.95), k.circle(19.1, 14.6, 0.95)), 'c3', { shine: 'none', ol: 0.3 }),
  ],

  // a glossy sky T on a sakura baseline serif
  type: (icon, k) => [
    k.surf(k.unite(k.stroke([[4.8, 6.6], [4.8, 4], [19.2, 4], [19.2, 6.6]], 2.6), k.seg(12, 4, 12, 19.4, 2.8)), 'c1', { shineSize: 0.75 }),
    k.surf(k.pill(8.2, 18.8, 15.8, 21.2), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
  ],

  // a sakura umbrella with a cream middle panel, gold tip and handle
  umbrella: (icon, k) => {
    const can = k.path('M3 12 C3 7 7 3 12 3 C17 3 21 7 21 12 C20.2 10.8 19 10.1 17.6 10.1 C16.4 10.1 15.4 10.8 14.8 12 C14.2 10.8 13.2 10.1 12 10.1 C10.8 10.1 9.8 10.8 9.2 12 C8.6 10.8 7.6 10.1 6.4 10.1 C5 10.1 3.8 10.8 3 12 Z')
    return [
      k.surf(k.stroke('M12 10.6 V18.8 C12 20.6 8.4 20.6 8.4 18.8', 1.6), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
      k.surf(k.circle(12, 2.6, 1), 'c3', { shine: 'none', ol: 0.3 }),
      k.surf(can, 'c2', { shineSize: 0.85 }),
      k.surf(k.clip(can, k.path('M12 2 C10.2 5 9.4 8 9.2 12.6 H14.8 C14.6 8 13.8 5 12 2 Z')), 'tint', { cast: false, ol: 0, shine: 'none', shade: 0.5 }),
      k.sparkleAt(20.2, 18.6, 1.6, { mx: -1, my: -1 }),
    ]
  },

  // a glossy sky U with a coral underline
  underline: (icon, k) => [
    k.surf(k.stroke('M6.6 3.8 V10 C6.6 13 9 15.4 12 15.4 C15 15.4 17.4 13 17.4 10 V3.8', 2.7), 'c1', { shineSize: 0.75 }),
    k.surf(k.pill(4.2, 18.6, 19.8, 21.2), 'accent', { part: 'a', shine: 'none', ol: 0.4 }),
  ],

  // a sky return arrow curling back to the left, speed lines in the curl
  undo: (icon, k) => [
    k.surf(k.unite(
      k.stroke('M6.6 9.5 H15 C18 9.5 20.5 12 20.5 15 C20.5 18 18 20.5 15 20.5 H9.6', 2.6),
      k.poly([[2.6, 9.5], [8.8, 3.6], [8.8, 15.4]], [0.8, 0.9, 0.9]),
    ), 'c1', { shineSize: 0.75 }),
  ],

  // two broken chain links, sky and sakura, with coral snap marks
  unlink: (icon, k) => {
    const link = (cx, cy) => k.rot(k.cut(k.pill(cx - 4.6, cy - 2.4, cx + 4.6, cy + 2.4), k.pill(cx - 2.8, cy - 0.85, cx + 2.8, cy + 0.85)), -45, cx, cy)
    return [
      k.surf(link(7.2, 16.8), 'c1', { shineSize: 0.6 }),
      k.surf(link(16.8, 7.2), 'c2', { part: 'a', shineSize: 0.6 }),
      k.surf(k.join(k.seg(6.4, 6.4, 8.8, 8.8, 1.4), k.seg(15.2, 15.2, 17.6, 17.6, 1.4), k.seg(10.4, 3.4, 10.8, 5.6, 1.2), k.seg(13.6, 20.6, 13.2, 18.4, 1.2)), 'accent', { part: 's', shine: 'none', ol: 0.35 }),
    ]
  },

  // the lock with its sky shackle sprung open
  unlock: (icon, k) => [
    k.surf(k.unite(k.arc(12, 7.2, 4.3, 180, 335, 2.4), k.seg(7.7, 7.2, 7.7, 11.8, 2.4)), 'c1', { part: 'a', shineSize: 0.8 }),
    k.surf(k.rr(4, 11, 20, 21.2, 2.4), 'c3', { shineSize: 1.1 }),
    k.surf(k.unite(k.circle(12, 15.3, 1.55), k.poly([[11.1, 15.6], [12.9, 15.6], [13.3, 18.6], [10.7, 18.6]], 0.5)), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
  ],

  // a sky arrow rising out of a gold tray
  upload: (icon, k) => [
    k.surf(k.stroke('M3.6 13.6 V18.2 C3.6 19.5 4.6 20.4 5.8 20.4 H18.2 C19.4 20.4 20.4 19.5 20.4 18.2 V13.6', 2.6), 'c3', { shineSize: 0.6 }),
    k.surf(arrowUp(k, 12, 2.6, 13.6, 1.05), 'c1', { part: 'a', shineSize: 0.7 }),
  ],

  // the USB trident: sky trunk, sakura round branch, gold square branch
  usb: (icon, k) => [
    k.tube([[5.5, 10.6], [5.5, 12], [12, 15.4]], 'c2', { part: 'a', w: 1.4, ol: 0.42 }),
    k.tube([[18.5, 11], [18.5, 12], [12, 14]], 'c3', { part: 'a', w: 1.4, ol: 0.42 }),
    k.surf(k.circle(5.5, 9, 1.9), 'c2', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.4 }),
    k.surf(k.rr(16.6, 7.4, 20.4, 11.2, 0.6), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.unite(k.seg(12, 5, 12, 17.4, 1.9), k.poly([[12, 2.4], [14.8, 6.2], [9.2, 6.2]], 0.5), k.circle(12, 19.2, 2.3)), 'c1', { shineSize: 0.6 }),
  ],

  // ---- users: the exemplar anime bust shifted left, with an S badge
  'user-check': (icon, k) => [...userL(k), ...badge(k, 18, 9, 3.4, 'c4', [[[16.4, 9.1], [17.6, 10.3], [19.7, 8]]])],
  'user-minus': (icon, k) => [...userL(k), ...badge(k, 18, 9, 3.4, 'c1', [[[16.3, 9], [19.7, 9]]])],
  'user-plus': (icon, k) => [...userL(k), ...badge(k, 18, 9, 3.4, 'c4', [[[16.3, 9], [19.7, 9]], [[18, 7.3], [18, 10.7]]])],
  'user-x': (icon, k) => [...userL(k), ...badge(k, 18, 9, 3.4, 'accent', [[[16.8, 7.8], [19.2, 10.2]], [[19.2, 7.8], [16.8, 10.2]]])],
  'user-cog': (icon, k) => [
    ...userL(k),
    k.moat(k.circle(17.6, 16.6, 4.4), 0.7),
    k.surf(k.cut(k.gearShape(17.6, 16.6, 3, 7, 1.3, 1.6), k.circle(17.6, 16.6, 1.1)), 'c3', { part: 's', shine: 'dot', shineSize: 0.5, ol: 0.4 }),
  ],
  'user-pen': (icon, k) => {
    const R = s => k.rot(s, 45, 17.4, 16.6)
    return [
      ...userL(k),
      k.moat(R(k.rr(15.6, 10.6, 19.2, 22.4, 1.2)), 0.7),
      k.surf(R(k.poly([[15.9, 19.8], [18.9, 19.8], [17.4, 22.6]], [0.3, 0.3, 0.4])), 'tint', { part: 's', shine: 'none', ol: 0.35 }),
      k.surf(R(k.rr(15.9, 12.8, 18.9, 19.9, 0.3)), 'c3', { part: 's', shine: 'none', ol: 0.4 }),
      k.surf(R(k.rr(15.9, 10.8, 18.9, 13, [1.2, 1.2, 0, 0])), 'c2', { part: 's', shine: 'none', ol: 0.4 }),
    ]
  },
  'user-search': (icon, k) => [
    ...userL(k),
    k.moat(k.unite(k.circle(16.6, 15.8, 3.4), k.seg(18.8, 18, 21, 20.4, 2)), 0.7),
    k.surf(k.seg(18.9, 18.1, 20.8, 20.2, 1.8), 'c1', { part: 's', shine: 'none', ol: 0.4 }),
    k.surf(k.ring(16.6, 15.8, 3.2, 2), 'c3', { part: 's', shine: 'none', ol: 0.4 }),
    k.surf(k.circle(16.6, 15.8, 2), 'edge', { part: 's', inset: true, ol: 0, shine: 'glass', shineSize: 0.5, shade: 0.5 }),
  ],
  // the bust inside a pale sky avatar disc
  'user-circle': (icon, k) => {
    const disc = k.circle(12, 12, 9.3)
    return [
      k.surf(disc, 'edge', { shine: 'none', shade: 0.6 }),
      ...bust(k, 12, 10.2, 0.8, 'c1', 'c2', 'tint', k.circle(12, 12, 8.9)),
    ]
  },
  // two friends: a sakura-haired one behind, the sky-haired one in front
  users: (icon, k) => [
    ...bust(k, 15.6, 8.2, 0.7, 'c2', 'c1', 'tint', null, { lite: true }),
    ...bust(k, 9.4, 10.6, 0.8, 'c1', 'tint', 'c2'),
  ],

  // a sky fork and a gold knife with a sakura handle
  utensils: (icon, k) => [
    k.surf(k.unite(
      k.seg(4.4, 3, 4.4, 7.4, 1.4), k.seg(7.5, 3, 7.5, 7.4, 1.4), k.seg(10.6, 3, 10.6, 7.4, 1.4),
      k.path('M3.7 6.6 H11.3 V8.4 C11.3 10.4 9.6 11.6 7.5 11.6 C5.4 11.6 3.7 10.4 3.7 8.4 Z'),
      k.rr(6.4, 10, 8.6, 21.4, 1.1),
    ), 'c1', { shineSize: 0.6 }),
    k.surf(k.path('M20.6 2.6 V15 H17.4 C16 15 15.4 14 15.4 12.6 V9.6 C15.4 5.6 17.6 3.2 20.6 2.6 Z'), 'c3', { part: 'a', shineSize: 0.6 }),
    k.surf(k.rr(16.8, 14.2, 19.6, 21.4, 1.3), 'c2', { part: 'a', shine: 'none', ol: 0.45 }),
  ],

  // a sky video camera with a friend on its dark screen
  'video-call': (icon, k) => [
    k.surf(k.poly([[15.4, 10.2], [21.6, 6.8], [21.6, 17.2], [15.4, 13.8]], [0.4, 1, 1, 0.4]), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.rr(2.4, 4.6, 16.2, 19.4, 2.4), 'c1', { shineSize: 0.75 }),
    k.surf(k.rr(4.2, 6.4, 14.4, 17.6, 1.2), 'ink', { inset: true, ol: 0.35, shine: 'none', shade: 0 }),
    k.surf(k.circle(9.3, 10.6, 2), 'tint', { part: 'a', shine: 'none', ol: 0, shade: 0 }),
    k.surf(k.clip(k.path('M5.6 17.6 C5.6 15.2 7.2 13.6 9.3 13.6 C11.4 13.6 13 15.2 13 17.6 Z'), k.rect(0, 0, 24, 17.6)), 'c2', { part: 'a', shine: 'none', ol: 0, shade: 0 }),
  ],
  'video-camera': (icon, k) => [
    k.surf(k.poly([[15.4, 10.2], [21.6, 6.8], [21.6, 17.2], [15.4, 13.8]], [0.4, 1, 1, 0.4]), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.rr(2.4, 5.8, 16.2, 18.2, 2.4), 'c1', { shineSize: 0.85 }),
    k.surf(k.circle(6, 9.4, 1.4), 'accent', { shine: 'dot', shineSize: 0.5, ol: 0.35 }),
  ],

  // ---- batch 4: video-off .. zoom-out

  'video-off': (icon, k) => [
    k.surf(k.poly([[15.4, 10.2], [21.6, 6.8], [21.6, 17.2], [15.4, 13.8]], [0.4, 1, 1, 0.4]), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.rr(2.4, 5.8, 16.2, 18.2, 2.4), 'c1', { shineSize: 0.85 }),
    ...slash(k),
  ],

  // a volleyball: three clean curved seams pinwheeling from the centre, gold / sky / cream panels
  volleyball: (icon, k) => {
    const cx = 12, cy = 12, disc = k.circle(cx, cy, 9.3)
    const seam = a0 => Array.from({ length: 13 }, (_, i) => { const t = i / 12, a = (a0 + 70 * t) * Math.PI / 180, r = 10.4 * t; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })
    const A0 = [-100, 20, 140]
    const panel = i => {
      const s0 = seam(A0[i]), s1 = seam(A0[(i + 1) % 3])
      const e0 = A0[i] + 70, e1 = e0 + 120
      const rim = Array.from({ length: 13 }, (_, j) => { const a = (e0 + (e1 - e0) * j / 12) * Math.PI / 180; return [cx + 10.4 * Math.cos(a), cy + 10.4 * Math.sin(a)] })
      return k.clip([[...s0, ...rim, ...s1.slice().reverse()]], disc)
    }
    return [
      k.surf(disc, 'tint', { shine: 'none' }),
      k.surf(panel(0), 'c3', { cast: false, ol: 0, shine: 'none', shade: 0.6 }),
      k.surf(panel(1), 'c1', { cast: false, ol: 0, shine: 'none', shade: 0.6 }),
      k.ink(A0.map(a => seam(a).filter(([x, y]) => Math.hypot(x - cx, y - cy) < 9.1)), { w: 0.9, taper: false, shift: 0, part: 'a' }),
      k.shine(k.lens(5.2, 9.6, 8.4, 5.4, 0.75), { op: 0.9 }),
      k.shine(k.circle(9.6, 4.9, 0.55), { op: 0.9 }),
    ]
  },

  // the sky speaker cone with sakura sound waves
  'volume-1': (icon, k) => [
    speakerCone(k),
    k.tube('M15.4 9.2 C16.6 10.4 16.6 13.6 15.4 14.8', 'c2', { part: 'a', w: 1.5, ol: 0.42 }),
  ],
  volume: (icon, k) => [
    speakerCone(k),
    k.tube(['M15.2 9.2 C16.4 10.4 16.4 13.6 15.2 14.8', 'M17.8 6 C20.6 8.6 20.6 15.4 17.8 18'], 'c2', { part: 'a', w: 1.5, ol: 0.42 }),
  ],
  'volume-off': (icon, k) => [
    speakerCone(k),
    k.surf(k.unite(k.seg(15.4, 9.4, 20.6, 14.6, 2), k.seg(20.6, 9.4, 15.4, 14.6, 2)), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
  ],

  // a sakura wallet with a sky card peeking out and a gold snap clasp
  wallet: (icon, k) => [
    k.surf(k.rot(k.rr(5, 3.2, 16.6, 10.4, 1.2), -7, 11, 7), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(2.6, 6.8, 21.2, 20.4, 2.4), 'c2', { shineSize: 0.85 }),
    k.surf(k.rr(15, 11.2, 21.6, 16.6, [1.6, 0.6, 0.6, 1.6]), 'c2', { shine: 'none', ol: 0.45 }),
    k.surf(k.circle(17.6, 13.9, 1.3), 'c3', { shine: 'dot', shineSize: 0.5, ol: 0.35 }),
  ],

  // a magical girl wand: sky stick, big gold star, sakura and sky glints
  wand: (icon, k) => [
    k.surf(k.seg(4.2, 19.8, 11.6, 12.4, 2.3), 'c1', { shine: 'none' }),
    k.surf(k.seg(4.6, 19.4, 5.8, 18.2, 2.5), 'c2', { shine: 'none', ol: 0.4 }),
    k.surf(k.rot(k.starShape(14.4, 9.6, 5, 2.4, 0.6), 12, 14.4, 9.6), 'c3', { shineSize: 0.7 }),
    k.surf(glintShape(k, 19.8, 16.8, 2.4, 0.26), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(glintShape(k, 5.8, 6, 2, 0.28), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
  ],

  // a cream warehouse under a sky roof with a gold roller door
  warehouse: (icon, k) => [
    k.surf(k.poly([[3.4, 21.2], [3.4, 9.6], [12, 5], [20.6, 9.6], [20.6, 21.2]], [1.2, 0, 0.8, 0, 1.2]), 'tint', { shine: 'none' }),
    k.surf(k.stroke([[2.6, 10.2], [12, 4.4], [21.4, 10.2]], 2.6), 'c1', { shineSize: 0.7 }),
    k.surf(k.rr(7.2, 12.4, 16.8, 21.2, [1, 1, 0, 0]), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.ink([[[8.4, 15], [15.6, 15]], [[8.4, 17.6], [15.6, 17.6]]], { w: 0.75, part: 'a', taper: false, shift: 0 }),
    k.surf(k.circle(12, 9.4, 1.2), 'c1', { inset: true, ol: 0.35, shine: 'none', shade: 0 }),
  ],

  // a cream washer: sky control strip, a sky porthole with sudsy water
  'washing-machine': (icon, k) => {
    const body = k.rr(4, 2.6, 20, 21.4, 2.2)
    const glass = k.circle(12, 14.4, 3.6)
    return [
      k.surf(body, 'tint', { shine: 'none' }),
      k.surf(k.clip(body, k.rect(0, 0, 24, 6.6)), 'c1', { cast: false, shine: 'none' }),
      k.paint(k.join(k.circle(7, 4.6, 0.7), k.circle(9.4, 4.6, 0.7)), 'tint'),
      k.surf(k.circle(16.6, 4.6, 1), 'c3', { shine: 'none', ol: 0.3, shade: 0 }),
      k.surf(k.ring(12, 14.4, 5.4, 3.6), 'c1', { part: 'a', shineSize: 0.6 }),
      k.surf(glass, 'edge', { part: 'a', inset: true, ol: 0, shine: 'none', shade: 0.6 }),
      k.paint(k.clip(k.path('M7 15 C9 13.6 10.6 16 12 15 C13.4 14 15 13.6 17 15 V20 H7 Z'), glass), 'c1', { part: 'a', op: 0.75 }),
      k.shine(k.lens(9.6, 13.6, 11.4, 11.6, 0.4)),
    ]
  },

  // a gold watch on a sakura strap, cream face, ink hands
  watch: (icon, k) => [
    k.surf(k.join(k.rr(8.8, 2.4, 15.2, 7.4, [1.2, 1.2, 0, 0]), k.rr(8.8, 16.6, 15.2, 21.6, [0, 0, 1.2, 1.2])), 'c2', { shine: 'none' }),
    k.surf(k.rr(18.2, 10.9, 20, 13.1, 0.5), 'c3', { shine: 'none', ol: 0.3 }),
    k.surf(k.circle(12, 12, 6.6), 'c3', { shineSize: 0.75 }),
    k.surf(k.circle(12, 12, 4.8), 'tint', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
    k.ink([[12, 9.2], [12, 12], [14, 13.4]], { w: 1, part: 'a', taper: 0.6 }),
    k.paint(k.circle(12, 12, 0.6), 'accent'),
  ],

  // a sky webcam orb with a dark lens and a little stand
  webcam: (icon, k) => [
    k.surf(k.rr(11, 15.4, 13, 20, 0.4), 'c1', { shine: 'none', ol: 0.35 }),
    k.surf(k.pill(7.4, 19.4, 16.6, 21.6), 'c1', { shine: 'none' }),
    k.surf(k.circle(12, 9.6, 7), 'c1', { shineSize: 0.85 }),
    k.surf(k.circle(12, 9.6, 3.4), 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.35 }),
    k.surf(k.circle(12, 9.6, 1.9), 'c1', { part: 'a', inset: true, ol: 0, shine: 'glint', shineSize: 0.6, tone: ['ink', 0.35] }),
    k.paint(k.circle(16.6, 6.2, 0.6), 'accent'),
  ],

  // three linked sky hooks, a moat where each arm passes over the next, sakura nodes
  webhook: (icon, k) => [
    k.tube('M12 7.5 L13.95 10.88 C14.6 12 15.9 12.75 17.2 12.75 C19.3 12.75 20.95 14.4 20.95 16.5 C20.95 18.6 19.3 20.25 17.2 20.25', 'c1', { w: 1.8, ol: 0.45 }),
    k.moat(k.stroke('M17.2 16.5 H13.3 C12 16.5 10.75 17.2 10.05 18.38 C9 20.2 6.7 20.8 4.93 19.75 C3.13 18.7 2.5 16.43 3.56 14.63', 1.8), 0.75),
    k.tube('M17.2 16.5 H13.3 C12 16.5 10.75 17.2 10.05 18.38 C9 20.2 6.7 20.8 4.93 19.75 C3.13 18.7 2.5 16.43 3.56 14.63', 'c1', { w: 1.8, ol: 0.45 }),
    k.moat(k.stroke('M6.8 16.5 L8.75 13.13 C9.4 12 9.4 10.5 8.75 9.38 C7.7 7.6 8.3 5.3 10.13 4.25 C11.9 3.2 14.2 3.8 15.25 5.63', 1.8), 0.75),
    k.tube('M6.8 16.5 L8.75 13.13 C9.4 12 9.4 10.5 8.75 9.38 C7.7 7.6 8.3 5.3 10.13 4.25 C11.9 3.2 14.2 3.8 15.25 5.63', 'c1', { w: 1.8, ol: 0.45 }),
    k.moat(k.join(k.circle(12, 7.5, 1.7), k.circle(17.2, 16.5, 1.7), k.circle(6.8, 16.5, 1.7)), 0.4),
    k.surf(k.join(k.circle(12, 7.5, 1.7), k.circle(17.2, 16.5, 1.7), k.circle(6.8, 16.5, 1.7)), 'c2', { part: 'a', shine: 'dot', shineSize: 0.45, ol: 0.4 }),
  ],

  // glossy sky wifi arcs and dot
  wifi: (icon, k) => [k.surf(wifiShape(k), 'c1', { shineSize: 0.7 })],
  'wifi-off': (icon, k) => [k.surf(wifiShape(k), 'c1', { shine: 'none' }), ...slash(k)],

  // sky wind curls with a sakura petal riding them
  wind: (icon, k) => [
    k.surf(k.stroke('M3 12 H17.4 C19.2 12 20.4 10.6 20.4 9.2 C20.4 7.6 19.2 6.6 17.8 6.6 C16.6 6.6 15.6 7.4 15.4 8.4', 2), 'c1', { shineSize: 0.5 }),
    k.surf(k.stroke('M3 7.6 H8.8 C10.2 7.6 11.2 6.6 11.2 5.2 C11.2 3.8 10.2 3 9 3 C8 3 7.2 3.6 6.9 4.4', 1.8), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.stroke('M3 16.4 H13.2 C14.8 16.4 15.8 17.6 15.8 18.8 C15.8 20.2 14.8 21 13.6 21 C12.6 21 11.8 20.4 11.5 19.6', 1.8), 'c1', { part: 'a', shine: 'none' }),
    k.deco(k.lens(17.6, 18.4, 21, 16.2, 1), 'c2', { ol: 0.35 }),
  ],

  // a glass of red wine: pale glass bowl, coral wine, slender stem
  wine: (icon, k) => {
    const bowl = k.path('M6.6 2.6 H17.4 C18.4 6 18.4 8.5 17 11 C15.75 13 14 14 12 14 C10 14 8.25 13 7 11 C5.6 8.5 5.6 6 6.6 2.6 Z')
    return [
      k.surf(k.seg(12, 13.4, 12, 20.4, 1.4), 'edge', { shine: 'none', ol: 0.4 }),
      k.surf(k.ellipse(12, 20.6, 4.6, 1.2), 'edge', { shine: 'none', ol: 0.4 }),
      k.surf(bowl, 'edge', { shine: 'none', shade: 0.6 }),
      k.surf(k.clip(bowl, k.rect(0, 7.2, 24, 24)), 'accent', { part: 'a', cast: false, ol: 0, shineSize: 0.6 }),
      k.shine(k.rr(7.6, 3.8, 8.6, 8, 0.5), { op: 0.9 }),
      k.sparkleAt(20.4, 5, 1.6, { mx: -1, my: 1 }),
    ]
  },

  // sky text lines with a sakura arrow wrapping back
  'wrap-text': (icon, k) => [
    k.surf(k.join(k.pill(2.6, 3.8, 21.4, 6.2), k.pill(2.6, 17.8, 8.6, 20.2)), 'c1', { shine: 'dot', shineSize: 0.55 }),
    k.surf(k.unite(k.stroke('M2.6 12 H17.4 C19.4 12 21 13.6 21 15.5 C21 17.4 19.4 19 17.4 19 H14.4', 2.4), k.poly([[11.2, 19], [15.2, 15.4], [15.2, 22.6]], [0.6, 0.7, 0.7])), 'c2', { part: 'a', shineSize: 0.6 }),
  ],

  // a glossy sky wrench
  wrench: (icon, k) => [
    k.surf(k.path('M6.87 20.32 L11.55 15.64 A1.5 1.5 0 0 1 13.02 15.26 A6.25 6.25 0 0 0 20.88 8.02 L15.75 10.98 A2 2 0 0 1 13.75 7.52 L18.88 4.56 A6.25 6.25 0 0 0 8.74 10.98 A1.5 1.5 0 0 1 8.36 12.45 L3.68 17.13 A2.25 2.25 0 0 0 6.87 20.32 Z'), 'c1', { shineSize: 0.75 }),
    k.surf(k.circle(5.3, 18.7, 0.8), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
  ],

  // a coral disc with a white cross
  'x-circle': (icon, k) => [
    k.surf(k.circle(12, 12, 9.3), 'accent', { shineSize: 1 }),
    glyph(k, [[[8.8, 8.8], [15.2, 15.2]], [[15.2, 8.8], [8.8, 15.2]]], { w: 2.3 }),
  ],

  // a gold lightning bolt with a streak and a sparkle
  zap: (icon, k) => [
    k.surf(k.poly([[13.8, 2.4], [4.2, 14.2], [11, 14.2], [10.2, 21.6], [19.8, 9.8], [13, 9.8]], [0.8, 0.8, 0.3, 0.8, 0.8, 0.3]), 'c3', { shineSize: 0.85 }),
    k.sparkleAt(19.6, 18.6, 1.7, { mx: -1, my: -1 }),
    k.speed(4.6, 6.4, 200, { n: 2, len: 2.4, gap: 1.6, w: 0.7, role: 'c3' }),
  ],

  // the search magnifier with a plus / minus on the glass
  'zoom-in': (icon, k) => [...lens(k), k.ink([[[10.2, 7.4], [10.2, 13]], [[7.4, 10.2], [13, 10.2]]], { w: 1.6, taper: false, shift: 0, part: 'a', role: 'c1' })],
  'zoom-out': (icon, k) => [...lens(k), k.ink([[7.4, 10.2], [13, 10.2]], { w: 1.6, taper: false, shift: 0, part: 'a', role: 'c1' })],
}
