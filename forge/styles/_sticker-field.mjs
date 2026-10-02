// STICKER helper — signed-distance-field geometry on the 24x24 grid (a private copy of
// the Solid engine so the two styles never break each other). Negative = inside.
import { simplify, area } from '../kernel/geom.mjs'

export const H = 0.08                 // sample pitch (u)
export const N = Math.round(24 / H) + 1 // samples per axis (0..24 inclusive)
const NN = N * N

export const field = (v = 1) => new Float32Array(NN).fill(v)

// ---------------------------------------------------------------------------
// primitives

// optional clip window (sample indices) — fields are only computed inside it
let CX0 = 0, CY0 = 0, CX1 = N - 1, CY1 = N - 1
export function setClip(box) {
  if (!box) { CX0 = CY0 = 0; CX1 = CY1 = N - 1; return }
  CX0 = Math.max(0, Math.floor(box[0] / H)); CY0 = Math.max(0, Math.floor(box[1] / H))
  CX1 = Math.min(N - 1, Math.ceil(box[2] / H)); CY1 = Math.min(N - 1, Math.ceil(box[3] / H))
}
// min-in a capsule field for one segment: d = |p - seg| - off, only within
// reach R of it (cells further away keep their value).
function capsule(F, ax, ay, bx, by, off, R) {
  const y0 = Math.max(CY0, Math.floor((Math.min(ay, by) - R) / H))
  const y1 = Math.min(CY1, Math.ceil((Math.max(ay, by) + R) / H))
  const bx0 = Math.min(ax, bx) - R, bx1 = Math.max(ax, bx) + R
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy
  const inv = L2 > 1e-12 ? 1 / L2 : 0
  const R2 = R * R, len = Math.sqrt(L2) || 1, nx = -dy / len, ny = dx / len
  for (let j = y0; j <= y1; j++) {
    const y = j * H, py = y - ay, row = j * N
    // x-range of this row that can be within R of the segment (convex capsule)
    let lo = bx1, hi = bx0
    const ea = R2 - py * py
    if (ea >= 0) { const r = Math.sqrt(ea); if (ax - r < lo) lo = ax - r; if (ax + r > hi) hi = ax + r }
    const qy = y - by, eb = R2 - qy * qy
    if (eb >= 0) { const r = Math.sqrt(eb); if (bx - r < lo) lo = bx - r; if (bx + r > hi) hi = bx + r }
    if (Math.abs(dy) > 1e-9) {
      // swept band: points a + t d + s n with t in [0,1], |s| <= R; x along this row
      for (let k = 0; k < 2; k++) {
        const sg = k ? R : -R, t = (py - sg * ny) / dy
        if (t >= 0 && t <= 1) { const x = ax + t * dx + sg * nx; if (x < lo) lo = x; if (x > hi) hi = x }
      }
    } else if (Math.abs(py) <= R) { if (Math.min(ax, bx) < lo) lo = Math.min(ax, bx); if (Math.max(ax, bx) > hi) hi = Math.max(ax, bx) }
    if (hi < lo) continue
    const x0 = Math.max(CX0, Math.floor(lo / H)), x1 = Math.min(CX1, Math.ceil(hi / H))
    for (let i = x0; i <= x1; i++) {
      const px = i * H - ax
      let t = (px * dx + py * dy) * inv
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const ex = px - dx * t, ey = py - dy * t
      const d = Math.sqrt(ex * ex + ey * ey) - off
      if (d < F[row + i]) F[row + i] = d
    }
  }
}

// Round-capped, round-joined stroke of polylines [{pts, closed}] at width w.
export function strokes(polys, w, margin = 0.6, target = null) {
  const F = target || field(margin)
  const off = w / 2, R = off + margin
  for (const poly of polys) {
    if (!poly.pts || !poly.pts.length) continue
    const closed = !!poly.closed && poly.pts.length > 2
    const pts = poly.pts.length > 3 ? simplify(poly.pts, 0.01, closed) : poly.pts
    if (pts.length === 1) { capsule(F, pts[0][0], pts[0][1], pts[0][0], pts[0][1], off, R); continue }
    const n = closed ? pts.length : pts.length - 1
    for (let k = 0; k < n; k++) {
      const a = pts[k], b = pts[(k + 1) % pts.length]
      capsule(F, a[0], a[1], b[0], b[1], off, R)
    }
  }
  return F
}

// Even-odd filled region of rings (a region set), signed distance near the edge.
let SCR = null
export function region(rings, margin = 0.6, into = null) {
  const R = rings.filter(r => r && r.length > 2).map(r => r.length > 3 ? simplify(r, 0.01, true) : r).filter(r => r.length > 2)
  let F
  if (into) {
    // work in a scratch buffer, only inside the clip window, then union into the target
    if (!SCR) SCR = new Float32Array(NN)
    F = SCR
    for (let j = CY0; j <= CY1; j++) F.fill(margin, j * N + CX0, j * N + CX1 + 1)
  } else F = field(margin)
  if (R.length) {
    // unsigned distance to every edge, within reach
    for (const ring of R) for (let k = 0; k < ring.length; k++) {
      const a = ring[k], b = ring[(k + 1) % ring.length]
      capsule(F, a[0], a[1], b[0], b[1], 0, margin)
    }
    // inside mask via even-odd scanlines at sample rows
    const xs = []
    for (let j = CY0; j <= CY1; j++) {
      const y = j * H
      xs.length = 0
      for (const ring of R) for (let k = 0; k < ring.length; k++) {
        const a = ring[k], b = ring[(k + 1) % ring.length]
        if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]))
      }
      if (xs.length < 2) continue
      xs.sort((p, q) => p - q)
      const row = j * N
      for (let s = 0; s + 1 < xs.length; s += 2) {
        const i0 = Math.max(CX0, Math.ceil(xs[s] / H)), i1 = Math.min(CX1, Math.floor(xs[s + 1] / H))
        for (let i = i0; i <= i1; i++) F[row + i] = -Math.abs(F[row + i])
      }
    }
  }
  if (!into) return F
  for (let j = CY0; j <= CY1; j++) {
    const row = j * N
    for (let i = CX0; i <= CX1; i++) if (F[row + i] < into[row + i]) into[row + i] = F[row + i]
  }
  return into
}

// ---------------------------------------------------------------------------
// booleans (in place on A)
export const union = (A, B) => { for (let i = 0; i < NN; i++) if (B[i] < A[i]) A[i] = B[i]; return A }
export const subtract = (A, B) => { for (let i = 0; i < NN; i++) { const v = -B[i]; if (v > A[i]) A[i] = v } return A }
export const offset = (A, d) => { for (let i = 0; i < NN; i++) A[i] += d; return A }

// ---------------------------------------------------------------------------
// marching squares -> closed loops (inside kept on a consistent side)
const T = 0, Rt = 1, B = 2, L = 3
// per case: list of [fromEdge, toEdge]; saddles 5 and 10 resolved by the centre
const CASES = [
  [], [[L, T]], [[T, Rt]], [[L, Rt]], [[Rt, B]], null, [[T, B]], [[L, B]],
  [[B, L]], [[B, T]], null, [[B, Rt]], [[Rt, L]], [[Rt, T]], [[T, L]], [],
]
let NEXT = null
export function contour(F) {
  // keep the border outside so every loop closes
  for (let i = 0; i < N; i++) {
    if (F[i] <= 0) F[i] = H; if (F[(N - 1) * N + i] <= 0) F[(N - 1) * N + i] = H
    if (F[i * N] <= 0) F[i * N] = H; if (F[i * N + N - 1] <= 0) F[i * N + N - 1] = H
  }
  if (!NEXT) NEXT = new Int32Array(2 * NN)
  const next = NEXT
  const starts = []
  const eid = (i, j, e) => e === T ? (j * N + i) * 2 : e === B ? ((j + 1) * N + i) * 2 : e === L ? (j * N + i) * 2 + 1 : (j * N + i + 1) * 2 + 1
  for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
    const k = j * N + i
    const v0 = F[k], v1 = F[k + 1], v2 = F[k + N + 1], v3 = F[k + N]
    const c = (v0 < 0 ? 1 : 0) | (v1 < 0 ? 2 : 0) | (v2 < 0 ? 4 : 0) | (v3 < 0 ? 8 : 0)
    if (c === 0 || c === 15) continue
    let segs = CASES[c]
    if (!segs) {
      const centre = (v0 + v1 + v2 + v3) / 4 < 0
      segs = c === 5 ? (centre ? [[Rt, T], [L, B]] : [[L, T], [Rt, B]])
                     : (centre ? [[T, L], [B, Rt]] : [[T, Rt], [B, L]])
    }
    for (const [a, b] of segs) { const e = eid(i, j, a); next[e] = eid(i, j, b) + 1; starts.push(e) }
  }
  const pt = e => {
    const horiz = (e & 1) === 0, k = e >> 1, j = Math.floor(k / N), i = k - j * N
    const va = F[k], vb = horiz ? F[k + 1] : F[k + N]
    const t = va / (va - vb)
    return horiz ? [(i + t) * H, j * H] : [i * H, (j + t) * H]
  }
  const loops = []
  for (const start of starts) {
    if (!next[start]) continue
    const loop = []
    let e = start
    while (next[e]) { loop.push(pt(e)); const n = next[e] - 1; next[e] = 0; e = n }
    if (loop.length > 2) loops.push(loop)
  }
  for (const e of starts) next[e] = 0
  return loops
}

// exact signed distance to a set of loops (sign taken from the source field)
export function redistance(F, loops, reach) {
  const G = field(reach)
  for (const ring of loops) for (let k = 0; k < ring.length; k++) {
    const a = ring[k], b = ring[(k + 1) % ring.length]
    capsule(G, a[0], a[1], b[0], b[1], 0, reach)
  }
  for (let i = 0; i < NN; i++) if (F[i] < 0) G[i] = -G[i]
  return G
}

// morphological opening by a disc of radius r: removes every part thinner than
// 2r and rounds convex corners to r. Exact (re-distanced between the passes).
export function open(F, r) {
  if (r <= 0) return F
  const reach = r + 3 * H
  const g = redistance(F, contour(F).map(l => simplify(l, 0.004, true)), reach)
  offset(g, r)
  const e = redistance(g, contour(g).map(l => simplify(l, 0.004, true)), reach)
  return offset(e, -r)
}
// final loops, simplified, with specks and pinholes dropped
export function trace(F, tol = 0.03, minArea = 0.3) {
  return contour(F).map(l => simplify(l, tol, true)).filter(l => l.length > 2 && Math.abs(area(l)) >= minArea)
}
