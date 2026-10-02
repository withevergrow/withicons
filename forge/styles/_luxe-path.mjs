// LUXE helper: closed polylines -> compact, smooth SVG path data.
// Traced contours are split at corners, straight runs become lines, curved runs
// are fitted with cubic Beziers (Schneider's least-squares fit, split at the
// worst point until within tolerance). Output is relative, minimal-number syntax.
// Smooth curves keep big renders (128-512px) silky and cut the bytes roughly in half.

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, k) => [a[0] * k, a[1] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const len = a => Math.hypot(a[0], a[1])
const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l] }

function bez(c, t) {
  const m = 1 - t
  return [
    m * m * m * c[0][0] + 3 * m * m * t * c[1][0] + 3 * m * t * t * c[2][0] + t * t * t * c[3][0],
    m * m * m * c[0][1] + 3 * m * m * t * c[1][1] + 3 * m * t * t * c[2][1] + t * t * t * c[3][1],
  ]
}
function bezD1(c, t) {
  const m = 1 - t
  return [
    3 * m * m * (c[1][0] - c[0][0]) + 6 * m * t * (c[2][0] - c[1][0]) + 3 * t * t * (c[3][0] - c[2][0]),
    3 * m * m * (c[1][1] - c[0][1]) + 6 * m * t * (c[2][1] - c[1][1]) + 3 * t * t * (c[3][1] - c[2][1]),
  ]
}
function bezD2(c, t) {
  const m = 1 - t
  return [
    6 * m * (c[2][0] - 2 * c[1][0] + c[0][0]) + 6 * t * (c[3][0] - 2 * c[2][0] + c[1][0]),
    6 * m * (c[2][1] - 2 * c[1][1] + c[0][1]) + 6 * t * (c[3][1] - 2 * c[2][1] + c[1][1]),
  ]
}

function chordParams(P) {
  const u = [0]
  for (let i = 1; i < P.length; i++) u.push(u[i - 1] + len(sub(P[i], P[i - 1])))
  const L = u.at(-1) || 1
  return u.map(v => v / L)
}

function generate(P, u, t1, t2) {
  const p0 = P[0], p3 = P.at(-1)
  let c00 = 0, c01 = 0, c11 = 0, x0 = 0, x1 = 0
  for (let i = 0; i < P.length; i++) {
    const t = u[i], m = 1 - t
    const a1 = mul(t1, 3 * m * m * t), a2 = mul(t2, 3 * m * t * t)
    c00 += dot(a1, a1); c01 += dot(a1, a2); c11 += dot(a2, a2)
    const b = m * m * m + 3 * m * m * t, e = 3 * m * t * t + t * t * t
    const tmp = sub(P[i], add(mul(p0, b), mul(p3, e)))
    x0 += dot(a1, tmp); x1 += dot(a2, tmp)
  }
  const det = c00 * c11 - c01 * c01
  let al = 0, ar = 0
  if (Math.abs(det) > 1e-12) { al = (x0 * c11 - c01 * x1) / det; ar = (c00 * x1 - c01 * x0) / det }
  const seg = len(sub(p3, p0)), eps = 1e-6 * seg
  if (al < eps || ar < eps || al > seg * 2 || ar > seg * 2) { al = ar = seg / 3 }
  return [p0, add(p0, mul(t1, al)), add(p3, mul(t2, ar)), p3]
}

function maxErr(P, c, u) {
  let m = 0, at = Math.floor(P.length / 2)
  for (let i = 1; i < P.length - 1; i++) {
    const d = len(sub(bez(c, u[i]), P[i]))
    if (d > m) { m = d; at = i }
  }
  return [m, at]
}
function reparam(P, c, u) {
  return u.map((t, i) => {
    const d = sub(bez(c, t), P[i]), d1 = bezD1(c, t), d2 = bezD2(c, t)
    const den = dot(d1, d1) + dot(d, d2)
    if (Math.abs(den) < 1e-12) return t
    return Math.max(0, Math.min(1, t - dot(d, d1) / den))
  })
}

// fit one smooth run P (>= 2 points) with end tangents t1 (out of P[0]) and t2 (into P[end], pointing back)
function fitRun(P, t1, t2, tol, out, depth = 0) {
  if (P.length === 2) { out.push(['L', P[1]]); return }
  // straight?
  const a = P[0], b = P.at(-1), ab = sub(b, a), L = len(ab) || 1e-9
  // a loop (start and end close together): split at its far point first
  if (P.length >= 4) {
    let fd = -1, fi = 1
    for (let i = 1; i < P.length - 1; i++) { const d = len(sub(P[i], a)); if (d > fd) { fd = d; fi = i } }
    if (L < 0.5 * fd) {
      const tc = norm(sub(P[fi - 1], P[fi + 1]))
      fitRun(P.slice(0, fi + 1), t1, tc, tol, out, depth + 1)
      fitRun(P.slice(fi), mul(tc, -1), t2, tol, out, depth + 1)
      return
    }
  }
  let straight = true
  for (let i = 1; i < P.length - 1; i++) {
    const ap = sub(P[i], a)
    if (Math.abs(ap[0] * ab[1] - ap[1] * ab[0]) / L > tol * 0.6) { straight = false; break }
  }
  if (straight) { out.push(['L', b]); return }
  let u = chordParams(P)
  let c = generate(P, u, t1, t2)
  let [e, split] = maxErr(P, c, u)
  if (e < tol) { out.push(['C', c[1], c[2], c[3]]); return }
  if (e < tol * 5) {
    for (let k = 0; k < 6; k++) {
      u = reparam(P, c, u); c = generate(P, u, t1, t2)
      ;[e, split] = maxErr(P, c, u)
      if (e < tol) { out.push(['C', c[1], c[2], c[3]]); return }
    }
  }
  if (depth > 12 || P.length < 4) { for (let i = 1; i < P.length; i++) out.push(['L', P[i]]); return }
  split = Math.max(1, Math.min(P.length - 2, split))
  const tc = norm(sub(P[split - 1], P[split + 1]))
  fitRun(P.slice(0, split + 1), t1, tc, tol, out, depth + 1)
  fitRun(P.slice(split), mul(tc, -1), t2, tol, out, depth + 1)
}

// tangent leaving P[i] forward, from points within ~r along the run
function tanFwd(P, i, r) {
  let j = i + 1, best = P[Math.min(P.length - 1, j)]
  while (j < P.length && len(sub(P[j], P[i])) < r) { best = P[j]; j++ }
  if (j < P.length) best = P[j]
  return norm(sub(best, P[i]))
}
function tanBack(P, i, r) {
  let j = i - 1, best = P[Math.max(0, j)]
  while (j >= 0 && len(sub(P[j], P[i])) < r) { best = P[j]; j-- }
  if (j >= 0) best = P[j]
  return norm(sub(best, P[i]))
}

// smooth tangent through ring point i (direction of travel)
function smoothTan(P, i, n) {
  const R = k => P[((k % n) + n) % n]
  let a = i - 1, b = i + 1, c = 0
  while (c++ < n && len(sub(R(a), R(i))) < 0.35) a--
  c = 0
  while (c++ < n && len(sub(R(b), R(i))) < 0.35) b++
  return norm(sub(R(b), R(a)))
}

// RDP over a closed ring; returns the kept indices (sorted)
function rdpIdx(r, tol) {
  const n = r.length
  // anchor: vertex 0 and the vertex farthest from it
  let far = 0, fd = -1
  for (let i = 1; i < n; i++) { const d = len(sub(r[i], r[0])); if (d > fd) { fd = d; far = i } }
  const keep = new Uint8Array(n); keep[0] = keep[far] = 1
  const segD = (p, a, b) => {
    const ab = sub(b, a), L2 = dot(ab, ab) || 1e-12
    const t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / L2))
    return len(sub(p, add(a, mul(ab, t))))
  }
  const stack = [[0, far], [far, n]]
  while (stack.length) {
    const [i0, i1] = stack.pop()
    const A = r[i0], B = r[i1 % n]
    let best = -1, bd = tol
    for (let i = i0 + 1; i < i1; i++) { const d = segD(r[i], A, B); if (d > bd) { bd = d; best = i } }
    if (best >= 0) { keep[best] = 1; stack.push([i0, best], [best, i1]) }
  }
  const out = []
  for (let i = 0; i < n; i++) if (keep[i]) out.push(i)
  return out
}

// closed ring -> segments. Long straight runs become lines (their ends are breakpoints,
// curves meet them tangentially), sharp turns are corners, everything between is fitted.
const STRAIGHT = 0.35 // a "line" may stray at most this fraction of the fit tolerance from its chord
export function fitRing(ring, tol = 0.05, cornerDeg = 40) {
  const n = ring.length
  if (n < 3) return null
  const R = i => ring[((i % n) + n) % n]
  const idx = rdpIdx(ring, tol * 0.8)
  const m = idx.length
  if (m < 3) return null
  const LONG = 0.85
  // straight[k]: segment idx[k] -> idx[k+1] is a line
  // a long chord is a line only when the trace really runs straight along it: on a gentle
  // curve RDP keeps vertices further apart than LONG, and calling those chords lines turned
  // every large arc into a faceted polyline (more bytes, visible facets at 256 px)
  const flat = tol * STRAIGHT
  const straight = idx.map((i, k) => {
    const j = idx[(k + 1) % m] + (k + 1 === m ? n : 0)
    const A = R(i), ab = sub(R(j), A), L = len(ab)
    if (L < LONG) return false
    for (let t = i + 1; t < j; t++) { const ap = sub(R(t), A); if (Math.abs(ap[0] * ab[1] - ap[1] * ab[0]) / L > flat) return false }
    return true
  })
  // corners: sharp turn at a kept vertex
  const cosLim = Math.cos(cornerDeg * Math.PI / 180)
  const corner = idx.map((i, k) => {
    const p = R(i), pa = R(idx[(k - 1 + m) % m]), pb = R(idx[(k + 1) % m])
    return dot(norm(sub(p, pa)), norm(sub(pb, p))) < cosLim
  })
  const brk = idx.map((_, k) => straight[k] || straight[(k - 1 + m) % m] || corner[k])
  if (!brk.some(Boolean)) {
    // smooth ring: break at vertex 0 and the far vertex, smooth tangents
    const far = idx[Math.floor(m / 2)]
    const segs = []
    const tA = smoothTan(ring, 0, n), tB = smoothTan(ring, far, n)
    fitRun(ring.slice(0, far + 1), tA, mul(tB, -1), tol, segs)
    fitRun([...ring.slice(far), ring[0]], tB, mul(tA, -1), tol, segs)
    return { start: ring[0], segs }
  }
  const k0 = brk.indexOf(true)
  const segs = []
  // tangent leaving a breakpoint into a curve: along the adjoining straight line if there is one
  const dirOf = k => norm(sub(R(idx[(k + 1) % m] + (k + 1 === m ? n : 0)), R(idx[k])))
  for (let c = 0; c < m;) {
    const k = (k0 + c) % m
    if (straight[k]) { segs.push(['L', R(idx[(k + 1) % m])]); c++; continue }
    // a curved stretch from breakpoint k to the next breakpoint
    let e = c + 1
    while (!brk[(k0 + e) % m] && e < m) e++
    const ke = (k0 + e) % m
    const i0 = idx[k]
    let i1 = idx[ke]; if (i1 <= i0) i1 += n
    const run = []
    for (let i = i0; i <= i1; i++) run.push(R(i))
    const kp = (k - 1 + m) % m
    const t1 = straight[kp] && !corner[k] ? dirOf(kp) : tanFwd(run, 0, 0.3)
    const t2 = straight[ke] && !corner[ke] ? mul(dirOf(ke), -1) : tanBack(run, run.length - 1, 0.3)
    fitRun(run, t1, t2, tol, segs)
    c = e
  }
  return { start: R(idx[k0]), segs }
}

// ---------------------------------------------------------------------------
const num = (v, dp) => {
  let s = (v / 10 ** dp).toFixed(dp)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
// join numbers with the fewest separators (a '-' or a leading '.' after a decimal separates by itself)
function join(arr) {
  let s = ''
  for (const t of arr) {
    if (!s) { s = t; continue }
    const last = s.slice(-1)
    if (t.startsWith('-') || /[a-zA-Z]$/.test(s)) s += t
    else if (t.startsWith('.') && /\.\d*$/.test(s.split(/[\s,a-zA-Z-]/).pop())) s += t
    else s += ' ' + t
    void last
  }
  return s
}

export function ringsD(rings, tol = 0.05, dp = 2) {
  const k = 10 ** dp
  const q = v => Math.round(v * k)
  let d = ''
  for (const ring of rings) {
    const f = fitRing(ring, tol)
    if (!f || !f.segs.length) continue
    let cx = q(f.start[0]), cy = q(f.start[1])
    const sx = cx, sy = cy
    let s = 'M' + join([num(cx, dp), num(cy, dp)])
    let last = 'M', nseg = 0, pend = null
    for (const sg of f.segs) {
      if (sg[0] === 'L') {
        const x = q(sg[1][0]), y = q(sg[1][1])
        const dx = x - cx, dy = y - cy
        if (!dx && !dy) continue
        if (dy === 0 && last === 'h' && pend && Math.sign(dx) === Math.sign(pend.v)) { pend.v += dx; s = s.slice(0, pend.at) + 'h' + num(pend.v, dp); cx = x; continue }
        if (dx === 0 && last === 'v' && pend && Math.sign(dy) === Math.sign(pend.v)) { pend.v += dy; s = s.slice(0, pend.at) + 'v' + num(pend.v, dp); cy = y; continue }
        let cmd, nums
        if (dy === 0) { cmd = 'h'; nums = [num(dx, dp)] }
        else if (dx === 0) { cmd = 'v'; nums = [num(dy, dp)] }
        else { cmd = 'l'; nums = [num(dx, dp), num(dy, dp)] }
        pend = cmd === 'l' ? null : { at: s.length, v: cmd === 'h' ? dx : dy }
        s += (cmd === last && cmd === 'l' ? (nums[0].startsWith('-') ? '' : ' ') : cmd) + join(nums)
        last = cmd; cx = x; cy = y; nseg++
      } else {
        const p = sg.slice(1).map(v => [q(v[0]), q(v[1])])
        const nums = [p[0][0] - cx, p[0][1] - cy, p[1][0] - cx, p[1][1] - cy, p[2][0] - cx, p[2][1] - cy].map(v => num(v, dp))
        s += (last === 'c' ? (nums[0].startsWith('-') ? '' : ' ') : 'c') + join(nums)
        pend = null; last = 'c'; cx = p[2][0]; cy = p[2][1]; nseg++
      }
    }
    if (nseg < 2) continue
    void sx; void sy
    d += s + 'z'
  }
  return d
}
