// forge/hand/engrave/component.mjs - four upright rounded diamonds at the line spacing; burin hatch is clipped inside each diamond and the cast shadow ticks sit only on the lower-right edges, so no strokes escape the shapes.
const R = v => Math.round(v * 100) / 100
const Q = Math.SQRT1_2
const inP = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c } return c }
const dP = (P, x, y) => { let m = 1e9; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[j], b = P[i], dx = b[0] - a[0], dy = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1))); m = Math.min(m, Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy)) } return m }
const bez = (a, b, c, d, n = 16) => { const o = []; for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]) } return o }
const ell = (cx, cy, rx, ry, rot = 0, n = 56) => { const f = rot * Math.PI / 180, o = []; for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI, u = rx * Math.cos(a), v = ry * Math.sin(a); o.push([cx + u * Math.cos(f) - v * Math.sin(f), cy + u * Math.sin(f) + v * Math.cos(f)]) } return o }
// runs of a "\" (down-right) line family: p = perpendicular offset, t = position along the line
const runs = (test, p) => { const o = []; let s = null; for (let t = -18; t <= 18; t += 0.05) { const ok = test(12 + (p + t) * Q, 12 + (t - p) * Q); if (ok && s === null) s = t; if (!ok && s !== null) { o.push([s, t - 0.05]); s = null } } return o }
const pt = (p, t) => R(12 + (p + t) * Q) + ' ' + R(12 + (t - p) * Q)
const hatchD = (test, ps, min = 0.7) => { let d = ''; for (const p of ps) for (const [a, b] of runs(test, p)) if (b - a >= min) d += 'M' + pt(p, a) + 'L' + pt(p, b); return d }
const shadowD = (U, ps, off = 0.85, len = 1.3) => { let d = ''; for (const p of ps) for (const [a, b] of runs(U, p)) { if (b - a < 0.8) continue; const s = b + off, e = b + off + len; if (U(12 + (p + s) * Q, 12 + (s - p) * Q) || U(12 + (p + e) * Q, 12 + (e - p) * Q)) continue; const x = 12 + (p + e) * Q, y = 12 + (e - p) * Q; if (x > 23.6 || y > 23.6) continue; d += 'M' + pt(p, s) + 'L' + pt(p, e) } return d }
const range = (a, b, st) => { const o = []; for (let v = a; v <= b + 1e-9; v += st) o.push(R(v)); return o }
const SHAPES = [
  [12, 5.5, 'wm-k', 'M12.53 2.53 L14.97 4.97 A0.75 0.75 0 0 1 14.97 6.03 L12.53 8.47 A0.75 0.75 0 0 1 11.47 8.47 L9.03 6.03 A0.75 0.75 0 0 1 9.03 4.97 L11.47 2.53 A0.75 0.75 0 0 1 12.53 2.53 Z'],
  [18, 12, 'wm-a', 'M19.03 9.03 L21.47 11.47 A0.75 0.75 0 0 1 21.47 12.53 L19.03 14.97 A0.75 0.75 0 0 1 17.97 14.97 L15.53 12.53 A0.75 0.75 0 0 1 15.53 11.47 L17.97 9.03 A0.75 0.75 0 0 1 19.03 9.03 Z'],
  [12, 18.5, 'wm-k', 'M12.53 15.53 L14.97 17.97 A0.75 0.75 0 0 1 14.97 19.03 L12.53 21.47 A0.75 0.75 0 0 1 11.47 21.47 L9.03 19.03 A0.75 0.75 0 0 1 9.03 17.97 L11.47 15.53 A0.75 0.75 0 0 1 12.53 15.53 Z'],
  [6, 12, 'wm-a', 'M6.03 9.03 L8.47 11.47 A0.75 0.75 0 0 1 8.47 12.53 L6.03 14.97 A0.75 0.75 0 0 1 4.97 14.97 L2.53 12.53 A0.75 0.75 0 0 1 2.53 11.47 L4.97 9.03 A0.75 0.75 0 0 1 6.03 9.03 Z'],
]
const dia = (cx, cy, r) => (x, y) => Math.abs(x - cx) + Math.abs(y - cy) <= r
const U = (x, y) => SHAPES.some(([cx, cy]) => dia(cx, cy, 3.5)(x, y))

export default function render() {
  const out = []
  let sh = ''
  for (const [cx, cy] of SHAPES) sh += shadowD(U, range(-1.8, 1.8, 0.9).map(v => R(v + (cx - cy) * Q)))
  out.push(['path', { d: sh, 'stroke-width': 0.3, class: 'wm-shadow' }])
  for (const [cx, cy, cls] of SHAPES) {
    const d = hatchD((x, y) => dia(cx, cy, 2.25)(x, y) && (x - cx) + (y - cy) > -0.3, [-1.35, -0.45, 0.45, 1.35].map(v => R(v + (cx - cy) * Q)))
    out.push(['path', { d, 'stroke-width': 0.5, class: cls }])
  }
  for (const [, , cls, d] of SHAPES) out.push(['path', { d, class: cls }])
  return out
}
