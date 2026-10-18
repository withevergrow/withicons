// forge/hand/gloss/cloud-cog.mjs — a puffy three-lobed gloss cloud with a chunky six-tooth cog set into its
// belly behind a clean round moat. The generated drawing fused the cog into the cloud (teeth webbed into the
// mass, no gap), so the gear flattened into a lump; here the cog is its own inflated part (wm-s, spinning about
// 12,17) with an open axle hole, and the cloud keeps a 0.8u parting all the way round it.
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

// smooth intersection: rounds the convex corners where a cut meets an edge (no acute spikes)
const SI = (k, a, b) => sh(a.bb, (x, y) => { const p = a.f(x, y), q = b.f(x, y), h = Math.max(k - Math.abs(p - q), 0) / k; return Math.min(p, q) - h * h * k / 4 })
const NEG = s => ({ bb: s.bb, f: (x, y) => -s.f(x, y) })

export default function render() {
  // ---- cog: body disc, six trapezoid teeth (rounded), open axle; outer radius 4.3 about the spin origin -----
  const cx = 12, cy = 17.2
  const tooth = a => {
    const r = a * Math.PI / 180, u = [Math.cos(r), Math.sin(r)], v = [-u[1], u[0]]
    const at = (rad, w) => [[cx + u[0] * rad + v[0] * w, cy + u[1] * rad + v[1] * w], [cx + u[0] * rad - v[0] * w, cy + u[1] * rad - v[1] * w]]
    const [p1, p2] = at(2.9, 1.4), [p3, p4] = at(4.9, 0.95)
    return RP([p1, p3, p4, p2], 0.34)
  }
  const cog = D(SU(0.45, C(cx, cy, 3.6), ...[30, 90, 150, 210, 270, 330].map(tooth)), C(cx, cy, 1.45))
  // ---- cloud: three lobes on a flat base, set 1u lower so the cog sits inside its lower outline; a 0.8u
  // round moat bitten out round the cog, its meeting with the base rounded by a smooth intersection --------
  const lobeL = C(6.4, 12.4, 3.4), lobeT = C(12.4, 9.6, 4.9), lobeR = C(17.8, 12.6, 3.2)
  const base = RP([[2.6, 11.8], [21.4, 11.8], [21.4, 16.6], [2.6, 16.6]], 1.5)
  const cloud = SI(1.6, SU(1.1, lobeL, lobeT, lobeR, base), NEG(C(cx, cy, 5.8)))
  const cloudHl = [
    streak(arc(12.4, 9.6, 3.6, 203, 258, 24), 0.52), C(8.5, 8.75, 0.38),
  ]
  const cogHl = [streak(arc(cx, cy, 2.55, 196, 252, 16), 0.36)]
  // rim light only on the right lobe's lower-right edge, kept well clear of the moat (no stray ticks)
  const rim = D(C(19.4, 13.4, 3.6), C(cx, cy, 8))
  return [
    ...part({ body: cloud, hl: cloudHl, rim }, 'wm-k'),
    ...part({ body: cog, hl: cogHl }, 'wm-s'),
  ]
}
