// ENGRAVE helpers — analytic line/region clipping and compact path output.
// Every hatch line is clipped exactly: a region is described by rings (even-odd)
// plus "capsules" (segments dilated by a radius). A capsule is convex, so a
// line meets it in ONE interval; a ring set meets it in sorted crossing pairs.
import { simplify } from '../kernel/geom.mjs'

// ---------------------------------------------------------------- intervals
export const merge = iv => {
  iv.sort((a, b) => a[0] - b[0])
  const out = []
  for (const x of iv) {
    const l = out[out.length - 1]
    if (l && x[0] <= l[1]) { if (x[1] > l[1]) l[1] = x[1] } else out.push([x[0], x[1]])
  }
  return out
}
export const subtract = (A, B) => {
  if (!B.length) return A
  const out = []
  for (const [a0, a1] of A) {
    let s = a0
    for (const [b0, b1] of B) {
      if (b1 <= s) continue
      if (b0 >= a1) break
      if (b0 > s) out.push([s, b0])
      if (b1 > s) s = b1
      if (s >= a1) break
    }
    if (s < a1) out.push([s, a1])
  }
  return out
}

// ---------------------------------------------------------------- line tests
// line: P(t) = O + t D  (D unit)
export function ringsT(O, D, rings, out = []) {
  const ts = []
  for (const r of rings) {
    const n = r.length
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const a = r[j], b = r[i]
      const sa = D[0] * (a[1] - O[1]) - D[1] * (a[0] - O[0])
      const sb = D[0] * (b[1] - O[1]) - D[1] * (b[0] - O[0])
      if ((sa > 0) !== (sb > 0)) {
        const f = sa / (sa - sb)
        const px = a[0] + (b[0] - a[0]) * f, py = a[1] + (b[1] - a[1]) * f
        ts.push(D[0] * (px - O[0]) + D[1] * (py - O[1]))
      }
    }
  }
  ts.sort((a, b) => a - b)
  for (let i = 0; i + 1 < ts.length; i += 2) if (ts[i + 1] > ts[i]) out.push([ts[i], ts[i + 1]])
  return out
}

// segments: flat array of [ax, ay, bx, by]
export function capsulesT(O, D, segs, r, out = []) {
  const r2 = r * r
  for (let k = 0; k < segs.length; k++) {
    const g = segs[k], ax = g[0], ay = g[1], bx = g[2], by = g[3]
    // quick reject: perpendicular distance of both ends beyond r on the same side
    const sa = D[0] * (ay - O[1]) - D[1] * (ax - O[0])
    const sb = D[0] * (by - O[1]) - D[1] * (bx - O[0])
    if ((sa > r && sb > r) || (sa < -r && sb < -r)) continue
    let lo = Infinity, hi = -Infinity
    for (let e = 0; e < 2; e++) {
      const wx = O[0] - (e ? bx : ax), wy = O[1] - (e ? by : ay)
      const B = D[0] * wx + D[1] * wy, C = wx * wx + wy * wy - r2, q = B * B - C
      if (q >= 0) { const s = Math.sqrt(q); if (-B - s < lo) lo = -B - s; if (-B + s > hi) hi = -B + s }
    }
    const ex = bx - ax, ey = by - ay, L = Math.hypot(ex, ey)
    if (L > 1e-9) {
      const ux = ex / L, uy = ey / L, wx = O[0] - ax, wy = O[1] - ay
      const s0 = ux * wy - uy * wx, sd = ux * D[1] - uy * D[0]
      const q0 = ux * wx + uy * wy, qd = ux * D[0] + uy * D[1]
      let t0 = -Infinity, t1 = Infinity, ok = true
      const lim = (c0, cd, l, h) => {
        if (Math.abs(cd) < 1e-12) { if (c0 < l || c0 > h) ok = false; return }
        let ta = (l - c0) / cd, tb = (h - c0) / cd
        if (ta > tb) { const z = ta; ta = tb; tb = z }
        if (ta > t0) t0 = ta; if (tb < t1) t1 = tb
      }
      lim(s0, sd, -r, r); lim(q0, qd, 0, L)
      if (ok && t0 <= t1) { if (t0 < lo) lo = t0; if (t1 > hi) hi = t1 }
    }
    if (lo < hi) out.push([lo, hi])
  }
  return out
}

// polylines -> segment list (simplified first: fewer tests, same shape)
export function segsOf(polys, tol = 0.012) {
  const out = []
  for (const { pts, closed } of polys) {
    if (!pts || pts.length < 1) continue
    if (pts.length === 1) { out.push([pts[0][0], pts[0][1], pts[0][0], pts[0][1]]); continue }
    const P = simplify(pts, tol, closed)
    for (let i = 0; i + 1 < P.length; i++) out.push([P[i][0], P[i][1], P[i + 1][0], P[i + 1][1]])
    if (closed && P.length > 2) out.push([P.at(-1)[0], P.at(-1)[1], P[0][0], P[0][1]])
  }
  return out
}

// ---------------------------------------------------------------- output
// Compact path data: absolute M, then relative l with minimal separators.
// Deltas are taken between ROUNDED absolute points so nothing drifts.
const num = c => { // c = integer hundredths
  let s = (c / 100).toString()
  if (s.startsWith('0.')) s = s.slice(1); else if (s.startsWith('-0.')) s = '-' + s.slice(2)
  return s
}
export function joinNums(cs) {
  let out = '', prevDot = false, first = true
  for (const c of cs) {
    const s = num(c)
    if (!first && !(s[0] === '-' || (s[0] === '.' && prevDot))) out += ' '
    out += s; prevDot = s.includes('.'); first = false
  }
  return out
}
export function ringD(pts, closed = true) {
  const R = pts.map(p => [Math.round(p[0] * 100), Math.round(p[1] * 100)])
  const Q = []
  for (const p of R) { const l = Q[Q.length - 1]; if (!l || l[0] !== p[0] || l[1] !== p[1]) Q.push(p) }
  if (closed && Q.length > 1 && Q[0][0] === Q.at(-1)[0] && Q[0][1] === Q.at(-1)[1]) Q.pop()
  if (Q.length < 2) return ''
  let d = 'M' + joinNums(Q[0])
  const rel = []
  for (let i = 1; i < Q.length; i++) rel.push(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1])
  d += 'l' + joinNums(rel)
  return d + (closed ? 'z' : '')
}
