// GOTHIC primitives: shapes as signed distance fields on the 24u grid (negative inside).
// Every function returns a fresh field; booleans return new fields too (inputs are never
// modified), so shapes can be reused freely inside a redraw.
import { parsePath } from '../kernel/geom.mjs'
import * as F from './_gothic-field.mjs'
import { exact, circlePts, foil as foilF } from './_gothic-paint.mjs'

const M = 0.8
const rad = d => d * Math.PI / 180
const ringOf = pts => pts.length > 1 && pts[0][0] === pts.at(-1)[0] && pts[0][1] === pts.at(-1)[1] ? pts.slice(0, -1) : pts

// ---- point helpers --------------------------------------------------------
// points along a circular arc (degrees, 0 = east, 90 = south; a1 may be < a0)
export function arcPts(cx, cy, r, a0, a1, step = 0.25) {
  const n = Math.max(2, Math.ceil(Math.abs(rad(a1 - a0)) * r / step))
  const out = []
  for (let k = 0; k <= n; k++) { const a = rad(a0 + (a1 - a0) * k / n); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return out
}
// the pointed (ogive) arch outline: walls from the base up to the springing line, two arcs
// meeting at the apex. k = arc radius / width (0.5 round arch, 1 equilateral, > 1 lancet)
export function lancetPts(x0, top, x1, bottom, k = 1) {
  const w = x1 - x0, r = Math.max(w / 2 + 1e-3, k * w), mid = (x0 + x1) / 2
  const dy = Math.sqrt(Math.max(0, r * r - (mid - x0 - r) ** 2))
  const ys = Math.min(bottom, top + dy)
  // left arc: centre (x0 + r, ys) from 180deg towards the apex; right arc mirrored
  const ang = Math.atan2(top - ys, mid - (x0 + r)) * 180 / Math.PI // in (-180, -90]
  const left = arcPts(x0 + r, ys, r, 180, 360 + ang)
  const right = left.map(p => [x0 + x1 - p[0], p[1]]).reverse()
  return [[x0, bottom], ...left, ...right.slice(1), [x1, bottom]]
}

// ---- shapes ---------------------------------------------------------------
export const region = (...rings) => F.region(rings.map(ringOf).filter(r => r.length > 2), M)
export const poly = pts => region(pts)
export const circle = (cx, cy, r) => region(circlePts(cx, cy, r))
export const ellipse = (cx, cy, rx, ry) => region(circlePts(0, 0, 1, 64).map(([x, y]) => [cx + x * rx, cy + y * ry]))
export const rect = (x0, y0, x1, y1) => region([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
// rounded rectangle; r is a number or [tl, tr, br, bl]
export function rr(x0, y0, x1, y1, r = 2) {
  const [a, b, c, d] = Array.isArray(r) ? r : [r, r, r, r]
  const pts = []
  const corner = (cx, cy, rr, a0) => { if (rr <= 0) pts.push([cx, cy]); else pts.push(...arcPts(cx + (a0 === 180 || a0 === 90 ? rr : -rr), cy + (a0 === 180 || a0 === 270 ? rr : -rr), rr, a0, a0 + 90)) }
  corner(x0, y0, a, 180); corner(x1, y0, b, 270); corner(x1, y1, c, 0); corner(x0, y1, d, 90)
  return region(pts)
}
export const lancet = (x0, top, x1, bottom, k = 1) => region(lancetPts(x0, top, x1, bottom, k))
// any closed SVG path (even-odd)
export function path(d) { const subs = parsePath(d); return region(...subs.map(s => s.pts)) }
// a round-capped band along an SVG path, a point list, or a list of point lists
export function stroke(d, w = 2, closed = false) {
  const polys = typeof d === 'string' ? parsePath(d).map(s => ({ pts: s.pts, closed: s.closed }))
    : Array.isArray(d[0][0]) ? d.map(p => ({ pts: p, closed })) : [{ pts: d, closed }]
  return F.strokes(polys, w, M)
}
export const seg = (x0, y0, x1, y1, w = 2) => F.strokes([{ pts: [[x0, y0], [x1, y1]] }], w, M)
export const ring = (cx, cy, r, w = 1.5) => F.strokes([{ pts: circlePts(cx, cy, r).slice(0, -1), closed: true }], w, M)
export const arc = (cx, cy, r, a0, a1, w = 1.5) => F.strokes([{ pts: arcPts(cx, cy, r, a0, a1) }], w, M)
export const dot = (cx, cy, r = 0.8) => circle(cx, cy, r)
// n-lobed foil: trefoil (3), quatrefoil (4), cinquefoil (5); rot is the first lobe's angle
export const foil = (cx, cy, R, n = 4, rot = -90) => foilF(cx, cy, R, n, rot)
export function star(cx, cy, R, r, n = 5, rot = -90) {
  const pts = []
  for (let k = 0; k < 2 * n; k++) { const a = rad(rot + 180 * k / n), q = k % 2 ? r : R; pts.push([cx + q * Math.cos(a), cy + q * Math.sin(a)]) }
  return region(pts)
}
export function ngon(cx, cy, R, n = 6, rot = -90) {
  const pts = []
  for (let k = 0; k < n; k++) { const a = rad(rot + 360 * k / n); pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]) }
  return region(pts)
}
// a wall with merlons along its top edge: n merlons of height mh
export function crenel(x0, y0, x1, y1, n = 3, mh = 2) {
  const w = (x1 - x0) / (2 * n - 1), pts = [[x0, y1], [x0, y0]]
  for (let k = 0; k < n; k++) {
    const a = x0 + 2 * k * w
    if (k) pts.push([a, y0 + mh])
    pts.push([a, y0], [a + w, y0])
    if (k < n - 1) pts.push([a + w, y0 + mh])
  }
  pts.push([x1, y1])
  return region(pts)
}
// a slender pinnacle: a steep triangle on a base
export const spire = (cx, base, top, w = 3) => region([[cx - w / 2, base], [cx, top], [cx + w / 2, base]])
// a gear: n teeth between radius r0 (root) and r1 (tip)
export function gear(cx, cy, r0, r1, n = 8, duty = 0.5) {
  const pts = []
  for (let k = 0; k < n; k++) {
    const a = 360 * k / n, h = 360 / n * duty / 2, s = 360 / n * 0.08
    pts.push(...arcPts(cx, cy, r0, a - 180 / n, a - h - s, 0.4))
    pts.push(...arcPts(cx, cy, r1, a - h + s, a + h - s, 0.4))
    pts.push(...arcPts(cx, cy, r0, a + h + s, a + 180 / n, 0.4).slice(0, -1))
  }
  return region(pts.map(p => p))
}

// ---- booleans and transforms (all return new fields) ------------------------
export function union(...fs) { const live = fs.flat().filter(Boolean); const u = F.copy(live[0] || F.field(M)); for (let i = 1; i < live.length; i++) F.union(u, live[i]); return u }
export function cut(a, ...bs) { const u = F.copy(a); for (const b of bs.flat().filter(Boolean)) F.subtract(u, b); return u }
export function inter(a, ...bs) { const u = F.copy(a); for (const b of bs.flat().filter(Boolean)) F.intersect(u, b); return u }
export const grow = (f, e) => { const x = exact(f, Math.abs(e) + 1.2); return x === f ? F.offsetOf(x, -e) : F.offset(x, -e) }
export const shrink = (f, e) => { const x = exact(f, Math.abs(e) + 1.2); return x === f ? F.offsetOf(x, e) : F.offset(x, e) }
// the band between a shape's edge and an inset of e: a frame cut from a solid
export const rim = (f, e) => { const x = exact(f, Math.abs(e) + 1.2); return F.subtractOf(x, F.offsetOf(x, e)) }
export const move = (f, dx, dy) => F.shift(f, Math.round(dx / F.H), Math.round(dy / F.H), M)
export function flipX(f, cx = 12) {
  const g = F.field(M)
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) {
    const si = Math.round((2 * cx) / F.H) - i
    if (si >= 0 && si < F.N) g[j * F.N + i] = f[j * F.N + si]
  }
  return g
}
export const isEmpty = f => !f || !F.any(f)
