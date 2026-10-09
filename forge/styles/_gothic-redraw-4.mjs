// GOTHIC hand redraws, chunk 4 of 5 (owned by the chunk-4 redrawer): notepad-text .. sliders.
// Map icon name -> (icon, g) => parts, built with the frozen kit g (see forge/styles/GOTHIC-GUIDE.md).
// Names listed in EXEMPLAR (_gothic-render.mjs) are ignored here (rocket, search, settings).
import * as P from './_gothic-prim.mjs'

// ---- local helpers -----------------------------------------------------------
const sub = P.cut // boolean difference (g.cut is the moat part)
const RAD = Math.PI / 180
const f1 = v => Math.round(v * 100) / 100
// rotate local points (x along ang, y across) and place them at (ox, oy)
const place = (pts, ox, oy, ang) => {
  const c = Math.cos(ang * RAD), s = Math.sin(ang * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
const pathOf = (cmds, ox, oy, ang) => cmds.map(([k, ...pts]) => k + place(pts, ox, oy, ang).map(p => p.join(' ')).join(' ')).join(' ')
const lpoly = (g, pts, ox, oy, ang) => g.poly(place(pts, ox, oy, ang))
const lseg = (g, x0, y0, x1, y1, ox, oy, ang, w) => { const [a, b] = place([[x0, y0], [x1, y1]], ox, oy, ang); return g.seg(a[0], a[1], b[0], b[1], w) }
const pt = (cx, cy, r, a) => [f1(cx + r * Math.cos(a * RAD)), f1(cy + r * Math.sin(a * RAD))]

// the ogival arrow head (tip at the origin, pointing +x), scale s, pierced by a glowing trefoil
const HEAD = (s, t = s) => [
  ['M', [0, 0]],
  ['C', [-3.2 * s, -1.2 * t], [-6.2 * s, -3.6 * t], [-8.6 * s, -7.2 * t]],
  ['C', [-7.8 * s, -4.4 * t], [-7.6 * s, -2 * t], [-7.8 * s, 0]],
  ['C', [-7.6 * s, 2 * t], [-7.8 * s, 4.4 * t], [-8.6 * s, 7.2 * t]],
  ['C', [-6.2 * s, 3.6 * t], [-3.2 * s, 1.2 * t], [0, 0]],
  ['Z'],
]
function head(g, tx, ty, ang, s = 1, plate = 'K', narrow = 1) {
  const [c] = place([[-5 * s, 0]], tx, ty, ang)
  return [
    g.gilt(g.path(pathOf(HEAD(s, s * narrow), tx, ty, ang)), { plate }),
    s >= 0.6 ? g.recess(g.foil(c[0], c[1], 1.4 * s, 3, ang + 180), { outline: 0.15, glow: 'c3', plate }) : null,
  ]
}
// the fleur terminal at the tail of a gilded shaft: a trefoil knob forged onto the shaft,
// pointing away (ang), set with a cabochon of glass, so every arrow carries its jewel.
// t = [x, y, ang, role, R]; returns [knob field, cabochon field]
function tailF(g, t) {
  const [x, y, ang, , R = 2.4] = t
  const [c] = place([[R * 0.18, 0]], x, y, ang)
  return [g.foil(c[0], c[1], R, 3, ang), g.circle(c[0], c[1], R * 0.5)]
}
const bead = (g, F, role, plate) => g.glass(F, role, { plate, outline: 0.25, glint: false, glow: 0.32 })
// a gilded shaft along an SVG path ending in a head at (tx, ty) pointing ang, with an
// optional fleur terminal at its tail
function arrowPath(g, d, tx, ty, ang, s = 0.72, w = 2.3, plate = 'K', tail = null) {
  const T = tail && tailF(g, tail)
  return [g.gilt(T ? g.union(g.stroke(d, w), T[0]) : g.stroke(d, w), { plate }), ...head(g, tx, ty, ang, s, plate), T ? bead(g, T[1], tail[3], plate) : null]
}
// a rotated ellipse (ang in degrees)
const rell = (g, cx, cy, rx, ry, ang = 0) => g.poly(place(Array.from({ length: 44 }, (_, k) => [rx * Math.cos(k * Math.PI / 22), ry * Math.sin(k * Math.PI / 22)]), cx, cy, ang))
// the outline of a rounded rectangle as a closed polyline
const rrPts = (x0, y0, x1, y1, r) => [...P.arcPts(x0 + r, y0 + r, r, 180, 270), ...P.arcPts(x1 - r, y0 + r, r, 270, 360), ...P.arcPts(x1 - r, y1 - r, r, 0, 90), ...P.arcPts(x0 + r, y1 - r, r, 90, 180), [x0, y0 + r]].map(([x, y]) => [f1(x), f1(y)])
// a carved moulding: a dark groove with its lit lip below-right (smooth stone, no coursing)
const groove = (g, pts, plate = 'K') => [
  g.lead([pts], { role: 'edge', w: 0.36, op: 0.95, plate }),
  g.lead([pts.map(([x, y]) => [f1(x + 0.3), f1(y + 0.3)])], { role: 'shine', w: 0.24, op: 0.8, plate }),
]
// an illuminated initial's ground: a small carved stone frame round a dark glass inlay
const initial = (g, x0, y0, x1, y1, role = 'c2', plate = 'K') => g.pane(g.rr(x0, y0, x1, y1, 2.2), role, { frame: 1.25, tracery: 'quarry', plate, glass: { medallion: false, s: 2.1, dark: 0.5, deep: 0.16, glow: 0.12, lw: 0.22 } })
// a smooth carved stone body (an object, not a wall) with an inset moulding
const carved = (g, x0, y0, x1, y1, r = 2, inset = 1.1, plate = 'K') => [
  g.stone(g.rr(x0, y0, x1, y1, r), { plate }),
  ...groove(g, rrPts(x0 + inset, y0 + inset, x1 - inset, y1 - inset, Math.max(0.4, r - inset * 0.6)), plate),
]
// a jewelled boss: a gilt ring round a glass roundel
const boss = (g, cx, cy, r = 2.2, role = 'c1', plate = 'K') => [
  g.gilt(g.circle(cx, cy, r), { plate, glint: false }),
  g.glass(g.circle(cx, cy, r - 0.7), role, { plate, outline: 0.25, glow: 0.3 }),
]
// a spherical triangle (the gothic triangular window): tip (tx, ty), pointing ang, length L, half-height h
function sphTri(g, tx, ty, ang, L = 14, h = 8.4, bulge = 1.5) {
  const A = [-L, -h], B = [0, 0], C = [-L, h]
  const n1 = [-L / 2 + bulge * 0.5, -h / 2 - bulge * 0.87], n2 = [-L / 2 + bulge * 0.5, h / 2 + bulge * 0.87], n3 = [-L - bulge, 0]
  return g.path(pathOf([['M', A], ['Q', n1, B], ['Q', n2, C], ['Q', n3, A], ['Z']], tx, ty, ang))
}
const triPane = (g, tx, ty, ang, L, h, role = 'c1', plate = 'K') => {
  const T = sphTri(g, tx, ty, ang, L, h)
  const [c] = place([[-L * 0.62, 0]], tx, ty, ang)
  return g.pane(T, role, { frame: 1.3, tracery: 'medallion', plate, glass: { lobes: 3, at: { c, r: h * 0.5 }, medal: 'c3' } })
}

// the phone handset: a sapphire glass handset in a carved stone frame, earpiece top-left
const HANDSET = 'M5.4 2.8 L8.6 2.7 C9.6 2.7 10.3 3.4 10.4 4.3 L10.8 7.6 C10.9 8.5 10.3 9.3 9.4 9.6 L8.2 10 C9.4 12.6 11.6 14.8 14.2 16 L14.6 14.8 C14.9 13.9 15.7 13.3 16.6 13.4 L19.8 13.8 C20.7 13.9 21.4 14.6 21.4 15.5 L21.3 18.6 C21.3 20.2 20 21.5 18.4 21.4 C9.6 20.8 3.2 14.4 2.6 5.6 C2.5 4 3.8 2.8 5.4 2.8 Z'
const handset = (g, role = 'c2') => g.pane(g.path(HANDSET), role, { frame: 1.35, tracery: [[[3, 10.6], [9.6, 8.4]], [[13.6, 14.8], [15.8, 21.4]]], glass: { dark: 0.35 } })

// a panelled window (layout icons): stone frame, a gold panel strip and a sapphire lancet light
function panelWin(g, side) {
  const out = [g.stone(g.rr(2.8, 3, 21.2, 21, 2.4), { ashlar: { h: 2.2, w: 3.2, y0: 3, y1: 21 } })]
  const strip = { left: g.rr(4.5, 4.7, 8.6, 19.3, [1.2, 0, 0, 1.2]), right: g.rr(15.4, 4.7, 19.5, 19.3, [0, 1.2, 1.2, 0]), bottom: g.rr(4.5, 15.2, 19.5, 19.3, [0, 0, 1.2, 1.2]) }[side]
  out.push(g.glass(strip, 'c3', { outline: 0.4, tracery: side === 'bottom' ? [[[8.2, 14], [8.2, 21]], [[12, 14], [12, 21]], [[15.8, 14], [15.8, 21]]] : [[[3, 8.5], [10, 8.5]], [[3, 12], [10, 12]], [[3, 15.5], [10, 15.5]], [[14, 8.5], [21, 8.5]], [[14, 12], [21, 12]], [[14, 15.5], [21, 15.5]]], glint: false }))
  const L = { left: [10.2, 4.7, 19.5, 19.3], right: [4.5, 4.7, 13.8, 19.3], bottom: [4.5, 4.7, 19.5, 13.6] }[side]
  out.push(g.glass(g.lancet(L[0], L[1], L[2], L[3], side === 'bottom' ? 0.62 : 0.9), 'c2', { outline: 0.4, tracery: 'lancet', s: 2.3 }))
  return out
}

// a leaf blade: from (ox, oy) along ang, length L, half-width w, curling by bend
function leafF(g, ox, oy, ang, L = 8, w = 1.8, bend = 0.2) {
  const up = [], dn = [], mid = []
  for (let k = 0; k <= 12; k++) {
    const t = k / 12, x = t * L, cy = bend * L * t * t, hw = w * Math.sin(Math.PI * Math.min(1, t * 1.05)) * (1 - 0.25 * t)
    up.push([x, cy - hw]); dn.push([x, cy + hw]); mid.push([x, cy])
  }
  return { F: g.poly(place([...up, ...dn.reverse()], ox, oy, ang)), rib: place(mid.slice(1, 11), ox, oy, ang) }
}
const leaf = (g, ox, oy, ang, L, w, bend, role = 'c4', plate = 'K') => {
  const l = leafF(g, ox, oy, ang, L, w, bend)
  return g.glass(l.F, role, { outline: 0.38, tracery: [l.rib], plate, glint: false, glow: 0.24 })
}

// the heater shield of the security family
const SHIELD = 'M12 2.4 L20 5.2 V11 C20 15.8 16.8 19.4 12 21.6 C7.2 19.4 4 15.8 4 11 V5.2 Z'

// curved gilt bands used by refresh / rotate

// a gilded arrow along a circular arc a0 -> a1 (degrees), head at the a1 end
function arcArrow(g, cx, cy, r, a0, a1, s = 0.62, w = 2.3, plate = 'K', tail = null) {
  const dir = Math.sign(a1 - a0), at = a1 + dir * (7.6 * s / r) / RAD
  const [bx, by] = pt(cx, cy, r, a1), [tx, ty] = pt(cx, cy, r, at)
  const T = tail && tailF(g, [...pt(cx, cy, r, a0), a0 - dir * 90])
  return [
    g.gilt(T ? g.union(g.arc(cx, cy, r, a0, a1 + dir * 4, w), T[0]) : g.arc(cx, cy, r, a0, a1 + dir * 4, w), { plate }),
    ...head(g, tx, ty, Math.atan2(ty - by, tx - bx) / RAD, s, plate, 0.62),
    T ? bead(g, T[1], tail, plate) : null,
  ]
}
// a plane (nose +x) as a field, placed at (ox, oy) heading ang, scale k
function planeF(g, ox, oy, ang, k = 1) {
  const sc = pts => pts.map(([x, y]) => [x * k, y * k])
  const wing = [[3, -1.2], [-2, -9.6], [-4.6, -9.6], [-3.2, -1.2]], tail = [[-6.2, -1], [-8.4, -4.8], [-10, -4.8], [-9.4, -1]]
  const mir = pts => pts.map(([x, y]) => [x, -y]).reverse()
  return g.union(lseg(g, -9.4 * k, 0, 9.4 * k, 0, ox, oy, ang, 3.4 * k), lpoly(g, sc(wing), ox, oy, ang), lpoly(g, sc(mir(wing)), ox, oy, ang), lpoly(g, sc(tail), ox, oy, ang), lpoly(g, sc(mir(tail)), ox, oy, ang))
}
const plane = (g, ox, oy, ang, k = 1, plate = 'K') => [
  ...g.pane(planeF(g, ox, oy, ang, k), 'c2', { frame: 1.05, tracery: [place([[-12, -5.6 * k], [12, -5.6 * k]], ox, oy, ang), place([[-12, 5.6 * k], [12, 5.6 * k]], ox, oy, ang)], plate, glass: { glow: 0.24 } }),
  g.glass(lseg(g, 4.6 * k, 0, 8.6 * k, 0, ox, oy, ang, 1.2 * k), 'c3', { outline: 0.3, glint: false, plate }),
  // gilt flaps on the trailing edges (the moving part)
  g.gilt(g.union(lseg(g, -3 * k, -3.3 * k, -3.7 * k, -7.5 * k, ox, oy, ang, 1.25 * k), lseg(g, -3 * k, 3.3 * k, -3.7 * k, 7.5 * k, ox, oy, ang, 1.25 * k)), { thin: true, outline: 0.3, glint: false, plate: 'A' }),
]
// a shield of the security family: glass in a stone frame
const shield = (g, role = 'c2') => g.pane(g.path(SHIELD), role, { frame: 1.7, tracery: 'none', glass: { dark: 0.4 } })
// a stone column (bar) with gilt capital and base
const column = (g, x0, y0, x1, y1) => [
  g.stone(g.rr(x0, y0 + 0.8, x1, y1 - 0.8, 0.3), { thin: true, ticks: [[[x0 - 1, (y0 + y1) / 2], [x1 + 1, (y0 + y1) / 2]]] }),
  g.gilt(g.union(g.rr(x0 - 0.6, y0, x1 + 0.6, y0 + 1.4, 0.4), g.rr(x0 - 0.6, y1 - 1.4, x1 + 0.6, y1, 0.4)), { thin: true, glint: false }),
]

// ---- the redraws ---------------------------------------------------------------
export const R = {
  // ===== writing and paper
  // an illuminated notebook: sapphire leaf, gilt lines of script, ruby initial, gilded rings
  'notepad-text': (icon, g) => [
    ...g.pane(g.rr(4.4, 4.2, 19.6, 21.4, 2), 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.35 } }),
    g.glass(g.rr(7.2, 8.6, 10, 11.4, 0.5), 'c1', { outline: 0.3, glint: false, glow: 0.3 }),
    g.gilt(g.union(g.rr(11, 9.3, 16.8, 10.7, 0.6), g.rr(7.2, 13, 16.8, 14.4, 0.6), g.rr(7.2, 16.6, 13.6, 18, 0.6)), { thin: true, outline: 0.3, glint: false }),
    g.gilt(g.union(g.rr(7.2, 2.4, 8.8, 6.4, 0.8), g.rr(11.2, 2.4, 12.8, 6.4, 0.8), g.rr(15.2, 2.4, 16.8, 6.4, 0.8)), { plate: 'A', thin: true }),
  ],
  // a receipt of gold glass with a toothed foot, leaded lines and a ruby tally
  receipt: (icon, g) => [
    ...g.pane(g.path('M5.2 2.6 H18.8 V21.4 L16.5 19.9 L14.2 21.4 L12 19.9 L9.8 21.4 L7.5 19.9 L5.2 21.4 Z'), 'c3', { frame: 1.3, tracery: 'none' }),
    g.stone(g.union(g.rr(8, 6.2, 16, 7.5, 0.6), g.rr(8, 9.6, 16, 10.9, 0.6), g.rr(8, 13, 12.6, 14.3, 0.6)), { thin: true, outline: 0.3 }),
    g.glass(g.foil(14.6, 14.8, 2.1, 4), 'c1', { outline: 0.3, glint: false, plate: 'S' }),
  ],
  // a parchment scroll: gilded rollers, sapphire leaf, gilt script
  'scroll-text': (icon, g) => [
    ...g.pane(g.rr(5.4, 4.6, 18.6, 19.4, 0.6), 'c2', { frame: 1.2, tracery: 'none', glass: { dark: 0.35 } }),
    g.gilt(g.union(g.rr(8.4, 8.2, 15.6, 9.5, 0.6), g.rr(8.4, 11.4, 15.6, 12.7, 0.6), g.rr(8.4, 14.6, 13, 15.9, 0.6)), { thin: true, outline: 0.3, glint: false }),
    g.gilt(g.rr(3.4, 2.6, 20.6, 5.6, 1.5), { plate: 'A' }),
    g.gilt(g.rr(3.4, 18.4, 20.6, 21.4, 1.5), { plate: 'A' }),
    g.studs([[3.9, 4.1], [20.1, 4.1], [3.9, 19.9], [20.1, 19.9]], 0.5),
  ],
  // a clipboard of ashlar with a gilt clip, a sapphire leaf laid over it
  paste: (icon, g) => [
    ...carved(g, 3.2, 4.4, 15.6, 19.6, 1.8, 1.05),
    g.gilt(g.rr(6.2, 2.4, 12.6, 6, 1), { plate: 'A' }),
    ...g.pane(g.path('M11.6 9.6 H17.6 L20.8 12.8 V19.6 A1.8 1.8 0 0 1 19 21.4 H11.6 A1.8 1.8 0 0 1 9.8 19.6 V11.4 A1.8 1.8 0 0 1 11.6 9.6 Z'), 'c2', { frame: 1.3, tracery: 'quarry', glass: { medallion: false, s: 2.2 } }),
  ],
  // a passport bound in ruby glass, a gilded globe-rose on the cover
  passport: (icon, g) => [
    ...g.pane(g.rr(4.6, 2.6, 19.4, 21.4, 1.8), 'c1', { frame: 1.5, tracery: 'none', glass: { dark: 0.38 } }),
    g.gilt(g.circle(12, 10.2, 4.1), { glint: false }),
    ...g.rose(12, 10.2, 3.3, 'c2', { n: 8, frame: 0.75 }),
    g.gilt(g.rr(8.4, 16, 15.6, 17.4, 0.7), { thin: true, outline: 0.3 }),
  ],
  // an illuminated pilcrow: a blackletter (textura) mark in gilt, broken bowl set with a
  // ruby lozenge, pointed feet, on a sapphire inlay in a small carved stone frame
  pilcrow: (icon, g) => [
    ...initial(g, 2.6, 2.6, 21.4, 21.4, 'c2'),
    g.gilt(g.union(
      g.poly([[13.6, 5], [7.9, 5], [5.4, 7.5], [5.4, 10.7], [7.9, 13.2], [11.2, 13.2], [11.2, 18.2], [12.3, 19.6], [13.4, 18.2], [13.4, 7]]),
      g.poly([[13.4, 5], [18.6, 5], [19.4, 4.2], [19.4, 6.6], [17.8, 7.2], [17.8, 18.2], [16.7, 19.6], [15.6, 18.2], [15.6, 7]]),
    )),
    g.glass(g.ngon(8.6, 9.1, 2.1, 4), 'c1', { outline: 0.28, glint: false, glow: 0.3 }),
  ],
  // a signature in a gilded flourish over a carved stone line
  signature: (icon, g) => [
    g.stone(g.rr(2.6, 18.6, 21.4, 21.2, 1.2), { ticks: [[[7.4, 17], [7.4, 23]], [[12, 17], [12, 23]], [[16.6, 17], [16.6, 23]]] }),
    g.gilt(g.stroke('M3 15.6 C5.4 12.8 7 8 6.8 5.4 C6.6 3 4.6 3.8 4.6 7 C4.6 10.6 6.2 14.6 8 15.4 C9.6 16 10.6 12.6 11.4 11.6 C12 13.8 12.8 15.8 14.4 14.2 C15.4 13.2 16 12.8 16.6 14.6 C17.2 16 19 15.4 21 14.4', 1.8)),
    g.deco(g.glass(g.foil(18.6, 9, 1.8, 4, -45), 'c1', { outline: 0.3, glint: false })),
  ],

  // ===== packages
  // a reliquary chest: gold lid, sapphire sides, carved stone edges, gilded strap
  package: (icon, g) => {
    const T = [[12, 2.6], [20.4, 7.3], [12, 12], [3.6, 7.3]], L = [[3.6, 7.3], [12, 12], [12, 21.6], [3.6, 16.8]], Rr = [[12, 12], [20.4, 7.3], [20.4, 16.8], [12, 21.6]]
    return [
      g.glass(g.poly(T), 'c3', { tracery: 'quarry', medallion: false, s: 2.4 }),
      g.glass(g.poly(L), 'c2', { tracery: 'quarry', medallion: false, s: 2.4 }),
      g.glass(g.poly(Rr), 'c2', { tracery: 'quarry', medallion: false, s: 2.4, deep: 0.22 }),
      g.stone(g.stroke([[...T, T[0]], [[3.6, 7.3], [3.6, 16.8], [12, 21.6], [20.4, 16.8], [20.4, 7.3]], [[12, 12], [12, 21.6]]], 1.5), { thin: true }),
      g.gilt(g.stroke([[7.8, 4.95], [16.2, 9.65], [16.2, 19.2]], 1.6), { thin: true, plate: 'A' }),
    ]
  },
  // the chest open: gilded flaps raised, a treasure glowing within
  'package-open': (icon, g) => [
    g.glass(g.poly([[3.4, 10.4], [12, 6.2], [10.2, 2.6], [2.2, 6.8]]), 'c3', { plate: 'A', outline: 0.4 }),
    g.glass(g.poly([[12, 6.2], [20.6, 10.4], [21.8, 6.8], [13.8, 2.6]]), 'c3', { plate: 'A', outline: 0.4, deep: 0.15 }),
    g.recess(g.poly([[3.6, 10.4], [12, 6.2], [20.4, 10.4], [12, 14.6]]), { glow: 'c3', glowOp: 0.75 }),
    g.glass(g.poly([[3.6, 10.4], [12, 14.6], [12, 21.6], [3.6, 17.2]]), 'c2', { tracery: 'quarry', medallion: false, s: 2.4 }),
    g.glass(g.poly([[12, 14.6], [20.4, 10.4], [20.4, 17.2], [12, 21.6]]), 'c2', { tracery: 'quarry', medallion: false, s: 2.4, deep: 0.22 }),
    g.stone(g.stroke([[[3.6, 10.4], [3.6, 17.2], [12, 21.6], [20.4, 17.2], [20.4, 10.4]], [[3.6, 10.4], [12, 14.6], [20.4, 10.4]], [[12, 14.6], [12, 21.6]]], 1.5), { thin: true }),
    g.deco(g.glass(g.star(12, 9.6, 1.9, 0.8, 4), 'c3', { outline: 0.3, glint: false })),
  ],

  // ===== art
  // a paintbrush: gilded handle, stone ferrule, ruby bristles leaded into strands
  paintbrush: (icon, g) => {
    const ox = 20.6, oy = 3.4, a = 135
    return [
      g.gilt(lseg(g, 0, 0, 9.6, 0, ox, oy, a, 2.4), { plate: 'A' }),
      g.stone(lpoly(g, [[9, -2], [12, -2.3], [12, 2.3], [9, 2]], ox, oy, a), { thin: true }),
      g.glass(g.path(pathOf([['M', [11.8, -2.4]], ['C', [15, -2.8], [18.4, -1.6], [22.4, 0]], ['C', [18.4, 1.6], [15, 2.8], [11.8, 2.4]], ['Z']], ox, oy, a)), 'c1', { outline: 0.4, tracery: [place([[12, -0.9], [20, -0.2]], ox, oy, a), place([[12, 0.9], [20, 0.2]], ox, oy, a)] }),
      g.studs([place([[10.5, 0]], ox, oy, a)[0]], 0.5),
    ]
  },
  // a palette of carved stone, jewelled dabs of paint, a thumb hole
  palette: (icon, g) => {
    const S = g.union(sub(g.circle(12, 12, 9.6), g.circle(18.6, 18.4, 4.2)), g.circle(14.6, 17.2, 2.3))
    return [
      g.stone(S),
      g.recess(g.ellipse(9, 16.4, 1.7, 1.3), { glow: 'c3', glowOp: 0.3 }),
      ...boss(g, 7.4, 10.6, 2), ...boss(g, 10.9, 6.6, 2, 'c2'), ...boss(g, 15.8, 7.2, 2, 'c4'), ...boss(g, 17.4, 11.6, 1.7, 'c3'),
    ]
  },
  // the pen tool: a gilded nib with a glowing slit, a stone grip with a ruby jewel
  'pen-tool': (icon, g) => {
    const ox = 19.8, oy = 4.2, a = 135
    return [
      g.stone(lpoly(g, [[-0.6, -3.6], [5.6, -3.6], [5.6, 3.6], [-0.6, 3.6]], ox, oy, a)),
      g.gilt(lpoly(g, [[5.2, -4.5], [13.6, -3.8], [21.8, 0], [13.6, 3.8], [5.2, 4.5]], ox, oy, a)),
      g.recess(g.union(lseg(g, 13.6, 0, 21.2, 0, ox, oy, a, 0.55), g.circle(...place([[12.2, 0]], ox, oy, a)[0], 1.35)), { glow: 'c3', glowOp: 0.6, outline: 0.15 }),
      g.glass(g.circle(...place([[2.5, 0]], ox, oy, a)[0], 1.3), 'c1', { outline: 0.3, glint: false }),
    ]
  },
  // a pencil of sapphire glass: gilded ferrule, ruby eraser, carved wood tip
  pencil: (icon, g) => {
    const ox = 20, oy = 4, a = 135
    return [
      g.glass(lpoly(g, [[-1.6, -2.6], [1.4, -2.6], [1.4, 2.6], [-1.6, 2.6]], ox, oy, a), 'c1', { outline: 0.4, plate: 'A' }),
      g.gilt(lpoly(g, [[1.2, -2.8], [4, -2.8], [4, 2.8], [1.2, 2.8]], ox, oy, a), { thin: true }),
      g.glass(lpoly(g, [[3.8, -2.6], [16.4, -2.6], [16.4, 2.6], [3.8, 2.6]], ox, oy, a), 'c2', { outline: 0.4, tracery: [place([[0, -0.85], [20, -0.85]], ox, oy, a), place([[0, 0.85], [20, 0.85]], ox, oy, a)] }),
      g.stone(lpoly(g, [[16.2, -2.6], [21.8, 0], [16.2, 2.6]], ox, oy, a), { thin: true }),
      g.iron(lpoly(g, [[20.2, -0.8], [21.9, 0], [20.2, 0.8]], ox, oy, a)),
    ]
  },

  // ===== nature and animals
  // a palm on a sand isle: a ringed trunk of stacked stone drums, five big emerald fronds
  // (they sway), gilded coconuts under the crown
  'palm-tree': (icon, g) => {
    const C = t => [10.3 + 0.3 * t + 1.4 * t * t, 20.4 - 12.2 * t]
    const drums = []
    for (let k = 0; k < 5; k++) {
      const [x0, y0] = C(k / 5), [x1, y1] = C((k + 1) / 5), h0 = 1.3 - 0.08 * k, h1 = h0 + 0.38
      drums.push(g.poly([[x0 - h0, y0 + 0.1], [x0 + h0, y0 + 0.1], [x1 + h1, y1 + 0.25], [x1 - h1, y1 + 0.25]]))
    }
    const joints = [1, 2, 3, 4].map(k => { const [x, y] = C(k / 5); return [[x - 3, y + 0.25], [x + 3, y + 0.25]] })
    return [
      g.stone(g.union(drums), { ticks: joints }),
      g.glass(g.path('M4.4 21.6 C5.8 18.9 15.6 18.9 17 21.6 Z'), 'c3', { outline: 0.4, tracery: [[[7, 20.6], [9.2, 20.2]], [[12.6, 20.4], [14.8, 20.8]]], glint: false }),
      g.gilt(g.union(g.circle(10.7, 9.4, 1.25), g.circle(13.3, 9.6, 1.25)), { thin: true, outline: 0.32 }),
      leaf(g, 12, 7.9, 232, 6.8, 1.9, -0.32, 'c4', 'A'),
      leaf(g, 12, 7.9, -52, 6.8, 1.9, 0.32, 'c4', 'A'),
      leaf(g, 12, 7.9, 190, 8.8, 2.2, -0.5, 'c4', 'A'),
      leaf(g, 12, 7.9, -10, 8.8, 2.2, 0.5, 'c4', 'A'),
    ]
  },
  // a paw of ruby and gold cabochons
  'paw-print': (icon, g) => [
    ...g.pane(g.path('M12 11.6 C15.4 11.6 18.2 15.2 18.2 18 C18.2 20.4 16 21.2 14.2 20.6 C13 20.2 12.6 19.8 12 19.8 C11.4 19.8 11 20.2 9.8 20.6 C8 21.2 5.8 20.4 5.8 18 C5.8 15.2 8.6 11.6 12 11.6 Z'), 'c1', { frame: 1.2, tracery: 'none' }),
    ...g.pane(g.union(g.ellipse(4.6, 10.6, 2.1, 2.6), g.ellipse(8.8, 5.4, 2.2, 2.8), g.ellipse(15.2, 5.4, 2.2, 2.8), g.ellipse(19.4, 10.6, 2.1, 2.6)), 'c3', { frame: 0.9, tracery: 'none', plate: 'A' }),
  ],
  // a rabbit carved in white stone: tall ears lined with ruby glass (they twitch), dark
  // eyes with a glint, a small ruby nose
  rabbit: (icon, g) => [
    ...g.pane(rell(g, 9.1, 6.9, 5.2, 2.55, -101), 'c1', { frame: 1.05, tracery: 'none', plate: 'A', glass: { glow: 0.28 } }),
    ...g.pane(rell(g, 14.9, 6.9, 5.2, 2.55, -79), 'c1', { frame: 1.05, tracery: 'none', plate: 'A', glass: { glow: 0.28 } }),
    g.stone(g.union(g.circle(12, 14.6, 5.9), g.ellipse(12, 17.2, 6.9, 4.1))),
    g.recess(g.union(g.ellipse(9.5, 14.1, 0.95, 1.15), g.ellipse(14.5, 14.1, 0.95, 1.15))),
    g.shine(g.union(g.circle(9.2, 13.7, 0.36), g.circle(14.2, 13.7, 0.36)), { op: 0.95 }),
    g.glass(g.ellipse(12, 17, 1.25, 0.85), 'c1', { outline: 0.3, glint: false, glow: 0.35 }),
    g.lead([[[12, 17.8], [12, 18.7]], [[10.6, 19.2], [12, 18.7], [13.4, 19.2]]], { w: 0.5, role: 'edge' }),
  ],
  // a salad: emerald leaves and a ruby fruit in a gilded bowl of emerald glass
  salad: (icon, g) => [
    leaf(g, 6.6, 11.4, -70, 7, 2, 0.12, 'c4', 'A'),
    leaf(g, 9.8, 11.6, -100, 6.2, 1.8, -0.16, 'c4', 'A'),
    ...boss(g, 16, 7.6, 2.8, 'c1', 'A'),
    g.gilt(g.rr(2.6, 10.6, 21.4, 12.8, 1.1)),
    ...g.pane(g.path('M3.6 12.6 H20.4 C20.4 17.2 16.8 20.6 12 20.6 C7.2 20.6 3.6 17.2 3.6 12.6 Z'), 'c4', { frame: 1.3, tracery: 'lancet', glass: { s: 2.4 } }),
    g.stone(g.rr(9, 19.4, 15, 21.4, 0.8), { thin: true }),
  ],
  // a slice of pizza: gold glass with ruby cabochons under a jointed stone crust
  pizza: (icon, g) => {
    const tip = [4.4, 20.6]
    const wedge = g.poly([tip, ...P.arcPts(tip[0], tip[1], 16, -82, -8, 0.4)])
    return [
      g.glass(wedge, 'c3', { tracery: 'none' }),
      g.stone(g.arc(tip[0], tip[1], 15.2, -84, -6, 2.6), { ticks: [[pt(...tip, 13, -70), pt(...tip, 18, -70)], [pt(...tip, 13, -55), pt(...tip, 18, -55)], [pt(...tip, 13, -40), pt(...tip, 18, -40)], [pt(...tip, 13, -25), pt(...tip, 18, -25)]] }),
      g.stone(g.stroke([pt(...tip, 13.8, -82), tip, pt(...tip, 13.8, -8)], 1.3), { thin: true }),
      ...boss(g, ...pt(...tip, 9.6, -60), 1.8), ...boss(g, ...pt(...tip, 7.4, -26), 1.6), ...boss(g, ...pt(...tip, 4.4, -46), 1.2),
    ]
  },

  // ===== layout panels: stone window frames with a gold strip and a sapphire lancet
  'panel-bottom': (icon, g) => panelWin(g, 'bottom'),
  'panel-right': (icon, g) => panelWin(g, 'right'),
  sidebar: (icon, g) => [...panelWin(g, 'left'), g.studs([[6.55, 6.8], [6.55, 10.2], [6.55, 13.8], [6.55, 17.2]], 0.45)],
  'panel-left-close': (icon, g) => [...panelWin(g, 'left'), ...head(g, 12.2, 12.6, 180, 0.46, 'A')],
  'panel-left-open': (icon, g) => [...panelWin(g, 'left'), ...head(g, 17.4, 12.6, 0, 0.46, 'A')],
  // a window of sapphire quarries with a small gold light set in its corner
  'picture-in-picture': (icon, g) => [
    ...g.pane(g.rr(2.6, 3.8, 21.4, 20.2, 2.2), 'c2', { frame: 1.6, tracery: 'quarry', glass: { medallion: false, s: 2.4, dark: 0.4 } }),
    ...g.pane(g.rr(11.4, 11.4, 19.4, 18.2, 1), 'c3', { frame: 1.2, tracery: 'none', plate: 'A' }),
  ],

  // ===== paperclip, parking, party
  // a gilded wire clip with a ruby bead
  paperclip: (icon, g) => {
    const d = [[2.4, -4], [2.4, 5.6], ...P.arcPts(0, 5.6, 2.4, 0, 180).slice(1), [-2.4, -5.6], ...P.arcPts(1.4, -5.6, 3.8, 180, 360).slice(1), [5.2, 6.6], ...P.arcPts(0.2, 6.6, 5, 0, 180).slice(1), [-4.8, -1.2]]
    return [
      g.gilt(g.stroke(place(d, 12, 12.4, 45), 1.7)),
      g.glass(g.circle(...place([[2.4, -4]], 12, 12.4, 45)[0], 1.25), 'c1', { outline: 0.3, glint: false, plate: 'A' }),
    ]
  },
  // a parking tablet: sapphire glass in stone, a gilded P
  parking: (icon, g) => [
    ...g.pane(g.rr(2.8, 2.8, 21.2, 21.2, 2.6), 'c2', { frame: 1.6, tracery: 'quarry', glass: { medallion: false, s: 2.6, dark: 0.45, deep: 0.18 } }),
    g.gilt(g.stroke('M9.2 18.4 V6.6 H13.2 A3.5 3.5 0 0 1 13.2 13.6 H9.2', 2.6)),
  ],
  // a party horn of ruby glass with gilt bands, gold confetti and a curl of ribbon
  'party-popper': (icon, g) => [
    ...g.pane(g.poly([[2.4, 21.6], [7.4, 6.8], [17.2, 16.6]]), 'c1', { frame: 1.4, tracery: [[[2, 15], [9.6, 22]], [[4, 10.6], [14, 20]]] }),
    g.gilt(g.stroke([[3.6, 15.6], [8.4, 20.4]], 1.1), { thin: true, outline: 0.3, glint: false }),
    g.deco(
      g.glass(g.star(15.4, 4.6, 2.1, 0.8, 4), 'c3', { outline: 0.3, glint: false }),
      g.glass(g.star(19.6, 11.2, 1.7, 0.7, 4), 'c3', { outline: 0.3, glint: false }),
      g.gilt(g.stroke('M10.6 7.6 C10.6 5.6 12.2 5 11.4 3', 1.1), { thin: true, outline: 0.32 }),
      g.gilt(g.stroke('M15.8 12.8 C17.2 11.6 18.6 13.8 20.6 13.4 ', 1.1), { thin: true, outline: 0.32 }),
      g.studs([[19.6, 5.6], [21, 8]], 0.6),
    ),
  ],
  // a running figure of sapphire glass in carved stone, a golden head
  'person-running': (icon, g) => [
    ...g.pane(g.stroke([[[13.6, 9], [11.4, 13.6], [14.8, 16.4], [13.8, 20.8]], [[11.4, 13.6], [8.8, 16.8], [4.4, 16.8]]], 3.2), 'c2', { frame: 1.05, tracery: 'none', plate: 'A' }),
    ...g.pane(g.stroke([[[7, 12.8], [9.4, 9.4], [13.8, 8.8], [16.6, 12.2], [19.8, 12]]], 2.8), 'c2', { frame: 0.95, tracery: 'none' }),
    ...g.pane(g.circle(15.8, 4.6, 2.5), 'c3', { frame: 0.9, tracery: 'none' }),
  ],

  // ===== phones
  phone: (icon, g) => handset(g),
  // calling: gilded sound waves ringing from the earpiece
  'phone-call': (icon, g) => [...handset(g), g.gilt(g.union(g.arc(13.6, 10.4, 4, -90, 0, 1.7), g.arc(13.6, 10.4, 7.6, -90, 0, 1.7)), { plate: 'A', thin: true })],
  'phone-incoming': (icon, g) => [...handset(g), ...arrowPath(g, [[20.4, 3.6], [16.6, 7.4]], 14.2, 9.8, 135, 0.56, 2, 'A')],
  'phone-outgoing': (icon, g) => [...handset(g), ...arrowPath(g, [[14, 10], [17.8, 6.2]], 20.6, 3.4, -45, 0.56, 2, 'A')],
  'phone-missed': (icon, g) => [...handset(g, 'c1'), g.gilt(g.union(g.seg(14.4, 3.6, 20.4, 9.6, 1.9), g.seg(20.4, 3.6, 14.4, 9.6, 1.9)), { plate: 'A', thin: true })],
  'phone-off': (icon, g) => [...handset(g, 'c1'), ...g.slash(3.4, 20.6, 20.6, 3.4, 1.8)],

  // ===== media: spherical-triangle windows of ruby glass with a gold trefoil
  play: (icon, g) => triPane(g, 20.6, 12, 0, 14.8, 8.8),
  pause: (icon, g) => [
    ...g.window(3.6, 2.6, 10.4, 21.2, 'c1', { k: 1.05, frame: 1.25, tracery: 'lancet' }),
    ...g.window(13.6, 2.6, 20.4, 21.2, 'c1', { k: 1.05, frame: 1.25, tracery: 'lancet', plate: 'A' }),
    g.glass(g.foil(7, 8.6, 1.9, 4), 'c3', { outline: 0.3, glint: false }),
    g.glass(g.foil(17, 8.6, 1.9, 4), 'c3', { outline: 0.3, glint: false, plate: 'A' }),
  ],
  'skip-forward': (icon, g) => [...triPane(g, 16.2, 12, 0, 12.2, 8.2), ...column(g, 17.6, 3, 20.6, 21)],
  'skip-back': (icon, g) => [...triPane(g, 7.8, 12, 180, 12.2, 8.2), ...column(g, 3.4, 3, 6.4, 21)],
  rewind: (icon, g) => [...triPane(g, 11.4, 12, 180, 9.8, 7.6, 'c1', 'A'), ...triPane(g, 2.6, 12, 180, 9.8, 7.6)],

  // ===== power and plugs
  plug: (icon, g) => [
    g.gilt(g.union(g.rr(8, 2.4, 10.2, 8.6, 1), g.rr(13.8, 2.4, 16, 8.6, 1)), { plate: 'A' }),
    g.stone(g.seg(12, 16, 12, 21.4, 2.6), { thin: true, ticks: [[[9, 18.6], [15, 18.6]]] }),
    ...g.pane(g.path('M5.6 8 H18.4 V11.2 C18.4 14.6 15.8 17.2 12.8 17.2 H11.2 C8.2 17.2 5.6 14.6 5.6 11.2 Z'), 'c1', { frame: 1.4, tracery: 'medallion', glass: { lobes: 4, at: { c: [12, 11.8], r: 2.6 } } }),
  ],
  // the power sign: a ruby arc in stone, a gilded switch bar
  power: (icon, g) => [
    ...g.pane(g.arc(12, 13, 7.6, -52, 232, 3.6), 'c1', { frame: 1, tracery: 'none' }),
    g.gilt(g.rr(10.6, 2.4, 13.4, 12.6, 1.4), { plate: 'A' }),
  ],
  // a cross bottony of ruby glass with a gilded quatrefoil boss
  plus: (icon, g) => [
    ...g.pane(g.union(g.seg(12, 5, 12, 19, 4.6), g.seg(5, 12, 19, 12, 4.6), ...[[12, 3.4, -90], [12, 20.6, 90], [3.4, 12, 180], [20.6, 12, 0]].map(([x, y, a]) => g.foil(x, y, 2.6, 3, a))), 'c1', { frame: 1.2, tracery: 'none' }),
    g.gilt(g.foil(12, 12, 3.4, 4, -45)),
    g.glass(g.circle(12, 12, 1.2), 'c3', { outline: 0.3, glint: false }),
  ],
  'plus-circle': (icon, g) => [
    ...g.pane(g.circle(12, 12, 9.8), 'c2', { frame: 1.8, tracery: 'quarry', glass: { medallion: false, dark: 0.45, s: 2.4 } }),
    g.gilt(g.union(g.seg(12, 6.8, 12, 17.2, 2.6), g.seg(6.8, 12, 17.2, 12, 2.6)), { plate: 'S' }),
    ...boss(g, 12, 12, 1.9, 'c1', 'S'),
  ],
  // a podcast: a ruby rose with gilded waves round it, on a stone stem
  podcast: (icon, g) => [
    g.gilt(g.arc(12, 10, 5.4, 140, 400, 1.7), { plate: 'A', thin: true }),
    g.gilt(g.arc(12, 10, 8.8, 135, 405, 1.9), { plate: 'A' }),
    g.stone(g.rr(10.6, 13, 13.4, 21.4, 1.4), { thin: true, ticks: [[[9, 17.2], [15, 17.2]]] }),
    ...g.rose(12, 10, 3, 'c1', { n: 6, frame: 0.85 }),
  ],
  // the pound as a letter of gold glass carved in stone
  'pound-sterling': (icon, g) => g.pane(g.stroke('M16.8 7.4 C16.4 4.6 14.6 3.4 12.6 3.4 C10 3.4 8.6 5.4 8.6 7.8 V19.8 M5.4 12.4 H14 M5.2 20 H18.8', 3.4), 'c3', { frame: 0.95, tracery: 'none' }),
  // the percent sign: two ruby roses and a jointed stone bar
  percent: (icon, g) => [
    g.stone(g.seg(18.6, 4.6, 5.4, 19.4, 2.6), { ticks: [[[9, 13], [11, 15]], [[13, 9], [15, 11]]] }),
    ...g.rose(6.6, 6.6, 4.1, 'c1', { n: 8, frame: 1.1 }),
    ...g.rose(17.4, 17.4, 4.1, 'c1', { n: 8, frame: 1.1 }),
  ],

  // ===== devices
  presentation: (icon, g) => [
    g.stone(g.union(g.seg(12, 15, 12, 18.4, 1.8), g.seg(10.6, 15.6, 7.8, 21.2, 1.7), g.seg(13.4, 15.6, 16.2, 21.2, 1.7)), { thin: true }),
    ...g.pane(g.rr(2.6, 3, 21.4, 15.6, 1.4), 'c2', { frame: 1.5, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.stroke([[5.8, 12.4], [9.2, 8.8], [12.2, 10.8], [17.8, 6.2]], 1.6), { plate: 'A', thin: true }),
    g.studs([[17.8, 6.2]], 0.7),
  ],
  printer: (icon, g) => [
    ...g.pane(g.rr(6.4, 2.6, 17.6, 9.4, 0.8), 'c3', { frame: 1.1, tracery: 'none' }),
    ...carved(g, 2.6, 8, 21.4, 17.6, 2, 1),
    g.recess(g.rr(5, 13.4, 19, 15, 0.6)),
    ...g.pane(g.rr(6.4, 14, 17.6, 21.4, 0.8), 'c2', { frame: 1.1, tracery: [[[7, 16.8], [17, 16.8]], [[7, 18.8], [17, 18.8]]], plate: 'A' }),
    g.glass(g.circle(18.2, 10.8, 0.95), 'c4', { outline: 0.3, glint: false }),
  ],
  radio: (icon, g) => [
    g.gilt(g.seg(5.8, 9, 17.4, 2.8, 1.3), { plate: 'A', thin: true }),
    g.studs([[17.4, 2.8]], 0.8, { plate: 'A' }),
    ...carved(g, 2.6, 8.4, 21.4, 20.8, 2, 1),
    ...g.rose(8.2, 14.6, 4, 'c2', { n: 8, frame: 0.95 }),
    g.glass(g.rr(13.4, 11.6, 19.2, 13.6, 0.7), 'c3', { outline: 0.35, glint: false }),
    g.glass(g.rr(13.4, 15.6, 19.2, 17.6, 0.7), 'c3', { outline: 0.35, glint: false }),
  ],
  // a tall carved cabinet: a small upper and a tall lower door of sapphire glass, gilt handles
  refrigerator: (icon, g) => [
    g.stone(g.rr(4.8, 2.4, 19.2, 21.6, 2.4)),
    g.glass(g.rr(6.4, 4, 17.6, 9, [1.3, 1.3, 0.3, 0.3]), 'c2', { outline: 0.4, tracery: 'none', plate: 'A', deep: 0.1 }),
    g.glass(g.rr(6.4, 10.6, 17.6, 20, [0.3, 0.3, 1.3, 1.3]), 'c2', { outline: 0.4, tracery: 'medallion', lobes: 4, at: { c: [13.4, 15.3], r: 2.6 }, medal: 'c3', plate: 'A' }),
    g.gilt(g.union(g.rr(7.8, 5.2, 9.3, 7.9, 0.7), g.rr(7.8, 11.8, 9.3, 16.4, 0.7)), { plate: 'A' }),
  ],
  router: (icon, g) => [
    g.gilt(g.union(g.seg(6.6, 12.6, 4.8, 4.6, 1.5), g.seg(17.4, 12.6, 19.2, 4.6, 1.5)), { plate: 'A', thin: true }),
    g.studs([[4.8, 4.2], [19.2, 4.2]], 1, { plate: 'A' }),
    ...carved(g, 2.6, 12, 21.4, 20.8, 2, 0.95),
    g.glass(g.union(g.circle(6.6, 16.4, 1.05), g.circle(9.8, 16.4, 1.05)), 'c4', { outline: 0.3, glint: false }),
    g.glass(g.union([12.8, 15, 17.2].map(x => g.lancet(x, 14.6, x + 1.5, 18.2, 1.1))), 'c2', { outline: 0.35, glint: false, glow: 0.3 }),
  ],
  server: (icon, g) => [
    ...carved(g, 2.6, 2.8, 21.4, 11, 2, 0.9), ...carved(g, 2.6, 13, 21.4, 21.2, 2, 0.9),
    g.glass(g.union(g.circle(6.4, 6.9, 1.1), g.circle(6.4, 17.1, 1.1)), 'c4', { outline: 0.3, glint: false }),
    g.glass(g.union([10.4, 12.8, 15.2, 17.6].flatMap(x => [g.lancet(x, 5, x + 1.6, 8.9, 1.1), g.lancet(x, 15.2, x + 1.6, 19.1, 1.1)])), 'c2', { outline: 0.35, glint: false, glow: 0.3 }),
  ],
  save: (icon, g) => [
    ...g.pane(g.path('M4.8 2.8 H16.2 L21.2 7.8 V19.2 A2 2 0 0 1 19.2 21.2 H4.8 A2 2 0 0 1 2.8 19.2 V4.8 A2 2 0 0 1 4.8 2.8 Z'), 'c2', { frame: 1.4, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.rr(7, 2.8, 15.4, 8.4, [0, 0, 0.8, 0.8]), { plate: 'A' }),
    g.recess(g.rr(12.2, 4, 14, 7.2, 0.4)),
    g.stone(g.rr(6.4, 12.4, 17.6, 21.2, [1.2, 1.2, 0, 0]), { thin: true, ticks: [[[6, 15.4], [18, 15.4]], [[6, 18.2], [18, 18.2]]] }),
  ],
  // a carved stone boss face (lancet eyes, leaded smile) in a rose ring of ruby glass, inside
  // gilt scanning brackets set with ruby studs
  'scan-face': (icon, g) => [
    g.gilt(g.stroke('M3 8.6 V5.6 A2.6 2.6 0 0 1 5.6 3 H8.6 M15.4 3 H18.4 A2.6 2.6 0 0 1 21 5.6 V8.6 M21 15.4 V18.4 A2.6 2.6 0 0 1 18.4 21 H15.4 M8.6 21 H5.6 A2.6 2.6 0 0 1 3 18.4 V15.4', 2), { plate: 'A' }),
    g.glass(g.union(g.circle(3.9, 3.9, 0.8), g.circle(20.1, 3.9, 0.8), g.circle(20.1, 20.1, 0.8), g.circle(3.9, 20.1, 0.8)), 'c1', { outline: 0.25, glint: false, plate: 'A' }),
    g.stone(g.circle(12, 12, 7.4)),
    g.glass(g.circle(12, 12, 6.4), 'c1', { outline: 0.35, tracery: Array.from({ length: 12 }, (_, k) => [pt(12, 12, 4, k * 30 + 15), pt(12, 12, 7, k * 30 + 15)]), glow: 0.22, glint: false }),
    g.stone(g.circle(12, 12, 4.9)),
    g.recess(g.union(g.lancet(9.7, 9.4, 11.1, 12, 1.1), g.lancet(12.9, 9.4, 14.3, 12, 1.1))),
    g.lead([P.arcPts(12, 12.1, 2.6, 30, 150)], { w: 0.8 }),
  ],
  'qr-code': (icon, g) => {
    const out = []
    for (const [x, y] of [[2.6, 2.6], [14, 2.6], [2.6, 14]]) {
      out.push(g.stone(g.rr(x, y, x + 7.4, y + 7.4, 1.4), { thin: true }))
      out.push(g.glass(g.rr(x + 1.5, y + 1.5, x + 5.9, y + 5.9, 0.6), 'c2', { outline: 0.3, glint: false, dark: 0.45 }))
      out.push(g.gilt(g.rr(x + 2.6, y + 2.6, x + 4.8, y + 4.8, 0.4), { thin: true, outline: 0.3, glint: false }))
    }
    out.push(g.gilt(g.union(...[[14, 14], [18.8, 14], [16.4, 16.4], [14, 18.8], [18.8, 18.8]].map(([x, y]) => g.rr(x, y, x + 2.4, y + 2.4, 0.5))), { thin: true, outline: 0.35 }))
    return out
  },
  'puzzle-piece': (icon, g) => g.pane(g.union(g.rr(3.4, 7.8, 16.6, 21, 1.6), g.circle(10, 6.4, 2.8), g.circle(17.8, 14.4, 2.8)), 'c4', { frame: 1.4, tracery: 'quarry', glass: { s: 2.5, at: { c: [10, 14.4], r: 4 } } }),

  // ===== text
  quote: (icon, g) => {
    const mark = cx => [
      g.gilt(g.union(g.circle(cx, 9, 3.7), g.stroke(`M${cx + 3.3} 9.6 C${cx + 3.4} 14.2 ${cx + 1} 17.4 ${cx - 2.6} 18.6`, 2.3))),
      g.glass(g.circle(cx, 9, 2.6), 'c1', { outline: 0.3, tracery: 'none', glow: 0.3 }),
    ]
    return [...mark(6.6), ...mark(16.4)]
  },
  // an illuminated textura T (gilt, lozenge serifs, pointed foot) on a sapphire inlay,
  // struck out by a ruby roundel
  'remove-formatting': (icon, g) => [
    ...initial(g, 2.4, 2.4, 19, 19, 'c2'),
    g.gilt(g.union(
      g.poly([[4.4, 7.6], [6, 4.8], [15.4, 4.8], [16.8, 3.8], [16.8, 6.4], [15.4, 7.1], [6.6, 7.1], [6.6, 9.4], [5.2, 10.4]]),
      g.poly([[9.4, 6], [11.8, 6], [11.8, 14.6], [10.6, 16.2], [9.4, 14.6]]),
    )),
    ...g.badge('x', 17.6, 17.6, 3.9),
  ],

  // ===== arrows: gilded shafts, ogival heads pierced by a trefoil
  // every shaft ends in a fleur terminal set with a cabochon (the icon's glass)
  redo: (icon, g) => arrowPath(g, 'M5 17.8 V14 A5.4 5.4 0 0 1 10.4 8.6 H15.6', 20.8, 8.6, 0, 0.7, 2.3, 'K', [5, 18.2, 90, 'c1']),
  reply: (icon, g) => arrowPath(g, 'M19 17.8 V14.8 A5.2 5.2 0 0 0 13.8 9.6 H8', 3.2, 9.6, 180, 0.7, 2.3, 'K', [19, 18.2, 90, 'c2']),
  'reply-all': (icon, g) => [
    ...arrowPath(g, 'M19.2 17.8 V15 A4.8 4.8 0 0 0 14.4 10.2 H12', 7.8, 10.2, 180, 0.6, 2.3, 'K', [19.2, 18.2, 90, 'c2']),
    ...head(g, 2.6, 10.2, 180, 0.6, 'A'),
  ],
  refresh: (icon, g) => [
    ...arcArrow(g, 12, 12, 7.6, 200, 296, 0.66, 2.3, 'K', 'c1'),
    ...arcArrow(g, 12, 12, 7.6, 20, 116, 0.66, 2.3, 'A', 'c1'),
    ...g.rose(12, 12, 2.8, 'c2', { n: 6, frame: 0.8 }),
  ],
  'rotate-cw': (icon, g) => [...arcArrow(g, 12, 12.8, 7.6, 30, 268, 0.74, 2.3, 'K', 'c1'), ...g.rose(12, 12.8, 3, 'c2', { n: 6, frame: 0.8 })],
  'rotate-ccw': (icon, g) => [...arcArrow(g, 12, 12.8, 7.6, 150, -88, 0.74, 2.3, 'K', 'c1'), ...g.rose(12, 12.8, 3, 'c2', { n: 6, frame: 0.8 })],
  // a rainbow as a pointed-arch window: ruby, gold and sapphire bands leaded in stone
  rainbow: (icon, g) => {
    const H = r => g.inter(g.circle(12, 18.8, r), g.rect(0, 0, 24, 18.8))
    return [
      g.stone(sub(H(9.6), H(2.4)), { ticks: [[pt(12, 18.8, 8, 225), pt(12, 18.8, 10, 225)], [pt(12, 18.8, 8, 315), pt(12, 18.8, 10, 315)]] }),
      g.glass(sub(H(8.4), H(6.7)), 'c1', { outline: 0.35, glint: false }),
      g.glass(sub(H(6.7), H(5)), 'c3', { outline: 0.35, glint: false }),
      g.glass(sub(H(5), H(3.4)), 'c2', { outline: 0.35, glint: false }),
      g.stone(g.rr(2.2, 18.4, 21.8, 20.8, 1), { thin: true, ticks: [[[7, 17], [7, 22]], [[12, 17], [12, 22]], [[17, 17], [17, 22]]] }),
    ]
  },
  repeat: (icon, g) => [
    ...arrowPath(g, 'M4.4 11.6 V10 A3.4 3.4 0 0 1 7.8 6.6 H15.4', 21, 6.6, 0, 0.6, 2.3, 'K', [4.4, 11.8, 90, 'c1', 2.1]),
    ...arrowPath(g, 'M19.6 12.4 V14 A3.4 3.4 0 0 1 16.2 17.4 H8.6', 3, 17.4, 180, 0.6, 2.3, 'A', [19.6, 12.2, -90, 'c1', 2.1]),
  ],
  'repeat-1': (icon, g) => [
    ...arrowPath(g, 'M4.4 11.6 V10 A3.4 3.4 0 0 1 7.8 6.6 H15.4', 21, 6.6, 0, 0.6, 2.3, 'K', [4.4, 11.8, 90, 'c2', 2.1]),
    ...arrowPath(g, 'M19.6 12.4 V14 A3.4 3.4 0 0 1 16.2 17.4 H8.6', 3, 17.4, 180, 0.6, 2.3, 'A', [19.6, 12.2, -90, 'c2', 2.1]),
    g.gilt(g.circle(12, 12, 2.6), { plate: 'S', glint: false }),
    g.glass(g.circle(12, 12, 1.9), 'c1', { plate: 'S', outline: 0.25 }),
    g.stone(g.stroke([[11.3, 11.2], [12.2, 10.6], [12.2, 13.4]], 0.85), { plate: 'S', thin: true, outline: 0.25 }),
  ],
  shuffle: (icon, g) => [
    ...arrowPath(g, 'M5.2 17.4 H6.6 C10.4 17.4 11.8 6.6 16 6.6 H16.4', 21.2, 6.6, 0, 0.6, 2.3, 'K', [5, 17.4, 180, 'c1', 2.2]),
    ...arrowPath(g, 'M5.2 6.6 H6.6 C10.4 6.6 11.8 17.4 16 17.4 H16.4', 21.2, 17.4, 0, 0.6, 2.3, 'A', [5, 6.6, 180, 'c1', 2.2]),
  ],
  // a road of jointed stone between an emerald and a ruby waystone
  route: (icon, g) => [
    g.stone(g.stroke('M6 18.4 H14.6 A3.2 3.2 0 0 0 14.6 12 H9.4 A3.2 3.2 0 0 1 9.4 5.6 H18', 2.4), { thin: true, ticks: [[[11.6, 16], [11.6, 21]], [[12, 9.6], [12, 14.4]], [[12.4, 3], [12.4, 8]]] }),
    ...boss(g, 5.4, 18.4, 2.8, 'c4'),
    ...boss(g, 18.6, 5.6, 2.8, 'c1', 'A'),
  ],
  rss: (icon, g) => [
    ...g.pane(g.arc(5.4, 18.6, 7.2, -90, 0, 3.2), 'c3', { frame: 0.9, tracery: 'none' }),
    ...g.pane(g.arc(5.4, 18.6, 13.2, -90, 0, 3.2), 'c3', { frame: 0.9, tracery: 'none', plate: 'A' }),
    ...boss(g, 5.6, 18.4, 2.5),
  ],
  'share-2': (icon, g) => [
    ...g.pane(sub(g.rr(4, 10.6, 20, 21.2, 2), g.rect(9.4, 9, 14.6, 13.4)), 'c2', { frame: 1.5, tracery: 'quarry', glass: { medallion: false, s: 2.4 } }),
    ...arrowPath(g, [[12, 16.4], [12, 7]], 12, 2.4, -90, 0.66, 2.4, 'A'),
  ],
  share: (icon, g) => [
    g.stone(g.union(g.seg(17.6, 5.4, 6.4, 12, 1.7), g.seg(6.4, 12, 17.6, 18.6, 1.7)), { thin: true }),
    ...g.rose(17.6, 5.4, 3.3, 'c1', { n: 6, frame: 0.9, plate: 'A' }),
    ...g.rose(6.4, 12, 3.3, 'c2', { n: 6, frame: 0.9 }),
    ...g.rose(17.6, 18.6, 3.3, 'c4', { n: 6, frame: 0.9, plate: 'A' }),
  ],
  send: (icon, g) => [
    g.glass(g.poly([[21.2, 2.8], [2.8, 10], [10.4, 13.6]]), 'c2', { tracery: 'lancet', s: 2.4 }),
    g.glass(g.poly([[21.2, 2.8], [10.4, 13.6], [14, 21.2]]), 'c2', { tracery: 'lancet', s: 2.4, deep: 0.25 }),
    g.stone(g.stroke([[21.2, 2.8], [2.8, 10], [10.4, 13.6], [14, 21.2], [21.2, 2.8]], 1.5, true), { thin: true }),
    g.gilt(g.seg(20.4, 3.6, 10.6, 13.4, 1.1), { thin: true, outline: 0.3, plate: 'A' }),
  ],

  // ===== security: heraldic shields
  shield: (icon, g) => [
    ...shield(g),
    g.gilt(g.inter(g.union(g.rect(10.8, 2, 13.2, 22), g.rect(2, 9.2, 22, 11.6)), g.shrink(g.path(SHIELD), 1.6))),
    g.glass(g.foil(12, 10.4, 2.4, 4, -45), 'c1', { outline: 0.3, glint: false }),
  ],
  'shield-alert': (icon, g) => [...shield(g, 'c1'), g.gilt(g.union(g.seg(12, 6.8, 12, 12.6, 2.6), g.circle(12, 16.4, 1.6)), { plate: 'S' })],
  'shield-check': (icon, g) => [...shield(g, 'c4'), g.gilt(g.stroke([[8, 11.6], [11, 14.6], [16.2, 8.6]], 2.6), { plate: 'S' })],
  'shield-off': (icon, g) => [...shield(g), ...g.slash(3.4, 3.4, 20.6, 20.6, 1.8)],
  'shield-user': (icon, g) => [
    ...shield(g),
    g.gilt(g.path('M7.4 17.4 C8 14.6 9.8 13.2 12 13.2 C14.2 13.2 16 14.6 16.6 17.4 C15.2 18.6 13.6 19.4 12 20 C10.4 19.4 8.8 18.6 7.4 17.4 Z')),
    g.gilt(g.circle(12, 9.4, 3), { glint: false }),
    g.glass(g.circle(12, 9.4, 2.2), 'c3', { outline: 0.25 }),
  ],

  // ===== travel
  plane: (icon, g) => plane(g, 12, 12, -45, 0.98),
  'plane-takeoff': (icon, g) => [g.stone(g.rr(2.6, 19.2, 21.4, 21.4, 1.1), { thin: true, ticks: [[[7.4, 18], [7.4, 23]], [[12, 18], [12, 23]], [[16.6, 18], [16.6, 23]]] }), ...plane(g, 12, 10.2, -28, 0.82, 'A')],
  'plane-landing': (icon, g) => [g.stone(g.rr(2.6, 19.2, 21.4, 21.4, 1.1), { thin: true, ticks: [[[7.4, 18], [7.4, 23]], [[12, 18], [12, 23]], [[16.6, 18], [16.6, 23]]] }), ...plane(g, 12, 9.6, 28, 0.82, 'A')],
  // a sailing ship: gilt mast with a lancet pennant of ruby, triangular sails of sapphire glass,
  // a smooth carved hull with glowing ports, gilt waves
  ship: (icon, g) => [
    g.gilt(g.seg(11.6, 3, 11.6, 14, 1.3), { thin: true }),
    g.glass(g.path('M12.2 2.4 C14 2.6 15.8 3 17.6 3.7 C15.8 4.3 14 4.8 12.2 5 Z'), 'c1', { outline: 0.3, glint: false, plate: 'A' }),
    g.glass(g.path('M12.6 5.4 C15.4 7.4 17.6 10 19 12.8 H12.6 Z'), 'c2', { outline: 0.4, tracery: [[[12, 8.6], [20, 8.6]], [[12, 10.9], [20, 10.9]]], plate: 'A', glow: 0.24 }),
    g.glass(g.path('M10.6 6.6 V12.8 H5 C6.6 10.6 8.4 8.4 10.6 6.6 Z'), 'c2', { outline: 0.4, tracery: [[[4, 10.4], [11, 10.4]]], plate: 'A', deep: 0.16 }),
    g.stone(g.path('M2.6 13.8 H21.4 L18.8 19 H5.2 Z')),
    g.lead([[[4.4, 15.2], [19.6, 15.2]]], { role: 'edge', w: 0.34 }),
    g.recess(g.union(g.circle(8.2, 16.9, 0.75), g.circle(12, 16.9, 0.75), g.circle(15.8, 16.9, 0.75)), { glow: 'c3' }),
    g.deco(g.gilt(g.stroke('M2.6 20.6 C4 19.4 5.6 19.4 7 20.6 C8.4 21.8 10 21.8 11.4 20.6 C12.8 19.4 14.4 19.4 15.8 20.6 C17.2 21.8 18.8 21.8 20.4 20.6', 1.3), { thin: true, outline: 0.32, glint: false })),
  ],
  pin: (icon, g) => {
    const ox = 12.6, oy = 11.4, a = 135
    return [
      g.gilt(lpoly(g, [[1.2, -0.75], [9.8, 0], [1.2, 0.75]], ox, oy, a), { thin: true, plate: 'A' }),
      g.glass(lpoly(g, [[-7.2, -2.5], [-0.4, -3.2], [-0.4, 3.2], [-7.2, 2.5]], ox, oy, a), 'c1', { outline: 0.4, tracery: [place([[-6, -1], [0, -1.2]], ox, oy, a), place([[-6, 1], [0, 1.2]], ox, oy, a)] }),
      g.gilt(lpoly(g, [[-0.8, -5.6], [1.4, -5.6], [1.4, 5.6], [-0.8, 5.6]], ox, oy, a)),
      g.gilt(lpoly(g, [[-9, -3.8], [-6.8, -3.8], [-6.8, 3.8], [-9, 3.8]], ox, oy, a)),
    ]
  },

  // ===== health
  pill: (icon, g) => {
    const cap = g.seg(6.6, 17.4, 17.4, 6.6, 7.4)
    return [
      g.glass(g.inter(cap, g.poly([[0, 0], [0, 24], [24, 24]])), 'c1', { tracery: 'none' }),
      g.glass(g.inter(cap, g.poly([[0, 0], [24, 0], [24, 24]])), 'c3', { tracery: 'none' }),
      g.gilt(g.seg(9.6, 9.6, 14.4, 14.4, 1.4), { thin: true, plate: 'A' }),
      g.stone(g.rim(cap, 1.1), { thin: true }),
    ]
  },

  // ===== shopping
  'shopping-bag': (icon, g) => [
    g.gilt(g.stroke('M8.6 8.4 V6.4 A3.4 3.4 0 0 1 15.4 6.4 V8.4', 1.8), { plate: 'A' }),
    ...g.pane(g.path('M5.4 6.8 H18.6 L20 21.2 H4 Z'), 'c1', { frame: 1.5, tracery: 'medallion', glass: { lobes: 4, at: { c: [12, 14.4], r: 3.4 } } }),
    g.studs([[8.6, 9.6], [15.4, 9.6]], 0.7),
  ],
  'shopping-basket': (icon, g) => [
    g.gilt(g.union(g.seg(5.8, 10.6, 9.6, 3.6, 1.6), g.seg(18.2, 10.6, 14.4, 3.6, 1.6)), { plate: 'A', thin: true }),
    ...g.pane(g.poly([[3.6, 11.6], [20.4, 11.6], [18.6, 21.2], [5.4, 21.2]]), 'c3', { frame: 1.2, tracery: 'lancet', glass: { s: 2.6 } }),
    g.stone(g.rr(2.4, 9.6, 21.6, 12.6, 1.4), { thin: true, ticks: [[[7.4, 9], [7.4, 13]], [[12, 9], [12, 13]], [[16.6, 9], [16.6, 13]]] }),
  ],
  'shopping-cart': (icon, g) => [
    g.gilt(g.stroke([[2.4, 3.4], [5, 3.4], [7.6, 15.8], [19.2, 15.8]], 1.7)),
    ...g.pane(g.poly([[5.4, 5.8], [21.2, 5.8], [19.6, 13.6], [7, 13.6]]), 'c2', { frame: 1.2, tracery: 'lancet', glass: { s: 2.6 } }),
    ...boss(g, 9, 19.6, 1.8, 'c1', 'A'), ...boss(g, 17.4, 19.6, 1.8, 'c1', 'A'),
  ],
  'shopping-cart-plus': (icon, g) => [
    g.gilt(g.stroke([[2.4, 3.4], [5, 3.4], [7.6, 15.8], [19.2, 15.8]], 1.7)),
    ...g.pane(g.poly([[5.4, 5.8], [21.2, 5.8], [19.6, 13.6], [7, 13.6]]), 'c2', { frame: 1.2, tracery: 'none' }),
    g.gilt(g.glyph('plus', 13.4, 9.7, 0.85, 1.5), { plate: 'S', thin: true }),
    ...boss(g, 9, 19.6, 1.8, 'c1', 'A'), ...boss(g, 17.4, 19.6, 1.8, 'c1', 'A'),
  ],

  // ===== tools
  ruler: (icon, g) => {
    const ox = 12, oy = 12, a = -45
    const T = []
    for (let k = -4; k <= 4; k++) T.push(place([[k * 2.2, -3.4], [k * 2.2, k % 2 ? -1.6 : -0.2]], ox, oy, a))
    return [
      g.stone(lpoly(g, [[-10.4, -3], [10.4, -3], [10.4, 3], [-10.4, 3]], ox, oy, a), { ticks: T }),
      g.gilt(g.union(lpoly(g, [[-10.6, -3.2], [-9.2, -3.2], [-9.2, 3.2], [-10.6, 3.2]], ox, oy, a), lpoly(g, [[9.2, -3.2], [10.6, -3.2], [10.6, 3.2], [9.2, 3.2]], ox, oy, a)), { thin: true }),
      g.glass(lpoly(g, [[-7.6, 0.9], [7.6, 0.9], [7.6, 2], [-7.6, 2]], ox, oy, a), 'c2', { outline: 0.3, glint: false }),
    ]
  },
  scale: (icon, g) => [
    g.gilt(g.stroke([[[5, 6.6], [2.6, 13.4]], [[5, 6.6], [7.4, 13.4]], [[19, 6.6], [16.6, 13.4]], [[19, 6.6], [21.4, 13.4]]], 0.8), { thin: true, outline: 0.25, glint: false, plate: 'A' }),
    g.stone(g.rr(10.9, 5, 13.1, 20, 0.6), { thin: true, ticks: [[[10, 10], [14, 10]], [[10, 14.6], [14, 14.6]]] }),
    g.stone(g.rr(6.6, 19.4, 17.4, 21.4, 1)),
    g.gilt(g.seg(4.4, 6.4, 19.6, 6.4, 1.7), { plate: 'A' }),
    g.gilt(g.path('M2 13.2 H8 A3 3 0 0 1 2 13.2 Z M16 13.2 H22 A3 3 0 0 1 16 13.2 Z'), { plate: 'A' }),
    g.glass(g.path('M3 13.8 H7 A2 2 0 0 1 3 13.8 Z M17 13.8 H21 A2 2 0 0 1 17 13.8 Z'), 'c1', { outline: 0.2, glint: false, plate: 'A' }),
    g.finial(12, 5, 0.75, { plate: 'deco' }),
  ],
  scissors: (icon, g) => [
    g.gilt(g.poly([[8.6, 7.2], [14.2, 11], [21.4, 19], [12.6, 13.8], [7.4, 9.4]])),
    ...g.pane(g.ring(6, 6.4, 2.9, 2.6), 'c1', { frame: 0.8, tracery: 'none' }),
    g.gilt(g.poly([[8.6, 16.8], [14.2, 13], [21.4, 5], [12.6, 10.2], [7.4, 14.6]]), { plate: 'A' }),
    ...g.pane(g.ring(6, 17.6, 2.9, 2.6), 'c1', { frame: 0.8, tracery: 'none', plate: 'A' }),
    g.studs([[12.8, 12]], 0.8),
  ],
  // three stone tracks with a sapphire glass channel between carved corbel stops (gilt studs),
  // gilded sliders set with ruby lozenges (they move)
  sliders: (icon, g) => {
    const Y = [5, 12, 19], K = [[8.4, 5], [15.6, 12], [10.4, 19]]
    return [
      g.stone(g.union(Y.map(y => g.rr(3.6, y - 1.25, 20.4, y + 1.25, 1.2))), { thin: true }),
      g.glass(g.union(Y.map(y => g.rr(5.4, y - 0.4, 18.6, y + 0.4, 0.4))), 'c2', { outline: 0.22, glint: false, glow: 0.3 }),
      g.stone(g.union(Y.flatMap(y => [g.rr(2.6, y - 1.9, 4.8, y + 1.9, 0.5), g.rr(19.2, y - 1.9, 21.4, y + 1.9, 0.5)])), { thin: true }),
      g.gilt(g.union(K.map(([x, y]) => g.rr(x - 1.6, y - 2.8, x + 1.6, y + 2.8, 1))), { plate: 'A' }),
      g.glass(g.union(K.map(([x, y]) => g.ngon(x, y, 1, 4))), 'c1', { outline: 0.25, glint: false, plate: 'A' }),
    ]
  },


  // ===== buildings and signs
  school: (icon, g) => [
    g.gilt(g.seg(12, 7, 12, 2.4, 0.9), { thin: true }),
    g.glass(g.poly([[12.4, 2.4], [16.6, 3.5], [12.4, 4.8]]), 'c1', { outline: 0.3, glint: false, plate: 'A' }),
    g.stone(g.rr(2.6, 12.4, 21.4, 21.2, 0.8), { ashlar: { h: 2.2, w: 3.2, y0: 12.4, y1: 21.2 } }),
    g.stone(g.poly([[8.2, 21.2], [8.2, 10.6], [12, 6.8], [15.8, 10.6], [15.8, 21.2]]), { ashlar: { h: 2.2, w: 3, y0: 10.6, y1: 21.2, x: 0.6 } }),
    g.gilt(g.stroke([[7.2, 11.4], [12, 6.4], [16.8, 11.4]], 1.5), { thin: true }),
    g.recess(g.lancet(10.2, 14.8, 13.8, 21.2, 1), { glow: 'c3', glowOp: 0.7, plate: 'A' }),
    g.glass(g.union(g.lancet(4.2, 14.4, 6.6, 18.8, 1.1), g.lancet(17.4, 14.4, 19.8, 18.8, 1.1)), 'c2', { outline: 0.35, glint: false }),
    ...g.rose(12, 11, 1.6, 'c2', { n: 6, frame: 0.55 }),
  ],
  signpost: (icon, g) => [
    g.stone(g.rr(10.8, 3, 13.2, 20.4, 0.4), { thin: true, ticks: [[[10, 18], [14, 18]]] }),
    g.stone(g.rr(8.4, 19.6, 15.6, 21.4, 0.8), { thin: true }),
    ...g.pane(g.poly([[4.4, 4.6], [17.6, 4.6], [20.6, 7.2], [17.6, 9.8], [4.4, 9.8]]), 'c4', { frame: 1, tracery: 'none' }),
    ...g.pane(g.poly([[19.6, 11.6], [6.4, 11.6], [3.4, 14.2], [6.4, 16.8], [19.6, 16.8]]), 'c3', { frame: 1, tracery: 'none', plate: 'A' }),
    g.studs([[12, 7.2], [12, 14.2]], 0.55),
    g.finial(12, 3.2, 0.6, { plate: 'deco' }),
  ],
  signal: (icon, g) => [
    ...g.window(2.6, 14.4, 6.2, 21.2, 'c2', { k: 1.2, frame: 1 }),
    ...g.window(7.6, 10.6, 11.2, 21.2, 'c2', { k: 1.2, frame: 1 }),
    ...g.window(12.6, 6.8, 16.2, 21.2, 'c2', { k: 1.2, frame: 1 }),
    ...g.window(17.6, 2.8, 21.2, 21.2, 'c3', { k: 1.2, frame: 1 }),
  ],
  siren: (icon, g) => [
    g.deco(g.gilt(g.union(g.seg(12, 2.4, 12, 4.4, 1.3), g.seg(4.8, 5.2, 6.2, 6.6, 1.3), g.seg(19.2, 5.2, 17.8, 6.6, 1.3), g.seg(2.6, 11.4, 4.4, 11.4, 1.3), g.seg(21.4, 11.4, 19.6, 11.4, 1.3)), { thin: true, outline: 0.3, glint: false })),
    ...g.pane(g.lancet(6.4, 6, 17.6, 17.4, 0.72), 'c1', { frame: 1.3, tracery: 'lancet', glass: { s: 2.4, glow: 0.3 } }),
    ...carved(g, 4, 16.6, 20, 21.2, 1.2, 0.9),
  ],

  // ===== animals and money
  // a piggy bank of ruby glass in a fine stone frame, 3/4 view: a gilt-lipped coin slot with a gold coin
  // dropping in, a carved perky ear, a gilt oval snout and stubby legs, a gilt curl of a tail
  'piggy-bank': (icon, g) => [
    g.gilt(g.union(g.rr(5.9, 16.4, 8.1, 21.3, 1), g.rr(13.9, 16.4, 16.1, 21.3, 1)), { plate: 'K' }),
    g.gilt(g.stroke('M4.6 12.3 C2.9 12.4 2.2 11.2 2.8 10.2 C3.1 9.7 3.6 9.7 3.9 10', 1.1), { thin: true, outline: 0.3, glint: false }),
    g.gilt(g.path('M17.1 8 C17.8 7 18.6 6.3 19.6 5.9 C19.9 7.5 19.5 9 18.6 10.4 Z')),
    g.gilt(g.path('M13.3 10 C13.1 7.3 14.4 5 16.5 4.1 C17.5 6.2 17.9 8.4 17.5 10.4 Z')),
    ...g.pane(g.ellipse(11.75, 14, 7.4, 5.5), 'c1', { frame: 1.1, tracery: [[[6.6, 10.2], [6.6, 17.8]]], glass: { glow: 0.24 } }),
    g.gilt(g.ellipse(19.75, 13.5, 1.85, 2.5)),
    g.recess(g.union(g.circle(19.1, 13.2, 0.36), g.circle(20.4, 13.2, 0.36))),
    g.recess(g.circle(15.75, 12, 0.62)),
    g.gilt(g.rr(8.5, 10.6, 12.5, 12.2, 0.8)),
    g.recess(g.rr(9.2, 11.1, 11.8, 11.7, 0.3)),
    g.deco(g.gilt(g.circle(10.5, 4.2, 2.1), { glint: false }), g.glass(g.circle(10.5, 4.2, 1.3), 'c3', { outline: 0.25, glint: false })),
  ],

}
