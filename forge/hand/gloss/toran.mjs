// forge/hand/gloss/toran.mjs — a gloss mango-leaf toran: a bold rod with three inflated leaves on short stems, each leaf parted
// from the rod and from its neighbours, with a carved midrib and one bean highlight. The generated drawing fused leaf
// tops into the rod as jagged triangles; the side leaves (wm-a) sway about 12,4 as the motion spec asks.
import { N, NN, gx, contours, ringsToD } from '../../styles/_gloss-field.mjs'

// ---- gloss field toolkit (signed distance, + inside), lit like forge/styles/gloss.mjs ----------------------
const LIGHT = (() => { const x = -0.55, y = -0.835, l = Math.hypot(x, y); return [x / l, y / l] })()
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const CULL = 2.5
const sh = (bb, f) => ({ bb, f: (x, y) => (x < bb[0] - CULL || x > bb[2] + CULL || y < bb[1] - CULL || y > bb[3] + CULL) ? -CULL : f(x, y) })
const bbOf = pts => pts.reduce((o, p) => [Math.min(o[0], p[0]), Math.min(o[1], p[1]), Math.max(o[2], p[0]), Math.max(o[3], p[1])], [99, 99, -99, -99])
const bbU = ss => ss.reduce((o, s) => [Math.min(o[0], s.bb[0]), Math.min(o[1], s.bb[1]), Math.max(o[2], s.bb[2]), Math.max(o[3], s.bb[3])], [99, 99, -99, -99])
function segDist(px, py, pts, closed) {
  let best = 1e9, bt = 0, acc = 0
  const n = closed ? pts.length : pts.length - 1
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], ex = b[0] - a[0], ey = b[1] - a[1], L2 = ex * ex + ey * ey || 1e-12
    const t = Math.max(0, Math.min(1, ((px - a[0]) * ex + (py - a[1]) * ey) / L2)), d = Math.hypot(px - a[0] - ex * t, py - a[1] - ey * t), L = Math.sqrt(L2)
    if (d < best) { best = d; bt = acc + t * L }
    acc += L
  }
  return [best, bt, acc]
}
const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c } return c }
const C = (cx, cy, r) => sh([cx - r, cy - r, cx + r, cy + r], (x, y) => r - Math.hypot(x - cx, y - cy))
const T = (pts, r) => { const b = bbOf(pts); return sh([b[0] - r, b[1] - r, b[2] + r, b[3] + r], (x, y) => r - segDist(x, y, pts, false)[0]) }
const P = (pts, round = 0) => sh(bbOf(pts), (x, y) => (inPoly(x, y, pts) ? 1 : -1) * segDist(x, y, pts, true)[0] + round)
// rounded polygon: the polygon inset by r (mitred), then grown back by r
const RP = (pts, r) => {
  const n = pts.length, A = pts.reduce((a, p, i) => a + p[0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * p[1], 0), sg = A > 0 ? 1 : -1
  const q = pts.map((b, i) => {
    const a = pts[(i - 1 + n) % n], c = pts[(i + 1) % n]
    const u = [b[0] - a[0], b[1] - a[1]], w = [c[0] - b[0], c[1] - b[1]], lu = Math.hypot(...u), lw = Math.hypot(...w)
    const n1 = [-u[1] / lu * sg, u[0] / lu * sg], n2 = [-w[1] / lw * sg, w[0] / lw * sg], k = r / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [b[0] + (n1[0] + n2[0]) * k, b[1] + (n1[1] + n2[1]) * k]
  })
  return P(q, r)
}
const arc = (cx, cy, r, a0, a1, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })
const U = (...ss) => sh(bbU(ss), (x, y) => Math.max(...ss.map(s => s.f(x, y))))
const SU = (k, ...ss) => sh(bbU(ss), (x, y) => ss.reduce((a, s) => { const b = s.f(x, y), h = Math.max(k - Math.abs(a - b), 0) / k; return Math.max(a, b) + h * h * k / 4 }, -CULL))
const D = (a, ...bs) => sh(a.bb, (x, y) => Math.min(a.f(x, y), ...bs.map(b => -b.f(x, y))))
// tapered highlight along a centreline: the style's streak / bean profile (sin^0.5, 0.12u tips)
const streak = (pts, hw, tip = 0.12) => { const b = bbOf(pts); return sh([b[0] - hw, b[1] - hw, b[2] + hw, b[3] + hw], (x, y) => { const [d, t, L] = segDist(x, y, pts, false); return tip + (hw - tip) * Math.pow(Math.sin(Math.PI * Math.max(0, Math.min(1, t / L))), 0.5) - d }) }
// one part -> path: body field, carved highlights (a 0.5u rim of body always kept), rim light on `rim` masses
function part({ body, hl = [], rim = null }, cls) {
  const F = new Float32Array(NN), S = new Float32Array(NN)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) F[j * N + i] = body.f(gx(i), gx(j))
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i, x = gx(i), y = gx(j), d = F[k]
    let v = d
    if (d > 0.3) {
      let h = -9
      for (const s of hl) h = Math.max(h, s.f(x, y))
      v = Math.min(v, Math.max(-h, 0.5 - d))
      if (rim && d < 1 && rim.f(x, y) > 0) {
        const ox = F[k - 1] - F[k + 1], oy = F[k - N] - F[k + N], ol = Math.hypot(ox, oy)
        if (ol > 1e-6) { const g = sstep(0.3, 0.8, -(ox * LIGHT[0] + oy * LIGHT[1]) / ol); if (g > 0) v = Math.min(v, Math.abs(d - 0.5) - 0.15 * g + 0.02) }
      }
    }
    S[k] = v
  }
  const d = ringsToD(contours(S, 0))
  return d ? [['path', { d, 'fill-rule': 'evenodd', class: cls }]] : []
}
// ------------------------------------------------------------------------------------------------------------

const ellipse = (cx, cy, rx, ry, n = 72) => Array.from({ length: n }, (_, i) => { const a = 2 * Math.PI * i / n; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] })
// round cone: a circle ra at A and a circle rb at B joined by tangent sides
const UC = (A, B, ra, rb) => sh([Math.min(A[0] - ra, B[0] - rb), Math.min(A[1] - ra, B[1] - rb), Math.max(A[0] + ra, B[0] + rb), Math.max(A[1] + ra, B[1] + rb)], (x, y) => {
  const px = x - A[0], py = y - A[1], bx = B[0] - A[0], by = B[1] - A[1], h = bx * bx + by * by
  const qx = Math.abs(px * by - py * bx) / h, qy = (px * bx + py * by) / h
  const b = ra - rb, cx = Math.sqrt(h - b * b), cy = b
  const k = cx * qy - cy * qx, m = cx * qx + cy * qy, n = qx * qx + qy * qy
  if (k < 0) return ra - Math.sqrt(h * n)
  if (k > cx) return rb - Math.sqrt(h * (n + 1 - 2 * qy))
  return ra - m
})
// a groove whose half-width runs from w0 at its first point to w1 at its last
const TL = (pts, w0, w1) => { const b = bbOf(pts), w = Math.max(w0, w1); return sh([b[0] - w, b[1] - w, b[2] + w, b[3] + w], (x, y) => { const [d, t, L] = segDist(x, y, pts, false); return w0 + (w1 - w0) * t / L - d }) }
// a mango leaf: curved spine base -> tip (bulging by `bend`), sin-profile width, pointed tip
function leaf(B, Tp, hw, bend) {
  const m = [(B[0] + Tp[0]) / 2, (B[1] + Tp[1]) / 2], L = Math.hypot(Tp[0] - B[0], Tp[1] - B[1])
  const nrm = [-(Tp[1] - B[1]) / L, (Tp[0] - B[0]) / L]
  const c = [m[0] + nrm[0] * bend, m[1] + nrm[1] * bend]
  const at = t => [(1 - t) * (1 - t) * B[0] + 2 * (1 - t) * t * c[0] + t * t * Tp[0], (1 - t) * (1 - t) * B[1] + 2 * (1 - t) * t * c[1] + t * t * Tp[1]]
  const n = 24, side = s => Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, p = at(t), q = at(Math.min(1, t + 0.01)), o = at(Math.max(0, t - 0.01)), dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1
    const w = (0.35 + (hw - 0.35) * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.75)) * (1 - Math.pow(t, 6))
    return [p[0] - dy / l * w * s, p[1] + dx / l * w * s]
  })
  return { shape: P([...side(1), ...side(-1).reverse()]), at }
}

export default function render() {
  // ---- the rod: one bold capsule across the doorway ---------------------------------------------------------
  const rod = T([[2.6, 3.5], [21.4, 3.5]], 1.1)
  const rodHl = [streak([[3.4, 3.0], [9.4, 3.0]], 0.3)]
  // ---- three mango leaves on short stems, held clear of the rod and of each other -------------------------
  const mid = leaf([12, 6.9], [12, 20.8], 3.3, 0), lft = leaf([6.0, 6.7], [2.9, 17.1], 2.9, 0.9), rgt = leaf([18.0, 6.7], [21.1, 17.1], 2.9, -0.9)
  const stem = x => T([[x, 3.6], [x, 7.6]], 0.5)
  const rib = (lf, a = 0.22, b = 0.8) => TL([a, (a + b) / 2, b].map(t => lf.at(t)), 0.3, 0.16)
  const leafPart = (lf, x, hlPts) => ({ body: D(U(lf.shape, stem(x)), rib(lf)), hl: [streak(hlPts, 0.45)], rim: D(lf.shape, sh(rib(lf).bb, (x, y) => rib(lf).f(x, y) + 1.1)) })
  return [
    ...part({ body: rod, hl: rodHl, rim: rod }, 'wm-k'),
    ...part(leafPart(mid, 12, [[10.85, 9.6], [10.45, 12.2], [10.55, 14.6]]), 'wm-k'),
    ...part(leafPart(lft, 6.1, [[4.75, 8.9], [3.8, 11.1], [3.55, 13.2]]), 'wm-a'),
    ...part(leafPart(rgt, 17.9, [[17.4, 9.0], [17.6, 11.2]]), 'wm-a'),
    ...part({ body: U(C(9, 5.3, 1.5), C(15, 5.3, 1.5)), hl: [C(8.5, 4.8, 0.45), C(14.5, 4.8, 0.45)], rim: U(C(9, 5.3, 1.5), C(15, 5.3, 1.5)) }, 'wm-deco'),
  ]
}
