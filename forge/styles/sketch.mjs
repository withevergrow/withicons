// SKETCH — creative. Marker ink over pencil, from a designer's notebook.
//
// Every centreline is laid down the way a hand draws it:
//  - INK (pass 1, 1.3u, inherits the root stroke): long edges become separate
//    strokes that cross a little at sharp convex corners; free ends overshoot;
//    smooth loops start top-left and close with an overshooting tail that
//    drifts off the start. The wobble is a slow, smooth displacement FIELD
//    (random plane waves) shared by every stroke, so lines that meet keep
//    meeting, plus a faint per-pass tremor and a gentle per-stroke bow.
//  - PENCIL (pass 2, 0.5u at 50%): a construction line under each open stroke,
//    hidden along the ink, that runs out past corners and free ends.
//  - SHADE: hachure at -38deg / 2.2u pitch, clipped exactly (scanlines) inside
//    the fill mass minus cutouts, clear of the displaced ink, and only on the
//    side away from a top-left light, tapering at the terminator.
// Strokes are quadratic B-splines written as compact relative path data on a
// 0.1u grid. All randomness is rng(icon.name + ...): same input, same bytes.
import { V, rng, pointInRing, area } from '../kernel/geom.mjs'

const SW = 1.3
const D2R = Math.PI / 180
const TAU = Math.PI * 2
const K = {
  maxStep: 2.0,              // longest sample spacing on straight runs
  maxTurn: 0.5,              // radians of turning between two samples
  warp: [0.24, 13, 19],        // shared slow field: RMS amp, wavelength range
  jit: [0.045, 6, 9],     // per-pass tremor field
  bow: 0.025, bowMax: 0.35,  // straight strokes bow by up to 2.5% of their length
  endFree: [0.35, 0.7],      // overshoot at a free end
  endJoin: [0.15, 0.35],     // overshoot where an end touches other ink
  corner: [0.25, 0.5],       // overshoot at a lifted corner
  lift: 55 * D2R,            // the pen lifts at corners sharper than this...
  liftLen: 3,                // ...when both adjacent edges are at least this long
  sharp: 28 * D2R,           // vertices turning more than this stay sharp
  tail: [1.3, 2.0],          // how far a loop runs past its start
  drift: [0.75, 1.0],        // how far the closing tail wanders off the start
  lead: [0.15, 0.3],         // ...and the start sits this far to the other side
  a1: [0, 0.1],              // pass-1 end offsets
  // pass 2: a thin pencil construction line under the ink of every open stroke
  // (>= min2 long), invisible along the ink, crossing out past corners and ends
  a2: [0.1, 0.35],           // end offsets (the "peel")
  c2: [0.05, 0.2],           // extra bow
  w2: 0.5, op2: 0.5,         // width, opacity
  ext2: [1.1, 1.8],          // run past a corner (x0.7 past a free end)
  min2: 3.2,
  hatch: { cover: 0.58, ang: -38 * D2R, pitch: 2.2, w: 0.8, op: 0.5, clear: 1.45, edge: 1.1, min: 1.4 },
}

// ---------------------------------------------------------------------------
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const smooth = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t)
const plen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += V.dist(pts[i - 1], pts[i]); return L }
const between = (r, [a, b]) => a + (b - a) * r()
const sgn = r => r() < 0.5 ? -1 : 1

function clean(pts, closed) {
  const out = []
  for (const p of pts) if (!out.length || V.dist(out.at(-1), p) > 0.02) out.push(p)
  if (closed && out.length > 2 && V.dist(out[0], out.at(-1)) < 0.02) out.pop()
  return out
}

// sub-polyline between arclengths s0 < s1
function slice(pts, s0, s1) {
  const out = []; let s = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], l = V.dist(a, b), e = s + l
    if (l > 0 && e >= s0 && s <= s1) {
      if (!out.length) out.push(lerp(a, b, Math.max(0, (s0 - s) / l)))
      if (e <= s1) out.push(b)
      else { out.push(lerp(a, b, (s1 - s) / l)); break }
    }
    s = e
  }
  return out
}

// smooth displacement field: three random plane waves per axis
function field(seed, [amp, l0, l1]) {
  const r = rng(seed), waves = []
  for (let c = 0; c < 2; c++) for (let j = 0; j < 3; j++) {
    const a = r() * TAU, k = TAU / (l0 + (l1 - l0) * r())
    waves.push([c, Math.cos(a) * k, Math.sin(a) * k, r() * TAU])
  }
  const g = amp * Math.sqrt(2 / 3)
  return p => {
    const d = [0, 0]
    for (const [c, kx, ky, ph] of waves) d[c] += g * Math.sin(kx * p[0] + ky * p[1] + ph)
    return d
  }
}

const turn = (a, p, b) => {
  const u = V.norm(V.sub(p, a)), v = V.norm(V.sub(b, p))
  return Math.acos(Math.max(-1, Math.min(1, V.dot(u, v))))
}

// ---------------------------------------------------------------------------
// Break one centreline into hand strokes.
// stroke: { pts, corners:[vertex idx that stay sharp], loop, e0, e1 }
function planStrokes(line) {
  const closed = line.closed && line.pts.length > 2
  const pts = clean(line.pts, closed)
  if (pts.length < 2) return []
  const n = pts.length
  const tv = pts.map((p, i) => (!closed && (i === 0 || i === n - 1)) ? 0 : turn(pts[(i - 1 + n) % n], p, pts[(i + 1) % n]))
  const sharpIdx = []
  for (let i = 0; i < n; i++) if (tv[i] > K.sharp) sharpIdx.push(i)
  const S = [0]
  for (let i = 1; i < n; i++) S.push(S[i - 1] + V.dist(pts[i - 1], pts[i]))
  const total = S[n - 1] + (closed ? V.dist(pts[n - 1], pts[0]) : 0)
  const lifts = []
  const ar = closed ? area(pts) : 0
  sharpIdx.forEach((i, k) => {
    if (tv[i] < K.lift) return
    // on a closed shape only convex corners lift (a star crosses at its points, not its armpits)
    if (closed && V.cross(V.sub(pts[i], pts[(i - 1 + n) % n]), V.sub(pts[(i + 1) % n], pts[i])) * ar < 0) return
    let before, after
    if (closed) {
      const m = sharpIdx.length
      const prev = sharpIdx[(k - 1 + m) % m], next = sharpIdx[(k + 1) % m]
      before = m === 1 ? total : ((S[i] - S[prev] + total) % total || total)
      after = m === 1 ? total : ((S[next] - S[i] + total) % total || total)
    } else {
      before = S[i] - (k > 0 ? S[sharpIdx[k - 1]] : 0)
      after = (k < sharpIdx.length - 1 ? S[sharpIdx[k + 1]] : S[n - 1]) - S[i]
    }
    if (before >= K.liftLen && after >= K.liftLen) lifts.push(i)
  })
  const sharpSet = new Set(sharpIdx)
  const mk = (idxs, loop, e0, e1) => ({
    pts: idxs.map(i => pts[i]),
    corners: idxs.map((i, k) => (k > 0 && k < idxs.length - 1 && sharpSet.has(i)) ? k : -1).filter(k => k > 0),
    loop, e0, e1, len: 0,
  })
  const out = []
  if (!closed) {
    const cuts = [0, ...lifts, n - 1]
    for (let k = 0; k < cuts.length - 1; k++) {
      const idxs = []; for (let i = cuts[k]; i <= cuts[k + 1]; i++) idxs.push(i)
      out.push(mk(idxs, false, k === 0 ? 'end' : 'corner', k === cuts.length - 2 ? 'end' : 'corner'))
    }
  } else if (lifts.length) {
    for (let k = 0; k < lifts.length; k++) {
      const a = lifts[k], b = lifts[(k + 1) % lifts.length]
      const idxs = [a]; let i = a
      do { i = (i + 1) % n; idxs.push(i) } while (i !== b)
      out.push(mk(idxs, false, 'corner', 'corner'))
    }
  } else {
    // a smooth loop: start near the top-left, as a hand habitually does
    let best = 0, bv = Infinity
    for (let i = 0; i < n; i++) { const v = pts[i][0] * 0.55 + pts[i][1]; if (v < bv - 1e-6) { bv = v; best = i } }
    const idxs = []; for (let k = 0; k <= n; k++) idxs.push((best + k) % n)
    out.push(mk(idxs, true, 'loop', 'loop'))
  }
  for (const s of out) s.len = plen(s.pts)
  return out
}

// ---------------------------------------------------------------------------
// Compact path writer: integer tenths, relative commands, implicit repeats.
const DEC = 10
const Rn = v => Math.round(v * DEC)
function num(v) {
  if (v === 0) return '0'
  const neg = v < 0, a = Math.abs(v), ip = Math.floor(a / DEC), fp = a % DEC
  return (neg ? '-' : '') + (ip ? String(ip) : '') + (fp ? '.' + fp : '')
}
class Pen {
  constructor() { this.d = ''; this.x = 0; this.y = 0; this.cmd = ''; this.tok = '' }
  put(t) {
    const glue = !this.tok || /[a-zA-Z]$/.test(this.tok) || t[0] === '-' || (t[0] === '.' && this.tok.includes('.'))
    this.d += (glue ? '' : ' ') + t; this.tok = t
  }
  letter(c) { if (this.cmd !== c) { this.d += c; this.tok = c; this.cmd = c } }
  move(p) {
    const X = Rn(p[0]), Y = Rn(p[1])
    const rel = num(X - this.x) + num(Y - this.y), abs = num(X) + num(Y)
    this.cmd = ''
    if (this.d && rel.length < abs.length) { this.letter('m'); this.put(num(X - this.x)); this.put(num(Y - this.y)) }
    else { this.letter('M'); this.put(num(X)); this.put(num(Y)) }
    this.x = X; this.y = Y; this.cmd = 'M'
  }
  line(p) {
    const X = Rn(p[0]), Y = Rn(p[1])
    this.letter('l'); this.put(num(X - this.x)); this.put(num(Y - this.y)); this.x = X; this.y = Y
  }
  quad(c, p) {
    const CX = Rn(c[0]), CY = Rn(c[1]), X = Rn(p[0]), Y = Rn(p[1])
    this.letter('q')
    this.put(num(CX - this.x)); this.put(num(CY - this.y)); this.put(num(X - this.x)); this.put(num(Y - this.y))
    this.x = X; this.y = Y
  }
  // quadratic B-spline on the control polygon q (endpoints interpolated)
  spline(q) {
    if (q.length < 2) return
    if (q.length === 2) return this.line(q[1])
    for (let i = 1; i < q.length - 1; i++) this.quad(q[i], i === q.length - 2 ? q[i + 1] : lerp(q[i], q[i + 1], 0.5))
  }
}

// Adaptive resampling of one piece: dense on bends, sparse on straights.
// Returns [{p, t, s}] including both ends.
function samplePiece(pts) {
  const n = pts.length
  if (n < 2) return []
  const tv = pts.map((p, i) => (i === 0 || i === n - 1) ? 0 : turn(pts[i - 1], p, pts[i + 1]))
  const C = [0], S = [0]
  for (let i = 1; i < n; i++) {
    const ds = V.dist(pts[i - 1], pts[i])
    S.push(S[i - 1] + ds)
    C.push(C[i - 1] + ds / K.maxStep + (tv[i - 1] + tv[i]) / 2 / K.maxTurn)
  }
  if (S[n - 1] < 1e-6) return []
  const m = Math.max(1, Math.round(C[n - 1])), out = []
  let seg = 1
  for (let k = 0; k <= m; k++) {
    const c = C[n - 1] * k / m
    while (seg < n - 1 && C[seg] < c) seg++
    const a = pts[seg - 1], b = pts[seg], f = C[seg] > C[seg - 1] ? Math.max(0, Math.min(1, (c - C[seg - 1]) / (C[seg] - C[seg - 1]))) : 0
    out.push({ p: lerp(a, b, f), t: V.norm(V.sub(b, a)), s: S[seg - 1] + (S[seg] - S[seg - 1]) * f })
  }
  return out
}

// extend p along t by e, but never past the canvas margin
function reach(p, t, e) {
  let k = e
  for (let c = 0; c < 2; c++) {
    if (t[c] > 1e-6) k = Math.min(k, Math.max(0, (23.2 - p[c]) / t[c]))
    if (t[c] < -1e-6) k = Math.min(k, Math.max(0, (0.8 - p[c]) / t[c]))
  }
  return V.add(p, V.mul(t, k))
}

// Zero-length subpaths ("M12 17 h0") are dots in SVG, but the loader drops
// them. Recover their positions from the raw path data.
const ARGC = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 }
function zeroDots(d) {
  const toks = String(d || '').match(/[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || []
  const out = []
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, open = false, drew = false, ext = 0
  const isNum = () => i < toks.length && !/^[A-Za-z]$/.test(toks[i])
  const flush = () => { if (open && drew && ext < 1e-4) out.push([sx, sy]); open = drew = false; ext = 0 }
  const see = (px, py) => { ext = Math.max(ext, Math.abs(px - sx), Math.abs(py - sy)) }
  while (i < toks.length) {
    if (!isNum()) cmd = toks[i++]
    const C = cmd.toUpperCase(), rel = cmd !== C
    if (C === 'Z') { open = false; drew = false; x = sx; y = sy; continue }
    const n = ARGC[C]
    if (!n) { i++; continue }
    const a = []
    while (a.length < n && isNum()) a.push(parseFloat(toks[i++]))
    if (a.length < n) break
    const bx = rel ? x : 0, by = rel ? y : 0
    if (C === 'M') { flush(); x = bx + a[0]; y = by + a[1]; sx = x; sy = y; open = true; cmd = rel ? 'l' : 'L'; continue }
    if (!open) { sx = x; sy = y; open = true }
    drew = true
    if (C === 'H') x = bx + a[0]
    else if (C === 'V') y = by + a[0]
    else if (C === 'A') { x = bx + a[5]; y = by + a[6] }
    else { for (let k = 0; k < n - 2; k += 2) see(bx + a[k], by + a[k + 1]); x = bx + a[n - 2]; y = by + a[n - 1] }
    see(x, y)
  }
  flush()
  return out
}

const reindex = (oldPts, corners, newPts) => {
  const want = corners.map(i => oldPts[i])
  return want.map(cp => newPts.indexOf(cp)).filter(i => i > 0 && i < newPts.length - 1)
}

// ---------------------------------------------------------------------------
// Draw one stroke for one pass; returns the displaced samples (for hachure).
function drawStroke(pen, st, W, J, r, pass, touches) {
  let pts = st.pts.slice(), corners = st.corners.slice()
  const L0 = st.len
  let loop = null, a0, a1, bow = 0
  const small = L0 < 8
  if (st.loop) {
    // run past the start, drifting off it, and begin slightly on the other side
    const sc = Math.min(1, Math.max(0.45, (L0 - 6) / 24))   // small loops close more quietly
    const tail = small ? 0 : Math.min(between(r, K.tail) * sc, L0 * 0.2)
    const ring = pts
    if (tail > 0) { pts = [...ring, ...slice(ring, 0, tail).slice(1)]; corners = reindex(ring, corners, pts) }
    loop = { L: L0, tail, drift: small ? 0 : between(r, K.drift) * sc * sgn(r) }
    a0 = small ? 0 : between(r, K.lead) * sc * -Math.sign(loop.drift || 1); a1 = 0
  } else {
    const ext = (kind, P) => {
      if (pass === 2) return kind === 'corner' ? between(r, K.ext2) : touches(P) ? 0.2 : between(r, K.ext2) * 0.7
      if (kind === 'corner') return between(r, K.corner)
      return touches(P) ? between(r, K.endJoin) : between(r, K.endFree)
    }
    const e0 = ext(st.e0, pts[0]), e1 = ext(st.e1, pts.at(-1))
    if (pass === 2 && e0 <= 0.2 && e1 <= 0.2) return []   // would hide under the ink
    const L = plen(pts)
    const h0 = slice(pts, 0, Math.min(0.6, L))
    const h1 = slice(pts, Math.max(0, L - 0.6), L)
    const t0 = V.norm(V.sub(h0[0], h0.at(-1))), t1 = V.norm(V.sub(h1.at(-1), h1[0]))
    if (e0 > 0.01) { pts.unshift(reach(pts[0], t0, e0)); corners = corners.map(i => i + 1) }
    if (e1 > 0.01) pts.push(reach(pts.at(-1), t1, e1))
    const A = pass === 2 ? K.a2 : K.a1
    a0 = between(r, A) * sgn(r); a1 = between(r, A) * sgn(r)
    const straight = V.dist(pts[0], pts.at(-1)) > plen(pts) * 0.9
    bow = Math.min(K.bowMax, K.bow * L) * (r() * 2 - 1) * (straight ? 1 : 0.35)
    if (pass === 2) bow += between(r, K.c2) * sgn(r)
  }
  const Lt = plen(pts)
  if (Lt < 0.05) return []
  const Lf = Math.min(2.5, Lt / 2)
  const cuts = [0, ...corners.filter(i => i > 0 && i < pts.length - 1).sort((x, y) => x - y), pts.length - 1]
  const out = []
  let s0 = 0, first = true
  for (let k = 0; k < cuts.length - 1; k++) {
    const piece = pts.slice(cuts[k], cuts[k + 1] + 1)
    const smp = samplePiece(piece)
    if (!smp.length) continue
    const q = smp.map(({ p, t, s: sl }) => {
      const s = s0 + sl
      let off = bow * Math.sin(Math.PI * Math.max(0, Math.min(1, s / Lt)))
        + a0 * (1 - smooth(s / Lf)) + a1 * (1 - smooth((Lt - s) / Lf))
      if (loop && loop.drift) off += loop.drift * smooth((s - (loop.L - 2)) / (2 + loop.tail))
      const w = W(p), j = J(p)
      return [p[0] + w[0] + j[0] - t[1] * off, p[1] + w[1] + j[1] + t[0] * off]
    })
    if (first) { pen.move(q[0]); first = false }
    pen.spline(q)
    out.push(...q)
    s0 += plen(piece)
  }
  return out
}

// a dot (degenerate subpath or tiny loop) becomes a small solid scribble:
// an outward spiral, solid from the middle, ending on the dot's rim
function drawDot(pen, c, R, r) {
  const rr = Math.max(0.3, R - 0.1), a0 = r() * TAU, q = [], n = 11
  for (let k = 0; k <= n; k++) {
    const a = a0 + k / n * TAU * 1.5, g = 0.1 + (rr - 0.1) * Math.min(1, k / (n - 3))
    q.push([c[0] + g * Math.cos(a), c[1] + g * Math.sin(a)])
  }
  pen.move(q[0]); pen.spline(q)
  return q
}

// ---------------------------------------------------------------------------
// Hachure: parallel strokes inside fillSet, minus closed cutouts, kept clear of
// the displaced ink and of the fill's own edge. Exact scanline clipping.
function hatch(icon, inkPts, r) {
  const H = K.hatch
  const rings = (icon.fillSet || []).filter(g => g.length > 2)
  if (!rings.length) return ''
  const D = [Math.cos(H.ang), Math.sin(H.ang)], N = [-D[1], D[0]]
  const cutRings = [], cutLines = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (s.closed && s.pts.length > 2) cutRings.push(s.pts)
    else cutLines.push(s.pts)
  }
  const discs = []  // [t, h, radius] clearance discs in hatch coordinates
  const addLine = (pts, rad, closed) => {
    const P = closed ? [...pts, pts[0]] : pts
    for (let i = 0; i < P.length; i++) {
      const a = P[i]
      discs.push([V.dot(D, a), V.dot(N, a), rad])
      if (i < P.length - 1) {
        const b = P[i + 1], m = Math.floor(V.dist(a, b) / 0.25)
        for (let k = 1; k <= m; k++) { const p = lerp(a, b, k / (m + 1)); discs.push([V.dot(D, p), V.dot(N, p), rad]) }
      }
    }
  }
  for (const pts of inkPts) addLine(pts, H.clear, false)
  for (const g of rings) addLine(g, H.edge, true)
  for (const g of cutRings) addLine(g, H.clear - 0.3, true)
  for (const g of cutLines) addLine(g, H.clear, false)
  let hmin = Infinity, hmax = -Infinity
  for (const g of rings) for (const p of g) { const h = V.dot(N, p); if (h < hmin) hmin = h; if (h > hmax) hmax = h }
  const span = hmax - hmin
  if (!(span > 0.5)) return ''
  const cross = (list, h) => {
    const ts = []
    for (const g of list) for (let i = 0; i < g.length; i++) {
      const a = g[i], b = g[(i + 1) % g.length]
      const ha = V.dot(N, a) - h, hb = V.dot(N, b) - h
      if ((ha > 0) !== (hb > 0)) { const ta = V.dot(D, a), tb = V.dot(D, b); ts.push(ta + (tb - ta) * ha / (ha - hb)) }
    }
    ts.sort((x, y) => x - y)
    const iv = []; for (let i = 0; i + 1 < ts.length; i += 2) iv.push([ts[i], ts[i + 1]])
    return iv
  }
  const subtract = (iv, cut) => {
    let cur = iv
    for (const [c0, c1] of cut) {
      if (!cur.length) break
      const nx = []
      for (const [a, b] of cur) {
        if (c1 <= a || c0 >= b) { nx.push([a, b]); continue }
        if (c0 > a) nx.push([a, c0])
        if (c1 < b) nx.push([c1, b])
      }
      cur = nx
    }
    return cur
  }
  // shade only the side away from the light (top-left): per outer ring, keep
  // the scanlines in the last `cover` fraction of its extent
  const cover = H.cover
  const outers = rings.filter(g => rings.filter(o => o !== g && pointInRing(g[0], o)).length % 2 === 0).map(g => {
    let a = Infinity, b = -Infinity
    for (const p of g) { const h = V.dot(N, p); if (h < a) a = h; if (h > b) b = h }
    return { g, a, b, ar: Math.abs(area(g)) }
  }).sort((x, y) => x.ar - y.ar)
  // 0 = in the light (skip), 1 = full shade; lines near the terminator are shorter
  const shade = (t, h) => {
    if (cover >= 1) return 1
    const P = V.add(V.mul(D, t), V.mul(N, h))
    const o = outers.find(o => pointInRing(P, o.g))
    if (!o) return 1
    const u = (h - o.a) / Math.max(1e-6, o.b - o.a), u0 = 1 - cover
    return u < u0 ? 0 : 0.5 + 0.5 * smooth((u - u0) / 0.25)
  }
  const pen = new Pen()
  const count = Math.floor(span / H.pitch)
  const start = hmin + (span - count * H.pitch) / 2
  for (let k = 0; k <= count; k++) {
    const h = start + k * H.pitch
    let iv = cross(rings, h)
    if (!iv.length) continue
    if (cutRings.length) iv = subtract(iv, cross(cutRings, h))
    const fb = []
    for (const [t, hh, rad] of discs) {
      const dh = hh - h
      if (dh > -rad && dh < rad) { const w = Math.sqrt(rad * rad - dh * dh); fb.push([t - w, t + w]) }
    }
    iv = subtract(iv, fb)
    for (const [a0, b0] of iv) {
      let a = a0 + r() * 0.35, b = b0 - r() * 0.35
      const f = shade((a + b) / 2, h)
      if (f <= 0) continue
      if (f < 1) { const m = (a + b) / 2 + (b - a) * (r() - 0.5) * 0.2, w = (b - a) * f / 2; a = Math.max(a, m - w); b = Math.min(b, m + w) }
      if (b - a < H.min) continue
      const wob = (r() - 0.5) * 0.3
      pen.move(V.add(V.mul(D, a), V.mul(N, h - wob / 2)))
      pen.line(V.add(V.mul(D, b), V.mul(N, h + wob / 2)))
    }
  }
  return pen.d
}

// ---------------------------------------------------------------------------
function renderSketch(icon) {
  const lines = (icon.lines || []).filter(l => l && l.pts && l.pts.length)
  for (const p of icon.paths || []) for (const q of zeroDots(p.d)) lines.push({ pts: [q], closed: false, plate: p.plate, pathId: p.id })
  const W = field(icon.name + '|warp', K.warp)
  const J = [null, field(icon.name + '|j1', K.jit), field(icon.name + '|j2', K.jit)]
  // does a point touch other ink? (T-junctions, arrow tips...)
  const touches = li => p => lines.some((l, j) => j !== li && l.pts.some(q => Math.abs(q[0] - p[0]) < 0.9 && Math.abs(q[1] - p[1]) < 0.9 && V.dist(q, p) < 0.9))
  // dots: degenerate subpaths and loops smaller than ~2.6u across
  const dots = lines.map(l => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of l.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    const R = Math.max(x1 - x0, y1 - y0) / 2
    return (plen(l.pts) < 0.5 || (l.closed && R < 1.3)) ? { c: [(x0 + x1) / 2, (y0 + y1) / 2], R: Math.max(R, 0.7) } : null
  })
  const plans = lines.map((l, i) => dots[i] ? null : planStrokes(l))
  const pens = [null, new Pen(), new Pen()], ink = []
  for (let pass = 1; pass <= 2; pass++) {
    const pen = pens[pass]
    lines.forEach((line, li) => {
      const r = rng(`${icon.name}|${line.pathId || 'p'}|${li}|${pass}`)
      if (!plans[li]) {
        if (pass === 1) ink.push(drawDot(pen, dots[li].c, dots[li].R, r))
        return
      }
      for (const st of plans[li]) {
        if (pass === 2 && (st.len < K.min2 || st.loop)) continue
        const q = drawStroke(pen, st, W, J[pass], r, pass, touches(li))
        if (q.length) ink.push(q)
      }
    })
  }
  const nodes = []
  const hd = hatch(icon, ink, rng(icon.name + '|hatch'))
  if (hd) nodes.push(['path', { d: hd, 'stroke-width': K.hatch.w, 'stroke-opacity': K.hatch.op }])
  if (pens[2].d) nodes.push(['path', { d: pens[2].d, 'stroke-width': K.w2, 'stroke-opacity': K.op2 }])
  nodes.push(['path', { d: pens[1].d }])
  return nodes
}

export default {
  name: 'sketch',
  title: 'Sketch',
  kind: 'creative',
  description: 'Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching.',
  strokeWidth: SW,
  root: { fill: 'none', stroke: 'currentColor', 'stroke-width': SW, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render(icon) {
    try { return renderSketch(icon) }
    catch (e) {
      if (globalThis.process?.env?.SKETCH_DEBUG) throw e
      return (icon.paths || []).map(p => ['path', { d: p.d }])
    }
  },
}
