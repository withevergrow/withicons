// forge/hand/gloss/salad.mjs: hand-drawn gloss salad, redrawn to the owner's new design.
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

const ell = (cx, cy, rx, ry, deg = 0) => { const a = -deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return (x, y) => { const dx = x - cx, dy = y - cy, u = dx * c - dy * s, v = dx * s + dy * c; return (Math.hypot(u / rx, v / ry) - 1) * Math.min(rx, ry) } }
const cut = (f, gap, ...gs) => (x, y) => Math.max(f(x, y), ...gs.map(g => gap - g(x, y)))
const uni = (...fs) => (x, y) => Math.min(...fs.map(f => f(x, y)))
const groove = (f, w) => (x, y) => Math.abs(f(x, y)) - w

// ---- the drawing ---------------------------------------------------------------------------------------
const bowlTop = 12.3
const bowl = join(0.6, (x, y) => Math.max(ell(12, bowlTop, 9.1, 6.9)(x, y), bowlTop - y), poly([[9.6, 18.6], [14.4, 18.6], [14.9, 20.9], [9.1, 20.9]], 0.4))
const carrot = join(0.5, tube([[5.6, 6.6], [7.4, 11.8]], 1.35, 1.0), cap(5.1, 5.4, 3.9, 2.9, 0.5), cap(5.7, 5.2, 5.7, 2.4, 0.5), cap(6.4, 5.4, 7.6, 3.1, 0.5))
const egg = (x, y) => Math.max(circ(11.6, 10.4, 3)(x, y), y - 11.9)
const leaf = ell(17, 7.9, 4.3, 2.1, -62)
export default function render() {
  const k = mass(bowl, [(x, y) => Math.abs(y - 13.9) - 0.3 + (Math.abs(x - 12) > 7.8 ? 9 : 0), bean([[4.6, 15], [5.8, 17], [7.6, 18.2]], 0.36), rim(bowl, 0.6, 0.13)])
  const off = (f) => cut(f, 0.6, bowl)
  const e = off(cut(egg, 0.6, carrot))
  const c = off(carrot)
  const l = off(cut(leaf, 0.6, egg))
  const a = mass(uni(c, e), [groove(circ(11.6, 10.7, 1.3), 0.26), cap(6, 8.4, 7, 8.1, 0.17), cap(6.5, 9.9, 7.5, 9.6, 0.17)])
  const s = mass(l, [bean([[15.4, 11.4], [17, 7.9], [18.6, 4.4]], 0.24, 0.08)])
  return [
    ['path', { d: k, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: a, 'fill-rule': 'evenodd', class: 'wm-a' }],
    ['path', { d: s, 'fill-rule': 'evenodd', class: 'wm-a' }],
  ]
}
