// forge/hand/sketch/ungroup.mjs — two hand-drawn rounded squares pulled clearly apart on the diagonal, the first fully hachured and the second
// lightly shaded, replacing two small near-identical squares that read as one cluster at 16px.
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
  const back = outline(rect(2.75, 3, 11.25, 10.75), 2.1, true)
  const front = outline(rect(12.75, 13.25, 21.25, 21), 2.1, true)
  return [
    ['path', { d: 'M4.4 8.6L8.4 4.6M5.1 10.1L10.1 5.1M7.6 10.1L10.2 7.5M14.9 19.9L19.6 15.2M17.6 20.1L20.1 17.6', ...HATCH }],
    ['path', { d: pen(back, { ph: 1.2, amp: 0.12, dx: 0.25, dy: 0.2 }), ...GHOST, class: 'wm-k' }],
    ['path', { d: pen(back, { ph: 0.3, over: 1.6 }), 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: pen(front, { ph: 2.1, amp: 0.12, dx: -0.2, dy: 0.25 }), ...GHOST, class: 'wm-a' }],
    ['path', { d: pen(front, { ph: 0.9, over: 1.6 }), 'stroke-width': 1.45, class: 'wm-a' }],
  ]
}
