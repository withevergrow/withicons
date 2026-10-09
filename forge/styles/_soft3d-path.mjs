// SOFT 3D path writer (from the retired iso style): polylines -> compact SVG path data.
// Rings are split at corners, smooth runs are fitted with cubic Beziers (Schneider's method, within a tolerance),
// straight runs stay lines; output is relative commands on a 0.01 grid, computed from rounded absolute points so
// nothing drifts. Deterministic, never throws on degenerate input.
import { simplify } from '../kernel/geom.mjs'

const r2 = n => Math.round(n * 100) / 100
const num = n => {
  let s = String(r2(n))
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
// join numbers with the shortest separators ("1-2.5.5")
function nums(arr) {
  let out = ''
  for (let i = 0; i < arr.length; i++) {
    const s = num(arr[i])
    if (i === 0 || s[0] === '-') out += s
    else {
      const prev = out
      const prevHasDot = /\.\d*$/.test(prev) && !/[eE]/.test(prev)
      out += (s[0] === '.' && prevHasDot) ? s : ' ' + s
    }
  }
  return out
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, k) => [a[0] * k, a[1] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const len = a => Math.hypot(a[0], a[1])
const unit = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l] }

function bez(c, t) {
  const m = 1 - t
  return [
    m * m * m * c[0][0] + 3 * m * m * t * c[1][0] + 3 * m * t * t * c[2][0] + t * t * t * c[3][0],
    m * m * m * c[0][1] + 3 * m * m * t * c[1][1] + 3 * m * t * t * c[2][1] + t * t * t * c[3][1],
  ]
}
function chordParams(pts) {
  const u = [0]
  for (let i = 1; i < pts.length; i++) u.push(u[i - 1] + len(sub(pts[i], pts[i - 1])))
  const L = u[u.length - 1] || 1
  return u.map(x => x / L)
}
function fitOne(pts, u, t1, t2) {
  const p0 = pts[0], p3 = pts[pts.length - 1]
  let c00 = 0, c01 = 0, c11 = 0, x0 = 0, x1 = 0
  for (let i = 0; i < pts.length; i++) {
    const t = u[i], m = 1 - t
    const b0 = m * m * m, b1 = 3 * m * m * t, b2 = 3 * m * t * t, b3 = t * t * t
    const a1 = mul(t1, b1), a2 = mul(t2, b2)
    c00 += dot(a1, a1); c01 += dot(a1, a2); c11 += dot(a2, a2)
    const tmp = sub(pts[i], add(mul(p0, b0 + b1), mul(p3, b2 + b3)))
    x0 += dot(a1, tmp); x1 += dot(a2, tmp)
  }
  const det = c00 * c11 - c01 * c01
  const seg = len(sub(p3, p0))
  let a = 0, b = 0
  if (Math.abs(det) > 1e-12) { a = (x0 * c11 - x1 * c01) / det; b = (c00 * x1 - c01 * x0) / det }
  if (!(a > seg * 1e-3) || !(b > seg * 1e-3) || a > seg * 2 || b > seg * 2) { a = b = seg / 3 }
  return [p0, add(p0, mul(t1, a)), add(p3, mul(t2, b)), p3]
}
function maxErr(c, pts, u) {
  let e = 0, at = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const d = len(sub(bez(c, u[i]), pts[i]))
    if (d > e) { e = d; at = i }
  }
  return [e, at]
}
// fit a smooth run; returns a list of cubic control tuples
function fitRun(pts, t1, t2, tol, depth = 0) {
  if (pts.length < 3) return [[pts[0], add(pts[0], mul(sub(pts[1], pts[0]), 1 / 3)), add(pts[0], mul(sub(pts[1], pts[0]), 2 / 3)), pts[1]]]
  let u = chordParams(pts)
  let c = fitOne(pts, u, t1, t2)
  let [e, at] = maxErr(c, pts, u)
  if (e <= tol) return [c]
  if (depth > 10 || pts.length < 4) return [c]
  at = Math.max(1, Math.min(pts.length - 2, at))
  const tm = unit(sub(pts[at - 1], pts[at + 1]))
  return [...fitRun(pts.slice(0, at + 1), t1, tm, tol, depth + 1), ...fitRun(pts.slice(at), mul(tm, -1), t2, tol, depth + 1)]
}

const turn = (a, b, c) => {
  const u = unit(sub(b, a)), v = unit(sub(c, b))
  return Math.acos(Math.max(-1, Math.min(1, dot(u, v))))
}

// one ring/polyline -> list of segments: ['L', p] or ['C', c1, c2, p]
function segments(pts, closed, tol) {
  let P = pts
  if (closed && P.length > 2 && len(sub(P[0], P[P.length - 1])) < 1e-6) P = P.slice(0, -1)
  if (P.length < 2) return { start: P[0], segs: [] }
  const n = P.length
  const corner = new Array(n).fill(false)
  const CORNER = 0.6 // ~34 degrees
  for (let i = 0; i < n; i++) {
    if (!closed && (i === 0 || i === n - 1)) { corner[i] = true; continue }
    const a = P[(i - 1 + n) % n], b = P[i], c = P[(i + 1) % n]
    if (turn(a, b, c) > CORNER) corner[i] = true
  }
  let st = corner.indexOf(true)
  if (closed && corner.filter(Boolean).length < 3) { // too few corners: add the farthest points so no run closes on itself
    if (st < 0) st = 0
    corner[st] = true
    let far = st, fd = -1
    for (let i = 0; i < n; i++) { const d = len(sub(P[i], P[st])); if (d > fd) { fd = d; far = i } }
    corner[far] = true
    const q = (st + far) >> 1, q2 = ((far + n + st) >> 1) % n
    if (q !== st && q !== far) corner[q] = true
    if (q2 !== st && q2 !== far) corner[q2] = true
  }
  let order
  order = closed ? [...P.slice(st), ...P.slice(0, st), P[st]] : P.slice()
  const cor = closed ? [...corner.slice(st), ...corner.slice(0, st), true] : corner.slice()
  const segs = []
  let i0 = 0
  for (let i = 1; i < order.length; i++) {
    if (!cor[i] && i < order.length - 1) continue
    const run = order.slice(i0, i + 1)
    if (run.length === 2) segs.push(['L', run[1]])
    else {
      // straight run?
      const a = run[0], b = run[run.length - 1], d = unit(sub(b, a)), nrm = [-d[1], d[0]]
      const dev = Math.max(...run.map(p => Math.abs(dot(sub(p, a), nrm))))
      if (dev <= tol) segs.push(['L', b])
      else {
        const t1 = unit(sub(run[1], run[0])), t2 = unit(sub(run[run.length - 2], run[run.length - 1]))
        for (const c of fitRun(run, t1, t2, tol)) segs.push(['C', c[1], c[2], c[3]])
      }
    }
    i0 = i
  }
  return { start: order[0], segs }
}

// rings/polylines -> path data
export function pathD(polys, { closed = true, tol = 0.04, pre = 0.02 } = {}) {
  let out = ''
  for (const ring of polys) {
    if (!ring || ring.length < (closed ? 3 : 2)) continue
    let pts
    try { pts = simplify(ring, pre, closed) } catch { pts = ring }
    if (pts.length < (closed ? 3 : 2)) continue
    const { start, segs } = segments(pts, closed, tol)
    if (!start || !segs.length) continue
    let cur = [r2(start[0]), r2(start[1])]
    let s = 'M' + nums(cur)
    let last = ''
    for (const sg of segs) {
      if (sg[0] === 'L') {
        const p = [r2(sg[1][0]), r2(sg[1][1])]
        const dx = p[0] - cur[0], dy = p[1] - cur[1]
        if (Math.abs(dx) < 0.005 && Math.abs(dy) < 0.005) continue
        if (Math.abs(dy) < 0.005) { s += 'h' + nums([dx]); last = 'h' }
        else if (Math.abs(dx) < 0.005) { s += 'v' + nums([dy]); last = 'v' }
        else { const t = nums([dx, dy]); s += (last === 'l' ? (t[0] === '-' ? '' : ' ') : 'l') + t; last = 'l' }
        cur = p
      } else {
        const c1 = [r2(sg[1][0]), r2(sg[1][1])], c2 = [r2(sg[2][0]), r2(sg[2][1])], p = [r2(sg[3][0]), r2(sg[3][1])]
        const t = nums([c1[0] - cur[0], c1[1] - cur[1], c2[0] - cur[0], c2[1] - cur[1], p[0] - cur[0], p[1] - cur[1]])
        s += (last === 'c' ? (t[0] === '-' ? '' : ' ') : 'c') + t; last = 'c'
        cur = p
      }
    }
    out += s + (closed ? 'z' : '')
  }
  return out
}
