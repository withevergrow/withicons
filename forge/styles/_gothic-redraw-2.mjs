// GOTHIC hand redraws, chunk 2 of 5 (owned by the chunk-2 redrawer): icons 101-200 alphabetically
// (circle-arrow-left .. gem). Map icon name -> (icon, g) => parts, built with the frozen kit g
// (see forge/styles/GOTHIC-GUIDE.md). Names listed in EXEMPLAR (cloud, coffee, file, folder) are
// ignored here.

// ---- local helpers ------------------------------------------------------------
const rad = d => d * Math.PI / 180
const rot = (cx, cy, x, y, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [cx + x * c - y * s, cy + x * s + y * c] }
const f1 = v => Math.round(v * 100) / 100
// radial lines between r0 and r1 (tracery spokes, joints round a ring)
const rays = (cx, cy, r0, r1, n, a0 = -90) => Array.from({ length: n }, (_, k) => {
  const a = rad(a0 + 360 * k / n)
  return [[cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)], [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]]
})
const circ = (cx, cy, r, n = 48) => Array.from({ length: n + 1 }, (_, k) => [cx + r * Math.cos(2 * Math.PI * k / n), cy + r * Math.sin(2 * Math.PI * k / n)])

// a circle with bites taken out (each [x, y, r]): points of the outline
function bitten(cx, cy, R, bites, n = 96) {
  const out = []
  for (let k = 0; k < n; k++) {
    const a = 2 * Math.PI * k / n
    let p = [cx + R * Math.cos(a), cy + R * Math.sin(a)]
    for (const [bx, by, br] of bites) { const d = Math.hypot(p[0] - bx, p[1] - by); if (d < br) p = [bx + (p[0] - bx) * br / d, by + (p[1] - by) * br / d] }
    out.push(p)
  }
  return out
}
// a circle of tracery as four open arcs (closed rings are not leaded by the painter)
const arcPts = (cx, cy, r, a0, a1, n = 12) => Array.from({ length: n + 1 }, (_, k) => { const a = rad(a0 + (a1 - a0) * k / n); return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })
const ringArcs = (cx, cy, r) => [0, 90, 180, 270].map(a => arcPts(cx, cy, r, a, a + 90, 7))
// the ogival arrowhead of the arrow-right exemplar, pointing at angle a (0 east, 90 south), scale s
const HEAD = [[0, 0], 'C', [-3.2, -1.2], [-6.2, -3.6], [-8.6, -7.2], 'C', [-7.8, -4.4], [-7.6, -2], [-7.8, 0], 'C', [-7.6, 2], [-7.8, 4.4], [-8.6, 7.2], 'C', [-6.2, 3.6], [-3.2, 1.2], [0, 0]]
function headD(tx, ty, a, s) {
  let d = ''
  for (const t of HEAD) {
    if (t === 'C') { d += ' C'; continue }
    const [x, y] = rot(tx, ty, t[0] * s, t[1] * s, a)
    d += `${d ? ' ' : 'M'}${f1(x)} ${f1(y)}`
  }
  return d + ' Z'
}
// a jewelled terminal: a gilded quatrefoil knob set with a glass bead (the stud end of a bar)
const knob = (g, x, y, role = 'c1', R = 1.9, plate = 'K') => [
  g.gilt(g.foil(x, y, R, 4, -45), { plate, glint: false }),
  g.glass(g.circle(x, y, R * 0.42), role, { outline: 0.22, glint: false, glow: 0.32, plate }),
]
// a gilded arrow: shaft from (x0, y0) along pts to the tip; ogee head set with a glass trefoil
// (o.jewel role, or a dark piercing when o.jewel is false); o.tail adds a jewelled knob at the start
function arrow(g, pts, s = 0.62, w = 2.2, o = {}) {
  const [tx, ty] = pts.at(-1), [px, py] = pts.at(-2)
  const a = Math.atan2(ty - py, tx - px) * 180 / Math.PI
  const back = rot(tx, ty, -6 * s, 0, a)
  const shaft = g.stroke([...pts.slice(0, -1), back], w)
  const head = g.path(headD(tx, ty, a, s))
  const pl = o.plate || 'A', jewel = o.jewel ?? 'c1'
  const tR = o.tailR ?? Math.max(1.5, w * 0.78)
  const F = o.tail ? g.union(shaft, head, g.foil(pts[0][0], pts[0][1], tR, 4, -45)) : g.union(shaft, head)
  const [hx, hy] = rot(tx, ty, -5 * s, 0, a)
  const tre = g.foil(hx, hy, 1.4 * s + 0.2, 3, 180 + a)
  return {
    F,
    parts: [
      g.gilt(g.union(shaft, head), { plate: pl, thin: s < 0.6 }),
      s >= 0.5 ? (jewel ? g.glass(tre, jewel, { outline: 0.2, glint: false, glow: 0.34, plate: pl })
        : g.recess(tre, { outline: 0.12, glow: 'c3', plate: pl })) : null,
      o.tail ? knob(g, pts[0][0], pts[0][1], o.tailRole || jewel || 'c1', tR, pl) : null,
    ],
  }
}
// a spear chevron: two arms of width w meeting in a mitred point at (ax, ay), pointing along
// angle a (0 = east); each arm runs back d and out e; the tip is drawn out by `tip` (a spear point)
function spearPts(ax, ay, a, d = 4, w = 2.4, tip = 0.7, e = d) {
  const h = w / 2, L = Math.hypot(d, e), ox = h * e / L, oy = h * d / L, m = h * L / e
  const P = [
    [-d + ox, -e - oy], [m + tip, 0], [-d + ox, e + oy],
    [-d - ox, e - oy], [-m, 0], [-d - ox, -e + oy],
  ]
  return P.map(([x, y]) => rot(ax, ay, x, y, a))
}
// the arm ends of a spear chevron (for terminal studs)
const spearEnds = (ax, ay, a, d = 4, e = d) => [rot(ax, ay, -d, -e, a), rot(ax, ay, -d, e, a)]
// the moat round an overlay (knocks it out of everything painted before)
const moat = (g, F, e = 0.9) => g.cut(g.grow(F, e))

// a round stone surround glazed as a rose window, its centre left clear for a glyph
function roundel(g, role = 'c2', o = {}) {
  const cx = o.cx ?? 11.8, cy = o.cy ?? 11.8, R = o.r ?? 9.6, w = o.frame ?? 1.8
  const n = o.n ?? 16, ri = o.ri ?? R - w - 2.1
  return [
    g.stone(g.rim(g.circle(cx, cy, R), w), { ticks: rays(cx, cy, R - w - 0.5, R + 0.5, o.joints ?? 12, -75) }),
    g.glass(g.circle(cx, cy, R - w + 0.05), role, { tracery: o.tracery || [...ringArcs(cx, cy, ri), ...rays(cx, cy, ri, R, n, -90 + 180 / n)], dark: o.dark ?? 0.36, glow: 0.14, deep: o.deep ?? 0.1, lw: 0.3, plate: o.plate }),
  ]
}

// the cloud of the exemplar, scaled by s about (12, 12) and moved by (dx, dy)
function cloudF(g, s = 1, dx = 0, dy = 0) {
  const X = x => 12 + (x - 12) * s + dx, Y = y => 12 + (y - 12) * s + dy
  return g.union(g.circle(X(8.2), Y(13.6), 4.4 * s), g.circle(X(13.4), Y(10.4), 5.6 * s), g.circle(X(17.6), Y(14.2), 3.9 * s), g.rr(X(4), Y(13), X(20.4), Y(18.6), 2.8 * s))
}
const SNOW = [[7.6, 18.2], [12, 19.5], [16.4, 18.2]]
const cloudPane = (g, F, role = 'c2', o = {}) => g.pane(F, role, { frame: o.frame ?? 1.4, tracery: 'quarry', glass: { medallion: false, s: 2.3, ...o.glass } })

// the leaf of the file exemplar: sapphire glass in stone, gilded dog-ear; o.tracery for the glass
const PAGE = 'M6.5 2.5 H14 L19.5 8 V19.5 A2 2 0 0 1 17.5 21.5 H6.5 A2 2 0 0 1 4.5 19.5 V4.5 A2 2 0 0 1 6.5 2.5 Z'
function page(g, role = 'c2', o = {}) {
  return [
    ...g.pane(g.path(PAGE), role, { frame: 1.5, tracery: o.tracery ?? 'none', glass: { dark: 0.38, ...o.glass } }),
    g.gilt(g.poly([[14, 2.6], [14, 7.4], [19.4, 7.4]]), { plate: 'A' }),
  ]
}

// the folder exemplar: ashlar back with tab, glass front of role
function folder(g, role = 'c3', o = {}) {
  return [
    g.stone(g.path('M4.5 3.8 H9.6 L11.6 6 H19.5 A2 2 0 0 1 21.5 8 V19.2 A2 2 0 0 1 19.5 21.2 H4.5 A2 2 0 0 1 2.5 19.2 V5.8 A2 2 0 0 1 4.5 3.8 Z'), { ashlar: { h: 2, w: 3.2, y0: 3.8, y1: 10 } }),
    ...g.pane(g.rr(2.5, 9.4, 21.5, 21.2, [1, 1, 2, 2]), role, { frame: 1.4, tracery: o.tracery ?? 'quarry', plate: 'A', glass: o.glass }),
  ]
}

// a stack of coins seen from above: top face at y0, last coin's bottom face at y1 (rx 6, ry 2.6)
const stackF = (g, cx, y0, y1, rx = 5.9, ry = 2.6) => g.union(g.ellipse(cx, y0, rx, ry), g.rect(cx - rx, y0, cx + rx, y1), g.ellipse(cx, y1, rx, ry))
function coinStack(g, cx, y0, y1, plate = 'K', rx = 5.9, ry = 2.6) {
  const edges = []
  for (let y = y0 + 1.6; y < y1 - 0.2; y += 1.6) edges.push(half(cx, y, rx, ry, 16))
  return [
    g.gilt(stackF(g, cx, y0, y1, rx, ry), { plate, glint: false }),
    g.lead(edges, { w: 0.34, op: 0.75, plate }),
    g.gilt(g.ellipse(cx, y0, rx, ry), { plate, outline: 0.32 }),
    g.glass(g.ellipse(cx, y0, rx - 1.1, ry - 0.75), 'c3', { plate, outline: 0.28, glint: false, glow: 0.3 }),
    g.glass(g.foil(cx, y0, 1.35, 4, -90), 'c1', { plate, outline: 0.24, glint: false }),
  ]
}
// a face boss in a rose window: stone rim, sapphire petal ring, gilded face, carved eyes;
// `features` (mouth, brows) are laid on the gilt
function faceBoss(g, features, o = {}) {
  const cx = 12, cy = 12, R = 9.6, rf = o.rf ?? 6.1
  return [
    g.stone(g.rim(g.circle(cx, cy, R), 1.3), { ticks: rays(cx, cy, R - 1.7, R + 0.5, 8, -67.5) }),
    g.glass(g.circle(cx, cy, R - 1.25), o.role || 'c2', { tracery: rays(cx, cy, rf, R, 12, -90 + 180 / 12), dark: 0.34, glow: 0.14 }),
    g.gilt(g.circle(cx, cy, rf), { plate: 'A' }),
    g.recess(g.union(g.ellipse(9.8, 10.8, 0.9, 1.2), g.ellipse(14.2, 10.8, 0.9, 1.2)), { plate: 'A', outline: 0.15 }),
    ...features,
  ]
}
// jewelled terminals: gilded balls set with ruby glass at the ends of a gilt stroke
const jewels = (g, pts, role = 'c1', r = 1.65) => [
  g.gilt(g.union(...pts.map(([x, y]) => g.circle(x, y, r))), { glint: false }),
  g.glass(g.union(...pts.map(([x, y]) => g.circle(x, y, r * 0.58))), role, { outline: 0.22, glint: false, glow: 0.34 }),
]
// iron stripes across a field (clapperboard): slanted bands every p
function stripes(g, F, x0, x1, y0, y1, p = 4.4, w = 1.9, lean = 1.6) {
  const bands = []
  for (let x = x0; x < x1; x += p) bands.push(g.poly([[x, y1], [x + lean, y0], [x + lean + w, y0], [x + w, y1]]))
  return g.inter(F, g.union(...bands))
}

export const R = {
  // ---- circles: a stone rose window, a gilded sign in its clear centre ------------------
  circle: (icon, g) => [
    g.stone(g.rim(g.circle(11.8, 11.8, 9.6), 1.8), { ticks: rays(11.8, 11.8, 7.3, 10.1, 12, -75) }),
    g.glass(g.circle(11.8, 11.8, 7.85), 'c2', { tracery: [...rays(11.8, 11.8, 2.6, 8, 12, -90), ...ringArcs(11.8, 11.8, 2.6), ...ringArcs(11.8, 11.8, 5.6)], dark: 0.36 }),
    g.glass(g.foil(11.8, 11.8, 2.55, 4, -45), 'c1', { outline: 0.3, glint: false }),
  ],
  'circle-dot': (icon, g) => [
    ...roundel(g, 'c2', { n: 12 }),
    g.gilt(g.circle(11.8, 11.8, 3.6), { plate: 'A' }),
    g.glass(g.circle(11.8, 11.8, 2.3), 'c1', { outline: 0.3, plate: 'A', glow: 0.26 }),
  ],
  'circle-stop': (icon, g) => [
    ...roundel(g, 'c1'),
    g.gilt(g.rr(8.3, 8.3, 15.3, 15.3, 1.2), { plate: 'A' }),
    g.recess(g.foil(11.8, 11.8, 1.9, 4, -45), { outline: 0, glow: 'c1', glowOp: 0.6, plate: 'A' }),
  ],
  'circle-pause': (icon, g) => [
    ...roundel(g, 'c1'),
    g.gilt(g.union(g.rr(8.4, 7.6, 10.8, 16, 0.8), g.rr(12.8, 7.6, 15.2, 16, 0.8)), { plate: 'A' }),
  ],
  'circle-play': (icon, g) => [
    ...roundel(g, 'c1'),
    g.gilt(g.path('M9.7 7.9 C9.7 7.1 10.4 6.8 11 7.2 L16.3 11 C16.9 11.4 16.9 12.2 16.3 12.6 L11 16.4 C10.4 16.8 9.7 16.5 9.7 15.7 Z'), { plate: 'A' }),
    g.recess(g.foil(12.1, 11.8, 1.15, 3, 0), { outline: 0, glow: 'c1', glowOp: 0.6, plate: 'A' }),
  ],
  'circle-arrow-left': (icon, g) => [...roundel(g, 'c2'), ...arrow(g, [[16.6, 11.8], [6.8, 11.8]], 0.72, 2.3).parts],
  'circle-arrow-right': (icon, g) => [...roundel(g, 'c2'), ...arrow(g, [[7, 11.8], [16.8, 11.8]], 0.72, 2.3).parts],
  'circle-arrow-up': (icon, g) => [...roundel(g, 'c2'), ...arrow(g, [[11.8, 16.6], [11.8, 6.8]], 0.72, 2.3).parts],
  'circle-chevron-down': (icon, g) => [
    ...roundel(g, 'c2'),
    g.gilt(g.poly(spearPts(11.8, 13.2, 90, 3.9, 2.5, 0.8)), { plate: 'A' }),
    g.glass(g.foil(11.8, 13.4, 1.05, 3, -90), 'c1', { plate: 'A', outline: 0.2, glint: false, glow: 0.34 }),
  ],
  'circle-chevron-right': (icon, g) => [
    ...roundel(g, 'c2'),
    g.gilt(g.poly(spearPts(13.2, 11.8, 0, 3.9, 2.5, 0.8)), { plate: 'A' }),
    g.glass(g.foil(13.4, 11.8, 1.05, 3, 180), 'c1', { plate: 'A', outline: 0.2, glint: false, glow: 0.34 }),
  ],

  // ---- a clock: night-blue rose window, gilded hours and hands -------------------------
  clock: (icon, g) => [
    ...roundel(g, 'c2', { n: 12, ri: 5.9 }),
    g.studs([[11.8, 4.9], [18.7, 11.8], [11.8, 18.7], [4.9, 11.8]], 0.62),
    g.gilt(g.union(g.stroke([[11.8, 6.6], [11.8, 11.8]], 1.7), g.stroke([[11.8, 11.8], [15.3, 13.9]], 1.5)), { plate: 'A' }),
    g.gilt(g.circle(11.8, 11.8, 1.25), { plate: 'A', thin: true, glint: false }),
  ],

  // ---- close: a ruby saltire in a carved surround (the check exemplar's build) -----------
  close: (icon, g) => g.pane(g.union(g.seg(5.4, 5.4, 18.4, 18.4, 4.4), g.seg(18.4, 5.4, 5.4, 18.4, 4.4)), 'c1', { frame: 1.3, tracery: 'none' }),

  // ---- clapperboard: a ruby glazed slate, iron-striped stone and gilded clapper -----------
  clapperboard: (icon, g) => {
    const stick = g.rr(3, 7.6, 21, 10.6, 0.6)
    const top = g.poly([[3.3, 7.3], [20.5, 4.3], [20.1, 2], [2.9, 5]])
    return [
      ...g.pane(g.rr(3, 10, 21, 21, [0, 0, 2, 2]), 'c1', { frame: 1.4, tracery: 'lancet', glass: { s: 2.4 } }),
      g.stone(stick, { thin: true }),
      g.iron(stripes(g, g.shrink(stick, 0.25), 3.6, 21, 7.6, 10.6, 4.2, 1.8, 1.5), { outline: 0 }),
      g.gilt(top, { plate: 'A' }),
      g.iron(stripes(g, g.shrink(top, 0.25), 4.6, 21, 1.6, 7.6, 4.2, 1.8, 1.5), { outline: 0, plate: 'A' }),
      g.gilt(g.circle(3.6, 7, 0.9), { plate: 'A', thin: true, glint: false, outline: 0.3 }),
    ]
  },

  // ---- clipboards: a stone board, glazed sheet, gilded clip with a trefoil -------------------
  clipboard: (icon, g) => [
    ...g.pane(g.rr(4.2, 4.4, 19.6, 21.4, 2), 'c1', { frame: 1.6, tracery: 'quarry', glass: { at: { c: [11.9, 13.6], r: 4.2 } } }),
    g.gilt(g.rr(8.2, 2.4, 15.6, 6.6, 1.3), { plate: 'A' }),
    g.recess(g.foil(11.9, 4.4, 1.05, 3, -90), { outline: 0.1, plate: 'A' }),
  ],
  'clipboard-check': (icon, g) => [
    ...g.pane(g.rr(4.2, 4.4, 19.6, 21.4, 2), 'c4', { frame: 1.6, tracery: 'lancet', glass: { s: 2.5, dark: 0.4 } }),
    g.gilt(g.rr(8.2, 2.4, 15.6, 6.6, 1.3), { plate: 'A' }),
    g.recess(g.foil(11.9, 4.4, 1.05, 3, -90), { outline: 0.1, plate: 'A' }),
    moat(g, g.stroke([[8.3, 13.6], [10.9, 16.2], [15.6, 11]], 2.4), 0.55),
    g.gilt(g.stroke([[8.3, 13.6], [10.9, 16.2], [15.6, 11]], 2.4), { plate: 'S' }),
  ],
  'clipboard-list': (icon, g) => [
    ...g.pane(g.rr(4.2, 4.4, 19.6, 21.4, 2), 'c2', { frame: 1.6, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.rr(8.2, 2.4, 15.6, 6.6, 1.3), { plate: 'A' }),
    g.recess(g.foil(11.9, 4.4, 1.05, 3, -90), { outline: 0.1, plate: 'A' }),
    g.gilt(g.union(g.foil(8.6, 10.9, 1.25, 4, -45), g.foil(8.6, 15.6, 1.25, 4, -45)), { thin: true, outline: 0.3, glint: false }),
    g.stone(g.union(g.seg(11.2, 10.9, 15.6, 10.9, 1.4), g.seg(11.2, 15.6, 15.6, 15.6, 1.4)), { thin: true, outline: 0.32 }),
  ],

  // ---- clouds: the exemplar cloud, lifted and shrunk so the weather can hang below --------
  'cloud-rain': (icon, g) => [
    ...cloudPane(g, cloudF(g, 0.84, 0, -2.4)),
    g.gilt(g.union(g.seg(8, 17.6, 7, 20.6, 1.4), g.seg(12, 17.6, 11, 20.8, 1.4), g.seg(16, 17.6, 15, 20.6, 1.4)), { plate: 'A', thin: true }),
  ],
  'cloud-snow': (icon, g) => [
    ...cloudPane(g, cloudF(g, 0.84, 0, -2.4)),
    g.gilt(g.union(...SNOW.map(([x, y]) => g.star(x, y, 2.05, 0.8, 6))), { plate: 'A', thin: true, outline: 0.3, glint: false }),
    g.glass(g.union(...SNOW.map(([x, y]) => g.circle(x, y, 0.55))), 'c2', { plate: 'A', outline: 0.18, glint: false, glow: 0.4 }),
  ],
  'cloud-lightning': (icon, g) => {
    const bolt = g.poly([[13.4, 11.2], [8.6, 16.8], [11.6, 16.8], [10.2, 21.6], [15.6, 15], [12.6, 15], [14.6, 11.2]])
    return [
      ...cloudPane(g, cloudF(g, 0.84, 0, -2.4)),
      moat(g, bolt, 0.75),
      g.glass(bolt, 'c3', { plate: 'A', outline: 0.42, glow: 0.3 }),
    ]
  },
  'cloud-sun': (icon, g) => {
    const C = cloudF(g, 0.74, 2.6, 3)
    return [
      g.deco(g.gilt(g.union(...rays(8.2, 8.2, 5.2, 6.6, 8, -90).filter((_, k) => k < 2 || k > 5).map(([a, b]) => g.seg(a[0], a[1], b[0], b[1], 1.2))), { thin: true, outline: 0.32, glint: false })),
      ...g.rose(8.2, 8.2, 4.3, 'c3', { n: 6, frame: 1, medal: 'c1' }),
      moat(g, C, 0.8),
      ...cloudPane(g, C, 'c2', { glass: { s: 2.8 } }),
    ]
  },
  'cloud-off': (icon, g) => [
    ...cloudPane(g, cloudF(g, 1, 0, 0.6)),
    ...g.slash(3.6, 3.6, 20.6, 20.6),
  ],
  'cloud-download': (icon, g) => {
    const a = arrow(g, [[12, 9.6], [12, 21.6]], 0.6, 2.1)
    return [...cloudPane(g, cloudF(g, 0.84, 0, -2.6)), moat(g, a.F, 0.8), ...a.parts]
  },
  'cloud-upload': (icon, g) => {
    const a = arrow(g, [[12, 21.6], [12, 9.4]], 0.6, 2.1)
    return [...cloudPane(g, cloudF(g, 0.84, 0, -1.2)), moat(g, a.F, 0.8), ...a.parts]
  },
}

// ---- batch 2: code .. download ---------------------------------------------------------------
const half = (cx, cy, rx, ry, n = 20) => Array.from({ length: n + 1 }, (_, k) => [cx + rx * Math.cos(Math.PI * k / n), cy + ry * Math.sin(Math.PI * k / n)])
Object.assign(R, {
  // carved stone chevrons round a ruby glass solidus
  // carved spear chevrons with gilded stud ends round a ruby glass solidus
  code: (icon, g) => [
    g.stone(g.union(g.poly(spearPts(4.7, 12, 180, 4, 2.6, 0.5, 4.8)), g.poly(spearPts(19.3, 12, 0, 4, 2.6, 0.5, 4.8)))),
    g.studs([...spearEnds(4.7, 12, 180, 4, 4.8), ...spearEnds(19.3, 12, 0, 4, 4.8)], 0.9),
    g.glass(g.seg(13.4, 4.6, 10.6, 19.4, 2.5), 'c1', { glow: 0.3 }),
  ],
  // two gilded coins, a ruby quatrefoil and a gold rose struck in them
  // two stacks of gilded coins, each top struck with a gold glass face and a quatrefoil mint mark
  coins: (icon, g) => [
    ...coinStack(g, 8.4, 5.4, 9.6, 'K'),
    g.cut(g.grow(stackF(g, 15.6, 14.2, 18.8), 0.9)),
    ...coinStack(g, 15.6, 14.2, 18.8, 'A'),
  ],
  // a two-light window: twin lancets in an ashlar wall
  columns: (icon, g) => [
    g.stone(g.rr(2.6, 2.8, 21.4, 21.2, 2), { ashlar: { h: 2.3, w: 3.2, y0: 2.8, y1: 21.2 } }),
    ...g.window(4.5, 4.6, 11.3, 19.6, 'c2', { k: 0.85, frame: 1.1, tracery: 'lancet', glass: { s: 2.3 } }),
    ...g.window(12.7, 4.6, 19.5, 19.6, 'c1', { k: 0.85, frame: 1.1, tracery: 'lancet', glass: { s: 2.3 } }),
  ],
  // an emerald rose window with a gilded compass star, its north point ruby
  compass: (icon, g) => {
    const S = g.star(11.8, 11.8, 6.9, 1.7, 4)
    return [
      ...roundel(g, 'c4', { ri: 6.6 }),
      g.gilt(S, { plate: 'A' }),
      g.glass(g.inter(g.shrink(S, 0.35), g.rect(0, 0, 24, 11.6)), 'c1', { plate: 'A', outline: 0.25, glint: false }),
      g.gilt(g.circle(11.8, 11.8, 1), { plate: 'A', thin: true, outline: 0.3, glint: false }),
    ]
  },
  // a gold glass biscuit in a stone crust, a bite taken, dark chips
  cookie: (icon, g) => [
    ...g.pane(g.poly(bitten(11.8, 12.2, 9.4, [[20, 6, 3.6], [21.6, 11.2, 1.9]])), 'c3', { frame: 1.6, tracery: 'none', glass: { glow: 0.22 } }),
    g.recess(g.union(g.circle(8.2, 9.4, 1.1), g.circle(13.2, 12.2, 1.1), g.circle(8.6, 15.4, 1.05), g.circle(14.4, 17.2, 1.1), g.circle(11.6, 7, 0.85)), { outline: 0.15 }),
    g.lead([[[10.6, 9.6], [11, 10.4]], [[15.4, 9], [16.2, 9.4]], [[11.4, 16.2], [11.8, 17]], [[5.8, 12.4], [6.4, 12]], [[16.6, 13.8], [17.2, 14.4]]], { role: 'c1', w: 0.6 }),
  ],
  // a cauldron: emerald glass belly, stone rim, gilded handles and domed lid
  'cooking-pot': (icon, g) => [
    g.gilt(g.union(g.seg(2.6, 14, 5, 14, 1.7), g.seg(19, 14, 21.4, 14, 1.7)), { thin: true }),
    ...g.pane(g.path('M4.5 10 H19.5 V17.6 A3.4 3.4 0 0 1 16.1 21 H7.9 A3.4 3.4 0 0 1 4.5 17.6 Z'), 'c4', { frame: 1.5, tracery: 'lancet', glass: { s: 2.6 } }),
    g.stone(g.rr(2.4, 8.9, 21.6, 11.2, 1.1), { thin: true }),
    g.gilt(g.union(g.path('M6 8.9 C6 6.6 8.6 5.2 12 5.2 C15.4 5.2 18 6.6 18 8.9 Z'), g.circle(12, 4.4, 1.35)), { plate: 'A' }),
  ],
  // two leaves: an ashlar tablet behind a sapphire glazed one
  copy: (icon, g) => [
    g.stone(g.rr(8.4, 2.6, 21.4, 15.6, 2), { ashlar: { h: 2.2, w: 3.2, y0: 2.6, y1: 15.6 } }),
    g.cut(g.rr(1.9, 7.7, 16.3, 22.1, 2.7)),
    ...g.pane(g.rr(2.6, 8.4, 15.6, 21.4, 2), 'c2', { frame: 1.4, tracery: 'quarry', plate: 'A' }),
  ],
  'corner-down-left': (icon, g) => arrow(g, [[19.2, 4.3], ...g.arcPts(16, 11.6, 3.2, 0, 90, 0.5), [3.2, 14.8]], 0.74, 2.6, { plate: 'K', tail: true }).parts,
  'corner-down-right': (icon, g) => arrow(g, [[4.8, 4.3], ...g.arcPts(8, 11.6, 3.2, 180, 90, 0.5), [20.8, 14.8]], 0.74, 2.6, { plate: 'K', tail: true }).parts,
  // a chip as a carved reliquary: smooth stone block, gilded pins and corner studs, a gold-medallion sapphire die
  cpu: (icon, g) => {
    const pins = []
    for (const p of [9, 12, 15]) pins.push(g.seg(p, 2.6, p, 6, 1.3), g.seg(p, 18, p, 21.4, 1.3), g.seg(2.6, p, 6, p, 1.3), g.seg(18, p, 21.4, p, 1.3))
    return [
      g.gilt(g.union(...pins), { thin: true, glint: false }),
      g.stone(g.rr(5, 5, 19, 19, 2)),
      g.glass(g.rr(8.2, 8.2, 15.8, 15.8, 1), 'c2', { tracery: 'medallion', medal: 'c3', dark: 0.4, deep: 0.12 }),
      g.studs([[6.7, 6.7], [17.3, 6.7], [6.7, 17.3], [17.3, 17.3]], 0.6),
    ]
  },
  // a sapphire glass card: iron stripe, gilded chip, ruby quatrefoil
  'credit-card': (icon, g) => [
    ...g.pane(g.rr(2.4, 5, 21.6, 19, 2), 'c2', { frame: 1.4, tracery: 'none', glass: { dark: 0.36 } }),
    g.iron(g.rect(3.8, 8.2, 20.2, 10.6), { outline: 0 }),
    g.gilt(g.rr(5.4, 12.4, 9.8, 15.8, 0.8), { thin: true }),
    g.lead([[[5.6, 14.1], [9.6, 14.1]], [[7.6, 12.6], [7.6, 15.6]]], { w: 0.3, op: 0.7 }),
    g.glass(g.foil(16.4, 14.6, 1.9, 4, -45), 'c1', { outline: 0.3, glint: false }),
  ],
  // two carved stone set-squares framing a pane of sapphire glass
  crop: (icon, g) => [
    g.glass(g.rect(7.2, 7.2, 16.8, 16.8), 'c2', { tracery: 'quarry', medallion: false, s: 2.4, outline: 0.3 }),
    g.stone(g.stroke([[6, 2.6], [6, 18], [21.4, 18]], 2.4), { ticks: [[[4, 7], [8, 7]], [[4, 12], [8, 12]], [[11, 16], [11, 20]], [[16, 16], [16, 20]]] }),
    g.stone(g.stroke([[2.6, 6], [18, 6], [18, 21.4]], 2.4), { ticks: [[[8, 4], [8, 8]], [[13, 4], [13, 8]], [[16, 11], [20, 11]], [[16, 16], [20, 16]]] }),
  ],
  // a stone sight ring on sapphire glass, gilded cross bars, ruby bead
  crosshair: (icon, g) => [
    ...roundel(g, 'c2', { r: 8.4, cx: 12, cy: 12, n: 8, ri: 3.4, joints: 8 }),
    g.gilt(g.union(g.seg(12, 2.4, 12, 7.4, 1.9), g.seg(12, 16.6, 12, 21.6, 1.9), g.seg(2.4, 12, 7.4, 12, 1.9), g.seg(16.6, 12, 21.6, 12, 1.9)), { plate: 'A' }),
    g.gilt(g.circle(12, 12, 2.1), { plate: 'S', glint: false }),
    g.glass(g.circle(12, 12, 1.35), 'c1', { plate: 'S', outline: 0.2, glint: false }),
  ],
  // a crown: gilded points round ruby velvet, a jewelled band, pearls on the tips
  crown: (icon, g) => {
    const C = g.poly([[5.2, 16.4], [3, 7.2], [8, 10.6], [12, 4.2], [16, 10.6], [21, 7.2], [18.8, 16.4]])
    return [
      g.gilt(C),
      g.glass(g.shrink(C, 1.3), 'c1', { tracery: 'none', outline: 0, dark: 0.45 }),
      g.gilt(g.rr(5, 13.4, 19, 16.6, 0.6), { thin: true }),
      g.glass(g.union(g.circle(8.4, 15, 0.85), g.circle(15.6, 15, 0.85)), 'c2', { outline: 0.28, glint: false }),
      g.glass(g.ngon(12, 15, 1.25, 4), 'c4', { outline: 0.28, glint: false }),
      g.stone(g.union(g.circle(3, 6.6, 1.25), g.circle(12, 3.5, 1.35), g.circle(21, 6.6, 1.25)), { thin: true, outline: 0.32 }),
      g.gilt(g.rr(5, 18.4, 19, 20.6, 1), { plate: 'A' }),
    ]
  },
  // a ruby cup with a stone lid, a gilded straw
  'cup-soda': (icon, g) => [
    g.gilt(g.stroke([[12.4, 8], [13.8, 2.8], [17.2, 2.8]], 1.6), { plate: 'A', thin: true }),
    ...g.pane(g.path('M5.2 8.6 L6.6 20 A1.6 1.6 0 0 0 8.2 21.4 H15.8 A1.6 1.6 0 0 0 17.4 20 L18.8 8.6 Z'), 'c1', { frame: 1.4, tracery: [[[2, 13.2], [22, 13.2]], [[9.6, 13.2], [10.2, 22]], [[14.4, 13.2], [13.8, 22]]] }),
    g.stone(g.rr(3.4, 7, 20.6, 9.4, 1.1), { thin: true }),
  ],
  // a sapphire glass pointer in a stone frame, a gilded tail
  cursor: (icon, g) => [
    g.gilt(g.seg(11.8, 13.6, 15.6, 20.8, 2.4), { plate: 'A' }),
    ...g.pane(g.poly([[5, 2.6], [19.2, 12.6], [11.6, 13.6], [7.4, 19.8]]), 'c2', { frame: 1.4, tracery: [[[5, 2.6], [13.6, 13.4]], [[5, 2.6], [9.8, 16.6]]] }),
  ],
  // a round tower of drums: ashlar stone, gold glass top, gilded courses, glowing loops
  database: (icon, g) => [
    g.stone(g.union(g.ellipse(12, 5.8, 7.8, 3), g.rect(4.2, 5.8, 19.8, 18.2), g.ellipse(12, 18.2, 7.8, 3)), { ashlar: { h: 2.4, w: 3.4, y0: 7.4, y1: 21 } }),
    g.glass(g.ellipse(12, 5.8, 6.4, 1.8), 'c3', { outline: 0.4, glow: 0.26 }),
    g.gilt(g.inter(g.union(g.stroke(half(12, 10.6, 7.8, 3), 1.3), g.stroke(half(12, 14.8, 7.8, 3), 1.3)), g.rect(4.2, 0, 19.8, 24)), { thin: true, glint: false, outline: 0.3 }),
    g.recess(g.union(g.lancet(10.9, 14.4, 13.1, 17.1, 1), g.lancet(6.5, 14, 8.5, 16.6, 1), g.lancet(15.5, 14, 17.5, 16.6, 1)), { glow: 'c3', glowOp: 0.7, outline: 0.25 }),
  ],
  // a disc: a sapphire rose window with a gold medallion and a dark spindle hole
  disc: (icon, g) => [
    ...g.rose(11.8, 11.8, 9.6, 'c2', { n: 16, frame: 1.7, medal: 'c3' }),
    g.recess(g.circle(11.8, 11.8, 1.2), { outline: 0.2 }),
  ],
  // a double helix of gilded strands with jewel glass rungs
  dna: (icon, g) => [
    g.glass(g.union(g.seg(9.2, 4.2, 14.8, 4.2, 1.5), g.seg(9.4, 14, 14.6, 14, 1.5)), 'c1', { outline: 0.35, glint: false }),
    g.glass(g.union(g.seg(9.4, 10, 14.6, 10, 1.5), g.seg(9.2, 19.8, 14.8, 19.8, 1.5)), 'c2', { outline: 0.35, glint: false }),
    g.gilt(g.stroke('M7 2.6 C7 7.5 17 7 17 12 C17 17 7 16.5 7 21.4', 2)),
    g.gilt(g.stroke('M17 2.6 C17 7.5 7 7 7 12 C7 17 17 16.5 17 21.4', 2)),
  ],
  // a hound like a carved corbel: gold glass face, ruby glass ears, glowing eyes
  // a hound's head carved like a corbel: smooth limestone, long floppy ears of ruby glass,
  // a gold glass blaze down the brow, dark eyes, an iron nose over a clear muzzle
  dog: (icon, g) => {
    const head = g.path('M12 4 C15.7 4 17.5 6.5 17.5 9.8 C17.5 12 16.7 13.2 16.5 15.2 C16.2 18.7 14.6 20.9 12 20.9 C9.4 20.9 7.8 18.7 7.5 15.2 C7.3 13.2 6.5 12 6.5 9.8 C6.5 6.5 8.3 4 12 4 Z')
    const earL = g.path('M8.6 5 C6.2 4 3.3 5.2 2.7 8.6 C2.2 11.6 2.6 15 4.1 16.1 C5.5 17 7 15.6 7.6 13 C8.2 10.6 9 7.4 8.6 5 Z')
    return [
      g.stone(head),
      g.glass(g.path('M12 5.4 C13.2 5.4 13.6 7 13.4 8.6 L12.8 12.4 H11.2 L10.6 8.6 C10.4 7 10.8 5.4 12 5.4 Z'), 'c3', { outline: 0.3, glint: false, glow: 0.3 }),
      g.lead([[[8.6, 15.4], [9.6, 13.8], [12, 13.2], [14.4, 13.8], [15.4, 15.4]], [[10, 18.6], [11, 18.9], [12, 17.7], [13, 18.9], [14, 18.6]], [[12, 16.8], [12, 17.8]]], { w: 0.42, op: 0.85 }),
      g.recess(g.union(g.ellipse(9.6, 10.6, 1.05, 1.25), g.ellipse(14.4, 10.6, 1.05, 1.25)), { outline: 0.18 }),
      g.shine(g.union(g.circle(9.3, 10.1, 0.36), g.circle(14.1, 10.1, 0.36)), { op: 0.9 }),
      g.iron(g.path('M10.1 14.9 C10.1 14 13.9 14 13.9 14.9 C13.9 16 12.9 16.9 12 16.9 C11.1 16.9 10.1 16 10.1 14.9 Z'), { outline: 0.3 }),
      g.glass(earL, 'c1', { plate: 'A', tracery: [[[7.6, 6], [4.6, 15.6]]], glint: false }),
      g.glass(g.flipX(earL, 12), 'c1', { plate: 'A', tracery: [[[16.4, 6], [19.4, 15.6]]], glint: false }),
    ]
  },
  // a gilded S over a carved stone staff
  'dollar-sign': (icon, g) => [
    g.stone(g.seg(12, 2.6, 12, 21.4, 1.7), { thin: true }),
    g.gilt(g.stroke('M16.4 7.6 C15.8 6 14.4 5 12 5 C9.2 5 7.4 6.4 7.4 8.6 C7.4 13.2 16.6 10.8 16.6 15.4 C16.6 17.6 14.6 19 12 19 C9.4 19 7.8 18 7.2 16.4', 2.5)),
    ...jewels(g, [[16.6, 7.4], [7.1, 16.6]]),
  ],
  // a ring of ruby glaze in a stone crust, gilded sprinkles
  donut: (icon, g) => [
    ...g.pane(g.region(circ(11.8, 12, 9.4, 64), circ(11.8, 12, 3, 32)), 'c1', { frame: 1.6, tracery: 'none', glass: { glow: 0.22 } }),
    g.lead([[[8, 7], [9.2, 6.6]], [[14.6, 6.6], [15.6, 7.4]], [[17.2, 11.4], [17, 12.6]], [[14.4, 16.8], [15.4, 16]], [[8.8, 17], [7.8, 16.2]], [[6, 12.6], [6.2, 11.4]], [[11.6, 5.8], [12.6, 5.8]], [[12, 18.4], [11, 18]]], { role: 'c3', w: 0.75 }),
  ],
  // a pointed doorway in ashlar, candlelight within, a ruby door swung open on gilt straps
  'door-open': (icon, g) => [
    ...g.ground(
      g.stone(g.lancet(3, 2.4, 17.2, 21.4, 0.9), { ashlar: { h: 2.3, w: 3.2, y0: 2.4, y1: 21.4 } }),
      g.recess(g.lancet(6, 5.6, 14.2, 21.4, 0.9), { glow: 'c3', glowOp: 0.75, outline: 0 }),
    ),
    g.glass(g.poly([[14.4, 7.2], [20.8, 4.4], [20.8, 21.4], [14.4, 21.4]]), 'c1', { plate: 'A', tracery: 'lancet', s: 2.2, dark: 0.4 }),
    g.gilt(g.union(g.seg(14.8, 10.6, 19.8, 9, 1), g.seg(14.8, 17.4, 19.8, 17.2, 1)), { plate: 'A', thin: true, outline: 0.3, glint: false }),
  ],
  // a stone tray receiving a gilded arrow
  download: (icon, g) => [
    g.stone(g.stroke([[3.8, 14.6], [3.8, 19.6], [20.2, 19.6], [20.2, 14.6]], 2.5), { ticks: [[[1, 17.2], [6, 17.2]], [[8, 18], [8, 22]], [[12, 18], [12, 22]], [[16, 18], [16, 22]], [[18, 17.2], [23, 17.2]]] }),
    g.gilt(g.union(g.rr(2.3, 12.8, 5.3, 14.6, 0.6), g.rr(18.7, 12.8, 21.7, 14.6, 0.6)), { thin: true, glint: false }),
    ...arrow(g, [[12, 4], [12, 16.8]], 0.74, 2.5, { tail: true }).parts,
  ],
})

// ---- batch 3: drag-handle .. gem ---------------------------------------------------------------
// a file leaf with a gilded sign laid on its glass
const onPage = (role, sign, o = {}) => (icon, g) => [...page(g, role, { tracery: 'quarry', ...o, glass: { medallion: false, s: 2.6, dark: 0.42, ...o.glass } }), ...[sign(g)].flat()]
const lens = (g, cx, cy, r, plate = 'S') => [
  g.gilt(g.seg(cx + r * 0.62, cy + r * 0.62, cx + r * 1.55, cy + r * 1.55, Math.max(1.5, r * 0.6)), { plate }),
  ...g.plate(plate, g.rose(cx, cy, r, 'c2', { n: 6, frame: Math.max(0.8, r * 0.26), medal: 'c3' })),
]
const fileArrow = (g, down) => arrow(g, down ? [[11.8, 9.2], [11.8, 19.4]] : [[11.8, 19.4], [11.8, 9.2]], 0.52, 1.9, { plate: 'S' }).parts

Object.assign(R, {
  // six gilded quatrefoil studs, each set with a ruby glass bead
  'drag-handle': (icon, g) => {
    const P = [[9, 5.6], [15, 5.6], [9, 12], [15, 12], [9, 18.4], [15, 18.4]]
    return [
      g.gilt(g.union(...P.map(([x, y]) => g.foil(x, y, 2.3, 4, -45))), { glint: false }),
      g.glass(g.union(...P.map(([x, y]) => g.circle(x, y, 0.95))), 'c1', { outline: 0.24, glint: false, glow: 0.34 }),
    ]
  },
  // a droplet of sapphire glass, leaded like a rose round a gold medallion
  droplet: (icon, g) => g.pane(g.path('M12 2.4 C12 2.4 4.8 9.8 4.8 14.4 A7.2 7.2 0 0 0 19.2 14.4 C19.2 9.8 12 2.4 12 2.4 Z'), 'c2', { frame: 1.6, tracery: 'rose', glass: { n: 8, at: { c: [12, 14.6], r: 4.6 }, medal: 'c3' } }),
  // a dumbbell: gilded bar, ruby glass weights in gilt, stone end caps
  dumbbell: (icon, g) => [
    g.gilt(g.seg(2.6, 12, 21.4, 12, 2)),
    g.stone(g.union(g.rr(2, 8.4, 4.2, 15.6, 0.9), g.rr(19.8, 8.4, 22, 15.6, 0.9)), { thin: true }),
    g.gilt(g.union(g.rr(5.6, 4.4, 10, 19.6, 1.6), g.rr(14, 4.4, 18.4, 19.6, 1.6))),
    g.glass(g.union(g.rr(6.6, 5.4, 9, 18.6, 0.9), g.rr(15, 5.4, 17.4, 18.6, 0.9)), 'c1', { outline: 0.3, tracery: 'lancet', s: 2.2 }),
  ],
  // a carved stone frame with a ruby quill-pencil: gilded cap, stone point
  edit: (icon, g) => {
    const P = g.path('M9 15 L10.06 10.4 L17.13 3.33 A2.5 2.5 0 0 1 20.67 6.87 L13.6 13.94 Z')
    return [
      g.stone(g.stroke('M10.5 5 H5 A2 2 0 0 0 3 7 V19 A2 2 0 0 0 5 21 H17 A2 2 0 0 0 19 19 V13.5', 2.3), { ticks: [[[1, 12], [5, 12]], [[10, 19], [10, 23]], [[17, 16.6], [21, 16.6]]] }),
      g.cut(g.grow(P, 0.8)),
      g.glass(P, 'c1', { plate: 'A', tracery: [[[11.8, 12.2], [19, 5]]] }),
      g.gilt(g.inter(P, g.poly([[13.4, 2], [24, 2], [24, 12.6]])), { plate: 'A', outline: 0.3 }),
      g.stone(g.poly([[9, 15], [10.06, 10.4], [13.6, 13.94]]), { plate: 'A', thin: true, outline: 0.3 }),
    ]
  },
  // an egg of ruby glass in a jewelled gilt-leaded trellis
  egg: (icon, g) => g.pane(g.path('M12 2.4 C16.3 2.4 19.1 8.7 19.1 13.75 C19.1 18.5 16 21.5 12 21.5 C8 21.5 4.9 18.5 4.9 13.75 C4.9 8.7 7.7 2.4 12 2.4 Z'), 'c1', { frame: 1.5, tracery: 'quarry', glass: { s: 2.5, medal: 'c3', at: { c: [12, 13.6], r: 3.9 } } }),
  // an eraser: ruby glass block, stone rubber, gilt rule
  eraser: (icon, g) => {
    const B = g.path('M9 20.5 L4.41 15.91 A2 2 0 0 1 4.41 13.09 L13.59 3.91 A2 2 0 0 1 16.41 3.91 L19.59 7.09 A2 2 0 0 1 19.59 9.91 Z')
    return [
      g.gilt(g.seg(9.4, 20.6, 21, 20.6, 1.6), { thin: true }),
      g.glass(B, 'c1', { tracery: [[[9.4, 9], [15.4, 15]], [[12.4, 6], [18.4, 12]]], plate: 'A' }),
      g.stone(g.inter(B, g.poly([[0, 4.5], [0, 24], [19.5, 24]])), { plate: 'A', outline: 0.35 }),
    ]
  },
  // a gilded euro sign, its bars carved stone
  euro: (icon, g) => [
    g.gilt(g.stroke('M18.4 6.8 A7.2 7.2 0 1 0 18.4 17.2', 2.5)),
    g.stone(g.union(g.seg(3.4, 10, 13, 10, 1.7), g.seg(3.4, 14, 13, 14, 1.7)), { thin: true }),
    ...jewels(g, [[18.6, 6.6], [18.6, 17.4]]),
  ],
  // a sapphire pane in an open stone frame, a gilded arrow flying out of it
  'external-link': (icon, g) => {
    const a = arrow(g, [[10.6, 13.4], [20.8, 3.2]], 0.66, 2.3)
    return [
      g.glass(g.rr(4.4, 5.8, 18.2, 19.8, 1.4), 'c2', { tracery: 'quarry', medallion: false, s: 2.4, outline: 0.3 }),
      g.stone(g.stroke('M10.5 4.8 H5.4 A2 2 0 0 0 3.4 6.8 V18.6 A2 2 0 0 0 5.4 20.6 H17 A2 2 0 0 0 19 18.6 V13.6', 2.3), { ticks: [[[1, 12], [6, 12]], [[11, 18], [11, 23]], [[17, 17], [21, 17]]] }),
      moat(g, a.F, 0.8),
      ...a.parts,
    ]
  },
  // an eye: limestone almond, a sapphire rose-window iris, a dark pupil
  eye: (icon, g) => [
    g.stone(g.path('M2.4 12 C4.4 7.3 8 4.8 12 4.8 C16 4.8 19.6 7.3 21.6 12 C19.6 16.7 16 19.2 12 19.2 C8 19.2 4.4 16.7 2.4 12 Z')),
    ...g.plate('A', g.rose(12, 12, 4.9, 'c2', { n: 8, frame: 0.9, medal: 'c3' })),
    g.recess(g.circle(12, 12, 1.25), { plate: 'A', outline: 0.2 }),
  ],
  'eye-off': (icon, g) => [
    g.stone(g.path('M2.4 12 C4.4 7.3 8 4.8 12 4.8 C16 4.8 19.6 7.3 21.6 12 C19.6 16.7 16 19.2 12 19.2 C8 19.2 4.4 16.7 2.4 12 Z')),
    ...g.plate('A', g.rose(12, 12, 4.9, 'c2', { n: 8, frame: 0.9, medal: 'c3' })),
    g.recess(g.circle(12, 12, 1.25), { plate: 'A', outline: 0.2 }),
    ...g.slash(3.4, 3.4, 20.6, 20.6),
  ],
  // a mill of ashlar: sawtooth roof, a tall chimney, gold glass lancets lit from within
  factory: (icon, g) => [
    g.stone(g.path('M4.5 21 A1.5 1.5 0 0 1 3 19.5 V12 L8 9 V12 L13 9 V12 H16.5 V4.5 A1 1 0 0 1 17.5 3.5 H19.5 A1 1 0 0 1 20.5 4.5 V19.5 A1.5 1.5 0 0 1 19 21 Z'), { ashlar: { h: 2.2, w: 3.2, y0: 3.5, y1: 21 } }),
    g.glass(g.union(g.lancet(5.2, 13.8, 7.9, 18.8, 1), g.lancet(9.6, 13.8, 12.3, 18.8, 1), g.lancet(14, 13.8, 16.7, 18.8, 1)), 'c3', { outline: 0.38, glint: false, glow: 0.34, tracery: [[[0, 16.6], [24, 16.6]]] }),
    g.gilt(g.rr(16.1, 6.4, 20.9, 7.6, 0.4), { thin: true, outline: 0.3, glint: false }),
  ],
  // two ruby glass arrowheads in stone
  'fast-forward': (icon, g) => {
    const t2 = g.path('M12 6.6 C12 5.6 13 5.1 13.8 5.6 L20.8 10.6 C21.6 11.2 21.6 12.8 20.8 13.4 L13.8 18.4 C13 18.9 12 18.4 12 17.4 Z')
    return [
      ...g.pane(g.path('M2.6 6.6 C2.6 5.6 3.6 5.1 4.4 5.6 L11.4 10.6 C12.2 11.2 12.2 12.8 11.4 13.4 L4.4 18.4 C3.6 18.9 2.6 18.4 2.6 17.4 Z'), 'c1', { frame: 1.2, tracery: [[[2, 12], [12, 12]]] }),
      moat(g, t2, 0.6),
      ...g.pane(t2, 'c1', { frame: 1.2, tracery: [[[11, 12], [22, 12]]], plate: 'A' }),
    ]
  },

  // ---- files: the exemplar leaf, a gilded sign on the glass ------------------------------
  // the leaf with a gilded zip: a column of interlocking teeth down to a pierced pull
  'file-archive': onPage('c2', g => {
    const T = []
    for (let k = 0; k < 4; k++) {
      const y = 4.1 + 2.1 * k
      T.push(g.rr(9.1, y, 11.9, y + 1.35, 0.35), g.rr(11.1, y + 1.07, 13.9, y + 2.42, 0.35))
    }
    return [
      g.gilt(g.union(...T), { plate: 'S', thin: true, outline: 0.3, glint: false }),
      g.gilt(g.path('M10.1 12.7 H12.9 L14.7 15 V18.9 A1.3 1.3 0 0 1 13.4 20.2 H9.6 A1.3 1.3 0 0 1 8.3 18.9 V15 Z'), { plate: 'S' }),
      g.recess(g.lancet(10.3, 15.2, 12.7, 18.6, 1), { outline: 0, plate: 'S', glow: 'c3', glowOp: 0.4 }),
    ]
  }),
  'file-audio': onPage('c1', g => g.gilt(g.union(g.seg(13.8, 9.6, 13.8, 16.4, 1.5), g.stroke('M13.8 9.6 C14.4 11 16.2 11.2 16.2 13', 1.4), g.ellipse(11.6, 16.8, 2.4, 1.9)), { plate: 'S' })),
  'file-check': onPage('c4', g => g.gilt(g.stroke([[8.4, 14.2], [10.9, 16.7], [15.6, 11.4]], 2.2), { plate: 'S' })),
  'file-code': onPage('c2', g => g.gilt(g.union(g.stroke([[10.2, 11.4], [7.9, 14.2], [10.2, 17]], 1.6), g.stroke([[13.6, 11.4], [15.9, 14.2], [13.6, 17]], 1.6)), { plate: 'S' })),
  'file-down': onPage('c2', g => fileArrow(g, true)),
  'file-up': onPage('c2', g => fileArrow(g, false)),
  'file-image': (icon, g) => {
    const inner = g.shrink(g.path(PAGE), 1.5)
    return [
      ...page(g, 'c2', { glass: { dark: 0.3 } }),
      g.glass(g.inter(inner, g.poly([[5, 22], [15.6, 13.2], [20, 17.4], [20, 22]])), 'c4', { outline: 0.35, glint: false, plate: 'S' }),
      g.glass(g.circle(9.8, 11.4, 1.7), 'c3', { outline: 0.35, glint: false, plate: 'S' }),
    ]
  },
  'file-lock': onPage('c1', g => [
    g.gilt(g.stroke('M9.9 13.4 V12 A2.1 2.1 0 0 1 14.1 12 V13.4', 1.3), { plate: 'S', thin: true }),
    g.gilt(g.rr(8.4, 13.2, 15.6, 18.8, 1), { plate: 'S' }),
    g.recess(g.union(g.circle(12, 15.3, 0.75), g.poly([[11.5, 15.5], [12.5, 15.5], [12.8, 17.4], [11.2, 17.4]])), { plate: 'S', outline: 0, glow: 'c3' }),
  ]),
  'file-minus': onPage('c2', g => g.gilt(g.glyph('minus', 11.9, 14.4, 0.95, 2.1), { plate: 'S' })),
  'file-plus': onPage('c2', g => g.gilt(g.glyph('plus', 11.9, 14.4, 0.95, 2.1), { plate: 'S' })),
  'file-x': onPage('c1', g => g.gilt(g.glyph('x', 11.9, 14.4, 1.05, 2.1), { plate: 'S' })),
  'file-pdf': onPage('c1', g => g.gilt(g.stroke('M10 18.6 V10.6 H12.6 A2.35 2.35 0 0 1 12.6 15.3 H10', 1.9), { plate: 'S' })),
  'file-search': onPage('c2', g => lens(g, 11.2, 13.4, 3.4), { glass: { dark: 0.45 } }),
  'file-spreadsheet': onPage('c4', g => g.stone(g.union(g.seg(5.6, 12.4, 18.4, 12.4, 1.2), g.seg(5.6, 16.8, 18.4, 16.8, 1.2), g.seg(10.5, 12.4, 10.5, 20.4, 1.2)), { thin: true, outline: 0.32 })),
  'file-text': onPage('c2', g => g.gilt(g.union(g.seg(8.2, 11.6, 15.8, 11.6, 1.3), g.seg(8.2, 14.6, 15.8, 14.6, 1.3), g.seg(8.2, 17.6, 13, 17.6, 1.3)), { plate: 'S', thin: true })),
  'file-video': onPage('c1', g => g.gilt(g.path('M10 11.4 C10 10.7 10.7 10.4 11.3 10.8 L15.6 13.7 C16.1 14.1 16.1 14.7 15.6 15.1 L11.3 18 C10.7 18.4 10 18.1 10 17.4 Z'), { plate: 'S' })),
  // two leaves: an ashlar tablet behind a glazed one
  files: (icon, g) => [
    g.stone(g.rr(8.6, 2.4, 21.4, 17.6, 2), { ashlar: { h: 2.2, w: 3.2, y0: 2.4, y1: 17.6 } }),
    g.cut(g.path('M4.5 5.6 H13.6 L18.3 10.3 V19.9 A2.2 2.2 0 0 1 16.1 22.1 H4.5 A2.2 2.2 0 0 1 2.3 19.9 V7.8 A2.2 2.2 0 0 1 4.5 5.6 Z')),
    ...g.pane(g.path('M4.6 6.4 H13.2 L17.6 10.8 V19.6 A1.8 1.8 0 0 1 15.8 21.4 H4.6 A1.8 1.8 0 0 1 2.8 19.6 V8.2 A1.8 1.8 0 0 1 4.6 6.4 Z'), 'c2', { frame: 1.4, tracery: 'quarry', plate: 'A', glass: { at: { c: [10, 14.6], r: 3.6 } } }),
    g.gilt(g.poly([[13.2, 6.5], [13.2, 10.6], [17.5, 10.6]]), { plate: 'A' }),
  ],
  // a strip of film: stone with dark sprocket holes, ruby glass frames
  film: (icon, g) => [
    g.stone(g.rr(2.2, 4, 21.8, 20, 2)),
    g.glass(g.rect(3.6, 8.1, 20.4, 15.9), 'c1', { outline: 0.38, tracery: [[[12, 0], [12, 24]]], glow: 0.24 }),
    g.recess(g.union(...[4.6, 8.9, 13.3, 17.6].flatMap(x => [g.rr(x, 5.3, x + 1.9, 6.9, 0.4), g.rr(x, 17.1, x + 1.9, 18.7, 0.4)])), { outline: 0, glow: 'c3', glowOp: 0.35 }),
  ],
  // a funnel of sapphire glass in stone, leaded into lights
  filter: (icon, g) => g.pane(g.path('M4.64 3.2 L19.36 3.2 A1.1 1.1 0 0 1 20.2 5 L14.4 12.1 A1.5 1.5 0 0 0 14.05 13.04 V18.8 A0.6 0.6 0 0 1 13.72 19.34 L10.76 20.84 A0.6 0.6 0 0 1 9.95 20.3 V13.04 A1.5 1.5 0 0 0 9.6 12.1 L3.8 5 A1.1 1.1 0 0 1 4.64 3.2 Z'), 'c2', { frame: 1.4, tracery: [[[2, 7.8], [22, 7.8]], [[12, 2], [12, 22]]] }),
  // a fingerprint: a carved stone outer ridge, gilded inner whorls
  // a fingerprint as a portal's receding archivolts: a carved stone outer arch, a gilded
  // middle arch, the core ridge a ruby glass inlay
  fingerprint: (icon, g) => {
    const outer = g.lancetPts(4, 3.2, 20, 18, 0.78)
    outer[outer.length - 1] = [20, 14]
    const mid = [[9, 21], [8.4, 19.4], [8, 17.4], ...g.lancetPts(8, 7.2, 16, 16.4, 0.78).slice(1, -1), [16, 16.2]]
    return [
      g.stone(g.stroke(outer, 2.2), { ticks: [[[2, 13], [6, 13]], [[5.6, 6], [7.6, 7.6]], [[12, 1.4], [12, 5]], [[18.4, 6], [16.4, 7.6]], [[18, 11], [22, 11]]] }),
      g.gilt(g.union(g.stroke(mid, 1.9), g.stroke('M20 18 C19.5 19.25 19 20.25 18 21', 1.9)), { plate: 'A' }),
      g.glass(g.stroke('M12 11 V15 C12 17.25 12.5 19 13.5 20.5', 1.9), 'c1', { plate: 'A', glow: 0.34, glint: false }),
    ]
  },
  // a fish of sapphire glass scaled in diamond leads, a gilded tail, a glowing eye
  fish: (icon, g) => [
    g.gilt(g.path('M7.6 12 L3.5 8.6 C3 8.1 2.4 8.4 2.4 9.2 V14.8 C2.4 15.6 3 15.9 3.5 15.4 Z'), { plate: 'A' }),
    ...g.pane(g.path('M6.8 12 C8.9 8.1 12 6.3 15 6.3 C18.6 6.3 21.1 8.9 21.6 12 C21.1 15.1 18.6 17.7 15 17.7 C12 17.7 8.9 15.9 6.8 12 Z'), 'c2', { frame: 1.3, tracery: 'quarry', glass: { medallion: false, s: 2.2 } }),
    g.stone(g.stroke('M12.5 9.5 C13.3 11.1 13.3 12.9 12.5 14.5', 1.2), { thin: true, outline: 0.32 }),
    g.recess(g.circle(17.2, 10.8, 0.95), { glow: 'c3', glowOp: 0.7, outline: 0.25 }),
  ],
  // a ruby banner with a gold quatrefoil on a gilded staff with a fleur finial
  flag: (icon, g) => [
    g.gilt(g.seg(5, 4.4, 5, 21.5, 2), { thin: true }),
    ...g.pane(g.path('M5.2 4.4 C7.6 3.2 10 3.2 12.5 4.4 C15 5.6 17.5 5.6 20.2 4.4 V14.4 C17.5 15.6 15 15.6 12.5 14.4 C10 13.2 7.6 13.2 5.2 14.4 Z'), 'c1', { frame: 1.3, tracery: 'medallion', plate: 'A', glass: { medal: 'c3', at: { c: [12.6, 9.4], r: 3.4 } } }),
    g.finial(5, 4, 0.62, { plate: 'deco' }),
  ],
  // a flame of ruby glass round a gold glass heart, leaded like tongues of fire
  flame: (icon, g) => [
    g.glass(g.path('M12 21.5 C8.25 21.5 5 18.75 5 15 C5 11.75 5.75 9.5 7 7.5 C8 8.75 9.25 9.5 10.5 9.5 C10.25 6.5 11.5 4.25 14 2.5 C17.25 5.5 19 10 19 15 C19 18.75 15.75 21.5 12 21.5 Z'), 'c1', { tracery: [[[7, 7.5], [8.4, 14]], [[14, 2.5], [15.2, 10], [16.4, 16]], [[10.5, 9.5], [10.6, 13]]], glow: 0.24 }),
    g.glass(g.path('M12.5 18.3 A3 3 0 0 1 9.4 15.2 C9.4 13.2 11.4 12.3 12.9 10.8 C14.1 12.3 15.6 13.6 15.6 15.2 A3 3 0 0 1 12.5 18.3 Z'), 'c3', { plate: 'A', outline: 0.4, glow: 0.3 }),
  ],
  // a flask: stone glass-collar, pale sapphire glass, emerald liquor
  'flask-conical': (icon, g) => {
    const F = g.path('M9.6 3.4 V9 L4.25 18.25 A1.75 1.75 0 0 0 5.75 21 H18.25 A1.75 1.75 0 0 0 19.75 18.25 L14.4 9 V3.4 Z')
    const inner = g.shrink(F, 1.3)
    return [
      g.stone(g.rim(F, 1.3)),
      g.glass(inner, 'c2', { dark: 0.2, glow: 0.3 }),
      g.glass(g.inter(inner, g.rect(0, 14.2, 24, 24)), 'c4', { outline: 0.35, tracery: [[[9, 17.6], [10.2, 22]], [[15, 17.6], [13.8, 22]]], glint: false }),
      g.stone(g.rr(7.6, 2.2, 16.4, 4.4, 1), { thin: true }),
      g.deco(g.glass(g.union(g.circle(11, 11.6, 0.7), g.circle(13.2, 9.4, 0.55)), 'c3', { outline: 0.25, glint: false })),
    ]
  },
  // a cinquefoil flower: ruby glass petals in stone, a gilded gold-glass heart
  flower: (icon, g) => [
    ...g.pane(g.foil(12, 12.6, 9.6, 5, -90), 'c1', { frame: 1.5, tracery: rays(12, 12.6, 3, 10, 5, -54), glass: { glint: false } }),
    g.gilt(g.circle(12, 12.6, 3.4), { plate: 'A' }),
    g.glass(g.circle(12, 12.6, 2.2), 'c3', { plate: 'A', outline: 0.3, tracery: 'none', glint: false }),
  ],

  // ---- folders: the exemplar folder, its badge or lens on the glass --------------------------
  'folder-plus': (icon, g) => [...folder(g, 'c3', { tracery: 'lancet' }), ...g.badge('plus', 17.2, 16.9, 4.1)],
  'folder-minus': (icon, g) => [...folder(g, 'c3', { tracery: 'lancet' }), ...g.badge('minus', 17.2, 16.9, 4.1)],
  'folder-search': (icon, g) => [...folder(g, 'c3', { tracery: 'none' }), g.cut(g.circle(15.4, 15.2, 4.6)), ...lens(g, 15.4, 15.2, 3.6)],
  'folder-open': (icon, g) => [
    g.stone(g.path('M5 20.4 A2 2 0 0 1 3 18.4 V6.8 A2 2 0 0 1 5 4.8 H9 L11 6.8 H17 A2 2 0 0 1 19 8.8 V12 H7 Z'), { ashlar: { h: 2, w: 3.2, y0: 4.8, y1: 12 } }),
    ...g.pane(g.path('M4.4 20.6 L6.9 12.3 A1.6 1.6 0 0 1 8.4 11.2 H19.9 A1.6 1.6 0 0 1 21.4 13.3 L19.7 18.9 A2.3 2.3 0 0 1 17.5 20.6 Z'), 'c3', { frame: 1.3, tracery: 'quarry', plate: 'A', glass: { s: 2.4 } }),
  ],

  // a ball of limestone, ruby glass panels set in leaded seams
  football: (icon, g) => {
    const outer = [0, 1, 2, 3, 4].map(k => { const a = rad(-54 + 72 * k); return g.ngon(12 + 9.4 * Math.cos(a), 12 + 9.4 * Math.sin(a), 3.6, 5, -54 + 72 * k + 180) })
    return [
      g.stone(g.circle(12, 12, 9.5)),
      g.glass(g.inter(g.union(...outer), g.circle(12, 12, 8.6)), 'c1', { outline: 0.38, glint: false, glow: 0.1 }),
      g.lead(rays(12, 12, 3.6, 7, 5, -90), { w: 0.6 }),
      g.glass(g.ngon(12, 12, 3.9, 5, -90), 'c1', { outline: 0.42, tracery: 'none', glow: 0.24 }),
    ]
  },
  // a curved gilded arrow
  forward: (icon, g) => arrow(g, [[4.4, 19.3], [4.4, 16.5], ...g.arcPts(11.4, 16.5, 7, 180, 270, 0.5), [21.2, 9.5]], 0.74, 2.5, { plate: 'K', tail: true }).parts,
  // a sad face of gold glass in a stone ring
  // a sorrowing face as a rose-window boss: stone rim, a ring of sapphire petals, a gilded
  // roundel face with its features cut as lead (brows lifted, mouth turned down)
  frown: (icon, g) => faceBoss(g, [
    g.recess(g.stroke('M9.2 16 C10 14.4 14 14.4 14.8 16', 1.2), { plate: 'A', outline: 0.12 }),
    g.lead([[[8.5, 9.1], [10.5, 8.4]], [[15.5, 9.1], [13.5, 8.4]]], { w: 0.55, plate: 'A' }),
  ]),
  // a fuel pump as a little tower: ashlar, a gold lancet light, a gilded hose
  // a fuel pump: smooth carved stone body on a plinth, an emerald lancet gauge window with a
  // gilt needle, a gilded hose looping to the nozzle hung on the side
  fuel: (icon, g) => [
    g.gilt(g.stroke('M12.4 13 H14.6 A1.6 1.6 0 0 1 16.2 14.6 V17.6 A2.1 2.1 0 0 0 20.4 17.6 V10.4', 1.7), { plate: 'A' }),
    g.gilt(g.union(g.rr(19, 8.2, 21.8, 12.2, 0.9), g.seg(19.9, 8.8, 17.6, 5.6, 1.5)), { plate: 'A' }),
    g.stone(g.path('M3.4 20.4 V5.4 A2.4 2.4 0 0 1 5.8 3 H10.2 A2.4 2.4 0 0 1 12.6 5.4 V20.4 Z')),
    ...g.pane(g.lancet(4.9, 4.4, 11.1, 11.4, 0.85), 'c4', { frame: 0.9, tracery: 'none', glass: { glow: 0.26 } }),
    g.gilt(g.union(g.seg(8, 10.4, 9.8, 6.9, 0.7), g.circle(8, 10.4, 0.85)), { thin: true, outline: 0.28, glint: false, plate: 'A' }),
    g.stone(g.rr(4.6, 13.2, 11.4, 14.4, 0.5), { thin: true, role: 'edge', outline: 0.25 }),
    g.stone(g.rr(2.3, 19.4, 13.7, 21.5, 0.6), { thin: true }),
  ],
  // a gallery: a central lancet light between two slim stone colonnettes
  'gallery-horizontal': (icon, g) => [
    g.stone(g.union(g.seg(3, 7, 3, 17, 2), g.seg(21, 7, 21, 17, 2)), { thin: true }),
    ...g.pane(g.lancet(6.8, 3.2, 17.2, 20.6, 0.8), 'c2', { frame: 1.4, tracery: 'lancet', glass: { s: 2.4 } }),
    g.stone(g.rr(6.4, 19.2, 17.6, 21.2, 0.6), { thin: true }),
  ],
  // a gamepad carved in ashlar, gilded cross, jewel buttons
  // a gamepad carved from smooth limestone: a sapphire glass cross pad, ruby and emerald
  // jewel buttons in gilt bezels, a carved trefoil between them
  gamepad: (icon, g) => {
    const pad = g.union(g.rr(4.7, 10.5, 10.1, 12.9, 0.5), g.rr(6.2, 9, 8.6, 14.4, 0.5))
    return [
      g.stone(g.path('M8 5.5 H16 C19.25 5.5 20.75 7.75 21.5 11 C22 13.25 22.5 19.5 19.5 19.5 C17.75 19.5 17 16 15 16 H9 C7 16 6.25 19.5 4.5 19.5 C1.5 19.5 2 13.25 2.5 11 C3.25 7.75 4.75 5.5 8 5.5 Z')),
      g.glass(pad, 'c2', { plate: 'A', outline: 0.38, tracery: [[[7.4, 9], [7.4, 14.4]], [[4.7, 11.7], [10.1, 11.7]]], glow: 0.3, glint: false }),
      g.gilt(g.union(g.circle(15.4, 13, 1.65), g.circle(18.1, 10.1, 1.65)), { plate: 'A', glint: false }),
      g.glass(g.circle(15.4, 13, 1.05), 'c1', { outline: 0.2, glint: false, plate: 'A', glow: 0.34 }),
      g.glass(g.circle(18.1, 10.1, 1.05), 'c4', { outline: 0.2, glint: false, plate: 'A', glow: 0.34 }),
      g.recess(g.foil(12, 8.3, 1.05, 3, -90), { outline: 0.1, glow: 'c3', glowOp: 0.45 }),
    ]
  },
  // a half rose window dial with a gilded needle
  gauge: (icon, g) => [
    ...g.pane(g.inter(g.circle(12, 14, 9.2), g.rect(0, 0, 24, 19.6)), 'c2', { frame: 1.6, tracery: [...ringArcs(12, 14, 4.2), ...rays(12, 14, 4.2, 10, 7, -210).concat(rays(12, 14, 4.2, 10, 7, -210 + 360 / 7 * 0.5)).filter(l => l[1][1] < 18.5)] }),
    g.gilt(g.seg(12, 14, 15.9, 10.1, 1.6), { plate: 'A' }),
    g.gilt(g.circle(12, 14, 1.8), { plate: 'A', glint: false }),
    g.glass(g.circle(12, 14, 1), 'c1', { plate: 'A', outline: 0.2, glint: false }),
  ],
  // a cut gem of sapphire glass, its facets leaded
  gem: (icon, g) => [
    ...g.pane(g.poly([[7, 3.4], [17, 3.4], [21.6, 9], [12, 21.2], [2.4, 9]]), 'c2', { frame: 1.2, tracery: [[[2, 9], [22, 9]], [[10, 3.4], [8.5, 9], [12, 21]], [[14, 3.4], [15.5, 9], [12, 21]]] }),
    g.shine(g.poly([[8.4, 4.8], [9.6, 4.8], [8.4, 8.2], [5.4, 8.2]]), { op: 0.35 }),
  ],
})
