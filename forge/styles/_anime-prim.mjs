// ANIME primitives — shapes on the 24 grid.
//
// A SHAPE is a list of closed rings (even-odd: a ring inside another is a hole).
// Every function here returns a shape (or a point list where noted). Booleans and
// strokes go through the distance field and come back as traced rings, so every
// result is again a plain shape that can be moved, rotated and combined.
//
// Angles are degrees, 0 = east, positive = clockwise (SVG y points down), so 90 = south.
import * as F from './_anime-field.mjs'
import { rings as pathRings, lines as pathLines } from './_anime-path.mjs'
import { M } from './_anime-tune.mjs'
import { resample } from '../kernel/geom.mjs'

const RAD = Math.PI / 180
const TAU = Math.PI * 2
const STEP = 0.35            // arc sampling pitch (u)
const segs = r => Math.max(10, Math.ceil(Math.abs(r) * TAU / STEP))
const pt = (cx, cy, r, deg) => [cx + r * Math.cos(deg * RAD), cy + r * Math.sin(deg * RAD)]

// ---------------------------------------------------------------------------
// basic shapes
export const circle = (cx, cy, r) => {
  const n = segs(r), out = []
  for (let i = 0; i < n; i++) out.push(pt(cx, cy, r, i * 360 / n))
  return [out]
}
export const ellipse = (cx, cy, rx, ry, deg = 0) => {
  const n = segs(Math.max(rx, ry)), out = [], c = Math.cos(deg * RAD), s = Math.sin(deg * RAD)
  for (let i = 0; i < n; i++) {
    const a = i * TAU / n, x = rx * Math.cos(a), y = ry * Math.sin(a)
    out.push([cx + x * c - y * s, cy + x * s + y * c])
  }
  return [out]
}
export const ring = (cx, cy, r0, r1) => [circle(cx, cy, Math.max(r0, r1))[0], circle(cx, cy, Math.min(r0, r1))[0].reverse()]
export const dot = (cx, cy, r = 1) => circle(cx, cy, r)
export const rect = (x0, y0, x1, y1) => [[[x0, y0], [x1, y0], [x1, y1], [x0, y1]]]

// polygon with rounded corners: r is one radius or one per vertex
export function poly(pts, r = 0) {
  const n = pts.length
  if (n < 3) return []
  const R = Array.isArray(r) ? r : pts.map(() => r)
  const out = []
  for (let i = 0; i < n; i++) {
    const P = pts[i], A = pts[(i + n - 1) % n], B = pts[(i + 1) % n]
    const rr = R[i] || 0
    const la = Math.hypot(A[0] - P[0], A[1] - P[1]), lb = Math.hypot(B[0] - P[0], B[1] - P[1])
    if (rr <= 0 || la < 1e-6 || lb < 1e-6) { out.push(P); continue }
    const u = [(A[0] - P[0]) / la, (A[1] - P[1]) / la], v = [(B[0] - P[0]) / lb, (B[1] - P[1]) / lb]
    const cosT = Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))
    const half = Math.acos(cosT) / 2
    if (half < 1e-3 || half > Math.PI / 2 - 1e-3) { out.push(P); continue }
    let t = rr / Math.tan(half)
    const tmax = Math.min(la, lb) * 0.499
    if (t > tmax) t = tmax
    const re = t * Math.tan(half)
    const bis = [u[0] + v[0], u[1] + v[1]], bl = Math.hypot(...bis)
    const C = [P[0] + bis[0] / bl * re / Math.sin(half), P[1] + bis[1] / bl * re / Math.sin(half)]
    const T1 = [P[0] + u[0] * t, P[1] + u[1] * t], T2 = [P[0] + v[0] * t, P[1] + v[1] * t]
    let a1 = Math.atan2(T1[1] - C[1], T1[0] - C[0]), a2 = Math.atan2(T2[1] - C[1], T2[0] - C[0])
    let d = a2 - a1
    while (d > Math.PI) d -= TAU
    while (d < -Math.PI) d += TAU
    const k = Math.max(2, Math.ceil(Math.abs(d) * re / 0.3))
    for (let j = 0; j <= k; j++) { const a = a1 + d * j / k; out.push([C[0] + re * Math.cos(a), C[1] + re * Math.sin(a)]) }
  }
  return [out]
}
// rounded rectangle; r = radius or [tl, tr, br, bl]
export const rr = (x0, y0, x1, y1, r = 2) => {
  const R = Array.isArray(r) ? r : [r, r, r, r]
  return poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], R)
}
export const pill = (x0, y0, x1, y1) => rr(x0, y0, x1, y1, Math.min(x1 - x0, y1 - y0) / 2)
export const tri = (a, b, c, r = 0.8) => poly([a, b, c], r)
// regular polygon
export const ngon = (cx, cy, r, n, deg = -90, round = 0) => poly(Array.from({ length: n }, (_, i) => pt(cx, cy, r, deg + i * 360 / n)), round)
// star with n points: outer R, inner r
export const star = (cx, cy, R, r, n = 5, deg = -90, round = 0) => {
  const P = []
  for (let i = 0; i < 2 * n; i++) P.push(pt(cx, cy, i % 2 ? r : R, deg + i * 180 / n))
  return poly(P, Array.isArray(round) ? round : P.map((_, i) => i % 2 ? round * 0.6 : round))
}
// four-point anime sparkle (concave sides): radius r, waist w (fraction), rotation deg
export function sparkle(cx, cy, r, w = 0.2, deg = 0, sy = 1) {
  const out = []
  for (let q = 0; q < 4; q++) {
    const a0 = (deg + q * 90) * RAD, a1 = (deg + (q + 1) * 90) * RAD
    const tip = [cx + r * Math.cos(a0), cy + r * sy * Math.sin(a0)], tip2 = [cx + r * Math.cos(a1), cy + r * sy * Math.sin(a1)]
    const am = (a0 + a1) / 2, waist = [cx + r * w * Math.cos(am), cy + r * w * sy * Math.sin(am)]
    // quadratic tip -> waist -> next tip, pulled towards the centre
    for (let j = 0; j < 8; j++) {
      const t = j / 8, u = 1 - t
      out.push([u * u * tip[0] + 2 * u * t * waist[0] + t * t * tip2[0], u * u * tip[1] + 2 * u * t * waist[1] + t * t * tip2[1]])
    }
  }
  return [out]
}
// a lens (leaf / eye shape) from (x0,y0) to (x1,y1) with bulge b on each side
export function lens(x0, y0, x1, y1, b = 2) {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L
  const out = [], n = 18
  for (const s of [1, -1]) for (let i = 0; i <= n; i++) {
    const t = s > 0 ? i / n : 1 - i / n, h = 4 * t * (1 - t) * b * s
    if (s < 0 && (i === 0 || i === n)) continue
    out.push([x0 + (x1 - x0) * t + nx * h, y0 + (y1 - y0) * t + ny * h])
  }
  return [out]
}
// a drop: round end centred (cx,cy) radius r, pointing to (tx,ty)
export function drop(cx, cy, r, tx, ty) {
  const d = Math.hypot(tx - cx, ty - cy)
  if (d <= r * 1.05) return circle(cx, cy, r)
  const base = Math.atan2(ty - cy, tx - cx), half = Math.acos(r / d)
  const out = [], n = segs(r)
  const a0 = base + half, a1 = base - half + TAU
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  out.push([tx, ty])
  return [out]
}
// arch: a rectangle with a half-disc top (door, window, tombstone); dir 'n' only top round
export function arch(x0, y0, x1, y1, rb = 0) {
  const r = (x1 - x0) / 2, cx = (x0 + x1) / 2, out = []
  const n = segs(r) / 2
  for (let i = 0; i <= n; i++) out.push(pt(cx, y0 + r, r, 180 + 180 * i / n))
  if (rb > 0) return poly([...out.slice(0, -1), [x1, y1], [x0, y1]], [...out.slice(0, -1).map(() => 0), rb, rb]).map(r0 => r0)
  out.push([x1, y1], [x0, y1])
  return [out]
}
// pie sector from a0 to a1 (degrees, clockwise)
export function sector(cx, cy, r, a0, a1) {
  const out = [[cx, cy]], n = Math.max(4, Math.ceil(segs(r) * Math.abs(a1 - a0) / 360))
  for (let i = 0; i <= n; i++) out.push(pt(cx, cy, r, a0 + (a1 - a0) * i / n))
  return [out]
}
// points along an arc (for strokes)
export const arcPts = (cx, cy, r, a0, a1) => {
  const n = Math.max(4, Math.ceil(segs(r) * Math.abs(a1 - a0) / 360)), out = []
  for (let i = 0; i <= n; i++) out.push(pt(cx, cy, r, a0 + (a1 - a0) * i / n))
  return out
}
// closed subpaths of SVG path data
export const path = d => pathRings(d)

// ---------------------------------------------------------------------------
// transforms
const mapS = (sh, f) => sh.map(r => r.map(f))
export const move = (sh, dx, dy) => mapS(sh, p => [p[0] + dx, p[1] + dy])
export const rot = (sh, deg, cx = 12, cy = 12) => {
  const c = Math.cos(deg * RAD), s = Math.sin(deg * RAD)
  return mapS(sh, p => { const x = p[0] - cx, y = p[1] - cy; return [cx + x * c - y * s, cy + x * s + y * c] })
}
export const scale = (sh, sx, sy = sx, cx = 12, cy = 12) => {
  const out = mapS(sh, p => [cx + (p[0] - cx) * sx, cy + (p[1] - cy) * sy])
  return sx * sy < 0 ? out.map(r => r.slice().reverse()) : out
}
export const flipX = (sh, cx = 12) => scale(sh, -1, 1, cx, 12)
export const flipY = (sh, cy = 12) => scale(sh, 1, -1, 12, cy)
export const join = (...shs) => shs.flat().filter(r => r && r.length > 2)
// rotate copies of a shape around (cx,cy): n copies
export const around = (sh, n, cx = 12, cy = 12, deg0 = 0) => join(...Array.from({ length: n }, (_, i) => rot(sh, deg0 + i * 360 / n, cx, cy)))

// ---------------------------------------------------------------------------
// field bridge
const MG = M.MARGIN
export const toField = (sh, margin = MG) => F.region(Array.isArray(sh) ? sh : [], margin)
export const fromField = (G, tol = 0.02) => F.trace(G, tol, 0.04)

// round-capped stroke of a polyline / path data / list of lines, width w
export function stroke(src, w = 2, closed = false) {
  const L = asLines(src, closed)
  if (!L.length) return []
  return fromField(F.strokes(L, w, MG))
}
// arc band with round caps
export const arc = (cx, cy, r, a0, a1, w = 2) => stroke(arcPts(cx, cy, r, a0, a1), w)
// polyline with round caps and joins
export const bar = (pts, w = 2) => stroke(pts, w)
export const seg = (x0, y0, x1, y1, w = 2) => stroke([[x0, y0], [x1, y1]], w)

export function asLines(src, closed = false) {
  if (!src) return []
  if (typeof src === 'string') return pathLines(src)
  if (Array.isArray(src) && src.length && typeof src[0][0] === 'number') return [{ pts: src, closed }]
  if (Array.isArray(src)) return src.flatMap(s => s && s.pts ? [s] : asLines(s, closed))
  if (src.pts) return [src]
  return []
}

// ---------------------------------------------------------------------------
// booleans (through the field)
export const unite = (...shs) => {
  const G = F.field(MG)
  for (const s of shs) if (s && s.length) F.region(s, MG, G)
  return fromField(G)
}
export const cut = (a, ...bs) => {
  const G = toField(a)
  for (const b of bs) if (b && b.length) F.subtract(G, toField(b))
  return fromField(G)
}
export const clip = (a, b) => fromField(F.intersect(toField(a), toField(b)))
// grow (d > 0) or shrink (d < 0) a shape by d (|d| < 1.5)
export const grow = (sh, d) => fromField(F.offset(toField(sh), -d))
// soften: round every convex and concave corner by r (opening then closing)
export const closeF = (G, r) => {
  let g = F.redistance(G, F.contour(F.copy(G)), r + 0.5)
  F.offset(g, -r)
  g = F.redistance(g, F.contour(F.copy(g)), r + 0.5)
  return F.offset(g, r)
}
export const soften = (sh, r = 0.6) => fromField(closeF(F.open(toField(sh), r), r))

// resample a polyline to points at a fixed pitch (closed: no repeated end point)
export function resamplePts(pts, pitch = 0.3, closed = false) {
  if (!pts || pts.length < 2) return pts ? pts.slice() : []
  const out = resample(pts, pitch, closed).map(o => o.p)
  if (closed && out.length > 2) {
    const a = out[0], b = out.at(-1)
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < pitch * 0.5) out.pop()
  }
  return out.length ? out : pts.slice()
}

// a smooth curve through the given points (Catmull-Rom), as a point list for strokes / ink / tubes
export function curve(P, steps = 8) {
  if (!P || P.length < 3) return P ? P.slice() : []
  const out = []
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t
      out.push([0, 1].map(a => 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)))
    }
  }
  out.push(P.at(-1).slice())
  return out
}
