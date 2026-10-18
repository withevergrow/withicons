// forge/hand/sketch/cloud-cog.mjs — a hand-drawn cloud arching over a chunky six-tooth gear with a clear gap between them, replacing a small
// jagged gear that sank into the cloud outline in sketch.
const f = (v) => +v.toFixed(2)
// corners of a polygon rounded with quadratic samples (open paths keep their ends sharp)
function outline(poly, r, closed) {
  const n = poly.length
  const out = []
  for (let i = 0; i < n; i++) {
    const p = poly[i]
    const rr = Array.isArray(r) ? r[i] : r
    if ((!closed && (i === 0 || i === n - 1)) || !rr) { out.push(p); continue }
    const a = poly[(i - 1 + n) % n]
    const b = poly[(i + 1) % n]
    const da = Math.hypot(a[0] - p[0], a[1] - p[1])
    const db = Math.hypot(b[0] - p[0], b[1] - p[1])
    const ra = Math.min(rr, da / 2)
    const rb = Math.min(rr, db / 2)
    const s = [p[0] + (a[0] - p[0]) * ra / da, p[1] + (a[1] - p[1]) * ra / da]
    const e = [p[0] + (b[0] - p[0]) * rb / db, p[1] + (b[1] - p[1]) * rb / db]
    for (let k = 0; k <= 4; k++) {
      const t = k / 4
      out.push([(1 - t) * (1 - t) * s[0] + 2 * t * (1 - t) * p[0] + t * t * e[0], (1 - t) * (1 - t) * s[1] + 2 * t * (1 - t) * p[1] + t * t * e[1]])
    }
  }
  if (closed) out.push(out[0])
  return out
}
// resample by arc length, wobble along the normal, overshoot a closed loop, smooth with quadratic midpoints
function pen(pts, { amp = 0.14, ph = 0, step = 1, over = 0, drift = 0.4, dx = 0, dy = 0 } = {}) {
  const seg = []
  let L = 0
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l }
  const at = (s) => {
    s = ((s % L) + L) % L
    let i = 0
    while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++ }
    const t = seg[i] ? s / seg[i] : 0
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]
  }
  const total = L + over
  const n = Math.max(2, Math.round(total / step))
  const q = []
  for (let k = 0; k <= n; k++) {
    const s = total * k / n
    const cl = (v) => (over ? v : Math.max(0, Math.min(L - 1e-6, v)))
    const a = at(cl(s - 0.05))
    const b = at(cl(s + 0.05))
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const nx = -(b[1] - a[1]) / len
    const ny = (b[0] - a[0]) / len
    const w = amp * Math.sin(s * 0.85 + ph) + amp * 0.6 * Math.sin(s * 2.3 + ph * 1.7) + (over && s > L ? (s - L) / over * drift : 0)
    const p = at(cl(s))
    q.push([p[0] + nx * w + dx, p[1] + ny * w + dy])
  }
  let d = 'M' + f(q[0][0]) + ' ' + f(q[0][1])
  for (let i = 1; i < q.length - 1; i++) {
    const m = [(q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2]
    d += 'Q' + f(q[i][0]) + ' ' + f(q[i][1]) + ' ' + f(m[0]) + ' ' + f(m[1])
  }
  d += 'L' + f(q[q.length - 1][0]) + ' ' + f(q[q.length - 1][1])
  return d
}
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const circ = (cx, cy, r, a0 = -120) => { const p = []; for (let i = 0; i < 32; i++) { const a = (a0 + i * 360 / 32) * Math.PI / 180; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) } p.push(p[0]); return p }
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }

export default function render() {
  const cloud = []
  const arcs = [[6.4, 11.1, 4.2, 108, 255], [12.1, 8.9, 5.9, 200, 345], [17.9, 11.3, 3.9, 290, 435]]
  for (const [cx, cy, r, a0, a1] of arcs) for (let k = 0; k <= 12; k++) { const a = (a0 + (a1 - a0) * k / 12) * Math.PI / 180; cloud.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  const gear = []
  for (let k = 0; k < 6; k++) {
    const a = k * 60 - 90
    for (const [da, r] of [[-30 + 7, 3.15], [-12, 4.55], [12, 4.55], [30 - 7, 3.15]]) gear.push([12 + r * Math.cos((a + da) * Math.PI / 180), 17 + r * Math.sin((a + da) * Math.PI / 180)])
  }
  const g = outline(gear, 0.35, true)
  return [
    ['path', { d: 'M13.6 9.9L16.6 6.9M15.9 10.3L18.2 8M8.6 8.7L10.4 6.9', ...HATCH, class: 'wm-k' }],
    ['path', { d: pen(cloud, { ph: 1.3, amp: 0.1, dx: 0.25, dy: 0.2 }), ...GHOST, class: 'wm-k' }],
    ['path', { d: pen(cloud, { ph: 0.2, amp: 0.1 }), 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: pen(g, { ph: 0.7, amp: 0.06, step: 0.6, over: 0.8, drift: 0.2 }) + pen(circ(12, 17, 1.35, -100), { amp: 0.04, step: 0.5, over: 0.6, drift: 0.15 }), 'stroke-width': 1.4, class: 'wm-s' }],
  ]
}
