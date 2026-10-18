// forge/hand/gloss/alpana.mjs — a bold alpana pinwheel: a centre boss with four plump curls, each ending in a loop with
// a clear eye, and four dots between them: the generated drawing inflated five fine spirals into one round blob, so the
// motif is cut to four chunky curls with wide gaps that stay apart at 16px.
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
const rim = (f, depth = 0.6, half = 0.13, gate = () => 1) => (x, y) => {
  const b = f(x, y); if (b > 0.2 || b < -1.4) return 9
  const e = 0.05, nx = f(x + e, y) - f(x - e, y), ny = f(x, y + e) - f(x, y - e), l = Math.hypot(nx, ny) || 1
  const w = half * sstep(0.3, 0.8, -(nx * LX + ny * LY) / l) * gate(x, y)
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

// a tube whose radius runs from r0 to r1 along a polyline
const tube = (pts, r0, r1) => {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const T = L[L.length - 1]
  return (x, y) => { let d = Infinity; for (let i = 1; i < pts.length; i++) { const [q, t] = segD(x, y, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]); const u = (L[i - 1] + t * (L[i] - L[i - 1])) / T; d = Math.min(d, q - (r0 + (r1 - r0) * u)) } return d }
}
const bez = (a, b, c, d, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, s = 1 - t; return [s * s * s * a[0] + 3 * s * s * t * b[0] + 3 * s * t * t * c[0] + t * t * t * d[0], s * s * s * a[1] + 3 * s * s * t * b[1] + 3 * s * t * t * c[1] + t * t * t * d[1]] })
const arc = (cx, cy, r, a0, a1, n = 12) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })
// a point turned about the centre (12, 12)
const turn = (p, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), x = p[0] - 12, y = p[1] - 12; return [12 + x * c - y * s, 12 + x * s + y * c] }

// ---- the drawing (one curl drawn pointing right, turned four times) ---------------------------------------
const LOBE = [18.9, 12], LR = 2.6, EYE = [19.05, 12.1], ER = 0.9
const ARM = bez([14.2, 13.1], [15.5, 15.25], [17.7, 15.5], [19.1, 14.3])
const curls = [0, 90, 180, 270]
const body = join(0.9, circ(12, 12, 2.9),
  ...curls.map(a => { const c = turn(LOBE, a); return circ(c[0], c[1], LR) }),
  ...curls.map(a => tube(ARM.map(p => turn(p, a)), 0.95, 1.1)))
const arms = curls.map(a => tube(ARM.map(p => turn(p, a)), 0.95, 1.1))
const dots = [45, 135, 225, 315].map(a => turn([22, 12], a))
const dotBody = (x, y) => Math.min(...dots.map(([cx, cy]) => Math.hypot(x - cx, y - cy) - 1.05))

export default function render() {
  const k = mass(body, [
    circ(12, 12, 0.7),                                              // the boss's centre dot
    ...curls.map(a => { const c = turn(EYE, a); return circ(c[0], c[1], ER) }),   // each curl's eye
    bean(arc(12, 12, 1.85, 168, 262), 0.36),                        // sheen on the boss
    rim(body, 0.55, 0.12, (x, y) => Math.min(...arms.map(t => sstep(0.5, 1.3, t(x, y)))) * sstep(0.6, 1.4, Math.hypot(x - 12, y - 12) - 2.9)),   // rim on the loops only
  ])
  const a = mass(dotBody, dots.map(([cx, cy]) => bean(arc(cx, cy, 0.55, 185, 255, 6), 0.17)))
  return [
    ['path', { d: k, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: a, 'fill-rule': 'evenodd', class: 'wm-a' }],
  ]
}
