// with icons geometry kernel — pure functions, no dependencies.
// Coordinates are SVG user units on the 24x24 grid (y points down).

export const Q = n => Math.round(n * 1e4) / 1e4
export const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
  mul: (a, k) => [a[0] * k, a[1] * k],
  len: a => Math.hypot(a[0], a[1]),
  norm: a => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l] },
  dot: (a, b) => a[0] * b[0] + a[1] * b[1],
  cross: (a, b) => a[0] * b[1] - a[1] * b[0],
  dist: (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]),
}

// ---------------------------------------------------------------------------
// SVG path data -> subpaths of flattened points.
// Supports M m L l H h V v C c S s Q q T t A a Z z. Returns [{ pts, closed }].
// ---------------------------------------------------------------------------
export function parsePath(d, step = 0.2) {
  const toks = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || []
  const subs = []
  let cur = null, i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, lcx = 0, lcy = 0, lqx = 0, lqy = 0, prev = ''
  const num = () => parseFloat(toks[i++])
  const isNum = () => i < toks.length && !/^[A-Za-z]$/.test(toks[i])
  const push = (px, py) => {
    const l = cur.pts[cur.pts.length - 1]
    if (!l || Math.hypot(l[0] - px, l[1] - py) > 1e-4) cur.pts.push([px, py])
  }
  const cubic = (x1, y1, x2, y2, x3, y3) => {
    const L = Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2)
    const n = Math.max(6, Math.ceil(L / step))
    for (let k = 1; k <= n; k++) {
      const t = k / n, m = 1 - t
      push(m * m * m * x + 3 * m * m * t * x1 + 3 * m * t * t * x2 + t * t * t * x3,
           m * m * m * y + 3 * m * m * t * y1 + 3 * m * t * t * y2 + t * t * t * y3)
    }
    lcx = x2; lcy = y2; x = x3; y = y3
  }
  const quad = (x1, y1, x2, y2) => {
    const L = Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1)
    const n = Math.max(5, Math.ceil(L / step))
    for (let k = 1; k <= n; k++) {
      const t = k / n, m = 1 - t
      push(m * m * x + 2 * m * t * x1 + t * t * x2, m * m * y + 2 * m * t * y1 + t * t * y2)
    }
    lqx = x1; lqy = y1; x = x2; y = y2
  }
  const arc = (rx, ry, phi, fa, fs, x2, y2) => {
    // endpoint -> centre parameterisation (SVG spec F.6.5)
    if (rx === 0 || ry === 0) { push(x2, y2); x = x2; y = y2; return }
    rx = Math.abs(rx); ry = Math.abs(ry)
    const p = phi * Math.PI / 180, cp = Math.cos(p), sp = Math.sin(p)
    const dx = (x - x2) / 2, dy = (y - y2) / 2
    const x1p = cp * dx + sp * dy, y1p = -sp * dx + cp * dy
    let lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
    if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s }
    const num2 = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    let co = Math.sqrt(Math.max(0, num2 / den)); if (fa === fs) co = -co
    const cxp = co * rx * y1p / ry, cyp = -co * ry * x1p / rx
    const cx = cp * cxp - sp * cyp + (x + x2) / 2, cy = sp * cxp + cp * cyp + (y + y2) / 2
    const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
    const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
    let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
    if (!fs && dt > 0) dt -= 2 * Math.PI; else if (fs && dt < 0) dt += 2 * Math.PI
    const n = Math.max(6, Math.ceil(Math.abs(dt) * Math.max(rx, ry) / step))
    for (let k = 1; k <= n; k++) {
      const t = t1 + dt * k / n
      push(cx + rx * Math.cos(t) * cp - ry * Math.sin(t) * sp, cy + rx * Math.cos(t) * sp + ry * Math.sin(t) * cp)
    }
    x = x2; y = y2
  }
  while (i < toks.length) {
    if (!isNum()) cmd = toks[i++]
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase()
    const ox = rel ? x : 0, oy = rel ? y : 0
    if (C === 'Z') {
      if (cur) { cur.closed = true; x = sx; y = sy }
      prev = C; continue
    }
    if (C === 'M') {
      x = ox + num(); y = oy + num(); sx = x; sy = y
      cur = { pts: [[x, y]], closed: false }; subs.push(cur)
      cmd = rel ? 'l' : 'L'; prev = 'M'; continue
    }
    if (!cur) { cur = { pts: [[x, y]], closed: false }; subs.push(cur) }
    if (cur.closed) { cur = { pts: [[x, y]], closed: false }; subs.push(cur) }
    if (C === 'L') { x = ox + num(); y = oy + num(); push(x, y) }
    else if (C === 'H') { x = ox + num(); push(x, y) }
    else if (C === 'V') { y = oy + num(); push(x, y) }
    else if (C === 'C') { const a = ox + num(), b = oy + num(), c = ox + num(), e = oy + num(), f = ox + num(), g = oy + num(); cubic(a, b, c, e, f, g) }
    else if (C === 'S') {
      const rx1 = /[CS]/.test(prev) ? 2 * x - lcx : x, ry1 = /[CS]/.test(prev) ? 2 * y - lcy : y
      const c = ox + num(), e = oy + num(), f = ox + num(), g = oy + num(); cubic(rx1, ry1, c, e, f, g)
    }
    else if (C === 'Q') { const a = ox + num(), b = oy + num(), c = ox + num(), e = oy + num(); quad(a, b, c, e) }
    else if (C === 'T') {
      const qx = /[QT]/.test(prev) ? 2 * x - lqx : x, qy = /[QT]/.test(prev) ? 2 * y - lqy : y
      const c = ox + num(), e = oy + num(); quad(qx, qy, c, e)
    }
    else if (C === 'A') { const a = num(), b = num(), c = num(), e = num(), f = num(), g = ox + num(), h = oy + num(); arc(a, b, c, e, f, g, h) }
    else { i++ }
    prev = C
  }
  for (const s of subs) {
    if (s.pts.length > 2 && V.dist(s.pts[0], s.pts.at(-1)) < 1e-3) { s.pts.pop(); s.closed = true }
  }
  return subs.filter(s => s.pts.length > 1 || s.closed)
}

// ---------------------------------------------------------------------------
export const arclen = (pts, closed = false) => {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += V.dist(pts[i], pts[i - 1])
  if (closed && pts.length > 1) L += V.dist(pts.at(-1), pts[0])
  return L
}
export const area = r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return a / 2 }
export const bbox = pts => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }
}
export const tangents = (pts, closed = false) => pts.map((p, i) => {
  const n = pts.length
  const a = closed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)]
  const b = closed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)]
  return V.norm(V.sub(b, a))
})

// Resample a polyline at a fixed arclength pitch; returns [{p, t, s, u}]
export function resample(pts, pitch, closed = false) {
  const P = closed ? [...pts, pts[0]] : pts
  const total = arclen(P); if (total < 1e-6) return []
  const out = []
  let seg = 0, segStart = 0
  for (let s = 0; s <= total + 1e-9; s += pitch) {
    while (seg < P.length - 2 && segStart + V.dist(P[seg + 1], P[seg]) < s) { segStart += V.dist(P[seg + 1], P[seg]); seg++ }
    const a = P[seg], b = P[seg + 1] || P[seg], L = V.dist(a, b) || 1e-9
    const f = Math.max(0, Math.min(1, (s - segStart) / L))
    out.push({ p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], t: [(b[0] - a[0]) / L, (b[1] - a[1]) / L], s, u: s / total })
  }
  return out
}

// Variable-width ribbon around a centreline.
// widthAt(tangent, index, u01, point) -> full width. capDir: unit vector for an
// angled flat terminal, else butt. Closed input returns an annulus.
export function ribbon(pts, widthAt, capDir = null, closed = false) {
  const P = pts
  const T = tangents(P, closed)
  const L = [], R = []
  for (let i = 0; i < P.length; i++) {
    const t = T[i], n = [-t[1], t[0]]
    const w = widthAt(t, i, i / Math.max(1, P.length - 1), P[i]) / 2
    L.push(V.add(P[i], V.mul(n, w))); R.push(V.sub(P[i], V.mul(n, w)))
  }
  if (closed) {
    const [big, small] = Math.abs(area(L)) >= Math.abs(area(R)) ? [L, R] : [R, L]
    return { outer: big, inner: small, annulus: true }
  }
  if (capDir) {
    const capAt = (idx, side) => {
      const t = T[idx], n = [-t[1], t[0]]
      const w = widthAt(t, idx, idx / Math.max(1, P.length - 1), P[idx]) / 2
      const k = w / (Math.abs(V.dot(capDir, n)) || 1)
      return [V.add(P[idx], V.mul(capDir, k * side)), V.sub(P[idx], V.mul(capDir, k * side))]
    }
    const s0 = V.dot(capDir, [-T[0][1], T[0][0]]) > 0 ? 1 : -1
    const e0 = V.dot(capDir, [-T.at(-1)[1], T.at(-1)[0]]) > 0 ? 1 : -1
    ;[L[0], R[0]] = capAt(0, s0)
    ;[L[L.length - 1], R[R.length - 1]] = capAt(P.length - 1, e0)
  }
  return { outer: [...L, ...R.reverse()], annulus: false }
}

export function circle(cx, cy, r, step = 0.2) {
  const n = Math.max(16, Math.ceil(2 * Math.PI * r / step)), out = []
  for (let i = 0; i < n; i++) { const t = i / n * 2 * Math.PI; out.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]) }
  return out
}
export function regularPolygon(cx, cy, r, n, rot = 0) {
  const out = []; for (let i = 0; i < n; i++) { const a = rot + i / n * 2 * Math.PI; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return out
}
export const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

export function transform(ring, { translate = [0, 0], scale = 1, rotate = 0, about = [12, 12] } = {}) {
  const [sx, sy] = Array.isArray(scale) ? scale : [scale, scale]
  const c = Math.cos(rotate), s = Math.sin(rotate)
  return ring.map(([x0, y0]) => {
    const x = (x0 - about[0]) * sx, y = (y0 - about[1]) * sy
    return [x * c - y * s + about[0] + translate[0], x * s + y * c + about[1] + translate[1]]
  })
}

export function distToPolyline(p, pts, closed = false) {
  let best = Infinity
  const n = closed ? pts.length : pts.length - 1
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const abx = b[0] - a[0], aby = b[1] - a[1], apx = p[0] - a[0], apy = p[1] - a[1]
    const L2 = abx * abx + aby * aby || 1e-9
    const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / L2))
    const d = Math.hypot(apx - abx * t, apy - aby * t)
    if (d < best) best = d
  }
  return best
}

export function pointInRing(p, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
// even-odd containment over a whole region set
export const pointInSet = (p, set) => set.reduce((acc, r) => pointInRing(p, r) ? !acc : acc, false)

// contiguous runs where keep(point, i) is true; drops runs shorter than minLen
export function splitRuns(pts, keep, minLen = 0.5, closed = false) {
  const seq = closed ? [...pts, pts[0]] : pts
  const runs = []; let cur = []
  for (let i = 0; i < seq.length; i++) {
    if (keep(seq[i], i)) cur.push(seq[i])
    else { if (cur.length > 1) runs.push(cur); cur = [] }
  }
  if (cur.length > 1) runs.push(cur)
  if (closed && runs.length > 1 && keep(seq[0], 0) && keep(seq.at(-1), seq.length - 1)) {
    const last = runs.pop(); runs[0] = [...last, ...runs[0]]
  }
  return runs.filter(r => arclen(r) >= minLen)
}

// Ramer–Douglas–Peucker
export function simplify(pts, tol = 0.04, closed = false) {
  if (pts.length < 4) return pts
  const P = closed ? [...pts, pts[0]] : pts
  const keep = new Uint8Array(P.length); keep[0] = keep[P.length - 1] = 1
  const stack = [[0, P.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop(); let idx = -1, dm = 0
    for (let i = a + 1; i < b; i++) { const d = distToPolyline(P[i], [P[a], P[b]]); if (d > dm) { dm = d; idx = i } }
    if (dm > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]) }
  }
  const out = P.filter((_, i) => keep[i])
  if (closed) out.pop()
  return out
}

// deterministic PRNG, seeded by a string — used by any style that needs "randomness"
export function rng(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) }
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 }
}

// ---------------------------------------------------------------------------
// output
export const fmt = n => { const r = Math.round(n * 100) / 100; return Object.is(r, -0) ? '0' : String(r) }
export const polyD = (pts, closed = false) =>
  pts.length ? 'M' + pts.map(p => `${fmt(p[0])} ${fmt(p[1])}`).join('L') + (closed ? 'Z' : '') : ''
export const setD = (set, tol = 0.03) =>
  set.filter(r => r.length > 2).map(r => polyD(simplify(r, tol, true), true)).join('')
