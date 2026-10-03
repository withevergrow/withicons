// PLUSH kit: the stuffed-toy vocabulary. Every function returns a PIECE or a list of
// pieces (see _plush-compose.mjs); shapes come from _plush-prim.mjs (signed-distance fields).
//
//   felt(role, F, o)          a stuffed felt panel: piping, base, shade, highlight, running stitch
//   tube(role, pts, w, o)     a stuffed tube along a polyline, stitched down its seam
//   arcTube(role, cx, cy, r, a0, a1, w, o)
//   flat(role, F, o)          flat colour, no piping (French knots, button holes, cheeks)
//   thread(lines, o)          embroidery: round-capped thread (o.w width, o.role, o.op)
//   knot(x, y, r, role)       a French-knot dot
//   moat(F, gap)              knock a gap round F out of everything painted before
//   button(x, y, r, role, o)  a sewn-on button: felt disc, two holes, a cross thread
//   patch(role, x0, y0, x1, y1, r, o)  a stitched-on rectangular patch
//   heartPatch(role, cx, cy, k)        a small felt heart (decoration)
//   tag(x, y, role, o)        the little fabric label sewn into a seam
//   smile(cx, cy, w, o)       an embroidered smile with knot eyes (characters only)
//   cross(x, y, s, o)         a cross-stitch X
//   glyph(kind, cx, cy, s, o) embroidered glyph: plus minus x check bang dot up down
//   badge(kind, role, cx, cy, r, o)    S-plate badge: moat + felt disc + embroidered glyph
//   arrow(x0, y0, x1, y1, o)  one stuffed arrow (shaft and rounded head as one panel)
//   chevron(x, y, deg, arm, o) one stuffed chevron tube
//   slash(o)                  the "-off" slash: moat + a tube
import * as P from './_plush-prim.mjs'

const opt = o => o || {}

export function felt(role, F, o) { return { kind: 'felt', role, F, ...opt(o) } }
export function flat(role, F, o) { return { kind: 'flat', role, F, ...opt(o) } }
export function tube(role, pts, w = 2.75, o) {
  const closed = !!opt(o).closed
  const seam = [closed ? [...pts, pts[0]] : pts]
  return { kind: 'felt', role, F: P.bar(pts, w, closed), seam, ...opt(o) }
}
export const arcTube = (role, cx, cy, r, a0, a1, w = 2.75, o) => tube(role, P.arcPts(cx, cy, r, a0, a1), w, o)
// lines: one polyline [[x,y]...], a list of them, or SVG path data
export function thread(lines, o) {
  let L = typeof lines === 'string' ? P.linesOf(lines) : lines
  if (L.length && typeof L[0][0] === 'number') L = [L]
  const oo = opt(o)
  return { kind: 'thread', lines: L, w: oo.w || 1, role: oo.role || 'ink', ...oo }
}
export const knot = (x, y, r = 0.75, role = 'ink', o) => flat(role, P.circle(x, y, r), o)
export const moat = (F, gap = 0.9) => ({ kind: 'cut', F: gap ? P.grow(F, gap) : F })

export function button(x, y, r = 1.75, role = 'c2', o) {
  const oo = opt(o)
  const holeRole = oo.holes || 'ink'
  // four holes from r 1.5 up; two below, set on the diagonal (side by side they read as a snout or eyes)
  const four = (oo.n ?? (r >= 1.5 ? 4 : 2)) === 4
  const hr = Math.max(0.26, r * (four ? 0.13 : 0.17)), dx = r * (four ? 0.27 : 0.36)
  const holes = four
    ? P.unite(P.circle(x - dx, y - dx, hr), P.circle(x + dx, y - dx, hr), P.circle(x - dx, y + dx, hr), P.circle(x + dx, y + dx, hr))
    : P.unite(P.circle(x - dx * 0.75, y + dx * 0.75, hr), P.circle(x + dx * 0.75, y - dx * 0.75, hr)) // on the diagonal: a level pair reads as eyes
  return [
    felt(role, P.circle(x, y, r), { stitch: false, out: oo.out ?? 0.5, hiOp: 0.5, ...oo }),
    // the rim: a soft ring a little inside the edge, as a moulded button has
    r >= 2.2 ? flat('shadow', P.ring(x, y, r * 0.78, r * 0.7), { op: 0.22, part: oo.part }) : null,
    flat(holeRole, holes, { op: 0.85, part: oo.part }),
  ].filter(Boolean)
}
export function patch(role, x0, y0, x1, y1, r = 1, o) {
  return felt(role, P.rr(x0, y0, x1, y1, r), { inset: 0.7, stitchMin: 1.0, ...opt(o) })
}
export const heartPatch = (role = 'accent', cx = 12, cy = 12, k = 0.3, o) => felt(role, P.heart(cx, cy, k), { stitch: false, out: 0.5, ...opt(o) })
// a label: a little rectangle sewn into a seam at (x, y), pointing deg (0 = right)
export function tag(x, y, role = 'accent', o) {
  const oo = opt(o), deg = oo.deg ?? 0, l = oo.len ?? 2.6, w = oo.wid ?? 1.9
  let F = P.rr(x, y - w / 2, x + l, y + w / 2, [0, 0.6, 0.6, 0])
  if (deg) F = P.rot(F, deg, x, y)
  return felt(role, F, { stitch: false, shade: false, hi: false, out: 0.45, ...oo })
}
export function smile(cx, cy, w = 3, o) {
  const oo = opt(o), h = w * 0.32
  const pts = Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [cx - w / 2 + w * t, cy + h * Math.sin(Math.PI * t)] })
  const eyes = oo.eyes === false ? [] : [knot(cx - w * 0.42, cy - w * 0.45, oo.eye ?? 0.62, oo.role || 'ink', { part: oo.part }), knot(cx + w * 0.42, cy - w * 0.45, oo.eye ?? 0.62, oo.role || 'ink', { part: oo.part })]
  return [thread(pts, { w: oo.w || 0.8, role: oo.role || 'ink', part: oo.part }), ...eyes]
}
export function cross(x, y, s = 1, o) {
  const oo = opt(o)
  return thread([[[x - s, y - s], [x + s, y + s]], [[x + s, y - s], [x - s, y + s]]], { w: oo.w || 0.6, role: oo.role || 'ink', ...oo })
}
export function glyphLines(kind, cx, cy, s = 2.2) {
  switch (kind) {
    case 'plus': return [[[cx - s, cy], [cx + s, cy]], [[cx, cy - s], [cx, cy + s]]]
    case 'minus': return [[[cx - s, cy], [cx + s, cy]]]
    case 'x': { const k = s * 0.8; return [[[cx - k, cy - k], [cx + k, cy + k]], [[cx + k, cy - k], [cx - k, cy + k]]] }
    case 'check': return [[[cx - s, cy + 0.1 * s], [cx - 0.3 * s, cy + 0.8 * s], [cx + s, cy - 0.7 * s]]]
    case 'bang': return [[[cx, cy - s], [cx, cy + 0.25 * s]], [[cx, cy + s], [cx, cy + s]]]
    case 'dot': return [[[cx, cy], [cx, cy]]]
    case 'up': return [[[cx, cy + s], [cx, cy - s]], [[cx - 0.8 * s, cy - 0.15 * s], [cx, cy - s], [cx + 0.8 * s, cy - 0.15 * s]]]
    case 'down': return [[[cx, cy - s], [cx, cy + s]], [[cx - 0.8 * s, cy + 0.15 * s], [cx, cy + s], [cx + 0.8 * s, cy + 0.15 * s]]]
    default: return []
  }
}
export const glyph = (kind, cx, cy, s = 2.2, o) => thread(glyphLines(kind, cx, cy, s), { w: 1.25, role: 'edge', ...opt(o) })
export function badge(kind, role = 'c4', cx = 17.5, cy = 17.5, r = 4.5, o) {
  const oo = opt(o)
  const disc = P.circle(cx, cy, r)
  return [
    moat(disc, oo.gap ?? 1.1),
    felt(role, disc, { part: 'S', stitch: r >= 4 ? 'auto' : false, inset: 0.75, ...oo }),
    kind ? glyph(kind, cx, cy, r * 0.46, { part: 'S', role: oo.glyphRole || (role === 'c2' || role === 'tint' ? 'ink' : 'edge'), w: oo.gw || 1.3 }) : null,
  ].filter(Boolean)
}
// one stuffed arrow: a shaft tube and a rounded triangular head as one panel, seam down the shaft
export function arrow(x0, y0, x1, y1, o) {
  const oo = opt(o)
  const len = oo.len ?? 6.5, half = oo.half ?? 5.5, w = oo.w ?? 3, role = oo.role || 'c1'
  const L = Math.hypot(x1 - x0, y1 - y0) || 1, ux = (x1 - x0) / L, uy = (y1 - y0) / L
  const bx = x1 - ux * len, by = y1 - uy * len
  const rt = oo.r ?? 1.3, rb = oo.rb ?? 0.75
  const head = P.poly([[x1, y1], [bx - uy * half, by + ux * half], [bx + ux * 0.9, by + uy * 0.9], [bx + uy * half, by - ux * half]], [rt, rb, 0.6, rb])
  const shaft = P.seg(x0, y0, bx + ux * 1.5, by + uy * 1.5, w)
  const seam = [[[x0, y0], [bx + ux * 0.6, by + uy * 0.6]]]
  // split: the head is its own sewn piece (part A) over the shaft, so the motion can nudge it
  if (oo.split) {
    const { split, ...rest } = oo
    return [
      felt(role, shaft, { seam, ...rest, part: rest.part || 'K' }),
      felt(role, head, { stitchMin: 1.3, inset: 0.8, ...rest, part: 'A' }),
    ]
  }
  // the parts travel with the piece, so the renderer can still split it when the icon needs an A head
  return { ...felt(role, P.fillet(P.unite(shaft, head), 0.7), { seam, ...oo }), arrowParts: { shaft, head } }
}
export const chevPts = (x, y, deg, arm = 6.5) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), k = arm / Math.SQRT2
  // tip at (x, y) pointing deg; arms back at +-45 degrees
  return [[x - k * c + k * s, y - k * s - k * c], [x, y], [x - k * c - k * s, y - k * s + k * c]]
}
export const chevron = (x, y, deg, arm = 6.5, o) => tube(opt(o).role || 'c1', chevPts(x, y, deg, arm), opt(o).w ?? 3.1, o)
export function slash(o) {
  const oo = opt(o)
  const a = oo.from || [4, 4], b = oo.to || [20, 20], w = oo.w ?? 2.6
  return [moat(P.seg(a[0], a[1], b[0], b[1], w), oo.gap ?? 1), tube(oo.role || 'c1', [a, b], w, { part: 'S', stitch: false, ...oo })]
}

// ---------------------------------------------------------------------------
// families: use these for every member of a family (file-*, folder-*, user-*, calendar-*)

// a sheet of felt with a folded dog-ear flap in the top-right corner
export function page(role = 'c3', flapRole = 'tint', x0 = 5, y0 = 2.75, x1 = 19, y1 = 21, f = 5, o) {
  const oo = opt(o)
  const sheet = P.cut(P.rr(x0, y0, x1, y1, 2.25), P.poly([[x1 - f, y0 - 3], [x1 + 3, y0 - 3], [x1 + 3, y0 + f]]))
  const body = P.round(sheet, 1.1)
  const flap = P.poly([[x1 - f, y0], [x1 - f, y0 + f - 0.75], [x1 - 0.75, y0 + f], [x1, y0 + f]], 0.7)
  return [felt(role, body, { part: 'K', ...oo }), felt(flapRole, flap, { part: 'A', stitch: false, out: 0.5 })]
}
// embroidered text lines on a page
export const textLines = (x0, x1, ys, o) => thread(ys.map((y, i) => [[x0, y], [Array.isArray(x1) ? x1[i] : x1, y]]), { w: 1.2, role: 'edge', ...opt(o) })
// folder: a back panel with a tab, and a front pocket
export function folder(back = 'c1', front = 'c2', o) {
  const oo = opt(o)
  const b = P.unite(P.rr(2.75, 5.5, 21.25, 19.5, 2.25), P.rr(2.75, 4, 10.5, 9, 2))
  const f = P.rr(2.75, 8.75, 21.25, 20.5, 2.25)
  return [felt(back, b, { part: 'K', stitch: false, ...oo }), felt(front, f, { part: 'K', ...oo })]
}
// a person: a round head and soft shoulders
// (a 0.8u neck gap, so the head sits on the shoulders, and a tall, wide shoulder dome)
export function person(cx = 12, top = 3, k = 1, head = 'c2', body = 'c3', o) {
  const r = 3.9 * k
  const hy = top + r
  const y0 = hy + r + 0.8 * k, bot = Math.min(21.25, y0 + 8.2 * k)
  const sh = P.round(P.clip(P.ellipse(cx, y0 + 8.2 * k, 8.6 * k, 8.2 * k), P.rect(0, 0, 24, bot)), 1.2)
  return [felt(body, sh, { part: 'K', ...opt(o) }), felt(head, P.circle(cx, hy, r), { part: 'K', ...opt(o) })]
}
// a calendar: cream page, coloured header band, two binder loops
export function calendar(page_ = 'tint', band = 'c1', ring = 'c3', o) {
  const body = P.rr(3, 5, 21, 21, 2.5)
  const head = P.clip(body, P.rect(0, 0, 24, 9.75))
  return [
    felt(page_, body, { part: 'K', inset: 0.85, ...opt(o) }),
    felt(band, head, { part: 'K', stitch: false, out: 0.5 }),
    tube(ring, [[8, 3], [8, 6.75]], 2, { part: 'A', stitch: false, out: 0.5 }),
    tube(ring, [[16, 3], [16, 6.75]], 2, { part: 'A', stitch: false, out: 0.5 }),
  ]
}
