// forge/hand/engrave/avatar-older-man.mjs - bald dome with big solid side-hair tufts, bushy brows, eye dots and a solid moustache; 45-degree burin hatching on the shade side of head and shoulders plus the offset shadow the sibling avatars carry.
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
const HEAD = ell(12, 10.5, 5.5, 6)
const SH = [[4.5, 21.5], ...bez([4.5, 21.5], [4.5, 19.25], [6.25, 18], [8.5, 18]), ...bez([8.5, 18], [9.75, 18], [10.75, 18.75], [12, 18.75]), ...bez([12, 18.75], [13.25, 18.75], [14.25, 18], [15.5, 18]), ...bez([15.5, 18], [17.75, 18], [19.5, 19.25], [19.5, 21.5])]
const inHead = (x, y) => inP(HEAD, x, y)
const inSh = (x, y) => inP(SH, x, y)
const U = (x, y) => inHead(x, y) || inSh(x, y)
const MUSTACHE = (x, y) => x > 8 && x < 16 && y > 12.1 && y < 15.7
const TUFT_L = 'M7 7.4 C6 6.9 4.9 7.5 4.9 8.6 C4.3 9.2 4.4 10.4 5 10.9 C4.8 11.8 5.4 12.6 6.2 12.7 C6.5 13 6.8 13 7 12.9 L6.6 9.5 Z'
const TUFT_R = 'M17 7.4 C18 6.9 19.1 7.5 19.1 8.6 C19.7 9.2 19.6 10.4 19 10.9 C19.2 11.8 18.6 12.6 17.8 12.7 C17.5 13 17.2 13 17 12.9 L17.4 9.5 Z'

export default function render() {
  const out = []
  out.push(['path', { d: shadowD(U, range(-8, 8, 0.85)), 'stroke-width': 0.3, class: 'wm-shadow' }])
  const hc = hatchD((x, y) => inHead(x, y) && dP(HEAD, x, y) > 1.05 && (x - 12) + (y - 10.5) > 4.9 && !MUSTACHE(x, y), range(-8, 8, 0.9))
  const hs = hatchD((x, y) => inSh(x, y) && !inHead(x, y) && dP(SH, x, y) > 0.8 && x > 11.2 && y > 18.6, range(-8, 8, 0.9), 0.6)
  out.push(['path', { d: hc + hs, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: 'M17.5 10.5 A5.5 6 0 1 1 6.5 10.5 A5.5 6 0 1 1 17.5 10.5 Z', class: 'wm-k' }])
  out.push(['path', { d: 'M4.5 21.5 C4.5 19.25 6.25 18 8.5 18 C9.75 18 10.75 18.75 12 18.75 C13.25 18.75 14.25 18 15.5 18 C17.75 18 19.5 19.25 19.5 21.5', class: 'wm-k' }])
  out.push(['path', { d: TUFT_L, fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }])
  out.push(['path', { d: TUFT_R, fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }])
  out.push(['path', { d: 'M8.6 8.9 L10.6 8.6 M15.4 8.9 L13.4 8.6', 'stroke-width': 1, class: 'wm-a' }])
  out.push(['path', { d: 'M9.5 10.5 V11.3 M14.5 10.5 V11.3', class: 'wm-a' }])
  out.push(['path', { d: 'M8.75 14.6 C9.5 12.9 11 12.7 12 13.5 C13 12.7 14.5 12.9 15.25 14.6 C14 15.1 12.75 14.8 12 14.4 C11.25 14.8 10 15.1 8.75 14.6 Z', fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }])
  return out
}
