// forge/hand/gloss/kalash.mjs — a round-bellied gloss kalash: an egg-round belly (13u x 10.3u, widest just
// below the middle) rising through real 6u neck fillets to a 9.5u mouth lip, no band (a groove there read as a burger layer),
// and a crown of a tufted coconut between two broad mango leaves angled up ~38 degrees from behind it.
// The generated drawing fused leaves, coconut, lip and pot into one lump that read as a bell or a teapot; here
// pot, neck and lip are one smooth mass and the crown (wm-a, swaying about 12,10.5) is held clear of the lip.
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
// an egg: taller above its widest line than below (finely sampled so the rim light stays smooth)
const egg = (cx, cy, rx, ryT, ryB, n = 200) => Array.from({ length: n }, (_, i) => { const a = 2 * Math.PI * i / n, sn = Math.sin(a), cs = Math.cos(a), e = sn < 0 ? 0.85 : 1; return [cx + rx * Math.sign(cs) * Math.pow(Math.abs(cs), e), cy + (sn < 0 ? ryT : ryB) * sn] })
// a mango leaf: curved spine base -> tip (bulging by `bend`), sin-profile width, a rounded (not hooked) tip
function leaf(B, Tp, hw, bend, tipR = 0.3) {
  const m = [(B[0] + Tp[0]) / 2, (B[1] + Tp[1]) / 2], L = Math.hypot(Tp[0] - B[0], Tp[1] - B[1])
  const nrm = [-(Tp[1] - B[1]) / L, (Tp[0] - B[0]) / L]
  const c = [m[0] + nrm[0] * bend, m[1] + nrm[1] * bend]
  const at = t => [(1 - t) * (1 - t) * B[0] + 2 * (1 - t) * t * c[0] + t * t * Tp[0], (1 - t) * (1 - t) * B[1] + 2 * (1 - t) * t * c[1] + t * t * Tp[1]]
  const n = 40, side = s => Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, p = at(t), q = at(Math.min(1, t + 0.01)), o = at(Math.max(0, t - 0.01)), dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1
    const w = Math.max(0.02, (0.5 + (hw - 0.5) * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 0.7)) * (1 - Math.pow(t, 4)) - tipR)
    return [p[0] - dy / l * w * s, p[1] + dx / l * w * s]
  })
  return { shape: P([...side(1), ...side(-1).reverse()], tipR), at }
}

export default function render() {
  // ---- pot: egg belly, 6u neck with smooth fillets, 9.5u lip on the neck: one mass -------------------------
  const belly = P(egg(12, 16.8, 6.5, 5.6, 4.7))
  const neck = RP([[9, 9.4], [15, 9.4], [15, 12.4], [9, 12.4]], 0.3)
  const lip = RP([[7.25, 8.1], [16.75, 8.1], [16.75, 9.8], [7.25, 9.8]], 0.8)
  const pot = SU(0.9, SU(1.6, belly, neck), lip)
  const BA = t => { const a = t * Math.PI / 180; return [12 + 4.9 * Math.cos(a), 16.8 + 4.1 * Math.sin(a)] }
  const potHl = [
    streak(Array.from({ length: 25 }, (_, i) => BA(212 + 44 * i / 24)), 0.55),
    C(...BA(269), 0.36),
    streak([[8.6, 8.95], [11.2, 8.95]], 0.26),
  ]
  // ---- crown: a round tufted coconut in front of two broad mango leaves angled up from behind it ---------
  const coconut = SU(0.7, P(ellipse(12, 5.2, 2.6, 2.4, 96)), RP([[10.95, 3.2], [12, 1.5], [13.05, 3.2]], 0.25))
  const L = leaf([10.4, 6.3], [3.9, 1.6], 1.65, 0.9, 0.45), Rt = leaf([13.6, 6.3], [20.1, 1.6], 1.65, -0.9, 0.45)
  const rib = lf => T([0.2, 0.35, 0.5, 0.65, 0.78].map(t => lf.at(t)), 0.22)
  const cocoMoat = C(12, 5.2, 3.15)
  const crown = U(coconut, D(L.shape, rib(L), cocoMoat), D(Rt.shape, rib(Rt), cocoMoat))
  const crownHl = [streak(arc(12, 5.2, 1.5, 196, 252, 16), 0.4)]
  return [
    ...part({ body: pot, hl: potHl, rim: P(egg(12, 16.8, 6.9, 6, 5.1)) }, 'wm-k'),
    ...part({ body: crown, hl: crownHl }, 'wm-a'),
  ]
}
