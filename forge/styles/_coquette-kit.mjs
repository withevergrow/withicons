// COQUETTE kit: the style's vocabulary for hand-composed redraws (FROZEN after the art
// director's pass; see forge/styles/COQUETTE-GUIDE.md).
//
// Two kinds of thing:
//   SHAPES  return a signed distance FIELD (Float32Array, negative inside) in icon units
//           on the 24 x 24 canvas: disc, ellipse, rr, pill, poly, path, tube, ring,
//           heartShape, union, cut, inter, grow, inset, move, around, mirror ...
//   PARTS   return a part object (or an array of parts) for paint(): a shape dressed in a
//           material and tagged with a motion plate. body / rose / cream / gold / ribbon
//           for the object; bow, pearl, pearls, heart, lace, sparkle, scallops for the
//           ornaments (all plate 'deco' unless you say otherwise).
//
// A redraw returns an array (nested arrays are flattened) of parts, painted back to front.
import { parsePath } from '../kernel/geom.mjs'
import * as F from './_coquette-field.mjs'
import { exact, minus, mv, erode, measure } from './_coquette-paint.mjs'

const M = 2.4 // field margin (reach of distances outside a shape)
const D2R = Math.PI / 180

// ---------------------------------------------------------------------------
// SHAPES (fields)
const ringOf = pts => pts.length > 2 ? [pts] : []
export const empty = () => F.field(M)
export function disc(cx, cy, r) {
  const f = F.field(M)
  return F.strokes([{ pts: [[cx, cy]], closed: false }], 2 * r, M, f)
}
export const circle = disc
export function ellipse(cx, cy, rx, ry, rot = 0) {
  const pts = []
  for (let k = 0; k < 72; k++) {
    const t = k / 72 * 2 * Math.PI, x = rx * Math.cos(t), y = ry * Math.sin(t)
    const c = Math.cos(rot * D2R), s = Math.sin(rot * D2R)
    pts.push([cx + x * c - y * s, cy + x * s + y * c])
  }
  return F.region(ringOf(pts), M)
}
// a ring (annulus) of centre radius r and width w
export const ring = (cx, cy, r, w = 2) => tube(circlePts(cx, cy, r), w, true)
export const circlePts = (cx, cy, r, a0 = 0, a1 = 360, n = 0) => {
  const k = n || Math.max(8, Math.ceil(Math.abs(a1 - a0) / 5)), out = []
  const full = Math.abs(a1 - a0) >= 360
  for (let i = 0; i < (full ? k : k + 1); i++) { const a = (a0 + (a1 - a0) * i / k) * D2R; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return out
}
// rounded rectangle; r is a number or [tl, tr, br, bl]
export function rr(x0, y0, x1, y1, r = 2) {
  const R = Array.isArray(r) ? r : [r, r, r, r]
  const lim = Math.min(x1 - x0, y1 - y0) / 2
  const [tl, tr, br, bl] = R.map(v => Math.max(0, Math.min(v, lim)))
  const pts = []
  const corner = (cx, cy, rad, a0) => { if (rad <= 0) { pts.push([cx + Math.cos(a0 * D2R) * 0 , cy]); return } for (let k = 0; k <= 8; k++) { const a = (a0 + 90 * k / 8) * D2R; pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]) } }
  if (tl > 0) corner(x0 + tl, y0 + tl, tl, 180); else pts.push([x0, y0])
  if (tr > 0) corner(x1 - tr, y0 + tr, tr, 270); else pts.push([x1, y0])
  if (br > 0) corner(x1 - br, y1 - br, br, 0); else pts.push([x1, y1])
  if (bl > 0) corner(x0 + bl, y1 - bl, bl, 90); else pts.push([x0, y1])
  return F.region([pts], M)
}
export const rect = (x0, y0, x1, y1) => rr(x0, y0, x1, y1, 0)
export const pill = (x0, y0, x1, y1) => rr(x0, y0, x1, y1, Math.min(x1 - x0, y1 - y0) / 2)
// a polygon with every convex corner rounded to r
export function poly(pts, r = 0.8) {
  const f = F.region([pts], M)
  return r > 0 ? F.open(f, r) : f
}
// an arch: a rectangle whose top is a half disc (door, window, tombstone)
export const arch = (x0, y0, x1, y1) => union(rr(x0, y0 + (x1 - x0) / 2, x1, y1, 0), disc((x0 + x1) / 2, y0 + (x1 - x0) / 2, (x1 - x0) / 2))
// the filled region of SVG path data (every subpath closed, even-odd)
export function path(d) {
  let subs = []
  try { subs = parsePath(d) } catch { return F.field(M) }
  return F.region(subs.map(s => s.pts).filter(r => r.length > 2), M)
}
// a round-capped, round-joined band of width w along SVG path data, or along points
export function tube(d, w = 2, closed = false) {
  if (Array.isArray(d)) return F.strokes([{ pts: d, closed }], w, M)
  let subs = []
  try { subs = parsePath(d) } catch { return F.field(M) }
  return F.strokes(subs.map(s => ({ pts: s.pts, closed: s.closed })), w, M)
}
export const stroke = tube
// a line from (x0,y0) to (x1,y1)
export const seg = (x0, y0, x1, y1, w = 2) => F.strokes([{ pts: [[x0, y0], [x1, y1]], closed: false }], w, M)
// the classic heart curve, w wide, centred at (cx, cy), tilted rot degrees
export function heartPts(cx, cy, w, rot = 0, n = 64) {
  const s = w / 32, c = Math.cos(rot * D2R), sn = Math.sin(rot * D2R), out = []
  for (let k = 0; k < n; k++) {
    const t = k / n * 2 * Math.PI
    const x = 16 * Math.sin(t) ** 3
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2.2
    out.push([cx + (x * c - y * sn) * s, cy + (x * sn + y * c) * s])
  }
  return out
}
// (the point is softened a touch, so it never thins to a needle)
export const heartShape = (cx, cy, w, rot = 0) => F.open(F.region([heartPts(cx, cy, w, rot)], M), Math.min(0.6, w * 0.035))
// five-point star
export function starPts(cx, cy, R, r, n = 5, rot = -90) {
  const out = []
  for (let k = 0; k < 2 * n; k++) { const a = (rot + k * 180 / n) * D2R, q = k % 2 ? r : R; out.push([cx + q * Math.cos(a), cy + q * Math.sin(a)]) }
  return out
}
export const star = (cx, cy, R, r, round = 0.6, n = 5) => poly(starPts(cx, cy, R, r, n), round)
// booleans (new fields; inputs untouched)
export function union(...fs) { const f = F.field(M); for (const g of fs.flat(Infinity)) if (g) F.union(f, g); return f }
export function cut(a, ...bs) { let f = F.copy(a); for (const b of bs.flat(Infinity)) if (b) F.subtract(f, b); return f }
export function inter(a, ...bs) { let f = F.copy(a); for (const b of bs.flat(Infinity)) if (b) F.intersect(f, b); return f }
// grow / shrink a shape by e (exact)
export const grow = (f, e) => erode(exact(f), -e)
export const inset = (f, e) => erode(exact(f), e)
// a moat: cut b grown by gap out of a
export const moat = (a, b, gap = 0.7) => cut(a, grow(b, gap))
// the outline band of a shape, w wide, inside its edge
export const outline = (f, w = 1) => { const E = exact(f); return minus(E, erode(E, w)) }
// move a shape (snaps to 0.1u)
export const move = (f, dx, dy) => mv(exact(f), dx, dy)
// mirror a shape about x = ax (vertical axis) or y = ay
export function mirrorX(f, ax = 12) {
  const g = F.field(M), N = F.N, k = Math.round(2 * ax / F.H)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const s = k - i; if (s >= 0 && s < N) g[j * N + i] = f[j * N + s] }
  return g
}
export function mirrorY(f, ay = 12) {
  const g = F.field(M), N = F.N, k = Math.round(2 * ay / F.H)
  for (let j = 0; j < N; j++) { const s = k - j; if (s >= 0 && s < N) g.set(f.subarray(s * N, s * N + N), j * N) }
  return g
}
// a half-plane: the side of the line through (x,y) at deg that the normal (sin, -cos) points to
export function side(x, y, deg) {
  const f = F.field(M), nx = Math.sin(deg * D2R), ny = -Math.cos(deg * D2R)
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) f[j * F.N + i] = -((i * F.H - x) * nx + (j * F.H - y) * ny)
  return f
}
export const area = f => measure(f).area
export const box = f => measure(f).box

// points along SVG path data (or a point list) every `step` units
export function along(d, step = 2, closed = false) {
  let polys
  if (Array.isArray(d)) polys = [{ pts: d, closed }]
  else { try { polys = parsePath(d).map(s => ({ pts: s.pts, closed: s.closed })) } catch { polys = [] } }
  const out = []
  for (const { pts, closed: c } of polys) {
    const P = c ? [...pts, pts[0]] : pts
    let L = 0
    const seglen = []
    for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seglen.push(l); L += l }
    if (L < 1e-6) { if (P.length) out.push(P[0]); continue }
    const n = Math.max(1, Math.round(L / step)), st = L / n
    for (let k = 0; k <= (c ? n - 1 : n); k++) {
      let t = k * st, i = 0
      while (i < seglen.length - 1 && t > seglen[i]) { t -= seglen[i]; i++ }
      const u = seglen[i] ? Math.min(1, t / seglen[i]) : 0
      out.push([P[i][0] + (P[i + 1][0] - P[i][0]) * u, P[i][1] + (P[i + 1][1] - P[i][1]) * u])
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// PARTS (materials)
//   opts: { plate: 'K'|'A'|'S'|'deco', ow (outline width), flat, detail (field of ink
//           detail drawn on top), noShadow, sheenBias }
const part = (f, mat, plate, o = {}) => ({ f, mat, plate, ...o })
export const body = (f, o = {}) => part(f, o.mat || 'blush', o.plate || 'K', o)
export const blush = (f, o = {}) => part(f, 'blush', o.plate || 'K', o)
export const rose = (f, o = {}) => part(f, 'rose', o.plate || 'A', o)
export const cream = (f, o = {}) => part(f, 'cream', o.plate || 'K', o)
export const gold = (f, o = {}) => part(f, 'gold', o.plate || 'A', o)
export const satin = (f, o = {}) => part(f, 'ribbon', o.plate || 'S', o) // ribbon-red satin
export const flat = (f, role = 'c4', o = {}) => ({ f, mat: 'flat', plate: o.plate || 'K', flat: true, flatRole: role, ...o })
// ink detail: lines (SVG path data) w wide, drawn as their own flat part in the ink colour
export const ink = (d, w = 1.1, o = {}) => ({ f: typeof d === 'string' || Array.isArray(d) ? tube(d, w) : d, mat: 'inkflat', plate: o.plate || 'K', flat: true, noShadow: true, ...o })
export const detail = ink
// a flat fill in any role (text on a badge, a glyph): no shading, no outline
export const fill = (f, role = 'edge', o = {}) => ({ f, mat: 'fill:' + role, plate: o.plate || 'K', flat: true, noShadow: true, ...o })

// ---------------------------------------------------------------------------
// ORNAMENTS (plate 'deco' by default: they keep still while the object animates)

// THE BOW: two satin loops, a knot and two fishtail tails. (x, y) is the knot centre,
// s the scale (1 = 9u wide), rot the tilt in degrees.
export function bow(x, y, s = 0.75, rot = 0, o = {}) {
  const mat = o.mat || 'ribbon', plate = o.plate || 'deco'
  const c = Math.cos(rot * D2R), sn = Math.sin(rot * D2R)
  const T = ([px, py]) => [x + (px * c - py * sn) * s, y + (px * sn + py * c) * s]
  const P = pts => pts.map(T)
  const bez = (p0, p1, p2, p3, n = 14) => Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n, m = 1 - t
    return [m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0], m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]]
  })
  // right loop (mirrored for the left): a plump teardrop sweeping up and out from the knot
  const loopR = [...bez([0.45, -0.6], [1.3, -3.9], [5.3, -4.3], [5.05, -1.35]), ...bez([5.05, -1.35], [4.9, 0.85], [2.2, 1.05], [0.45, 0.6]).slice(1)]
  const loopL = loopR.map(([px, py]) => [-px, py])
  // tails: ribbon ends falling from the knot, cut in a fishtail
  const tailR = [[0.35, 0.3], [1.5, 0.55], [3.4, 4.15], [2.55, 3.8], [2.0, 4.75], [0.15, 1.1]]
  const tailL = tailR.map(([px, py]) => [-px, py])
  const lw = Math.max(0.3, Math.min(0.5, 0.42 * s))
  const fold = pts => tube(P(pts), 0.36 * s)
  const tails = union(F.region([P(tailR)], M), F.region([P(tailL)], M))
  const loops = union(F.region([P(loopR)], M), F.region([P(loopL)], M))
  const knot = ellipse(x, y, 1.15 * s, 1.3 * s, rot)
  // inner folds: a short crease inside each loop toward the knot
  const creases = union(fold(bez([1.2, -0.55], [2.0, -1.9], [3.1, -2.3], [3.6, -1.6], 8)), fold(bez([-1.2, -0.55], [-2.0, -1.9], [-3.1, -2.3], [-3.6, -1.6], 8)))
  return [
    { f: tails, mat, plate, ow: lw, ...o, sheenBias: -1 },
    { f: loops, mat, plate, ow: lw, ...o, detail: s >= 0.6 ? inter(creases, inset(loops, 0.3)) : null },
    { f: knot, mat, plate, ow: lw, ...o },
  ]
}
// one pearl (cream, pink shade, bright sheen)
export const pearl = (x, y, r = 1.1, o = {}) => ({ f: disc(x, y, r), mat: 'pearl', plate: o.plate || 'deco', ow: pearlLine(r), ...o })
const pearlLine = r => r < 0.8 ? 0.26 : r < 1.1 ? 0.32 : 0.42
// a string of pearls along SVG path data (or points), pearls of radius r
export function pearls(d, r = 0.9, o = {}) {
  const pts = along(d, o.step || 2 * r + 0.15, o.closed)
  const f = union(pts.map(([x, y]) => disc(x, y, r)))
  // a string casts no shadow of its own: it lies on the object (and a wavy shadow under a
  // row of beads is bytes the eye never sees at 24px)
  return { f, mat: 'pearl', plate: o.plate || 'deco', ow: pearlLine(r), noShadow: true, ...o }
}
// a little heart accent (ribbon red by default)
export const heart = (x, y, w = 3, rot = 0, o = {}) => ({ f: heartShape(x, y, w, rot), mat: o.mat || 'ribbon', plate: o.plate || 'deco', ow: w < 3.5 ? 0.5 : 0.75, ...o })
// a four-point twinkle in gold (or shine)
export function sparkle(x, y, r = 1.6, o = {}) {
  const q = r * 0.28, pts = []
  for (let k = 0; k < 8; k++) { const a = (k * 45 - 90) * D2R, l = k % 2 ? q : r; pts.push([x + l * Math.cos(a), y + l * Math.sin(a)]) }
  return { f: F.region([pts], M), mat: o.mat || 'gold', plate: o.plate || 'deco', noShadow: true, flat: o.flat ?? true, flatRole: o.role || 'accent', ...o }
}
// scalloped LACE trim along SVG path data (or points): a band of semicircle scallops
// with an eyelet punched in each. side: 1 = scallops to the left of travel, -1 = right.
// Paint it BEFORE the body it trims, so only the scallops peek out.
export function lace(d, r = 1, o = {}) {
  const pts = along(d, o.step || 1.9 * r, o.closed)
  const band = typeof d === 'string' || Array.isArray(d) ? tube(d, (o.band || 1.2) * r, o.closed) : F.field(M)
  let f = union(band, pts.map(([x, y]) => disc(x, y, r)))
  if (o.eyelets !== false && r >= 0.8) f = cut(f, union(pts.map(([x, y]) => disc(x, y, r * 0.3))))
  // lace casts no shadow of its own; a closed frill (a doily round a button) has no shade either
  return { f, mat: 'lace', plate: o.plate || 'deco', ow: 0.5, noShadow: true, noShade: !!o.closed, ...o }
}
// a lace doily: scallops all round a shape, grown out from its edge by `out`
export function laceRing(shape, r = 0.9, out = 0.6, o = {}) {
  const E = exact(shape)
  const G = erode(E, -out)
  const loopsOf = F.contour(F.copy(G))
  const pts = loopsOf.flatMap(l => along(l, (o.step || 1.9) * r, true))
  let f = union(G, pts.map(([x, y]) => disc(x, y, r)))
  // eyelets only on request: round a whole button they are 30+ pinholes of noise at 24px
  if (o.eyelets === true && r >= 0.8) f = cut(f, union(pts.map(([x, y]) => disc(x, y, r * 0.3))))
  // a doily is see-through work: no cast shadow and no shade crescent of its own (the object
  // carries both): half the bytes of a shaded frill, and crisper at 16px
  return { f, mat: 'lace', plate: o.plate || 'deco', ow: 0.5, noShadow: true, noShade: true, ...o }
}
// a satin ribbon band of width w along a path (a strap, a sash)
export const ribbon = (d, w = 2, o = {}) => ({ f: tube(d, w), mat: 'ribbon', plate: o.plate || 'A', ...o })
// a gold chain or fine wire
export const wire = (d, w = 1.1, o = {}) => ({ f: tube(d, w), mat: 'gold', plate: o.plate || 'A', ow: 0.4, ...o })
