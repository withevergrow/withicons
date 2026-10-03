// GOTHIC hand redraws, chunk 3 of 5 (icons 201-300 alphabetically: gift .. notebook).
// Map icon name -> (icon, g) => parts, built with the frozen kit g (see forge/styles/GOTHIC-GUIDE.md).
// Names listed in EXEMPLAR (heart, home, lock, mail, music-note) are ignored here.

// ---- local helpers -----------------------------------------------------------
const RAD = Math.PI / 180
const r2 = v => Math.round(v * 100) / 100

// block joints across a stone tube along a polyline: short cuts perpendicular to it
function ticksAlong(pts, w = 2, step = 2.6, margin = 1.3) {
  const out = []
  let L = 0
  const segs = []
  for (let i = 1; i < pts.length; i++) {
    const [a, b] = [pts[i - 1], pts[i]], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (l > 1e-6) segs.push({ a, b, l, s0: L }); L += l
  }
  if (L < 2 * margin + 1) return out
  const n = Math.max(1, Math.round((L - 2 * margin) / step))
  const st = (L - 2 * margin) / n
  for (let k = 0; k <= n; k++) {
    const s = margin + k * st
    if (k === 0 || k === n) continue
    const sg = segs.find(q => s >= q.s0 && s <= q.s0 + q.l) || segs.at(-1)
    const t = (s - sg.s0) / sg.l
    const x = sg.a[0] + (sg.b[0] - sg.a[0]) * t, y = sg.a[1] + (sg.b[1] - sg.a[1]) * t
    const nx = -(sg.b[1] - sg.a[1]) / sg.l, ny = (sg.b[0] - sg.a[0]) / sg.l, h = w / 2 + 0.4
    out.push([[r2(x - nx * h), r2(y - ny * h)], [r2(x + nx * h), r2(y + ny * h)]])
  }
  return out
}
// a carved stone tube along a polyline (or a list of polylines) with block joints
function tube(g, pts, w = 2, o = {}) {
  const lines = Array.isArray(pts[0][0]) ? pts : [pts]
  return g.stone(g.stroke(lines, w), { ticks: lines.flatMap(l => ticksAlong(l, w, o.step || 2.6)), ...o })
}
// a cabochon jewel in a gilded bezel
const jewel = (g, cx, cy, r, role = 'c1', o = {}) => [
  g.gilt(g.circle(cx, cy, r), { glint: false, thin: true, plate: o.plate }),
  g.glass(g.circle(cx, cy, r - (o.bezel ?? 0.55)), role, { outline: 0.22, glint: r > 1.2, glow: 0.3, plate: o.plate }),
]
// several cabochons merged into one gilt part and one glass part
const jewels = (g, pts, r, role = 'c1', o = {}) => [
  g.gilt(g.union(...pts.map(([x, y]) => g.circle(x, y, r))), { glint: false, thin: true, plate: o.plate }),
  g.glass(g.union(...pts.map(([x, y]) => g.circle(x, y, r - 0.55))), role, { outline: 0.22, glint: false, glow: 0.3, plate: o.plate }),
]
// a gilded frame round a glass inlay
const gem = (g, F, role, o = {}) => [
  g.gilt(F, { plate: o.plate, thin: o.thin }),
  g.glass(g.shrink(F, o.rim ?? 0.6), role, { outline: 0.25, tracery: o.tracery || 'none', plate: o.plate, glint: o.glint, ...(o.glass || {}) }),
]
// stone bar (a lintel) from x0 to x1 at y, with joints
const lintel = (g, x0, y, x1, w = 2.2, o = {}) => tube(g, [[x0, y], [x1, y]], w, o)
// arc points for a circle centre (cx, cy), radius r, degrees a0 -> a1
const arcP = (g, cx, cy, r, a0, a1) => g.arcPts(cx, cy, r, a0, a1, 0.3)
// a heart outline field (the exemplar's proportions) scaled into a box
function heartF(g, cx, cy, s) {
  const p = (x, y) => `${r2(cx + (x - 12) * s)} ${r2(cy + (y - 12) * s)}`
  return g.path(`M${p(12, 20.6)} C${p(12, 20.6)} ${p(3, 15.3)} ${p(3, 9)} C${p(3, 6.2)} ${p(5.1, 4)} ${p(7.9, 4)} C${p(9.7, 4)} ${p(11.1, 5)} ${p(12, 6.6)} C${p(12.9, 5)} ${p(14.3, 4)} ${p(16.1, 4)} C${p(18.9, 4)} ${p(21, 6.2)} ${p(21, 9)} C${p(21, 15.3)} ${p(12, 20.6)} ${p(12, 20.6)} Z`)
}
// a git node: a small rose window
const node = (g, cx, cy, role = 'c2', r = 3.1) => g.rose(cx, cy, r, role, { n: 6, frame: 1.0 })

// the open hand of the hand-* icons: stone sleeve (cuff A) and palm tubes
// gilded strokes inlaid with a thread of enamel glass (a jewelled glyph)
const enamel = (g, lines, w = 2.4, role = 'c1', o = {}) => [
  g.gilt(g.stroke(lines, w), { plate: o.plate }),
  g.glass(g.stroke(lines, Math.max(0.6, w - 1.5)), role, { outline: 0.2, glint: false, glow: 0.3, plate: o.plate }),
]
// a picture window: stone frame, sapphire sky, emerald hill, gold sun
function picture(g, F, hill, sun, o = {}) {
  const inner = g.shrink(F, o.frame ?? 1.4)
  return [
    g.stone(g.rim(F, o.frame ?? 1.4)),
    g.glass(inner, 'c2', { tracery: 'none', glow: 0.22 }),
    g.glass(g.inter(hill, inner), 'c4', { outline: 0.38, plate: 'A', tracery: [-4, 0, 4, 8, 12].flatMap(k => [[[k, 24], [k + 12, 6]], [[k + 12, 24], [k, 6]]]), glint: false }),
    ...jewel(g, sun[0], sun[1], sun[2], 'c3', { plate: 'A' }),
  ]
}
// a small glazed tile of a layout: stone frame, glass with a medallion
const tile = (g, x0, y0, x1, y1, role, o = {}) => g.pane(g.rr(x0, y0, x1, y1, o.r ?? 1.5), role, { frame: o.frame ?? 1.15, tracery: o.tracery || 'medallion', plate: o.plate, glass: { glint: false, ...(o.glass || {}) } })

const handParts = (g, cuffX, top, bot, palm) => [
  tube(g, palm, 2, { step: 2.8 }),
  g.gilt(g.rr(cuffX - 1.2, top, cuffX + 1.2, bot, 0.6), { plate: 'A', thin: true }),
]

// ---- critic pass: architectural ends, corbelled rods, illuminated letters, rose faces ----
// an ogival spear head (the arrow exemplar's head) with its tip at (tx, ty) pointing at deg
function spearF(g, tx, ty, deg, L = 5, W = 4, neck = 0.9) {
  const a = deg * RAD, dx = Math.cos(a), dy = Math.sin(a)
  const P = (u, v) => `${r2(tx - dx * u * L - dy * v * W)} ${r2(ty - dy * u * L + dx * v * W)}`
  return g.path(`M${P(0, 0)} C${P(0.372, 0.167)} ${P(0.721, 0.5)} ${P(1, 1)} C${P(0.907, 0.611)} ${P(0.884, 0.278)} ${P(neck, 0)} C${P(0.884, -0.278)} ${P(0.907, -0.611)} ${P(1, -1)} C${P(0.721, -0.5)} ${P(0.372, -0.167)} ${P(0, 0)} Z`)
}
// gilded spear heads, each pierced by a small trefoil of glass: heads [[tx, ty, deg], ...]
function spears(g, heads, L = 5, W = 4, o = {}) {
  const F = g.union(...heads.map(([x, y, d]) => spearF(g, x, y, d, L, W)))
  const out = [g.gilt(F, { plate: o.plate })]
  if (o.pierce !== false && L >= 4) {
    const T = g.union(...heads.map(([x, y, d]) => g.foil(r2(x - Math.cos(d * RAD) * L * 0.5), r2(y - Math.sin(d * RAD) * L * 0.5), L * 0.2, 3, d + 180)))
    out.push(o.role ? g.glass(T, o.role, { outline: 0.18, glint: false, glow: 0.32, plate: o.plate }) : g.recess(T, { outline: 0.15, glow: 'c3', plate: o.plate }))
  }
  return out
}
// a stone shaft with a channel of glass let into it (a glazed mullion): polylines, width w
const channel = (g, lines, w = 2.3, role = 'c2', o = {}) => [
  g.stone(g.stroke(lines, w), { plate: o.plate, thin: o.thin }),
  g.glass(g.stroke(lines, Math.max(0.7, w - 1.45)), role, { outline: 0.2, glint: false, glow: 0.3, plate: o.plate }),
]
// list rows: smooth carved lintels whose end stones (l, r) are jointed and chamfered, with a
// pointed glass inlay on chosen rows. rows: [x0, y, x1, { glass, l, r, plate }]; merged per plate
function rods(g, rows, o = {}) {
  const h = o.h ?? 2.5, cw = o.cw ?? 1.75, t = (h - 1.3) / 2
  const groups = new Map()
  for (const [x0, y, x1, q = {}] of rows) {
    const pl = q.plate || o.plate || 'K'
    if (!groups.has(pl)) groups.set(pl, { shaft: [], inl: new Map(), ticks: [] })
    const B = groups.get(pl)
    const L = q.l ?? o.l ?? true, Rt = q.r ?? o.r ?? true
    // a lintel: one smooth carved bar, its end stones marked by joints, chamfered where a corbel sits
    const hh = h / 2 + 0.25, c = 0.8
    B.shaft.push(g.rr(x0, y - hh, x1, y + hh, [L ? c : hh, Rt ? c : hh, Rt ? c : hh, L ? c : hh]))
    if (L) B.ticks.push([[x0 + cw + 0.2, y - hh - 1], [x0 + cw + 0.2, y + hh + 1]])
    if (Rt) B.ticks.push([[x1 - cw - 0.2, y - hh - 1], [x1 - cw - 0.2, y + hh + 1]])
    const role = q.glass ?? o.glass
    if (role) {
      const a = x0 + (L ? cw + 0.75 : 1.1), b = x1 - (Rt ? cw + 0.75 : 1.1), k = Math.min(1.2, (b - a) / 3)
      if (b - a > 1.6) {
        if (!B.inl.has(role)) B.inl.set(role, [])
        B.inl.get(role).push(g.poly([[a, y], [a + k, y - t], [b - k, y - t], [b, y], [b - k, y + t], [a + k, y + t]]))
      }
    }
  }
  const out = []
  for (const [pl, B] of groups) {
    out.push(g.stone(g.union(...B.shaft), { plate: pl, ticks: B.ticks.length ? B.ticks : undefined }))
    for (const [role, fs] of B.inl) out.push(g.glass(g.union(...fs), role, { outline: 0.24, glint: false, glow: 0.34, plate: pl }))
  }
  return out
}
// gilded quatrefoil studs with a glass heart (list bullets, rod terminals)
const qstuds = (g, pts, R = 2.1, role = 'c1', o = {}) => [
  g.gilt(g.union(...pts.map(([x, y]) => g.foil(x, y, R, 4, o.rot ?? -45))), { plate: o.plate, glint: false }),
  g.glass(g.union(...pts.map(([x, y]) => g.circle(x, y, R * 0.4))), role, { plate: o.plate, outline: 0.2, glint: false, glow: 0.38 }),
]
// a broad-nib pen stroke (textura): polylines swept by a nib of width w held at deg
function nib(g, lines, w = 1.8, deg = -28) {
  const a = deg * RAD, nx = Math.cos(a) * w / 2, ny = Math.sin(a) * w / 2, F = []
  for (const s of lines) for (let i = 1; i < s.length; i++) {
    const [p, q] = [s[i - 1], s[i]]
    F.push(g.poly([[p[0] - nx, p[1] - ny], [p[0] + nx, p[1] + ny], [q[0] + nx, q[1] + ny], [q[0] - nx, q[1] - ny]].map(([x, y]) => [r2(x), r2(y)])))
  }
  return g.union(...F)
}
// textura numerals in a box: top-left (x, y), scale s (box 4 x 6 at s = 1)
function textura(g, ch, x, y, s = 1, w = 1.75) {
  const P = pts => pts.map(([u, v]) => [x + u * s, y + v * s])
  const dia = (u, v, r) => g.poly(P([[u, v - r], [u + r, v], [u, v + r], [u - r, v]]))
  if (ch === '1') return g.union(nib(g, [P([[2.3, 0.7], [2.3, 5.3]]), P([[1.2, 5.45], [3.4, 5.45]])], w * s), g.poly(P([[0.4, 2.2], [2.4, 0.15], [2.4, 1.9]])))
  if (ch === '2') return g.union(nib(g, [P([[0.7, 1.6], [1.6, 0.7], [2.9, 0.7], [3.5, 1.4], [3.5, 2.5], [0.8, 5.35], [3.6, 5.35]])], w * s), dia(0.7, 1.75, 0.75 * s))
  return null
}
// an illuminated chip: a glass inlay in a gilded or stone frame
const chip = (g, F, role, o = {}) => o.stone
  ? [g.stone(g.rim(F, o.frame ?? 1.1), { plate: o.plate, thin: true }), g.glass(g.shrink(F, o.frame ?? 1.1), role, { tracery: o.tracery || 'none', plate: o.plate, glint: false, ...(o.glass || {}) })]
  : gem(g, F, role, { rim: o.frame ?? 0.6, plate: o.plate, glint: false, tracery: o.tracery })
// a face as a rose window: stone rim, a ring of glass lights, a gilded roundel face
function roseFace(g, role = 'c2') {
  const spokes = Array.from({ length: 16 }, (_, k) => { const a = (k * 22.5 + 11.25) * RAD; return [[r2(12 + 6 * Math.cos(a)), r2(12 + 6 * Math.sin(a))], [r2(12 + 9.4 * Math.cos(a)), r2(12 + 9.4 * Math.sin(a))]] })
  return [
    g.stone(g.rim(g.circle(12, 12, 9.7), 1.45)),
    g.glass(g.circle(12, 12, 8.3), role, { tracery: spokes, glint: false, dark: 0.32 }),
    g.gilt(g.circle(12, 12, 6.5)),
  ]
}
// git nodes as small rose windows (glass with six leads in a stone ring), merged into few parts
function nodes(g, list, r = 3.2) {
  const byRole = new Map()
  for (const [x, y, role] of list) { if (!byRole.has(role)) byRole.set(role, []); byRole.get(role).push([x, y]) }
  const out = []
  for (const [role, pts] of byRole) {
    const spokes = pts.flatMap(([x, y]) => [0, 60, 120].map(a => { const c = Math.cos(a * RAD) * r, s = Math.sin(a * RAD) * r; return [[r2(x - c), r2(y - s)], [r2(x + c), r2(y + s)]] }))
    out.push(g.glass(g.union(...pts.map(([x, y]) => g.circle(x, y, r - 0.7))), role, { tracery: spokes, glint: false, glow: 0.24 }))
  }
  out.push(g.stone(g.union(...list.map(([x, y]) => g.ring(x, y, r - 0.55, 1.1))), { thin: true }))
  return out
}
// a bar with lancet-pointed ends from (x0, y0) to (x1, y1)
function pbar(g, x0, y0, x1, y1, w) {
  const L = Math.hypot(x1 - x0, y1 - y0), dx = (x1 - x0) / L, dy = (y1 - y0) / L, nx = -dy * w / 2, ny = dx * w / 2, k = w * 0.8
  return g.poly([[x0 - dx * k, y0 - dy * k], [x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 + dx * k, y1 + dy * k], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]].map(([x, y]) => [r2(x), r2(y)]))
}
// glazed tiles of a layout, merged per material: stone frames, glass per role, gilded quatrefoil
// studs in the tiles big enough to hold one. list: [x0, y0, x1, y1, role]
function tiles(g, list, o = {}) {
  const fr = o.frame ?? 1.15, rad = o.r ?? 1.5
  const shapes = list.map(([x0, y0, x1, y1, role]) => ({ F: g.rr(x0, y0, x1, y1, rad), role, c: [(x0 + x1) / 2, (y0 + y1) / 2], m: Math.min(x1 - x0, y1 - y0), b: [x0, y0, x1, y1] }))
  const byRole = new Map()
  for (const s of shapes) { if (!byRole.has(s.role)) byRole.set(s.role, []); byRole.get(s.role).push(s) }
  // o.cross: each light leaded into quarters (a cheap tracery that reads as stained glass)
  const cross = ss => ss.flatMap(({ c: [cx, cy], b: [x0, y0, x1, y1] }) => [[[x0, cy], [x1, cy]], [[cx, y0], [cx, y1]]])
  const out = [...[...byRole].map(([role, ss]) => g.glass(g.union(...ss.map(s => g.shrink(s.F, fr))), role, { glint: false, glow: 0.22, plate: o.plate, tracery: o.cross ? cross(ss) : 'none' }))]
  out.push(g.stone(g.union(...shapes.map(s => g.rim(s.F, fr))), { plate: o.plate }))
  const big = shapes.filter(s => s.m >= 6.4 && o.studs !== false)
  if (big.length) out.push(...jewels(g, big.map(s => s.c), Math.min(1.7, big[0].m * 0.2), o.heart || 'c1', { plate: o.plate }))
  return out
}
// a carved hand: the skeleton's fill grown to the stroke's outer edge, smooth stone
const handMass = (g, d, e = 0.95) => g.grow(g.path(d), e)

export const R = {
  gift: (icon, g) => [
    ...g.pane(g.rr(4.6, 11.6, 19.4, 21.2, [0, 0, 2, 2]), 'c1', { frame: 1.4, tracery: 'quarry', glass: { medallion: false, s: 2.8 } }),
    g.stone(g.rr(3, 7.8, 21, 12.2, 1.4), { ticks: [[[6.6, 7], [6.6, 13]], [[17.4, 7], [17.4, 13]]] }),
    g.gilt(g.union(g.rr(10.7, 7.8, 13.3, 21.2, 0.3), g.path('M12 8 C11.5 5.5 10 3.4 8 3.4 A2.3 2.3 0 0 0 8 8 Z M12 8 C12.5 5.5 14 3.4 16 3.4 A2.3 2.3 0 0 1 16 8 Z')), { plate: 'A' }),
    g.glass(g.path('M10.6 7 C10.2 5.6 9.2 4.6 8 4.6 A1.2 1.2 0 0 0 8 7 Z M13.4 7 C13.8 5.6 14.8 4.6 16 4.6 A1.2 1.2 0 0 1 16 7 Z'), 'c3', { plate: 'A', outline: 0.2, glint: false }),
    ...jewel(g, 12, 8.2, 1.35, 'c1', { plate: 'A' }),
  ],
  // branches as glazed stone mullions joining three small rose windows
  'git-branch': (icon, g) => [
    ...channel(g, [[[6.5, 8], [6.5, 16]], [[17.5, 8.6], ...arcP(g, 9.5, 10, 8, 0, 90).slice(1)]], 2.4, 'c2'),
    ...nodes(g, [[6.5, 6, 'c4'], [6.5, 18, 'c4'], [17.5, 6, 'c3']]),
  ],
  // a commit: a rose window threaded on a glazed stone beam ending in gilded trefoils
  'git-commit': (icon, g) => [
    ...channel(g, [[[3.8, 12], [20.2, 12]]], 2.4, 'c2'),
    g.gilt(g.union(g.foil(3.1, 12, 2, 3, 180), g.foil(20.9, 12, 2, 3, 0)), { plate: 'A', glint: false }),
    ...g.rose(12, 12, 5, 'c4', { n: 8, frame: 1.3, medal: 'c3' }),
  ],
  'git-merge': (icon, g) => [
    ...channel(g, [[[6.5, 8], [6.5, 16]], [[7.4, 7.6], [8.6, 9.6], [10.2, 11], [12.2, 11.8], [15, 12]]], 2.4, 'c2'),
    ...nodes(g, [[6.5, 6, 'c4'], [6.5, 18, 'c4'], [17.5, 12, 'c3']]),
  ],
  'git-pull-request': (icon, g) => [
    ...channel(g, [[[5, 8], [5, 16]], [[13.4, 6], [17, 6], ...arcP(g, 17, 8, 2, -90, 0).slice(1), [19, 15]]], 2.4, 'c2'),
    ...spears(g, [[10.6, 6, 180]], 4, 3.1, { plate: 'A', pierce: false }),
    ...nodes(g, [[5, 6, 'c4'], [5, 18, 'c4'], [19, 18, 'c3']]),
  ],
  // an orb: sapphire sea in quarries, an emerald meridian land leaded in, a gilded equator, a cross finial
  globe: (icon, g) => {
    const C = g.circle(12, 13, 8.4)
    return [
      ...g.pane(C, 'c2', { frame: 1.5, tracery: 'quarry', glass: { medallion: false, s: 3.2 } }),
      g.glass(g.inter(g.path('M12 4.8 C9.4 7.6 8.2 10.2 8.2 13 C8.2 15.8 9.4 18.4 12 21.2 C14.6 18.4 15.8 15.8 15.8 13 C15.8 10.2 14.6 7.6 12 4.8 Z'), g.shrink(C, 1.5)), 'c4', { outline: 0.4, glint: false, glow: 0.22 }),
      g.gilt(g.inter(g.seg(3.6, 13, 20.4, 13, 1.5), g.shrink(C, 1)), { plate: 'A', thin: true, outline: 0.32 }),
      g.deco(g.gilt(g.union(g.seg(12, 4.6, 12, 1.6, 1.1), g.seg(10.6, 2.8, 13.4, 2.8, 1.1)), { thin: true, outline: 0.32 })),
    ]
  },
  // a mortarboard of sapphire glass on a smooth carved cap, gilded button and tassel
  'graduation-cap': (icon, g) => [
    g.stone(g.path('M7 10 V16 C7 18 9.25 19.6 12 19.6 C14.75 19.6 17 18 17 16 V10 Z')),
    g.gilt(g.path('M7 14.8 C9 16.2 10.4 16.6 12 16.6 C13.6 16.6 15 16.2 17 14.8 V16.4 C15 17.8 13.6 18.2 12 18.2 C10.4 18.2 9 17.8 7 16.4 Z'), { thin: true, glint: false, outline: 0.3 }),
    ...g.pane(g.poly([[12, 3.8], [21.8, 9], [12, 14.2], [2.2, 9]]), 'c2', { frame: 1.3, tracery: 'quarry', glass: { medallion: false, s: 2.3 } }),
    g.gilt(g.circle(12, 9, 1.25), { thin: true }),
    g.gilt(g.union(g.seg(20.6, 9.2, 20.6, 14.4, 1), g.poly([[19.4, 17.6], [20.6, 13.8], [21.8, 17.6]])), { plate: 'A', thin: true, outline: 0.32 }),
  ],
  // a mason's hammer: a heavy iron head rimmed in gilt, a gilded collar, a haft inlaid with ruby
  hammer: (icon, g) => {
    const head = g.grow(g.path('M12.68 2.82 L18.34 8.47 C20.82 10.95 21.35 14.31 19.22 17.49 C19.75 15.19 18.87 13.25 17.28 11.66 L16.57 10.95 L14.81 12.72 L8.79 6.71 A1 1 0 0 1 8.79 5.29 L11.27 2.82 A1 1 0 0 1 12.68 2.82 Z'), 0.45)
    return [
      ...enamel(g, [[[11.6, 10.4], [5.2, 18.8]]], 3.3, 'c1', { plate: 'A' }),
      g.gilt(head),
      g.iron(g.shrink(head, 0.75)),
      g.gilt(g.seg(10, 9.75, 12.3, 12.05, 1.7), { plate: 'A', thin: true }),
    ]
  },
  // a carved stone hand in a jewelled cuff, offering a gilded coin with a gold glass face
  'hand-coins': (icon, g) => [
    g.stone(handMass(g, 'M5.5 13 H10.5 A2 2 0 0 1 12.45 14.55 L18 13.5 A1.75 1.75 0 0 1 19.9 16.4 L13.62 20.66 A2 2 0 0 1 12.5 21 H5.5 Z')),
    g.lead([[[5.2, 17], [10.5, 17], ...arcP(g, 10.5, 15, 2, 90, 35).slice(1)]], { w: 0.5, op: 0.85 }),
    ...gem(g, g.rr(1.4, 11.6, 4.5, 22, 0.8), 'c2', { rim: 0.6 }),
    g.gilt(g.union(g.rr(10, 4.5, 20, 8, 0), g.ellipse(15, 8, 5, 2.5)), { plate: 'A' }),
    g.gilt(g.ellipse(15, 4.5, 5, 2.5), { plate: 'A', glint: false }),
    g.glass(g.ellipse(15, 4.5, 3.9, 1.6), 'c3', { plate: 'A', outline: 0.25, tracery: 'medallion', glint: false }),
  ],
  // a carved stone hand in a jewelled cuff, holding up a ruby heart
  'hand-heart': (icon, g) => [
    g.stone(handMass(g, 'M3.4 14.5 H7.5 C8.6 14.5 9.6 14.9 10.4 15.6 L11.15 16.25 H14 L15.4 16.4 L18.4 13.9 A1.6 1.6 0 0 1 20.6 16.2 L16.4 19.9 C15.6 20.6 14.6 21 13.5 21 H3.4 Z')),
    g.lead([[[9.5, 19.25], [14, 19.25], ...arcP(g, 14, 17.75, 1.5, 90, -60).slice(1)]], { w: 0.5, op: 0.85 }),
    ...gem(g, g.rr(1.6, 12.2, 4.7, 22.2, 0.8), 'c2', { rim: 0.6 }),
    ...g.pane(heartF(g, 12, 6.9, 0.6), 'c1', { frame: 1.15, tracery: 'none', plate: 'A' }),
  ],
  // two carved stone hands clasped, cuffed in ruby and sapphire
  handshake: (icon, g) => [
    g.stone(handMass(g, 'M3.2 10 H6 L9.5 7.5 C10.4 6.9 11.6 6.9 12.5 7.5 L17.5 11 H20.8 V14 H18.5 L14.5 18 A1.75 1.75 0 0 1 12 15.5 L11.5 16 A1.75 1.75 0 0 1 9 13.5 L8 17 L5 14 H3.2 Z', 0.9)),
    g.lead([[[12.1, 15.4], [13.6, 13.9]], [[9.2, 13.3], [11.7, 10.8]]], { w: 0.8 }),
    g.lead([[[12.9, 8.3], [16.9, 11.2], [20, 11.2]]], { w: 0.45, op: 0.7 }),
    ...gem(g, g.rr(1.5, 7.4, 4.3, 17, 0.8), 'c1', { rim: 0.6 }),
    ...gem(g, g.rr(19.7, 7.4, 22.5, 17, 0.8), 'c2', { rim: 0.6 }),
  ],
  // a smooth carved strongbox, a rose-window platter, a gilded arm and a ruby jewel
  'hard-drive': (icon, g) => [
    g.stone(g.rr(4, 2.2, 20, 21.6, 2)),
    g.lead([[[5.4, 3.6], [18.6, 3.6], [18.6, 20.2], [5.4, 20.2], [5.4, 3.6]]], { role: 'edge', w: 0.4 }),
    ...g.plate('A', g.rose(12, 13.6, 5.3, 'c2', { n: 8, frame: 1.2, medal: 'c3' })),
    g.gilt(g.union(g.seg(16.6, 4.8, 14.4, 10.4, 1.3), g.circle(16.6, 4.8, 1.2)), { plate: 'A', thin: true }),
    ...jewel(g, 7, 4.9, 0.95, 'c1'),
  ],
  // a hash of lancet-pointed stone bars glazed with sapphire, a ruby quatrefoil in the crossing
  hash: (icon, g) => {
    const V = g.union(pbar(g, 9.9, 4.4, 8.1, 19.6, 2.5), pbar(g, 15.9, 4.4, 14.1, 19.6, 2.5))
    const H = g.union(pbar(g, 4.4, 9, 19.6, 9, 2.5), pbar(g, 4.4, 15, 19.6, 15, 2.5))
    return [
      g.glass(g.foil(12, 12, 2.8, 4, -45), 'c1', { outline: 0.3, glow: 0.3 }),
      g.stone(V), g.glass(g.shrink(V, 0.72), 'c2', { outline: 0.2, glint: false, glow: 0.3 }),
      g.stone(H, { plate: 'A' }), g.glass(g.shrink(H, 0.72), 'c2', { outline: 0.2, glint: false, glow: 0.3, plate: 'A' }),
    ]
  },
  // an H of two pinnacled stone piers bridged by a jewelled gilt bar
  heading: (icon, g) => [
    g.stone(g.union(g.rr(4.6, 6.4, 7.4, 20.4, 0.3), g.rr(16.6, 6.4, 19.4, 20.4, 0.3)), { ashlar: { h: 2.3, w: 3, x: 4.6, y0: 6.4, y1: 20.4 } }),
    g.stone(g.union(g.rr(3.8, 19.6, 8.2, 21.4, 0.4), g.rr(15.8, 19.6, 20.2, 21.4, 0.4)), { thin: true }),
    ...g.pinnacle(6, 6.8, 2.4, 3.2), ...g.pinnacle(18, 6.8, 2.4, 3.2),
    g.gilt(g.rr(7.4, 10.9, 16.6, 13.1, 0.4), { plate: 'A' }),
    ...jewel(g, 12, 12, 1.5, 'c2', { plate: 'A' }),
  ],
  // a pointed-arch headband of gilt over two ruby earcups
  headphones: (icon, g) => [
    g.gilt(g.stroke(g.lancetPts(3.6, 4.4, 20.4, 15.2, 0.7), 1.9), { plate: 'A' }),
    ...g.pane(g.union(g.path('M5.5 13.2 H7.2 A1.6 1.6 0 0 1 8.8 14.8 V19.7 A1.6 1.6 0 0 1 7.2 21.3 H5.5 A2.1 2.1 0 0 1 3.4 19.2 V15.3 A2.1 2.1 0 0 1 5.5 13.2 Z'), g.path('M18.5 13.2 H16.8 A1.6 1.6 0 0 0 15.2 14.8 V19.7 A1.6 1.6 0 0 0 16.8 21.3 H18.5 A2.1 2.1 0 0 0 20.6 19.2 V15.3 A2.1 2.1 0 0 0 18.5 13.2 Z')), 'c1', { frame: 1.1, tracery: 'none' }),
    g.studs([[6.1, 17.2], [17.9, 17.2]], 0.5),
  ],
  headset: (icon, g) => [
    g.gilt(g.stroke(g.lancetPts(3.6, 3.4, 20.4, 13.2, 0.7), 1.9), { plate: 'A' }),
    g.gilt(g.stroke([[18, 17.6], [18, 18.5], ...arcP(g, 14.5, 18.5, 3.5, 0, 90).slice(1), [13.4, 22]], 1.1), { plate: 'A', thin: true, outline: 0.32 }),
    ...g.pane(g.union(g.path('M5.5 11.2 H7.2 A1.6 1.6 0 0 1 8.8 12.8 V16.7 A1.6 1.6 0 0 1 7.2 18.3 H5.5 A2.1 2.1 0 0 1 3.4 16.2 V13.3 A2.1 2.1 0 0 1 5.5 11.2 Z'), g.path('M18.5 11.2 H16.8 A1.6 1.6 0 0 0 15.2 12.8 V16.7 A1.6 1.6 0 0 0 16.8 18.3 H18.5 A2.1 2.1 0 0 0 20.6 16.2 V13.3 A2.1 2.1 0 0 0 18.5 11.2 Z')), 'c2', { frame: 1.1, tracery: 'none' }),
    ...jewel(g, 12.4, 21.9, 1.05, 'c1', { plate: 'A' }),
  ],
  // a ruby heart split along a jagged crack, the right half free to fall away
  'heart-crack': (icon, g) => {
    const H = heartF(g, 12, 12, 1)
    const crack = [[12, 5.4], [12, 6.6], [10, 10.6], [13.5, 13.6], [11, 17], [12, 21.6]]
    // (g.cut is the moat part, not a boolean: the halves are cut by polygons either side of the crack)
    const side = d => crack.map(([x, y]) => [x + d, y])
    const left = g.inter(H, g.poly([[0, 0], [11.55, 0], ...side(-0.45), [11.55, 24], [0, 24]]))
    const right = g.inter(H, g.poly([[24, 0], [12.45, 0], ...side(0.45), [12.45, 24], [24, 24]]))
    return [
      ...g.pane(left, 'c1', { frame: 1.5, tracery: 'quarry', glass: { medallion: false, s: 2.4 } }),
      ...g.pane(right, 'c1', { frame: 1.5, tracery: 'quarry', glass: { medallion: false, s: 2.4 }, plate: 'A' }),
    ]
  },
  // a ruby heart with a gilded pulse traced across it
  'heart-pulse': (icon, g) => {
    const pulse = g.stroke([[2.4, 12], [7.5, 12], [9, 9.3], [12, 15.6], [13.75, 12], [21.6, 12]], 1.6)
    return [
      ...g.pane(heartF(g, 12, 12, 1), 'c1', { frame: 1.7, tracery: 'rose', glass: { n: 8, at: { c: [12, 11], r: 4.2 }, medal: 'c3' } }),
      g.cut(g.grow(pulse, 0.55)),
      g.gilt(pulse, { plate: 'A' }),
    ]
  },
  // a sapphire rose window with a gilded question mark
  'help-circle': (icon, g) => [
    ...g.pane(g.circle(12, 12, 9.5), 'c2', { frame: 1.7, tracery: 'rose', glass: { n: 12, at: { c: [12, 12], r: 7.8 }, medallion: false } }),
    g.gilt(g.union(g.stroke([...arcP(g, 12, 9.6, 2.5, 175, 360), ...arcP(g, 12, 9.6, 2.5, 0, 40).slice(1), [12.4, 12.4], [12, 13.2], [12, 14.2]], 2.1), g.circle(12, 17.3, 1.35)), { plate: 'A' }),
  ],
  // a hexagonal rose window, six spokes round a gold heart
  hexagon: (icon, g) => g.pane(g.path('M13.01 2.6 L19.51 6.42 A2 2 0 0 1 20.5 8.14 L20.5 15.86 A2 2 0 0 1 19.51 17.58 L13.01 21.4 A2 2 0 0 1 10.99 21.4 L4.49 17.58 A2 2 0 0 1 3.5 15.86 L3.5 8.14 A2 2 0 0 1 4.49 6.42 L10.99 2.6 A2 2 0 0 1 13.01 2.6 Z'), 'c2', { frame: 1.7, tracery: 'rose', glass: { n: 6, at: { c: [12, 12], r: 6.6 }, medal: 'c3', rot: -90 } }),
  // a highlighter: a sapphire glass barrel in a stone case, gilded collar, gold glass chisel tip and stroke
  highlighter: (icon, g) => {
    const a = 135 * RAD, dx = Math.cos(a), dy = Math.sin(a)
    const T = pts => pts.map(([u, v]) => [r2(18.6 + dx * u - dy * v), r2(5.4 + dy * u + dx * v)])
    return [
      g.glass(g.rr(2.4, 19.4, 13.6, 21.6, 1.1), 'c3', { outline: 0.4, plate: 'A', glow: 0.3 }),
      ...g.pane(g.union(g.poly(T([[1.9, -3.9], [9.6, -3.9], [9.6, 3.9], [1.9, 3.9]])), g.circle(...T([[1.9, 0]])[0], 3.9)), 'c2', { frame: 1.3, tracery: [T([[-4, -1.3], [12, -1.3]]), T([[-4, 1.3], [12, 1.3]])] }),
      g.gilt(g.poly(T([[9.4, -3.8], [11.1, -3.8], [11.1, 3.8], [9.4, 3.8]]))),
      ...gem(g, g.poly(T([[11, -3], [11, 3], [14.9, 1], [14.9, -1.9]])), 'c3', { plate: 'A', rim: 0.6 }),
    ]
  },

  history: (icon, g) => [
    g.glass(g.circle(12, 12, 7.6), 'c2', { tracery: 'rose', n: 8, at: { c: [12, 12], r: 7.6 }, medallion: false, medal: 'c3' }),
    tube(g, arcP(g, 12, 12, 8.5, 173, -135), 2.1, { step: 3 }),
    g.gilt(g.stroke([[3, 4.4], [3, 9], [7.6, 9]], 2), { plate: 'K' }),
    g.gilt(g.stroke([[12, 7.2], [12, 12], [15.6, 14.1]], 1.6), { plate: 'A' }),
    ...jewel(g, 12, 12, 1.2, 'c1', { plate: 'A' }),
  ],
  // a stone hospice: ashlar tower and wings, a ruby cross, a glowing pointed door
  hospital: (icon, g) => [
    g.stone(g.union(g.rr(6.4, 2.6, 17.6, 21.4, [2, 2, 0, 0]), g.rr(2.4, 10.8, 21.6, 21.4, [2, 2, 0, 0])), { ashlar: { h: 2.3, w: 3.2, y0: 2.6, y1: 21.4 } }),
    g.glass(g.union(g.rr(10.9, 5, 13.1, 12, 0.3), g.rr(8.5, 7.4, 15.5, 9.6, 0.3)), 'c1', { outline: 0.4, glow: 0.3 }),
    g.glass(g.lancet(3.7, 13.4, 5.3, 18.4, 1.1), 'c2', { outline: 0.38, glint: false }),
    g.glass(g.lancet(18.7, 13.4, 20.3, 18.4, 1.1), 'c2', { outline: 0.38, glint: false }),
    g.stone(g.lancet(9.4, 14.6, 14.6, 21.4, 1), { thin: true }),
    g.recess(g.lancet(10.6, 15.9, 13.4, 21.4, 1), { plate: 'A', glow: 'c3', glowOp: 0.65 }),
  ],
  // an inn: a crenellated ashlar front, its great arch lit within, a bed with a ruby coverlet
  hotel: (icon, g) => [
    g.stone(g.crenel(3.2, 2.4, 20.8, 21.6, 4, 1.6), { ashlar: { h: 2.4, w: 3.2, y0: 4, y1: 21.6 } }),
    g.stone(g.rr(2, 20.2, 22, 22, 0.4), { thin: true }),
    g.recess(g.lancet(4.8, 6.6, 19.2, 20.4, 0.6), { glow: 'c2', glowOp: 0.45 }),
    g.stone(g.rr(8, 12.2, 11.9, 15, 1.3), { thin: true, plate: 'A' }),
    g.glass(g.rr(7, 14.6, 17.8, 18, 0.8), 'c1', { outline: 0.4, plate: 'A', glint: false, glow: 0.3, tracery: [[[12.6, 14], [12.6, 18.6]]] }),
    g.gilt(g.union(g.rr(5.9, 11, 7.7, 20.4, [0.9, 0.9, 0, 0]), g.rr(16.8, 13.4, 18.3, 20.4, [0.7, 0.7, 0, 0])), { plate: 'A', thin: true }),
  ],
  // an hourglass: gilded caps and posts, sapphire bulbs, gold sand
  hourglass: (icon, g) => {
    const bulbs = g.path('M7.3 3.6 V6 C7.3 8.9 9.7 10.2 12 12 C14.3 13.8 16.7 15.1 16.7 18 V20.4 H7.3 V18 C7.3 15.1 9.7 13.8 12 12 C14.3 10.2 16.7 8.9 16.7 6 V3.6 Z')
    return [
      g.gilt(g.union(g.seg(5.4, 3, 5.4, 21, 1.1), g.seg(18.6, 3, 18.6, 21, 1.1)), { thin: true, outline: 0.32 }),
      g.glass(bulbs, 'c2', { glow: 0.22 }),
      g.glass(g.inter(bulbs, g.union(g.rect(0, 16.4, 24, 24), g.poly([[9.4, 6.6], [14.6, 6.6], [12, 12]]))), 'c3', { outline: 0.25, glint: false }),
      g.gilt(g.union(g.rr(4.2, 1.8, 19.8, 4, 0.9), g.rr(4.2, 20, 19.8, 22.2, 0.9)), { plate: 'A' }),
    ]
  },
  // a cone glazed in gold quarries, a ruby scoop, a gilded finial
  'ice-cream': (icon, g) => [
    ...gem(g, g.poly([[7.6, 12.6], [12, 21.8], [16.4, 12.6]]), 'c3', { plate: 'A', rim: 0.8, tracery: 'quarry', glass: { s: 2, medallion: false } }),
    ...g.pane(g.path('M5.8 11.6 A6.2 6.2 0 1 1 18.2 11.6 A2.05 2.05 0 0 1 14.1 11.6 A2.05 2.05 0 0 1 10 11.6 A2.05 2.05 0 0 1 5.8 11.6 Z'), 'c1', { frame: 1.4, tracery: 'medallion', glass: { lobes: 4 } }),
    g.finial(12, 5.6, 0.62, { plate: 'deco' }),
  ],
  'id-card': (icon, g) => [
    g.stone(g.rr(2, 4, 22, 20, 2)),
    g.lead([[[14, 5.4], [20.6, 5.4], [20.6, 18.6], [14, 18.6]]], { role: 'edge', w: 0.4 }),
    g.glass(g.lancet(4.2, 6.4, 12.4, 20, 0.9), 'c2', { outline: 0.4, deep: 0.12 }),
    g.glass(g.circle(8.3, 11.2, 1.9), 'c3', { outline: 0.35, glint: false }),
    g.glass(g.path('M5.4 20 V18.6 A2.6 2.6 0 0 1 8 16 H8.6 A2.6 2.6 0 0 1 11.2 18.6 V20 Z'), 'c1', { outline: 0.35, glint: false }),
    g.gilt(g.union(g.rr(14, 9.1, 19.4, 10.9, 0.8), g.rr(14, 13.1, 17.6, 14.9, 0.8)), { plate: 'A', thin: true }),
  ],
  // ---- batch 2 ---------------------------------------------------------------
  // a picture window: sapphire sky, an emerald hill in quarries, a gold sun
  image: (icon, g) => picture(g, g.rr(2, 4, 22, 20, 2), g.poly([[2, 17.4], [7, 12.2], [8, 11.8], [9, 12.2], [17.6, 20.5], [2, 20.5]]), [15, 9.2, 1.9]),
  'image-plus': (icon, g) => [
    ...picture(g, g.rr(2, 4, 22, 20, 2), g.poly([[2, 17.4], [7, 12.2], [8, 11.8], [9, 12.2], [13, 16.2], [13, 20.5], [2, 20.5]]), [14.6, 9.2, 1.7]),
    ...g.badge('plus', 17.5, 17.5, 4.3, 'c1'),
  ],
  images: (icon, g) => [
    g.stone(g.rr(5.6, 3.4, 22.2, 17.4, 2)),
    g.cut(g.grow(g.rr(1.8, 7.8, 18.2, 21.2, 2), 0.7)),
    ...picture(g, g.rr(1.8, 7.8, 18.2, 21.2, 2), g.poly([[1.8, 19], [6, 14.8], [7, 14.4], [8, 14.8], [14.8, 21.4], [1.8, 21.4]]), [12.6, 12.4, 1.6], { frame: 1.3 }),
  ],
  // an alms tray: stone bin with a dark glowing well, a sapphire drawer front
  inbox: (icon, g) => {
    const box = g.path('M2.5 12.5 L5.5 4.6 H18.5 L21.5 12.5 V17.5 A2 2 0 0 1 19.5 19.6 H4.5 A2 2 0 0 1 2.5 17.5 Z')
    return [
      g.stone(box),
      g.recess(g.poly([[5, 12.2], [6.9, 6.5], [17.1, 6.5], [19, 12.2]])),
      ...g.pane(g.path('M2.5 12.4 H7.4 L8.9 15 H15.1 L16.6 12.4 H21.5 V17.5 A2 2 0 0 1 19.5 19.6 H4.5 A2 2 0 0 1 2.5 17.5 Z'), 'c2', { frame: 1.2, tracery: 'none', plate: 'A' }),
    ]
  },
  // corbelled rods, a gilded spear pointing out of the indent
  'indent-decrease': (icon, g) => [
    ...rods(g, [[2.8, 4.4, 21.4], [12.4, 9.6, 21.4, { glass: 'c2' }], [12.4, 14.4, 21.4], [2.8, 19.6, 21.4]], { h: 2.3 }),
    ...enamel(g, [[[9.8, 12], [5.6, 12]]], 2.3, 'c1', { plate: 'A' }),
    ...spears(g, [[2.4, 12, 180]], 4.4, 3.2, { plate: 'A', pierce: false }),
  ],
  'indent-increase': (icon, g) => [
    ...rods(g, [[2.8, 4.4, 21.4], [12.4, 9.6, 21.4, { glass: 'c2' }], [12.4, 14.4, 21.4], [2.8, 19.6, 21.4]], { h: 2.3 }),
    ...enamel(g, [[[2.6, 12], [6.6, 12]]], 2.3, 'c1', { plate: 'A' }),
    ...spears(g, [[10.2, 12, 0]], 4.4, 3.2, { plate: 'A', pierce: false }),
  ],
  // the rupee sign in gilt inlaid with ruby enamel
  'indian-rupee': (icon, g) => [
    ...enamel(g, [[[9.5, 4], [12.8, 4.1], [14.6, 6], [14.6, 8.5], [14.1, 10.7], [12.5, 12.4], [9.5, 13], [6.6, 13], [15.6, 20.6]]], 2.5, 'c1'),
    ...enamel(g, [[[5.8, 4], [18.2, 4]]], 2.5, 'c1'),
    ...enamel(g, [[[5.8, 8.5], [18.2, 8.5]]], 2.5, 'c1', { plate: 'A' }),
  ],
  'info-circle': (icon, g) => [
    ...g.pane(g.circle(12, 12, 9.5), 'c2', { frame: 1.7, tracery: 'rose', glass: { n: 12, at: { c: [12, 12], r: 7.8 }, medallion: false } }),
    g.gilt(g.union(g.stroke([[10.2, 11], [12, 11], [12, 16.8]], 2.2), g.circle(12, 7.6, 1.4), g.rr(10, 16, 14, 17.6, 0.5)), { plate: 'A' }),
  ],
  // an illuminated initial: a leaning textura I in gilt on a sapphire inlay in a small stone frame
  italic: (icon, g) => [
    ...chip(g, g.rr(3.4, 2.4, 20.6, 21.6, 2.2), 'c2', { stone: true, frame: 1.25, glass: { glow: 0.24, tracery: 'quarry', medallion: false, s: 2.6 } }),
    g.gilt(g.union(
      nib(g, [[[14.3, 6.6], [9.7, 17.4]]], 3.6, -28),
      nib(g, [[[11.2, 6], [17.4, 6]], [[6.6, 18], [12.8, 18]]], 3.4, -28),
    ), { plate: 'A' }),
    g.studs([[17.2, 11.6], [6.8, 12.4]], 0.6),
  ],
  // a carved stone board of three lancet lights, filled to different heights
  kanban: (icon, g) => [
    g.stone(g.rr(3, 3, 21, 21, 2)),
    g.glass(g.rr(4.5, 4.5, 19.5, 19.5, 1), 'c2', { outline: 0, deep: 0.55, glint: false, tracery: 'none' }),
    g.glass(g.lancet(5.4, 6, 9.4, 18.2, 1.1), 'c4', { outline: 0.38, tracery: 'lancet', s: 2.2 }),
    g.glass(g.lancet(10, 6, 14, 13.2, 1.1), 'c3', { outline: 0.38, tracery: 'lancet', s: 2.2, plate: 'A' }),
    g.glass(g.lancet(14.6, 6, 18.6, 15.8, 1.1), 'c1', { outline: 0.38, tracery: 'lancet', s: 2.2 }),
  ],
  // a cathedral key: quatrefoil bow glazed in ruby, a gilded shank, the bit (A) free to turn
  key: (icon, g) => [
    g.gilt(g.union(g.seg(18.6, 5.4, 20.8, 7.6, 2.1), g.seg(15.6, 8.4, 17.8, 10.6, 2.1)), { plate: 'A' }),
    g.gilt(g.seg(10.6, 13.4, 20.4, 3.6, 2.3)),
    g.gilt(g.foil(8, 16, 5.6, 4, -45)),
    g.glass(g.foil(8, 16, 4, 4, -45), 'c1', { outline: 0.3, tracery: 'none', glow: 0.3 }),
    g.recess(g.circle(8, 16, 1.1), { glow: 'c3', outline: 0.25 }),
  ],
  // a keyboard: stone case, deep sapphire bed, gilded keys
  keyboard: (icon, g) => [
    ...g.pane(g.rr(2, 4.5, 22, 19.5, 2), 'c2', { frame: 1.4, tracery: 'none', glass: { deep: 0.25, glint: false } }),
    g.gilt(g.union(...[5.4, 9.4, 13.4, 17.4].map(x => g.rr(x - 1.1, 7.3, x + 1.7, 9.7, 0.5)), ...[7.4, 11.4, 15.4].map(x => g.rr(x - 1.1, 10.8, x + 1.7, 13.2, 0.5))), { plate: 'A', thin: true }),
    g.gilt(g.rr(7.4, 14.4, 16.6, 16.6, 0.8), { plate: 'A', thin: true }),
  ],
  // a lamp: gold glass shade in a stone frame, gilded stem, stone foot, finial
  lamp: (icon, g) => [
    g.gilt(g.seg(12, 11, 12, 19, 1.8)),
    g.stone(g.path('M6.6 21.4 A5.4 2.9 0 0 1 17.4 21.4 Z'), { thin: true }),
    ...g.pane(g.path('M8.4 3.2 H15.6 L19.8 12.2 H4.2 Z'), 'c3', { frame: 1.3, tracery: 'lancet', plate: 'A', glass: { s: 2.2 } }),
    g.finial(12, 3, 0.6, { plate: 'deco' }),
  ],
  // a treasury: a gable with a rose window over a lancet arcade
  landmark: (icon, g) => [
    g.stone(g.poly([[2.6, 9.3], [12, 3.2], [21.4, 9.3]]), { thin: true }),
    ...g.rose(12, 7.3, 1.55, 'c3', { n: 6, frame: 0.6 }),
    g.stone(g.rect(3.6, 9.2, 20.4, 19.6), { ashlar: { h: 2.6, w: 3.4, y0: 9.2, y1: 19.6 } }),
    ...[5.2, 9.2, 13.2, 17.2].map((x, i) => g.glass(g.lancet(x + 0.2, 11.4, x + 1.8 + 0.2, 18.4, 1.1), 'c2', { outline: 0.35, glint: false, plate: 'A' })),
    g.stone(g.rr(2.4, 19.2, 21.6, 21.6, 0.4), { thin: true }),
  ],
  // two scripts: a stone character and a gilded A
  language: (icon, g) => [
    tube(g, [[[2.5, 6], [12.5, 6]], [[7.5, 2.6], [7.5, 6]]], 1.9),
    g.stone(g.stroke([[[11, 6], [10.7, 8.6], [9.6, 11], [7.6, 13.2], [3, 15]], [[4, 6], [5, 9.4], [6.8, 11.9], [11.5, 14.5]]], 1.9), { thin: true }),
    ...enamel(g, [[[13.4, 21.2], [17.5, 11], [21.6, 21.2]], [[15, 17.5], [20, 17.5]]], 2.3, 'c1', { plate: 'A' }),
  ],
  // a laptop: a sapphire glazed screen in a stone frame on a gilded base
  laptop: (icon, g) => [
    ...g.pane(g.rr(4, 3.6, 20, 15.6, 2), 'c2', { frame: 1.5, tracery: 'quarry', glass: { s: 2.4 } }),
    g.gilt(g.path('M1.8 18.4 H22.2 V19.4 A1.4 1.4 0 0 1 20.8 20.8 H3.2 A1.4 1.4 0 0 1 1.8 19.4 Z'), { plate: 'A' }),
    g.recess(g.rr(10, 18.4, 14, 19.2, 0.3), { outline: 0 }),
  ],
  // a laughing face as a rose window: gilded roundel, lead features, a ruby open mouth
  laugh: (icon, g) => [
    ...roseFace(g, 'c2'),
    g.lead([arcP(g, 9.4, 10.6, 1.35, 195, 345), arcP(g, 14.6, 10.6, 1.35, 195, 345)], { w: 1.15, plate: 'A' }),
    g.glass(g.path('M8.3 12.6 H15.7 A3.7 3.7 0 0 1 8.3 12.6 Z'), 'c1', { outline: 0.45, glint: false, glow: 0.3, plate: 'A' }),
  ],
  // three layered slabs: sapphire quarry top, a gilded and a stone course below
  layers: (icon, g) => [
    tube(g, [[2.6, 16.2], [12, 20.9], [21.4, 16.2]], 2.1, { plate: 'A', step: 2.8 }),
    g.gilt(g.stroke([[2.6, 11.7], [12, 16.4], [21.4, 11.7]], 2.1), { plate: 'A' }),
    ...g.pane(g.poly([[12, 2.4], [21, 7.2], [12, 12], [3, 7.2]]), 'c2', { frame: 1.2, tracery: 'quarry', glass: { s: 2.1, medallion: false } }),
  ],
  // glazed panels in carved stone frames, each light leaded into quarters
  'layout-dashboard': (icon, g) => tiles(g, [[3, 3, 10, 12.5, 'c2'], [14, 3, 21, 7.5, 'c3'], [14, 11.5, 21, 21, 'c2'], [3, 16.5, 10, 21, 'c1']], { studs: false, cross: true }),
  'layout-grid': (icon, g) => tiles(g, [[3, 3, 10.2, 10.2, 'c2'], [13.8, 3, 21, 10.2, 'c3'], [13.8, 13.8, 21, 21, 'c2'], [3, 13.8, 10.2, 21, 'c3']], { studs: false, cross: true }),
  'layout-list': (icon, g) => [
    ...tiles(g, [[2.8, 3.3, 9.2, 9.7, 'c2'], [2.8, 14.3, 9.2, 20.7, 'c3']]),
    ...rods(g, [[12.4, 4.6, 21.4, { glass: 'c2' }], [12.4, 15.6, 21.4, { glass: 'c2' }]], { h: 2.4, l: false, r: false }),
    ...rods(g, [[12.4, 8.8, 18], [12.4, 19.6, 18]], { h: 2.4, l: false, r: false, plate: 'A' }),
  ],
  'layout-template': (icon, g) => [
    ...tiles(g, [[3, 2.8, 21, 8.9, 'c1'], [3, 12.3, 10.2, 21.2, 'c2']], { studs: false, cross: true }),
    ...rods(g, [[13.6, 13.2, 21.4, { glass: 'c2' }]], { h: 2.4, l: false, r: false }),
    ...rods(g, [[13.6, 17, 21.4], [13.6, 20.8, 18.6]], { h: 2.4, l: false, r: false, plate: 'A' }),
  ],
  // an emerald glass leaf leaded along its veins, a gilded stalk
  leaf: (icon, g) => [
    ...g.pane(g.path('M5.5 18.5 C3.5 10.5 9.5 3.4 20.6 3.4 C20.6 14.5 13.5 20.6 5.5 18.5 Z'), 'c4', { frame: 1.4, tracery: [[[9, 14.6], [8.6, 9]], [[11.5, 12.2], [11.6, 6.6]], [[14, 10], [14.8, 5.4]], [[9.6, 14.2], [15.4, 15]], [[12.2, 11.8], [17.6, 12]], [[14.6, 9.6], [19, 8.4]]] }),
    g.gilt(g.stroke([[3, 21], [5.2, 18.8], [8, 15.8], [11, 12.4], [13.4, 10.2], [17.4, 7]], 1.4), { plate: 'A', thin: true, outline: 0.35 }),
  ],
  library: (icon, g) => [
    g.stone(g.union(g.rim(g.rr(3.4, 3.4, 8.6, 20.6, 1), 1.1), g.rim(g.rr(8.4, 6.4, 12.6, 20.6, 1), 1.1))),
    g.glass(g.shrink(g.rr(3.4, 3.4, 8.6, 20.6, 1), 1.1), 'c1'),
    g.glass(g.shrink(g.rr(8.4, 6.4, 12.6, 20.6, 1), 1.1), 'c2'),
    g.gilt(g.union(g.rr(3.4, 6.6, 8.6, 7.5, 0), g.rr(3.4, 16.2, 8.6, 17.1, 0), g.rr(8.4, 9.2, 12.6, 10.1, 0), g.rr(8.4, 16.2, 12.6, 17.1, 0)), { thin: true, glint: false, outline: 0.25 }),
    ...g.plate('A', g.pane(g.path('M16.97 20.34 L19.48 19.66 A1.1 1.1 0 0 0 20.25 18.32 L17.21 7.06 A1.1 1.1 0 0 0 15.87 6.29 L13.37 6.97 A1.1 1.1 0 0 0 12.6 8.31 L15.63 19.57 A1.1 1.1 0 0 0 16.97 20.34 Z'), 'c4', { frame: 1.1, tracery: 'none' })),
    lintel(g, 2.2, 20.7, 21.8, 2),
  ],
  // a bulb of gold glass with a gilded filament, a banded gilt cap, rays
  lightbulb: (icon, g) => [
    ...g.pane(g.path('M9 15.6 C9 13.75 4.8 12.25 4.8 9 A7.2 7.2 0 0 1 19.2 9 C19.2 12.25 15 13.75 15 15.6 Z'), 'c3', { frame: 1.4, tracery: 'none', glass: { glow: 0.3 } }),
    g.gilt(g.stroke([[12, 15.4], [12, 12.4], [9.8, 10.2]], 1.2), { plate: 'A', thin: true, outline: 0.3 }),
    g.gilt(g.seg(12, 12.4, 14.2, 10.2, 1.2), { plate: 'A', thin: true, outline: 0.3 }),
    g.gilt(g.path('M8.8 15.2 H15.2 V19 A2.2 2.2 0 0 1 13 21.4 H11 A2.2 2.2 0 0 1 8.8 19 Z')),
    g.lead([[[8.8, 17.4], [15.2, 17.4]], [[9, 19.3], [15, 19.3]]], { w: 0.4, role: 'shadow', op: 0.55 }),
  ],
  // ---- batch 3 ---------------------------------------------------------------
  // two chain links of gilt, inlaid with sapphire enamel
  link: (icon, g) => [
    ...enamel(g, 'M11.29 17.66 L9.35 19.6 A3.5 3.5 0 0 1 4.4 14.65 L8.29 10.76 A3.5 3.5 0 0 1 13.63 11.23', 2.5, 'c2'),
    ...enamel(g, 'M12.71 6.34 L14.65 4.4 A3.5 3.5 0 0 1 19.6 9.35 L15.71 13.24 A3.5 3.5 0 0 1 10.37 12.77', 2.5, 'c2', { plate: 'A' }),
  ],
  'list-checks': (icon, g) => [
    ...rods(g, [[11, 6, 21.4], [11, 12, 21.4, { glass: 'c2' }], [11, 18, 21.4]]),
    ...enamel(g, [[[2.6, 6.1], [4.6, 8.1], [8.2, 4]], [[2.6, 18.1], [4.6, 20.1], [8.2, 16]]], 2.3, 'c4', { plate: 'A' }),
    ...qstuds(g, [[5.2, 12]], 1.9, 'c1', { plate: 'A' }),
  ],
  // a funnel of three corbelled rods of one stone, narrowing, the two wider ones glazed in ruby
  'list-filter': (icon, g) => [
    ...rods(g, [[2.8, 6, 21.2, { glass: 'c1' }], [6.2, 12, 17.8, { glass: 'c1' }], [9.4, 18, 14.6, { plate: 'A' }]], { h: 2.6 }),
  ],
  'list-music': (icon, g) => [
    ...rods(g, [[2.8, 6, 13.4, { glass: 'c2' }], [2.8, 12, 12.4], [2.8, 18, 9.4]]),
    g.gilt(g.union(g.seg(17.6, 4, 17.6, 17.4, 1.8), g.stroke('M17.6 4 C18.25 6 21.5 6.5 21.4 9.6', 1.8)), { plate: 'A' }),
    g.gilt(g.circle(15, 17.6, 3.1), { plate: 'A' }),
    g.glass(g.circle(15, 17.6, 2.2), 'c1', { plate: 'A', outline: 0.25, glow: 0.26 }),
  ],
  // illuminated numerals: gilded textura 1 and 2 on ruby chips, corbelled rods beside them
  'list-ordered': (icon, g) => [
    ...rods(g, [[10.8, 6, 21.4], [10.8, 12, 21.4, { glass: 'c2' }], [10.8, 18, 21.4]]),
    ...chip(g, g.union(g.rr(2.2, 2.3, 8.8, 9.7, 1.1), g.rr(2.2, 14.3, 8.8, 21.7, 1.1)), 'c1', { plate: 'A' }),
    g.gilt(g.union(textura(g, '1', 3.4, 3.3, 0.95), textura(g, '2', 3.6, 15.3, 0.95)), { plate: 'A', thin: true, outline: 0.32, glint: false }),
  ],
  'list-plus': (icon, g) => [
    ...rods(g, [[2.8, 6, 21.4], [2.8, 12, 15.2, { glass: 'c2' }], [2.8, 18, 11.2]]),
    ...enamel(g, [[[18, 14.6], [18, 21.4]], [[14.6, 18], [21.4, 18]]], 2.4, 'c4', { plate: 'S' }),
  ],
  // corbelled stone rods, the middle one glazed, each led by a gilded quatrefoil stud
  list: (icon, g) => [
    ...rods(g, [[8.4, 6, 21.4], [8.4, 12, 21.4, { glass: 'c2' }], [8.4, 18, 21.4]]),
    ...qstuds(g, [[4.4, 6], [4.4, 12], [4.4, 18]], 2.15, 'c1', { plate: 'A' }),
  ],
  // eight spokes of a rose window turning: stone and gilt, a gold quatrefoil hub
  loader: (icon, g) => {
    const ray = a => { const c = Math.cos(a * RAD), s = Math.sin(a * RAD); return [[12 + 5.6 * c, 12 + 5.6 * s], [12 + 9.3 * c, 12 + 9.3 * s]] }
    return [
      tube(g, [0, 90, 180, 270].map(ray), 2.3, { step: 9 }),
      g.gilt(g.stroke([45, 135, 225, 315].map(ray), 2.1), { plate: 'A' }),
      g.deco(g.glass(g.foil(12, 12, 2.6, 4, -45), 'c3', { outline: 0.35, glint: false })),
    ]
  },
  // a pointed portal glowing within, a gilded spear entering
  'log-in': (icon, g) => [
    g.stone(g.lancet(12.8, 2.4, 21.6, 21.6, 0.85), { ashlar: { h: 2.4, w: 3, y0: 2.4, y1: 21.6 } }),
    g.recess(g.lancet(14.6, 5.4, 19.8, 21.6, 0.85), { glow: 'c3', glowOp: 0.6 }),
    ...enamel(g, [[[2.8, 12], [12.6, 12]]], 2.4, 'c1', { plate: 'A' }),
    ...spears(g, [[17.4, 12, 0]], 5.4, 4.2, { plate: 'A' }),
  ],
  'log-out': (icon, g) => [
    g.stone(g.lancet(2.4, 2.4, 11.2, 21.6, 0.85), { ashlar: { h: 2.4, w: 3, y0: 2.4, y1: 21.6 } }),
    g.recess(g.lancet(4.2, 5.4, 9.4, 21.6, 0.85), { glow: 'c3', glowOp: 0.6 }),
    ...enamel(g, [[[7.6, 12], [16.8, 12]]], 2.4, 'c1', { plate: 'A' }),
    ...spears(g, [[21.6, 12, 0]], 5.4, 4.2, { plate: 'A' }),
  ],
  // a pilgrim's chest: emerald glass in stone, gilded handle and straps, gilt wheels and studs
  luggage: (icon, g) => [
    g.gilt(g.union(g.circle(8, 20.6, 1.3), g.circle(16, 20.6, 1.3)), { thin: true }),
    ...g.pane(g.rr(4.8, 5.4, 19.2, 18.8, 2), 'c4', { frame: 1.4, tracery: 'none' }),
    g.gilt(g.union(g.stroke('M9.6 5.6 V3.6 A1.1 1.1 0 0 1 10.7 2.5 H13.3 A1.1 1.1 0 0 1 14.4 3.6 V5.6', 1.6), g.rr(8.7, 5.4, 10.3, 18.8, 0), g.rr(13.7, 5.4, 15.3, 18.8, 0)), { plate: 'A', thin: true }),
    g.studs([[9.5, 9], [14.5, 9], [9.5, 15], [14.5, 15]], 0.42),
  ],
  // the mail exemplar's envelope, sealed with an emerald check
  'mail-check': (icon, g) => {
    const body = g.rr(2.5, 4.8, 21.5, 19.2, 2)
    return [
      g.stone(g.rim(body, 1.5)),
      g.glass(g.shrink(body, 1.5), 'c2', { tracery: 'quarry', medallion: false }),
      g.stone(g.stroke([[3.4, 6.4], [12, 13], [20.6, 6.4]], 1.3), { thin: true, plate: 'A' }),
      g.glass(g.shrink(g.poly([[3.8, 6.2], [20.2, 6.2], [12, 12.8]]), 0.55), 'c3', { plate: 'A' }),
      ...g.badge('check', 17.6, 17.6, 4.2, 'c4'),
    ]
  },
  // an opened envelope: the gold flap raised like a gable over the sapphire body
  'mail-open': (icon, g) => {
    const env = g.path('M12 3.2 L21.6 9.8 V19 A2.1 2.1 0 0 1 19.5 21.1 H4.5 A2.1 2.1 0 0 1 2.4 19 V9.8 Z')
    const inner = g.shrink(env, 1.5)
    return [
      g.stone(g.rim(env, 1.5)),
      g.glass(inner, 'c2', { tracery: 'quarry', medallion: false }),
      g.glass(g.inter(inner, g.poly([[0, 10.6], [12, 2], [24, 10.6]])), 'c3', { outline: 0.3, glint: false, plate: 'A', tracery: 'medallion' }),
      g.stone(g.stroke([[2.8, 10.2], [12, 16.6], [21.2, 10.2]], 1.3), { thin: true, plate: 'A' }),
    ]
  },
  // a ruby pin whose head holds a small gold rose window
  'map-pin': (icon, g) => [
    ...g.pane(g.path('M19.6 10 C19.6 14.5 15.5 18.6 12 21.6 C8.5 18.6 4.4 14.5 4.4 10 A7.6 7.6 0 0 1 19.6 10 Z'), 'c1', { frame: 1.5, tracery: [[[12, 14], [12, 21]], [[8.6, 12.6], [6.4, 15]], [[15.4, 12.6], [17.6, 15]]] }),
    ...g.plate('A', g.rose(12, 10, 3.4, 'c3', { n: 6, frame: 1, medal: 'c1' })),
  ],
  // a folded map as a triptych of glass in stone, a ruby jewel marks the place
  map: (icon, g) => {
    const M = g.poly([[2.8, 5.9], [9, 3.3], [15, 5.8], [21.2, 3.3], [21.2, 18.1], [15, 20.7], [9, 18.2], [2.8, 20.7]])
    const inner = g.shrink(M, 1.3)
    return [
      g.stone(g.rim(M, 1.3)),
      g.glass(g.inter(inner, g.rect(0, 0, 9, 24)), 'c4', { outline: 0, tracery: 'quarry', medallion: false, s: 2.4 }),
      g.glass(g.inter(inner, g.rect(9, 0, 15, 24)), 'c3', { outline: 0, glint: false }),
      g.glass(g.inter(inner, g.rect(15, 0, 24, 24)), 'c4', { outline: 0, tracery: 'quarry', medallion: false, s: 2.4 }),
      g.stone(g.union(g.seg(9, 3.6, 9, 18, 1.3), g.seg(15, 6, 15, 20.4, 1.3)), { thin: true, plate: 'A' }),
      ...jewel(g, 12, 10.6, 1.4, 'c1', { plate: 'A' }),
    ]
  },
  // a glazed mullion from corner to corner, gilded spear heads at both ends, a ruby quatrefoil at its heart
  maximize: (icon, g) => [
    ...channel(g, [[[6.4, 17.6], [17.6, 6.4]]], 2.9, 'c2'),
    ...spears(g, [[21.3, 2.7, -45], [2.7, 21.3, 135]], 6.6, 4.8, { plate: 'A' }),
    ...qstuds(g, [[12, 12]], 2.6, 'c1', { rot: -90 }),
  ],
  // two glazed shafts driving spear points into the centre, gilded quatrefoil studs at the corners
  minimize: (icon, g) => [
    ...channel(g, [[[19.8, 4.2], [16.6, 7.4]], [[4.2, 19.8], [7.4, 16.6]]], 2.9, 'c2'),
    ...spears(g, [[13.2, 10.8, 135], [10.8, 13.2, -45]], 5.2, 3.9, { plate: 'A' }),
    ...qstuds(g, [[19.7, 4.3], [4.3, 19.7]], 2.3, 'c1'),
  ],
  // a medal: sapphire ribbon set in gilt, a gilded disc with a ruby rose
  medal: (icon, g) => [
    ...g.plate('A', gem(g, g.poly([[9.2, 12.4], [4.4, 2.3], [9.6, 2.3], [12, 6.6], [14.4, 2.3], [19.6, 2.3], [14.8, 12.4]]), 'c2', { rim: 0.65, tracery: [[[12, 6.6], [12, 13]]] })),
    g.gilt(g.circle(12, 16, 5.6)),
    g.glass(g.circle(12, 16, 4.2), 'c1', { outline: 0.28, tracery: 'rose', n: 8, medal: 'c3', at: { c: [12, 16], r: 4.2 } }),
  ],
  // a herald's horn: ruby glass in stone, gilded band and grip
  megaphone: (icon, g) => [
    g.gilt(g.stroke('M9.55 15.28 L9.62 19.38 A1.75 1.75 0 0 1 6.12 19.45 L6.06 15.94', 1.8), { plate: 'A' }),
    ...g.pane(g.path('M5.35 9.89 L8.64 8.7 C11.53 7.42 13 5.43 14.54 3.21 A1 1 0 0 1 16.3 3.44 L20.11 13.9 A1 1 0 0 1 18.91 15.21 C16.3 14.5 13.89 13.93 10.86 14.8 L7.57 16 A2 2 0 0 1 5.01 14.81 L4.15 12.46 A2 2 0 0 1 5.35 9.89 Z'), 'c1', { frame: 1.3, tracery: 'none' }),
    g.gilt(g.seg(8.7, 8.4, 10.9, 14.9, 1.3), { plate: 'A', thin: true }),
    g.deco(g.gilt(g.stroke([arcP(g, 18, 9, 4.6, -60, -20), arcP(g, 18, 9, 6.4, -55, -25)], 0.9), { thin: true, outline: 0.3, glint: false })),
  ],
  meh: (icon, g) => [
    ...roseFace(g, 'c2'),
    g.recess(g.union(g.circle(9.5, 10.3, 1.05), g.circle(14.5, 10.3, 1.05), g.rr(8.9, 14.1, 15.1, 15.4, 0.65)), { plate: 'A', outline: 0 }),
  ],
  // three carved lintels with jointed end stones; the middle one glazed and ending in gilded quatrefoils
  menu: (icon, g) => [
    ...rods(g, [[3.4, 6, 20.6], [3.4, 18, 20.6]], { h: 2.6 }),
    ...rods(g, [[4.6, 12, 19.4, { glass: 'c2' }]], { l: false, r: false, h: 2.6, plate: 'A' }),
    ...qstuds(g, [[4.1, 12], [19.9, 12]], 2.2, 'c1', { plate: 'A' }),
  ],
  // speech: sapphire glass bubbles in stone frames
  'message-circle': (icon, g) => g.pane(g.path('M8 19.4 A9.1 9.1 0 1 0 4.6 16 L2.4 21.6 Z'), 'c2', { frame: 1.6, tracery: 'rose', glass: { n: 8, at: { c: [12.4, 11.4], r: 7 }, medal: 'c3' } }),
  'message-circle-more': (icon, g) => [
    ...g.pane(g.path('M8 19.4 A9.1 9.1 0 1 0 4.6 16 L2.4 21.6 Z'), 'c2', { frame: 1.6, tracery: 'quarry', glass: { medallion: false, s: 3.2 } }),
    ...jewels(g, [[8, 11.6], [12.5, 11.6], [17, 11.6]], 1.5, 'c3', { plate: 'A' }),
  ],
  'message-square': (icon, g) => g.pane(g.path('M3 21.2 V5.5 A2 2 0 0 1 5 3.4 H19 A2 2 0 0 1 21.1 5.5 V15.6 A2 2 0 0 1 19 17.6 H6.6 Z'), 'c2', { frame: 1.5, tracery: 'quarry', glass: { at: { c: [12, 10.5], r: 4.4 } } }),
  'message-square-text': (icon, g) => [
    ...g.pane(g.path('M3 21.2 V5.5 A2 2 0 0 1 5 3.4 H19 A2 2 0 0 1 21.1 5.5 V15.6 A2 2 0 0 1 19 17.6 H6.6 Z'), 'c2', { frame: 1.5, tracery: 'quarry', glass: { medallion: false, s: 2.6 } }),
    g.gilt(g.union(g.rr(7, 7.6, 17, 9.4, 0.9), g.rr(7, 11.6, 13.6, 13.4, 0.9)), { plate: 'A' }),
  ],
  messages: (icon, g) => [
    ...g.plate('A', g.pane(g.path('M17.4 7.8 H19 A2.1 2.1 0 0 1 21.1 9.9 V21.4 L17.4 17.6 H11 A2.1 2.1 0 0 1 8.9 15.5 V9.9 A2.1 2.1 0 0 1 11 7.8 Z'), 'c3', { frame: 1.4, tracery: 'none' })),
    g.cut(g.grow(g.path('M2.9 16.2 V5 A2 2 0 0 1 5 2.9 H13 A2.1 2.1 0 0 1 15.1 5 V10.5 A2.1 2.1 0 0 1 13 12.6 H6.5 Z'), 0.75)),
    ...g.pane(g.path('M2.9 16.2 V5 A2 2 0 0 1 5 2.9 H13 A2.1 2.1 0 0 1 15.1 5 V10.5 A2.1 2.1 0 0 1 13 12.6 H6.5 Z'), 'c2', { frame: 1.4, tracery: 'quarry', glass: { medallion: false, s: 2.3 } }),
  ],
  // ---- batch 4 ---------------------------------------------------------------
  // a microphone: ruby capsule grilled with lancet bars, gilded yoke and stand
  microphone: (icon, g) => [
    g.gilt(g.union(g.stroke(arcP(g, 12, 11, 6.5, 0, 180), 1.7), g.seg(12, 17.4, 12, 20.8, 1.7), g.rr(8.4, 20.2, 15.6, 22, 0.8)), { plate: 'A' }),
    ...g.pane(g.rr(8.6, 2.3, 15.4, 15, 3.4), 'c1', { frame: 1.3, tracery: 'lancet', glass: { s: 1.9 } }),
  ],
  'microphone-off': (icon, g) => [
    g.gilt(g.union(g.stroke(arcP(g, 12, 11, 6.5, 0, 180), 1.7), g.seg(12, 17.4, 12, 20.8, 1.7), g.rr(8.4, 20.2, 15.6, 22, 0.8)), { plate: 'A' }),
    ...g.pane(g.rr(8.6, 2.3, 15.4, 15, 3.4), 'c1', { frame: 1.3, tracery: 'lancet', glass: { s: 1.9 } }),
    ...g.slash(3.2, 3.2, 20.8, 20.8),
  ],
  // a microscope: gilded tube with sapphire inlay on a carved stone arm and plinth
  microscope: (icon, g) => [
    tube(g, [[11.6, 5.5], [14.6, 6.3], [17, 8.1], [18.5, 10.6], [19, 13.25], [18.5, 16.2], [16.8, 18.9], [14, 21]], 2.2, { step: 3 }),
    lintel(g, 4.2, 20.9, 19.8, 2.3),
    g.gilt(g.rr(7.8, 14.7, 18.9, 16.4, 0.8), { thin: true }),
    g.gilt(g.seg(10.75, 10.46, 12, 12.6, 1.8), { plate: 'A', thin: true }),
    ...g.plate('A', gem(g, g.path('M5.2 5.53 L8.2 10.72 A1.1 1.1 0 0 0 9.7 11.2 L11.9 9.94 A1.1 1.1 0 0 0 12.3 8.44 L9.3 3.25 A1.1 1.1 0 0 0 7.8 2.85 L5.6 4.1 A1.1 1.1 0 0 0 5.2 5.53 Z'), 'c2', { rim: 0.65 })),
  ],
  'minus-circle': (icon, g) => [
    ...g.pane(g.circle(12, 12, 9.5), 'c1', { frame: 1.7, tracery: 'rose', glass: { n: 12, at: { c: [12, 12], r: 7.8 }, medallion: false } }),
    g.cut(g.grow(g.rr(7, 10.6, 17, 13.4, 1.4), 0.5)),
    g.gilt(g.rr(7, 10.6, 17, 13.4, 1.4), { plate: 'A' }),
  ],
  // a lancet-pointed stone bar glazed with ruby
  minus: (icon, g) => {
    const B = pbar(g, 5.2, 12, 18.8, 12, 3.6)
    return [g.stone(B), g.glass(g.shrink(B, 0.85), 'c1', { outline: 0.22, glow: 0.3 }), g.studs([[7.4, 12], [16.6, 12]], 0.55)]
  },
  // a monitor: sapphire quarry screen in stone, gilded stand on a stone foot
  monitor: (icon, g) => [
    g.gilt(g.seg(12, 16, 12, 20.6, 2), { plate: 'A' }),
    g.stone(g.rr(7.6, 19.8, 16.4, 21.8, 0.9), { thin: true, plate: 'A' }),
    ...g.pane(g.rr(2, 3.4, 22, 16.6, 2), 'c2', { frame: 1.5, tracery: 'quarry', glass: { s: 2.5 } }),
  ],
  // a gold glass crescent leaded like a rose, a gilded star beside it
  moon: (icon, g) => [
    ...g.pane(g.path('M21.2 13 A9.2 9.2 0 1 1 11 2.8 A7.1 7.1 0 0 0 21.2 13 Z'), 'c3', { frame: 1.4, tracery: Array.from({ length: 7 }, (_, k) => { const a = (100 + 25 * k) * RAD; return [[12 + 2 * Math.cos(a), 12 + 2 * Math.sin(a)], [12 + 11 * Math.cos(a), 12 + 11 * Math.sin(a)]] }), glass: { medal: 'c2' } }),
    g.deco(g.gilt(g.star(17.6, 5.6, 2.4, 1, 4), { thin: true, outline: 0.32 })),
  ],
  'more-horizontal': (icon, g) => [
    ...jewels(g, [[5, 12], [19, 12]], 2.3, 'c2', { plate: 'A' }),
    ...jewels(g, [[12, 12]], 2.3, 'c1'),
  ],
  'more-vertical': (icon, g) => [
    ...jewels(g, [[12, 5], [12, 19]], 2.3, 'c2', { plate: 'A' }),
    ...jewels(g, [[12, 12]], 2.3, 'c1'),
  ],
  // a motorcycle on two rose-window wheels: a stone saddle, a ruby glass tank, a gilded frame and fork
  motorcycle: (icon, g) => {
    const W = [[6.2, 16.9], [17.5, 16.9]], r = 4.1
    const spokes = W.flatMap(([x, y]) => [0, 45, 90, 135].map(a => { const c = Math.cos(a * RAD) * r, s = Math.sin(a * RAD) * r; return [[r2(x - c), r2(y - s)], [r2(x + c), r2(y + s)]] }))
    return [
      g.glass(g.union(...W.map(([x, y]) => g.circle(x, y, r - 1))), 'c2', { tracery: spokes, glint: false, glow: 0.22 }),
      g.stone(g.union(...W.map(([x, y]) => g.ring(x, y, r - 0.6, 1.2)))),
      g.studs(W, 1.05),
      g.gilt(g.stroke([[6.2, 16.9], [9.6, 13], [13.4, 13]], 1.6)),
      g.stone(g.path('M2.4 10.8 A1.6 1.6 0 0 1 4 9.2 H9 V12.2 H4.2 A1.8 1.8 0 0 1 2.4 10.8 Z')),
      g.glass(g.path('M8.4 9 H15.8 C15.8 11.6 14.2 13.9 11.6 13.9 H10.4 C9.2 13.9 8.4 12.8 8.4 11.6 Z'), 'c1', { outline: 0.45, glow: 0.3, tracery: [[[12, 8], [11.2, 15]]] }),
      g.gilt(g.stroke([[17.5, 16.9], [15.4, 8.4], [12.8, 7.4]], 1.7), { plate: 'A' }),
    ]
  },
  // an emerald mountain with a stone snowcap, a stone ridge leading down
  mountain: (icon, g) => {
    const M = g.poly([[1.8, 20.4], [9.5, 4.6], [14, 13.6], [16.5, 9.6], [22.2, 20.4]])
    return [
      ...g.pane(M, 'c4', { frame: 1.3, tracery: 'quarry', glass: { medallion: false, s: 2.4 } }),
      g.stone(g.poly([[6.6, 10.6], [9.5, 4.6], [12.4, 10.6], [10.8, 9.6], [9.5, 11], [8.2, 9.6]]), { thin: true, outline: 0.35 }),
      g.stone(g.seg(14, 13.8, 17, 19.6, 1.2), { thin: true, plate: 'A' }),
    ]
  },
  // a mouse: sapphire glass shell in stone, a stone parting, gilded wheel
  mouse: (icon, g) => [
    ...g.pane(g.path('M12 2.4 A6.6 6.6 0 0 1 18.6 9 V15 A6.6 6.6 0 0 1 5.4 15 V9 A6.6 6.6 0 0 1 12 2.4 Z'), 'c2', { frame: 1.4, tracery: 'none' }),
    g.stone(g.union(g.seg(5.8, 12.6, 18.2, 12.6, 1.2), g.seg(12, 3.4, 12, 12.6, 1.2)), { thin: true }),
    g.gilt(g.rr(11, 5.2, 13, 9.6, 1), { plate: 'A' }),
  ],
  // four ways: a glazed stone cross, gilded spear heads, a ruby quatrefoil at the crossing
  move: (icon, g) => [
    ...channel(g, [[[12, 6], [12, 18]], [[6, 12], [18, 12]]], 2.4, 'c2'),
    ...spears(g, [[12, 2.2, -90], [21.8, 12, 0], [12, 21.8, 90], [2.2, 12, 180]], 4.6, 3.5, { plate: 'A', pierce: false }),
    ...qstuds(g, [[12, 12]], 2.9, 'c1', { rot: -90 }),
  ],
  // a pointer of emerald glass, one face in shade
  navigation: (icon, g) => {
    const P = g.poly([[20.6, 3.4], [13.5, 21.4], [10.4, 13.6], [2.6, 10.5]])
    const inner = g.shrink(P, 1.5)
    return [
      g.stone(g.rim(P, 1.5)),
      g.glass(g.inter(inner, g.poly([[0, 0], [24, 0], [0, 24]])), 'c4', { outline: 0, tracery: 'none' }),
      g.glass(g.inter(inner, g.poly([[24, 0], [24, 24], [0, 24]])), 'c4', { outline: 0, deep: 0.3, glint: false }),
      g.lead([[[20, 4], [10.6, 13.4]]], { w: 0.6 }),
    ]
  },
  // a chapter of nodes: a glazed head tile, gilded conduits, three glass jewels below
  network: (icon, g) => [
    g.gilt(g.stroke([[[12, 7.4], [12, 17]], [[4, 17], [4, 12.5], [20, 12.5], [20, 17]]], 1.5), { plate: 'A' }),
    ...tiles(g, [[8.2, 2.3, 15.8, 8.2, 'c2']], { r: 1.4, frame: 1.1, studs: false, cross: true }),
    g.gilt(g.union(g.rr(1.8, 16.4, 6.4, 21.4, 1.1), g.rr(9.7, 16.4, 14.3, 21.4, 1.1), g.rr(17.6, 16.4, 22.2, 21.4, 1.1)), { glint: false }),
    g.glass(g.union(g.rr(2.5, 17.1, 5.7, 20.7, 0.6), g.rr(10.4, 17.1, 13.6, 20.7, 0.6), g.rr(18.3, 17.1, 21.5, 20.7, 0.6)), 'c3', { outline: 0.24, glint: false, glow: 0.3 }),
  ],
  // a folded broadsheet: a ruby headline set in gilt over two lancet columns of sapphire text
  newspaper: (icon, g) => [
    g.stone(g.path('M7 9 H4.5 A1.5 1.5 0 0 0 3 10.5 V18.5 A1.6 1.6 0 0 0 4.6 20.1 H7.2 Z'), { thin: true }),
    g.stone(g.path('M4.5 20.1 H19 A2.1 2.1 0 0 0 21.1 18 V6 A2.1 2.1 0 0 0 19 3.9 H9 A2.1 2.1 0 0 0 6.9 6 V17.5 A2.6 2.6 0 0 1 4.5 20.1 Z')),
    ...gem(g, g.rr(9.3, 6, 18.9, 9.6, 0.8), 'c1', { plate: 'A', rim: 0.55 }),
    g.glass(g.union(g.lancet(9.4, 11.2, 13.5, 18.4, 1), g.lancet(14.7, 11.2, 18.8, 18.4, 1)), 'c2', { outline: 0.38, glint: false, glow: 0.24, tracery: [[[8, 14.3], [20, 14.3]], [[8, 16.4], [20, 16.4]]] }),
  ],
  // a book of hours: ruby glass cover with a gold quatrefoil, gilded clasps and title
  notebook: (icon, g) => [
    g.gilt(g.stroke([[[3.4, 7], [8, 7]], [[3.4, 12], [8, 12]], [[3.4, 17], [8, 17]]], 1.6), { plate: 'A' }),
    ...g.pane(g.rr(6, 2.4, 20.2, 21.6, 2), 'c1', { frame: 1.5, tracery: 'medallion', glass: { at: { c: [13.3, 14], r: 4 } } }),
    g.gilt(g.rr(10.6, 6.4, 16.8, 8.6, 0.8), { plate: 'A', thin: true }),
  ],
}
