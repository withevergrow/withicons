// forge/hand/gloss/holi-splash.mjs — a fat colour splat: a stretched, lumpy core thrown out into uneven tapered arms (some
// beaded, some blunt), a three-lobed inner splat in a groove, and three teardrops flying off: the earlier round core with
// evenly spaced ball-tipped tendrils read as a germ or a sun, and its round inner splat as an eyeball.
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

const tube = (pts, r0, r1) => {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const T = L[L.length - 1]
  return (x, y) => { let d = Infinity; for (let i = 1; i < pts.length; i++) { const [q, t] = segD(x, y, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]); const u = (L[i - 1] + t * (L[i] - L[i - 1])) / T; d = Math.min(d, q - (r0 + (r1 - r0) * u)) } return d }
}
const arc = (cx, cy, r, a0, a1, n = 12) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })
const at = (deg, r) => [12 + r * Math.cos(deg * Math.PI / 180), 12 + r * Math.sin(deg * Math.PI / 180)]

const tear = (cx, cy, r, tx, ty) => join(0.6, circ(cx, cy, r), tube([[tx, ty], [cx, cy]], 0.12, r * 0.92))
const ell = (cx, cy, r, sx) => (x, y) => (Math.hypot((x - cx) / sx, y - cy) - r) * Math.min(sx, 1)

// ---- the drawing -------------------------------------------------------------------------------------------
// the core: an ellipse stretched ~10% wide with bumps of unequal size, so it never reads as a coin or a sun
const BUMPS = [[-70, 5.0, 1.7], [-8, 5.4, 1.45], [70, 5.0, 2.0], [150, 5.3, 1.5], [228, 5.1, 1.85]]
const core = join(1.1, ell(12, 12, 5.25, 1.1), circ(12.6, 11.5, 4.9), ...BUMPS.map(([a, r, b]) => { const c = at(a, r); return circ(c[0], c[1], b) }))
// splash arms: [angle, tip radius, root half-width, bead radius or 0 for a blunt tip]; unequal lengths at uneven angles
const ARMS = [[-112, 9.9, 1.35, 0.95], [-46, 8.1, 1.15, 0], [8, 10.0, 1.3, 0.85], [52, 7.9, 1.05, 0], [112, 9.6, 1.3, 0.9], [168, 8.0, 1.1, 0], [205, 9.7, 1.25, 0.8]]
const TUBES = ARMS.map(([a, r, w, b]) => tube([at(a, 4.0), at(a, b ? r - b * 0.9 : r)], w, b ? 0.32 : 0.55))
const body = join(0.9, core, ...TUBES, ...ARMS.filter(q => q[3]).map(([a, r, , b]) => { const q = at(a, r - b * 0.35); return circ(q[0], q[1], b) }))
// flying drops: teardrops in the gaps between the arms, tails pointing back at the core
const DROPS = [[-79, 10.0, 0.95], [-17, 9.9, 0.8], [84, 10.2, 0.9]]
const dropF = DROPS.map(([g, r, b]) => { const c = at(g, r), t = at(g, r - b - 1.1); return tear(c[0], c[1], b, t[0], t[1]) })
const drops = (x, y) => Math.min(...dropF.map(f => f(x, y)))
// the inner splat: an irregular three-lobed blob, off-centre on a round heart that spins about (12, 12)
const inner = join(0.6, circ(12, 12, 2.4), circ(14.15, 10.3, 1.5), circ(9.85, 14.25, 1.3), circ(14.75, 13.7, 0.95))
// a groove parts the inner splat from the core all the way round (an echo of the splash), widest on the shadow side
const emboss = (x, y) => {
  const d = inner(x, y); if (d < -0.2 || d > 1.2) return 9
  const e = 0.05, nx = inner(x + e, y) - inner(x - e, y), ny = inner(x, y + e) - inner(x, y - e), l = Math.hypot(nx, ny) || 1
  const w = 0.2 + 0.12 * sstep(-0.5, 0.5, -(nx * LX + ny * LY) / l)   // all the way round, wider on the shadow side
  return w < 0.03 ? 9 : Math.abs(d - 0.34) - w
}

export default function render() {
  const k = mass(body, [
    emboss,
    circ(12, 12, 2.05),   // a round well under the inner splat: the splat covers it at every angle, so its sheen shows and never doubles
    ...ARMS.filter(([a, , , b]) => b && (a < -90 || a > 180)).map(([a, r, , b]) => { const q = at(a, r - b * 0.35); return circ(q[0] - 0.3, q[1] - 0.3, 0.25) }),   // glints on the lit beads
  ])
  const a = mass(inner, [bean([[10.55, 12.55], [10.75, 11.3], [11.55, 10.5]], 0.38)])   // the inner sheen lives on the spinning part only
  const s = mass(drops, DROPS.map(([g, r, b]) => { const c = at(g, r); return bean(arc(c[0], c[1], b * 0.55, 185, 262, 8), 0.17) }))
  return [
    ['path', { d: k, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: a, 'fill-rule': 'evenodd', class: 'wm-a' }],
    ['path', { d: s, 'fill-rule': 'evenodd', class: 'wm-s' }],
  ]
}
