// forge/hand/engrave/avatar-bunny.mjs - round head with long ears (solid inner ear leaves), eye dots and a solid nose; shade is three evenly spaced concentric burin arcs that follow the head curve.
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
const HEAD = ell(12, 15, 6.25, 6.25, 0, 72)
const EARL = ell(9, 6, 1.75, 4, -10)
const EARR = ell(15, 6, 1.75, 4, 10)
const U = (x, y) => inP(HEAD, x, y) || inP(EARL, x, y) || inP(EARR, x, y)
const arc = (r, a0, a1) => { const f = a => R(12 + r * Math.cos(a * Math.PI / 180)) + ' ' + R(15 + r * Math.sin(a * Math.PI / 180)); return 'M' + f(a0) + 'A' + r + ' ' + r + ' 0 0 1 ' + f(a1) }

export default function render() {
  const out = []
  out.push(['path', { d: shadowD(U, range(-8, 8, 0.85)), 'stroke-width': 0.3, class: 'wm-shadow' }])
  // evenly spaced burin arcs that follow the head curve on the shade side
  out.push(['path', { d: arc(5.15, -8, 104) + arc(4.2, 14, 80), 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: 'M8.75 9.5 A1.75 4 -10 1 1 10.5 8.75 M13.5 8.75 A1.75 4 10 1 1 15.25 9.5', class: 'wm-k' }])
  out.push(['path', { d: 'M18.25 15 A6.25 6.25 0 1 1 5.75 15 A6.25 6.25 0 1 1 18.25 15 Z', class: 'wm-k' }])
  out.push(['path', { d: 'M9.5 8.75 A0.75 2.5 -10 1 1 8.5 3.75 A0.75 2.5 -10 1 1 9.5 8.75 Z M14.5 8.75 A0.75 2.5 10 1 1 15.5 3.75 A0.75 2.5 10 1 1 14.5 8.75 Z', fill: 'currentColor', stroke: 'none', class: 'wm-a' }])
  out.push(['path', { d: 'M9.5 13.9 V14.5 M14.5 13.9 V14.5', class: 'wm-a' }])
  out.push(['path', { d: 'M10.9 16.9 H13.1 L12 18.15 Z', fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }])
  return out
}
