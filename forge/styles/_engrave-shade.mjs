// ENGRAVE — shade-side swell of the silhouette, computed without booleans.
// The body B = fills ∪ contour strokes. Its lower-right edge is thickened by the
// exact sweep of B along the light vector (δ,δ): at a boundary point with
// outward normal n the swell is (δ,δ)·n. We walk every candidate boundary
// (stroke outlines with round caps/joins, bare fill edges), keep the samples
// that are really on the OUTSIDE of B and face away from the light, and emit
// each run as a thin crescent polygon that tucks 0.15u under the stroke.
import { simplify, pointInSet } from '../kernel/geom.mjs'

const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)]

// samples {p, n} along the left offset (distance h) of a closed polyline Q
function offsetLoop(Q, h, step = 0.35, fan = 0.3) {
  const m = Q.length, out = []
  const T = [], N = []
  for (let i = 0; i < m; i++) {
    const a = Q[i], b = Q[(i + 1) % m]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    T.push(l > 1e-9 ? [dx / l, dy / l] : null)
  }
  // fill zero-length tangents from neighbours
  for (let i = 0; i < m; i++) if (!T[i]) T[i] = T[(i + m - 1) % m] || [1, 0]
  for (let i = 0; i < m; i++) N.push([T[i][1], -T[i][0]]) // left in y-down screen space
  for (let i = 0; i < m; i++) {
    const a = Q[i], b = Q[(i + 1) % m]
    const pn = N[(i + m - 1) % m], nn = N[i], pt = T[(i + m - 1) % m]
    let da = Math.atan2(pn[0] * nn[1] - pn[1] * nn[0], pn[0] * nn[0] + pn[1] * nn[1])
    if (Math.abs(da) > Math.PI - 1e-3) { const mid = rot(pn, Math.PI / 2); da = (mid[0] * pt[0] + mid[1] * pt[1]) > 0 ? Math.PI : -Math.PI }
    const k = Math.ceil(Math.abs(da) / fan)
    for (let j = 1; j < k; j++) { const n = rot(pn, da * j / k); out.push({ p: [a[0] + n[0] * h, a[1] + n[1] * h], n }) }
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), s = Math.max(1, Math.ceil(L / step))
    for (let j = 0; j < s; j++) { const f = j / s; out.push({ p: [a[0] + (b[0] - a[0]) * f + nn[0] * h, a[1] + (b[1] - a[1]) * f + nn[1] * h], n: nn }) }
  }
  return out
}

// is q farther than r from every segment?
function clearOf(q, segs, r) {
  const r2 = r * r, qx = q[0], qy = q[1]
  for (let i = 0; i < segs.length; i++) {
    const g = segs[i], ax = g[0], ay = g[1]
    const ex = g[2] - ax, ey = g[3] - ay, px = qx - ax, py = qy - ay
    const L2 = ex * ex + ey * ey
    let t = L2 > 1e-12 ? (px * ex + py * ey) / L2 : 0
    t = t < 0 ? 0 : t > 1 ? 1 : t
    const dx = px - ex * t, dy = py - ey * t
    if (dx * dx + dy * dy <= r2) return false
  }
  return true
}

// returns rings (crescent polygons)
export function shadeCrescents({ lines, lineSegs, fillRings }, HW, delta, light) {
  if (!(delta > 0)) return []
  const loops = []
  for (const ln of lines) {
    const P = simplify(ln.pts, 0.01, ln.closed)
    if (P.length < 2) continue
    if (ln.closed) { loops.push(offsetLoop(P, HW)); loops.push(offsetLoop([...P].reverse(), HW)) }
    else loops.push(offsetLoop([...P, ...P.slice(1, -1).reverse()], HW))
  }
  for (const r of fillRings) {
    const loop = offsetLoop(simplify(r, 0.01, true), 0)
    if (!loop.length) continue
    // orient once per ring: normals must point away from the filled side
    let best = loop[0], bl = -1
    for (let i = 0; i < loop.length; i++) { const a = loop[i].p, b = loop[(i + 1) % loop.length].p, l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l > bl) { bl = l; best = { p: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], n: loop[i].n } } }
    if (pointInSet([best.p[0] + best.n[0] * 0.02, best.p[1] + best.n[1] * 0.02], fillRings)) for (const s of loop) s.n = [-s.n[0], -s.n[1]]
    loops.push(loop)
  }
  const outside = q => clearOf(q, lineSegs, HW + 0.03) && !pointInSet(q, fillRings)
  const shift = [delta, delta]
  const out = []
  for (const loop of loops) {
    const m = loop.length
    const ext = loop.map(q => outside([q.p[0] + q.n[0] * 0.06, q.p[1] + q.n[1] * 0.06]))
    const on = loop.map((q, i) => { q.e = shift[0] * q.n[0] + shift[1] * q.n[1]; return q.e > 0.02 && ext[i] })
    if (!on.some(Boolean)) continue
    let start = on.findIndex(v => !v); if (start < 0) start = 0
    const runs = []; let cur = []
    for (let k = 0; k < m; k++) {
      const i = (start + k) % m
      if (on[i]) cur.push(i); else { if (cur.length > 1) runs.push(cur); cur = [] }
    }
    if (cur.length > 1) runs.push(cur)
    for (const idx of runs) {
      // close each run exactly at the tangency: take the neighbouring sample too
      const i0 = (idx[0] - 1 + m) % m, i1 = (idx[idx.length - 1] + 1) % m
      if (ext[i0] && loop[i0].e > -0.1) idx.unshift(i0)
      if (ext[i1] && loop[i1].e > -0.1) idx.push(i1)
      const o = [], inn = []
      idx.forEach((i, k) => {
        const q = loop[i], ins = (k === 0 || k === idx.length - 1) ? 0 : 0.15
        o.push([q.p[0] + shift[0], q.p[1] + shift[1]])   // exact sweep: translate, not push along n
        inn.push([q.p[0] - q.n[0] * ins, q.p[1] - q.n[1] * ins])
      })
      const ring = simplify([...o, ...inn.reverse()], 0.03, true)
      if (ring.length > 2) out.push(ring)
    }
  }
  return out
}
