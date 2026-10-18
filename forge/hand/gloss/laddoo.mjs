// forge/hand/gloss/laddoo.mjs — a gloss pyramid of three laddoos on a shallow dish: each sweet is its own
// inflated sphere with a curved highlight and a couple of carved grain dimples, parted from its neighbours and
// from the dish by clean gaps. The generated drawing merged the balls and dish into one dark mound crossed by
// stray seams; here every sphere keeps its round silhouette at 16px.
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

export default function render() {
  const r = 3.75, B = [[8.15, 14.3], [15.85, 14.3]], Tp = [12, 8.05]
  const gapC = (cx, cy, rr) => C(cx, cy, rr)
  // front pair parted from each other by a 0.7 gap; the back ball parted from both
  const left = C(B[0][0], B[0][1], r)
  const right = D(C(B[1][0], B[1][1], r), gapC(B[0][0], B[0][1], r + 0.7))
  const top = D(C(Tp[0], Tp[1], r), gapC(B[0][0], B[0][1], r + 0.7), gapC(B[1][0], B[1][1], r + 0.7))
  const dimples = (cx, cy) => [C(cx + 1.55, cy + 1.2, 0.36), C(cx + 0.4, cy + 2.2, 0.32), C(cx + 2.3, cy - 0.2, 0.3)]
  const ball = (s, cx, cy) => part({
    body: D(s, ...dimples(cx, cy)),
    hl: [streak(arc(cx, cy, r - 1.05, 192, 252, 10), 0.4), C(cx - 1.45, cy - 1.05 + 1.85, 0.0)],
    rim: s,
  }, 'wm-k')
  // dish: a flat top with a rounded underside, parted below the balls
  const dishPts = [[2.6, 19], [21.4, 19], ...arc(12, 19, 9.4, 0, 180, 24).map(([x, y]) => [x, 19 + (y - 19) * 0.3]).slice(1, -1)]
  const dish = RP(dishPts, 0.4)
  const cutDish = D(dish, gapC(B[0][0], B[0][1], r + 0.7), gapC(B[1][0], B[1][1], r + 0.7))
  return [
    ...ball(top, Tp[0], Tp[1]),
    ...ball(left, B[0][0], B[0][1]),
    ...ball(right, B[1][0], B[1][1]),
    ...part({ body: cutDish, hl: [streak([[4.6, 19.75], [10.4, 19.75]], 0.3)] }, 'wm-k'),
  ]
}
