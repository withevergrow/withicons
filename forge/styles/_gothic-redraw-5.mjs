// GOTHIC hand redraws, chunk 5 of 5 (owned by the chunk-5 redrawer): icons 401-500 (smartphone .. zoom-out).
// Map icon name -> (icon, g) => parts, built with the frozen kit g (see forge/styles/GOTHIC-GUIDE.md).
// Names listed in EXEMPLAR (_gothic-render.mjs) are ignored here (star, trash, user).

import { parsePath } from '../kernel/geom.mjs'

// ---- local helpers -----------------------------------------------------------
const RAD = Math.PI / 180
const f2 = v => Math.round(v * 100) / 100
const polar = (cx, cy, r, a) => [f2(cx + r * Math.cos(a * RAD)), f2(cy + r * Math.sin(a * RAD))]
// n radial leads between radii r0 and r1 round (cx, cy)
const spokes = (cx, cy, r0, r1, n, rot = 0) => Array.from({ length: n }, (_, k) => [polar(cx, cy, r0, rot + 360 * k / n), polar(cx, cy, r1, rot + 360 * k / n)])

// a pane built light: a solid stone slab with the glass set into it (one contour less than
// g.pane's rim, so heavy icons keep their glints and tracery under the byte budget)
function slab(g, F, role, o = {}) {
  const inner = g.shrink(F, o.frame ?? 1.3)
  return [
    g.stone(F, { plate: o.plate, thin: o.thin }),
    g.glass(inner, role, { tracery: o.tracery || 'none', plate: o.plate, outline: o.outline ?? 0.36, ...o.glass }),
  ]
}
// a saint (the user exemplar, scaled and placed): gilt halo (deco), gold face, lancet robe
function saint(g, cx = 9, o = {}) {
  const hy = o.hy ?? 7.6, hr = o.hr ?? 3.4, robe = o.robe || 'c2', top = o.top ?? 13
  const half = o.half ?? 6.6
  return [
    o.halo === false ? null : g.deco(g.gilt(g.rim(g.circle(cx, hy, hr + 1.2), 0.9), { glint: false })),
    ...slab(g, g.circle(cx, hy, hr), o.face || 'c3', { frame: 1.15, plate: o.plate }),
    ...slab(g, g.lancet(cx - half, top, cx + half, 21.4, 0.75), robe, { frame: 1.35, tracery: [[[cx - 2.2, 14], [cx - 2.2, 22]], [[cx + 2.2, 14], [cx + 2.2, 22]], [[cx - 7, 17.8], [cx + 7, 17.8]]], plate: o.plate }),
  ]
}
// a jewelled boss: a gilt ring round a glass roundel
const boss = (g, cx, cy, r = 2.2, role = 'c1', plate = 'K') => [
  g.gilt(g.circle(cx, cy, r), { plate, glint: false }),
  g.glass(g.circle(cx, cy, r - 0.7), role, { plate, outline: 0.25, glow: 0.3 }),
]
// four gilt studs inside a square frame
const corners = (g, x0, y0, x1, y1, r = 0.5) => g.studs([[x0, y0], [x1, y0], [x0, y1], [x1, y1]], r)
// a square stained-glass panel in a stone frame
const panel = (g, role, tracery = 'none', o = {}) => [
  ...g.pane(g.rr(3, 3, 21, 21, 2.4), role, { frame: 1.7, tracery, glass: o.glass }),
  corners(g, 5.6, 5.6, 18.4, 18.4, 0.5),
]
// a stone glyph carved proud of the glass
const carved = (g, kind, cx = 12, cy = 12, s = 1.35, w = 2.6) => g.stone(g.glyph(kind, cx, cy, s, w), { thin: true })
// the magnifier of the search exemplar with a plain lens
const lens = (g, role = 'c2') => [
  g.gilt(g.seg(15.4, 15.4, 20.6, 20.6, 2.6), { plate: 'A' }),
  g.iron(g.seg(15, 15, 16.3, 16.3, 3.4), { plate: 'A' }),
  ...g.pane(g.circle(10.2, 10.2, 7.6), role, { frame: 1.9, tracery: 'none', glass: { dark: 0.42 } }),
]
// a moated badge glyph for the user variants (figure on the left)
const userBadge = (g, kind, role, cx = 18, cy = 10, r = 3.7) => g.badge(kind, cx, cy, r, role, { moat: 1 })

// the video camera: a sapphire-glazed body in a smooth stone case, ruby rose lens, gilt hood (A)
function camOf(g) {
  return [
    g.gilt(g.poly([[15.4, 10.4], [21.8, 6.6], [21.8, 17.4], [15.4, 13.6]]), { plate: 'A' }),
    ...g.pane(g.rr(2, 5.6, 16.6, 18.4, 2.2), 'c2', { frame: 1.35, tracery: 'lancet', glass: { s: 2.2, dark: 0.45, glint: false } }),
    ...g.rose(9.3, 12, 4.6, 'c1', { n: 8, frame: 1.15 }),
  ]
}
// the volume horn: ruby glass in a stone surround
function hornOf(g) {
  return g.pane(g.path('M10 5.4 A1 1 0 0 1 11.8 6.2 V17.8 A1 1 0 0 1 10 18.6 L6.9 15.8 H4.4 A1.6 1.6 0 0 1 2.8 14.2 V9.8 A1.6 1.6 0 0 1 4.4 8.2 H6.9 Z'), 'c1', { frame: 1.3, tracery: [[[7, 7], [7, 17]]] })
}
// a pointed (ogival) arc round (cx, cy): two arcs of radius r + e struck from centres e
// either side, meeting in a point on the axis; a0 is the left end's angle
function ogivePts(cx, cy, r, a0 = -140, e = 0) {
  const R = r + e, aT = -180 + Math.acos(e / R) / RAD
  const left = g0arc(cx + e, cy, R, a0, aT)
  return [...left, ...left.slice(0, -1).reverse().map(([x, y]) => [f2(2 * cx - x), y])]
}
function g0arc(cx, cy, r, a0, a1) {
  const n = Math.max(3, Math.ceil(Math.abs(a1 - a0) * RAD * r / 0.5)), out = []
  for (let k = 0; k <= n; k++) out.push(polar(cx, cy, r, a0 + (a1 - a0) * k / n))
  return out
}
// a sound wave as a pointed arc (apex east) round the horn: stone band glazed in sapphire (A)
function waveOf(g, r, span) {
  const cx = 11.7, cy = 12
  const pts = ogivePts(cx, cy, r, -90 - span, r * 0.2).map(([x, y]) => [f2(cx - (y - cy)), f2(cy + (x - cx))])
  return [
    g.stone(g.stroke(pts, 2.6), { thin: true, plate: 'A' }),
    g.glass(g.stroke(pts, 0.95), 'c2', { plate: 'A', outline: 0.3, glow: 0.34, glint: false }),
  ]
}
// wifi: three pointed archivolts of glass in stone (a portal's receding arches), the outer
// one the moving wave (A), a ruby jewel at the source
function wifiOf(g) {
  const pts = r => ogivePts(12, 19.2, r, -141, r * 0.2)
  const band = (r, role, plate) => [
    g.stone(g.stroke(pts(r), 3), { plate, thin: true }),
    g.glass(g.stroke(pts(r), 1.25), role, { plate, outline: 0.34, glow: 0.34, glint: false }),
  ]
  return [
    ...band(11, 'c2', 'A'),
    g.shine(g.stroke(pts(11).slice(3, 12), 0.36), { op: 0.8, plate: 'A' }),
    ...band(7.2, 'c2'),
    ...band(3.5, 'c3'),
    ...boss(g, 12, 19.2, 1.65, 'c1'),
  ]
}

// a pointed ray (a slim spire) at angle a from r0 to r1, base width w
function rayOf(g, cx, cy, a, r0, r1, w) {
  const b = polar(cx, cy, r0, a), t = polar(cx, cy, r1, a), n = [Math.cos((a + 90) * RAD) * w / 2, Math.sin((a + 90) * RAD) * w / 2]
  return g.poly([[b[0] + n[0], b[1] + n[1]], t, [b[0] - n[0], b[1] - n[1]]])
}
// sunrise / sunset: a half rose on a stone horizon, gilt arrow, rays
function horizon(g, up) {
  const half = g.inter(g.circle(12, 16.4, 5.4), g.rect(0, 0, 24, 16.4))
  return [
    g.gilt(g.union(rayOf(g, 12, 16.4, -150, 6.6, 9.4, 1.8), rayOf(g, 12, 16.4, -30, 6.6, 9.4, 1.8), rayOf(g, 12, 16.4, -172, 6.6, 9.2, 1.4), rayOf(g, 12, 16.4, -8, 6.6, 9.2, 1.4))),
    ...g.pane(half, 'c3', { frame: 1.2, tracery: spokes(12, 16.4, 0, 6, 8, 22.5), glass: { medal: 'c1' } }),
    g.stone(g.rr(2, 15.6, 22, 18, 1.2), { ticks: [[[7.6, 14], [7.6, 19]], [[16.4, 14], [16.4, 19]]] }),
    g.stone(g.rr(7.4, 19.6, 16.6, 21.6, 1), { thin: true }),
    up ? g.gilt(g.union(g.seg(12, 9.4, 12, 3.4, 1.8), g.stroke([[9, 6.2], [12, 3.2], [15, 6.2]], 1.8)), { plate: 'A' })
      : g.gilt(g.union(g.seg(12, 2.2, 12, 8.4, 1.8), g.stroke([[9, 5.6], [12, 8.6], [15, 5.6]], 1.8)), { plate: 'A' }),
  ]
}

// the ogival spear head (the arrow-right exemplar's), tip at (tx, ty) pointing ang, scale s,
// pierced by a ruby glass trefoil
function headOf(g, tx, ty, ang, s = 1, plate = 'K', role = 'c1') {
  const c = Math.cos(ang * RAD), si = Math.sin(ang * RAD)
  const P = (x, y) => `${f2(tx + (x * c - y * si) * s)} ${f2(ty + (x * si + y * c) * s)}`
  const d = `M${P(0, 0)} C${P(-3.2, -1.2)} ${P(-6.2, -3.6)} ${P(-8.6, -7.2)} C${P(-7.8, -4.4)} ${P(-7.6, -2)} ${P(-7.8, 0)} C${P(-7.6, 2)} ${P(-7.8, 4.4)} ${P(-8.6, 7.2)} C${P(-6.2, 3.6)} ${P(-3.2, 1.2)} ${P(0, 0)} Z`
  return [
    g.gilt(g.path(d), { plate }),
    g.glass(g.foil(f2(tx - 5 * s * c), f2(ty - 5 * s * si), 1.55 * s, 3, ang + 180), role, { outline: 0.22, glint: false, glow: 0.34, plate }),
  ]
}
// a trefoil terminal (a cross botonnee end) closing a gilt shaft at (x, y); ang points away
// from the shaft
function tailOf(g, x, y, ang, s = 1, plate = 'K') {
  const c = Math.cos(ang * RAD), si = Math.sin(ang * RAD), nx = -si * 1.75 * s, ny = c * 1.75 * s
  const bx = f2(x + 1.75 * s * c), by = f2(y + 1.75 * s * si)
  return [
    g.gilt(g.union(g.seg(f2(x + nx), f2(y + ny), f2(x - nx), f2(y - ny), 1.15 * s), g.seg(x, y, bx, by, 1.2 * s), g.circle(bx, by, 1.2 * s)), { plate, glint: false }),
  ]
}
// a stone lintel: chamfered (lozenge-cut) ends, optional glass inlay (a long lancet light)
function lintel(g, x0, y, x1, role, o = {}) {
  const h = o.h ?? 1.35, c = Math.min(1.1, (x1 - x0) / 4)
  const out = [g.stone(g.poly([[x0, y], [x0 + c, y - h], [x1 - c, y - h], [x1, y], [x1 - c, y + h], [x0 + c, y + h]]), { plate: o.plate })]
  if (role) out.push(g.glass(g.poly([[x0 + c + 0.3, y], [x0 + c + 1, y - 0.6], [x1 - c - 1, y - 0.6], [x1 - c - 0.3, y], [x1 - c - 1, y + 0.6], [x0 + c + 1, y + 0.6]]), role, { outline: 0.3, glint: false, glow: 0.3, plate: o.plate }))
  return out
}
// an illuminated initial: a glass chip in a small stone frame, gilt studs at the corners
function chip(g, x0, y0, x1, y1, role = 'c2', o = {}) {
  const k = 1.75
  return [
    ...g.pane(g.rr(x0, y0, x1, y1, o.r ?? 2.2), role, { frame: o.frame ?? 1.25, tracery: 'none', plate: o.plate, glass: { dark: 0.5, glow: 0.1, glint: false } }),
    o.studs === false ? null : g.studs([[x0 + k, y0 + k], [x1 - k, y0 + k], [x0 + k, y1 - k], [x1 - k, y1 - k]], 0.42),
  ]
}
// textura (blackletter) strokes: a broad-nib stem with lozenge-cut ends from (x, y0) to (x, y1)
const stemT = (g, x, y0, y1, w = 2.5) => g.poly([[x - w / 2, y0 + w * 0.45], [x, y0 - w * 0.05], [x + w / 2, y0 + w * 0.45], [x + w / 2, y1 - w * 0.45], [x, y1 + w * 0.05], [x - w / 2, y1 - w * 0.45]])
// a lozenge (the diamond foot of textura)
const loz = (g, x, y, r = 1.1) => g.ngon(x, y, r, 4, -90)

// a wheel as a little rose window: stone tyre, glass lights between spokes, gilt hub (A)
const wheel = (g, cx, cy, r, role = 'c2', hub = true) => [
  g.stone(g.circle(cx, cy, r), { plate: 'A', thin: true }),
  g.glass(g.circle(cx, cy, r - 0.85), role, { plate: 'A', outline: 0.25, glint: false, tracery: spokes(cx, cy, 0, r, 6, 30) }),
  hub ? g.gilt(g.circle(cx, cy, 0.75), { plate: 'A', thin: true, outline: 0.25, glint: false }) : null,
]
// the thumbs hand (down mirrors it top to bottom): carved stone, leaded fingers, ruby cuff
function handOf(g, down) {
  const Y = y => down ? f2(24 - y) : y
  const box = (x0, y0, x1, y1, r) => down ? g.rr(x0, Y(y1), x1, Y(y0), Array.isArray(r) ? [r[3], r[2], r[1], r[0]] : r) : g.rr(x0, y0, x1, y1, r)
  const fingers = [[10.9, 19.1], [13.9, 19.3], [16.9, 18.8], [19.9, 17.6]]
  const hand = g.union(
    box(7.4, 9.4, 14.6, 21.4, [0.8, 0, 0, 0.8]),
    ...fingers.map(([y, x1]) => g.seg(13.4, Y(y), x1, Y(y), 3)),
    g.seg(9.6, Y(10.4), 12, Y(4.4), 3.4),
  )
  const cuff = box(2.2, 9.2, 7.8, 21.8, 1.2)
  return [
    g.stone(hand, { plate: 'A' }),
    g.lead([[[14.2, Y(12.4)], [19.1, Y(12.4)]], [[14.2, Y(15.4)], [18.8, Y(15.4)]], [[14.2, Y(18.4)], [17.6, Y(18.4)]], [[13.2, Y(9.6)], [13.6, Y(11.2)]]], { w: 0.42, plate: 'A' }),
    g.gilt(cuff),
    g.glass(g.shrink(cuff, 0.95), 'c1', { outline: 0.28, tracery: [[[2, Y(15.5)], [8, Y(15.5)]]], glow: 0.24 }),
  ]
}

// ---- the redraws ---------------------------------------------------------------
export const R = {
  // ===== people: saints in lancet robes, badges as jewelled roundels
  'user-check': (icon, g) => [...saint(g, 8.8), ...userBadge(g, 'check', 'c4')],
  'user-plus': (icon, g) => [...saint(g, 8.8), ...userBadge(g, 'plus', 'c4')],
  'user-minus': (icon, g) => [...saint(g, 8.8), ...userBadge(g, 'minus', 'c1')],
  'user-x': (icon, g) => [...saint(g, 8.8), ...userBadge(g, 'x', 'c1')],
  'user-cog': (icon, g) => [
    ...saint(g, 8.8),
    g.cut(g.circle(17.4, 17.2, 5.6)),
    g.gilt(g.poly(Array.from({ length: 7 }, (_, k) => [[3.5, -0.28], [4.7, -0.15], [4.7, 0.15], [3.5, 0.28]].map(([r, t]) => polar(17.4, 17.2, r, (k + t) * 360 / 7 - 90))).flat()), { plate: 'S', glint: false }),
    g.glass(g.circle(17.4, 17.2, 2.1), 'c1', { plate: 'S', outline: 0.3, glow: 0.3, glint: false }),
  ],
  'user-pen': (icon, g) => {
    const pen = g.seg(14.2, 19.8, 20, 14, 3)
    return [
      ...saint(g, 8.8),
      g.cut(g.grow(g.union(pen, g.poly([[12.4, 21.6], [13.4, 17.6], [16.4, 20.6]])), 1)),
      g.gilt(pen, { plate: 'S' }),
      g.iron(g.poly([[12.6, 21.4], [13.5, 18], [16, 20.5]]), { plate: 'S' }),
      g.glass(g.seg(19.2, 14.8, 20.4, 13.6, 2.4), 'c1', { plate: 'S', outline: 0.3, glint: false }),
    ]
  },
  'user-search': (icon, g) => [
    ...saint(g, 8.8),
    g.cut(g.grow(g.union(g.circle(16.4, 15.6, 3.6), g.seg(18.6, 17.8, 21, 20.2, 2.2)), 1)),
    g.gilt(g.seg(18.6, 17.8, 21, 20.2, 2.2), { plate: 'S' }),
    ...g.rose(16.4, 15.6, 3.6, 'c2', { n: 6, frame: 1, plate: 'S' }),
  ],
  // two saints: the companion behind in emerald
  users: (icon, g) => [
    ...saint(g, 15.6, { hy: 7, hr: 3, robe: 'c4', top: 13, half: 5.6, halo: false, plate: 'A' }),
    ...saint(g, 8.8, { hy: 8.2, top: 14 }),
  ],
  // a saint in a sapphire roundel
  'user-circle': (icon, g) => {
    const C = g.circle(12, 12, 9.6)
    return [
      ...g.pane(C, 'c2', { frame: 1.6, tracery: 'none', glass: { dark: 0.45 } }),
      g.glass(g.inter(g.lancet(6.4, 15.2, 17.6, 24, 0.75), g.shrink(C, 1.6)), 'c1', { tracery: 'lancet', s: 2.3, outline: 0.4 }),
      ...g.pane(g.circle(12, 9.6, 3.2), 'c3', { frame: 1.1, tracery: 'none' }),
    ]
  },

  // ===== squares: stained-glass panels with gilt corner studs and carved glyphs
  square: (icon, g) => panel(g, 'c2', 'quarry', { glass: { medal: 'c3' } }),
  'square-plus': (icon, g) => [...panel(g, 'c4'), carved(g, 'plus')],
  'square-minus': (icon, g) => [...panel(g, 'c1'), carved(g, 'minus')],
  'square-x': (icon, g) => [...panel(g, 'c1'), carved(g, 'x')],
  stop: (icon, g) => [
    ...g.pane(g.rr(4.6, 4.6, 19.4, 19.4, 2.2), 'c1', { frame: 1.6, tracery: 'medallion', glass: { medal: 'c3' } }),
  ],
  'x-circle': (icon, g) => [
    ...g.pane(g.circle(12, 12, 9.6), 'c1', { frame: 1.7, tracery: 'none', glass: { dark: 0.4 } }),
    carved(g, 'x', 12, 12, 1.45, 2.7),
  ],
  'zoom-in': (icon, g) => [...lens(g), carved(g, 'plus', 10.2, 10.2, 1.12, 2.2)],
  'zoom-out': (icon, g) => [...lens(g), carved(g, 'minus', 10.2, 10.2, 1.12, 2.2)],

  // ===== stars and faces
  // half lit gold glass, half night sapphire, divided by a stone mullion
  'star-half': (icon, g) => {
    const S = g.star(12, 12.6, 10.4, 4.6, 5)
    const inner = g.shrink(S, 1.5)
    const sp = Array.from({ length: 10 }, (_, k) => { const a = -90 + 36 * k; return [polar(12, 12.6, 2, a), polar(12, 12.6, 11, a)] })
    return [
      g.stone(g.rim(S, 1.5)),
      g.glass(g.inter(inner, g.rect(0, 0, 12, 24)), 'c3', { tracery: sp }),
      g.glass(g.inter(inner, g.rect(12, 0, 24, 24)), 'c2', { tracery: sp, dark: 0.5, deep: 0.25, glint: false }),
      g.stone(g.inter(g.seg(12, 2, 12, 18, 1), g.shrink(S, 0.4)), { thin: true }),
    ]
  },
  // a gilt sun-face boss at the heart of a rose window: sapphire lights in a stone rim,
  // the features cut in lead
  smile: (icon, g) => [
    ...g.pane(g.circle(12, 12, 10), 'c2', { frame: 1.25, tracery: spokes(12, 12, 6, 9.5, 12, 15), glass: { dark: 0.4 } }),
    g.gilt(g.circle(12, 12, 6.7)),
    g.recess(g.union(g.ellipse(9.5, 10.3, 0.95, 1.3), g.ellipse(14.5, 10.3, 0.95, 1.3), g.stroke(g.arcPts(12, 11.6, 3.7, 28, 152), 1.35)), { outline: 0 }),
  ],
  // concentric rings of ruby and gold glass round a gilt boss
  target: (icon, g) => [
    ...slab(g, g.circle(12, 12, 9.7), 'c1', { frame: 1.5, tracery: spokes(12, 12, 5.4, 9, 12), glass: { dark: 0.35 } }),
    g.stone(g.ring(12, 12, 5.6, 1.3), { thin: true }),
    g.glass(g.circle(12, 12, 4.95), 'c3', { outline: 0.3, tracery: spokes(12, 12, 2, 5, 8, 22.5) }),
    g.stone(g.ring(12, 12, 2.4, 1), { thin: true }),
    ...boss(g, 12, 12, 1.7, 'c1', 'A'),
  ],
  // a gable: gold glass triangle pierced by a ruby trefoil
  triangle: (icon, g) => [
    ...g.pane(g.path('M10.27 3.6 A2 2 0 0 1 13.73 3.6 L21.6 17.4 A2 2 0 0 1 19.8 20.6 L4.2 20.6 A2 2 0 0 1 2.4 17.4 Z'), 'c3', { frame: 1.7, tracery: [[[12, 4], [12, 11]], [[3, 20], [9, 15.5]], [[21, 20], [15, 15.5]]] }),
    g.stone(g.circle(12, 14.6, 3.7), { thin: true }),
    g.glass(g.foil(12, 14.8, 2.7, 3, -90), 'c1', { outline: 0.3, glow: 0.3 }),
  ],
  // ===== devices: stone cases, pointed-arch screens of glass
  smartphone: (icon, g) => [
    g.stone(g.rr(5.6, 2.2, 18.4, 21.8, 2.6)),
    g.glass(g.lancet(7.6, 4, 16.4, 17.2, 1), 'c2', { tracery: 'lancet', s: 2.2, outline: 0.4 }),
    g.gilt(g.rr(10.2, 18.7, 13.8, 20.1, 0.7), { thin: true, plate: 'A' }),
  ],
  tablet: (icon, g) => [
    g.stone(g.rr(3.6, 2.2, 20.4, 21.8, 2.2)),
    g.glass(g.lancet(5.6, 4, 18.4, 17.4, 0.85), 'c2', { tracery: 'quarry', at: { c: [12, 11.4], r: 3.4 }, outline: 0.4 }),
    g.gilt(g.rr(10.2, 18.7, 13.8, 20.1, 0.7), { thin: true, plate: 'A' }),
  ],
  speaker: (icon, g) => [
    g.stone(g.rr(4.8, 1.8, 19.2, 22, 2.2)),
    g.recess(g.lancet(6.6, 3.4, 17.4, 20.6, 0.9), { outline: 0, glow: 'c2', glowOp: 0.3 }),
    ...g.rose(12, 14.6, 5.1, 'c1', { n: 10, frame: 1.2, plate: 'A' }),
    ...boss(g, 12, 6.4, 1.8, 'c3'),
  ],
  tv: (icon, g) => [
    g.gilt(g.stroke([[7.6, 2.6], [12, 7], [16.4, 2.6]], 1.3), { thin: true, plate: 'A' }),
    g.gilt(g.union(g.circle(7.4, 2.6, 1), g.circle(16.6, 2.6, 1)), { thin: true, plate: 'A', glint: false }),
    ...g.pane(g.rr(2.2, 6.6, 21.8, 20.4, 2.2), 'c2', { frame: 1.8, tracery: 'quarry', glass: { medal: 'c3' } }),
  ],
  'video-camera': (icon, g) => camOf(g),
  'video-off': (icon, g) => [...camOf(g), ...g.slash(3.2, 3.2, 20.8, 20.8)],
  // a saint framed in the screen: the caller in a sapphire light
  'video-call': (icon, g) => {
    const scr = g.rr(2, 4.4, 16.6, 19.6, 2.2)
    const inner = g.shrink(scr, 1.6)
    return [
      g.gilt(g.poly([[15.4, 10.4], [21.8, 6.6], [21.8, 17.4], [15.4, 13.6]]), { plate: 'A' }),
      g.stone(g.rim(scr, 1.6)),
      g.glass(inner, 'c2', { dark: 0.45 }),
      g.glass(g.inter(g.lancet(5.2, 14.2, 13.4, 22, 0.75), inner), 'c1', { outline: 0.35, tracery: [[[9.3, 14], [9.3, 20]]] }),
      ...g.pane(g.circle(9.3, 10.3, 2.6), 'c3', { frame: 0.9, tracery: 'none' }),
    ]
  },
  // a rose-window lens on a stone column and plinth
  webcam: (icon, g) => [
    g.stone(g.union(g.rr(10.9, 15, 13.1, 20.6, 0.4), g.rr(7, 19.8, 17, 21.8, 0.9)), { thin: true }),
    ...g.rose(12, 9.6, 7.4, 'c2', { n: 12, frame: 1.7 }),
    ...boss(g, 12, 9.6, 2.4, 'c1', 'A'),
  ],
  'washing-machine': (icon, g) => [
    g.stone(g.rr(3.8, 2.2, 20.2, 21.8, 2.2)),
    g.stone(g.rr(4.6, 6.2, 19.4, 7.2, 0), { thin: true, outline: 0.3 }),
    g.studs([[7.2, 4.4], [10, 4.4]], 0.7),
    g.glass(g.rr(13.2, 3.6, 17.6, 5.2, 0.6), 'c4', { outline: 0.3, glint: false }),
    ...g.rose(12, 14.4, 5.4, 'c2', { n: 8, frame: 1.4, plate: 'A' }),
  ],
  // a reliquary watch: gilt straps, sapphire face, gilt hands
  watch: (icon, g) => [
    g.gilt(g.union(g.path('M8.4 7 L9 3.2 A1 1 0 0 1 10 2.2 H14 A1 1 0 0 1 15 3.2 L15.6 7 Z'), g.path('M8.4 17 L9 20.8 A1 1 0 0 0 10 21.8 H14 A1 1 0 0 0 15 20.8 L15.6 17 Z'))),
    g.lead([[[10, 4.4], [14, 4.4]], [[10, 19.6], [14, 19.6]]], { role: 'shadow', w: 0.35, op: 0.45 }),
    ...g.pane(g.circle(12, 12, 7), 'c2', { frame: 1.6, tracery: spokes(12, 12, 3.6, 5.6, 12) }),
    g.gilt(g.union(g.seg(12, 12, 12, 8.4, 1.3), g.seg(12, 12, 14.4, 13.6, 1.3)), { plate: 'A', thin: true }),
    g.gilt(g.circle(12, 12, 1), { plate: 'A', glint: false }),
  ],
  timer: (icon, g) => [
    g.gilt(g.union(g.rr(9.6, 1.6, 14.4, 3.4, 0.8), g.seg(12, 2.6, 12, 5.6, 1.7)), { plate: 'A' }),
    g.gilt(g.seg(17.8, 7.6, 19.8, 5.6, 1.8), { plate: 'A' }),
    ...g.pane(g.circle(12, 13.6, 8.2), 'c3', { frame: 1.7, tracery: spokes(12, 13.6, 4.6, 6.8, 12) }),
    g.gilt(g.seg(12, 13.6, 15.2, 10.4, 1.5), { plate: 'A' }),
    ...boss(g, 12, 13.6, 1.5, 'c1', 'A'),
  ],
  toggle: (icon, g) => [
    ...g.pane(g.rr(2.2, 5.2, 21.8, 18.8, 6.8), 'c4', { frame: 1.5, tracery: [[[8, 4], [8, 20]]] }),
    g.gilt(g.circle(15.2, 12, 4.2), { plate: 'A' }),
    g.glass(g.foil(15.2, 12, 2.8, 4, -90), 'c3', { plate: 'A', outline: 0.3, glow: 0.3 }),
  ],
  // a scriptorium slate: dark sapphire glass, gilt prompt and cursor
  terminal: (icon, g) => [
    ...g.pane(g.rr(1.8, 3.6, 22.2, 20.4, 2.2), 'c2', { frame: 1.7, tracery: 'none', glass: { dark: 0.55, deep: 0.2 } }),
    g.gilt(g.stroke([[6.4, 8.4], [10, 12], [6.4, 15.6]], 2.1)),
    g.gilt(g.rr(12.2, 14.6, 17.8, 16.6, 0.7), { plate: 'A' }),
  ],
  'text-cursor-input': (icon, g) => {
    const I = g.union(g.seg(14.5, 3.4, 14.5, 20.6, 1.9), g.seg(12.4, 3.4, 16.6, 3.4, 1.9), g.seg(12.4, 20.6, 16.6, 20.6, 1.9))
    return [
      ...g.pane(g.rr(1.8, 6.6, 22.2, 17.4, 2.2), 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.4 } }),
      g.stone(g.seg(5.6, 12, 9.2, 12, 1.7), { thin: true }),
      g.cut(g.grow(I, 0.9)),
      g.gilt(I, { plate: 'A' }),
    ]
  },
  // the horn as ruby glass in stone, the sound as stone ribs
  volume: (icon, g) => [...hornOf(g), ...waveOf(g, 5.1, 40), ...waveOf(g, 9, 46)],
  'volume-1': (icon, g) => [...hornOf(g), ...waveOf(g, 5.1, 40)],
  'volume-off': (icon, g) => [
    ...hornOf(g),
    g.gilt(g.glyph('x', 18, 12, 1.15, 2), { plate: 'S' }),
  ],
  // ogival waves of glass in stone, a ruby jewel at the source
  wifi: (icon, g) => wifiOf(g),
  'wifi-off': (icon, g) => [...wifiOf(g), ...g.slash(3.4, 3.4, 20.6, 20.6)],
  usb: (icon, g) => [
    g.gilt(g.union(g.seg(12, 5, 12, 17.4, 1.9), g.stroke([[5.5, 10.8], [5.5, 12], [12, 15.5]], 1.7), g.stroke([[18.5, 11.2], [18.5, 12], [12, 14]], 1.7))),
    g.glass(g.poly([[12, 1.8], [14.6, 5.9], [9.4, 5.9]]), 'c3', { outline: 0.4 }),
    ...slab(g, g.circle(5.5, 9, 2.4), 'c4', { frame: 0.9, thin: true }),
    ...slab(g, g.rr(16.1, 7, 20.9, 11.8, 0.6), 'c2', { frame: 0.9, thin: true }),
    ...slab(g, g.circle(12, 19.3, 2.7), 'c1', { frame: 0.9, thin: true, tracery: spokes(12, 19.3, 0, 3, 6, 30) }),
  ],
  // ===== sky and weather: the sun is a rose window, light is gilt
  sun: (icon, g) => [
    g.gilt(g.poly(Array.from({ length: 32 }, (_, k) => polar(12, 12, k % 2 ? 6.3 : k % 4 ? 8.9 : 10.4, 11.25 * k))), { plate: 'A' }),
    ...g.rose(12, 12, 5.9, 'c3', { n: 8, frame: 1.3, medal: 'c1' }),
  ],
  // day and night in one roundel: gold half rayed, sapphire half starred
  'sun-moon': (icon, g) => {
    const D = g.circle(12.6, 12, 6.2), inner = g.shrink(D, 1.3)
    return [
      g.gilt(g.union(...[-135, -157.5, 180, 157.5, 135].map((a, k) => rayOf(g, 12.6, 12, a, 7.4, k % 2 ? 9.4 : 10.4, 2))), { plate: 'A' }),
      g.stone(g.rim(D, 1.3)),
      g.glass(g.inter(inner, g.rect(0, 0, 12.6, 24)), 'c3', { tracery: spokes(12.6, 12, 0, 6, 6, 30) }),
      g.glass(g.inter(inner, g.rect(12.6, 0, 24, 24)), 'c2', { dark: 0.5, glint: false }),
      g.glass(g.star(15.2, 10.4, 1.6, 0.65, 4), 'c3', { outline: 0.25, glint: false }),
      g.stone(g.inter(g.seg(12.6, 4, 12.6, 20, 1), g.shrink(D, 0.4)), { thin: true }),
      g.deco(g.gilt(g.star(19.8, 4.6, 1.9, 0.7, 4), { thin: true, outline: 0.3, glint: false })),
    ]
  },
  sunrise: (icon, g) => horizon(g, true),
  sunset: (icon, g) => horizon(g, false),
  // ice-crystal of sapphire glass leaded in stone, gilt heart
  snowflake: (icon, g) => {
    const lines = []
    for (let k = 0; k < 6; k++) {
      const a = -90 + 60 * k, p = polar(12, 12, 6.2, a)
      lines.push([polar(12, 12, 0, a), polar(12, 12, 9.4, a)], [p, polar(p[0], p[1], 2.8, a - 50)], [p, polar(p[0], p[1], 2.8, a + 50)])
    }
    return [
      g.glass(g.stroke(lines, 2.3), 'c2', { glow: 0.26 }),
      g.gilt(g.ngon(12, 12, 2.6, 6), { plate: 'A' }),
      g.glass(g.ngon(12, 12, 1.5, 6), 'c1', { plate: 'A', outline: 0.25, glint: false }),
    ]
  },
  // three stars of gold glass; the two small ones twinkle (deco)
  sparkles: (icon, g) => [
    g.glass(g.path('M9.5 3.4 C9.6 9.2 11.6 12.4 16.8 13 C11.6 13.6 9.6 16.8 9.5 22.4 C9.4 16.8 7.4 13.6 2.2 13 C7.4 12.4 9.4 9.2 9.5 3.4 Z'), 'c3', { tracery: [[[9.5, 3], [9.5, 23]], [[2, 13], [17, 13]]], glow: 0.26 }),
    ...boss(g, 9.5, 13, 1.5, 'c1'),
    g.deco(g.gilt(g.path('M18 2.2 C18 5 18.9 6 21.8 6 C18.9 6 18 7 18 9.8 C18 7 17.1 6 14.2 6 C17.1 6 18 5 18 2.2 Z'), { thin: true })),
    g.deco(g.gilt(g.path('M18.5 13.7 C18.5 16 19.3 17 21.8 17 C19.3 17 18.5 18 18.5 20.3 C18.5 18 17.7 17 15.2 17 C17.7 17 18.5 16 18.5 13.7 Z'), { thin: true })),
  ],
  // two emerald leaves leaded along their veins, on a stone plinth
  sprout: (icon, g) => [
    g.stone(g.union(g.seg(12, 10, 12, 20.4, 1.9), g.rr(6.8, 19.8, 17.2, 21.8, 0.9)), { thin: true }),
    ...g.pane(g.path('M12.2 13.4 C7.8 14 3.2 11.4 2.8 5.4 C8 5 11.8 8.2 12.2 13.4 Z'), 'c4', { frame: 1, tracery: [[[4, 6.4], [12, 13.2]]], plate: 'A' }),
    ...g.pane(g.path('M11.8 11 C12.2 5.8 15.6 2.4 21.2 2.4 C21.2 7.6 17 11 11.8 11 Z'), 'c4', { frame: 1, tracery: [[[20.2, 3.4], [12, 11]]], plate: 'A' }),
  ],
  // a tiered spire of emerald glass, gold star finial (deco), ruby jewels
  'tree-pine': (icon, g) => [
    g.stone(g.rr(10.6, 17.6, 13.4, 21.8, 0.5), { thin: true, plate: 'A' }),
    ...g.pane(g.path('M12 2.6 L6.4 8.9 H8.8 L4.8 13.8 H7.3 L3.2 18.9 H20.8 L16.7 13.8 H19.2 L15.2 8.9 H17.6 Z'), 'c4', { frame: 1.3, tracery: [[[7, 9.4], [17, 9.4]], [[5, 14.3], [19, 14.3]], [[12, 2], [12, 19]]] }),
    g.glass(g.union(g.circle(9.4, 12, 0.85), g.circle(14.8, 16.4, 0.85), g.circle(13.6, 7.6, 0.75)), 'c1', { outline: 0.25, glint: false }),
    g.deco(g.gilt(g.star(12, 2.6, 2, 0.8, 5), { thin: true, outline: 0.3, glint: false })),
  ],
  // wind as wrought-iron scrolls, gilt, each curl closing on a glass bead, pommel ends
  wind: (icon, g) => {
    const end = y => [g.seg(3.7, y - 1.4, 3.7, y + 1.4, 1), g.circle(2.5, y, 0.95)]
    return [
      g.gilt(g.union(g.stroke('M3.8 8 H9 A2.75 2.75 0 1 0 6.62 3.87', 2), ...end(8)), { plate: 'A' }),
      g.glass(g.circle(6.4, 4.1, 1.35), 'c2', { plate: 'A', outline: 0.36, glow: 0.3, glint: false }),
      g.gilt(g.union(g.stroke('M3.8 12 H18 A3 3 0 1 0 15.4 7.5', 2.2), ...end(12))),
      g.glass(g.circle(15.3, 7.7, 1.45), 'c1', { outline: 0.36, glow: 0.3, glint: false }),
      g.gilt(g.union(g.stroke('M3.8 16 H13.5 A2.75 2.75 0 1 1 11.12 20.13', 2), ...end(16)), { plate: 'A' }),
      g.glass(g.circle(10.9, 19.9, 1.35), 'c2', { plate: 'A', outline: 0.36, glow: 0.3, glint: false }),
    ]
  },
  // a sapphire canopy ribbed like a vault, gilt crook handle
  umbrella: (icon, g) => [
    g.gilt(g.stroke('M12 11 V19 A2 2 0 0 1 8 19', 1.8), { plate: 'A' }),
    ...g.pane(g.path('M2.6 12.4 A9.4 9.4 0 0 1 21.4 12.4 A3.7 3.7 0 0 0 15 12.4 A3 3.7 0 0 0 9 12.4 A3.7 3.7 0 0 0 2.6 12.4 Z'), 'c2', { frame: 1.3, tracery: [[[12, 3], [9, 13]], [[12, 3], [15, 13]], [[12, 3], [3, 12.4]], [[12, 3], [21, 12.4]]] }),
    g.deco(g.finial(12, 3.6, 0.6)),
  ],
  // a bolt of gold glass leaded across, in a stone rim
  zap: (icon, g) => [
    ...g.pane(g.path('M13.9 1.8 L3.6 14.6 H10.4 L9.9 22.2 L20.4 9.4 H13.6 Z'), 'c3', { frame: 1.3, tracery: [[[4, 14.2], [19, 9.8]]] }),
  ],
  // a tortoise whose shell is a dome of emerald glass leaded into plates
  turtle: (icon, g) => [
    g.stone(g.union(g.rr(15.6, 10.4, 21.8, 15.2, 2.4), g.rr(4.2, 13.6, 8, 19, 1.6), g.rr(12.2, 13.6, 16, 19, 1.6)), { thin: true, plate: 'A' }),
    g.recess(g.circle(19.3, 12.5, 0.6), { outline: 0, plate: 'A' }),
    ...g.pane(g.path('M2.2 15.4 C2.2 9.4 6.4 5 10 5 C13.6 5 17.8 9.4 17.8 15.4 Z'), 'c4', { frame: 1.3, tracery: [[[6, 15.4], [7.75, 10.5], [12.25, 10.5], [14, 15.4]], [[7.75, 10.5], [6, 6]], [[12.25, 10.5], [14, 6]], [[10, 10.5], [10, 4]], [[6.6, 12.4], [2, 12]], [[13.4, 12.4], [18, 12]]] }),
  ],
  // a ruby and gold pavilion, glowing doorway, pennant on top (deco)
  tent: (icon, g) => [
    g.stone(g.rr(1.8, 19.4, 22.2, 21.6, 1), { ticks: [[[7, 18], [7, 23]], [[17, 18], [17, 23]]] }),
    ...g.pane(g.poly([[12, 3.4], [21, 20], [3, 20]]), 'c1', { frame: 1.3, tracery: [[[12, 3], [9, 21]], [[12, 3], [15, 21]], [[12, 3], [5.5, 21]], [[12, 3], [18.5, 21]]] }),
    g.stone(g.poly([[8.6, 20], [12, 12.6], [15.4, 20]]), { thin: true }),
    g.recess(g.poly([[10, 20], [12, 15.4], [14, 20]]), { glow: 'c3', glowOp: 0.7, plate: 'A' }),
    ...g.deco(g.gilt(g.seg(12, 4, 12, 1.6, 0.8), { thin: true, outline: 0.3 }), g.glass(g.poly([[12.3, 1.4], [15.6, 2.3], [12.3, 3.2]]), 'c3', { outline: 0.28, glint: false })),
  ],
  // a brass telescope of sapphire glass bands on a stone tripod
  telescope: (icon, g) => [
    g.stone(g.stroke([[[12, 11], [8, 21.4]], [[12, 11], [16, 21.4]]], 1.6), { thin: true, plate: 'A' }),
    ...g.pane(g.path('M6.23 13.32 L16.02 8.2 L13.77 4.3 L4.44 10.22 A1 1 0 0 0 4.11 11.57 L4.9 12.93 A1 1 0 0 0 6.23 13.32 Z'), 'c2', { frame: 1, tracery: [[[8.2, 7], [10, 11.8]]] }),
    g.gilt(g.path('M17.26 8.35 L18.13 7.85 A1 1 0 0 0 18.5 6.48 L16.5 3.02 A1 1 0 0 0 15.13 2.65 L14.26 3.15 A1 1 0 0 0 13.9 4.52 L15.9 7.98 A1 1 0 0 0 17.26 8.35 Z')),
    ...boss(g, 12, 11, 1.4, 'c1'),
  ],
  // a stone column with a ruby mercury column and gilt marks
  thermometer: (icon, g) => [
    g.stone(g.path('M6.2 13.8 V5.4 A2.8 2.8 0 0 1 11.8 5.4 V13.8 A4.3 4.3 0 1 1 6.2 13.8 Z')),
    g.glass(g.union(g.circle(9, 17.2, 2.5), g.rr(8.1, 8, 9.9, 16, 0.9)), 'c1', { outline: 0.35, glow: 0.3 }),
    g.gilt(g.union(g.seg(15.6, 5, 19.6, 5, 1.6), g.seg(15.6, 9, 18, 9, 1.6), g.seg(15.6, 13, 19.6, 13, 1.6)), { thin: true }),
  ],
  // an iron wand with a gilt ferrule, gold-glass stars (deco)
  wand: (icon, g) => [
    g.iron(g.seg(4.4, 19.6, 10.6, 13.4, 3)),
    g.gilt(g.seg(10, 14, 13.6, 10.4, 3.2), { plate: 'A' }),
    g.glass(g.seg(12, 12, 13.6, 10.4, 1.8), 'c3', { plate: 'A', outline: 0.3, glint: false }),
    ...g.deco(g.pane(g.path('M17.5 2.2 C17.5 5.2 18.6 6.5 21.8 6.5 C18.6 6.5 17.5 7.8 17.5 10.8 C17.5 7.8 16.4 6.5 13.2 6.5 C16.4 6.5 17.5 5.2 17.5 2.2 Z'), 'c3', { frame: 0.75, tracery: 'none' })),
    ...g.deco(g.pane(g.path('M9.5 2.4 C9.5 4.2 10.2 5 12 5 C10.2 5 9.5 5.8 9.5 7.6 C9.5 5.8 8.8 5 7 5 C8.8 5 9.5 4.2 9.5 2.4 Z'), 'c2', { frame: 0.6, tracery: 'none' })),
  ],
  // three wrought-iron hooks meeting at three jewels
  webhook: (icon, g) => [
    g.gilt(g.stroke('M12 7.5 L13.95 10.88 A3.75 3.75 0 0 0 17.2 12.75 A3.75 3.75 0 0 1 20.95 16.5 A3.75 3.75 0 0 1 17.2 20.25', 2)),
    g.gilt(g.stroke('M17.2 16.5 L13.3 16.5 A3.75 3.75 0 0 0 10.05 18.38 A3.75 3.75 0 0 1 4.93 19.75 A3.75 3.75 0 0 1 3.56 14.63', 2)),
    g.gilt(g.stroke('M6.8 16.5 L8.75 13.13 A3.75 3.75 0 0 0 8.75 9.38 A3.75 3.75 0 0 1 10.13 4.25 A3.75 3.75 0 0 1 15.25 5.63', 2)),
    ...[[12, 7.5, 'c1'], [17.2, 16.5, 'c2'], [6.8, 16.5, 'c4']].map(([x, y, r]) => g.glass(g.circle(x, y, 2.05), r, { plate: 'A', glow: 0.32 })),
  ],
  // ===== text tools: illuminated initials, a textura letter in gilt on a sapphire chip
  // in a small stone frame, the rule (strike, underline) a limestone bar
  strikethrough: (icon, g) => {
    const rule = g.rr(4.4, 11, 19.6, 13, 0.9)
    return [
      ...chip(g, 2.2, 2.2, 21.8, 21.8, g.mainRole(icon)),
      g.gilt(g.union(g.stroke([[16.2, 7], [14.4, 5.6], [9.6, 5.6], [7.8, 7.4], [7.8, 9], [9.6, 10.8], [14.4, 13.2], [16.2, 15], [16.2, 16.6], [14.4, 18.4], [9.6, 18.4], [7.8, 17]], 2.3), loz(g, 16.6, 7.2, 1.25), loz(g, 7.4, 16.8, 1.25))),
      g.cut(g.grow(rule, 0.55)),
      g.stone(rule, { thin: true, plate: 'A' }),
    ]
  },
  subscript: (icon, g) => [
    ...chip(g, 2.2, 2.4, 15.8, 16, g.mainRole(icon), { r: 1.8, frame: 1.1, studs: false }),
    g.gilt(g.union(g.seg(5.6, 5.8, 12.4, 12.6, 2.5), g.seg(12, 6.2, 6, 12.2, 1.1), loz(g, 12.3, 6, 1), loz(g, 5.7, 12.4, 1))),
    g.gilt(g.stroke([[16.6, 15.4], [17.8, 14.2], [19.8, 14.2], [21, 15.4], [21, 16.4], [17, 20.6], [21.4, 20.6]], 1.75), { plate: 'A' }),
  ],
  superscript: (icon, g) => [
    ...chip(g, 2.2, 8, 15.8, 21.6, g.mainRole(icon), { r: 1.8, frame: 1.1, studs: false }),
    g.gilt(g.union(g.seg(5.6, 11.4, 12.4, 18.2, 2.5), g.seg(12, 11.8, 6, 17.8, 1.1), loz(g, 12.3, 11.6, 1), loz(g, 5.7, 18, 1))),
    g.gilt(g.stroke([[16.6, 3.8], [17.8, 2.6], [19.8, 2.6], [21, 3.8], [21, 4.8], [17, 9], [21.4, 9]], 1.75), { plate: 'A' }),
  ],
  // a textura T: lozenge-ended bar with a hairline flourish, stem on a diamond foot
  type: (icon, g) => [
    ...chip(g, 2.2, 2.2, 21.8, 21.8, g.mainRole(icon)),
    g.gilt(g.union(
      g.poly([[5.2, 7.3], [6.8, 5.6], [17.2, 5.6], [18.8, 7.3], [17.2, 9], [6.8, 9]]),
      stemT(g, 12, 8, 16.4, 2.7), loz(g, 12, 17.6, 1.6),
      g.stroke([[6.6, 8.6], [6, 10.6], [7.2, 12]], 1),
    )),
  ],
  // a textura u (angular bowl, lozenge heads) over a limestone rule
  underline: (icon, g) => [
    ...chip(g, 2.2, 2.2, 21.8, 21.8, g.mainRole(icon)),
    g.gilt(g.union(stemT(g, 7.8, 5.4, 13.6, 2.5), stemT(g, 16.2, 5.4, 15.4, 2.5), g.stroke([[7.8, 13], [10, 15.6], [14, 15.6], [16.2, 13.4]], 2.2))),
    g.stone(g.rr(5.2, 17.4, 18.8, 19.4, 0.9), { thin: true, plate: 'A' }),
  ],
  // gilt arrows: ogival spear heads pierced by a ruby glass trefoil, trefoil terminals
  undo: (icon, g) => [
    g.gilt(g.stroke('M7 9.5 H15 A5.5 5.5 0 0 1 15 20.5 H9.6', 2.5)),
    tailOf(g, 9.4, 20.5, 180, 0.95),
    ...headOf(g, 2.2, 9.5, 180, 0.86),
  ],
  // the arrow falls past three stone lintels, glass inlays in alternate courses
  sort: (icon, g) => [
    g.gilt(g.seg(6, 4.4, 6, 15, 2.4), { plate: 'A' }),
    tailOf(g, 6, 4, -90, 0.9, 'A'),
    ...headOf(g, 6, 21.6, 90, 0.78, 'A'),
    ...lintel(g, 11.4, 5, 21.8, 'c2', { h: 1.65 }), ...lintel(g, 11.4, 12, 19.2, null, { h: 1.65 }), ...lintel(g, 11.4, 19, 16.8, 'c2', { h: 1.65 }),
    g.gilt(g.foil(15.3, 12, 1.35, 4, -45), { glint: false, outline: 0.3 }),
  ],
  swap: (icon, g) => [
    g.gilt(g.seg(4.2, 7.5, 15, 7.5, 2.4)),
    tailOf(g, 3.8, 7.5, 180, 0.9),
    ...headOf(g, 21.6, 7.5, 0, 0.8),
    g.gilt(g.seg(19.8, 16.5, 9, 16.5, 2.4), { plate: 'A' }),
    tailOf(g, 20.2, 16.5, 0, 0.9, 'A'),
    ...headOf(g, 2.4, 16.5, 180, 0.8, 'A', 'c2'),
  ],
  'wrap-text': (icon, g) => [
    ...lintel(g, 2.4, 5, 21.6, 'c2'),
    ...lintel(g, 2.4, 19, 8, null),
    g.gilt(g.stroke('M4.4 12 H17.5 A3.5 3.5 0 0 1 17.5 19 H15', 2.4), { plate: 'A' }),
    tailOf(g, 4, 12, 180, 0.9, 'A'),
    ...headOf(g, 9.8, 19, 180, 0.62, 'A'),
  ],
  // the trend as a gilt rib: trefoil terminal, jewelled joints, ogival head
  'trending-up': (icon, g) => [
    g.gilt(g.stroke([[3.2, 17], [8.5, 11.6], [12.5, 15.6], [16.6, 11.4]], 2.4)),
    tailOf(g, 3, 17.2, 135, 0.9),
    ...headOf(g, 21.6, 6.4, -45, 0.84, 'K', 'c4'),
    ...boss(g, 8.5, 11.6, 1.55, 'c4'), ...boss(g, 12.5, 15.6, 1.55, 'c4'),
  ],
  'trending-down': (icon, g) => [
    g.gilt(g.stroke([[3.2, 7], [8.5, 12.4], [12.5, 8.4], [16.6, 12.6]], 2.4)),
    tailOf(g, 3, 6.8, -135, 0.9),
    ...headOf(g, 21.6, 17.6, 45, 0.84),
    ...boss(g, 8.5, 12.4, 1.55, 'c1'), ...boss(g, 12.5, 8.4, 1.55, 'c1'),
  ],
  // a stone trough glazed in sapphire, a gilt spear rising from it
  upload: (icon, g) => [
    ...g.pane(g.path('M2.6 13.6 H6 V17.2 H18 V13.6 H21.4 V18.6 A2.6 2.6 0 0 1 18.8 21.4 H5.2 A2.6 2.6 0 0 1 2.6 18.8 Z'), 'c2', { frame: 0.9, tracery: [[[9, 16], [9, 22]], [[15, 16], [15, 22]]] }),
    g.gilt(g.seg(12, 16, 12, 9, 2.5), { plate: 'A' }),
    ...headOf(g, 12, 2.2, -90, 0.82, 'A'),
  ],
  // two gilt chain links pulled apart, iron sparks between (deco)
  unlink: (icon, g) => [
    ...g.pane(g.stroke('M3.5 16.5 L6.5 13.5 A2.83 2.83 0 0 1 10.5 17.5 L7.5 20.5 A2.83 2.83 0 0 1 3.5 16.5 Z', 2.6), 'c2', { frame: 0.7, tracery: 'none', plate: 'A' }),
    ...g.pane(g.stroke('M13.5 6.5 L16.5 3.5 A2.83 2.83 0 0 1 20.5 7.5 L17.5 10.5 A2.83 2.83 0 0 1 13.5 6.5 Z', 2.6), 'c2', { frame: 0.7, tracery: 'none' }),
    g.deco(g.gilt(g.union(g.seg(9.2, 9.2, 6.8, 6.8, 1.5), g.seg(14.8, 14.8, 17.2, 17.2, 1.5), g.seg(12.4, 9.4, 12.8, 7.4, 1.3), g.seg(9.4, 12.4, 7.4, 12.8, 1.3)), { thin: true, glint: false })),
  ],
  // a tracery grid: ruby header row, sapphire lights between stone mullions
  // a wide glazed grid: ruby header row, sapphire body, stone mullions and transoms
  table: (icon, g) => {
    const T = g.rr(1.8, 3.8, 22.2, 20.2, 2)
    const inner = g.shrink(T, 1.3)
    return [
      g.stone(g.rim(T, 1.3)),
      g.glass(g.inter(inner, g.rect(0, 9, 24, 24)), 'c2', { glint: false, dark: 0.38 }),
      g.glass(g.inter(inner, g.rect(0, 0, 24, 9)), 'c1', { glow: 0.24 }),
      g.stone(g.inter(g.union(g.rect(1, 8.4, 23, 9.8), g.rect(1, 14.1, 23, 15.1), g.rect(8.5, 4, 9.6, 20), g.rect(14.4, 4, 15.5, 20)), g.shrink(T, 0.6)), { thin: true }),
    ]
  },
  // a leaf of gold glass with a gilt turned corner (A)
  'sticky-note': (icon, g) => [
    ...g.pane(g.path('M5 2.8 H19 A2.2 2.2 0 0 1 21.2 5 V15.2 L15.2 21.2 H5 A2.2 2.2 0 0 1 2.8 19 V5 A2.2 2.2 0 0 1 5 2.8 Z'), 'c3', { frame: 1.5, tracery: 'none' }),
    g.stone(g.union(g.seg(7.4, 8, 16.6, 8, 1.5), g.seg(7.4, 12, 12.6, 12, 1.5)), { thin: true }),
    g.gilt(g.path('M21.2 15.2 H16.6 A1.6 1.6 0 0 0 15 16.8 V21.2 Z'), { plate: 'A' }),
  ],
  // a ruby tag leaded in quarries, gilt grommet
  tag: (icon, g) => [
    ...g.pane(g.path('M2.6 4.8 A2.2 2.2 0 0 1 4.8 2.6 H13.2 L20.8 10.2 A3 3 0 0 1 20.8 14.6 L14.6 20.8 A3 3 0 0 1 10.2 20.8 L2.6 13.2 Z'), 'c1', { frame: 1.6, tracery: 'quarry', glass: { medallion: false } }),
    g.gilt(g.circle(8, 8, 2.2), { plate: 'A' }),
    g.recess(g.circle(8, 8, 1), { outline: 0, plate: 'A' }),
  ],
  // a gold ticket with a ruby quatrefoil and a perforated stone seam
  ticket: (icon, g) => [
    ...g.pane(g.path('M4 4.6 H20 A2.2 2.2 0 0 1 22.2 6.8 V9.3 A2.7 2.7 0 0 0 22.2 14.7 V17.2 A2.2 2.2 0 0 1 20 19.4 H4 A2.2 2.2 0 0 1 1.8 17.2 V14.7 A2.7 2.7 0 0 0 1.8 9.3 V6.8 A2.2 2.2 0 0 1 4 4.6 Z'), 'c3', { frame: 1.5, tracery: 'none' }),
    g.stone(g.union(g.circle(15.5, 8.2, 0.75), g.circle(15.5, 12, 0.75), g.circle(15.5, 15.8, 0.75)), { thin: true, outline: 0.3 }),
    g.gilt(g.circle(9.4, 12, 3.2), { glint: false }),
    g.glass(g.foil(9.4, 12, 2.4, 4, -90), 'c1', { outline: 0.28, glow: 0.3 }),
  ],
  // ===== furniture, home and things
  // a choir settle: stone back pierced by three ruby lancets, ruby cushion, gilt feet
  sofa: (icon, g) => [
    g.gilt(g.union(g.rr(4.2, 17.6, 6, 20.8, 0.6), g.rr(18, 17.6, 19.8, 20.8, 0.6)), { thin: true }),
    g.stone(g.rr(5.4, 4.6, 18.6, 13.4, [3, 3, 0, 0])),
    g.glass(g.union(g.lancet(7.2, 6.6, 9.8, 12.4, 1.1), g.lancet(10.7, 6, 13.3, 12.4, 1.1), g.lancet(14.2, 6.6, 16.8, 12.4, 1.1)), 'c1', { outline: 0.35, glint: false }),
    g.stone(g.union(g.rr(1.8, 10.6, 6.4, 18.6, 2.2), g.rr(17.6, 10.6, 22.2, 18.6, 2.2), g.rr(4, 14.6, 20, 18.6, 1)), { ticks: [[[12, 14], [12, 19]]] }),
    ...g.pane(g.rr(6, 12.2, 18, 15.6, 1.4), 'c1', { frame: 0.8, tracery: [[[12, 11], [12, 17]]], plate: 'A' }),
  ],
  // a ruby bowl with a gilt rim, gilt steam scrolls (deco)
  soup: (icon, g) => [
    g.stone(g.rr(8.4, 19.4, 15.6, 21.6, 1), { thin: true }),
    ...g.pane(g.path('M2.6 12 H21.4 A9.4 8.6 0 0 1 2.6 12 Z'), 'c1', { frame: 1.4, tracery: 'none' }),
    g.gilt(g.rr(2, 10.8, 22, 13.2, 1.2), { plate: 'A' }),
    g.studs([[7.4, 15.6], [12, 16.6], [16.6, 15.6]], 0.6),
    g.deco(g.gilt(g.union(g.stroke('M8 8.6 C6.4 7.6 9.6 5.6 8 4', 1.2), g.stroke('M12 8.6 C10.4 7.6 13.6 5.6 12 4', 1.2), g.stroke('M16 8.6 C14.4 7.6 17.6 5.6 16 4', 1.2)), { thin: true, outline: 0.32, glint: false })),
  ],
  stethoscope: (icon, g) => [
    g.gilt(g.stroke('M9 11.6 V16 A5 5 0 0 0 19 16 V14', 2), { plate: 'A' }),
    g.gilt(g.stroke('M5 3 V8.5 A3.5 3.5 0 0 0 12.5 8.5 V3', 2)),
    g.gilt(g.union(g.circle(5, 3, 1.4), g.circle(12.5, 3, 1.4)), { glint: false }),
    ...g.rose(19, 11, 3.6, 'c1', { n: 6, frame: 1, plate: 'A' }),
  ],
  // a market hall: ruby and gold awning, ashlar walls, glowing pointed door
  store: (icon, g) => [
    g.stone(g.rr(4.2, 9.6, 19.8, 21.4, [0, 0, 1.6, 1.6]), { ashlar: { h: 2.4, w: 3.2, y0: 9.6, y1: 21.4 } }),
    g.stone(g.lancet(8.6, 13.4, 15.4, 21.4, 1), { thin: true }),
    g.recess(g.lancet(9.9, 14.8, 14.1, 21.4, 1), { glow: 'c3', glowOp: 0.7, plate: 'A' }),
    g.stone(g.path('M5.8 2.6 H18.2 L21.6 8.6 A3.2 2.7 0 0 1 15.2 8.6 A3.2 2.7 0 0 1 8.8 8.6 A3.2 2.7 0 0 1 2.4 8.6 Z')),
    g.glass(g.inter(g.shrink(g.path('M5.8 2.6 H18.2 L21.6 8.6 A3.2 2.7 0 0 1 15.2 8.6 A3.2 2.7 0 0 1 8.8 8.6 A3.2 2.7 0 0 1 2.4 8.6 Z'), 1), g.poly([[0, 0], [10.2, 0], [9.2, 12], [0, 12]])), 'c1', { outline: 0.3 }),
    g.glass(g.inter(g.shrink(g.path('M5.8 2.6 H18.2 L21.6 8.6 A3.2 2.7 0 0 1 15.2 8.6 A3.2 2.7 0 0 1 8.8 8.6 A3.2 2.7 0 0 1 2.4 8.6 Z'), 1), g.poly([[10.2, 0], [13.8, 0], [14.8, 12], [9.2, 12]])), 'c3', { outline: 0.3 }),
    g.glass(g.inter(g.shrink(g.path('M5.8 2.6 H18.2 L21.6 8.6 A3.2 2.7 0 0 1 15.2 8.6 A3.2 2.7 0 0 1 8.8 8.6 A3.2 2.7 0 0 1 2.4 8.6 Z'), 1), g.poly([[13.8, 0], [24, 0], [24, 12], [14.8, 12]])), 'c1', { outline: 0.3 }),
  ],
  syringe: (icon, g) => [
    g.iron(g.seg(9.4, 14.6, 3.6, 20.4, 1.2)),
    g.gilt(g.union(g.seg(15, 9, 19, 5, 1.8), g.seg(17, 3, 21, 7, 2.2)), { plate: 'A' }),
    g.gilt(g.seg(11.2, 5.2, 18.8, 12.8, 2), { thin: true }),
    ...g.pane(g.poly([[17.4, 11.2], [11, 17.6], [6.4, 13], [12.8, 6.6]]), 'c1', { frame: 0.9, tracery: [[[10, 8.6], [11.4, 10]], [[8.4, 10.6], [9.8, 12]]] }),
  ],
  // a gold-glass cab, sapphire windows, rose-window wheels, ruby roof lantern
  taxi: (icon, g) => [
    g.gilt(g.rr(9.2, 3.2, 12.8, 7, 0.8), { plate: 'A' }),
    g.glass(g.rr(10.1, 4.1, 11.9, 6.1, 0.4), 'c1', { outline: 0.25, glint: false, plate: 'A' }),
    ...slab(g, g.path('M2.4 17 V14 A2 2 0 0 1 4.4 12 H5.4 L7.9 6.6 H13.6 L17.6 12 H19.6 A2 2 0 0 1 21.6 14 V17 A1.6 1.6 0 0 1 20 18.6 H4 A1.6 1.6 0 0 1 2.4 17 Z'), 'c3', { frame: 1.3, tracery: [[[4, 14.8], [21, 14.8]]] }),
    g.glass(g.poly([[8.8, 8.2], [10.4, 8.2], [10.4, 11.6], [7.3, 11.6]]), 'c2', { outline: 0.35, glint: false }),
    g.glass(g.poly([[11.6, 8.2], [13, 8.2], [15.6, 11.6], [11.6, 11.6]]), 'c2', { outline: 0.35, glint: false }),
    ...wheel(g, 7.2, 18.4, 2.7, 'c2', false), ...wheel(g, 16.8, 18.4, 2.7, 'c2', false),
  ],
  // an emerald racket strung with lead, gilt handle, gold ball
  tennis: (icon, g) => [
    g.gilt(g.seg(13.6, 13.6, 20.6, 20.6, 2.5), { plate: 'A' }),
    g.iron(g.seg(13.4, 13.4, 15, 15, 3.2), { plate: 'A' }),
    ...g.pane(g.path('M4 4 A7.07 5.5 45 1 1 14 14 A7.07 5.5 45 1 1 4 4 Z'), 'c4', { frame: 1.3, tracery: [[[7.5, 4.5], [13.5, 10.5]], [[4.5, 7.5], [10.5, 13.5]], [[12.75, 8.25], [8.25, 12.75]], [[9.75, 5.25], [5.25, 9.75]]] }),
    g.glass(g.circle(19, 5, 2.6), 'c3', { outline: 0.42, tracery: [[[17, 3.4], [18.2, 5], [17, 6.8]], [[21, 3.4], [19.8, 5], [21, 6.8]]], plate: 'deco' }),
  ],
  // a carved limestone hand: the thumb raised, four fingers curled and leaded, a ruby glass
  // cuff in a gilt band
  'thumbs-up': (icon, g) => handOf(g, false),
  'thumbs-down': (icon, g) => handOf(g, true),
  toilet: (icon, g) => [
    g.stone(g.poly([[9.2, 15.4], [14.8, 15.4], [15.8, 21.4], [8.2, 21.4]]), { thin: true }),
    ...g.pane(g.rr(3.6, 2.2, 10.6, 11.4, [2, 2, 0, 0]), 'c2', { frame: 1.3, tracery: 'none', glass: { dark: 0.45, glint: false } }),
    g.gilt(g.rr(5.4, 4.6, 8.8, 6, 0.7), { thin: true, plate: 'A' }),
    ...g.pane(g.path('M3.4 10.6 H20.6 A5.4 5.4 0 0 1 15 16.4 H9 A5.4 5.4 0 0 1 3.4 10.6 Z'), 'c2', { frame: 1.3, tracery: [[[12, 10], [12, 17]]] }),
  ],
  // a limestone tooth with a gold-glass quatrefoil inlay and a twinkle (deco)
  tooth: (icon, g) => [
    g.stone(g.path('M12 5.5 C10.5 4 8.5 3 6.5 3.5 C4 4 3 6.5 3.5 9.5 C4 12 5.5 13.5 6 16 C6.5 19 7 21 8.5 21 C10 21 10 18.5 10.5 16.5 C10.75 15.25 11.25 14.5 12 14.5 C12.75 14.5 13.25 15.25 13.5 16.5 C14 18.5 14 21 15.5 21 C17 21 17.5 19 18 16 C18.5 13.5 20 12 20.5 9.5 C21 6.5 20 4 17.5 3.5 C15.5 3 13.5 4 12 5.5 Z')),
    g.gilt(g.foil(12, 9.6, 3, 4, -90), { glint: false }),
    g.glass(g.foil(12, 9.6, 2.2, 4, -90), 'c2', { outline: 0.25, glow: 0.3 }),
    g.deco(g.gilt(g.star(19.6, 3.6, 2, 0.7, 4), { thin: true, outline: 0.3, glint: false })),
  ],
  // a ruby cone banded with stone, on a stone slab
  'traffic-cone': (icon, g) => {
    const cone = g.poly([[10.4, 2.8], [13.6, 2.8], [18.8, 20], [5.2, 20]])
    return [
      g.stone(g.rr(2.2, 19, 21.8, 21.6, 1), { ticks: [[[7, 18], [7, 23]], [[17, 18], [17, 23]]] }),
      g.glass(cone, 'c1', { tracery: 'none' }),
      g.stone(g.inter(g.union(g.rect(0, 7.8, 24, 10.2), g.rect(0, 13.4, 24, 15.8)), cone), { thin: true }),
      g.gilt(g.rr(10.4, 2.2, 13.6, 3.6, 0.6), { thin: true, glint: false }),
    ]
  },
  // a locomotive front: stone body, twin lancet windscreens, gold lamps, gilt rails
  train: (icon, g) => [
    g.gilt(g.union(g.seg(8, 17.4, 5.4, 21.6, 1.7), g.seg(16, 17.4, 18.6, 21.6, 1.7)), { plate: 'A' }),
    g.stone(g.rr(3.8, 2.2, 20.2, 18, [4.6, 4.6, 2, 2])),
    g.glass(g.rr(4.8, 11.6, 19.2, 13, 0), 'c1', { outline: 0.3, glint: false }),
    g.glass(g.lancet(5.8, 4.2, 11.2, 10.6, 0.9), 'c2', { outline: 0.38, tracery: 'none' }),
    g.glass(g.lancet(12.8, 4.2, 18.2, 10.6, 0.9), 'c2', { outline: 0.38, tracery: 'none' }),
    ...boss(g, 7.8, 15.2, 1.6, 'c3'), ...boss(g, 16.2, 15.2, 1.6, 'c3'),
  ],
  // a gilt cup bearing a ruby quatrefoil, on a stone plinth with a sapphire plaque
  trophy: (icon, g) => [
    g.gilt(g.union(g.stroke('M7.2 5 H5 A2.75 2.75 0 0 0 5 10.5 H7.6', 1.7), g.stroke('M16.8 5 H19 A2.75 2.75 0 0 1 19 10.5 H16.4', 1.7)), { plate: 'A' }),
    g.gilt(g.union(g.path('M6.8 3 H17.2 V8.6 A5.2 5.2 0 0 1 6.8 8.6 Z'), g.seg(12, 12, 12, 17, 2.2))),
    g.glass(g.foil(12, 7.8, 2.8, 4, -90), 'c1', { outline: 0.3, glow: 0.3 }),
    g.stone(g.rr(7.6, 16.4, 16.4, 21.6, 1.2)),
    g.glass(g.rr(9.6, 17.9, 14.4, 20.1, 0.5), 'c2', { outline: 0.3, glint: false }),
  ],
  // a wagon: ashlar cargo, sapphire cab window, rose-window wheels
  truck: (icon, g) => [
    ...g.pane(g.rr(1.8, 4.6, 14.4, 17.8, [2, 2, 0, 1.4]), 'c2', { frame: 1.35, tracery: [[[6, 4], [6, 18]], [[10.2, 4], [10.2, 18]]], glass: { dark: 0.4 } }),
    g.stone(g.path('M13.6 9.2 H17.6 L22.2 13.8 V16.6 A1.4 1.4 0 0 1 20.8 18 H13.6 Z')),
    g.glass(g.poly([[15.2, 10.8], [17.1, 10.8], [19.8, 13.6], [15.2, 13.6]]), 'c3', { outline: 0.32, glint: false }),
    ...wheel(g, 6.4, 18.2, 2.7), ...wheel(g, 18, 18.2, 2.7),
  ],
  // the lock exemplar, its gilt shackle swung open
  unlock: (icon, g) => {
    const body = g.rr(3.8, 10.2, 20.2, 21.4, 2.2)
    return [
      g.gilt(g.stroke('M7.6 11 V7.6 A4.4 4.4 0 0 1 16.2 5.6', 2.2), { plate: 'A' }),
      g.glass(body, 'c1', { tracery: 'lancet', s: 2.2, dark: 0.4 }),
      g.gilt(g.rim(body, 1.2), { glint: false }),
      g.studs([[5.6, 12], [18.4, 12], [5.6, 19.6], [18.4, 19.6]], 0.45),
      g.gilt(g.foil(12, 15.6, 3.3, 4, -90)),
      g.recess(g.union(g.circle(12, 14.9, 0.95), g.poly([[11.3, 15.2], [12.7, 15.2], [13.1, 17.6], [10.9, 17.6]])), { glow: 'c3', glowOp: 0.5, outline: 0.2 }),
    ]
  },
  // a gilt fork with a ruby jewel, a steel (stone) blade on a gilt haft
  utensils: (icon, g) => [
    g.gilt(g.union(g.stroke('M3.5 2.6 V8 A4 4 0 0 0 11.5 8 V2.6', 1.9), g.seg(7.5, 2.6, 7.5, 21.4, 2.2))),
    g.glass(g.ngon(7.5, 15.4, 1.5, 4), 'c1', { outline: 0.28, glint: false }),
    g.gilt(g.seg(18, 14.4, 18, 21.4, 2.4), { plate: 'A' }),
    g.stone(g.path('M20.6 15.2 V2.4 C17.4 3.4 15.4 6.6 15.4 10.6 V13 A2.2 2.2 0 0 0 17.6 15.2 Z'), { plate: 'A' }),
  ],
  // a ball of gold glass with stone seams, like a rose boss
  // a ball of gold glass in a stone rim, two panels of sapphire and ruby, carved seams
  volleyball: (icon, g) => {
    const C = g.circle(12, 12, 9.7), inner = g.shrink(C, 1.4)
    const seams = parsePath('M12 12 A9.5 9.5 0 0 0 20.23 7.25 M12 12 A9.5 9.5 0 0 0 12 21.5 M12 12 A9.5 9.5 0 0 0 3.77 7.25 M21.5 12.09 A13.5 13.5 0 0 1 10.76 15.94 M7.17 20.18 A13.5 13.5 0 0 1 9.2 8.96 M7.33 3.73 A13.5 13.5 0 0 1 16.03 11.1', 1.2).map(q => q.pts.map(([x, y]) => [f2(x), f2(y)]))
    return [
      g.stone(C),
      g.glass(inner, 'c3', { outline: 0.4 }),
      g.glass(g.inter(inner, g.path('M12 12 A9.5 9.5 0 0 0 20.23 7.25 L22 4 L13 2 L7.33 3.73 A13.5 13.5 0 0 1 16.03 11.1 Z')), 'c2', { outline: 0, glint: false }),
      g.glass(g.inter(inner, g.path('M12 12 A9.5 9.5 0 0 0 12 21.5 L4 22 L2 14 L9.2 8.96 A13.5 13.5 0 0 0 7.17 20.18 Z')), 'c1', { outline: 0, glint: false }),
      g.lead(seams, { w: 1.9 }),
      g.lead(seams, { w: 1, role: 'tint' }),
    ]
  },
  // a ruby purse with a stone flap and a gilt clasp (A)
  wallet: (icon, g) => [
    g.stone(g.path('M3 7.4 V6 A2 2 0 0 1 5 4 H15.6 A1.6 1.6 0 0 1 17.2 5.6 V9.2 H5 A2 2 0 0 1 3 7.4 Z'), { thin: true }),
    ...g.pane(g.path('M2.6 7 V18 A2.2 2.2 0 0 0 4.8 20.2 H19.2 A2.2 2.2 0 0 0 21.4 18 V11 A2.2 2.2 0 0 0 19.2 8.8 H4.8 A2.2 2.2 0 0 1 2.6 7 Z'), 'c1', { frame: 1.4, tracery: 'quarry', glass: { medallion: false } }),
    g.gilt(g.path('M22 12 H18.4 A2.5 2.5 0 0 0 18.4 17 H22 Z'), { plate: 'A' }),
    g.glass(g.circle(18.6, 14.5, 1), 'c3', { outline: 0.28, glint: false, plate: 'A' }),
  ],
  // a granary: ashlar gable, small rose window, sapphire shutter door
  warehouse: (icon, g) => [
    g.stone(g.poly([[2.6, 21.4], [2.6, 8.8], [12, 3.4], [21.4, 8.8], [21.4, 21.4]]), { ashlar: { h: 2.3, w: 3.2, y0: 8.6, y1: 21.4 } }),
    g.gilt(g.stroke([[1.8, 9.6], [12, 3.6], [22.2, 9.6]], 1.8)),
    ...g.rose(12, 8.4, 2, 'c3', { n: 6, frame: 0.7 }),
    ...g.pane(g.rr(6.4, 12, 17.6, 21.4, [1.2, 1.2, 0, 0]), 'c2', { frame: 1.1, tracery: [[[6, 15], [18, 15]], [[6, 18], [18, 18]]], plate: 'A' }),
  ],
  // a chalice: gilt bowl filled with ruby wine, gilt stem with a jewelled knop
  wine: (icon, g) => {
    const bowl = g.path('M6.2 2.4 H17.8 C18.8 6 18.8 8.6 17.2 11.2 C15.9 13.2 14.1 14.2 12 14.2 C9.9 14.2 8.1 13.2 6.8 11.2 C5.2 8.6 5.2 6 6.2 2.4 Z')
    const inner = g.shrink(bowl, 1.1)
    return [
      g.gilt(g.union(g.seg(12, 13.6, 12, 20.8, 1.9), g.rr(7.4, 20, 16.6, 21.8, 0.9))),
      ...boss(g, 12, 17.2, 1.5, 'c1'),
      g.gilt(bowl),
      g.glass(inner, 'c1', { outline: 0.3, glow: 0.3, tracery: [[[4, 6.6], [20, 6.6]]] }),
    ]
  },
  // a gilt wrench pierced by a quatrefoil
  wrench: (icon, g) => [
    g.gilt(g.path('M6.87 20.32 L11.55 15.64 A1.5 1.5 0 0 1 13.02 15.26 A6.25 6.25 0 0 0 20.88 8.02 L15.75 10.98 A2 2 0 0 1 13.75 7.52 L18.88 4.56 A6.25 6.25 0 0 0 8.74 10.98 A1.5 1.5 0 0 1 8.36 12.45 L3.68 17.13 A2.25 2.25 0 0 0 6.87 20.32 Z')),
    g.recess(g.foil(5.4, 18.6, 1.2, 4, -45), { outline: 0.15, glow: 'c3' }),
    g.glass(g.ngon(9.9, 14.1, 1.1, 4, -45), 'c1', { outline: 0.25, glint: false }),
  ],
  // END-R
}
