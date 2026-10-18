// forge/hand/gloss/gulal.mjs — a soft heap of colour powder piled inside a lipped bowl, with two little clouds of powder
// rising: the earlier drawing floated a flat-based triangle over the lip like a lid, so the heap now sinks behind the lip
// (parted only by its groove), gets convex flanks, an off-centre peak and a spill, and the puffs are lobed clouds.
import { N, NN, gx, contours, ringsToD } from '../../styles/_gloss-field.mjs'
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

const bez = (a, b, c, d, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, s = 1 - t; return [s * s * s * a[0] + 3 * s * s * t * b[0] + 3 * s * t * t * c[0] + t * t * t * d[0], s * s * s * a[1] + 3 * s * s * t * b[1] + 3 * s * t * t * c[1] + t * t * t * d[1]] })
const arc = (cx, cy, r, a0, a1, n = 12) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })

// ---- the drawing -------------------------------------------------------------------------------------------
const bowl = join(0.7,
  poly([...bez([3.4, 13.6], [3.4, 18.2], [7.2, 21.3], [12, 21.3]), ...bez([12, 21.3], [16.8, 21.3], [20.6, 18.2], [20.6, 13.6]).slice(1)]),
  cap(2.95, 13.55, 21.05, 13.55, 1.05))
// the heap is piled inside the bowl: soft convex flanks, an off-centre rounded peak and a small spill on the right; its
// foot sinks behind the lip and is parted from it only by the lip's top-edge groove
const pile = join(0.8,
  poly([...bez([4.6, 13.4], [6.2, 10.6], [8.4, 6.1], [11.0, 5.9]), ...bez([11.0, 5.9], [13.8, 5.7], [16.6, 10.4], [18.6, 12.6]).slice(1), [18.6, 13.4]], 0.6),
  circ(19.35, 11.75, 0.85))
const heap = (x, y) => Math.max(pile(x, y), 0.5 - bowl(x, y))
const crumb = circ(21.25, 9.95, 0.5)
const heapAll = (x, y) => Math.min(heap(x, y), crumb(x, y))
// two puffs of powder, each a little cloud of three overlapping lobes
const PUFFS = [[[4.75, 4.3, 1.25], [3.4, 5.25, 0.95], [6.05, 5.3, 0.85]], [[18.3, 4.1, 1.3], [19.65, 5.1, 0.95], [16.95, 5.15, 0.85]]]
const puff = (x, y) => Math.min(...PUFFS.map(P => join(0.45, ...P.map(([cx, cy, r]) => circ(cx, cy, r)))(x, y)))

export default function render() {
  const k = mass(bowl, [
    bean([[5.2, 15.4], [5.75, 17.3], [7.05, 18.85], [8.75, 19.75]], 0.6),     // broad sheen down the lit flank
    circ(4.15, 13.55, 0.3),                                                 // glint on the lip
    (x, y) => (y > 15 && x > 10 ? rim(bowl, 0.58, 0.13)(x, y) : 9),   // rim on the bowl, not under the lip
  ])
  const a = mass(heapAll, [
    bean([[6.75, 10.9], [7.75, 8.7], [9.0, 6.9], [10.3, 6.05]], 0.42),     // sheen down the lit slope
    circ(10.55, 7.55, 0.27),                                               // glint at the top of the sheen
    (x, y) => (y < 11.2 && x > 11 ? rim(pile, 0.5, 0.11)(x, y) : 9),
  ])
  const s = mass(puff, PUFFS.map(([[cx, cy, r]]) => bean(arc(cx, cy, r * 0.56, 185, 262, 8), 0.2)))
  return [
    ['path', { d: k, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: a, 'fill-rule': 'evenodd', class: 'wm-a' }],
    ['path', { d: s, 'fill-rule': 'evenodd', class: 'wm-s' }],
  ]
}
