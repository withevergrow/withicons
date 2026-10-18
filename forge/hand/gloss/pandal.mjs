// forge/hand/gloss/pandal.mjs — a pillowy festival canopy with a scalloped hem on two stout poles and a hanging lamp:
// the generated drawing fused the drapes, poles and lamp into one melting blob (a dripping house), so the drapes are
// dropped, the poles stand clear and the lamp hangs free as its own swaying part.
import { N, NN, gx, contours, ringsToD } from '../../styles/_gloss-field.mjs'

// ---- signed-distance kit (negative inside), sampled on the gloss grid --------------------------------------
const LX = -0.55 / Math.hypot(0.55, 0.835), LY = -0.835 / Math.hypot(0.55, 0.835)   // the style's one light
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const segD = (x, y, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1e-9; const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)); return [Math.hypot(x - ax - t * dx, y - ay - t * dy), t] }
const circ = (cx, cy, r) => (x, y) => Math.hypot(x - cx, y - cy) - r
const cap = (ax, ay, bx, by, r) => (x, y) => segD(x, y, ax, ay, bx, by)[0] - r
const poly = (P, r = 0) => (x, y) => {
  let d = Infinity, s = false
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    d = Math.min(d, segD(x, y, a[0], a[1], b[0], b[1])[0])
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) s = !s
  }
  return (s ? -d : d) - r
}
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k / 4 }
const join = (k, ...fs) => (x, y) => fs.reduce((v, f) => smin(v, f(x, y), k), Infinity)
// a tapered highlight stroke along a polyline: round tips, widest in the middle
const bean = (pts, w, tip = 0.1) => {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const T = L[L.length - 1]
  return (x, y) => { let d = Infinity; for (let i = 1; i < pts.length; i++) { const [q, t] = segD(x, y, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]); const u = (L[i - 1] + t * (L[i] - L[i - 1])) / T; d = Math.min(d, q - (tip + (w - tip) * Math.sin(Math.PI * u))) } return d }
}
// the rim light: a hairline groove just inside the edges that face away from the light
const rim = (f, depth = 0.6, half = 0.13) => (x, y) => {
  const b = f(x, y); if (b > 0.2 || b < -1.4) return 9
  const e = 0.05, nx = f(x + e, y) - f(x - e, y), ny = f(x, y + e) - f(x, y - e), l = Math.hypot(nx, ny) || 1
  const w = half * sstep(0.3, 0.8, -(nx * LX + ny * LY) / l)
  return w < 0.03 ? 9 : Math.abs(-b - depth) - w
}
const mass = (body, holes) => {
  const F = new Float32Array(NN)
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = gx(i), y = gx(j), b = body(x, y)
    let v = -b
    if (b < 0.3) for (const h of holes) v = Math.min(v, h(x, y))
    F[j * N + i] = v
  }
  return ringsToD(contours(F, 0))
}

// ---- the drawing -------------------------------------------------------------------------------------------
const roof = poly([[12, 3.35], [20.6, 8.65], [3.4, 8.65]], 1.2)
const hem = [4.6, 7.4, 10.2, 13.8, 16.6, 19.4].map(cx => circ(cx, 9.55, 1.15))
const canopy = (x, y) => smin(roof(x, y), join(0.4, ...hem)(x, y), 0.6)   // a wide join so each eave turns in one smooth curve
const poles = [cap(5.5, 10, 5.5, 21.2, 1.15), cap(18.5, 10, 18.5, 21.2, 1.15)]
const body = join(0.9, canopy, ...poles)
const lamp = join(0.5, circ(12, 15, 1.75), cap(12, 10, 12, 13.5, 0.35))   // the lamp hangs on a short cord from the hem notch

export default function render() {
  const k = mass(body, [
    bean([[4.9, 7.4], [7.5, 5.8], [10.15, 4.2]], 0.48),         // the long sheen down the lit slope
    circ(5.35, 8.7, 0.34),                                        // its glint, well inside the eave
    bean([[4.98, 12.7], [4.98, 16.2], [4.98, 19.6]], 0.3),          // tube streaks on the poles
    bean([[17.98, 12.7], [17.98, 16.2], [17.98, 19.6]], 0.3),
    rim(body, 0.6, 0.13),                                          // rim along the whole shadow side: right eave, hem and pole
  ])
  const a = mass(lamp, [bean([[10.95, 15.1], [11.3, 14.35], [12, 13.95]], 0.3), rim(lamp, 0.5, 0.11)])
  return [
    ['path', { d: k, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: a, 'fill-rule': 'evenodd', class: 'wm-a' }],
  ]
}
