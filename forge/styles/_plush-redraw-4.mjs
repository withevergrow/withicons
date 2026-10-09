// PLUSH redraws, chunk 4: hand-composed stuffed-toy icons (see forge/styles/PLUSH-GUIDE.md).
// Each entry: name -> (icon, P) => pieces, built with the frozen kit (P = prim + kit + P.auto()).
// The art director's exemplars (EXEMPLAR in _plush-render.mjs) win over any entry here.
//
// Chunk 4 = icons 301-400 alphabetically (notepad-text .. sliders). rocket, search and settings
// are exemplars and are not redefined here.
// Families set in this chunk: phones are a tomato handset (badges in sky/mint/sunflower),
// shields are a sky shield with a sewn-on emblem, media transport (play/pause/rewind/skip)
// is tomato, panels/sidebar are a cream window with a sky pane, carts are a sky basket on
// a tomato frame with sunflower wheels, curved arrows (redo/reply/rotate/repeat) are tomato.

// ---------------------------------------------------------------------------
// local helpers (the kit is frozen; everything chunk-specific lives here)

const SOFT = { stitch: false, out: 0.5 }                       // small sewn-on parts
const rad = d => d * Math.PI / 180

// a rounded arrowhead: tip at (x, y), pointing deg (0 = east, 90 = south)
function head(P, x, y, deg, len = 5.5, half = 4.75, r = 1.3) {
  const a = rad(deg), ux = Math.cos(a), uy = Math.sin(a)
  const bx = x - ux * len, by = y - uy * len
  return P.poly([[x, y], [bx - uy * half, by + ux * half], [bx + ux * 0.9, by + uy * 0.9], [bx + uy * half, by - ux * half]], [r, 0.75, 0.6, 0.75])
}
// a stuffed arrow along any polyline: shaft tube + rounded head at the last point, one panel.
// The head points along the chord of the last `len` units of the path.
function arrowGeo(P, pts, o) {
  const len = o.len ?? 6.5, half = o.half ?? 5.5, w = o.w ?? 3
  const tip = pts[pts.length - 1]
  let i = pts.length - 1, acc = 0
  while (i > 0 && acc < len * 0.9) { acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); i-- }
  const q = pts[i], L = Math.hypot(tip[0] - q[0], tip[1] - q[1]) || 1
  const ux = (tip[0] - q[0]) / L, uy = (tip[1] - q[1]) / L
  const deg = Math.atan2(uy, ux) * 180 / Math.PI
  const base = [tip[0] - ux * (len - 1.4), tip[1] - uy * (len - 1.4)]
  const shaft = [...pts.slice(0, i + 1), base]
  return { shaft, w, H: head(P, tip[0], tip[1], deg, len, half, o.r ?? 1.3), seam: [shaft.slice(0, -1).length > 1 ? shaft.slice(0, -1) : shaft] }
}
function pathArrow(P, role, pts, o = {}) {
  const g = arrowGeo(P, pts, o)
  const F = P.fillet(P.unite(P.bar(g.shaft, g.w), g.H), 0.7)
  return P.felt(role, F, { part: o.part || 'K', seam: g.seam, ...(o.felt || {}) })
}
// the same arrow as two sewn pieces: the shaft (K) and the head (A) stitched on over its end,
// so the head can nudge on its own (MOTION.md: arrow heads are A). r.F = the whole silhouette.
function splitArrow(P, role, pts, o = {}) {
  const g = arrowGeo(P, pts, o)
  const out = [P.felt(role, P.bar(g.shaft, g.w), { part: o.part || 'K', seam: g.seam }), P.felt(role, g.H, { part: o.headPart || 'A', stitch: false })]
  out.F = P.unite(P.bar(g.shaft, g.w), g.H)
  return out
}
const arcSplit = (P, role, cx, cy, r, a0, a1, o = {}) => splitArrow(P, role, P.arcPts(cx, cy, r, a0, a1, 3), o)
// an arrow along a circular arc a0 -> a1 (degrees), head at a1
const arcArrow = (P, role, cx, cy, r, a0, a1, o = {}) => pathArrow(P, role, P.arcPts(cx, cy, r, a0, a1, 3), o)

// the telephone handset (skeleton outline), puffed into a soft toy receiver
const HANDSET = 'M3 5 A2 2 0 0 1 5 3 H8 A1.5 1.5 0 0 1 9.5 4.5 V6 C9.5 7.25 8.5 7.25 8.5 8.5 A7 7 0 0 0 15.5 15.5 C16.75 15.5 16.75 14.5 18 14.5 H19.5 A1.5 1.5 0 0 1 21 16 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 Z'
const handset = P => P.felt('c1', P.round(P.grow(P.path(HANDSET), 0.35), 0.9), { part: 'K' })
// the shield outline
const SHIELD = 'M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z'
const shieldF = P => P.round(P.grow(P.path(SHIELD), 0.4), 1.2)
const shield = (P, role = 'c3') => P.felt(role, shieldF(P), { part: 'K' })
// the toy plane (plane.json airframe, nose at -45deg): one airframe for plane / landing / takeoff
const PLANE = 'M16.6 4.58 C17.83 3.34 19.18 3.27 20.13 3.87 C20.73 4.82 20.66 6.17 19.42 7.4 L15.89 10.94 L18.19 20.66 L16.95 21.9 L12.18 14.65 L8.82 18.01 L9.35 21.37 L8.82 21.9 L5.99 18.01 L2.1 15.18 L2.63 14.65 L5.99 15.18 L9.35 11.82 L2.1 7.05 L3.34 5.81 L13.06 8.11 Z'
const airframe = P => P.round(P.grow(P.path(PLANE), 0.45), 0.7)
// the same airframe turned by deg (landing nose down, takeoff nose up) over a mint runway
function flight(P, deg) {
  const k = 0.84, a = rad(deg - 45)
  const F = P.move(P.scale(P.rot(airframe(P), deg, 11.4, 12.6), k, 11.4, 12.6), 0.6, -2.8)
  const c = [12, 9.8], u = [Math.cos(a), Math.sin(a)]
  return [
    P.tube('c4', [[2.75, 21.25], [21.25, 21.25]], 2.2, { part: 'A', ...SOFT }),
    P.felt('c3', F, { part: 'K', seam: [[[c[0] + u[0] * 6.5, c[1] + u[1] * 6.5], [c[0] - u[0] * 5.5, c[1] - u[1] * 5.5]]] }),
  ]
}
// a cream window with a sky pane (panels, sidebar)
function windowPane(P, x0, y0, x1, y1) {
  const body = P.rr(3, 3, 21, 21, 2.75)
  return [P.felt('tint', body, { part: 'K', inset: 0.85 }), P.felt('c3', P.clip(body, P.rect(x0, y0, x1, y1)), { part: 'A', stitch: false, out: 0.5 })]
}
// shopping cart: sky basket, tomato frame, sunflower wheels
function cart(P, y = 0) {
  return [
    P.tube('c1', [[2.5, 3.25 + y], [4, 3.25 + y], [6.9, 15 + y], [18, 15 + y]], 2.1, { part: 'K', ...SOFT }),
    P.felt('c3', P.poly([[4.9, 5 + y], [20.75, 5 + y], [18.4, 14 + y], [7.1, 14 + y]], [1.2, 1.4, 1.2, 1]), { part: 'K' }),
    ...P.button(8.5, 19.75, 1.85, 'c2', { part: 'A', n: 4 }),
    ...P.button(17, 19.75, 1.85, 'c2', { part: 'A', n: 4 }),
  ]
}

export const R = {
  // ---------------------------------------------------------------- n, p
  // a sky notepad with sunflower spiral loops, three embroidered lines
  'notepad-text': (icon, P) => [
    P.felt('c3', P.rr(4, 4.25, 20, 21.5, 2.5), { part: 'K' }),
    P.tube('c2', [[8, 2.5], [8, 6.5]], 2, { part: 'A', ...SOFT }),
    P.tube('c2', [[12, 2.5], [12, 6.5]], 2, { part: 'A', ...SOFT }),
    P.tube('c2', [[16, 2.5], [16, 6.5]], 2, { part: 'A', ...SOFT }),
    P.textLines(8, [16, 16, 12.5], [10.5, 14, 17.5], { part: 'K' }),
  ],
  // an open box: sunflower body, tomato inside, sky flaps folded out
  'package-open': (icon, P) => [
    P.felt('c3', P.poly([[4, 10.75], [1.75, 6.5], [9.75, 2.5], [12, 6.75]], [0.9, 1, 0.9, 0.6]), { part: 'A', stitch: false }),
    P.felt('c3', P.poly([[20, 10.75], [22.25, 6.5], [14.25, 2.5], [12, 6.75]], [0.9, 1, 0.9, 0.6]), { part: 'A', stitch: false }),
    P.felt('c1', P.poly([[12, 6.75], [20, 10.75], [12, 14.75], [4, 10.75]], 1), { part: 'K', stitch: false, shade: false, hi: false }),
    P.felt('c2', P.poly([[3.75, 10.75], [12, 14.75], [20.25, 10.75], [20.25, 17.5], [12, 21.75], [3.75, 17.5]], [1, 0.5, 1, 1.6, 1.6, 1.6]), { part: 'K', seam: [[[12, 15.5], [12, 21]]] }),
  ],
  // a sky cube with a sunflower lid face, a bubblegum shipping label
  package: (icon, P) => [
    P.felt('c3', P.poly([[12, 2.5], [21, 7], [21, 17], [12, 21.5], [3, 17], [3, 7]], 1.6), { part: 'K', seam: [[[12, 12.25], [12, 20.75]]] }),
    P.felt('c2', P.poly([[12, 2.75], [20.6, 7.05], [12, 11.4], [3.4, 7.05]], 1.3), { part: 'K', stitch: false, out: 0.5 }),
    P.felt('accent', P.poly([[14.5, 13.6], [18.75, 11.5], [18.75, 14.5], [14.5, 16.6]], 0.5), { part: 'A', ...SOFT }),
  ],
  // a paintbrush: sunflower handle, sky ferrule, a tomato bristle tip
  paintbrush: (icon, P) => {
    const r = f => P.rot(f, 45, 12, 12)
    return [
      P.felt('c2', r(P.pill(10.4, 0.25, 13.6, 12)), { part: 'A', stitch: false }),
      P.felt('c3', r(P.rr(8.9, 10.75, 15.1, 14.5, 0.8)), { part: 'K', stitch: false, out: 0.5 }),
      P.felt('c1', r(P.unite(P.rr(8.9, 14, 15.1, 17, [0.4, 0.4, 2.5, 2.5]), P.drop(12, 17.5, 3, 12, 23.25, 0.5))), { part: 'K', stitch: false }),
    ]
  },
  // a sunflower painter's palette, dabs of tomato, sky and mint
  palette: (icon, P) => [
    P.felt('c2', P.round(P.grow(P.path(icon.paths[0].d), 0.25), 1.2), { part: 'K' }),
    P.felt('c1', P.circle(8.1, 14.4, 1.85), { part: 'A', ...SOFT }),
    P.felt('c3', P.circle(8.75, 8.75, 1.85), { part: 'A', ...SOFT }),
    P.felt('c4', P.circle(14.4, 8.1, 1.85), { part: 'A', ...SOFT }),
  ],
  // a mint palm on a sunflower trunk, on a sky wave
  'palm-tree': (icon, P) => [
    P.tube('c3', P.linesOf('M5 21.25 C9 19.5 15 19.5 19 21.25')[0], 2.2, { part: 'A', ...SOFT }),
    P.tube('c2', P.linesOf('M12 7.5 C13.25 11.5 13.25 16 11.75 20.25')[0], 3.1, { part: 'K' }),
    P.felt('c4', P.fillet(P.unite(
      P.lens(12, 7, 1.75, 10, 2.6), P.lens(12, 7, 22.25, 10, 2.6),
      P.lens(12, 7.25, 4.5, 13.75, 2), P.lens(12, 7.25, 19.5, 13.75, 2),
    ), 0.6), { part: 'K', stitch: false }),
    P.knot(11, 8.75, 1, 'c1', { part: 'A' }), P.knot(13.1, 8.75, 1, 'c1', { part: 'A' }),
  ],
  'panel-bottom': (icon, P) => windowPane(P, 0, 15, 24, 24),
  'panel-left-close': (icon, P) => [...windowPane(P, 0, 0, 9, 24), P.chevron(13.25, 12, 180, 5.25, { role: 'c1', w: 2.6, part: 'S', stitch: false })],
  'panel-left-open': (icon, P) => [...windowPane(P, 0, 0, 9, 24), P.chevron(16.75, 12, 0, 5.25, { role: 'c1', w: 2.6, part: 'S', stitch: false })],
  'panel-right': (icon, P) => windowPane(P, 15, 0, 24, 24),
  // one sky wire tube bent into a clip
  paperclip: (icon, P) => [P.tube('c3', P.linesOf(icon.paths[0].d)[0], 2.4, { part: 'K' })],
  // a sky parking sign with a cream P sewn on
  parking: (icon, P) => [
    P.felt('c3', P.rr(3, 3, 21, 21, 3), { part: 'K' }),
    P.felt('tint', P.unite(P.seg(9.5, 7, 9.5, 17, 2.8), P.bar([[9.5, 7], [13, 7], ...P.arcPts(13, 10, 3, -90, 90), [9.5, 13]], 2.8)), { part: 'A', ...SOFT }),
  ],
  // a sunflower cone with a tomato band, confetti curls flying out
  'party-popper': (icon, P) => [
    P.tube('c3', P.linesOf('M11 6.5 C12.5 5.5 11 3.5 12.5 2.5')[0], 1.7, { part: 'A', ...SOFT }),
    P.tube('c4', P.linesOf('M17.5 13 C18.5 11.5 20 13.5 21.5 12')[0], 1.7, { part: 'A', ...SOFT }),
    P.tube('c1', [[15, 9], [18, 6]], 1.9, { part: 'A', ...SOFT }),
    P.knot(16.75, 2.75, 1, 'accent', { part: 'S' }), P.knot(21, 7.5, 1, 'c2', { part: 'S' }),
    P.felt('c2', P.poly([[2.75, 21.25], [7.25, 8.75], [15.25, 16.75]], [1, 1.6, 1.6]), { part: 'K', stitch: false }),
    P.felt('c1', P.clip(P.poly([[2.75, 21.25], [7.25, 8.75], [15.25, 16.75]], [1, 1.6, 1.6]), P.seg(4.25, 13.25, 10.75, 19.75, 2.6)), { part: 'A', ...SOFT }),
  ],
  // a tomato passport, a sunflower globe patch, an embroidered line
  passport: (icon, P) => [
    P.felt('c1', P.rr(4.75, 2.5, 19.25, 21.5, 2.5), { part: 'K' }),
    P.felt('c2', P.circle(12, 10, 3.75), { part: 'A', ...SOFT }),
    P.thread([[[8.5, 10], [15.5, 10]], [[12, 6.5], [12, 13.5]]], { w: 0.7, op: 0.75, part: 'A' }),
    P.thread([[9.5, 17.5], [14.5, 17.5]], { w: 1.2, role: 'edge', part: 'K' }),
  ],
  // a tomato clipboard with a sunflower clip, a cream sheet laid on top
  paste: (icon, P) => [
    P.felt('c1', P.rr(3, 4.25, 17, 18.75, 2.25), { part: 'K', stitch: false }),
    P.felt('c2', P.rr(7, 2.25, 13, 6.75, 1.4), { part: 'A', ...SOFT }),
    P.felt('tint', P.rr(10.25, 9.75, 21.25, 21.5, 2.25), { part: 'A', inset: 0.8 }),
    P.thread([[[13, 14], [18.5, 14]], [[13, 17.25], [16.5, 17.25]]], { w: 1.1, op: 0.8, part: 'A' }),
  ],
  pause: (icon, P) => [
    P.felt('c1', P.rr(5, 3.75, 10.25, 20.25, 2.4), { part: 'K' }),
    P.felt('c1', P.rr(13.75, 3.75, 19, 20.25, 2.4), { part: 'K' }),
  ],
  // bubblegum paw pads
  'paw-print': (icon, P) => [
    P.felt('accent', P.round(P.grow(P.path(icon.paths[0].d), 0.4), 1), { part: 'K' }),
    P.felt('accent', P.ellipse(8.5, 5.5, 2.1, 2.6), { part: 'A', stitch: false }),
    P.felt('accent', P.ellipse(15.5, 5.5, 2.1, 2.6), { part: 'A', stitch: false }),
    P.felt('accent', P.rot(P.ellipse(4, 11, 2.05, 2.5), -15, 4, 11), { part: 'A', stitch: false }),
    P.felt('accent', P.rot(P.ellipse(20, 11, 2.05, 2.5), 15, 20, 11), { part: 'A', stitch: false }),
  ],
  // a sky pen nib under a sunflower cap, a cream breather hole, an embroidered slit
  'pen-tool': (icon, P) => [
    P.felt('c3', P.round(P.grow(P.path(icon.paths[0].d + ' Z'), 0.3), 1), { part: 'K' }),
    P.felt('c2', P.round(P.grow(P.path(icon.paths[1].d), 0.3), 0.6), { part: 'A', stitch: false }),
    P.thread([[9.25, 14.75], [4.6, 19.4]], { w: 1, role: 'edge', part: 'K' }),
    P.felt('tint', P.circle(10.25, 13.75, 1.6), { part: 'K', ...SOFT, shade: false }),
  ],
  // a sunflower pencil: bubblegum eraser, sky ferrule, cream wood tip, plum lead
  pencil: (icon, P) => {
    const r = f => P.rot(f, 45, 12, 12)
    const tip = P.poly([[9.4, 16.5], [14.6, 16.5], [12, 23]], [0.3, 0.3, 0.9])
    return [
      P.felt('c2', r(P.rect(9.4, 5.75, 14.6, 17)), { part: 'K', stitch: false }),
      P.felt('tint', r(tip), { part: 'K', stitch: false, out: 0.5 }),
      P.flat('ink', r(P.clip(tip, P.rect(0, 20.6, 24, 24))), { part: 'K', op: 0.9 }),
      P.felt('accent', r(P.rr(9.4, 0.75, 14.6, 4.25, [2.2, 2.2, 0, 0])), { part: 'A', stitch: false, out: 0.5 }),
      P.felt('c3', r(P.rr(9.2, 3.75, 14.8, 6.5, 0.4)), { part: 'A', stitch: false, out: 0.5 }),
    ]
  },
  // two sky buttons and a tomato bar
  percent: (icon, P) => [
    P.tube('c1', [[18.5, 5.5], [5.5, 18.5]], 3, { part: 'K' }),
    P.moat(P.circle(7, 7, 3.4), 0.6), P.moat(P.circle(17, 17, 3.4), 0.6),
    ...P.button(7, 7, 3.4, 'c3', { part: 'A', n: 4 }),
    ...P.button(17, 17, 3.4, 'c3', { part: 'A', n: 4 }),
  ],
  // ---------------------------------------------------------------- p
  // a little sky runner with a sunflower head and tomato arms
  'person-running': (icon, P) => [
    P.tube('c1', [[7, 11.5], [9.5, 8.5], [13, 8.5], [15.5, 12], [18.5, 10.5]], 2.3, { part: 'A', ...SOFT }),
    P.felt('c3', P.fillet(P.unite(P.bar([[13, 8.5], [10.5, 14], [14, 16.5], [12.5, 21]], 2.8), P.bar([[10.5, 14], [8, 18], [4, 18.5]], 2.8)), 0.5), { part: 'K', seam: [[[13, 8.5], [10.5, 14], [14, 16.5], [12.5, 20.5]]] }),
    P.felt('c2', P.circle(15.5, 4.5, 2.5), { part: 'K', stitch: false }),
  ],
  phone: (icon, P) => [handset(P), P.knot(6.5, 5.75, 0.8, 'tint', { part: 'K' }), P.knot(17.75, 18, 0.8, 'tint', { part: 'K' })],
  // the handset and two sky sound waves
  'phone-call': (icon, P) => [
    handset(P),
    P.arcTube('c3', 13.5, 10.5, 4, -88, -2, 2.1, { part: 'S', ...SOFT }),
    P.arcTube('c3', 13.5, 10.5, 8, -88, -2, 2.1, { part: 'S', ...SOFT }),
  ],
  'phone-incoming': (icon, P) => [handset(P), pathArrow(P, 'c4', [[20.25, 3.75], [14, 10]], { len: 5.25, half: 4.4, w: 2.5, r: 1, part: 'S' })],
  'phone-outgoing': (icon, P) => [handset(P), pathArrow(P, 'c3', [[14, 10], [20.5, 3.5]], { len: 5.25, half: 4.4, w: 2.5, r: 1, part: 'S' })],
  // a sky zig-arrow: the call that bounced back
  'phone-missed': (icon, P) => [handset(P), pathArrow(P, 'c3', [[21.75, 3.6], [17.6, 8.6], [12.6, 3.1]], { len: 4.9, half: 3.9, w: 2.4, r: 0.9, part: 'S' })],
  // the whole handset, the shared tomato slash on the Line diagonal
  'phone-off': (icon, P) => [handset(P), ...P.slash({ role: 'c1', from: [20.75, 3.25], to: [3.25, 20.75], w: 2.6, gap: 1 })],
  // a cream screen with a sky picture sewn in the corner
  'picture-in-picture': (icon, P) => [
    P.felt('tint', P.rr(2, 4, 22, 20, 2.75), { part: 'K', inset: 0.85 }),
    P.felt('c3', P.rr(10.75, 10.75, 19, 17, 1.6), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
  ],
  // a bubblegum piggy bank in 3/4 view: stubby legs, a perky ear, a curly yarn tail, button snout, knot eye,
  // a stitched coin slot and a sunflower coin dropping in
  'piggy-bank': (icon, P) => [
    P.felt('accent', P.unite(P.pill(5.75, 15, 8.25, 21.5), P.pill(13.75, 15, 16.25, 21.5)), { part: 'K', stitch: false }),
    P.tube('accent', [[4.6, 12.3], [3.2, 12.1], [2.6, 11.1], [2.9, 10.2], [3.6, 9.9]], 1.25, { part: 'K' }),
    P.felt('c1', P.poly([[17.6, 9.8], [20.7, 6.1], [20.1, 11]], 0.9), { part: 'K', stitch: false }),
    P.felt('accent', P.fillet(P.unite(P.ellipse(11.75, 14, 7.75, 5.75), P.poly([[13.4, 9.6], [16.4, 3.9], [17.6, 10.2]], 0.9)), 0.8), { part: 'K' }),
    ...P.button(19.6, 13.5, 2.3, 'accent', { part: 'K', n: 2 }),
    P.knot(15.75, 12, 0.78, 'ink', { part: 'A' }),
    P.thread([[8.5, 10.75], [11.5, 10.75]], { w: 1.15, part: 'A' }),
    P.felt('c2', P.ellipse(10, 3.75, 1.95, 1.95), { part: 'S', ...SOFT }),
  ],
  // a sky pilcrow, the bowl stuffed
  pilcrow: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.path('M14 3 H10.5 A4.6 4.6 0 0 0 10.5 12.5 H14 Z'), P.seg(13.25, 3.5, 13.25, 20.5, 2.6), P.seg(13.25, 3.5, 18.25, 3.5, 2.6)), 0.6), { part: 'K', seam: [[[13.25, 5], [13.25, 20]]] }),
    P.tube('c3', [[18.25, 3.5], [18.25, 20.5]], 2.6, { part: 'A' }),
  ],
  // a capsule: cream half, tomato half
  pill: (icon, P) => {
    const cap = P.pill(2.5, 8.6, 21.5, 15.4)
    const r = f => P.rot(f, -45, 12, 12)
    return [
      P.felt('tint', r(P.clip(cap, P.rect(0, 0, 12, 24))), { part: 'A' }),
      P.felt('c1', r(P.clip(cap, P.rect(12, 0, 24, 24))), { part: 'K' }),
      P.thread(P.arcPts(17.2, 12, 1.7, 205, 260, 10).map(([x, y]) => { const a = rad(-45), dx = x - 12, dy = y - 12; return [12 + dx * Math.cos(a) - dy * Math.sin(a), 12 + dx * Math.sin(a) + dy * Math.cos(a)] }), { w: 1, role: 'shine', op: 0.8, part: 'K' }),
    ]
  },
  // a tomato push pin with a sky needle
  pin: (icon, P) => [
    P.tube('c3', [[9.5, 14.5], [3.75, 20.25]], 1.7, { part: 'A', ...SOFT }),
    P.felt('c1', P.round(P.grow(P.path(icon.paths[0].d), 0.35), 0.9), { part: 'K' }),
    P.knot(15.6, 6.5, 0.8, 'shine', { part: 'K', op: 0.75 }),
  ],
  // a sunflower slice, a cream crust, tomato pepperoni
  pizza: (icon, P) => [
    P.felt('c2', P.round(P.grow(P.path(icon.paths[0].d), 0.2), 1.3), { part: 'K', stitch: false }),
    P.tube('tint', P.linesOf('M8.75 3.5 A13.5 13.5 0 0 1 20.5 15.25')[0], 3.2, { part: 'K' }),
    P.felt('c1', P.circle(10.5, 13.5, 1.85), { part: 'A', ...SOFT }),
    P.felt('c1', P.circle(7.5, 18.1, 1.35), { part: 'A', ...SOFT }),
    P.felt('c1', P.circle(14.6, 11.25, 1.2), { part: 'A', ...SOFT }),
  ],
  // planes: a sky toy plane; landing/takeoff over a mint runway
  plane: (icon, P) => [P.felt('c3', airframe(P), { part: 'K', seam: [[[18.75, 5.25], [7, 17]]] })],
  'plane-landing': (icon, P) => flight(P, 70),
  'plane-takeoff': (icon, P) => flight(P, 20),
  play: (icon, P) => [P.felt('c1', P.poly([[5.25, 3], [21, 12], [5.25, 21]], [2.5, 2.5, 2.5]), { part: 'K' })],
  // a sky plug, sunflower prongs, a tomato cord
  plug: (icon, P) => [
    P.tube('c2', [[9, 2.5], [9, 8]], 2.5, { part: 'A', ...SOFT }),
    P.tube('c2', [[15, 2.5], [15, 8]], 2.5, { part: 'A', ...SOFT }),
    P.tube('c1', [[12, 15], [12, 21.5]], 2.6, { part: 'A', ...SOFT }),
    P.felt('c3', P.rr(4.5, 6.75, 19.5, 16.75, [1.25, 1.25, 6, 6]), { part: 'K' }),
  ],
  'plus-circle': (icon, P) => [
    P.felt('c4', P.circle(12, 12, 9.75), { part: 'K' }),
    P.felt('tint', P.fillet(P.unite(P.pill(10.6, 6.5, 13.4, 17.5), P.pill(6.5, 10.6, 17.5, 13.4)), 0.5), { part: 'A', ...SOFT }),
  ],
  plus: (icon, P) => [P.felt('c4', P.fillet(P.unite(P.seg(12, 4, 12, 20, 3.8), P.seg(4, 12, 20, 12, 3.8)), 0.9), { part: 'K', seam: [[[12, 5.5], [12, 18.5]], [[5.5, 12], [10.25, 12]], [[13.75, 12], [18.5, 12]]] })],
  // ---------------------------------------------------------------- p, q, r
  // a tomato mic button inside sky and sunflower arcs
  podcast: (icon, P) => [
    P.arcTube('c2', 12, 11.5, 9, 128, 412, 2.4, { part: 'A', stitch: false, pinch: false }),
    P.arcTube('c3', 12, 11.5, 5.4, 140, 400, 2.4, { part: 'A', stitch: false, pinch: false }),
    P.tube('c1', [[12, 14], [12, 21]], 2.7, { part: 'K', stitch: false }),
    ...P.button(12, 11.5, 2.5, 'c1', { part: 'K' }),
  ],
  // one mint pound sign
  'pound-sterling': (icon, P) => [
    P.felt('c4', P.stroke(icon.paths[0].d, 3), { part: 'K', seam: P.linesOf(icon.paths[0].d) }),
    P.tube('c4', [[5.5, 12.5], [14, 12.5]], 2.8, { part: 'A', stitch: false }),
  ],
  // a sky ring and a tomato switch bar
  power: (icon, P) => [
    P.arcTube('c3', 12, 12.75, 8.5, -52, 232, 3, { part: 'K' }),
    P.moat(P.seg(12, 2.75, 12, 11.75, 3.2), 0.8),
    P.tube('c1', [[12, 2.75], [12, 11.75]], 3.2, { part: 'A' }),
  ],
  // a cream board on sky easel legs, a tomato chart line
  presentation: (icon, P) => [
    P.tube('c3', [[7.25, 21], [9.25, 14.5]], 2.1, { part: 'A', ...SOFT }),
    P.tube('c3', [[16.75, 21], [14.75, 14.5]], 2.1, { part: 'A', ...SOFT }),
    P.felt('tint', P.rr(2.75, 3.25, 21.25, 15.75, 2.25), { part: 'K', inset: 0.85 }),
    P.tube('c1', [[7, 11.75], [10.5, 8.5], [13.5, 10.5], [17, 7.25]], 1.9, { part: 'A', ...SOFT }),
  ],
  // a sky printer, cream paper in and out, a mint ready light
  printer: (icon, P) => [
    P.felt('tint', P.rr(6.5, 2.25, 17.5, 10, 1.2), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.rr(2.25, 7.75, 21.75, 17.75, 2.5), { part: 'K' }),
    P.felt('tint', P.rr(6.25, 13.75, 17.75, 21.75, 1.2), { part: 'A', stitch: false, out: 0.5 }),
    P.thread([[[9, 16.75], [15, 16.75]], [[9, 19], [13.5, 19]]], { w: 0.9, op: 0.75, part: 'A' }),
    P.knot(18.5, 10.75, 0.85, 'c4', { part: 'K' }),
  ],
  // a mint jigsaw piece
  'puzzle-piece': (icon, P) => [P.felt('c4', P.round(P.grow(P.path(icon.paths[0].d), 0.35), 0.8), { part: 'K' })],
  // three sky finder pads with cream centres, tomato French-knot data
  'qr-code': (icon, P) => [
    P.felt('c3', P.unite([[3, 3], [14, 3], [3, 14]].map(([x, y]) => P.rr(x, y, x + 7, y + 7, 2))), { part: 'K', stitch: false }),
    P.flat('tint', P.unite([[3, 3], [14, 3], [3, 14]].map(([x, y]) => P.rr(x + 2.25, y + 2.25, x + 4.75, y + 4.75, 0.7))), { part: 'K' }),
    P.felt('c1', P.unite([[14.6, 14.6], [20.4, 14.6], [17.5, 17.5], [14.6, 20.4], [20.4, 20.4]].map(([x, y]) => P.circle(x, y, 1.35))), { part: 'A', ...SOFT }),
  ],
  // two tomato quote marks
  quote: (icon, P) => [
    P.felt('c1', P.round(P.grow(P.path(icon.paths[0].d), 0.3), 0.8), { part: 'K' }),
    P.felt('c1', P.round(P.grow(P.path(icon.paths[1].d), 0.3), 0.8), { part: 'K' }),
  ],
  // a cream bunny: bubblegum inner ears and nose, knot eyes
  rabbit: (icon, P) => [
    P.felt('tint', P.round(P.grow(P.path(icon.paths[0].d), 0.3), 0.8), { part: 'K' }),
    P.felt('accent', P.lens(9.6, 10.25, 7.4, 3.6, 0.95), { part: 'A', stitch: false, out: 0.4, shade: false }),
    P.felt('accent', P.lens(14.4, 10.25, 16.6, 3.6, 0.95), { part: 'A', stitch: false, out: 0.4, shade: false }),
    P.knot(9.75, 15, 0.95, 'ink', { part: 'K' }), P.knot(14.25, 15, 0.95, 'ink', { part: 'K' }),
    P.felt('accent', P.heart(12, 17.6, 0.2), { part: 'K', stitch: false, out: 0.35 }),
  ],
  // a tomato radio, button speaker, sky antenna, cream dial lines
  radio: (icon, P) => [
    P.tube('c3', [[7, 8.5], [17.75, 3.5]], 1.8, { part: 'A', ...SOFT }),
    P.knot(17.9, 3.45, 1.05, 'c3', { part: 'A' }),
    P.felt('c1', P.rr(2, 8.25, 22, 20.75, 2.5), { part: 'K' }),
    ...P.button(8.25, 14.5, 3.2, 'c2', { part: 'K' }),
    P.thread([[[14, 12.5], [18, 12.5]], [[14, 16.5], [18, 16.5]]], { w: 1.2, role: 'edge', part: 'K' }),
  ],
  // three felt bands with cream cloud cushions at the ends
  rainbow: (icon, P) => [
    P.arcTube('c1', 12, 18, 8.6, 180, 360, 3, { part: 'K', stitch: false, pinch: false }),
    P.arcTube('c2', 12, 18, 5.6, 180, 360, 3, { part: 'K', stitch: false }),
    P.felt('c3', P.half(12, 18, 3.4, 'n'), { part: 'K', stitch: false }),
    P.felt('tint', P.unite(P.cloud(4.5, 18.25, 0.4), P.cloud(19.5, 18.25, 0.4)), { part: 'A', stitch: false }),
  ],
  // a cream receipt with zig-zag tear, embroidered lines, a little heart total
  receipt: (icon, P) => [
    P.felt('tint', P.round(P.grow(P.path(icon.paths[0].d), 0.25), 0.7), { part: 'K' }),
    P.thread([[[8.5, 7.5], [15.5, 7.5]], [[8.5, 11.25], [15.5, 11.25]], [[8.5, 15], [12, 15]]], { w: 1.1, op: 0.8, part: 'K' }),
    P.felt('c1', P.heart(15.25, 15.1, 0.22), { part: 'A', stitch: false, out: 0.4 }),
  ],
  // curved arrows: tomato
  redo: (icon, P) => [...splitArrow(P, 'c1', [[14.5, 20.5], [9.25, 20.5], ...P.arcPts(9.25, 15, 5.5, 90, 270, 4), [21.25, 9.5]], { w: 3, len: 7, half: 6 })],
  // two tomato and mint arcs chasing each other
  refresh: (icon, P) => [
    ...arcSplit(P, 'c1', 12, 12, 8.25, 175, 318, { w: 2.9, len: 6.25, half: 5.25 }),
    ...arcSplit(P, 'c4', 12, 12, 8.25, -5, 138, { w: 2.9, len: 6.25, half: 5.25 }),
  ],
  // a retro mint fridge: two doors, cream handles, a heart magnet
  refrigerator: (icon, P) => [
    P.felt('c4', P.rr(5, 2.25, 19, 9.75, [2.5, 2.5, 0.75, 0.75]), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    P.felt('c4', P.rr(5, 9.75, 19, 21.75, [0.75, 0.75, 2.5, 2.5]), { part: 'K' }),
    P.tube('tint', [[8.75, 4.75], [8.75, 7]], 1.6, { part: 'A', ...SOFT }),
    P.tube('tint', [[8.75, 12.5], [8.75, 16.75]], 1.6, { part: 'A', ...SOFT }),
    P.felt('accent', P.heart(14.75, 14.6, 0.3), { part: 'deco', stitch: false, out: 0.45 }),
  ],
  // a sky T, a tomato x sewn beside it
  'remove-formatting': (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.bar([[3.5, 6.75], [3.5, 4], [16.5, 4], [16.5, 6.75]], 2.9), P.seg(10, 4, 10, 20, 3)), 0.6), { part: 'K', seam: [[[10, 5.5], [10, 19]]] }),
    P.moat(P.unite(P.seg(15, 15, 20.5, 20.5, 2.6), P.seg(20.5, 15, 15, 20.5, 2.6)), 0.8),
    P.felt('c1', P.fillet(P.unite(P.seg(15, 15, 20.5, 20.5, 2.6), P.seg(20.5, 15, 15, 20.5, 2.6)), 0.4), { part: 'S', ...SOFT }),
  ],
  // two loops chasing each other: tomato above, mint below, a sunflower 1 between
  'repeat-1': (icon, P) => [
    ...splitArrow(P, 'c1', [[4, 11.25], [4, 9], ...P.arcPts(7.5, 9, 3.5, 180, 270, 10), [21, 5.5]], { w: 2.9, len: 5.75, half: 5 }),
    ...splitArrow(P, 'c4', [[20, 12.75], [20, 15], ...P.arcPts(16.5, 15, 3.5, 0, 90, 10), [3, 18.5]], { w: 2.9, len: 5.75, half: 5 }),
    P.tube('c2', [[10.6, 10.9], [12.4, 9.75], [12.4, 14.4]], 2, { part: 'S', ...SOFT }),
  ],
  repeat: (icon, P) => [
    ...splitArrow(P, 'c1', [[4, 11.75], [4, 10], ...P.arcPts(7.5, 10, 3.5, 180, 270, 10), [21, 6.5]], { w: 3, len: 6.25, half: 5.25 }),
    ...splitArrow(P, 'c4', [[20, 12.25], [20, 14], ...P.arcPts(16.5, 14, 3.5, 0, 90, 10), [3, 17.5]], { w: 3, len: 6.25, half: 5.25 }),
  ],
  'reply-all': (icon, P) => [
    P.chevron(2.75, 9.5, 180, 7, { role: 'c1', w: 2.7, part: 'A', stitch: false }),
    ...splitArrow(P, 'c1', [[20.5, 20], [20.5, 16.5], ...P.arcPts(13.75, 16.5, 6.75, 0, -90, 6), [8, 9.5]], { w: 2.9, len: 6.25, half: 5.5 }),
  ],
  reply: (icon, P) => [...splitArrow(P, 'c1', [[20, 20], [20, 16.5], ...P.arcPts(13, 16.5, 7, 0, -90, 6), [2.75, 9.5]], { w: 3, len: 7, half: 6 })],
  // ---------------------------------------------------------------- r, s
  rewind: (icon, P) => [
    P.felt('c1', P.poly([[1.75, 12], [12, 4.75], [12, 19.25]], [1.4, 1.6, 1.6]), { part: 'K' }),
    P.felt('c1', P.poly([[11.75, 12], [22.25, 4.75], [22.25, 19.25]], [1.4, 1.6, 1.6]), { part: 'K' }),
  ],
  'rotate-ccw': (icon, P) => [...arcSplit(P, 'c1', 12, 12.75, 8.25, 180, -137, { w: 3, len: 6.5, half: 5.5 })],
  'rotate-cw': (icon, P) => [...arcSplit(P, 'c1', 12, 12.75, 8.25, 0, 317, { w: 3, len: 6.5, half: 5.5 })],
  // a sunflower road between a tomato start button and a mint goal
  route: (icon, P) => [
    P.tube('c2', [[6, 18.5], [15.25, 18.5], ...P.arcPts(15.25, 15.25, 3.25, 90, -90, 10), [8.75, 12], ...P.arcPts(8.75, 8.75, 3.25, 90, 270, 10), [18, 5.5]], 2.4, { part: 'A' }),
    ...P.button(5.5, 18.5, 2.75, 'c1', { part: 'K' }),
    P.felt('c4', P.circle(18.5, 5.5, 2.75), { part: 'K', stitch: false }),
    P.knot(18.5, 5.5, 0.9, 'tint', { part: 'K' }),
  ],
  // a sky router with sunflower antennae and two blinking knots
  router: (icon, P) => [
    P.tube('c2', [[6.5, 13.5], [5, 5.75]], 2.2, { part: 'A', ...SOFT }),
    P.tube('c2', [[17.5, 13.5], [19, 5.75]], 2.2, { part: 'A', ...SOFT }),
    P.felt('c3', P.rr(2, 12.75, 22, 20.75, 2.6), { part: 'K' }),
    P.knot(6, 16.75, 1, 'c4', { part: 'K' }), P.knot(9.25, 16.75, 1, 'c2', { part: 'K' }),
    P.thread([[13, 16.75], [18, 16.75]], { w: 1.2, role: 'edge', part: 'K' }),
  ],
  // a tomato dot and two arcs: sunflower and tomato
  rss: (icon, P) => [
    P.arcTube('c1', 5.25, 18.75, 14, -90, 0, 3, { part: 'A' }),
    P.arcTube('c2', 5.25, 18.75, 7.75, -90, 0, 3, { part: 'A' }),
    P.felt('c1', P.circle(5.75, 18.25, 2.3), { part: 'K', stitch: false }),
  ],
  // a sunflower ruler with embroidered ticks
  ruler: (icon, P) => {
    const r = f => P.rot(f, -45, 12, 12)
    const a = rad(-45), m = (u, v) => [12 + (u - 12) * Math.cos(a) - (v - 12) * Math.sin(a), 12 + (u - 12) * Math.sin(a) + (v - 12) * Math.cos(a)]
    const tick = (x, l) => [m(x, 8.6), m(x, 8.6 + l)]
    return [
      P.felt('c2', r(P.rr(2.25, 8.4, 21.75, 15.6, 2)), { part: 'K', stitch: false }),
      P.thread([tick(6, 3.25), tick(9, 2), tick(12, 3.25), tick(15, 2), tick(18, 3.25)], { w: 1, op: 0.85, part: 'A' }),
    ]
  },
  // a sky bowl, a mint leaf and a tomato
  salad: (icon, P) => [
    P.felt('c4', P.round(P.grow(P.path(icon.paths[1].d), 0.4), 0.6), { part: 'A', stitch: false }),
    P.felt('c1', P.circle(17, 7.5, 2.85), { part: 'A', stitch: false }),
    P.felt('c3', P.round(P.grow(P.path(icon.paths[0].d), 0.3), 1.2), { part: 'K' }),
    P.thread([[7.25, 6.25], [10.25, 9.75]], { w: 0.9, role: 'edge', op: 0.9, part: 'A' }),
  ],
  // a sky floppy disk, a sunflower shutter, a cream label
  save: (icon, P) => [
    P.felt('c3', P.poly([[3, 3], [16.25, 3], [21, 7.75], [21, 21], [3, 21]], [2.5, 1.2, 1.5, 2.5, 2.5]), { part: 'K' }),
    P.felt('c2', P.rr(7.25, 2.75, 14.75, 8.5, [0.4, 0.4, 1.6, 1.6]), { part: 'A', ...SOFT }),
    P.thread([[12.25, 4.6], [12.25, 6.6]], { w: 1.1, part: 'A' }),
    P.felt('tint', P.rr(6.25, 13, 17.75, 21.25, [1.75, 1.75, 0.3, 0.3]), { part: 'K', ...SOFT }),
    P.thread([[[8.75, 16], [15.25, 16]], [[8.75, 18.5], [13.25, 18.5]]], { w: 1, op: 0.75, part: 'K' }),
  ],
  // a sunflower balance with tomato pans on sky strings
  scale: (icon, P) => [
    P.tube('c3', [[5, 6.5], [2.75, 13.5]], 1.3, { part: 'A', ...SOFT }), P.tube('c3', [[5, 6.5], [7.25, 13.5]], 1.3, { part: 'A', ...SOFT }),
    P.tube('c3', [[19, 6.5], [16.75, 13.5]], 1.3, { part: 'A', ...SOFT }), P.tube('c3', [[19, 6.5], [21.25, 13.5]], 1.3, { part: 'A', ...SOFT }),
    P.felt('c2', P.fillet(P.unite(P.seg(12, 4, 12, 20.5, 2.7), P.seg(4.5, 6.5, 19.5, 6.5, 2.5), P.pill(7, 19.25, 17, 22)), 0.7), { part: 'K', seam: [[[12, 8], [12, 19]]] }),
    P.felt('c1', P.half(5, 13.25, 3.6, 's'), { part: 'A', stitch: false }),
    P.felt('c1', P.half(19, 13.25, 3.6, 's'), { part: 'A', stitch: false }),
    P.knot(12, 3.5, 1.35, 'c1', { part: 'K' }),
  ],
  // sky corner brackets round a sunflower face
  'scan-face': (icon, P) => [
    P.felt('c3', P.unite([[[3, 7.75], [3, 5], ...P.arcPts(5, 5, 2, 180, 270, 15), [7.75, 3]], [[16.25, 3], [19, 3], ...P.arcPts(19, 5, 2, 270, 360, 15), [21, 7.75]], [[21, 16.25], [21, 19], ...P.arcPts(19, 19, 2, 0, 90, 15), [16.25, 21]], [[7.75, 21], [5, 21], ...P.arcPts(5, 19, 2, 90, 180, 15), [3, 16.25]]].map(q => P.bar(q, 2.6))), { part: 'K', stitch: false }),
    P.felt('c2', P.circle(12, 12, 5.6), { part: 'A', stitch: false }),
    P.knot(9.9, 10.6, 0.85, 'ink', { part: 'A' }), P.knot(14.1, 10.6, 0.85, 'ink', { part: 'A' }),
    P.thread(Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [9.75 + 4.5 * t, 13.4 + 1.5 * Math.sin(Math.PI * t)] }), { w: 0.95, part: 'A' }),
  ],
  // a sunflower schoolhouse: tomato gable, sky door, cream round window, a mint flag
  school: (icon, P) => [
    P.tube('c3', [[12, 8.5], [12, 2.25]], 1.3, { part: 'A', ...SOFT }),
    P.felt('c4', P.poly([[12.25, 1.9], [17, 3.75], [12.25, 5.6]], 0.6), { part: 'A', ...SOFT }),
    P.felt('c2', P.rr(2.75, 13.75, 21.25, 21.25, [2.2, 2.2, 1.5, 1.5]), { part: 'K', stitch: false }),
    P.felt('c1', P.poly([[6.75, 21.25], [6.75, 12.25], [12, 7.75], [17.25, 12.25], [17.25, 21.25]], [0.5, 1, 1.4, 1, 0.5]), { part: 'K' }),
    P.felt('c3', P.rr(10, 17.25, 14, 21.25, [2, 2, 0.3, 0.3]), { part: 'K', ...SOFT }),
    P.felt('tint', P.circle(12, 13, 1.5), { part: 'K', ...SOFT, shade: false }),
  ],
  // tomato finger loops, sky blades, a sunflower pivot button
  scissors: (icon, P) => [
    P.tube('c3', [[8.75, 8], [20.25, 16.75]], 2.6, { part: 'A' }),
    P.tube('c3', [[8.75, 16], [20.25, 7.25]], 2.6, { part: 'A' }),
    P.felt('c1', P.ring(6, 6, 3.6, 1.35), { part: 'K', stitch: false }),
    P.felt('c1', P.ring(6, 18, 3.6, 1.35), { part: 'K', stitch: false }),
    ...P.button(14, 12, 1.35, 'c2', { part: 'K' }),
  ],
  // a cream scroll between two tomato rollers
  'scroll-text': (icon, P) => [
    P.felt('tint', P.rect(5.75, 4.5, 18.25, 19.5), { part: 'K', stitch: false }),
    P.thread([[[9, 10], [15, 10]], [[9, 13.5], [13.25, 13.5]]], { w: 1.15, op: 0.8, part: 'K' }),
    P.felt('c1', P.pill(3, 2.75, 21, 6.5), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
    P.felt('c1', P.pill(3, 17.5, 21, 21.25), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
  ],
  // a paper plane: sky wing, cream fold
  send: (icon, P) => [
    P.felt('c3', P.poly([[21.6, 2.4], [2.4, 9.9], [10.3, 13.7], [14.1, 21.6]], [0.35, 0.8, 0.3, 0.8]), { part: 'K', seam: [[[19.5, 4.5], [10.75, 13.25]]] }),
    P.felt('tint', P.poly([[20.6, 3.4], [11.4, 13.6], [14.2, 19.6]], [0.3, 0.5, 0.7]), { part: 'A', stitch: false }),
  ],
  // two sky server units with mint and sunflower lights
  server: (icon, P) => [
    P.felt('c3', P.rr(2.75, 2.5, 21.25, 10.25, 2.5), { part: 'K' }),
    P.felt('c3', P.rr(2.75, 13.75, 21.25, 21.5, 2.5), { part: 'K' }),
    P.knot(7, 6.4, 1.1, 'c4', { part: 'A' }), P.knot(7, 17.6, 1.1, 'c2', { part: 'A' }),
    P.thread([[[11, 6.4], [17, 6.4]], [[11, 17.6], [17, 17.6]]], { w: 1.2, role: 'edge', part: 'K' }),
  ],
  // a sky tray, a tomato arrow lifting out of it
  'share-2': (icon, P) => [
    P.felt('c3', P.rr(4.5, 10, 19.5, 21.25, 2.75), { part: 'K' }),
    P.moat(P.unite(P.seg(12, 15.5, 12, 6, 3), head(P, 12, 2.25, -90, 6.25, 5.5)), 0.7),
    pathArrow(P, 'c1', [[12, 15.5], [12, 2.25]], { w: 3, len: 6.25, half: 5.5, part: 'A' }),
  ],
  // three felt nodes on sunflower threads
  share: (icon, P) => [
    P.tube('c2', [[6.5, 12], [17.5, 5.5]], 2, { part: 'A', ...SOFT }),
    P.tube('c2', [[6.5, 12], [17.5, 18.5]], 2, { part: 'A', ...SOFT }),
    P.felt('c1', P.circle(6.25, 12, 3.4), { part: 'K', stitchMin: 1.2, inset: 0.8 }),
    P.felt('c4', P.circle(17.75, 5.5, 3.4), { part: 'K', stitchMin: 1.2, inset: 0.8 }),
    P.felt('c3', P.circle(17.75, 18.5, 3.4), { part: 'K', stitchMin: 1.2, inset: 0.8 }),
  ],
  // shields: a sky shield with a sewn-on emblem
  shield: (icon, P) => [shield(P), P.felt('accent', P.heart(12, 11.75, 0.48), { part: 'A', ...SOFT })],
  'shield-alert': (icon, P) => [
    shield(P),
    P.felt('c2', P.pill(10.75, 6.25, 13.25, 13), { part: 'A', ...SOFT }),
    P.felt('c2', P.circle(12, 16.4, 1.45), { part: 'A', ...SOFT }),
  ],
  'shield-check': (icon, P) => [shield(P), P.tube('tint', [[8.25, 11.75], [11, 14.5], [15.75, 9.25]], 2.7, { part: 'A', ...SOFT })],
  'shield-off': (icon, P) => [shield(P), ...P.slash({ role: 'c1', from: [3.5, 3.25], to: [20.5, 20.75], w: 2.6 })],
  'shield-user': (icon, P) => [
    shield(P),
    P.felt('tint', P.circle(12, 8.6, 2.6), { part: 'A', ...SOFT }),
    P.felt('tint', P.round(P.clip(P.ellipse(12, 18.75, 5.25, 5), P.unite(P.rect(0, 0, 24, 18.25), P.path(SHIELD))), 0.8), { part: 'A', ...SOFT }),
  ],
  // a tomato hull, a cream cabin with sky portholes, a sunflower funnel, sky waves
  ship: (icon, P) => [
    P.felt('c2', P.rr(9.75, 2.75, 14.25, 8.5, [1.2, 1.2, 0, 0]), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('tint', P.rr(6.25, 7.25, 17.75, 12.75, [1.75, 1.75, 0, 0]), { part: 'K', stitch: false }),
    P.knot(9.5, 10, 0.9, 'c3', { part: 'K' }), P.knot(12, 10, 0.9, 'c3', { part: 'K' }), P.knot(14.5, 10, 0.9, 'c3', { part: 'K' }),
    P.felt('c1', P.poly([[2, 11.75], [22, 11.75], [19.25, 17], [4.75, 17]], [0.9, 0.9, 1.6, 1.6]), { part: 'K' }),
    P.tube('c3', Array.from({ length: 25 }, (_, i) => [2.75 + i * 0.77, 20.25 + 0.75 * Math.sin(i * 0.77 / 3.5 * Math.PI * 2)]), 1.9, { part: 'deco', ...SOFT }),
  ],
  // a tomato shopping bag, a sky handle, a cream heart
  'shopping-bag': (icon, P) => [
    P.tube('c3', [[8.5, 10.25], [8.5, 6.75], ...P.arcPts(12, 6.75, 3.5, 180, 360, 10), [15.5, 10.25]], 2.1, { part: 'A', ...SOFT }),
    P.felt('c1', P.round(P.grow(P.path(icon.paths[0].d), 0.35), 1.2), { part: 'K' }),
    P.felt('tint', P.heart(12, 14.25, 0.38), { part: 'K', ...SOFT }),
  ],
  // a sunflower basket under a tomato rim, a sky handle
  'shopping-basket': (icon, P) => [
    P.tube('c3', P.arcPts(12, 10.25, 5.75, 180, 360, 6), 2.2, { part: 'A', ...SOFT }),
    P.felt('c2', P.poly([[3.75, 10], [20.25, 10], [18.5, 19.75], [16.25, 21.25], [7.75, 21.25], [5.5, 19.75]], [0.4, 0.4, 1.4, 1, 1, 1.4]), { part: 'K', stitch: false }),
    P.thread([[[8.25, 14], [8.5, 18]], [[12, 14], [12, 18]], [[15.75, 14], [15.5, 18]]], { w: 1.1, op: 0.75, part: 'K' }),
    P.felt('c1', P.pill(2.25, 8.5, 21.75, 11.75), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
  ],
  'shopping-cart-plus': (icon, P) => [...cart(P), P.glyph('plus', 12.85, 9.5, 2.1, { part: 'S', w: 1.35 })],
  'shopping-cart': (icon, P) => [...cart(P), P.felt('accent', P.heart(12.85, 9.75, 0.33), { part: 'K', stitch: false, out: 0.45 })],
  // two crossing tubes, tomato over sky
  shuffle: (icon, P) => {
    const a = splitArrow(P, 'c3', P.linesOf('M2.75 6.5 H5 C10.5 6.5 12 17.5 17.5 17.5 H21.25')[0], { w: 2.8, len: 5.75, half: 4.9 })
    const b = splitArrow(P, 'c1', P.linesOf('M2.75 17.5 H5 C10.5 17.5 12 6.5 17.5 6.5 H21.25')[0], { w: 2.8, len: 5.75, half: 4.9 })
    return [...a, P.moat(b.F, 0.75), ...b]
  },
  sidebar: (icon, P) => windowPane(P, 0, 0, 9.25, 24),
  // four felt bars, rising
  signal: (icon, P) => [
    P.felt('c3', P.pill(2.75, 15.25, 6.25, 20.75), { part: 'K', stitch: false }),
    P.felt('c4', P.pill(7.75, 11.25, 11.25, 20.75), { part: 'K' }),
    P.felt('c2', P.pill(12.75, 7.25, 16.25, 20.75), { part: 'K' }),
    P.felt('c1', P.pill(17.75, 3.25, 21.25, 20.75), { part: 'K' }),
  ],
  // a sky signature on a sunflower line
  signature: (icon, P) => [
    P.tube('c2', [[3, 20.75], [21, 20.75]], 2, { part: 'A', ...SOFT }),
    P.tube('c3', P.linesOf(icon.paths[0].d)[0], 2.4, { part: 'K' }),
  ],
  // a sunflower post, a tomato board right, a sky board left, a mint tuft
  signpost: (icon, P) => [
    P.tube('c2', [[12, 6], [12, 20.5]], 2.8, { part: 'K', stitch: false }),
    P.felt('c4', P.pill(8, 19.5, 16, 22.25), { part: 'K', stitch: false }),
    P.felt('c1', P.poly([[5, 2.5], [17.25, 2.5], [20.25, 5.6], [17.25, 8.7], [5, 8.7]], [1.2, 1, 1.1, 1, 1.2]), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
    P.felt('c3', P.poly([[19, 11.5], [6.75, 11.5], [3.75, 14.6], [6.75, 17.7], [19, 17.7]], [1.2, 1, 1.1, 1, 1.2]), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
  ],
  // a tomato dome on a sky base, sunflower flashes
  siren: (icon, P) => [
    P.tube('c2', [[12, 2], [12, 4.5]], 2, { part: 'S', ...SOFT }),
    P.tube('c2', [[4.25, 5.75], [6, 7.5]], 2, { part: 'S', ...SOFT }),
    P.tube('c2', [[19.75, 5.75], [18, 7.5]], 2, { part: 'S', ...SOFT }),
    P.felt('c1', P.rr(6.75, 7.75, 17.25, 18.5, [5.25, 5.25, 0, 0]), { part: 'K' }),
    P.felt('c3', P.rr(3.75, 17, 20.25, 21.5, 1.75), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
    P.thread(P.arcPts(12, 13, 2.75, 200, 265, 10), { w: 1.15, role: 'shine', op: 0.9, part: 'A' }),
  ],
  'skip-back': (icon, P) => [
    P.felt('c1', P.pill(3, 4.75, 6.5, 19.25), { part: 'A', stitch: false }),
    P.felt('c1', P.poly([[8.75, 12], [20.5, 4.75], [20.5, 19.25]], [1.6, 1.8, 1.8]), { part: 'K' }),
  ],
  'skip-forward': (icon, P) => [
    P.felt('c1', P.pill(17.5, 4.75, 21, 19.25), { part: 'A', stitch: false }),
    P.felt('c1', P.poly([[15.25, 12], [3.5, 4.75], [3.5, 19.25]], [1.6, 1.8, 1.8]), { part: 'K' }),
  ],
  // three sky rails with tomato, sunflower and mint knobs
  sliders: (icon, P) => [
    P.tube('c3', [[3, 6], [21, 6]], 2, { part: 'K', ...SOFT }),
    P.tube('c3', [[3, 12], [21, 12]], 2, { part: 'K', ...SOFT }),
    P.tube('c3', [[3, 18], [21, 18]], 2, { part: 'K', ...SOFT }),
    P.felt('c1', P.circle(16, 6, 2.6), { part: 'A', stitch: false }),
    P.felt('c2', P.circle(8, 12, 2.6), { part: 'A', stitch: false }),
    P.felt('c4', P.circle(13, 18, 2.6), { part: 'A', stitch: false }),
  ],
}
