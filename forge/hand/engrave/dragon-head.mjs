// forge/hand/engrave/dragon-head.mjs - front-facing dragon head: two solid swept horns, cheek spikes, angled brows, a broad snout with nostrils and a toothy grin with fangs, whiskers; 45-degree burin lines on the shade side only.
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
const HEAD = [[12, 6.5], ...bez([12, 6.5], [15.8, 6.5], [18.5, 8.6], [18.5, 12]), ...bez([18.5, 12], [18.5, 14.5], [17.5, 16.2], [16.6, 17]), [7.4, 17], ...bez([7.4, 17], [6.5, 16.2], [5.5, 14.5], [5.5, 12]), ...bez([5.5, 12], [5.5, 8.6], [8.2, 6.5], [12, 6.5])]
const SNOUT = [[7.5, 15], ...bez([7.5, 15], [7.5, 14], [9, 13.6], [12, 13.6]), ...bez([12, 13.6], [15, 13.6], [16.5, 14], [16.5, 15]), [17, 19], ...bez([17, 19], [17, 20.5], [15, 21.3], [12, 21.3]), ...bez([12, 21.3], [9, 21.3], [7, 20.5], [7, 19])]
const FEAT = [[9, 10.9], [15, 10.9], [10, 15.9], [14, 15.9], [9.7, 18.9], [14.3, 18.9]]
const U = (x, y) => inP(HEAD, x, y) || inP(SNOUT, x, y)
const E = (x, y) => Math.min(dP(HEAD, x, y), dP(SNOUT, x, y))

export default function render() {
  const out = []
  out.push(['path', { d: shadowD(U, range(-7, 7, 0.85)), 'stroke-width': 0.3, class: 'wm-shadow' }])
  const hd = hatchD((x, y) => U(x, y) && E(x, y) > 1.05 && (x - 12) + (y - 14) > 5 && FEAT.every(([a, b]) => Math.hypot(x - a, y - b) > 1.9) && !(y > 17 && y < 18.9) && !(y > 13.2 && y < 14.1), range(-7, 7, 0.9))
  out.push(['path', { d: hd, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: 'M7.4 17 C6.5 16.2 5.5 14.5 5.5 12 C5.5 8.6 8.2 6.5 12 6.5 C15.8 6.5 18.5 8.6 18.5 12 C18.5 14.5 17.5 16.2 16.6 17', class: 'wm-k' }])
  out.push(['path', { d: 'M7.5 15 C7.5 14 9 13.6 12 13.6 C15 13.6 16.5 14 16.5 15 L17 19 C17 20.5 15 21.3 12 21.3 C9 21.3 7 20.5 7 19 Z', class: 'wm-k' }])
  out.push(['path', { d: 'M8.6 7.6 C8 5.6 6.8 3.8 5 2.2 C8 2.4 10.2 4.4 10.9 7.2 Z', fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }])
  out.push(['path', { d: 'M15.4 7.6 C16 5.6 17.2 3.8 19 2.2 C16 2.4 13.8 4.4 13.1 7.2 Z', fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }])
  out.push(['path', { d: 'M5.7 9.2 L2.8 7.8 L4.1 10 L2 11.4 L4.3 12 L2.8 14 L5.6 13.6 Z', fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }])
  out.push(['path', { d: 'M18.3 9.2 L21.2 7.8 L19.9 10 L22 11.4 L19.7 12 L21.2 14 L18.4 13.6 Z', fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }])
  out.push(['path', { d: 'M7 18.2 C5.2 17.6 3.8 19.4 2.2 18.8 M17 18.2 C18.8 17.6 20.2 19.4 21.8 18.8', class: 'wm-a' }])
  out.push(['path', { d: 'M7.6 8.9 C8.6 7.9 10 8 10.9 8.8 M16.4 8.9 C15.4 7.9 14 8 13.1 8.8', 'stroke-width': 1.1, class: 'wm-a' }])
  out.push(['circle', { cx: 9, cy: 10.9, r: 1, fill: 'currentColor', stroke: 'none', class: 'wm-a' }])
  out.push(['circle', { cx: 15, cy: 10.9, r: 1, fill: 'currentColor', stroke: 'none', class: 'wm-a' }])
  out.push(['ellipse', { cx: 10, cy: 15.9, rx: 0.8, ry: 0.65, fill: 'currentColor', stroke: 'none', class: 'wm-a' }])
  out.push(['ellipse', { cx: 14, cy: 15.9, rx: 0.8, ry: 0.65, fill: 'currentColor', stroke: 'none', class: 'wm-a' }])
  out.push(['path', { d: 'M8.6 17.8 C10.6 18.5 13.4 18.5 15.4 17.8', class: 'wm-k' }])
  out.push(['path', { d: 'M9.1 18.2 L9.8 19.9 L10.5 18.5 Z M13.5 18.5 L14.2 19.9 L14.9 18.2 Z', fill: 'currentColor', 'stroke-width': 0.4, class: 'wm-a' }])
  return out
}
