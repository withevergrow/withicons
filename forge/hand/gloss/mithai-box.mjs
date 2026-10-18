// forge/hand/gloss/mithai-box.mjs — an open gloss sweet box: a deep rounded box whose straight front wall hides
// the lower half of two round laddoos and a diamond kaju katli sitting inside it (the way the laddoo icon sits in
// its bowl), a thin carved lid seam, an open 4.4u diamond motif on the front and one upper-left bean. The generated
// drawing fused the sweets into the box rim and the first redraw set them on top like cake decorations; here the
// sweets (wm-a, bouncing about 12,11) sit inside the box behind a clean 0.7u parting.
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

const SI = (k, a, b) => sh(a.bb, (x, y) => { const p = a.f(x, y), q = b.f(x, y), h = Math.max(k - Math.abs(p - q), 0) / k; return Math.min(p, q) - h * h * k / 4 })
const NEG = s => ({ bb: s.bb, f: (x, y) => -s.f(x, y) })
const grow = (s, r) => ({ bb: [s.bb[0] - r, s.bb[1] - r, s.bb[2] + r, s.bb[3] + r], f: (x, y) => s.f(x, y) + r })

export default function render() {
  // ---- box: one straight-topped front wall (rounded corners), a thin lid seam, an open diamond motif --------
  const box0 = RP([[2.5, 12.2], [21.5, 12.2], [21.5, 22], [2.5, 22]], 1.5)
  const seam = T([[4.2, 15.1], [19.8, 15.1]], 0.45)
  const dia = (h, r) => RP([[12, 19 - h], [12 + h, 19], [12, 19 + h], [12 - h, 19]], r)
  const motif = D(dia(2.9, 0.4), dia(1.7, 0.2))
  const box = D(box0, seam, motif)
  const boxHl = [streak([[4.6, 13.35], [19.4, 13.35]], 0.42), streak([[4, 17.2], [4, 20.4]], 0.4)]
  // rim light only along the outer edge, never inside the seam or the motif
  const rim = sh(box0.bb, (x, y) => Math.min(box0.f(x, y), 1.1 - box0.f(x, y)))
  // ---- sweets: two laddoos and a kaju katli, their lower halves hidden by the front wall ---------------------
  const ladL = C(6.4, 11.4, 2.9), ladM = C(12, 10.2, 3.2), ladR = C(17.6, 11.4, 2.9)
  const sweets0 = U(D(U(ladL, ladR), grow(ladM, 0.6)), ladM)
  const sweets = SI(0.9, sweets0, NEG(grow(box0, 0.7)))
  const sweetsHl = [
    streak(arc(6.4, 11.4, 1.85, 200, 262, 16), 0.42),
    streak(arc(17.6, 11.4, 1.85, 200, 262, 16), 0.42),
    streak(arc(12, 10.2, 2.1, 200, 262, 16), 0.45), C(10.1, 9.2, 0.3),
  ]
  return [
    ...part({ body: box, hl: boxHl, rim }, 'wm-k'),
    ...part({ body: sweets, hl: sweetsHl }, 'wm-a'),
  ]
}
