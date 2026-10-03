// PLUSH primitives: every shape is a signed-distance FIELD on the 24 x 24 grid
// (negative inside, see _plush-field.mjs). Fields compose with cheap booleans and
// offset exactly, which is what a stuffed, puffy, round-everything style needs:
// grow / shrink / round / fillet are one call each.
//
// All functions are pure: they return a new field and never mutate their inputs.
// Angles are degrees, 0 = east, 90 = south (SVG y runs down).
import * as F from './_plush-field.mjs'
import { parsePath, simplify } from '../kernel/geom.mjs'

export const MARGIN = 1.6
const rad = d => d * Math.PI / 180
export const pt = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))]
export const isField = f => f instanceof Float32Array && f.length === F.NN

// ---------------------------------------------------------------------------
// shapes
export const circle = (cx, cy, r) => F.analytic((x, y) => { const u = x - cx, v = y - cy; return Math.sqrt(u * u + v * v) - r }, [cx - r, cy - r, cx + r, cy + r])
export const dot = (cx, cy, r = 1) => circle(cx, cy, r)
export function ellipse(cx, cy, rx, ry) {
  if (Math.abs(rx - ry) < 1e-6) return circle(cx, cy, rx)
  return F.analytic((x, y) => {
    const px = (x - cx) / rx, py = (y - cy) / ry
    const qx = px / rx, qy = py / ry, k0 = Math.sqrt(px * px + py * py), k1 = Math.sqrt(qx * qx + qy * qy)
    return k1 < 1e-9 ? -Math.min(rx, ry) : k0 * (k0 - 1) / k1
  }, [cx - rx, cy - ry, cx + rx, cy + ry])
}
export const ring = (cx, cy, ro, ri) => F.analytic((x, y) => { const u = x - cx, v = y - cy; return Math.abs(Math.sqrt(u * u + v * v) - (ro + ri) / 2) - (ro - ri) / 2 }, [cx - ro, cy - ro, cx + ro, cy + ro])
// rounded rectangle; r is a number or [tl, tr, br, bl]
export function rr(x0, y0, x1, y1, r = 2) {
  if (x1 < x0) [x0, x1] = [x1, x0]
  if (y1 < y0) [y0, y1] = [y1, y0]
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = (x1 - x0) / 2, hy = (y1 - y0) / 2
  const R = (Array.isArray(r) ? r : [r, r, r, r]).map(v => Math.max(0, Math.min(v, hx, hy)))
  return F.analytic((x, y) => {
    const dx = x - cx, dy = y - cy
    const rc = dx < 0 ? (dy < 0 ? R[0] : R[3]) : (dy < 0 ? R[1] : R[2])
    const qx = Math.abs(dx) - hx + rc, qy = Math.abs(dy) - hy + rc
    const mx = qx > 0 ? qx : 0, my = qy > 0 ? qy : 0
    return Math.sqrt(mx * mx + my * my) + Math.min(Math.max(qx, qy), 0) - rc
  }, [x0, y0, x1, y1])
}
export const rect = (x0, y0, x1, y1) => rr(x0, y0, x1, y1, 0)
export const pill = (x0, y0, x1, y1) => rr(x0, y0, x1, y1, Math.min(Math.abs(x1 - x0), Math.abs(y1 - y0)) / 2)
// round-capped bar between two points, width w
export function seg(ax, ay, bx, by, w = 2.5) {
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-9, h = w / 2
  return F.analytic((x, y) => {
    let t = ((x - ax) * dx + (y - ay) * dy) / L2
    t = t < 0 ? 0 : t > 1 ? 1 : t
    const ex = x - ax - dx * t, ey = y - ay - dy * t
    return Math.sqrt(ex * ex + ey * ey) - h
  }, [Math.min(ax, bx) - h, Math.min(ay, by) - h, Math.max(ax, bx) + h, Math.max(ay, by) + h])
}
// round-capped, round-joined polyline of width w
export const bar = (pts, w = 2.5, closed = false) => F.strokes([{ pts, closed }], w, MARGIN)
// arc of a circle as a round-capped band (a0 -> a1 clockwise on screen)
export function arcPts(cx, cy, r, a0, a1, step = 4) {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / step))
  return Array.from({ length: n + 1 }, (_, i) => pt(cx, cy, r, a0 + (a1 - a0) * i / n))
}
export const arc = (cx, cy, r, a0, a1, w = 2.5) => bar(arcPts(cx, cy, r, a0, a1), w)
// pie slice
export const sector = (cx, cy, r, a0, a1) => poly([[cx, cy], ...arcPts(cx, cy, r, a0, a1, 3)])
// circular segment (the cap cut off by a chord)
export const segment = (cx, cy, r, a0, a1) => poly(arcPts(cx, cy, r, a0, a1, 3))
const DIR = { n: -90, e: 0, s: 90, w: 180, ne: -45, se: 45, sw: 135, nw: -135 }
export const half = (cx, cy, r, dir = 'n') => { const a = DIR[dir] ?? dir; return segment(cx, cy, r, a - 90, a + 90) }
// closed polygon, every corner filleted with radius r (a number, or one per vertex):
// real tangent arcs, so a corner only ever loses what its own radius takes
export function roundPts(P, r = 0) {
  const n = P.length, R = Array.isArray(r) ? r : P.map(() => r), out = []
  for (let i = 0; i < n; i++) {
    const A = P[(i + n - 1) % n], B = P[i], C = P[(i + 1) % n], ri = R[i % R.length] || 0
    const a = [A[0] - B[0], A[1] - B[1]], c = [C[0] - B[0], C[1] - B[1]]
    const la = Math.hypot(...a), lc = Math.hypot(...c)
    if (ri <= 0 || la < 1e-6 || lc < 1e-6) { out.push(B); continue }
    const u1 = [a[0] / la, a[1] / la], u2 = [c[0] / lc, c[1] / lc]
    const cos = Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])), th = Math.acos(cos) / 2
    if (th < 1e-3 || th > Math.PI / 2 - 1e-3) { out.push(B); continue }
    let t = ri / Math.tan(th)
    const tmax = Math.min(la, lc) * 0.5
    const rr_ = t > tmax ? tmax * Math.tan(th) : ri
    t = Math.min(t, tmax)
    const bis = [u1[0] + u2[0], u1[1] + u2[1]], lb = Math.hypot(...bis)
    const ctr = [B[0] + bis[0] / lb * rr_ / Math.sin(th), B[1] + bis[1] / lb * rr_ / Math.sin(th)]
    const T1 = [B[0] + u1[0] * t, B[1] + u1[1] * t], T2 = [B[0] + u2[0] * t, B[1] + u2[1] * t]
    let a0 = Math.atan2(T1[1] - ctr[1], T1[0] - ctr[0]), a1 = Math.atan2(T2[1] - ctr[1], T2[0] - ctr[0])
    let d = a1 - a0
    while (d > Math.PI) d -= 2 * Math.PI
    while (d < -Math.PI) d += 2 * Math.PI
    const k = Math.max(2, Math.ceil(Math.abs(d) / 0.2))
    for (let j = 0; j <= k; j++) { const an = a0 + d * j / k; out.push([ctr[0] + rr_ * Math.cos(an), ctr[1] + rr_ * Math.sin(an)]) }
  }
  return out
}
export function poly(P, r = 0) {
  return F.region([r ? roundPts(P, r) : P], MARGIN)
}
// any closed SVG path data (even-odd)
export function path(d) {
  let subs = []
  try { subs = parsePath(d) } catch { subs = [] }
  const rings = subs.filter(s => s.pts.length > 2).map(s => s.pts)
  return rings.length ? F.region(rings, MARGIN) : F.field(MARGIN)
}
// any SVG path data stroked as a round-capped tube of width w
export function stroke(d, w = 2.5) {
  let subs = []
  try { subs = parsePath(d) } catch { subs = [] }
  return F.strokes(subs.map(s => ({ pts: s.pts, closed: s.closed })), w, MARGIN)
}
export const ngon = (cx, cy, r, n, rot = -90) => Array.from({ length: n }, (_, i) => pt(cx, cy, r, rot + i * 360 / n))
export const starPts = (cx, cy, ro, ri, n = 5, rot = -90) => Array.from({ length: 2 * n }, (_, i) => pt(cx, cy, i % 2 ? ri : ro, rot + i * 180 / n))
export const star = (cx, cy, ro, ri, n = 5, r = 0.9, rot = -90) => poly(starPts(cx, cy, ro, ri, n, rot), r)
// a lens (two circular arcs) from a to b, bulging h on each side
export function lens(ax, ay, bx, by, h = 3) {
  const L = Math.hypot(bx - ax, by - ay) / 2, mx = (ax + bx) / 2, my = (ay + by) / 2
  const R = (L * L + h * h) / (2 * h), off = R - h
  const nx = -(by - ay) / (2 * L), ny = (bx - ax) / (2 * L)
  return clip(circle(mx + nx * off, my + ny * off, R), circle(mx - nx * off, my - ny * off, R))
}
// a teardrop: round end (cx, cy, r) tapering to a tip at (tx, ty)
export function drop(cx, cy, r, tx, ty, rt = 0.5) {
  const d = Math.hypot(tx - cx, ty - cy), a = Math.atan2(ty - cy, tx - cx)
  const s = Math.asin(Math.min(0.99, (r - rt) / Math.max(d, 1e-6)))
  const p1 = [cx + r * Math.cos(a + Math.PI / 2 + s), cy + r * Math.sin(a + Math.PI / 2 + s)]
  const p2 = [cx + r * Math.cos(a - Math.PI / 2 - s), cy + r * Math.sin(a - Math.PI / 2 - s)]
  return unite(circle(cx, cy, r), poly([[cx, cy], p1, [tx, ty], p2]), circle(tx - rt * Math.cos(a), ty - rt * Math.sin(a), rt))
}
// the puffy heart, centred on (cx, cy), about 2*9*k wide
export function heart(cx = 12, cy = 12.5, k = 1) {
  const r = 4.6 * k
  const lobes = unite(circle(cx - 4 * k, cy - 3 * k, r), circle(cx + 4 * k, cy - 3 * k, r))
  const tip = poly([[cx - 8.3 * k, cy - 1.4 * k], [cx + 8.3 * k, cy - 1.4 * k], [cx, cy + 8.2 * k]], 1.6 * k)
  return fillet(unite(lobes, tip), 1.2 * k)
}
// a cloud: pill base with two bumps
export function cloud(cx = 12, cy = 13, k = 1) {
  return fillet(unite(
    pill(cx - 9 * k, cy - 0.5 * k, cx + 9 * k, cy + 6 * k),
    circle(cx - 3 * k, cy - 0.5 * k, 4.75 * k),
    circle(cx + 3.6 * k, cy + 0.6 * k, 3.6 * k),
  ), 1 * k)
}

// ---------------------------------------------------------------------------
// booleans and offsets
export function unite(...fs) {
  const L = fs.flat(Infinity).filter(isField)
  if (!L.length) return F.field(MARGIN)
  const G = F.copy(L[0])
  for (let k = 1; k < L.length; k++) F.union(G, L[k])
  return G
}
export function cut(a, ...bs) {
  const G = F.copy(a)
  for (const b of bs.flat(Infinity).filter(isField)) F.subtract(G, b)
  return G
}
export const clip = (a, b) => F.intersect(F.copy(a), b)
// exact signed distance near the edge (call before an offset of a boolean result)
export const exact = (f, reach = MARGIN) => F.exact(F.copy(f), reach)
export const grow = (f, d) => F.offset(F.exact(f, Math.abs(d) + 1.2), -d)
export const shrink = (f, d) => grow(f, -d)
// round every convex corner by r (morphological opening; drops parts thinner than 2r)
export const round = (f, r) => r > 0 ? F.open(F.copy(f), r) : f
// round every concave corner by r (closing)
export function fillet(f, r) {
  if (!(r > 0)) return f
  const g = F.offset(F.exact(f, r + 0.5), -r)
  return F.offset(F.exact(g, r + 0.5), r)
}
// both: a soft, inflated outline
export const puff = (f, r = 0.8, rc = r) => round(fillet(f, rc), r)

// ---------------------------------------------------------------------------
// transforms
export const move = (f, dx, dy) => F.warp(f, (x, y) => [x - dx, y - dy])
export function rot(f, deg, cx = 12, cy = 12) {
  const c = Math.cos(rad(-deg)), s = Math.sin(rad(-deg))
  return F.warp(f, (x, y) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c])
}
export const scale = (f, k, cx = 12, cy = 12) => F.warp(f, (x, y) => [cx + (x - cx) / k, cy + (y - cy) / k], k)
export const flipX = (f, ax = 12) => F.warp(f, (x, y) => [2 * ax - x, y])
export const flipY = (f, ay = 12) => F.warp(f, (x, y) => [x, 2 * ay - y])
export const around = (f, n, cx = 12, cy = 12, start = 0) => unite(...Array.from({ length: n }, (_, i) => rot(f, start + i * 360 / n, cx, cy)))

// ---------------------------------------------------------------------------
// polylines (for seams and threads)
export function linesOf(d) {
  let subs = []
  try { subs = parsePath(d) } catch { subs = [] }
  return subs.filter(s => s.pts.length).map(s => s.closed ? [...s.pts, s.pts[0]] : s.pts)
}
export const simplifyPts = (P, tol = 0.02) => P.length > 2 ? simplify(P, tol, false) : P
// field measures
export const depth = f => -F.minOf(f)            // inscribed radius (u)
export const area = f => F.inkArea(f)
export const at = (f, x, y) => F.sampleAt(f, x, y)
