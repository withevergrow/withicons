// forge/hand/gloss/dragon-head.mjs
// Front-facing Lunar New Year dragon: a broad brow and flared muzzle in glossy black with slanted angry eyes,
// nostrils and a fanged mouth carved clear, two branching antlers and curled whiskers (wm-a) round it.
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
const E = (cx, cy, rx, ry) => P(ellipse(cx, cy, rx, ry))
// exact rounded box
const RR = (x0, y0, x1, y1, r) => { const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = (x1 - x0) / 2 - r, hy = (y1 - y0) / 2 - r
  return sh([x0, y0, x1, y1], (x, y) => { const qx = Math.abs(x - cx) - hx, qy = Math.abs(y - cy) - hy; return -(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r) }) }
const cubic = (p0, p1, p2, p3, n = 18) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]) })
// tapered line: radius w0 at the first point, w1 at the last
const TL = (pts, w0, w1) => { const b = bbOf(pts), w = Math.max(w0, w1); return sh([b[0] - w, b[1] - w, b[2] + w, b[3] + w], (x, y) => { const [d, t, L] = segDist(x, y, pts, false); return w0 + (w1 - w0) * t / L - d }) }
// outward offset of a shape by g (exact outside the shape)
const grow = (s, g) => sh(s.bb, (x, y) => s.f(x, y) + g)

export default function render() {
  const spike = x => RP([[x - 0.75, 20.6], [x + 0.75, 20.6], [x, 23.0]], 0.3)
  const head = SU(1.1, E(12, 13.9, 6.6, 4.7), E(12, 17.5, 5.4, 3.8), E(7.4, 17.9, 1.9, 1.7), E(16.6, 17.9, 1.9, 1.7), spike(10), spike(12), spike(14))
  const eye = s => { const m = x => 12 + s * (x - 12); return P([[m(7.0), 11.9], [m(11.2), 13.9], [m(10.4), 15.5], [m(7.8), 14.9]]) }
  const noses = [C(10.5, 17.3, 0.6), C(13.5, 17.3, 0.6)]
  const slit = P([[8.2, 19.2], [15.8, 19.2], [15.4, 20.2], [8.6, 20.2]])
  const fang = x => P([[x - 0.7, 20.3], [x + 0.7, 20.3], [x, 18.9]])
  const mouth = D(slit, fang(10.5), fang(13.5))
  const cuts = [eye(1), eye(-1), ...noses, mouth]
  const body = D(head, ...cuts)
  const hl = [streak([[8.6, 10.8], [10.6, 10.0], [13.4, 9.9]], 0.36), C(16.5, 12.2, 0.3)]
  const horn = s => { const m = ([x, y]) => [12 + s * (x - 12), y]
    return [TL(cubic(...[[9.6, 10.6], [9.3, 7.6], [8.0, 5.0], [5.6, 2.4]].map(m), 12), 0.85, 0.3),
      TL([[8.7, 6.6], [10.4, 3.9]].map(m), 0.55, 0.28), TL([[7.5, 4.4], [3.9, 4.0]].map(m), 0.55, 0.28)] }
  const whisk = s => { const m = ([x, y]) => [12 + s * (x - 12), y]
    return [TL(cubic(...[[6.9, 17.3], [5.0, 16.0], [3.8, 19.0], [2.0, 17.7]].map(m), 14), 0.7, 0.42), C(...m([2.0, 17.7]), 0.8)] }
  const ext = D(U(...horn(1), ...horn(-1), ...whisk(1), ...whisk(-1)), grow(head, -0.5))
  return [
    ...part({ body, hl, rim: D(head, ...cuts.map(c => grow(c, 1.1))) }, 'wm-k'),
    ...part({ body: ext }, 'wm-a'),
  ]
}
