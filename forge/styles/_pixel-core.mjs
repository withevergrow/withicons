// PIXEL core — the 16x16 grid, a pixel-perfect line rasteriser, area coverage
// and a path writer that traces merged cell regions into compact h/v outlines.
//
// Grid: 16 cells of 1.5u (cell i spans x in [1.5i, 1.5i + 1.5]), so the pixels land
// on whole device pixels whenever the icon is a multiple of 16 device px (16, 32, 48 px
// at 1x; 24 px at 2x). Other sizes snap cells to uneven 1/2 px under crispEdges.
// The drawing is shifted by -0.75u (half a cell) before it is rasterised: the
// skeleton's 0.5u-snapped coordinates then never sit on a cell edge (no ties), its centre (12,12) lands on the centre of cell 7, and
// mirror-symmetric icons stay pixel-symmetric about that cell.
import { fmt } from '../kernel/geom.mjs'

export const N = 16, P = 1.5, SHIFT = 0.75
export const grid = () => new Uint8Array(N * N)
export const ix = (i, j) => j * N + i
export const inb = (i, j) => i >= 0 && j >= 0 && i < N && j < N
export const get = (g, i, j) => inb(i, j) ? g[ix(i, j)] : 0
export const count = g => { let n = 0; for (let k = 0; k < g.length; k++) if (g[k]) n++; return n }
export const or = (...gs) => { const o = grid(); for (const g of gs) if (g) for (let k = 0; k < o.length; k++) if (g[k]) o[k] = 1; return o }
export const minus = (a, b) => { const o = grid(); for (let k = 0; k < o.length; k++) o[k] = a[k] && !b[k] ? 1 : 0; return o }
export const and = (a, b) => { const o = grid(); for (let k = 0; k < o.length; k++) o[k] = a[k] && b[k] ? 1 : 0; return o }
export const copy = g => Uint8Array.from(g)

// user units -> cell space (shift = per-axis extra offset in user units, from tuning)
export const toCell = (p, sh = [0, 0]) => [(p[0] - SHIFT + sh[0]) / P, (p[1] - SHIFT + sh[1]) / P]

// the cell containing a cell-space coordinate; on an exact edge, follow the stroke
export const cellOf = (c, bias = 0) => {
  const k = Math.round(c)
  if (Math.abs(c - k) < 1e-7) return bias < 0 ? k - 1 : k
  return Math.floor(c)
}

// ---------------------------------------------------------------------------
// Sharp corners of a polyline (user units): total turning > 50deg within +-0.6u.
// Their cells are pinned so corner thinning never bevels a designed corner.
export function sharpVertices(pts, closed) {
  const n = pts.length, out = new Set()
  if (n < 3) return out
  const seg = [], turn = new Float64Array(n)
  for (let k = 0; k < n; k++) {
    const a = pts[k], b = pts[(k + 1) % n]
    seg.push(Math.hypot(b[0] - a[0], b[1] - a[1]))
  }
  for (let k = 0; k < n; k++) {
    if (!closed && (k === 0 || k === n - 1)) continue
    const a = pts[(k - 1 + n) % n], b = pts[k], c = pts[(k + 1) % n]
    const t1 = Math.atan2(b[1] - a[1], b[0] - a[0]), t2 = Math.atan2(c[1] - b[1], c[0] - b[0])
    let d = t2 - t1
    while (d > Math.PI) d -= 2 * Math.PI
    while (d < -Math.PI) d += 2 * Math.PI
    turn[k] = d
  }
  const W = 0.6, score = new Map()
  for (let k = 0; k < n; k++) {
    if (!turn[k]) continue
    let s = turn[k], L = 0
    for (let m = k - 1; ; m--) {
      if (!closed && m < 0) break
      const mm = (m + n) % n; if (mm === k) break
      L += seg[mm]; if (L > W) break
      s += turn[mm]
    }
    L = 0
    for (let m = k + 1; ; m++) {
      if (!closed && m >= n) break
      const mm = m % n; if (mm === k) break
      L += seg[(m - 1 + n) % n]; if (L > W) break
      s += turn[mm]
    }
    if (Math.abs(s) > 62 * Math.PI / 180 && Math.abs(turn[k]) > 4 * Math.PI / 180) score.set(k, Math.abs(s) + Math.abs(turn[k]) * 0.01)
  }
  // one pin per corner: keep the vertex with the strongest windowed turn in each run
  for (const [k, v] of score) {
    let best = true
    for (const dir of [-1, 1]) {
      let L = 0
      for (let d = 1; d < n && best; d++) {
        const m = closed ? (k + dir * d + n * 4) % n : k + dir * d
        if (m < 0 || m >= n || m === k) break
        L += seg[dir > 0 ? (m - 1 + n) % n : m]
        if (L > 0.8) break
        const w = score.get(m)
        if (w !== undefined && (w > v || (w === v && m < k))) best = false
      }
    }
    if (best) out.add(k)
  }
  return out
}

// ---------------------------------------------------------------------------
// Rasterise a polyline (cell space) into an ordered 8-connected chain of cells.
// x-major stretches emit one cell per column centre, y-major one per row centre
// (a generalised Bresenham on the true curve), then gaps are bridged and
// L-corners removed ("pixel-perfect"), except at pinned sharp corners.
export function chainOf(Q, closed, sharp = new Set()) {
  const out = []
  const emit = (i, j, pin) => {
    const l = out[out.length - 1]
    if (l && l[0] === i && l[1] === j) { if (pin) l[2] = 1; return }
    out.push([i, j, pin ? 1 : 0])
  }
  if (!Q.length) return out
  const S = closed ? [...Q, Q[0]] : Q
  const n = S.length
  let k0 = 1
  while (k0 < n && Math.hypot(S[k0][0] - S[0][0], S[k0][1] - S[0][1]) < 1e-9) k0++
  if (k0 >= n) { emit(cellOf(Q[0][0]), cellOf(Q[0][1]), 1); return out }
  const a0 = S[0], b0 = S[k0]
  emit(cellOf(a0[0], Math.sign(b0[0] - a0[0])), cellOf(a0[1], Math.sign(b0[1] - a0[1])), !closed || sharp.has(0))
  for (let k = 0; k + 1 < n; k++) {
    const a = S[k], b = S[k + 1], dx = b[0] - a[0], dy = b[1] - a[1]
    if (Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9) continue
    const ax = Math.abs(dx), ay = Math.abs(dy)
    if (Math.min(ax, ay) / Math.max(ax, ay) >= 0.8 && ax + ay >= 5) {
      // a near-45deg straight run is drawn as a perfect diagonal staircase, anchored at
      // the end that joins something (a free end may drift by a pixel; a joint may not)
      const sx = Math.sign(dx), sy = Math.sign(dy), m = Math.round((ax + ay) / 2)
      const freeStart = !closed && k === 0 && n > 2
      const run = []
      if (freeStart) {
        const e = [cellOf(b[0], -sx), cellOf(b[1], -sy)]
        for (let t = m; t >= 0; t--) run.push([e[0] - sx * t, e[1] - sy * t])
        out.length = 0 // the free start moves with the run
      } else {
        const st = out[out.length - 1] && k > 0 ? [out[out.length - 1][0], out[out.length - 1][1]] : [cellOf(a[0], sx), cellOf(a[1], sy)]
        for (let t = 0; t <= m; t++) run.push([st[0] + sx * t, st[1] + sy * t])
      }
      for (const [i, j] of run) emit(i, j, 0)
      const vi = (k + 1) % Q.length
      if (sharp.has(vi)) { const l = out[out.length - 1]; l[2] = 1 }
      continue
    }
    if (Math.abs(dx) >= Math.abs(dy)) {
      const s = Math.sign(dx)
      if (s > 0) for (let i = Math.floor(a[0] - 0.5) + 1; i + 0.5 <= b[0]; i++) emit(i, cellOf(a[1] + (i + 0.5 - a[0]) / dx * dy, Math.sign(dy)), 0)
      else for (let i = Math.ceil(a[0] - 0.5) - 1; i + 0.5 >= b[0]; i--) emit(i, cellOf(a[1] + (i + 0.5 - a[0]) / dx * dy, Math.sign(dy)), 0)
    } else {
      const s = Math.sign(dy)
      if (s > 0) for (let j = Math.floor(a[1] - 0.5) + 1; j + 0.5 <= b[1]; j++) emit(cellOf(a[0] + (j + 0.5 - a[1]) / dy * dx, Math.sign(dx)), j, 0)
      else for (let j = Math.ceil(a[1] - 0.5) - 1; j + 0.5 >= b[1]; j--) emit(cellOf(a[0] + (j + 0.5 - a[1]) / dy * dx, Math.sign(dx)), j, 0)
    }
    const vi = (k + 1) % Q.length
    if (sharp.has(vi) && !(closed && k + 1 === n - 1 && false)) emit(cellOf(b[0], -Math.sign(dx)), cellOf(b[1], -Math.sign(dy)), 1)
  }
  if (!closed) {
    let k1 = n - 2
    while (k1 > 0 && Math.hypot(S[k1][0] - S[n - 1][0], S[k1][1] - S[n - 1][1]) < 1e-9) k1--
    const a = S[n - 1], b = S[k1]
    emit(cellOf(a[0], Math.sign(b[0] - a[0])), cellOf(a[1], Math.sign(b[1] - a[1])), 1)
  }
  let c = bridge(out)
  if (closed && c.length > 1 && c[0][0] === c.at(-1)[0] && c[0][1] === c.at(-1)[1]) { c[0][2] |= c.at(-1)[2]; c.pop() }
  c = thin(c, closed)
  if (!closed) {
    const d45 = (a, b) => { const ax = Math.abs(b[0] - a[0]), ay = Math.abs(b[1] - a[1]); return Math.min(ax, ay) / (Math.max(ax, ay) || 1) >= 0.8 }
    c = feet(c, d45(S[0], S[k0]), d45(S[n - 2], S[n - 1]))
  }
  return c
}

// an open line that runs at 45deg must not start or end in an orthogonal "foot"
function feet(c, head = true, tail = true) {
  const st = (p, q) => [q[0] - p[0], q[1] - p[1]]
  const diag = s => Math.abs(s[0]) === 1 && Math.abs(s[1]) === 1
  const same = (s, t) => s[0] === t[0] && s[1] === t[1]
  if (head && c.length >= 4) {
    const s0 = st(c[0], c[1]), s1 = st(c[1], c[2]), s2 = st(c[2], c[3])
    if (!diag(s0) && diag(s1) && same(s1, s2)) c.shift()
  }
  if (tail && c.length >= 4) {
    const L = c.length, s0 = st(c[L - 2], c[L - 1]), s1 = st(c[L - 3], c[L - 2]), s2 = st(c[L - 4], c[L - 3])
    if (!diag(s0) && diag(s1) && same(s1, s2)) c.pop()
  }
  return c
}

// insert Bresenham cells between non-adjacent consecutive cells
function bridge(c) {
  const out = []
  for (let k = 0; k < c.length; k++) {
    const p = out[out.length - 1], q = c[k]
    if (p && Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1])) > 1) {
      let x0 = p[0], y0 = p[1]
      const x1 = q[0], y1 = q[1], dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0)
      const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
      let err = dx + dy
      for (let guard = 0; guard < 64; guard++) {
        const e2 = 2 * err
        if (e2 >= dy) { err += dy; x0 += sx }
        if (e2 <= dx) { err += dx; y0 += sy }
        if (x0 === x1 && y0 === y1) break
        out.push([x0, y0, 0])
      }
    }
    if (p && p[0] === q[0] && p[1] === q[1]) { p[2] |= q[2]; continue }
    out.push(q)
  }
  return out
}

// pixel-perfect: drop the corner cell of every L (its neighbours touch diagonally)
// and collapse immediate backtracks
export function thin(c, closed) {
  for (let pass = 0; pass < 3; pass++) {
    let changed = false
    for (let k = 0; k < c.length && c.length > (closed ? 4 : 2); k++) {
      if (!closed && (k === 0 || k === c.length - 1)) continue
      const L = c.length, p = c[(k - 1 + L) % L], m = c[k], q = c[(k + 1) % L]
      if (p[0] === q[0] && p[1] === q[1] && !m[2]) { // spike: p m p
        c.splice(k, 1)
        const kk = k % c.length, pk = (kk - 1 + c.length) % c.length
        c[pk][2] |= c[kk][2]; c.splice(kk, 1); k = Math.max(-1, k - 2); changed = true; continue
      }
      // a pinned corner that juts out of a straight step (its neighbours touch side by side) is a spur
      if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) === 1) { c.splice(k, 1); k--; changed = true; continue }
      if (m[2]) continue
      if (Math.abs(p[0] - q[0]) === 1 && Math.abs(p[1] - q[1]) === 1) { c.splice(k, 1); k--; changed = true }
    }
    if (!changed) break
  }
  return c
}

// ---------------------------------------------------------------------------
// Area coverage of an even-odd region set (user units), 4x4 samples per cell.
// Scanline: exact even-odd crossings per sample row, no point-in-polygon loops.
export function coverage(set, sh = [0, 0]) {
  const g = new Uint8Array(N * N)
  if (!set || !set.length) return g
  const edges = []
  let y0 = Infinity, y1 = -Infinity
  for (const r of set) {
    if (!r || r.length < 3) continue
    for (let k = 0; k < r.length; k++) {
      const a = toCell(r[k], sh), b = toCell(r[(k + 1) % r.length], sh)
      if (a[1] === b[1]) continue
      edges.push([a, b])
      y0 = Math.min(y0, a[1], b[1]); y1 = Math.max(y1, a[1], b[1])
    }
  }
  if (!edges.length) return g
  for (let j = Math.max(0, Math.floor(y0)); j <= Math.min(N - 1, Math.floor(y1)); j++) {
    for (let sy = 0; sy < 4; sy++) {
      const y = j + (sy + 0.5) / 4
      const xs = []
      for (const [a, b] of edges) if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]))
      xs.sort((p, q) => p - q)
      for (let t = 0; t + 1 < xs.length; t += 2) {
        const xa = xs[t], xb = xs[t + 1]
        // samples at i + (sx + .5)/4 inside [xa, xb)
        const s0 = Math.max(0, Math.ceil((xa - 0.125) * 4)), s1 = Math.min(N * 4 - 1, Math.ceil((xb - 0.125) * 4) - 1)
        for (let s = s0; s <= s1; s++) g[ix(s >> 2, j)]++
      }
    }
  }
  return g
}

// ---------------------------------------------------------------------------
// Grid -> one compact path: boundary edges of the cell union, chained into
// orthogonal loops (outer CW, holes CCW, so nonzero fill renders holes) and
// written as relative h/v runs.
export function gridD(g) {
  // directed edges keyed by start vertex (vx, vy) on the (N+1)^2 lattice
  const M = N + 1, out = new Map()
  const add = (x0, y0, x1, y1) => {
    const k = y0 * M + x0
    if (!out.has(k)) out.set(k, [])
    out.get(k).push([x1, y1])
  }
  const on = (i, j) => inb(i, j) && g[ix(i, j)]
  let total = 0
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    if (!g[ix(i, j)]) continue
    if (!on(i, j - 1)) { add(i, j, i + 1, j); total++ }
    if (!on(i + 1, j)) { add(i + 1, j, i + 1, j + 1); total++ }
    if (!on(i, j + 1)) { add(i + 1, j + 1, i, j + 1); total++ }
    if (!on(i - 1, j)) { add(i, j + 1, i, j); total++ }
  }
  if (!total) return ''
  let d = ''
  const keys = [...out.keys()].sort((a, b) => a - b)
  let cx = 0, cy = 0, first = true
  for (const k0 of keys) {
    while (out.get(k0) && out.get(k0).length) {
      const sx = k0 % M, sy = (k0 - sx) / M
      const loop = [[sx, sy]]
      let x = sx, y = sy, pdx = 0, pdy = 0
      for (let guard = 0; guard < 4 * M * M; guard++) {
        const k = y * M + x, cand = out.get(k)
        if (!cand || !cand.length) break
        // at a pinch vertex prefer turning right (keeps diagonal touches as separate loops)
        let pick = 0
        if (cand.length > 1) {
          let best = -9
          cand.forEach((c, n) => {
            const dx = c[0] - x, dy = c[1] - y
            const cr = pdx * dy - pdy * dx // >0 right turn (y down)
            const sc = cr > 0 ? 2 : cr === 0 ? 1 : 0
            if (sc > best) { best = sc; pick = n }
          })
        }
        const [nx, ny] = cand.splice(pick, 1)[0]
        pdx = nx - x; pdy = ny - y; x = nx; y = ny
        if (x === sx && y === sy) break
        loop.push([x, y])
      }
      // drop collinear vertices
      const L = loop.length, v = []
      for (let n = 0; n < L; n++) {
        const a = loop[(n - 1 + L) % L], b = loop[n], c = loop[(n + 1) % L]
        if ((a[0] === b[0] && b[0] === c[0]) || (a[1] === b[1] && b[1] === c[1])) continue
        v.push(b)
      }
      if (v.length < 4) continue
      d += first ? `M${fmt(v[0][0] * P)} ${fmt(v[0][1] * P)}` : `m${fmt((v[0][0] - cx) * P)} ${fmt((v[0][1] - cy) * P)}`
      first = false
      for (let n = 1; n < v.length; n++) {
        const a = v[n - 1], b = v[n]
        d += a[1] === b[1] ? `h${fmt((b[0] - a[0]) * P)}` : `v${fmt((b[1] - a[1]) * P)}`
      }
      d += 'z'
      cx = v[0][0]; cy = v[0][1]
    }
  }
  return d
}

// ---------------------------------------------------------------------------
// Circles. A centreline that is (part of) a circle is drawn as a canonical
// pixel ring: one octant from the ideal circle, mirrored eight ways, so every
// ring is perfectly symmetric with clean stair steps (4: .XX. / 5, 6 octagon...).

// algebraic least-squares circle fit (Kasa); null when the points are not a circle
export function fitCircle(pts) {
  const n = pts.length
  if (n < 6) return null
  let sx = 0, sy = 0
  for (const p of pts) { sx += p[0]; sy += p[1] }
  const mx = sx / n, my = sy / n
  let suu = 0, svv = 0, suv = 0, suuu = 0, svvv = 0, suvv = 0, svuu = 0
  for (const p of pts) {
    const u = p[0] - mx, v = p[1] - my
    suu += u * u; svv += v * v; suv += u * v
    suuu += u * u * u; svvv += v * v * v; suvv += u * v * v; svuu += v * u * u
  }
  const det = suu * svv - suv * suv
  if (Math.abs(det) < 1e-9) return null
  const b1 = (suuu + suvv) / 2, b2 = (svvv + svuu) / 2
  const uc = (b1 * svv - b2 * suv) / det, vc = (suu * b2 - suv * b1) / det
  const cx = uc + mx, cy = vc + my
  const r = Math.sqrt(uc * uc + vc * vc + (suu + svv) / n)
  if (!isFinite(r) || r < 0.4 || r > 14) return null
  let err = 0
  for (const p of pts) err = Math.max(err, Math.abs(Math.hypot(p[0] - cx, p[1] - cy) - r))
  if (err > 0.03 + 0.02 * r) return null
  return { cx, cy, r }
}

// ring cells (ordered by angle) for outer diameter D cells centred at (cx, cy) in cell space
export function ringCells(cx, cy, D) {
  if (D <= 1) return [[Math.floor(cx), Math.floor(cy)]]
  if (D === 3 && arguments[3]) return [[0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]].map(([a, b]) => [Math.floor(cx + a), Math.floor(cy + b)])
  const half = D % 2 ? 0 : 0.5
  if (D === 2) return [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]].map(([a, b]) => [Math.floor(cx + a), Math.floor(cy + b)])
  const R = D / 2 - 0.5
  const m = new Map()
  for (let dx = half; dx <= D; dx++) {
    const y = Math.sqrt(Math.max(0, R * R - dx * dx))
    const dy = Math.round(y - half) + half
    if (dx > dy + 1e-9) break
    for (const [a, b] of [[dx, dy], [dy, dx]]) for (const sa of [1, -1]) for (const sb of [1, -1]) {
      const i = Math.floor(cx + sa * a), j = Math.floor(cy + sb * b)
      m.set(i * 64 + j, [i, j, Math.atan2(j + 0.5 - cy, i + 0.5 - cx)])
    }
  }
  const c = [...m.values()].sort((p, q) => p[2] - q[2]).map(([i, j]) => [i, j, 0])
  return thin(c, true).map(([i, j]) => [i, j])
}

// snap a circle (user units) to the pixel lattice: outer diameter D and a centre
// on a cell centre (odd D) or a grid line (even D); picks the least distortion
export function snapCircle(c, sh = [0, 0], maxD = 99, minD = 1) {
  const [ux, uy] = toCell([c.cx, c.cy], sh)
  const Dt = 2 * c.r / P + 1
  let best = null
  for (const D of [Math.floor(Dt) - 1, Math.floor(Dt), Math.ceil(Dt), Math.ceil(Dt) + 1, 1, 2]) {
    if (D < minD || D > maxD) continue
    const odd = D % 2 === 1
    const sx = odd ? Math.round(ux - 0.5) + 0.5 : Math.round(ux)
    const sy = odd ? Math.round(uy - 0.5) + 0.5 : Math.round(uy)
    // horizontal shift costs most: nearly every icon is mirror-symmetric about x = 12
    const e = Math.abs(D - Dt) + 3 * Math.abs(sx - ux) + 1.3 * Math.abs(sy - uy)
    if (!best || e < best.e - 1e-9) best = { D, cx: sx, cy: sy, e }
  }
  return best
}

// ---------------------------------------------------------------------------
// Bold diagonals. A one-pixel 45deg staircase (cells touching only at corners)
// is half as heavy as a straight one-pixel line and reads as dots at 24-56px.
// Every 45deg run (two or more diagonal steps in the same direction) is drawn
// with a two-pixel brush: each of its rows holds a horizontal pair, end rows
// included. A run widens toward the drawing's own centre (then the icon centre),
// so arrowheads and chevrons thicken inward; on a tie (a line through the centre)
// it widens toward the centre from both ends, so an X keeps both mirrors.
export function boldDiag(c, closed = false, ref = null, segs = null) {
  const L = c.length
  if (L < 3) return c
  // only runs that follow a straight 45deg stretch of the drawing: curves and
  // rounded corners keep their canonical one-pixel steps
  const onSeg = (x, y) => !segs || segs.some(([a, b]) => {
    const px = x + 0.5 - a[0], py = y + 0.5 - a[1], vx = b[0] - a[0], vy = b[1] - a[1]
    const t = Math.max(0, Math.min(1, (px * vx + py * vy) / (vx * vx + vy * vy)))
    return Math.hypot(px - t * vx, py - t * vy) < 0.8
  })
  const dir = k => { const a = c[k], b = c[(k + 1) % L], dx = b[0] - a[0], dy = b[1] - a[1]; return Math.abs(dx) === 1 && Math.abs(dy) === 1 ? [dx, dy] : null }
  let mx = 0, my = 0
  for (const p of c) { mx += p[0]; my += p[1] }
  const refs = [ref || [mx / L, my / L], [7, 7]]
  const d2 = (x, y, r) => (x - r[0]) ** 2 + (y - r[1]) ** 2
  const steps = closed ? L : L - 1
  const ds = []
  for (let k = 0; k < steps; k++) ds.push(dir(k))
  const same = (p, q) => p && q && p[0] === q[0] && p[1] === q[1]
  // start scanning at a run boundary so closed runs are not split
  let k0 = 0
  if (closed) { while (k0 < steps && same(ds[k0], ds[(k0 - 1 + steps) % steps])) k0++; if (k0 === steps) k0 = 0 }
  const out = c.slice()
  for (let n = 0; n < steps;) {
    const k = (k0 + n) % steps
    if (!ds[k]) { n++; continue }
    let m = 1
    while (n + m < steps && same(ds[(k0 + n + m) % steps], ds[k])) m++
    const cells = []
    for (let t = 0; t <= m; t++) cells.push(c[(k + t) % L])
    if (m >= 2 && cells.filter(([x, y]) => onSeg(x, y)).length * 2 > cells.length) {
      let side = 0
      for (const r of refs) {
        let e = 0
        for (const [x, y] of cells) e += d2(x + 1, y, r) - d2(x - 1, y, r)
        if (Math.abs(e) > 1e-6) { side = e < 0 ? -1 : 1; break }
      }
      if (side) for (const [x, y] of cells) out.push([x + side, y, 2])
      else {
        // a run through the centre widens toward it from both ends (an X keeps both mirrors)
        const r = refs[0]
        for (const [x, y] of cells) {
          const e = d2(x + 1, y, r) - d2(x - 1, y, r)
          if (e < -1e-6) out.push([x + 1, y, 2])
          else if (e > 1e-6) out.push([x - 1, y, 2])
          else out.push([x + 1, y, 2], [x - 1, y, 2])
        }
      }
    }
    n += m
  }
  return out
}
