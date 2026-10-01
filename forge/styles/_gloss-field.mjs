// Scalar-field toolkit for the GLOSS style.
// A fixed sampling grid over the 24u canvas; distance fields to polylines and
// polygons (exact in a thin seed band, then propagated by nearest-point
// dead-reckoning — O(N) and accurate), even-odd scanline masks, a van Herk
// max filter, marching squares, and a compact relative path writer.
import { simplify } from '../kernel/geom.mjs'

export const H = 0.1            // grid pitch in user units
export const X0 = -0.8          // grid origin (x and y)
export const N = 257            // nodes per axis: covers -0.8 .. 24.8
export const NN = N * N
export const gx = i => X0 + i * H

// ---------------------------------------------------------------------------
// polylines -> segment list [ax, ay, bx, by]; long segments split so bounding
// boxes stay tight
export function segsOf(lines) {
  const out = []
  for (const { pts, closed } of lines) {
    const n = pts.length
    if (!n) continue
    const m = closed ? n : n - 1
    for (let s = 0; s < m; s++) {
      const a = pts[s], b = pts[(s + 1) % n]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const k = Math.max(1, Math.ceil(L / 1.2))
      for (let q = 0; q < k; q++) {
        const t0 = q / k, t1 = (q + 1) / k
        out.push([a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0, a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1])
      }
    }
    if (n === 1) out.push([pts[0][0], pts[0][1], pts[0][0], pts[0][1]])
  }
  return out
}

// unsigned distance to a segment list, clamped to band. Exact inside a thin
// seed band, then nearest-point propagation, all restricted to the bbox + band.
const SEED = 0.22
const NX = new Float32Array(NN), NY = new Float32Array(NN), D2 = new Float32Array(NN)
export function distField(segs, band) {
  const f = new Float32Array(NN).fill(band)
  if (!segs.length) return f
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [ax, ay, bx, by] of segs) {
    if (ax < x0) x0 = ax; if (bx < x0) x0 = bx; if (ax > x1) x1 = ax; if (bx > x1) x1 = bx
    if (ay < y0) y0 = ay; if (by < y0) y0 = by; if (ay > y1) y1 = ay; if (by > y1) y1 = by
  }
  const I0 = Math.max(0, Math.floor((x0 - band - X0) / H)), I1 = Math.min(N - 1, Math.ceil((x1 + band - X0) / H))
  const J0 = Math.max(0, Math.floor((y0 - band - X0) / H)), J1 = Math.min(N - 1, Math.ceil((y1 + band - X0) / H))
  if (I0 > I1 || J0 > J1) return f
  for (let j = J0; j <= J1; j++) D2.fill(Infinity, j * N + I0, j * N + I1 + 1)
  const sb = band <= 1.2 ? band : SEED       // small bands: exact brute force, no propagation
  for (const [ax, ay, bx, by] of segs) {
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-12
    const i0 = Math.max(I0, Math.ceil((Math.min(ax, bx) - sb - X0) / H))
    const i1 = Math.min(I1, Math.floor((Math.max(ax, bx) + sb - X0) / H))
    const j0 = Math.max(J0, Math.ceil((Math.min(ay, by) - sb - X0) / H))
    const j1 = Math.min(J1, Math.floor((Math.max(ay, by) + sb - X0) / H))
    for (let j = j0; j <= j1; j++) {
      const py = X0 + j * H - ay
      const row = j * N
      for (let i = i0; i <= i1; i++) {
        const px = X0 + i * H - ax
        let t = (px * dx + py * dy) / L2
        t = t < 0 ? 0 : t > 1 ? 1 : t
        const ex = px - t * dx, ey = py - t * dy
        const d2 = ex * ex + ey * ey
        if (d2 < D2[row + i]) { D2[row + i] = d2; NX[row + i] = ax + t * dx; NY[row + i] = ay + t * dy }
      }
    }
  }
  if (band > sb) propagate(I0, I1, J0, J1)
  for (let j = J0; j <= J1; j++) for (let k = j * N + I0, e = j * N + I1; k <= e; k++) { const d = Math.sqrt(D2[k]); f[k] = d < band ? d : band }
  return f
}
// nearest-point propagation (two raster passes, 8-neighbourhood), inlined for speed
function propagate(I0, I1, J0, J1) {
  const d2a = D2, nxa = NX, nya = NY
  for (let j = J0; j <= J1; j++) {
    const y = X0 + j * H, row = j * N
    for (let i = I0; i <= I1; i++) {
      const k = row + i, x = X0 + i * H
      let dk = d2a[k], bx = nxa[k], by = nya[k]
      if (i > I0) { const qq = k - 1; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
      if (j > J0) {
        { const qq = k - N; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
        if (i > I0) { const qq = k - N - 1; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
        if (i < I1) { const qq = k - N + 1; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
      }
      if (dk < d2a[k]) { d2a[k] = dk; nxa[k] = bx; nya[k] = by }
    }
    for (let i = I1 - 1; i >= I0; i--) {
      const k = row + i, x = X0 + i * H
      let dk = d2a[k], bx = nxa[k], by = nya[k]
      { const qq = k + 1; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
      if (dk < d2a[k]) { d2a[k] = dk; nxa[k] = bx; nya[k] = by }
    }
  }
  for (let j = J1; j >= J0; j--) {
    const y = X0 + j * H, row = j * N
    for (let i = I1; i >= I0; i--) {
      const k = row + i, x = X0 + i * H
      let dk = d2a[k], bx = nxa[k], by = nya[k]
      if (i < I1) { const qq = k + 1; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
      if (j < J1) {
        { const qq = k + N; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
        if (i > I0) { const qq = k + N - 1; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
        if (i < I1) { const qq = k + N + 1; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
      }
      if (dk < d2a[k]) { d2a[k] = dk; nxa[k] = bx; nya[k] = by }
    }
    for (let i = I0 + 1; i <= I1; i++) {
      const k = row + i, x = X0 + i * H
      let dk = d2a[k], bx = nxa[k], by = nya[k]
      { const qq = k - 1; const dq = d2a[qq]; if (dq !== Infinity) { const px = nxa[qq], py = nya[qq], ex = x - px, ey = y - py, e2 = ex * ex + ey * ey; if (e2 < dk) { dk = e2; bx = px; by = py } } }
      if (dk < d2a[k]) { d2a[k] = dk; nxa[k] = bx; nya[k] = by }
    }
  }
}

// even-odd inside mask of a list of rings (all rings share one parity)
export function evenOddMask(rings, out) {
  const m = out || new Uint8Array(NN)
  const rows = Array.from({ length: N }, () => [])
  for (const r of rings) {
    const n = r.length
    if (n < 3) continue
    for (let s = 0; s < n; s++) {
      const [x1, y1] = r[s], [x2, y2] = r[(s + 1) % n]
      if (y1 === y2) continue
      const lo = Math.min(y1, y2), hi = Math.max(y1, y2)
      const j0 = Math.max(0, Math.ceil((lo - X0) / H)), j1 = Math.min(N - 1, Math.ceil((hi - X0) / H) - 1)
      for (let j = j0; j <= j1; j++) {
        const y = X0 + j * H
        if (y < lo || y >= hi) continue
        rows[j].push(x1 + (y - y1) * (x2 - x1) / (y2 - y1))
      }
    }
  }
  const tmp = new Uint8Array(N)
  for (let j = 0; j < N; j++) {
    const xs = rows[j]
    if (!xs.length) continue
    xs.sort((a, b) => a - b)
    tmp.fill(0)
    for (let q = 0; q + 1 < xs.length; q += 2) {
      const i0 = Math.max(0, Math.ceil((xs[q] - X0) / H)), i1 = Math.min(N - 1, Math.ceil((xs[q + 1] - X0) / H) - 1)
      for (let i = i0; i <= i1; i++) tmp[i] = 1
    }
    const row = j * N
    for (let i = 0; i < N; i++) if (tmp[i]) m[row + i] = 1
  }
  return m
}

// separable square max filter of radius r (in nodes), van Herk / Gil-Werman
export function maxFilter(f, r) {
  const w = 2 * r + 1
  const a = new Float32Array(NN), out = new Float32Array(NN)
  const L = N + 2 * r
  const src = new Float32Array(L), g = new Float32Array(L), hh = new Float32Array(L)
  const line = (get, set) => {
    for (let q = 0; q < L; q++) { const i = q - r; src[q] = i < 0 || i >= N ? -Infinity : get(i) }
    for (let q = 0; q < L; q++) g[q] = q % w === 0 ? src[q] : Math.max(g[q - 1], src[q])
    for (let q = L - 1; q >= 0; q--) hh[q] = (q % w === w - 1 || q === L - 1) ? src[q] : Math.max(hh[q + 1], src[q])
    for (let i = 0; i < N; i++) set(i, Math.max(hh[i], g[i + 2 * r]))
  }
  for (let j = 0; j < N; j++) { const row = j * N; line(i => f[row + i], (i, v) => { a[row + i] = v }) }
  for (let i = 0; i < N; i++) line(j => a[j * N + i], (j, v) => { out[j * N + i] = v })
  return out
}

// bilinear sample
export function sample(f, x, y) {
  const u = (x - X0) / H, v = (y - X0) / H
  const i = Math.max(0, Math.min(N - 2, Math.floor(u))), j = Math.max(0, Math.min(N - 2, Math.floor(v)))
  const fu = Math.max(0, Math.min(1, u - i)), fv = Math.max(0, Math.min(1, v - j))
  const k = j * N + i
  return (f[k] * (1 - fu) + f[k + 1] * fu) * (1 - fv) + (f[k + N] * (1 - fu) + f[k + N + 1] * fu) * fv
}

// ---------------------------------------------------------------------------
// marching squares: closed rings of the level set {f > level}
const E = 2 * NN
const adjA = new Int32Array(E).fill(-1), adjB = new Int32Array(E).fill(-1)
const PX = new Float32Array(E), PY = new Float32Array(E)
const IN = new Uint8Array(NN)
export function contours(f, level = 0) {
  const used = []
  for (let k = 0; k < NN; k++) IN[k] = f[k] > level ? 1 : 0
  for (let q = 0; q < N; q++) { IN[q] = 0; IN[NN - N + q] = 0; IN[q * N] = 0; IN[q * N + N - 1] = 0 }   // closed rings only
  const pt = id => {
    if (adjA[id] < 0 && adjB[id] < 0) {
      const k = id >> 1, vert = id & 1, k2 = vert ? k + N : k + 1
      let a = f[k] - level, b = f[k2] - level
      if (!IN[k]) a = Math.min(a, -1e-6)
      if (!IN[k2]) b = Math.min(b, -1e-6)
      const t = a / (a - b)
      const i = k % N, j = (k - i) / N
      PX[id] = X0 + (i + (vert ? 0 : t)) * H
      PY[id] = X0 + (j + (vert ? t : 0)) * H
      used.push(id)
    }
    return id
  }
  const link = (a, b) => {
    pt(a); pt(b)
    if (adjA[a] < 0) adjA[a] = b; else adjB[a] = b
    if (adjA[b] < 0) adjA[b] = a; else adjB[b] = a
  }
  for (let j = 0; j < N - 1; j++) {
    const row = j * N
    for (let i = 0; i < N - 1; i++) {
      const k = row + i
      const code = IN[k] | (IN[k + 1] << 1) | (IN[k + N + 1] << 2) | (IN[k + N] << 3)
      if (code === 0 || code === 15) continue
      const eT = 2 * k, eR = 2 * (k + 1) + 1, eB = 2 * (k + N), eL = 2 * k + 1
      switch (code) {
        case 1: case 14: link(eL, eT); break
        case 2: case 13: link(eT, eR); break
        case 3: case 12: link(eL, eR); break
        case 4: case 11: link(eR, eB); break
        case 6: case 9: link(eT, eB); break
        case 7: case 8: link(eL, eB); break
        case 5: case 10: {
          const cen = (f[k] + f[k + 1] + f[k + N] + f[k + N + 1]) / 4 > level
          if (code === 5 ? cen : !cen) { link(eT, eR); link(eB, eL) }
          else { link(eL, eT); link(eR, eB) }
          break
        }
      }
    }
  }
  const rings = []
  for (const s of used) {
    if (adjA[s] === -2) continue
    const ring = []
    let prev = -1, cur = s
    while (cur >= 0 && adjA[cur] !== -2) {
      ring.push([PX[cur], PY[cur]])
      const nx = adjA[cur] !== prev ? adjA[cur] : adjB[cur]
      adjA[cur] = -2
      prev = cur; cur = nx
    }
    if (ring.length > 2) rings.push(ring)
  }
  for (const s of used) { adjA[s] = -1; adjB[s] = -1 }
  return rings
}

export const ringArea = r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return a / 2 }

// ---------------------------------------------------------------------------
// compact path writer: absolute M, relative l from rounded coordinates, z
const num = v => {
  let s = String(Math.round(v * 100) / 100)
  if (s === '-0') s = '0'
  if (s.startsWith('0.')) s = s.slice(1)
  else if (s.startsWith('-0.')) s = '-' + s.slice(2)
  return s
}
const join = arr => arr.reduce((acc, s) => acc + (acc && !s.startsWith('-') ? ' ' : '') + s, '')
export function ringsToD(rings, tol = 0.035, minArea = 0.015) {
  let d = ''
  for (const r0 of rings) {
    if (Math.abs(ringArea(r0)) < minArea) continue
    const r = simplify(r0, tol, true)
    if (r.length < 3) continue
    const R = r.map(p => [Math.round(p[0] * 100), Math.round(p[1] * 100)])
    let out = 'M' + join([num(R[0][0] / 100), num(R[0][1] / 100)]) + 'l'
    const rel = []
    for (let q = 1; q < R.length; q++) {
      const dx = R[q][0] - R[q - 1][0], dy = R[q][1] - R[q - 1][1]
      if (!dx && !dy) continue
      rel.push(num(dx / 100), num(dy / 100))
    }
    d += out + join(rel) + 'z'
  }
  return d
}
