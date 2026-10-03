// PLUSH redraws, chunk 1: hand-composed stuffed-toy icons (see forge/styles/PLUSH-GUIDE.md).
// Each entry: name -> (icon, P) => pieces, built with the frozen kit (P = prim + kit + P.auto()).
// The art director's exemplars (EXEMPLAR in _plush-render.mjs) win over any entry here.
//
// Chunk 1 = icons 1-100 alphabetically (accessibility .. circle-arrow-down).
// Family rules kept from the exemplars: arrows and chevrons tomato, checks mint, calendars cream
// page + tomato header + sky loops, bells sunflower dome + tomato rim, files sky + cream flap.

import { EXEMPLAR } from './_plush-exemplars.mjs'

// ---------------------------------------------------------------------------
// local helpers (the kit is frozen; everything chunk-specific lives here)

const SOFT = { stitch: false, out: 0.5 }                       // small sewn-on parts
const DECO = { part: 'deco', stitch: false, out: 0.5 }          // floating decorations
// an ellipse as a closed polyline (for orbit tubes), rotated deg around its centre
function ellPts(cx, cy, rx, ry, deg = 0, n = 48) {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
  return Array.from({ length: n }, (_, i) => {
    const t = i / n * Math.PI * 2, x = rx * Math.cos(t), y = ry * Math.sin(t)
    return [cx + x * c - y * s, cy + x * s + y * c]
  })
}
// an arrowhead field: tip (x1, y1), pointing away from (x0, y0)
function headF(P, x0, y0, x1, y1, o) {
  const len = o.len, half = o.half
  const L = Math.hypot(x1 - x0, y1 - y0) || 1, ux = (x1 - x0) / L, uy = (y1 - y0) / L
  const bx = x1 - ux * len, by = y1 - uy * len, rt = o.r ?? 1.3, rb = o.rb ?? 0.75
  return { F: P.poly([[x1, y1], [bx - uy * half, by + ux * half], [bx + ux * 0.9, by + uy * 0.9], [bx + uy * half, by - ux * half]], [rt, rb, 0.6, rb]), bx, by, ux, uy }
}
// a stuffed arrow whose head is its own A piece (the head-nudge), joined by a hidden seam:
// the head's piping goes down first, the K shaft over it, then the head felt without piping,
// so at rest it reads as one panel and the shaft runs on under the head when it moves.
// heads: one or more [x0, y0, x1, y1] (shaft from x0 to the tip x1)
function arrowParts(P, shaft, heads, o = {}) {
  const role = o.role || 'c1', w = o.w ?? 3.4
  const H = heads.map(([x0, y0, x1, y1]) => headF(P, x0, y0, x1, y1, o))
  const ends = H.map(h => [h.bx + h.ux * 2.4, h.by + h.uy * 2.4])
  const pts = shaft.length === 2 && H.length === 2 ? [ends[1], ends[0]] : shaft
  const seam = H.length === 2
    ? [[[H[1].bx + H[1].ux * 0.2, H[1].by + H[1].uy * 0.2], [H[0].bx - H[0].ux * 0.2, H[0].by - H[0].uy * 0.2]]]
    : [[pts[0], [H[0].bx - H[0].ux * 0.4, H[0].by - H[0].uy * 0.4]]]
  const sh = H.length === 1 ? [pts[0], ends[0]] : pts
  return [
    ...H.map(h => P.flat('ink', P.grow(h.F, 0.62), { part: 'A' })),
    P.felt(role, P.seg(sh[0][0], sh[0][1], sh[1][0], sh[1][1], w), { part: 'K', seam }),
    ...H.map(h => P.felt(role, h.F, { part: 'A', line: false, stitch: false, pinch: false })),
  ]
}
const ARROW = { len: 7.5, half: 6.5, w: 3.4, r: 1.6 }
const DIAG = { len: 7, half: 6, w: 3.3, r: 1.5 }
const arrow1 = (P, x0, y0, x1, y1, o = ARROW) => arrowParts(P, [[x0, y0], [x1, y1]], [[x0, y0, x1, y1]], o)
const arrow2 = (P, x0, y0, x1, y1) => {
  const o = { len: 6.25, half: 5.25, w: 3.2, r: 1.4 }
  return arrowParts(P, [[x0, y0], [x1, y1]], [[x0, y0, x1, y1], [x1, y1, x0, y0]], o)
}
// a chevron tube (tomato, family rule), tip at (x, y) pointing deg
const chev = (P, x, y, deg, arm = 8, o = {}) => P.chevron(x, y, deg, arm, { role: 'c1', w: 3.3, part: 'K', ...o })

const align = (P, rows) => rows.map(([a, b], i) => P.felt(i % 2 && b - a < 18 ? 'c1' : 'c3', P.pill(a, 4.5 + i * 5 - 1.35, b, 4.5 + i * 5 + 1.35), { part: 'K', stitch: false }))

// battery: sky shell + nub, cream window
function batteryShell(P) {
  return [
    P.felt('c3', P.pill(18.25, 9.75, 22.25, 14.25), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.rr(1.75, 6, 19.75, 18, 2.75), { part: 'K', stitch: false, pinch: false }),
    P.felt('tint', P.rr(3.75, 8, 17.75, 16, 1.6), { part: 'K', stitch: false, out: 0.4, shade: false }),
  ]
}
const cell = (P, role, x0, x1) => P.felt(role, P.rr(x0, 9.25, x1, 14.75, 1.1), { part: 'A', stitch: false, out: 0.4 })
const bolt = P => P.poly([[13, 3], [8, 12.5], [11.75, 12.5], [10.25, 21], [16, 11], [12.25, 11]], [0.7, 0.5, 0.3, 0.7, 0.5, 0.3])
const bookmarkF = P => P.poly([[5.5, 3], [18.5, 3], [18.5, 21], [12, 16.75], [5.5, 21]], [2, 2, 1.1, 0.8, 1.1])

// briefcase: sky handle behind a tomato case
const caseBody = P => [
  P.tube('c3', [[8.75, 7], [8.75, 4], [15.25, 4], [15.25, 7]], 2, { part: 'A', ...SOFT }),
  P.felt('c1', P.rr(2.25, 6.5, 21.75, 20.75, 2.75), { part: 'K' }),
]

export const R = {
  // ---------------------------------------------------------------- a
  // a sky felt disc with a sewn-on cream figure, arms wide
  accessibility: (icon, P) => [
    P.felt('c3', P.circle(12, 12, 9.75), { part: 'K' }),
    P.felt('tint', P.fillet(P.unite(P.seg(7.25, 10.25, 16.75, 10.25, 2.2), P.seg(12, 10.25, 12, 14, 2.4), P.bar([[8.9, 18.1], [12, 14], [15.1, 18.1]], 2.2)), 0.5), { part: 'A', ...SOFT }),
    P.felt('tint', P.circle(12, 6.75, 1.75), { part: 'A', ...SOFT }),
  ],
  // text-align bars: four stuffed tubes, the short ones at 60% (justify keeps them even)
  'align-left': (icon, P) => align(P, [[3,21],[3,13.8],[3,21],[3,13.8]]),
  'align-center': (icon, P) => align(P, [[3,21],[6.6,17.4],[3,21],[6.6,17.4]]),
  'align-right': (icon, P) => align(P, [[3,21],[10.2,21],[3,21],[10.2,21]]),
  'align-justify': (icon, P) => align(P, [[3,21],[3,21],[3,21],[3,21]]),
  // a tomato heartbeat tube with a little heart patch riding the peak
  activity: (icon, P) => [
    P.tube('c1', [[2.5, 12.5], [6, 12.5], [9.5, 5], [14.5, 19], [18, 12.5], [21.5, 12.5]], 3, { part: 'K' }),
  ],
  // a sky address book, sunflower index tabs, a cream person patch on the cover
  'address-book': (icon, P) => [
    P.felt('c2', P.unite(P.pill(15, 5.5, 20.75, 8.25), P.pill(15, 10.75, 20.75, 13.5), P.pill(15, 16, 20.75, 18.75)), { part: 'A', ...SOFT }),
    P.felt('c3', P.rr(3.5, 2.75, 18.25, 21.25, 2.5), { part: 'K' }),
    P.felt('tint', P.circle(10.9, 9.6, 2.5), { part: 'K', ...SOFT }),
    P.felt('tint', P.round(P.clip(P.ellipse(10.9, 18.25, 4.6, 4), P.rect(0, 0, 24, 17.25)), 0.8), { part: 'K', ...SOFT }),
  ],
  // a tomato clock body with sunflower bells, a cream face with embroidered hands
  'alarm-clock': (icon, P) => [
    P.tube('c1', [[7.25, 18.5], [5.5, 20.75]], 2.2, { part: 'K', ...SOFT }),
    P.tube('c1', [[16.75, 18.5], [18.5, 20.75]], 2.2, { part: 'K', ...SOFT }),
    P.felt('c2', P.rot(P.half(6, 6, 3.6, 'n'), -40, 6, 6), { part: 'A', stitch: false }),
    P.felt('c2', P.rot(P.half(18, 6, 3.6, 'n'), 40, 18, 6), { part: 'A', stitch: false }),
    P.felt('c1', P.circle(12, 13, 7.75), { part: 'K', stitch: false }),
    P.felt('tint', P.circle(12, 13, 5.5), { part: 'K', inset: 0.7, stitchMin: 1.2 }),
    P.thread([[12, 9.75], [12, 13], [14.4, 14.4]], { w: 1.2, part: 'K' }),
    P.knot(12, 13, 0.75, 'c1', { part: 'K' }),
  ],
  // a tomato disc with a sewn-on cream exclamation
  'alert-circle': (icon, P) => [
    P.felt('c1', P.circle(12, 12, 9.75), { part: 'K' }),
    P.felt('tint', P.pill(10.75, 5.75, 13.25, 13.75), { part: 'A', ...SOFT }),
    P.felt('tint', P.circle(12, 17.15, 1.5), { part: 'A', ...SOFT }),
  ],
  // a sunflower warning pillow, a tomato exclamation sewn on
  'alert-triangle': (icon, P) => [
    P.felt('c2', P.poly([[12, 2.5], [22.25, 20.5], [1.75, 20.5]], [2.1, 2.1, 2.1]), { part: 'K' }),
    P.felt('c1', P.pill(10.85, 8.5, 13.15, 14.5), { part: 'A', ...SOFT }),
    P.felt('c1', P.circle(12, 17.4, 1.35), { part: 'A', ...SOFT }),
  ],
  // a cream ambulance with a tomato cross and cab, sky wheels with cream hubs
  ambulance: (icon, P) => [
    P.felt('c1', P.poly([[13.5, 8.25], [18, 8.25], [22, 12.75], [22, 18], [13.5, 18]], [1.2, 1.5, 1.2, 1.4, 0.4]), { part: 'K', stitch: false }),
    P.felt('tint', P.poly([[16, 10], [18, 10], [20.5, 12.9], [16, 12.9]], [0.6, 0.8, 0.5, 0.5]), { part: 'K', stitch: false, out: 0.4, shade: false }),
    P.felt('tint', P.rr(2, 5.25, 15, 18, [2.25, 2.25, 0.5, 2]), { part: 'K' }),
    P.felt('c1', P.unite(P.rr(7.25, 7.5, 9.75, 15.5, 0.75), P.rr(4.5, 10.25, 12.5, 12.75, 0.75)), { part: 'K', ...SOFT }),
    P.felt('c3', P.circle(6.75, 18.25, 2.6), { part: 'A', stitch: false }),
    P.felt('c3', P.circle(17.75, 18.25, 2.6), { part: 'A', stitch: false }),
    P.knot(6.75, 18.25, 0.85, 'tint', { part: 'A' }), P.knot(17.75, 18.25, 0.85, 'tint', { part: 'A' }),
  ],
  // a sky anchor (one stuffed panel) hanging from a sunflower ring
  anchor: (icon, P) => [
    P.felt('c2', P.ring(12, 4.6, 2.75, 1.05), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.fillet(P.unite(
      P.seg(12, 7.5, 12, 20.25, 3),
      P.seg(7.75, 10.5, 16.25, 10.5, 2.6),
      P.arc(12, 11.75, 8.5, 22, 158, 3),
      P.poly([[1.75, 12.25], [6.25, 13.75], [2.25, 17.25]], 0.8),
      P.poly([[22.25, 12.25], [17.75, 13.75], [21.75, 17.25]], 0.8),
    ), 0.9), { part: 'K', seam: [[[12, 8.5], [12, 18.5]]] }),
  ],
  // a grumpy tomato pillow: embroidered brows, knot eyes, a frown
  angry: (icon, P) => [
    P.felt('c1', P.circle(12, 12, 9.75), { part: 'K' }),
    P.thread([[[7, 8], [10.25, 9.75]], [[17, 8], [13.75, 9.75]]], { w: 1.25, part: 'A' }),
    P.knot(8.75, 11.75, 0.95, 'ink', { part: 'A' }), P.knot(15.25, 11.75, 0.95, 'ink', { part: 'A' }),
    P.thread(Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [8.75 + 6.5 * t, 17.25 - 1.6 * Math.sin(Math.PI * t)] }), { w: 1.2, part: 'A' }),
  ],
  // a cream window with a sky title bar and three toy-box buttons
  'app-window': (icon, P) => {
    const body = P.rr(2.25, 3.5, 21.75, 20.5, 2.5)
    return [
      P.felt('tint', body, { part: 'K', inset: 0.85 }),
      P.felt('c3', P.clip(body, P.rect(0, 0, 24, 8.75)), { part: 'K', stitch: false, out: 0.5 }),
      P.knot(6.25, 6.15, 0.95, 'c1', { part: 'A' }), P.knot(9.25, 6.15, 0.95, 'c2', { part: 'A' }), P.knot(12.25, 6.15, 0.95, 'c4', { part: 'A' }),
    ]
  },
  // a tomato apple, a mint leaf and stalk
  apple: (icon, P) => [
    P.felt('c4', P.fillet(P.unite(P.seg(12, 8.5, 12.75, 4.5, 1.6), P.lens(13, 5.25, 18.25, 3.25, 1.6)), 0.4), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c1', P.fillet(P.unite(P.ellipse(8.75, 13.75, 6, 7.25), P.ellipse(15.25, 13.75, 6, 7.25)), 1.4), { part: 'K' }),
    P.thread(P.arcPts(8.75, 12.5, 3.25, 200, 250, 10), { w: 1.1, role: 'shine', op: 0.85, part: 'K' }),
  ],
  // a sunflower box under a sky lid, a tomato label
  archive: (icon, P) => [
    P.felt('c2', P.rr(4, 7.5, 20, 21, [0, 0, 2.5, 2.5]), { part: 'K' }),
    P.felt('c3', P.rr(2.5, 3.25, 21.5, 8.75, 2.25), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
    P.felt('c1', P.pill(9, 11.25, 15, 14.25), { part: 'K', ...SOFT }),
  ],
  'arrow-down-left': (icon, P) => arrow1(P, 18.5, 5.5, 4.5, 19.5, DIAG),
  'arrow-down-right': (icon, P) => arrow1(P, 5.5, 5.5, 19.5, 19.5, DIAG),
  'arrow-down': (icon, P) => arrow1(P, 12, 3.25, 12, 20.75, ARROW),
  'arrow-left-right': (icon, P) => arrow2(P, 2.25, 12, 21.75, 12),
  'arrow-left': (icon, P) => arrow1(P, 20.25, 12, 3.25, 12, ARROW),
  'arrow-up-down': (icon, P) => arrow2(P, 12, 2.25, 12, 21.75),
  'arrow-up-left': (icon, P) => arrow1(P, 18.5, 18.5, 4.5, 4.5, DIAG),
  'arrow-up-right': (icon, P) => arrow1(P, 5.5, 18.5, 19.5, 4.5, DIAG),
  'arrow-up': (icon, P) => arrow1(P, 12, 20.75, 12, 3.25, ARROW),
  // three thin sky orbits sewn as one piece, a tomato button nucleus, sunflower electrons
  atom: (icon, P) => [
    P.felt('c3', P.unite(
      P.bar(ellPts(12, 12, 10, 3.9, 0), 1.9, true),
      P.bar(ellPts(12, 12, 10, 3.9, 60), 1.9, true),
      P.bar(ellPts(12, 12, 10, 3.9, 120), 1.9, true),
    ), { part: 'K', stitch: false, out: 0.5, pinch: false, hi: false }),
    ...P.button(12, 12, 2.6, 'c1', { part: 'A' }),
    P.knot(21.4, 12.6, 1.05, 'c2', { part: 'deco' }), P.knot(6.3, 3.6, 1.05, 'c2', { part: 'deco' }),
  ],
  // a xylophone of toy-box bars
  'audio-lines': (icon, P) => [
    P.felt('c3', P.pill(2.6, 9.25, 5.4, 14.75), { part: 'A', stitch: false }),
    P.felt('c4', P.pill(6.6, 5.75, 9.4, 18.25), { part: 'K' }),
    P.felt('c1', P.pill(10.5, 2.5, 13.5, 21.5), { part: 'K' }),
    P.felt('c2', P.pill(14.6, 6.75, 17.4, 17.25), { part: 'K' }),
    P.felt('c3', P.pill(18.6, 9.25, 21.4, 14.75), { part: 'A', stitch: false }),
  ],
  // the mint rosette badge with a sewn-on cream percent: a fat tube slash and two knots
  'badge-percent': (icon, P) => [
    { ...P.auto()[0], pinch: false },
    P.felt('tint', P.unite(P.seg(15, 9, 9, 15, 2.6), P.circle(9.1, 9.1, 1.6), P.circle(14.9, 14.9, 1.6)), { part: 'A', ...SOFT, out: 0.5 }),
  ],
  // a sunflower rosette on sky ribbon tails, a tomato star at its heart
  award: (icon, P) => [
    P.felt('c3', P.poly([[7.75, 12.5], [11.5, 13.5], [10.5, 21.75], [8.25, 19.75], [5.5, 20.75]], [0.6, 0.6, 0.8, 0.8, 0.8]), { part: 'A', stitch: false }),
    P.felt('c3', P.poly([[16.25, 12.5], [12.5, 13.5], [13.5, 21.75], [15.75, 19.75], [18.5, 20.75]], [0.6, 0.6, 0.8, 0.8, 0.8]), { part: 'A', stitch: false }),
    P.felt('c2', P.circle(12, 9.25, 6.75), { part: 'K' }),
    P.felt('c1', P.poly(P.starPts(12, 9.4, 3.6, 1.75, 5), [0.6, 0.4]), { part: 'K', ...SOFT }),
  ],
  // a tomato backpack, sky carry loop, a sunflower front pocket with a button
  backpack: (icon, P) => [
    P.tube('c3', P.arcPts(12, 5.75, 2.75, 180, 360), 1.8, { part: 'A', ...SOFT }),
    P.felt('c1', P.rr(4.25, 5, 19.75, 21.25, [6, 6, 2.75, 2.75]), { part: 'K' }),
    P.felt('c2', P.rr(7.25, 13, 16.75, 21.25, [2, 2, 2.25, 2.25]), { part: 'K', stitch: false }),
    P.felt('c3', P.rr(7.25, 13, 16.75, 15.75, [2, 2, 0.5, 0.5]), { part: 'A', ...SOFT }),
    P.knot(12, 15.4, 0.8, 'ink', { part: 'A' }),
  ],
  // a tomato balloon with a shine glint, tied knot and a sky string
  balloon: (icon, P) => [
    P.tube('c3', P.linesOf('M12 17.5 C10.5 19 13.5 20 12 22')[0], 1.3, { part: 'A', stitch: false, out: 0.45 }),
    P.felt('c1', P.poly([[12, 16.25], [13.4, 18.25], [10.6, 18.25]], 0.5), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c1', P.ellipse(12, 9.5, 6.75, 7.5), { part: 'K' }),
    P.thread(P.arcPts(12, 9.5, 4.5, 200, 250, 10), { w: 1.15, role: 'shine', op: 0.9, part: 'A' }),
  ],
  // a tomato ring with its bar (A) sewn in behind a hidden seam: reads as one stuffed piece
  ban: (icon, P) => {
    const bar = P.clip(P.seg(5.6, 5.6, 18.4, 18.4, 3.1), P.circle(12, 12, 7.6))
    return [
      P.flat('ink', P.grow(bar, 0.62), { part: 'A' }),
      P.felt('c1', P.ring(12, 12, 9.75, 6.5), { part: 'K', seam: [P.arcPts(12, 12, 8.15, 0, 360, 6)] }),
      P.felt('c1', bar, { part: 'A', line: false, stitch: false, pinch: false }),
    ]
  },
  // a mint banknote, a sunflower coin button, two knot dots
  banknote: (icon, P) => [
    P.felt('c4', P.rr(1.75, 5.5, 22.25, 18.5, 2.5), { part: 'K' }),
    ...P.button(12, 12, 3.25, 'c2', { part: 'A' }),
    P.knot(5.75, 12, 0.9, 'tint', { part: 'K' }), P.knot(18.25, 12, 0.9, 'tint', { part: 'K' }),
  ],
  // a cream price label with embroidered bars, a sunflower tag in its seam
  barcode: (icon, P) => [
    P.felt('tint', P.rr(2.25, 4.75, 21.75, 19.25, 2.5), { part: 'K', inset: 0.75 }),
    P.flat('ink', P.unite(P.rr(5.5, 7.75, 6.75, 16.25, 0.5), P.rr(8.25, 7.75, 10.5, 16.25, 0.5), P.rr(12, 7.75, 12.9, 16.25, 0.45), P.rr(14.25, 7.75, 16.75, 16.25, 0.5), P.rr(17.75, 7.75, 18.75, 16.25, 0.45)), { part: 'K', op: 0.85 }),
  ],
  // a sky tub on a cream rim, sunflower tap and feet, cream bubbles
  bath: (icon, P) => [
    P.tube('c2', [[5.5, 11], [5.5, 4.75], [8.75, 4.75], [8.75, 6.5]], 2, { part: 'A', ...SOFT }),
    P.tube('c2', [[6.5, 18.5], [5.75, 21]], 1.9, { part: 'K', ...SOFT }),
    P.tube('c2', [[17.5, 18.5], [18.25, 21]], 1.9, { part: 'K', ...SOFT }),
    P.felt('c3', P.rr(3, 10.75, 21, 19.5, [0.5, 0.5, 5.5, 5.5]), { part: 'K' }),
    P.felt('tint', P.pill(1.75, 9.75, 22.25, 12.75), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    P.felt('tint', P.circle(14.75, 6.5, 1.8), { ...DECO }),
    P.felt('tint', P.circle(18.5, 4.75, 1.25), { ...DECO }),
  ],
  // ---------------------------------------------------------------- b
  // a sky at-sign tube with a tomato inner ring
  'at-sign': (icon, P) => [
    P.felt('c3', P.stroke('M16 8 V13.5 A2.75 2.75 0 0 0 21.5 13.5 V12 A9.5 9.5 0 1 0 16.46 20.39', 2.9), { part: 'K', pinch: false, seam: P.linesOf('M16 8.5 V13.5 A2.75 2.75 0 0 0 21.5 13.5 V12 A9.5 9.5 0 1 0 16.46 20.39') }),
    P.felt('c1', P.ring(12, 12, 5.1, 2.75), { part: 'K', stitch: false, pinch: false }),
  ],
  // the battery family: a sky shell, a cream window, mint (or tomato) cells sewn in
  battery: (icon, P) => [...batteryShell(P), cell(P, 'c4', 4.75, 8.5), cell(P, 'c4', 9, 12.75)],
  'battery-low': (icon, P) => [...batteryShell(P), cell(P, 'c1', 4.75, 8.5)],
  'battery-charging': (icon, P) => [
    ...batteryShell(P), cell(P, 'c4', 4.75, 8.25), cell(P, 'c4', 14.5, 16.25),
    P.moat(bolt(P), 0.9),
    P.felt('c2', bolt(P), { part: 'S', stitch: false }),
  ],
  // a tomato headboard and leg, a sky quilted mattress, a cream pillow
  bed: (icon, P) => [
    P.felt('c1', P.rr(1.75, 3.75, 5.75, 21, [2, 2, 0.9, 0.9]), { part: 'K' }),
    P.felt('c1', P.rr(18.75, 10.25, 22.25, 21, [1.75, 1.75, 0.9, 0.9]), { part: 'K', stitch: false }),
    P.felt('c3', P.rr(4.5, 12.5, 20, 17.75, 1.4), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(5.5, 8.5, 11, 12.75, 2), { part: 'A', stitch: false }),
    P.felt('c4', P.rr(10.25, 11.25, 20, 16, [1.75, 0.6, 0.6, 1.2]), { part: 'K', stitch: 'seam', seam: [[[11.75, 13.6], [18.75, 13.6]]] }),
  ],
  // a sunflower mug with a cream foam cloud, an embroidered rib pair, a handle behind
  beer: (icon, P) => [
    P.tube('c2', [[15.5, 12], [18.75, 12], [18.75, 17.5], [15.5, 17.5]], 2.3, { part: 'A', stitch: false }),
    P.felt('c2', P.rr(4, 8.5, 16.25, 21.5, [0.5, 0.5, 2.5, 2.5]), { part: 'K' }),
    P.thread([[[8.25, 13], [8.25, 18]], [[12, 13], [12, 18]]], { w: 1.1, op: 0.75, part: 'K' }),
    P.felt('tint', P.fillet(P.unite(P.circle(5.75, 8.25, 2.6), P.circle(9.25, 6, 3), P.circle(13, 6.25, 2.7), P.circle(15.25, 8.5, 2.2), P.pill(3.4, 7.5, 17.25, 11)), 0.8), { part: 'A', stitch: false }),
  ],
  'bell-off': (icon, P) => [...EXEMPLAR.bell(icon, P), ...P.slash({ from: [3.75, 3.5], to: [20.25, 20.5], w: 2.6 })],
  'bell-ring': (icon, P) => [
    ...EXEMPLAR.bell(icon, P),
    P.arcTube('tint', 12, 11, 10, 200, 240, 1.8, { ...SOFT, part: 'S' }),
    P.arcTube('tint', 12, 11, 10, -60, -20, 1.8, { ...SOFT, part: 'S' }),
  ],
  // sky wheels with sunflower hub knots, a tomato frame, a sunflower saddle
  bike: (icon, P) => [
    P.felt('c3', P.ring(5.5, 16.25, 3.9, 1.9), { part: 'A', stitch: false }),
    P.felt('c3', P.ring(18.5, 16.25, 3.9, 1.9), { part: 'A', stitch: false }),
    P.felt('c1', P.unite(P.bar([[5.5, 16.25], [9, 10], [15, 10], [18.5, 16.25]], 2), P.bar([[9, 10], [12, 16.25], [15, 10]], 2), P.seg(12, 16.25, 5.5, 16.25, 2), P.bar([[15, 10], [13.75, 5.75], [16.25, 5.75]], 2), P.seg(9, 10, 8.5, 7.25, 2)), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c2', P.pill(6.25, 5.75, 10.75, 8), { part: 'K', ...SOFT }),
    P.knot(5.5, 16.25, 0.9, 'c2', { part: 'A' }), P.knot(18.5, 16.25, 0.9, 'c2', { part: 'A' }),
  ],
  // sky barrels on a tomato bridge, sunflower lenses with a glint
  binoculars: (icon, P) => {
    const barrel = x => P.fillet(P.unite(P.poly([[x - 3.6, 17], [x - 2, 5.25], [x + 2, 5.25], [x + 3.6, 17]], [0.5, 1.2, 1.2, 0.5]), P.circle(x, 17, 3.9)), 0.8)
    return [
      P.felt('c1', P.pill(7.5, 9.25, 16.5, 13), { part: 'A', stitch: false }),
      P.felt('c3', barrel(6), { part: 'K' }), P.felt('c3', barrel(18), { part: 'K' }),
      P.felt('c2', P.circle(6, 17, 2.7), { part: 'K', ...SOFT }), P.felt('c2', P.circle(18, 17, 2.7), { part: 'K', ...SOFT }),
      P.knot(5.4, 16.3, 0.55, 'shine', { part: 'K', op: 0.9 }), P.knot(17.4, 16.3, 0.55, 'shine', { part: 'K', op: 0.9 }),
    ]
  },
  // a sky songbird, a mint wing, a sunflower beak and tomato legs
  bird: (icon, P) => [
    P.tube('c1', [[10, 17], [10, 21]], 1.5, { part: 'K', ...SOFT }),
    P.tube('c1', [[13.5, 16.5], [13.5, 21]], 1.5, { part: 'K', ...SOFT }),
    P.felt('c2', P.poly([[18.25, 6.5], [22, 8], [18.25, 9.5]], 0.6), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c3', P.round(P.path('M19 8 C19 13.5 15.5 18 10.5 18 C7.75 18 5.75 16.75 4.75 14.5 L2.5 9.5 L7.25 11.25 C8.75 10.25 10.25 9.5 12 9 C12 6.5 13.5 4.5 15.5 4.5 C17.4 4.5 19 6 19 8 Z'), 0.7), { part: 'K' }),
    P.felt('c4', P.rot(P.ellipse(11.5, 12.75, 4, 2.3), 18, 11.5, 12.75), { part: 'A', ...SOFT }),
    P.knot(15.75, 7.4, 0.8, 'ink', { part: 'K' }),
  ],
  // a sky pebble with the rune sewn on in cream
  bluetooth: (icon, P) => [
    P.felt('c3', P.rr(4.75, 1.75, 19.25, 22.25, 7), { part: 'K', stitch: false }),
    P.felt('tint', P.unite(P.bar([[7.75, 8.25], [16, 15.75], [12, 19.5], [12, 4.5], [16, 8.25], [7.75, 15.75]], 1.9)), { part: 'A', ...SOFT }),
  ],
  // an open cream book on a tomato cover, a seam down the spine
  'book-open': (icon, P) => {
    const left = P.round(P.path('M12 7 C10.5 5.5 8 4.5 4.5 4.5 A1.5 1.5 0 0 0 3 6 V16.5 A1.5 1.5 0 0 0 4.5 18 C8 18 10.5 19 12 20.5 Z'), 0.5)
    return [
      P.felt('c1', P.round(P.path('M12 9 C14 7.5 17 7 21.5 7 L22.5 7.5 V19 C17 19 14.5 20 12 21.5 C9.5 20 7 19 1.5 19 V7.5 L2.5 7 C7 7 10 7.5 12 9 Z'), 1), { part: 'K', stitch: false }),
      P.felt('tint', left, { part: 'K', inset: 0.85 }),
      P.felt('tint', P.flipX(left), { part: 'K', inset: 0.85 }),
      P.thread([[[6, 9.5], [9.5, 10.5]], [[6, 12.75], [9.5, 13.75]], [[18, 9.5], [14.5, 10.5]], [[18, 12.75], [14.5, 13.75]]], { w: 0.9, op: 0.55, part: 'K' }),
      P.felt('c2', P.poly([[11.1, 7.75], [12.9, 7.75], [12.9, 22], [12, 21], [11.1, 22]], 0.35), { part: 'A', ...SOFT, out: 0.45 }),
    ]
  },
  // a tomato storybook, a cream page block, a sunflower label
  book: (icon, P) => [
    P.felt('c1', P.rr(4.25, 2.5, 19.75, 21.5, [2.5, 1.75, 1.75, 2.5]), { part: 'K' }),
    P.felt('tint', P.rr(6.5, 16.5, 19.75, 21.5, [2.5, 0.5, 1.75, 2.5]), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c2', P.rr(9, 6.25, 16.25, 10.75, 1.2), { part: 'K', ...SOFT }),
  ],
  // a tomato ribbon bookmark with a little heart
  bookmark: (icon, P) => [
    P.felt('c1', bookmarkF(P), { part: 'K' }),
    P.felt('accent', P.heart(12, 9.5, 0.33), { part: 'A', ...SOFT }),
  ],
  'bookmark-plus': (icon, P) => [
    P.felt('c1', bookmarkF(P), { part: 'K' }),
    P.felt('tint', P.unite(P.pill(10.85, 6.25, 13.15, 13.25), P.pill(8.5, 8.6, 15.5, 10.9)), { part: 'A', ...SOFT }),
  ],
  // a sky robot pillow: sunflower ears and antenna, a cream visor with knot eyes and a smile
  bot: (icon, P) => [
    P.tube('c2', [[12, 8], [12, 4.5]], 1.8, { part: 'A', ...SOFT }),
    P.felt('c1', P.circle(12, 3.6, 1.7), { part: 'A', ...SOFT }),
    P.felt('c2', P.unite(P.pill(1.75, 11.5, 5.5, 17), P.pill(18.5, 11.5, 22.25, 17)), { part: 'A', ...SOFT }),
    P.felt('c3', P.rr(4.25, 7.25, 19.75, 21, 3.75), { part: 'K' }),
    P.felt('tint', P.rr(7, 10.75, 17, 17.25, 2.6), { part: 'K', stitch: false, out: 0.45, shade: false }),
    ...P.smile(12, 14.6, 2.6, { part: 'K', eye: 0.8 }),
  ],
  // a pink brain cushion with embroidered folds and a centre seam
  brain: (icon, P) => [
    P.felt('accent', P.path('M12 5.5 A3 3 0 0 0 6.5 6 A3.5 3.5 0 0 0 3.5 12 A3.5 3.5 0 0 0 6 18 A3.25 3.25 0 0 0 12 19 A3.25 3.25 0 0 0 18 18 A3.5 3.5 0 0 0 20.5 12 A3.5 3.5 0 0 0 17.5 6 A3 3 0 0 0 12 5.5 Z'), { part: 'K', stitch: false }),
    P.thread([[[12, 6.75], [12, 18]]], { w: 1.1, op: 0.8, part: 'A' }),
    P.thread('M6.5 6.75 C7.5 7.5 8 8.25 8 9.5 M4.25 12 C5.75 12 7 12.75 7.5 14.25 M17.5 6.75 C16.5 7.5 16 8.25 16 9.5 M19.75 12 C18.25 12 17 12.75 16.5 14.25', { w: 1.05, op: 0.8, part: 'A' }),
  ],
  // a tomato briefcase on a sky handle, a sunflower clasp
  briefcase: (icon, P) => [
    ...caseBody(P),
    P.felt('c2', P.rr(10, 10.75, 14, 14.75, 1.1), { part: 'A', ...SOFT }),
    P.knot(12, 12.75, 0.55, 'ink', { part: 'A' }),
  ],
  'briefcase-medical': (icon, P) => [
    ...caseBody(P),
    P.felt('tint', P.unite(P.rr(10.75, 9.25, 13.25, 17.75, 0.8), P.rr(7.75, 12.25, 16.25, 14.75, 0.8)), { part: 'S', ...SOFT }),
  ],
  // a ladybird: tomato shell with knot spots and a centre seam, a sky head and legs
  bug: (icon, P) => [
    P.felt('c3', P.unite(
      P.bar([[7.5, 11.75], [3.75, 10]], 1.5), P.bar([[7, 15.5], [3.25, 15.5]], 1.5), P.bar([[8.5, 18.75], [5.5, 21]], 1.5),
      P.bar([[16.5, 11.75], [20.25, 10]], 1.5), P.bar([[17, 15.5], [20.75, 15.5]], 1.5), P.bar([[15.5, 18.75], [18.5, 21]], 1.5),
      P.bar([[10.75, 6.5], [8.75, 3.5]], 1.5), P.bar([[13.25, 6.5], [15.25, 3.5]], 1.5)), { part: 'A', stitch: false, out: 0.45 }),
    P.felt('c3', P.circle(12, 8.5, 3.4), { part: 'K', stitch: false }),
    P.felt('c1', P.rr(6.5, 9, 17.5, 21, [3, 3, 5.5, 5.5]), { part: 'K', seam: [[[12, 10], [12, 20]]] }),
    P.knot(9.25, 13, 1, 'ink', { part: 'K' }), P.knot(14.75, 13, 1, 'ink', { part: 'K' }), P.knot(9.75, 17.25, 0.85, 'ink', { part: 'K' }), P.knot(14.25, 17.25, 0.85, 'ink', { part: 'K' }),
  ],
  // a sky tower with cream windows and a sunflower door with a knot knob
  building: (icon, P) => {
    const win = []
    for (const y of [6, 9.5, 13]) for (const x of [8.25, 12, 15.75]) win.push(P.rr(x - 0.95, y - 0.95, x + 0.95, y + 0.95, 0.5))
    return [
      P.felt('c3', P.rr(4.75, 2.5, 19.25, 21.25, [2.25, 2.25, 0.75, 0.75]), { part: 'K' }),
      P.flat('tint', P.unite(win), { part: 'K', op: 0.95 }),
      P.felt('c2', P.rr(9.75, 16, 14.25, 21.25, [1.75, 1.75, 0, 0]), { part: 'A', stitch: false }),
      P.knot(13.1, 18.75, 0.5, 'ink', { part: 'A' }),
    ]
  },
  // a stacked burger: sunflower buns, a tomato patty, a mint lettuce frill, sesame knots
  burger: (icon, P) => [
    P.felt('c2', P.rr(3, 16, 21, 20.75, [1, 1, 2.4, 2.4]), { part: 'K', stitch: false }),
    P.felt('c1', P.pill(2.25, 12.75, 21.75, 17), { part: 'K', stitch: false }),
    P.felt('c4', P.fillet(P.unite(P.pill(2.5, 11, 21.5, 13.5), ...[5, 9, 13, 17].map(x => P.circle(x + 1, 13.5, 1.2))), 0.4), { part: 'A', stitch: false, out: 0.45 }),
    P.felt('c2', P.unite(P.clip(P.ellipse(12, 11.25, 9, 7.75), P.rect(0, 0, 24, 11.25)), P.rr(3, 9, 21, 11.75, 1.25)), { part: 'K' }),
    P.knot(8.5, 7, 0.55, 'tint', { part: 'K' }), P.knot(12, 5.75, 0.55, 'tint', { part: 'K' }), P.knot(15.5, 7, 0.55, 'tint', { part: 'K' }),
  ],
  // a sunflower bus with a sky windscreen, tomato bumper, cream headlight knots
  bus: (icon, P) => [
    P.tube('c3', [[7.5, 19], [7.5, 21.25]], 2.4, { part: 'K', ...SOFT }),
    P.tube('c3', [[16.5, 19], [16.5, 21.25]], 2.4, { part: 'K', ...SOFT }),
    P.felt('c2', P.rr(4, 2.25, 20, 20, 3.25), { part: 'K' }),
    P.felt('c3', P.rr(6.5, 5.5, 17.5, 11.75, 1.5), { part: 'K', stitch: false, out: 0.45 }),
    P.felt('c1', P.rr(4, 14.25, 20, 16.5, 0.6), { part: 'A', ...SOFT, line: false, shade: false }),
    P.knot(7.5, 18, 0.9, 'tint', { part: 'K' }), P.knot(16.5, 18, 0.9, 'tint', { part: 'K' }),
  ],
  // bubblegum wings with sunflower spots, a sky body and antennae
  butterfly: (icon, P) => {
    const wing = P.round(P.path('M12 10 C10.25 8.25 8.5 3.75 5 3.5 C3 3.5 2.5 5.25 2.5 7.5 C2.75 10 5.25 12 8.5 12.5 C5.75 13.5 4.5 15.5 4.5 17.5 C4.5 19.5 6.5 20.5 8.5 20 C10.25 19.25 11.5 16.75 12 14.5 Z'), 0.6)
    return [
      P.felt('c3', P.unite(P.bar([[12, 8], [10.5, 4]], 1.4), P.bar([[12, 8], [13.5, 4]], 1.4)), { part: 'K', stitch: false, out: 0.45 }),
      P.felt('accent', wing, { part: 'A', pinch: false }),
      P.felt('accent', P.flipX(wing), { part: 'A', pinch: false }),
      P.felt('c2', P.unite(P.circle(6.25, 7.5, 1.7), P.circle(17.75, 7.5, 1.7)), { part: 'A', ...SOFT, pinch: false }),
      P.felt('c3', P.pill(10.6, 7, 13.4, 20), { part: 'K', stitch: false, pinch: false }),
    ]
  },
  // a cream cake under bubblegum icing drips, a sky candle with a sunflower flame, a sky plate
  cake: (icon, P) => [
    P.felt('c3', P.pill(2.25, 18.75, 21.75, 21.5), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(4.25, 10.5, 19.75, 20, [2, 2, 0.75, 0.75]), { part: 'K', stitch: false }),
    P.felt('accent', P.fillet(P.unite(P.rr(4.25, 10, 19.75, 13.25, [2, 2, 0, 0]), P.circle(7, 13.75, 1.4), P.circle(11, 14.25, 1.4), P.circle(15, 13.75, 1.4), P.circle(18.25, 13.5, 1.3)), 0.5), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c3', P.pill(10.9, 5.75, 13.1, 10.5), { part: 'A', ...SOFT }),
    P.felt('c2', P.drop(12, 3.9, 1.35, 12, 0.9, 0.3), { part: 'deco', ...SOFT }),
    P.knot(8, 17.25, 0.6, 'c1', { part: 'K' }), P.knot(12, 17.5, 0.6, 'c4', { part: 'K' }), P.knot(16, 17.25, 0.6, 'c3', { part: 'K' }),
  ],
  // a sky calculator, a cream display, knot buttons with one tomato equals
  calculator: (icon, P) => {
    const k = []
    for (const y of [12.25, 15.25, 18.25]) for (const x of [8.5, 12, 15.5]) if (!(x === 15.5 && y === 18.25)) k.push(P.knot(x, y, 0.95, 'tint', { part: 'K' }))
    return [
      P.felt('c3', P.rr(4.25, 2.25, 19.75, 21.75, 3), { part: 'K', stitch: false }),
      P.felt('tint', P.rr(6.75, 4.75, 17.25, 9.25, 1.25), { part: 'K', stitch: false, out: 0.45, shade: false }),
      P.thread([[[12.5, 7], [15.25, 7]]], { w: 1, op: 0.7, part: 'K' }),
      ...k,
      P.knot(15.5, 18.25, 1.1, 'c1', { part: 'A' }),
    ]
  },
  'calendar-check': (icon, P) => [...P.calendar('tint', 'c1', 'c3'), P.tube('c4', [[8.25, 15.25], [11, 17.75], [16, 12.5]], 2.5, { part: 'S', stitch: false })],
  'calendar-days': (icon, P) => {
    const k = []
    for (const y of [13.25, 17.25]) for (const x of [7.75, 12, 16.25]) k.push(P.knot(x, y, 0.8, 'ink', { part: 'K' }))
    return [...P.calendar('tint', 'c1', 'c3'), ...k]
  },
  'calendar-plus': (icon, P) => [...P.calendar('tint', 'c1', 'c3'), P.felt('c4', P.unite(P.pill(10.85, 11.25, 13.15, 18.75), P.pill(8.25, 13.85, 15.75, 16.15)), { part: 'S', ...SOFT })],
  'camera-off': (icon, P) => [...EXEMPLAR.camera(icon, P), ...P.slash({ from: [3.25, 3.25], to: [20.75, 20.75], w: 2.6 })],
  // a sky screen with cream subtitle pills sewn on
  captions: (icon, P) => [
    P.felt('c3', P.rr(1.75, 4.25, 22.25, 19.75, 3), { part: 'K' }),
    P.felt('tint', P.unite(P.pill(5.25, 9.5, 9.75, 12), P.pill(11.25, 9.5, 18.75, 12), P.pill(5.25, 13.75, 13.75, 16.25), P.pill(15.25, 13.75, 18.75, 16.25)), { part: 'A', ...SOFT }),
  ],
  // a tomato toy car, cream windows, sky wheels with knot hubs
  car: (icon, P) => [
    P.felt('c1', P.fillet(P.unite(P.rr(1.75, 10.5, 22.25, 17.75, 3), P.poly([[5.5, 11], [8.25, 5.25], [15.75, 5.25], [18.5, 11]], [0.5, 1.4, 1.4, 0.5])), 1), { part: 'K' }),
    P.felt('tint', P.poly([[8, 10.5], [9.6, 7.25], [11.4, 7.25], [11.4, 10.5]], 0.5), { part: 'K', stitch: false, out: 0.4, shade: false }),
    P.felt('tint', P.poly([[12.6, 10.5], [12.6, 7.25], [14.4, 7.25], [16, 10.5]], 0.5), { part: 'K', stitch: false, out: 0.4, shade: false }),
    P.felt('c3', P.circle(6.75, 17.75, 2.6), { part: 'A', stitch: false }), P.felt('c3', P.circle(17.25, 17.75, 2.6), { part: 'A', stitch: false }),
    P.knot(6.75, 17.75, 0.85, 'tint', { part: 'A' }), P.knot(17.25, 17.75, 0.85, 'tint', { part: 'A' }),
  ],
  // a sky screen; two slim tomato waves and a knot sewn into the cream screen's lower left
  cast: (icon, P) => [
    P.felt('c3', P.rr(2, 3.75, 22, 20.25, 2.5), { part: 'K', stitch: false }),
    P.felt('tint', P.rr(4.5, 6.25, 19.5, 17.75, 1.25), { part: 'K', stitch: false, out: 0.4, shade: false }),
    P.felt('c1', P.circle(6.4, 15.6, 1.25), { part: 'A', ...SOFT, out: 0.45 }),
    P.arcTube('c1', 5.9, 16.1, 4.2, -86, -4, 2, { part: 'A', ...SOFT, out: 0.45 }),
    P.arcTube('c1', 5.9, 16.1, 7.4, -86, -4, 2, { part: 'A', ...SOFT, out: 0.45 }),
  ],
  // a sunflower cat pillow: bubblegum inner ears, knot eyes, a heart nose and an embroidered smile
  cat: (icon, P) => [
    P.felt('c2', P.round(P.path('M12 20.5 C7 20.5 3.5 18 3.5 13.75 C3.5 11.75 3.9 10.25 4.5 9 V4 L9.5 6.5 C10.25 6.25 11.25 6 12 6 C12.75 6 13.75 6.25 14.5 6.5 L19.5 4 V9 C20.1 10.25 20.5 11.75 20.5 13.75 C20.5 18 17 20.5 12 20.5 Z'), 1.1), { part: 'K' }),
    P.felt('accent', P.poly([[6.25, 6.75], [8.75, 8], [6.25, 9.75]], 0.6), { part: 'K', stitch: false, out: 0.35, shade: false, hi: false }),
    P.felt('accent', P.poly([[17.75, 6.75], [15.25, 8], [17.75, 9.75]], 0.6), { part: 'K', stitch: false, out: 0.35, shade: false, hi: false }),
    P.knot(8.75, 12.75, 0.95, 'ink', { part: 'A' }), P.knot(15.25, 12.75, 0.95, 'ink', { part: 'A' }),
    P.felt('accent', P.heart(12, 15.2, 0.17), { part: 'A', stitch: false, out: 0.35 }),
    P.thread([[[10, 17], [11, 17.6], [12, 16.9], [13, 17.6], [14, 17]]], { w: 0.8, part: 'A' }),
  ],
  // sky axes, a mint felt mountain range
  'chart-area': (icon, P) => [
    P.felt('c4', P.poly([[6.5, 18.25], [6.5, 12.5], [10.25, 8.5], [14, 12.25], [19.5, 6], [19.5, 18.25]], [0.6, 1, 1.2, 0.8, 1.2, 0.6]), { part: 'A' }),
    P.tube('c3', [[3, 3.25], [3, 21], [21, 21]], 2.6, { part: 'K', stitch: false }),
  ],
  // three toy-box bars on a mint base
  'chart-bar': (icon, P) => [
    P.felt('c3', P.rr(3.75, 10.5, 8.25, 20, [2, 2, 0, 0]), { part: 'A', stitch: false }),
    P.felt('c1', P.rr(9.75, 3.5, 14.25, 20, [2, 2, 0, 0]), { part: 'A' }),
    P.felt('c2', P.rr(15.75, 7.5, 20.25, 20, [2, 2, 0, 0]), { part: 'A' }),
    P.felt('c4', P.pill(2, 18.75, 22, 21.75), { part: 'K', stitch: false }),
  ],
  // sky axes, a tomato trend tube with sunflower knot nodes
  'chart-line': (icon, P) => [
    P.tube('c3', [[3, 3.25], [3, 21], [21, 21]], 2.6, { part: 'K', stitch: false }),
    P.tube('c1', [[7, 16], [11, 11], [14.25, 14], [20, 7]], 2.6, { part: 'A', stitch: false }),
    P.felt('c2', P.unite(P.circle(11, 11, 1.5), P.circle(14.25, 14, 1.5)), { part: 'A', ...SOFT }),
  ],
  // a sky pie with a tomato slice pulled out
  'chart-pie': (icon, P) => [
    P.felt('c3', P.round(P.sector(11, 13, 9, 0, 270), 1.1), { part: 'K' }),
    P.felt('c1', P.round(P.sector(13.25, 10.75, 8.5, 270, 360), 1), { part: 'A' }),
  ],
  'check-check': (icon, P) => [
    P.tube('c3', [[1.75, 12.75], [6, 17], [14.25, 7.75]], 3, { part: 'K' }),
    P.moat(P.bar([[9.25, 15.25], [11, 17], [21.75, 6.5]], 3), 0.9),
    P.tube('c4', [[9.25, 15.25], [11, 17], [21.75, 6.5]], 3, { part: 'A' }),
  ],
  'check-circle': (icon, P) => [
    P.felt('c4', P.circle(12, 12, 9.75), { part: 'K' }),
    P.tube('tint', [[7.5, 12.5], [10.75, 15.75], [16.5, 9]], 2.6, { part: 'A', ...SOFT }),
  ],
  'check-square': (icon, P) => [
    P.felt('c4', P.rr(2.75, 2.75, 21.25, 21.25, 3.5), { part: 'K' }),
    P.tube('tint', [[7.5, 12.5], [10.75, 15.75], [16.5, 9]], 2.6, { part: 'A', ...SOFT }),
  ],
  // a puffy cream chef's hat with a tomato band and embroidered pleats
  'chef-hat': (icon, P) => [
    P.felt('tint', P.fillet(P.unite(P.circle(8, 10, 3.9), P.circle(12, 7.25, 4.25), P.circle(16, 10, 3.9), P.rr(6.5, 10, 17.5, 17.5, 1)), 1), { part: 'K' }),
    P.thread([[[10, 12.75], [10, 15.75]], [[14, 12.75], [14, 15.75]]], { w: 0.9, op: 0.55, part: 'K' }),
    P.felt('c1', P.rr(6.25, 16.75, 17.75, 21, [0.6, 0.6, 2, 2]), { part: 'A', stitchMin: 1.1, inset: 0.65 }),
  ],
  // ---------------------------------------------------------------- chevrons (tomato tubes; doubles lead tomato, trail sunflower)
  'chevron-down': (icon, P) => [chev(P, 12, 16.25, 90, 9.5)],
  'chevron-up': (icon, P) => [chev(P, 12, 7.75, -90, 9.5)],
  'chevron-left': (icon, P) => [chev(P, 7.75, 12, 180, 9.5)],
  'chevron-right': (icon, P) => [chev(P, 16.25, 12, 0, 9.5)],
  'chevron-first': (icon, P) => [P.tube('c3', [[5.5, 5.5], [5.5, 18.5]], 3, { part: 'A' }), chev(P, 10.25, 12, 180, 9)],
  'chevron-last': (icon, P) => [P.tube('c3', [[18.5, 5.5], [18.5, 18.5]], 3, { part: 'A' }), chev(P, 13.75, 12, 0, 9)],
  'chevrons-down': (icon, P) => [chev(P, 12, 12, 90, 8.5, { role: 'c2', part: 'A' }), chev(P, 12, 19.25, 90, 8.5)],
  'chevrons-up': (icon, P) => [chev(P, 12, 12, -90, 8.5, { role: 'c2', part: 'A' }), chev(P, 12, 4.75, -90, 8.5)],
  'chevrons-left': (icon, P) => [chev(P, 12, 12, 180, 8.5, { role: 'c2', part: 'A' }), chev(P, 4.75, 12, 180, 8.5)],
  'chevrons-right': (icon, P) => [chev(P, 12, 12, 0, 8.5, { role: 'c2', part: 'A' }), chev(P, 19.25, 12, 0, 8.5)],
  'chevrons-up-down': (icon, P) => [chev(P, 12, 3.5, -90, 7, { w: 3.1 }), chev(P, 12, 20.5, 90, 7, { w: 3.1 })],
  // a tomato button with a cream arrow sewn on
  'circle-arrow-down': (icon, P) => [
    P.felt('c1', P.circle(12, 12, 9.75), { part: 'K' }),
    P.arrow(12, 6, 12, 17.5, { len: 5.25, half: 4.5, w: 2.5, r: 1, rb: 0.6, role: 'tint', part: 'A', stitch: false, out: 0.5 }),
  ],
  // @@END
}
