// forge/hand/engrave/lightbulb-off.mjs - bulb with the line version gaps around the slash, two screw grooves on the base and three parallel burin lines on the right of the dome; the slash is the badge.
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
const TOP = ell(12, 9, 7, 7, 0, 100).filter(([, y]) => y <= 9).sort((a, b) => a[0] - b[0])
const BULB = [...TOP, ...bez([19, 9], [18.8, 11.5], [15, 13.87], [15, 15.5], 14), [15, 19], ...bez([15, 19], [15, 20.1], [14.1, 21], [13, 21], 8), [11, 21], ...bez([11, 21], [9.9, 21], [9, 20.1], [9, 19], 8), [9, 15.5], ...bez([9, 15.5], [9, 13.87], [5.2, 11.5], [5, 9], 14)]
const U = (x, y) => inP(BULB, x, y)
const G = 2.1
const pOf = ([x, y]) => (x - y) * Q
// the closed outline, cut open where the slash passes (gap of G each side)
function outline() {
  const n = BULB.length
  let s0 = BULB.findIndex(q => Math.abs(pOf(q)) < G)
  const P = [...BULB.slice(s0), ...BULB.slice(0, s0)]
  P.push(P[0])
  const edge = (a, b) => { const pa = pOf(a), pb = pOf(b), tg = Math.sign(pa || pb) * G, f = (tg - pa) / (pb - pa); return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f] }
  let d = '', cur = null
  for (let i = 0; i < P.length; i++) {
    const q = P[i], keep = Math.abs(pOf(q)) >= G
    if (keep) {
      if (!cur) { cur = []; if (i > 0) cur.push(edge(P[i - 1], q)) }
      cur.push(q)
    } else if (cur) { cur.push(edge(cur[cur.length - 1], q)); d += 'M' + cur.map(([x, y]) => R(x) + ' ' + R(y)).join('L'); cur = null }
  }
  if (cur) d += 'M' + cur.map(([x, y]) => R(x) + ' ' + R(y)).join('L')
  return d
}

export default function render() {
  const out = []
  out.push(['path', { d: shadowD(U, [-7.4, -6.5, -5.6, -4.7, -3.8, -3, 3, 3.9, 4.8, 5.7, 6.6, 7.4]), 'stroke-width': 0.3, class: 'wm-shadow' }])
  const hd = hatchD((x, y) => U(x, y) && dP(BULB, x, y) > 1.05 && y < 13, [3.9, 4.8, 5.7])
  out.push(['path', { d: hd, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: outline(), class: 'wm-k' }])
  out.push(['path', { d: 'M9 15.5 H15 M10 17.4 H14 M10.6 19 H13.4', 'stroke-width': 0.8, class: 'wm-k' }])
  out.push(['path', { d: 'M3 3 L21 21', class: 'wm-s' }])
  return out
}
