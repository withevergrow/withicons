// GOTHIC hand redraws, chunk 1 of 5 (owned by the chunk-1 redrawer): icons 1-100 of `ls forge/icons`
// (accessibility .. circle-arrow-down). Map icon name -> (icon, g) => parts, built with the frozen kit g
// (see forge/styles/GOTHIC-GUIDE.md). Names listed in EXEMPLAR (arrow-right, bell, calendar, camera,
// check) are ignored here.
//
// Shared vocabulary with the other chunks: gilt spear heads pierced by a ruby glass trefoil, jewelled
// quatrefoil knobs closing a shaft, mitred spear chevrons, stone lintels with glass inlays, glass
// chips with a gilt textura initial. Ashlar coursing only on built masses (buildings, the calendar
// and camera families); objects are smooth carved stone.

// ---- local helpers -----------------------------------------------------------
const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
// rotate local points (x along the direction ang, y across) and place them at (ox, oy)
const place = (pts, ox, oy, ang) => {
  const c = Math.cos(ang * RAD), s = Math.sin(ang * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
const rot = (ox, oy, x, y, ang) => place([[x, y]], ox, oy, ang)[0]
// a path string from a list of [cmd, ...points] in local coordinates
const pathOf = (cmds, ox, oy, ang) => cmds.map(([k, ...pts]) => k + place(pts, ox, oy, ang).map(p => p.join(' ')).join(' ')).join(' ')

// the ogival spear head of the arrow-right exemplar (tip at the origin, pointing +x), scale s
const HEAD = s => [
  ['M', [0, 0]],
  ['C', [-3.2 * s, -1.2 * s], [-6.2 * s, -3.6 * s], [-8.6 * s, -7.2 * s]],
  ['C', [-7.8 * s, -4.4 * s], [-7.6 * s, -2 * s], [-7.8 * s, 0]],
  ['C', [-7.6 * s, 2 * s], [-7.8 * s, 4.4 * s], [-8.6 * s, 7.2 * s]],
  ['C', [-6.2 * s, 3.6 * s], [-3.2 * s, 1.2 * s], [0, 0]],
  ['Z'],
]
// the head, pierced by a ruby glass trefoil
function head(g, tx, ty, ang, s = 1, o = {}) {
  const [c] = place([[-5 * s, 0]], tx, ty, ang)
  const plate = o.plate || 'K'
  return [
    g.gilt(g.path(pathOf(HEAD(s), tx, ty, ang)), { plate }),
    g.glass(g.foil(c[0], c[1], 1.4 * s + 0.15, 3, ang + 180), o.role || 'c1', { outline: 0.2, glint: false, glow: 0.34, plate }),
  ]
}
// a jewelled terminal: a gilded quatrefoil knob set with a glass bead (the stud end of a bar)
const knob = (g, x, y, role = 'c1', R = 1.9, plate = 'K') => [
  g.gilt(g.foil(x, y, R, 4, -45), { plate, glint: false }),
  g.glass(g.circle(x, y, R * 0.42), role, { outline: 0.22, glint: false, glow: 0.32, plate }),
]
// a gilded arrow from the tail (x0, y0) to the tip (x1, y1): shaft, spear head, knob at the tail
function arrow(g, x0, y0, x1, y1, s = 1, o = {}) {
  const ang = Math.atan2(y1 - y0, x1 - x0) / RAD
  const L = Math.hypot(x1 - x0, y1 - y0)
  const [e] = place([[L - 6 * s, 0]], x0, y0, ang)
  return [
    g.gilt(g.seg(x0, y0, e[0], e[1], o.w ?? 2.6), { plate: o.plate }),
    o.tail === false ? null : knob(g, x0, y0, 'c1', o.tailR ?? 2, o.plate),
    ...head(g, x1, y1, ang, s, o),
  ]
}
// a jewelled boss: a gilt ring round a glass roundel
const boss = (g, cx, cy, r = 2.2, role = 'c1', plate = 'K') => [
  g.gilt(g.circle(cx, cy, r), { plate, glint: false }),
  g.glass(g.circle(cx, cy, r - 0.7), role, { plate, outline: 0.25, glow: 0.3 }),
]
// a spear chevron: two arms of width w meeting in a mitred point at (ax, ay) pointing ang, each
// arm d back and d out; the point is drawn out by `tip` (an ogee spear point)
function spearPts(ax, ay, a, d = 4, w = 2.4, tip = 0.7) {
  const h = w / 2, L = Math.hypot(d, d), ox = h * d / L, oy = h * d / L, m = h * L / d
  return [[-d + ox, -d - oy], [m + tip, 0], [-d + ox, d + oy], [-d - ox, d - oy], [-m, 0], [-d - ox, -d + oy]].map(([x, y]) => rot(ax, ay, x, y, a))
}
// a gilded spear chevron with ball terminals and a ruby glass trefoil stud in the point
function chevron(g, ax, ay, ang, d = 6, o = {}) {
  const w = o.w ?? 2.6, plate = o.plate || 'K'
  const ends = [rot(ax, ay, -d, -d, ang), rot(ax, ay, -d, d, ang)]
  const [kx, ky] = rot(ax, ay, -1.2, 0, ang)
  return [
    g.gilt(g.union(g.poly(spearPts(ax, ay, ang, d, w, o.tip ?? 1.3)), ...ends.map(([x, y]) => g.circle(x, y, w * 0.6))), { plate }),
    g.glass(g.foil(kx, ky, o.kr ?? 1.6, 3, ang), o.role || 'c1', { outline: 0.24, glint: false, glow: 0.34, plate }),
  ]
}
// a stone pinnacle post (the stop bar of chevron-first/last): shaft with a lancet light, a capital,
// a spire and a fleur finial, on a plinth
function post(g, cx, role = 'c2') {
  const w = 3
  return [
    g.stone(g.union(g.rr(cx - w / 2, 8.2, cx + w / 2, 19.4, 0.3), g.spire(cx, 8.2, 4.2, w + 0.6), g.rr(cx - w / 2 - 0.7, 19, cx + w / 2 + 0.7, 21.4, 0.5), g.rr(cx - w / 2 - 0.5, 7.6, cx + w / 2 + 0.5, 9, 0.3)), { thin: true }),
    g.glass(g.lancet(cx - 0.7, 10.2, cx + 0.7, 17.8, 1), role, { outline: 0.28, glint: false, glow: 0.3 }),
    g.finial(cx, 4.4, 0.62, { plate: 'deco' }),
  ]
}
// a stone lintel resting on quarter-round corbels at x0..x1, centred on y; with a role it carries a
// lancet inlay of glass divided by leads, without one it shows block joints
function lintel(g, x0, y, x1, role, o = {}) {
  const h = o.h ?? 2.3, t = y - h / 2, b = y + h / 2, c = o.c ?? 1.5
  const F = g.union(
    g.rr(x0, t, x1, b, 0.35),
    g.path(`M${x0} ${f1(b - 0.2)} V${f1(b + 1)} A${c} ${f1(c + 0.2)} 0 0 0 ${f1(x0 + c)} ${f1(b - 0.2)} Z`),
    g.path(`M${x1} ${f1(b - 0.2)} V${f1(b + 1)} A${c} ${f1(c + 0.2)} 0 0 1 ${f1(x1 - c)} ${f1(b - 0.2)} Z`),
  )
  const joints = []
  if (!role) { const n = Math.max(2, Math.round((x1 - x0) / 4.4)); for (let k = 1; k < n; k++) { const x = f1(x0 + (x1 - x0) * k / n); joints.push([[x, t - 1], [x, b + 1]]) } }
  const out = [g.stone(F, { thin: true, ticks: joints, plate: o.plate })]
  if (role) {
    const a = x0 + 1.7, z = x1 - 1.7, hh = 0.56
    out.push(g.glass(g.poly([[a, y], [a + 0.9, y - hh], [z - 0.9, y - hh], [z, y], [z - 0.9, y + hh], [a + 0.9, y + hh]]), role, { outline: 0.3, glint: false, glow: 0.3, dark: 0, plate: o.plate }))
    const n = Math.max(1, Math.round((z - a) / 3.4)), L = []
    for (let k = 1; k < n; k++) { const x = f1(a + (z - a) * k / n); L.push([[x, y - 0.8], [x, y + 0.8]]) }
    if (L.length) out.push(g.lead(L, { w: 0.3, op: 0.9, plate: o.plate }))
  }
  return out
}
// the four rows of an align-* icon: [x0, x1] per row, sapphire inlays in rows 1 and 3
const alignRows = (g, rows) => rows.map(([x0, x1], i) => lintel(g, x0, 4.2 + i * 4.8, x1, i % 2 ? null : 'c2'))
// a cabochon jewel in a gilded bezel
const jewel = (g, cx, cy, r, role = 'c1', o = {}) => [
  g.gilt(g.circle(cx, cy, r), { glint: false, thin: true, plate: o.plate }),
  g.glass(g.circle(cx, cy, r - (o.bezel ?? 0.6)), role, { outline: 0.22, glint: r > 1.4, glow: 0.3, plate: o.plate }),
]
// an illuminated initial: a glass chip in a small stone frame, gilt studs at the corners
// (the build of the text-format family in the other chunks)
function chip(g, role = 'c2') {
  const k = 1.75
  return [
    ...g.pane(g.rr(2.2, 2.2, 21.8, 21.8, 2.2), role, { frame: 1.25, tracery: 'none', glass: { dark: 0.5, glow: 0.1, glint: false } }),
    g.studs([[2.2 + k, 2.2 + k], [21.8 - k, 2.2 + k], [2.2 + k, 21.8 - k], [21.8 - k, 21.8 - k]], 0.42),
  ]
}
// a textura (blackletter) B: a lozenge-cut stem, broken angular bowls, hairline bars
const TEXTURA_B = 'M7.6 6.6 L9.2 5 L10.4 5.9 V5.2 H14.4 L16.4 7 V9.6 L14.8 11.1 L17 12.6 V16.6 L14.8 18.8 H10.4 V18 L9.2 18.9 L7.6 17.4 Z M10.6 6.6 V10.3 H13.4 L14.1 9.5 V7.3 L13.4 6.6 Z M10.6 12 V17.4 H14.1 L14.8 16.6 V12.8 L14.1 12 Z'
// round stone surround glazed as a rose window, its centre clear for a glyph (the circle-* family)
const rays = (cx, cy, r0, r1, n, a0 = -90) => Array.from({ length: n }, (_, k) => {
  const a = (a0 + 360 * k / n) * RAD
  return [[f1(cx + r0 * Math.cos(a)), f1(cy + r0 * Math.sin(a))], [f1(cx + r1 * Math.cos(a)), f1(cy + r1 * Math.sin(a))]]
})
const arcsOf = (cx, cy, r, a0, a1, n = 12) => Array.from({ length: n + 1 }, (_, k) => { const a = (a0 + (a1 - a0) * k / n) * RAD; return [f1(cx + r * Math.cos(a)), f1(cy + r * Math.sin(a))] })
const ringArcs = (cx, cy, r) => [0, 90, 180, 270].map(a => arcsOf(cx, cy, r, a, a + 90))
function roundel(g, role = 'c2', n = 16) {
  const cx = 11.8, cy = 11.8, R = 9.6, w = 1.8, ri = R - w - 2.1
  return [
    g.stone(g.rim(g.circle(cx, cy, R), w), { ticks: rays(cx, cy, R - w - 0.5, R + 0.5, 12, -75) }),
    g.glass(g.circle(cx, cy, R - w + 0.05), role, { tracery: [...ringArcs(cx, cy, ri), ...rays(cx, cy, ri, R, n, -90 + 180 / n)], dark: 0.36, glow: 0.14 }),
  ]
}

// the exemplar calendar's tablet and header, and its gilded rings (painted last, A)
const calTablet = g => [
  g.stone(g.rr(3, 4.8, 21, 21.2, 2), { ashlar: { h: 2.4, w: 3, y0: 9.6, y1: 21.2 } }),
  g.glass(g.rr(4.6, 6.3, 19.4, 9.3, [1, 1, 0, 0]), 'c1', { outline: 0.4 }),
]
const calRings = g => [g.gilt(g.union(g.rr(6.6, 2.4, 8.6, 7.2, 1), g.rr(15.4, 2.4, 17.4, 7.2, 1)), { plate: 'A', thin: true })]

// the bell exemplar: its belfry lancet (ground, it never swings) and its bell
const belfry = g => g.ground(g.pane(g.lancet(3, 2.2, 21, 21.2, 0.9), 'c2', { frame: 1.6, tracery: 'none', glass: { dark: 0.45, glow: 0.1 } }))
const BELL = 'M7 16.6 C7 13 7.4 7.6 12 7.6 C16.6 7.6 17 13 17 16.6 L18.4 18.2 H5.6 Z'

// an organ pipe: a gilt (tin) body with a pointed mouth of ruby glass, a conical foot
function pipe(g, x, y0, y1, plate = 'K', w = 2.7) {
  const my = y1 - 4.6
  return [
    g.gilt(g.union(g.rr(x - w / 2, y0, x + w / 2, my + 1.6, [0.5, 0.5, 0, 0]), g.poly([[x - w / 2, my + 1.5], [x + w / 2, my + 1.5], [x + 0.45, y1], [x - 0.45, y1]])), { glint: false, plate }),
    g.glass(g.lancet(x - 0.75, my - 1, x + 0.75, my + 0.5, 1), 'c1', { outline: 0.22, glint: false, glow: 0.3, plate }),
  ]
}
// the heartbeat polyline of activity
const PULSE = [[3.4, 12], [6.4, 12], [9.5, 4.6], [14.5, 19.4], [17.6, 12], [20.6, 12]]

// ---- the redraws ---------------------------------------------------------------
export const R = {
  // ===== arrows: gilded shafts closed by a jewelled knob, ogival heads pierced by a ruby trefoil
  'arrow-left': (icon, g) => arrow(g, 19.6, 12, 2.4, 12),
  'arrow-up': (icon, g) => arrow(g, 12, 19.6, 12, 2.4),
  'arrow-down': (icon, g) => arrow(g, 12, 4.4, 12, 21.6),
  'arrow-up-right': (icon, g) => arrow(g, 4.6, 19.4, 20.2, 3.8, 0.88),
  'arrow-up-left': (icon, g) => arrow(g, 19.4, 19.4, 3.8, 3.8, 0.88),
  'arrow-down-right': (icon, g) => arrow(g, 4.6, 4.6, 20.2, 20.2, 0.88),
  'arrow-down-left': (icon, g) => arrow(g, 19.4, 4.6, 3.8, 20.2, 0.88),
  // two full spear heads on one short shaft
  'arrow-left-right': (icon, g) => [
    g.gilt(g.seg(8, 12, 16, 12, 2.6)),
    ...head(g, 2.2, 12, 180, 0.95), ...head(g, 21.8, 12, 0, 0.95),
  ],
  'arrow-up-down': (icon, g) => [
    g.gilt(g.seg(12, 8, 12, 16, 2.6)),
    ...head(g, 12, 2.2, -90, 0.95), ...head(g, 12, 21.8, 90, 0.95),
  ],
  // the circle-* family: a stone rose-window roundel, a gilded arrow descending through it (A)
  'circle-arrow-down': (icon, g) => [
    ...roundel(g, 'c2'),
    g.gilt(g.seg(11.8, 7, 11.8, 12.5, 2.3), { plate: 'A' }),
    ...head(g, 11.8, 16.8, 90, 0.72, { plate: 'A' }),
  ],

  // ===== chevrons: mitred gilt spears, a ruby trefoil stud in the point, ball terminals
  'chevron-right': (icon, g) => chevron(g, 15.2, 12, 0, 6.2),
  'chevron-left': (icon, g) => chevron(g, 8.8, 12, 180, 6.2),
  'chevron-up': (icon, g) => chevron(g, 12, 8.8, -90, 6.2),
  'chevron-down': (icon, g) => chevron(g, 12, 15.2, 90, 6.2),
  'chevrons-right': (icon, g) => [...chevron(g, 12.2, 12, 0, 5.6, { plate: 'A', role: 'c2' }), ...chevron(g, 19, 12, 0, 5.6)],
  'chevrons-left': (icon, g) => [...chevron(g, 11.8, 12, 180, 5.6, { plate: 'A', role: 'c2' }), ...chevron(g, 5, 12, 180, 5.6)],
  'chevrons-up': (icon, g) => [...chevron(g, 12, 11.8, -90, 5.6, { plate: 'A', role: 'c2' }), ...chevron(g, 12, 5, -90, 5.6)],
  'chevrons-down': (icon, g) => [...chevron(g, 12, 12.2, 90, 5.6, { plate: 'A', role: 'c2' }), ...chevron(g, 12, 19, 90, 5.6)],
  'chevrons-up-down': (icon, g) => [...chevron(g, 12, 3.4, -90, 5.2), ...chevron(g, 12, 20.6, 90, 5.2)],
  // a chevron stopped by a stone pinnacle post
  'chevron-first': (icon, g) => [...post(g, 5.4), ...chevron(g, 11.6, 12, 180, 5.8)],
  'chevron-last': (icon, g) => [...post(g, 18.6), ...chevron(g, 12.4, 12, 0, 5.8)],

  // ===== text alignment: stone lintels on corbels, sapphire lancet inlays in alternate courses
  'align-left': (icon, g) => alignRows(g, [[2.6, 21.4], [2.6, 15.4], [2.6, 21.4], [2.6, 15.4]]),
  'align-right': (icon, g) => alignRows(g, [[2.6, 21.4], [8.6, 21.4], [2.6, 21.4], [8.6, 21.4]]),
  'align-center': (icon, g) => alignRows(g, [[2.6, 21.4], [5.6, 18.4], [2.6, 21.4], [5.6, 18.4]]),
  'align-justify': (icon, g) => alignRows(g, [[2.6, 21.4], [2.6, 21.4], [2.6, 21.4], [2.6, 21.4]]),

  // ===== text: an illuminated textura initial in gilt on a glass chip
  bold: (icon, g) => [...chip(g, g.mainRole(icon)), g.gilt(g.union(g.path(TEXTURA_B), g.ngon(5.8, 12, 1.1, 4, -90), g.seg(5.8, 12, 7.8, 12, 0.8)))],

  // ===== glyphs that were plain tubes
  // a pulse forged as a gilt wrought-iron bar: trefoil terminals, a ruby bead at the peak
  activity: (icon, g) => [
    g.gilt(g.union(g.stroke(PULSE, 2.4), g.foil(2.6, 12, 1.8, 3, 180), g.foil(21.4, 12, 1.8, 3, 0))),
    ...jewel(g, 9.5, 5, 2, 'c1', { plate: 'A' }),
  ],
  // organ pipes: gilt pipes with pointed ruby mouths and conical feet
  'audio-lines': (icon, g) => [[4, 8.6, 15.4, 'A'], [8, 5.4, 18.6, 'K'], [12, 2.4, 21.6, 'K'], [16, 6.6, 17.4, 'K'], [20, 8.6, 15.4, 'A']].map(([x, t, b, pl]) => pipe(g, x, t, b, pl)),
  // a chart line as a heavy gilt bar threaded with ruby jewels, on a stone axis
  'chart-line': (icon, g) => [
    g.stone(g.stroke('M3.6 3.4 V18.4 A2 2 0 0 0 5.6 20.4 H20.8', 2.2), { ticks: [[[2, 9], [5, 9]], [[2, 14], [5, 14]], [[12, 19], [12, 22]]] }),
    g.gilt(g.stroke([[7.6, 15.6], [11.4, 10], [15, 13.6], [20.2, 6.2]], 2.6), { plate: 'A' }),
    ...jewel(g, 11.4, 10, 1.9, 'c1', { plate: 'A' }),
    ...jewel(g, 15, 13.6, 1.9, 'c1', { plate: 'A' }),
  ],

  // ===== roundels and alerts
  // a ruby roundel in a stone ring, a ring of lead, a gilded exclamation
  'alert-circle': (icon, g) => [
    ...roundel(g, 'c1', 12),
    g.gilt(g.union(g.seg(11.8, 6.8, 11.8, 12.6, 2.6), g.circle(11.8, 16.6, 1.6)), { plate: 'A' }),
  ],
  // a carved stone gable (jointed raking courses) round gold glass, a ruby lancet bang, a fleur finial
  'alert-triangle': (icon, g) => {
    const T = g.path('M10.3 4.6 A2 2 0 0 1 13.7 4.6 L21.4 18 A2 2 0 0 1 19.7 21 H4.3 A2 2 0 0 1 2.6 18 Z')
    return [
      g.stone(g.rim(T, 2), { ticks: [[[7, 9], [9.4, 10.4]], [[17, 9], [14.6, 10.4]], [[4.6, 14], [7.2, 15.4]], [[19.4, 14], [16.8, 15.4]], [[8, 18.6], [8, 21.4]], [[16, 18.6], [16, 21.4]]] }),
      g.glass(g.shrink(T, 2), 'c3', { tracery: [[[12, 6], [12, 22]]], glow: 0.2 }),
      g.glass(g.union(g.lancet(10.6, 8.6, 13.4, 15, 1.3), g.circle(12, 17.4, 1.45)), 'c1', { outline: 0.4, glint: false, glow: 0.35, plate: 'A' }),
      g.finial(12, 3.8, 0.7, { plate: 'deco' }),
    ]
  },
  // an emerald roundel, a gilded check
  'check-circle': (icon, g) => [
    ...roundel(g, 'c4', 12),
    g.gilt(g.stroke([[7.4, 12.2], [10.5, 15.4], [16.4, 8.8]], 2.6), { plate: 'A' }),
  ],
  // an emerald pane in a stone frame with gilt corner studs, a gilded check
  'check-square': (icon, g) => [
    ...g.pane(g.rr(3, 3, 21, 21, 2.2), 'c4', { frame: 1.7, tracery: 'none' }),
    g.studs([[5.6, 5.6], [18.4, 5.6], [5.6, 18.4], [18.4, 18.4]], 0.5),
    g.gilt(g.stroke([[7.6, 12.4], [10.7, 15.6], [16.6, 9]], 2.6), { plate: 'A' }),
  ],
  // two checks of glass in carved stone, the second gold
  'check-check': (icon, g) => [
    ...g.pane(g.stroke([[11.6, 16.4], [12.6, 17.4], [21.2, 7.4]], 3.6), 'c3', { frame: 1.1, tracery: 'none', plate: 'A' }),
    ...g.pane(g.stroke([[2.6, 12.8], [6.6, 17], [15.6, 7.2]], 3.6), 'c4', { frame: 1.1, tracery: 'none' }),
  ],
  // a ban: stone ring, ruby glass annulus, a deep sapphire field crossed by a gilded bar
  ban: (icon, g) => [
    g.stone(g.rim(g.circle(12, 12, 9.6), 1.3)),
    g.glass(g.rim(g.circle(12, 12, 8.3), 1.9), 'c1', { tracery: 'none', glint: false }),
    g.glass(g.circle(12, 12, 6.4), 'c2', { tracery: 'none', deep: 0.3, outline: 0.3 }),
    g.gilt(g.seg(6.2, 6.2, 17.8, 17.8, 2.6), { plate: 'S' }),
  ],
  // a sapphire roundel with a gilded figure, arms wide
  accessibility: (icon, g) => [
    ...roundel(g, 'c2', 12),
    g.gilt(g.union(g.circle(11.8, 6.9, 1.5), g.seg(7.2, 10.3, 16.4, 10.3, 1.8), g.seg(11.8, 10.3, 11.8, 13.8, 2), g.stroke([[9.2, 17.2], [11.8, 13.8], [14.4, 17.2]], 1.8)), { plate: 'A' }),
  ],
  // a gargoyle: carved stone head with horns, ruby eyes glowing, iron brows, a fanged maw
  angry: (icon, g) => [
    g.stone(g.union(g.path('M6.8 7.6 C5.4 6.6 4.4 5 4.4 2.6 C6 3.6 7.6 4.6 9.2 5.8 Z'), g.path('M17.2 7.6 C18.6 6.6 19.6 5 19.6 2.6 C18 3.6 16.4 4.6 14.8 5.8 Z')), { thin: true }),
    g.stone(g.union(g.circle(12, 11.4, 7.8), g.rr(4.4, 11, 19.6, 21, [0, 0, 4.2, 4.2]))),
    g.iron(g.union(g.poly([[5.6, 8.2], [11.2, 10.6], [11, 12], [5.4, 9.8]]), g.poly([[18.4, 8.2], [12.8, 10.6], [13, 12], [18.6, 9.8]]))),
    g.glass(g.union(g.poly([[6.4, 11], [10.2, 12.4], [9.6, 13.8], [7.4, 13.6]]), g.poly([[17.6, 11], [13.8, 12.4], [14.4, 13.8], [16.6, 13.6]])), 'c1', { outline: 0.35, glow: 0.45, glint: false, plate: 'A' }),
    g.recess(g.path('M6.6 16.6 C9 15.4 15 15.4 17.4 16.6 L16.6 19.6 C14 18.8 10 18.8 7.4 19.6 Z'), { glow: 'c1', glowOp: 0.45, plate: 'A' }),
    g.stone(g.union(g.poly([[8.4, 16], [10, 16], [9.2, 18.4]]), g.poly([[14, 16], [15.6, 16], [14.8, 18.4]])), { thin: true, outline: 0.25, plate: 'A' }),
    g.recess(g.union(g.circle(11, 14.6, 0.5), g.circle(13, 14.6, 0.5)), { outline: 0 }),
  ],
  // a rosette medal: gold rose window over two ruby ribbon tails
  award: (icon, g) => [
    ...g.pane(g.poly([[8.4, 13], [6.6, 21.6], [12, 19.6], [17.4, 21.6], [15.6, 13]]), 'c1', { frame: 1, tracery: [[[12, 13], [12, 20]]], plate: 'A' }),
    ...g.rose(12, 9, 6.8, 'c3', { n: 12, frame: 1.5, medal: 'c1' }),
  ],
  // a seal of emerald glass in a scalloped stone rim, a gilded check
  'badge-check': (icon, g) => [
    ...g.pane(g.union(g.foil(12, 12, 9.8, 8, -90), g.circle(12, 12, 7.6)), 'c4', { frame: 1.6, tracery: 'none' }),
    g.gilt(g.stroke([[8, 12.4], [10.9, 15.3], [16.2, 9.4]], 2.6), { plate: 'A' }),
  ],
  'badge-percent': (icon, g) => [
    ...g.pane(g.union(g.foil(12, 12, 9.8, 8, -90), g.circle(12, 12, 7.6)), 'c1', { frame: 1.6, tracery: 'none' }),
    g.gilt(g.union(g.seg(15.6, 8.4, 8.4, 15.6, 2), g.ring(9, 9, 1.3, 1.4), g.ring(15, 15, 1.3, 1.4)), { plate: 'A' }),
  ],
  // an illuminated @: gilded stroke round a ruby glass bowl
  'at-sign': (icon, g) => [
    g.glass(g.circle(12, 12, 3.3), 'c1', { outline: 0.3 }),
    g.gilt(g.union(g.ring(12, 12, 4, 2.2), g.stroke('M16 8 V13.5 A2.75 2.75 0 0 0 21.5 13.5 V12 A9.5 9.5 0 1 0 16.46 20.39', 2.3))),
  ],
  // three gilded orbits round a ruby boss, sapphire jewels riding them
  atom: (icon, g) => {
    const orbit = a => place(g.circlePts(0, 0, 1, 72).map(([x, y]) => [x * 9.6, y * 3.7]), 12, 12, a)
    return [
      g.gilt(g.stroke([orbit(0), orbit(60), orbit(120)], 1.5, true), { thin: true, glint: false }),
      g.glass(g.union(...place([[9.6, 0]], 12, 12, 60).concat(place([[-9.6, 0]], 12, 12, 120), place([[0, 3.7]], 12, 12, 0)).map(([x, y]) => g.circle(x, y, 1.15))), 'c2', { outline: 0.35, glint: false, plate: 'A' }),
      ...boss(g, 12, 12, 2.5),
    ]
  },

  // ===== objects
  // a bound codex: ruby cover in a stone frame, a saint in gold glass, gilded tabs
  'address-book': (icon, g) => [
    g.gilt(g.union(g.rr(17, 6, 20.6, 8, 0.9), g.rr(17, 11, 20.6, 13, 0.9), g.rr(17, 16, 20.6, 18, 0.9)), { thin: true, plate: 'A', glint: false }),
    ...g.pane(g.rr(3.4, 2.5, 18.6, 21.5, 2), 'c1', { frame: 1.6, tracery: 'none', glass: { dark: 0.4 } }),
    g.glass(g.circle(11, 8.6, 2.3), 'c3', { outline: 0.4, plate: 'A' }),
    g.glass(g.lancet(7.2, 12.6, 14.8, 17.8, 0.75), 'c3', { outline: 0.4, plate: 'A', glint: false }),
  ],
  // a clock as a rose window: twelve spokes for the hours, gilded hands, gilded bells and feet
  'alarm-clock': (icon, g) => [
    g.gilt(g.union(g.seg(7.2, 17.8, 4.8, 20.6, 1.7), g.seg(16.8, 17.8, 19.2, 20.6, 1.7)), { thin: true }),
    g.gilt(g.union(g.path('M2.8 7.4 A3 3 0 0 1 7.4 2.8 Z'), g.path('M16.6 2.8 A3 3 0 0 1 21.2 7.4 Z')), { plate: 'A' }),
    g.stone(g.ring(12, 12.6, 7.9, 1.6)),
    g.glass(g.circle(12, 12.6, 7.1), 'c2', { tracery: 'rose', n: 12, medal: 'c3', at: { c: [12, 12.6], r: 7.1 }, glint: false }),
    g.gilt(g.stroke([[12, 7.6], [12, 12.6], [15.2, 14.6]], 1.6), { plate: 'A', thin: true }),
  ],
  // a carriage of smooth carved stone: sapphire cab light, a ruby cross in gilt, rose-window wheels
  ambulance: (icon, g) => [
    g.stone(g.path('M2.4 6 A2 2 0 0 1 4.4 4 H14 L18.4 9.8 H19.8 A1.8 1.8 0 0 1 21.6 11.6 V16.4 A1.6 1.6 0 0 1 20 18 H4 A1.6 1.6 0 0 1 2.4 16.4 Z')),
    g.gilt(g.rr(2.6, 13.6, 21.4, 14.6, 0), { thin: true, glint: false, outline: 0.3 }),
    g.glass(g.poly([[14.4, 6], [17.2, 9.8], [14.4, 9.8]]), 'c2', { outline: 0.4, glint: false }),
    g.gilt(g.glyph('plus', 8.2, 9.4, 0.95, 3.4), { glint: false }),
    g.glass(g.glyph('plus', 8.2, 9.4, 0.86, 1.9), 'c1', { outline: 0, glow: 0.3 }),
    ...g.rose(7, 18, 2.6, 'c3', { n: 6, frame: 0.9, plate: 'A' }),
    ...g.rose(17.4, 18, 2.6, 'c3', { n: 6, frame: 0.9, plate: 'A' }),
  ],
  // a gilded anchor with fleur flukes, its ring set with sapphire
  anchor: (icon, g) => [
    g.gilt(g.union(
      g.seg(12, 7.6, 12, 20.4, 2.4), g.seg(7.4, 11.2, 16.6, 11.2, 2.2),
      g.stroke('M5 14.6 A7 7 0 0 0 19 14.6', 2.3),
      g.path('M2.6 17.4 L5 12.8 L7.4 17.4 Q5 15.8 2.6 17.4 Z'), g.path('M16.6 17.4 L19 12.8 L21.4 17.4 Q19 15.8 16.6 17.4 Z'),
    )),
    g.gilt(g.ring(12, 5, 2.3, 1.7), { plate: 'A' }),
    g.glass(g.circle(12, 5, 1.45), 'c2', { plate: 'A', outline: 0.25, glint: false }),
    g.glass(g.circle(12, 11.2, 1.1), 'c1', { outline: 0.3, glint: false }),
  ],
  // a stone window: a carved header with three jewels, a sapphire quarry light
  'app-window': (icon, g) => [
    g.stone(g.rr(2.5, 4, 21.5, 20, 2.2), { ticks: [[[16.6, 3], [16.6, 9.6]]] }),
    g.glass(g.rr(4.1, 10.2, 19.9, 18.4, [0.4, 0.4, 1.2, 1.2]), 'c2', { tracery: 'quarry', medallion: false, s: 2.6, deep: 0.08 }),
    g.glass(g.circle(6.2, 7, 1.05), 'c1', { outline: 0.35, glint: false, plate: 'A' }),
    g.glass(g.circle(9.6, 7, 1.05), 'c3', { outline: 0.35, glint: false, plate: 'A' }),
    g.glass(g.circle(13, 7, 1.05), 'c4', { outline: 0.35, glint: false, plate: 'A' }),
  ],
  // a ruby apple with leaded seams, gilded stem, emerald leaf
  apple: (icon, g) => [
    g.gilt(g.stroke('M12 10 C12 8 11.6 5.6 10.6 3.6', 1.6), { thin: true, plate: 'A' }),
    g.glass(g.path('M12.6 5.6 C13 3.6 15 2.6 17.6 2.6 C17.1 4.6 15 6.1 12.6 5.6 Z'), 'c4', { outline: 0.4, plate: 'A', tracery: [[[12.6, 5.6], [17.4, 2.8]]] }),
    ...g.pane(g.path('M12 10 C14.5 7.5 20 8 20 13.5 C20 18 17 21.5 14.5 21.5 C13.5 21.5 13 21 12 21 C11 21 10.5 21.5 9.5 21.5 C7 21.5 4 18 4 13.5 C4 8 9.5 7.5 12 10 Z'), 'c1', { frame: 1.5, tracery: [[[12, 9], [12, 22]], [[8, 9], [8.6, 13], [8, 22]], [[16, 9], [15.4, 13], [16, 22]]] }),
  ],
  // a reliquary chest: carved stone lid with gilt studs, sapphire body in lancet lights, a gilt-framed slot
  archive: (icon, g) => [
    ...g.pane(g.rr(4.4, 7.6, 19.6, 20.6, [0, 0, 2, 2]), 'c2', { frame: 1.4, tracery: 'lancet', glass: { s: 2.4 } }),
    g.gilt(g.rr(9.2, 11.4, 14.8, 13.8, 1.2), { thin: true }),
    g.recess(g.rr(10.2, 12.1, 13.8, 13.1, 0.5), { outline: 0 }),
    g.stone(g.rr(2.8, 3.4, 21.2, 8.6, 1.5), { plate: 'A', ticks: [[[8.2, 2], [8.2, 10]], [[15.8, 2], [15.8, 10]]] }),
    g.studs([[5.4, 6], [12, 6], [18.6, 6]], 0.5, { plate: 'A' }),
  ],
  // a pilgrim's pack: ruby glass body, gilded handle and shoulder straps, a gold lancet-flap pocket
  backpack: (icon, g) => [
    g.gilt(g.stroke('M9.4 6.4 V4.6 A2 2 0 0 1 11.4 2.6 H12.6 A2 2 0 0 1 14.6 4.6 V6.4', 1.7), { plate: 'A', thin: true }),
    ...g.pane(g.path('M7 21.5 H17 A2 2 0 0 0 19 19.5 V11 A5 5 0 0 0 14 6 H10 A5 5 0 0 0 5 11 V19.5 A2 2 0 0 0 7 21.5 Z'), 'c1', { frame: 1.5, tracery: 'none' }),
    g.gilt(g.union(g.rr(7.2, 7.4, 8.6, 21.2, 0.4), g.rr(15.4, 7.4, 16.8, 21.2, 0.4)), { thin: true, glint: false, outline: 0.3 }),
    ...g.pane(g.lancet(8.2, 12.6, 15.8, 20.6, 0.8), 'c3', { frame: 1, tracery: 'none', plate: 'A' }),
    g.studs([[12, 13.8]], 0.55, { plate: 'A' }),
  ],
  // a ruby balloon leaded in gores, gilded knot and string
  balloon: (icon, g) => {
    const gore = k => Array.from({ length: 14 }, (_, i) => { const t = i / 13; return [12 + k * 4.4 * Math.sin(Math.PI * t), 2.4 + t * 13.2] })
    return [
      g.gilt(g.stroke('M12 17 C12 18.8 13.3 19.3 12.8 21.5', 1.2), { thin: true, plate: 'A', glint: false }),
      g.gilt(g.poly([[12, 15.4], [10.8, 17.2], [13.2, 17.2]]), { thin: true, outline: 0.35 }),
      ...g.pane(g.path('M12 15.5 C8.25 15.5 5.5 11.75 5.5 8.75 C5.5 5.1 8.4 2.5 12 2.5 C15.6 2.5 18.5 5.1 18.5 8.75 C18.5 11.75 15.75 15.5 12 15.5 Z'), 'c1', { frame: 1.3, tracery: [gore(-1), gore(0), gore(1)] }),
    ]
  },
  // a stone plaster with block joints, a ruby pad pierced by gilded studs
  bandage: (icon, g) => [
    g.stone(g.seg(6.6, 17.4, 17.4, 6.6, 8), { ticks: [[[5.8, 10.4], [10.4, 5.8]], [[13.6, 18.2], [18.2, 13.6]]] }),
    g.glass(g.poly([[12, 7.6], [16.4, 12], [12, 16.4], [7.6, 12]]), 'c1', { outline: 0.42, glint: false }),
    g.studs([[12, 10.2], [10.2, 12], [13.8, 12], [12, 13.8]], 0.42),
  ],
  // an emerald note in a stone frame, a gold rose medallion struck at the centre
  banknote: (icon, g) => [
    ...g.pane(g.rr(2.4, 5.5, 21.6, 18.5, 1.8), 'c4', { frame: 1.5, tracery: 'none', glass: { dark: 0.35 } }),
    g.studs([[6, 12], [18, 12]], 0.6),
    ...g.rose(12, 12, 3.5, 'c3', { n: 8, frame: 0.9, medal: 'c4', plate: 'A' }),
  ],
  // an arcade: stone shafts and glass lancets, read as a barcode
  barcode: (icon, g) => {
    const bars = [[2.4, 1.2], [4.5, 2.6], [8.1, 1.2], [10.3, 2.6], [13.9, 1.2], [16.1, 1.2], [18.3, 2.6]]
    return bars.map(([x, w]) => w < 2 ? g.stone(g.lancet(x, 4.4, x + w, 19.6, 1), { thin: true }) : g.glass(g.lancet(x, 4.4, x + w, 19.6, 1), x > 10 && x < 12 ? 'c3' : 'c2', { glint: false }))
  },
  // a gold glass ball, its seams carved stone ribs
  basketball: (icon, g) => [
    ...g.pane(g.circle(12, 12, 9.6), 'c3', { frame: 1.4, tracery: 'none', glass: { dark: 0.35 } }),
    g.stone(g.inter(g.union(g.seg(12, 2, 12, 22, 1.2), g.seg(2, 12, 22, 12, 1.2), g.stroke('M5.5 5 C8.5 8.5 8.5 15.5 5.5 19', 1.2), g.stroke('M18.5 5 C15.5 8.5 15.5 15.5 18.5 19', 1.2)), g.circle(12, 12, 8.6)), { thin: true, outline: 0.3, plate: 'A' }),
  ],
  // a carved basin: stone rim, sapphire water glass, gilded tap and feet
  bath: (icon, g) => [
    g.gilt(g.stroke('M5.2 11 V6.6 A2.4 2.4 0 0 1 10 6.6 V7.6', 1.7), { plate: 'A', thin: true }),
    g.gilt(g.union(g.seg(6.6, 18.4, 5.6, 20.6, 1.6), g.seg(17.4, 18.4, 18.4, 20.6, 1.6)), { thin: true }),
    ...g.pane(g.path('M3.6 11.4 V14 A5 5 0 0 0 8.6 19 H15.4 A5 5 0 0 0 20.4 14 V11.4 Z'), 'c2', { frame: 1.3, tracery: 'quarry', glass: { medallion: false, s: 2.4 } }),
    g.stone(g.rr(2.4, 10.4, 21.6, 12.8, 1)),
  ],
  // batteries: stone casing, glass cells in lancet panes, gilded terminal
  battery: (icon, g) => [
    g.gilt(g.rr(19, 10, 21.6, 14, 0.8), { thin: true }),
    g.stone(g.rr(2.4, 6.6, 19.2, 17.4, 2)),
    ...[5.4, 9.6, 13.8].map((x, i) => g.glass(g.lancet(x - 1.4, 8.4, x + 1.4, 15.6, 0.8), 'c4', { outline: 0.4, glint: false, plate: i ? 'K' : 'A' })),
  ],
  'battery-low': (icon, g) => [
    g.gilt(g.rr(19, 10, 21.6, 14, 0.8), { thin: true }),
    g.stone(g.rr(2.4, 6.6, 19.2, 17.4, 2)),
    g.recess(g.rr(4, 8.2, 17.6, 15.8, 1)),
    g.glass(g.lancet(4.2, 8.4, 7.2, 15.6, 0.8), 'c1', { outline: 0.4, glow: 0.35, glint: false, plate: 'A' }),
  ],
  'battery-charging': (icon, g) => [
    g.gilt(g.rr(19, 10, 21.6, 14, 0.8), { thin: true }),
    ...g.pane(g.rr(2.4, 6.6, 19.2, 17.4, 2), 'c2', { frame: 1.5, tracery: 'none' }),
    g.cut(g.grow(g.poly([[12.6, 3], [7.4, 12.6], [11, 12.6], [9.6, 21], [15, 11.2], [11.6, 11.2]]), 0.9)),
    g.gilt(g.poly([[12.6, 3], [7.4, 12.6], [11, 12.6], [9.6, 21], [15, 11.2], [11.6, 11.2]]), { plate: 'S' }),
  ],

  // a bed: a heavy carved headboard pierced by a sapphire lancet, a thick ruby coverlet, a gold pillow
  bed: (icon, g) => [
    g.stone(g.union(g.lancet(2.2, 3.2, 7.4, 20.8, 0.85), g.rr(18.4, 12.6, 21.6, 20.8, 0.6))),
    g.glass(g.lancet(3.6, 5.4, 6, 12.4, 0.85), 'c2', { outline: 0.3, glint: false, glow: 0.3 }),
    ...g.pane(g.rr(6.6, 12.4, 21.6, 18, [0, 1.8, 0.6, 0]), 'c1', { frame: 1.2, tracery: [[[11, 11], [11, 19]], [[15.6, 11], [15.6, 19]]] }),
    g.glass(g.rr(8, 8.6, 13.6, 12.6, 1.6), 'c3', { outline: 0.4, plate: 'A' }),
  ],
  // a tankard: gold glass ale, stone foam, gilded handle
  beer: (icon, g) => [
    g.gilt(g.stroke('M16 11.5 H18 A2 2 0 0 1 20 13.5 V16 A2 2 0 0 1 18 18 H16', 1.9), { plate: 'A' }),
    ...g.pane(g.path('M4 8.6 H16 V19.5 A2 2 0 0 1 14 21.5 H6 A2 2 0 0 1 4 19.5 Z'), 'c3', { frame: 1.4, tracery: [[[8, 12], [8, 22]], [[12, 12], [12, 22]]] }),
    g.stone(g.union(g.circle(5.8, 7.6, 2.4), g.circle(9.4, 5.6, 2.9), g.circle(13.6, 6, 2.6), g.circle(15.2, 8.4, 1.9), g.rr(4, 7.4, 16.6, 10.4, 1)), { plate: 'A' }),
  ],
  // the bell exemplar ringing: the belfry stays (ground), the iron hanger holds (K), the bell and
  // clapper swing (A), gilt ringing arcs in the spandrels outside the arch
  'bell-ring': (icon, g) => [
    ...belfry(g),
    g.deco(g.gilt(g.union(g.arc(12, 12, 9.8, 214, 238, 1.15), g.arc(12, 12, 9.8, -58, -34, 1.15)), { thin: true, outline: 0.3, glint: false })),
    g.iron(g.seg(12, 4.6, 12, 7, 0.9)),
    g.gilt(g.union(g.path(BELL), g.circle(12, 7.4, 1.3)), { plate: 'A' }),
    g.lead([[[8.6, 15.2], [15.4, 15.2]]], { role: 'shadow', w: 0.35, op: 0.45, plate: 'A' }),
    g.gilt(g.circle(12, 19.6, 1.5), { plate: 'A' }),
  ],
  'bell-off': (icon, g) => [
    ...belfry(g),
    g.iron(g.seg(12, 4.6, 12, 7, 0.9)),
    g.gilt(g.union(g.path(BELL), g.circle(12, 7.4, 1.3))),
    g.lead([[[8.6, 15.2], [15.4, 15.2]]], { role: 'shadow', w: 0.35, op: 0.45 }),
    g.gilt(g.circle(12, 19.6, 1.5), { plate: 'A' }),
    ...g.slash(3.4, 3.4, 20.6, 20.6),
  ],
  // a bicycle on rose-window wheels, gilded frame
  bike: (icon, g) => [
    ...g.rose(5.8, 16.2, 3.8, 'c2', { n: 8, frame: 1.1, plate: 'A' }),
    ...g.rose(18.2, 16.2, 3.8, 'c2', { n: 8, frame: 1.1, plate: 'A' }),
    g.gilt(g.union(g.stroke([[5.8, 16.2], [9, 10], [15, 10], [18.2, 16.2]], 1.5), g.stroke([[9, 10], [12, 16.2], [15, 10]], 1.5), g.seg(5.8, 16.2, 12, 16.2, 1.5), g.stroke([[15, 10], [13.6, 5.6], [16.2, 5.6]], 1.5), g.stroke([[9, 10], [8.6, 7.2]], 1.5), g.seg(7, 7, 10.2, 7, 1.6)), { thin: true }),
    g.glass(g.circle(12, 16.2, 1.2), 'c1', { outline: 0.35, glint: false }),
  ],
  // binoculars: stone barrels, rose-window lenses, a gilded bridge
  binoculars: (icon, g) => [
    g.gilt(g.rr(8.6, 9.8, 15.4, 12.2, 0.8), { plate: 'A', thin: true }),
    g.stone(g.union(g.path('M2.8 16.6 L4.2 6.6 A1 1 0 0 1 5.2 5.6 H7.2 A1 1 0 0 1 8.2 6.6 L9.6 16.6 Z'), g.path('M14.4 16.6 L15.8 6.6 A1 1 0 0 1 16.8 5.6 H18.8 A1 1 0 0 1 19.8 6.6 L21.2 16.6 Z')), { ticks: [[[3, 10], [10, 10]], [[14, 10], [21, 10]]] }),
    ...g.rose(6.1, 17, 3.7, 'c2', { n: 8, frame: 1 }),
    ...g.rose(17.9, 17, 3.7, 'c2', { n: 8, frame: 1 }),
  ],
  // a dove of sapphire glass with a leaded wing, gilded beak and feet
  bird: (icon, g) => [
    g.gilt(g.union(g.seg(10, 17.6, 10, 20.8, 1.3), g.seg(13.5, 17, 13.5, 20.8, 1.3)), { thin: true }),
    g.gilt(g.poly([[18.6, 6.6], [21.6, 8], [18.6, 9.4]]), { thin: true, outline: 0.35 }),
    ...g.pane(g.path('M19 8 C19 13.5 15.5 18 10.5 18 C7.75 18 5.75 16.75 4.75 14.5 L2.5 9.5 L7.25 11.25 C8.75 10.25 10.25 9.5 12 9 C12 6.5 13.5 4.5 15.5 4.5 C17.4 4.5 19 6 19 8 Z'), 'c2', { frame: 1.3, tracery: 'none' }),
    g.glass(g.path('M14.6 11 C14.6 14 12 15.6 8.2 14 C10 12.6 12 11.4 14.6 11 Z'), 'c3', { outline: 0.4, plate: 'A' }),
    g.recess(g.circle(15.7, 7.6, 0.75), { outline: 0.2 }),
  ],
  // the rune in gilt over two sapphire panes
  bluetooth: (icon, g) => [
    g.glass(g.grow(g.union(g.poly([[12, 3], [17.5, 7.5], [12, 12]]), g.poly([[12, 12], [17.5, 16.5], [12, 21]])), 0.9), 'c2', { glint: false }),
    g.gilt(g.stroke([[6.4, 7.4], [17.6, 16.5], [12, 21.2], [12, 2.8], [17.6, 7.5], [6.4, 16.6]], 1.9)),
  ],
  // a missal: ruby cover with a gold quatrefoil, stone page block, gilded corners
  book: (icon, g) => [
    ...g.pane(g.path('M4.5 18.6 V5 A2.5 2.5 0 0 1 7 2.5 H18 A1.5 1.5 0 0 1 19.5 4 V16.6 H7 A2.5 2.5 0 0 0 4.5 18.6 Z'), 'c1', { frame: 1.4, tracery: 'quarry', glass: { medallion: false, s: 2.6 } }),
    g.stone(g.path('M19.5 16.4 V20 A1.5 1.5 0 0 1 18 21.5 H7 A2.5 2.5 0 0 1 4.5 19 A2.5 2.5 0 0 1 7 16.4 Z'), { thin: true, plate: 'A' }),
    g.lead([[[7.4, 18.4], [18, 18.4]], [[7.4, 19.6], [18, 19.6]]], { role: 'edge', w: 0.3 }),
    g.studs([[17.6, 4.4], [7, 4.4]], 0.5),
  ],
  // an open psalter: two leaves of glass ruled with lead lines, a gilded spine
  'book-open': (icon, g) => [
    ...g.pane(g.path('M12 7 C10.5 5.5 8 4.5 4.5 4.5 A1.5 1.5 0 0 0 3 6 V16.5 A1.5 1.5 0 0 0 4.5 18 C8 18 10.5 19 12 20.5 C13.5 19 16 18 19.5 18 A1.5 1.5 0 0 0 21 16.5 V6 A1.5 1.5 0 0 0 19.5 4.5 C16 4.5 13.5 5.5 12 7 Z'), 'c2', { frame: 1.4, tracery: [[[4, 9], [10.6, 10.2]], [[4, 12], [10.6, 13.2]], [[4, 15], [10.6, 16.2]], [[13.4, 10.2], [20, 9]], [[13.4, 13.2], [20, 12]], [[13.4, 16.2], [20, 15]]] }),
    g.gilt(g.seg(12, 7.2, 12, 20.2, 1.6), { plate: 'A', thin: true }),
  ],
  // a ruby pennant with a gold quatrefoil
  bookmark: (icon, g) => g.pane(g.path('M7.5 2.8 H16.5 A2 2 0 0 1 18.5 4.8 V21 L12 16.8 L5.5 21 V4.8 A2 2 0 0 1 7.5 2.8 Z'), 'c1', { frame: 1.5, tracery: 'rose', glass: { n: 8, at: { c: [12, 9.4], r: 4 }, medal: 'c3' } }),
  'bookmark-plus': (icon, g) => [
    ...g.pane(g.path('M7.5 2.8 H16.5 A2 2 0 0 1 18.5 4.8 V21 L12 16.8 L5.5 21 V4.8 A2 2 0 0 1 7.5 2.8 Z'), 'c1', { frame: 1.5, tracery: 'none' }),
    g.gilt(g.glyph('plus', 12, 9.8, 1.05, 2.1), { plate: 'S' }),
  ],
  // an automaton helm: smooth carved stone, a lancet visor slit with gold glass eyes, a gilt band
  // with studs, gilded ears and an antenna tipped with a ruby
  bot: (icon, g) => [
    g.gilt(g.union(g.rr(2.4, 11.4, 5.2, 16.4, 1), g.rr(18.8, 11.4, 21.6, 16.4, 1)), { thin: true }),
    g.gilt(g.seg(12, 8.4, 12, 4.8, 1.4), { thin: true, plate: 'A' }),
    g.glass(g.circle(12, 3.6, 1.45), 'c1', { outline: 0.4, plate: 'A' }),
    g.stone(g.path('M4.6 13 C4.6 9.6 7.6 7.6 12 7.6 C16.4 7.6 19.4 9.6 19.4 13 V18.6 A2.4 2.4 0 0 1 17 21 H7 A2.4 2.4 0 0 1 4.6 18.6 Z')),
    g.gilt(g.rr(4.6, 15.2, 19.4, 16.4, 0), { thin: true, glint: false, outline: 0.3 }),
    g.recess(g.path('M6.6 12.6 L8 11 H16 L17.4 12.6 L16 14.2 H8 Z')),
    g.glass(g.union(g.lancet(8.4, 11.2, 10.8, 14, 0.9), g.lancet(13.2, 11.2, 15.6, 14, 0.9)), 'c3', { outline: 0.25, glow: 0.4, glint: false, plate: 'A' }),
    g.studs([[8, 18.6], [12, 18.6], [16, 18.6]], 0.5),
  ],
  // gilded braces with ball terminals, ruby points
  braces: (icon, g) => [
    g.gilt(g.union(g.stroke('M9 3.6 H8.5 A2.5 2.5 0 0 0 6 6.1 V9.5 C6 11 5 12 3.5 12 C5 12 6 13 6 14.5 V17.9 A2.5 2.5 0 0 0 8.5 20.4 H9', 2.4), g.stroke('M15 3.6 H15.5 A2.5 2.5 0 0 1 18 6.1 V9.5 C18 11 19 12 20.5 12 C19 12 18 13 18 14.5 V17.9 A2.5 2.5 0 0 1 15.5 20.4 H15', 2.4),
      g.circle(9.1, 3.6, 1.55), g.circle(9.1, 20.4, 1.55), g.circle(14.9, 3.6, 1.55), g.circle(14.9, 20.4, 1.55))),
    g.glass(g.union(g.ngon(3.4, 12, 1.4, 4), g.ngon(20.6, 12, 1.4, 4)), 'c1', { outline: 0.35, glint: false, plate: 'A' }),
  ],
  // a brain of ruby glass in a stone frame, its folds leaded
  brain: (icon, g) => [
    ...g.pane(g.path('M12 5.5 A3 3 0 0 0 6.5 6 A3.5 3.5 0 0 0 3.5 12 A3.5 3.5 0 0 0 6 18 A3.25 3.25 0 0 0 12 19 A3.25 3.25 0 0 0 18 18 A3.5 3.5 0 0 0 20.5 12 A3.5 3.5 0 0 0 17.5 6 A3 3 0 0 0 12 5.5 Z'), 'c1', { frame: 1.4, tracery: 'none' }),
    g.stone(g.union(g.seg(12, 5.6, 12, 18.8, 1.1), g.stroke('M7 6.6 C7.8 7.2 8 8 8 9', 1.1), g.stroke('M4.6 12 C6 12.2 7 12.8 7.5 14.4', 1.1), g.stroke('M17 6.6 C16.2 7.2 16 8 16 9', 1.1), g.stroke('M19.4 12 C18 12.2 17 12.8 16.5 14.4', 1.1)), { thin: true, outline: 0.3, plate: 'A' }),
  ],
  // a ruby case with a gilded band and clasp, gilded handle
  briefcase: (icon, g) => [
    g.gilt(g.stroke('M8.6 7.6 V5.6 A2 2 0 0 1 10.6 3.6 H13.4 A2 2 0 0 1 15.4 5.6 V7.6', 1.7), { plate: 'A', thin: true }),
    ...g.pane(g.rr(2.5, 7.5, 21.5, 20.5, 2), 'c1', { frame: 1.5, tracery: 'lancet', glass: { s: 3.2 } }),
    g.gilt(g.rr(3.6, 11.8, 20.4, 13.2, 0), { thin: true, glint: false, outline: 0.3 }),
    g.gilt(g.rr(10.6, 11, 13.4, 15.2, 0.6), { thin: true, plate: 'A' }),
  ],
  'briefcase-medical': (icon, g) => [
    g.gilt(g.stroke('M8.6 7.6 V5.6 A2 2 0 0 1 10.6 3.6 H13.4 A2 2 0 0 1 15.4 5.6 V7.6', 1.7), { plate: 'A', thin: true }),
    g.stone(g.rr(2.5, 7.5, 21.5, 20.5, 2)),
    g.studs([[4.6, 9.6], [19.4, 9.6], [4.6, 18.4], [19.4, 18.4]], 0.5),
    g.gilt(g.glyph('plus', 12, 14, 1.25, 3.6), { glint: false }),
    g.glass(g.glyph('plus', 12, 14, 1.14, 2.1), 'c1', { outline: 0, glow: 0.3 }),
  ],
  // a beetle: emerald wing cases split by a gilt seam, gilded head, legs and feelers
  bug: (icon, g) => [
    g.gilt(g.union(g.stroke('M7 11.5 L3.6 10', 1.3), g.seg(7, 15.5, 3, 15.5, 1.3), g.stroke('M9 19 L5.6 21', 1.3), g.stroke('M17 11.5 L20.4 10', 1.3), g.seg(17, 15.5, 21, 15.5, 1.3), g.stroke('M15 19 L18.4 21', 1.3), g.stroke('M10.5 6.5 L8.6 3.4', 1.2), g.stroke('M13.5 6.5 L15.4 3.4', 1.2)), { thin: true, glint: false, plate: 'A' }),
    g.gilt(g.path('M9 9 A3 3 0 0 1 15 9 Z')),
    ...g.pane(g.path('M7 11 A2 2 0 0 1 9 9 H15 A2 2 0 0 1 17 11 V15 A5 5 0 0 1 7 15 Z'), 'c4', { frame: 1.3, tracery: [[[12, 9], [12, 21]]] }),
    g.studs([[9.8, 13], [14.2, 13], [9.8, 16.4], [14.2, 16.4]], 0.5),
  ],
  // a tower: ashlar walls, crenellated top, lancet lights, a glowing pointed door
  building: (icon, g) => {
    const win = []
    for (const y of [5.6, 10.6]) for (const x of [7.8, 13.6]) win.push(g.lancet(x, y, x + 2.6, y + 3.6, 0.85))
    return [
      g.stone(g.union(g.crenel(4.6, 2.6, 19.4, 21.4, 4, 1.6)), { ashlar: { h: 2.4, w: 3.2, y0: 4.2, y1: 21.4 } }),
      g.glass(g.union(...win), 'c2', { outline: 0.4, glint: false, glow: 0.25 }),
      g.stone(g.lancet(9.2, 15.6, 14.8, 21.4, 1), { thin: true }),
      g.recess(g.lancet(10.4, 16.8, 13.6, 21.4, 1), { glow: 'c3', glowOp: 0.7, plate: 'A' }),
    ]
  },
  // a burger in glass layers: gold bun leaded in lancets, emerald leaf, ruby patty
  burger: (icon, g) => [
    ...g.pane(g.path('M3.4 10.2 A8.6 6.8 0 0 1 20.6 10.2 Z'), 'c3', { frame: 1.3, tracery: [[[8, 2], [8, 11]], [[12, 2], [12, 11]], [[16, 2], [16, 11]]] }),
    g.glass(g.path('M2.4 12.4 H21.6 L20.4 14.4 L18 13.4 L15.6 14.6 L13.2 13.4 L10.8 14.6 L8.4 13.4 L6 14.6 L3.6 13.4 Z'), 'c4', { outline: 0.4, glint: false, plate: 'A' }),
    g.glass(g.rr(3, 14.8, 21, 17, 1.1), 'c1', { outline: 0.4, glint: false }),
    ...g.pane(g.path('M3.4 17.6 H20.6 V19 A2.5 2.5 0 0 1 18.1 21.5 H5.9 A2.5 2.5 0 0 1 3.4 19 Z'), 'c3', { frame: 1, tracery: 'none' }),
  ],
  // a carriage: smooth stone body, sapphire windscreen in lancet lights, gold lamps, gilded wheels
  bus: (icon, g) => [
    g.gilt(g.union(g.rr(5.6, 19, 8.4, 21.6, 0.8), g.rr(15.6, 19, 18.4, 21.6, 0.8)), { thin: true }),
    g.stone(g.rr(4, 2.5, 20, 20, 2.2), { ticks: [[[3, 14.4], [21, 14.4]]] }),
    g.glass(g.rr(5.6, 6.2, 18.4, 12.6, 0.8), 'c2', { tracery: 'lancet', s: 3.2, outline: 0.4 }),
    g.glass(g.union(g.circle(7.6, 16.4, 1.15), g.circle(16.4, 16.4, 1.15)), 'c3', { outline: 0.35, glow: 0.4, glint: false, plate: 'A' }),
    g.gilt(g.rr(8.6, 3.6, 15.4, 4.8, 0.5), { thin: true, glint: false }),
  ],
  // a butterfly of stained glass: sapphire fore wings, gold hind wings, gilded body
  butterfly: (icon, g) => [
    g.gilt(g.union(g.stroke('M11.4 7.6 L9.6 4.4', 1), g.stroke('M12.6 7.6 L14.4 4.4', 1)), { thin: true, glint: false, plate: 'A' }),
    ...g.plate('A', g.pane(g.union(g.path('M11.6 10 C10 8.2 8.4 3.8 5 3.6 C3 3.6 2.6 5.3 2.6 7.5 C2.8 10 5.2 12 8.5 12.6 L11.6 12.6 Z'), g.path('M12.4 10 C14 8.2 15.6 3.8 19 3.6 C21 3.6 21.4 5.3 21.4 7.5 C21.2 10 18.8 12 15.5 12.6 L12.4 12.6 Z')), 'c2', { frame: 1.1, tracery: [[[12, 11], [4, 5]], [[12, 11], [20, 5]]] })),
    ...g.plate('A', g.pane(g.union(g.path('M11.6 12 L8.5 12.4 C5.8 13.5 4.6 15.5 4.6 17.5 C4.6 19.5 6.6 20.4 8.5 20 C10.2 19.2 11.4 16.8 11.6 14.5 Z'), g.path('M12.4 12 L15.5 12.4 C18.2 13.5 19.4 15.5 19.4 17.5 C19.4 19.5 17.4 20.4 15.5 20 C13.8 19.2 12.6 16.8 12.4 14.5 Z')), 'c3', { frame: 1.1, tracery: 'none' })),
    g.gilt(g.rr(11, 7.2, 13, 19.2, 1)),
  ],
  // a cake: ruby glass tiers with a gilded icing band, a stone candle with a gold flame
  cake: (icon, g) => [
    g.deco(g.glass(g.path('M12 2.4 C13 3.4 13.6 4.2 13.6 4.8 A1.6 1.6 0 0 1 10.4 4.8 C10.4 4.2 11 3.4 12 2.4 Z'), 'c3', { outline: 0.4, glint: false })),
    g.stone(g.rr(11.1, 7, 12.9, 11.4, 0.4), { thin: true }),
    ...g.pane(g.path('M4 21 V13 A2 2 0 0 1 6 11 H18 A2 2 0 0 1 20 13 V21 Z'), 'c1', { frame: 1.3, tracery: 'none' }),
    g.gilt(g.stroke('M4.2 15 A2 2 0 0 0 8 15 A2 2 0 0 0 12 15 A2 2 0 0 0 16 15 A2 2 0 0 0 19.8 15', 1.3), { thin: true, glint: false }),
    g.stone(g.rr(2.4, 20, 21.6, 21.8, 0.8), { thin: true }),
  ],

  // ===== calendars (the exemplar's tablet: ashlar, ruby header, gilded rings)
  'calendar-days': (icon, g) => [
    ...calTablet(g),
    g.glass(g.union(...[[7.4, 13.2], [12, 13.2], [16.6, 13.2], [7.4, 17.6], [12, 17.6], [16.6, 17.6]].map(([x, y]) => g.foil(x, y, 1.75, 4))), 'c3', { outline: 0.4, glint: false, glow: 0.25 }),
    ...calRings(g),
  ],
  'calendar-check': (icon, g) => [
    ...calTablet(g),
    ...g.pane(g.stroke([[7.6, 15], [10.6, 18], [16.6, 11.8]], 3.4), 'c4', { frame: 1, tracery: 'none', plate: 'S' }),
    ...calRings(g),
  ],
  'calendar-plus': (icon, g) => [
    ...calTablet(g),
    ...g.pane(g.glyph('plus', 12, 15.4, 1.3, 3.2), 'c3', { frame: 0.9, tracery: 'none', plate: 'S' }),
    ...calRings(g),
  ],
  // the exemplar camera, struck through
  'camera-off': (icon, g) => [
    g.stone(g.crenel(7, 3.4, 15, 8, 3, 1.5), { thin: true }),
    g.stone(g.rr(2.5, 6.6, 21.5, 20.2, 2.2), { ashlar: { h: 2.3, w: 3.2, y0: 6.6, y1: 20.2 } }),
    ...g.rose(12, 13.4, 5.2, 'c2', { n: 8, frame: 1.2, medal: 'c3' }),
    ...g.slash(3.2, 3.2, 20.8, 20.8),
  ],
  // a reckoning tablet: smooth stone body, emerald display, gilded keys
  calculator: (icon, g) => [
    g.stone(g.rr(4.4, 2.5, 19.6, 21.5, 2)),
    g.glass(g.rr(7.2, 5.2, 16.8, 10.2, 0.8), 'c4', { outline: 0.4, tracery: [[[12, 4], [12, 11]]] }),
    g.gilt(g.union(...[8.4, 12, 15.6].flatMap(x => [g.circle(x, 14, 1.25), g.circle(x, 17.8, 1.25)])), { plate: 'A', thin: true }),
  ],
  // a screen in a stone frame, the captions gilded bars
  captions: (icon, g) => [
    ...g.pane(g.rr(2.4, 4, 21.6, 20, 2), 'c2', { frame: 1.6, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.union(g.seg(6, 12, 8, 12, 1.8), g.seg(11.6, 12, 18, 12, 1.8), g.seg(6, 16, 13, 16, 1.8), g.seg(16.6, 16, 18, 16, 1.8)), { plate: 'A', thin: true }),
  ],
  // a coach of ruby glass with sapphire lights, rose-window wheels
  car: (icon, g) => [
    ...g.pane(g.path('M3.8 16.6 A1.4 1.4 0 0 1 2.4 15.2 V12 A2 2 0 0 1 4.4 10 H5.6 L8 5 H13.6 L17.6 10 H19.6 A2 2 0 0 1 21.6 12 V15.2 A1.4 1.4 0 0 1 20.2 16.6 Z'), 'c1', { frame: 1.3, tracery: [[[11.5, 9], [11.5, 17]], [[2, 12.8], [22, 12.8]]] }),
    g.glass(g.union(g.poly([[8.8, 6.6], [10.8, 6.6], [10.8, 9.8], [7.4, 9.8]]), g.poly([[12.2, 6.6], [13, 6.6], [15.4, 9.8], [12.2, 9.8]])), 'c2', { outline: 0.4, glint: false }),
    ...g.rose(7.2, 16.6, 2.7, 'c3', { n: 6, frame: 0.9, plate: 'A' }),
    ...g.rose(16.8, 16.6, 2.7, 'c3', { n: 6, frame: 0.9, plate: 'A' }),
  ],
  // a screen of stone and sapphire, gilded waves rising from the corner
  cast: (icon, g) => [
    ...g.pane(g.rr(2.4, 4, 21.6, 20, 2), 'c2', { frame: 1.6, tracery: 'lancet', glass: { s: 3 } }),
    g.cut(g.path('M1 9 A11 11 0 0 1 12.6 21 H1 Z')),
    g.gilt(g.union(g.arc(2.2, 20, 9, -90, 0, 1.7), g.arc(2.2, 20, 5.2, -90, 0, 1.7), g.circle(2.9, 19.3, 1.5)), { plate: 'A' }),
  ],
  // a black cat in deep sapphire glass, gold eyes, gilded nose
  cat: (icon, g) => [
    ...g.pane(g.path('M12 20.5 C7 20.5 3.5 18 3.5 13.75 C3.5 11.75 3.9 10.25 4.5 9 V4 L9.5 6.5 C10.25 6.25 11.25 6 12 6 C12.75 6 13.75 6.25 14.5 6.5 L19.5 4 V9 C20.1 10.25 20.5 11.75 20.5 13.75 C20.5 18 17 20.5 12 20.5 Z'), 'c2', { frame: 1.4, tracery: 'none', glass: { dark: 0.45, deep: 0.25 } }),
    g.glass(g.union(g.ellipse(8.6, 12.6, 1.6, 1.3), g.ellipse(15.4, 12.6, 1.6, 1.3)), 'c3', { outline: 0.35, glow: 0.4, glint: false, plate: 'A' }),
    g.recess(g.union(g.ellipse(8.6, 12.6, 0.35, 1.05), g.ellipse(15.4, 12.6, 0.35, 1.05)), { outline: 0, plate: 'A' }),
    g.gilt(g.poly([[10.8, 15.6], [13.2, 15.6], [12, 17]]), { thin: true, outline: 0.35 }),
  ],
  // charts: stone axes, glass marks
  'chart-area': (icon, g) => [
    g.glass(g.poly([[7, 17.2], [7, 12], [11.4, 7.6], [15, 11.2], [20.6, 5.6], [20.6, 17.2]]), 'c4', { tracery: [[[11.4, 7.6], [11.4, 18]], [[15, 11.2], [15, 18]]], plate: 'A' }),
    g.stone(g.stroke('M3.6 3.4 V18.4 A2 2 0 0 0 5.6 20.4 H20.8', 2.2), { ticks: [[[2, 9], [5, 9]], [[2, 14], [5, 14]], [[12, 19], [12, 22]]] }),
  ],
  // three lancet towers of glass on a stone plinth
  'chart-bar': (icon, g) => [
    ...g.pane(g.lancet(3.6, 11.6, 8.6, 20.4, 0.9), 'c2', { frame: 1.1, tracery: 'none', plate: 'A' }),
    ...g.pane(g.lancet(9.6, 3.4, 14.4, 20.4, 0.9), 'c1', { frame: 1.1, tracery: 'none' }),
    ...g.pane(g.lancet(15.4, 7.6, 20.4, 20.4, 0.9), 'c3', { frame: 1.1, tracery: 'none', plate: 'A' }),
    g.stone(g.rr(2.4, 19.6, 21.6, 21.8, 0.8), { thin: true }),
  ],
  // a rose window pie, its slice a gold pane drawn out
  'chart-pie': (icon, g) => [
    ...g.pane(g.path('M10.4 13.6 V5.6 A8 8 0 1 0 18.4 13.6 Z'), 'c2', { frame: 1.5, tracery: [[[10.4, 13.6], [4, 7]], [[10.4, 13.6], [2, 15.6]], [[10.4, 13.6], [6, 21]], [[10.4, 13.6], [14, 22]]] }),
    ...g.pane(g.path('M13.6 10.4 V2.4 A8 8 0 0 1 21.6 10.4 Z'), 'c3', { frame: 1.3, tracery: [[[13.6, 10.4], [18, 3.2]]], plate: 'A' }),
  ],
  // a stone toque, a gilded band set with a ruby
  'chef-hat': (icon, g) => [
    g.stone(g.union(g.circle(8.4, 10.2, 3.8), g.circle(12, 7, 3.9), g.circle(15.6, 10.2, 3.8), g.rr(6.4, 10.2, 17.6, 17.6, 0)), { ticks: [[[10, 12.6], [10, 18]], [[14, 12.6], [14, 18]]] }),
    g.gilt(g.rr(6.4, 16.8, 17.6, 21, [0, 0, 2, 2]), { plate: 'A' }),
    g.glass(g.ngon(12, 18.9, 1.2, 4), 'c1', { outline: 0.3, glint: false, plate: 'A' }),
  ],
}
